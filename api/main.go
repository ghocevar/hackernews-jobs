package main

import (
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"time"
)

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

		stories, err := client.JobStories(r.Context())
		if err != nil {
			log.Printf("job stories: %v", err)
			writeError(w, http.StatusBadGateway, "unable to load job stories")
			return
		}

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

func main() {
	server := &http.Server{
		Addr:              ":8080",
		Handler:           NewHandler(NewClient()),
		ReadHeaderTimeout: 5 * time.Second,
	}

	log.Printf("jobs API listening on %s", server.Addr)
	if err := server.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
		log.Fatal(err)
	}
}
