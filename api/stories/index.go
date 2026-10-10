// Package handler is the Vercel Go function for /api/stories.
// Vercel routes api/stories/index.go to that path and calls Handler.
package handler

import (
	"net/http"

	"github.com/ghocevar/hackernews-jobs/hn"
)

func Handler(w http.ResponseWriter, r *http.Request) {
	hn.Handler(w, r)
}
