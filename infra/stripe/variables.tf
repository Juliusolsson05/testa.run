variable "stripe_api_key" {
  description = "Stripe secret API key (sk_test_... or sk_live_...)"
  type        = string
  sensitive   = true
}

variable "webhook_url" {
  description = "URL that receives Stripe webhook events (e.g. https://app.testa.run/api/stripe/webhook)"
  type        = string
  default     = "https://app.testa.run/api/stripe/webhook"
}

variable "portal_return_url" {
  description = "URL users return to after managing billing in Stripe portal"
  type        = string
  default     = "https://app.testa.run/settings/billing"
}
