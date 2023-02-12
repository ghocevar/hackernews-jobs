resource "google_artifact_registry_repository" "repository" {
  location      = "europe-west8"
  repository_id = "hackernews-jobs-repository"
  description   = "Artifact Registry repository for hackernews-jobs project"
  format        = "DOCKER"
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
  location    = google_cloud_run_service.main.location
  project     = google_cloud_run_service.main.project
  service     = google_cloud_run_service.main.name

  policy_data = data.google_iam_policy.noauth.policy_data
}