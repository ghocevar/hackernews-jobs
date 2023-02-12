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
resource "google_cloud_run_service_iam_member" "noauth" {
  service  = google_cloud_run_service.main.name
  location = google_cloud_run_service.main.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}