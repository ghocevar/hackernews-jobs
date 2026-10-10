package main

import (
	"errors"
	"log"
	"net/http"
	"time"

	"github.com/ghocevar/hackernews-jobs/hn"
)

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/api/stories", hn.Handler)

	server := &http.Server{
		Addr:              ":8080",
		Handler:           mux,
		ReadHeaderTimeout: 5 * time.Second,
	}

	log.Printf("jobs API listening on %s", server.Addr)
	if err := server.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
		log.Fatal(err)
	}
}
