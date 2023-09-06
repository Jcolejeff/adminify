terraform {
  cloud {
    organization = "EverydayMoney"
    workspaces {
      name = "EM-Checkout"
    }
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
    acme = {
      source = "vancluever/acme"
      version = "2.10.0"
    }
  }
}

data "aws_caller_identity" "current" {}

data "aws_partition" "current" {}

provider "aws" {
  region = var.region
}

resource "aws_s3_bucket" "checkout_staging_bucket" {
  bucket = "em-checkout-staging"

  tags = {
    Name = "devops"
  }
}

resource "aws_s3_bucket" "checkout_prod_bucket" {
  bucket = "em-checkout-prod"

  tags = {
    Name = "devops"
  }
}