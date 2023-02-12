resource "google_artifact_registry_repository" "repository" {
  location      = "europe-west8"
  repository_id = "hackernews-jobs-repository"
  description   = "Artifact Registry repository for hackernews-jobs project"
  format        = "DOCKER"
}

resource "google_project_service" "run_api" {
  service = "run.googleapis.com"

  disable_on_destroy = true
}

resource "google_cloud_run_service" "main" {
  name     = "hackernews-jobs-api-main"
  location = "europe-west8"

  template {
    spec {
      containers {
        image = "us-docker.pkg.dev/cloudrun/container/hello"
      }
    }
  }

  depends_on = [google_project_service.run_api]
}

data "google_iam_policy" "noauth" {
  binding {
    role = "roles/run.invoker"
    members = [
      "allUsers",
    ]
  }
}

resource "google_cloud_run_service_iam_member" "run_all_users" {
  service  = google_cloud_run_service.run_service.name
  location = google_cloud_run_service.run_service.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}