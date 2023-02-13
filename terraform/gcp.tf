resource "google_artifact_registry_repository" "repository" {
  location      = "europe-west8"
  repository_id = "hackernews-jobs-repository"
  description   = "Artifact Registry repository for hackernews-jobs project"
  format        = "DOCKER"
}

resource "google_cloud_run_service" "main" {
  name     = "hackernews-jobs-api-main"
  location = "europe-west8"

  metadata {
    annotations = {
      "run.googleapis.com/launch-stage" = "BETA"
    }
  }

  template {
    spec {
      containers {
        image = "europe-west8-docker.pkg.dev/hackernews-jobs/hackernews-jobs-repository/main.go-7ddfb3e035b42cd70649cc33393fe32c@sha256:fc07d1be4b49e3544fb93baaa6d437f228a154178d75f6a692c46b9ffac3c60d"
      
        startup_probe {
          initial_delay_seconds = 0
          timeout_seconds = 1
          period_seconds = 3
          failure_threshold = 1
          tcp_socket {
            port = 8080
          }
        }

        liveness_probe {
          http_get {
            path = "/"
          }
        }
      }
    }
  }
}

data "google_iam_policy" "noauth" {
  binding {
    role = "roles/run.invoker"
    members = [
      "allUsers",
    ]
  }
}

resource "google_cloud_run_service_iam_policy" "noauth" {
  location = google_cloud_run_service.main.location
  project  = google_cloud_run_service.main.project
  service  = google_cloud_run_service.main.name

  policy_data = data.google_iam_policy.noauth.policy_data
}