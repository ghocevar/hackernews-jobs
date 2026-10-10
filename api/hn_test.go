package main

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strconv"
	"strings"
	"testing"
)

func TestJobStoriesPreservesOrderAndText(t *testing.T) {
	client := newFixtureClient(t, map[int]Story{
		3: {By: "ada", ID: 3, Time: 1700000000, Title: "With URL", Type: "job", URL: "https://example.com/jobs"},
		2: {By: "bea", ID: 2, Time: 1700000100, Title: "Text only", Type: "job", Text: "<p>Come work with us</p>"},
		1: {By: "cy", ID: 1, Time: 1700000200, Title: "Not a job", Type: "story", URL: "https://example.com/nope"},
	}, []int{3, 2, 1})

	stories, err := client.JobStories(t.Context())
	if err != nil {
		t.Fatalf("JobStories: %v", err)
	}
	if len(stories) != 2 {
		t.Fatalf("len(stories) = %d, want 2", len(stories))
	}
	if stories[0].ID != 3 || stories[0].URL != "https://example.com/jobs" {
		t.Fatalf("first story = %+v", stories[0])
	}
	if stories[1].ID != 2 || stories[1].Text == "" || stories[1].URL != "" {
		t.Fatalf("second story = %+v", stories[1])
	}
}

func TestJobStoriesSkipsFailedItems(t *testing.T) {
	client := newFixtureClient(t, map[int]Story{
		10: {By: "ada", ID: 10, Time: 1700000000, Title: "Kept", Type: "job"},
	}, []int{10, 11})

	stories, err := client.JobStories(t.Context())
	if err != nil {
		t.Fatalf("JobStories: %v", err)
	}
	if len(stories) != 1 || stories[0].Title != "Kept" {
		t.Fatalf("stories = %+v", stories)
	}
}

func TestJobStoriesErrorsWhenNothingLoads(t *testing.T) {
	client := newFixtureClient(t, map[int]Story{}, []int{10, 11})

	if _, err := client.JobStories(t.Context()); err == nil {
		t.Fatal("expected error when every item fails")
	}
}

func TestHandlerUpstreamFailureStaysUp(t *testing.T) {
	upstream := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		http.Error(w, "nope", http.StatusInternalServerError)
	}))
	t.Cleanup(upstream.Close)

	handler := NewHandler(&Client{BaseURL: upstream.URL, HTTP: upstream.Client()})
	req := httptest.NewRequest(http.MethodGet, "/", nil)
	rec := httptest.NewRecorder()
	handler.ServeHTTP(rec, req)

	if rec.Code != http.StatusBadGateway {
		t.Fatalf("status = %d, want 502", rec.Code)
	}
	if strings.Contains(rec.Body.String(), "nope") {
		t.Fatalf("upstream body leaked: %s", rec.Body.String())
	}
}

func TestHandlerReturnsStories(t *testing.T) {
	client := newFixtureClient(t, map[int]Story{
		7: {By: "ada", ID: 7, Time: 1700000000, Title: "Hiring", Type: "job", Text: "hello"},
	}, []int{7})
	handler := NewHandler(client)

	req := httptest.NewRequest(http.MethodGet, "/", nil)
	rec := httptest.NewRecorder()
	handler.ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("status = %d, body %s", rec.Code, rec.Body.String())
	}
	if got := rec.Header().Get("Content-Type"); !strings.Contains(got, "application/json") {
		t.Fatalf("content-type = %s", got)
	}
	if got := rec.Header().Get("Access-Control-Allow-Origin"); got != "*" {
		t.Fatalf("cors = %s", got)
	}

	var stories []Story
	if err := json.Unmarshal(rec.Body.Bytes(), &stories); err != nil {
		t.Fatalf("json: %v", err)
	}
	if len(stories) != 1 || stories[0].Title != "Hiring" || stories[0].Text != "hello" {
		t.Fatalf("stories = %+v", stories)
	}
}

func TestHandlerRejectsUnsupportedMethods(t *testing.T) {
	handler := NewHandler(NewClient())
	req := httptest.NewRequest(http.MethodPost, "/", nil)
	rec := httptest.NewRecorder()
	handler.ServeHTTP(rec, req)

	if rec.Code != http.StatusMethodNotAllowed {
		t.Fatalf("status = %d", rec.Code)
	}
}

func newFixtureClient(t *testing.T, items map[int]Story, ids []int) *Client {
	t.Helper()

	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		switch {
		case r.URL.Path == "/v0/jobstories.json":
			_ = json.NewEncoder(w).Encode(ids)
		case strings.HasPrefix(r.URL.Path, "/v0/item/") && strings.HasSuffix(r.URL.Path, ".json"):
			raw := strings.TrimSuffix(strings.TrimPrefix(r.URL.Path, "/v0/item/"), ".json")
			id, err := strconv.Atoi(raw)
			if err != nil {
				http.NotFound(w, r)
				return
			}
			item, found := items[id]
			if !found {
				http.Error(w, "missing", http.StatusInternalServerError)
				return
			}
			_ = json.NewEncoder(w).Encode(item)
		default:
			http.NotFound(w, r)
		}
	}))
	t.Cleanup(server.Close)

	return &Client{
		BaseURL:    server.URL,
		HTTP:       server.Client(),
		MaxWorkers: 2,
	}
}
