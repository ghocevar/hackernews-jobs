package hn

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"sync"
	"time"
)

const (
	defaultBaseURL   = "https://hacker-news.firebaseio.com"
	defaultWorkers   = 32
	maxResponseBytes = 4 << 20
	defaultCacheTTL  = 5 * time.Minute
	userAgent        = "hackernews-jobs (+https://github.com/ghocevar/hackernews-jobs)"
)

// Story is one official Hacker News job story.
type Story struct {
	By    string `json:"by"`
	ID    int    `json:"id"`
	Time  int    `json:"time"`
	Title string `json:"title"`
	Type  string `json:"type"`
	URL   string `json:"url,omitempty"`
	Text  string `json:"text,omitempty"`
}

// Client loads job stories from the Hacker News Firebase API.
// A positive CacheTTL keeps the assembled list in memory so a request does
// not repeat the per-item reads. A negative CacheTTL disables that cache.
type Client struct {
	BaseURL    string
	HTTP       *http.Client
	MaxWorkers int
	CacheTTL   time.Duration

	mu          sync.Mutex
	cached      []Story
	cachedUntil time.Time
	loading     chan struct{}
}

func NewClient() *Client {
	return &Client{
		BaseURL: defaultBaseURL,
		HTTP: &http.Client{
			Timeout: 20 * time.Second,
		},
		MaxWorkers: defaultWorkers,
		CacheTTL:   defaultCacheTTL,
	}
}

func (c *Client) workers() int {
	if c.MaxWorkers < 1 {
		return defaultWorkers
	}
	return c.MaxWorkers
}

func (c *Client) httpClient() *http.Client {
	if c.HTTP != nil {
		return c.HTTP
	}
	return http.DefaultClient
}

// JobStories returns the current official job stories in Firebase order.
// Items that fail to load are omitted. A failure to load the id list, or a
// list whose items all fail, is returned as an error.
// Repeated calls within CacheTTL share one upstream load.
func (c *Client) JobStories(ctx context.Context) ([]Story, error) {
	if stories, ok := c.fromCache(); ok {
		return stories, nil
	}

	c.mu.Lock()
	if stories, ok := c.fromCacheLocked(); ok {
		c.mu.Unlock()
		return stories, nil
	}
	if c.loading != nil {
		wait := c.loading
		c.mu.Unlock()
		select {
		case <-wait:
		case <-ctx.Done():
			return nil, ctx.Err()
		}
		return c.JobStories(ctx)
	}
	wait := make(chan struct{})
	c.loading = wait
	c.mu.Unlock()

	stories, err := c.loadJobStories(ctx)

	c.mu.Lock()
	if err == nil && c.ttl() > 0 {
		c.cached = cloneStories(stories)
		c.cachedUntil = time.Now().Add(c.ttl())
	}
	c.loading = nil
	close(wait)
	c.mu.Unlock()

	if err != nil {
		return nil, err
	}
	return cloneStories(stories), nil
}

func (c *Client) ttl() time.Duration {
	if c.CacheTTL < 0 {
		return 0
	}
	if c.CacheTTL == 0 {
		return defaultCacheTTL
	}
	return c.CacheTTL
}

func (c *Client) fromCache() ([]Story, bool) {
	c.mu.Lock()
	defer c.mu.Unlock()
	return c.fromCacheLocked()
}

func (c *Client) fromCacheLocked() ([]Story, bool) {
	if c.ttl() == 0 || time.Now().After(c.cachedUntil) || c.cached == nil {
		return nil, false
	}
	return cloneStories(c.cached), true
}

func cloneStories(in []Story) []Story {
	out := make([]Story, len(in))
	copy(out, in)
	return out
}

func (c *Client) loadJobStories(ctx context.Context) ([]Story, error) {
	ids, err := c.storyIDs(ctx)
	if err != nil {
		return nil, err
	}

	stories := make([]Story, len(ids))
	ok := make([]bool, len(ids))
	sem := make(chan struct{}, c.workers())
	var wg sync.WaitGroup

	for i, id := range ids {
		wg.Add(1)
		go func(i, id int) {
			defer wg.Done()

			select {
			case sem <- struct{}{}:
				defer func() { <-sem }()
			case <-ctx.Done():
				return
			}

			story, err := c.story(ctx, id)
			if err != nil || story.Type != "job" || story.ID == 0 || story.Title == "" {
				return
			}
			stories[i] = story
			ok[i] = true
		}(i, id)
	}

	wg.Wait()
	if err := ctx.Err(); err != nil {
		return nil, err
	}

	out := make([]Story, 0, len(ids))
	for i := range stories {
		if ok[i] {
			out = append(out, stories[i])
		}
	}
	if len(ids) > 0 && len(out) == 0 {
		return nil, fmt.Errorf("hacker news returned %d job ids but none could be loaded", len(ids))
	}
	return out, nil
}

func (c *Client) storyIDs(ctx context.Context) ([]int, error) {
	var ids []int
	if err := c.getJSON(ctx, "v0/jobstories.json", &ids); err != nil {
		return nil, err
	}
	if ids == nil {
		return []int{}, nil
	}
	return ids, nil
}

func (c *Client) story(ctx context.Context, id int) (Story, error) {
	var story Story
	path := fmt.Sprintf("v0/item/%d.json", id)
	if err := c.getJSON(ctx, path, &story); err != nil {
		return Story{}, err
	}
	return story, nil
}

func (c *Client) getJSON(ctx context.Context, path string, dest any) error {
	endpoint, err := url.JoinPath(c.BaseURL, path)
	if err != nil {
		return err
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, endpoint, nil)
	if err != nil {
		return err
	}
	req.Header.Set("Accept", "application/json")
	req.Header.Set("User-Agent", userAgent)

	res, err := c.httpClient().Do(req)
	if err != nil {
		return err
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		return fmt.Errorf("hacker news %s: %s", path, res.Status)
	}

	decoder := json.NewDecoder(io.LimitReader(res.Body, maxResponseBytes))
	if err := decoder.Decode(dest); err != nil {
		return fmt.Errorf("hacker news %s: %w", path, err)
	}
	return nil
}

var sharedClient = NewClient()

// Handler serves GET /api/stories for the local server and the Vercel function.
func Handler(w http.ResponseWriter, r *http.Request) {
	NewHandler(sharedClient).ServeHTTP(w, r)
}

func NewHandler(client *Client) http.Handler {
	if client == nil {
		client = NewClient()
	}

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		if r.Method != http.MethodGet {
			writeError(w, http.StatusMethodNotAllowed, "method not allowed")
			return
		}

		started := time.Now()
		stories, err := client.JobStories(r.Context())
		if err != nil {
			log.Printf("job stories: %v", err)
			writeError(w, http.StatusBadGateway, "unable to load job stories")
			return
		}

		w.Header().Set("Cache-Control", "public, s-maxage=300, stale-while-revalidate=3600")
		w.Header().Set("Server-Timing", fmt.Sprintf("app;dur=%.1f", time.Since(started).Seconds()*1000))
		writeJSON(w, http.StatusOK, stories)
	})
}

func writeJSON(w http.ResponseWriter, status int, body any) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(status)
	if err := json.NewEncoder(w).Encode(body); err != nil {
		log.Printf("write response: %v", err)
	}
}

func writeError(w http.ResponseWriter, status int, message string) {
	writeJSON(w, status, map[string]string{"error": message})
}
