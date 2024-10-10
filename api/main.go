package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"sync"
)

type Story struct {
	By    string `json:"by"`
	ID    int    `json:"id"`
	Time  int    `json:"time"`
	Title string `json:"title"`
	Type  string `json:"type"`
	URL   string `json:"url"`
}

func getStoriesIDs() ([]int, error) {
	res, err := http.Get("https://hacker-news.firebaseio.com/v0/jobstories.json")
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()

	var storiesIDs []int
	if err = json.NewDecoder(res.Body).Decode(&storiesIDs); err != nil {
		return nil, err
	}

	return storiesIDs, nil
}

func getStory(id int) (Story, error) {
	res, err := http.Get(fmt.Sprintf("https://hacker-news.firebaseio.com/v0/item/%d.json", id))
	if err != nil {
		return Story{}, err
	}
	defer res.Body.Close()

	var story Story
	if err = json.NewDecoder(res.Body).Decode(&story); err != nil {
		return Story{}, err
	}

	return story, nil
}

func getStories(storiesIDs []int) ([]Story, error) {
	var wg sync.WaitGroup
	stories := make([]Story, len(storiesIDs))

	for i, id := range storiesIDs {
		wg.Add(1)

		go func(i, id int) {
			defer wg.Done()

			story, err := getStory(id)
			if err != nil {
				log.Fatalln(err)
				return
			}

			if story.Type == "job" {
				stories[i] = story
			}
		}(i, id)
	}

	wg.Wait()

	return stories, nil
}

func handler(w http.ResponseWriter, r *http.Request) {
	storiesIDs, err := getStoriesIDs()
	if err != nil {
		log.Fatalln(err)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Internal Server Error"))
		return
	}

	stories, err := getStories(storiesIDs)
	if err != nil {
		log.Fatalln(err)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Internal Server Error"))
		return
	}

	bytes, err := json.Marshal(stories)
	if err != nil {
		log.Fatalln(err)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Internal Server Error"))
		return
	}

	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(http.StatusOK)
	w.Write(bytes)
}

func main() {
	http.HandleFunc("/", handler)
	log.Fatalln(http.ListenAndServe(":8080", nil))
}
