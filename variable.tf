variable "region" {
  default = "eu-central-1"
}

# SSL
variable "frontend_domain" {
  default = "checkout.everydaymoney.app"
}

variable "acme_registration_email" {
  default = "contact@everydaymoney.ng"
}

variable "acme_server_url" {
  default = "https://acme-v02.api.letsencrypt.org/directory"
}

variable "domain_r53_host_id" {
  default = "Z04391852VABOX9VZIIFZ"
}