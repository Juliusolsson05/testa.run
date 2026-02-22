# ── Paste these into your app's .env ──

output "starter_product_id" {
  value       = stripe_product.starter.id
  description = "Stripe product ID for Starter plan"
}

output "pro_product_id" {
  value       = stripe_product.pro.id
  description = "Stripe product ID for Pro plan"
}

output "starter_monthly_price_id" {
  value       = stripe_price.starter_monthly.id
  description = "Stripe price ID for Starter monthly ($0)"
}

output "pro_monthly_price_id" {
  value       = stripe_price.pro_monthly.id
  description = "Stripe price ID for Pro monthly ($29)"
}

output "pro_annual_price_id" {
  value       = stripe_price.pro_annual.id
  description = "Stripe price ID for Pro annual ($290)"
}

output "webhook_endpoint_id" {
  value       = stripe_webhook_endpoint.main.id
  description = "Stripe webhook endpoint ID"
}

output "webhook_secret" {
  value       = stripe_webhook_endpoint.main.secret
  description = "Webhook signing secret — use as STRIPE_WEBHOOK_SECRET"
  sensitive   = true
}

output "portal_configuration_id" {
  value       = stripe_portal_configuration.default.id
  description = "Customer portal config ID — use as STRIPE_PORTAL_CONFIG_ID"
}
