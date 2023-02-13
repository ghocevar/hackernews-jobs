provider "google" {
  credentials = var.gcp_credentials

  project = var.project_id
  region  = "europe-west8"
  zone    = "europe-west8-a"
}

provider "google-beta" {
  credentials = var.gcp_credentials

  project = var.project_id
  region  = "europe-west8"
  zone    = "europe-west8-a"
}