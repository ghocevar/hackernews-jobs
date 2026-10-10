package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"sync"
	"time"
)

const (
	defaultBaseURL   = "https://hacker-news.firebaseio.com"
	defaultWorkers   = 8
	maxResponseBytes = 4 << 20
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
type Client struct {
	BaseURL    string
	HTTP       *http.Client
	MaxWorkers int
}

func NewClient() *Client {
	return &Client{
		BaseURL: defaultBaseURL,
		HTTP: &http.Client{
			Timeout: 20 * time.Second,
		},
		MaxWorkers: defaultWorkers,
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
func (c *Client) JobStories(ctx context.Context) ([]Story, error) {
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
