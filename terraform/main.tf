terraform {
  cloud {
    organization = "ghocevar"

    workspaces {
      name = "hackernews-jobs"
    }
  }

  required_providers {
    google = {
      source = "hashicorp/google"
      version   = "~> 4.0"
    }
  }
}