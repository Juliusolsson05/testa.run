terraform {
  required_version = ">= 1.5"

  required_providers {
    stripe = {
      source  = "lukasaron/stripe"
      version = "~> 2.0"
    }
  }
}

provider "stripe" {
  api_key = var.stripe_api_key
}

# ────────────────────────────────────────────────────────────
# Products
# ────────────────────────────────────────────────────────────

resource "stripe_product" "starter" {
  name        = "testa.run Starter"
  description = "Free tier — 5 runs/month, 1 journey, basic report."
  active      = true

  metadata = {
    plan = "starter"
  }
}

resource "stripe_product" "pro" {
  name        = "testa.run Pro"
  description = "Unlimited runs, 10 journeys, security scanning, evidence reports, priority support."
  active      = true

  metadata = {
    plan = "pro"
  }
}

# ────────────────────────────────────────────────────────────
# Prices
# ────────────────────────────────────────────────────────────

resource "stripe_price" "starter_monthly" {
  product     = stripe_product.starter.id
  currency    = "usd"
  unit_amount = 0

  recurring {
    interval       = "month"
    interval_count = 1
  }

  metadata = {
    plan  = "starter"
    cycle = "monthly"
  }
}

resource "stripe_price" "pro_monthly" {
  product     = stripe_product.pro.id
  currency    = "usd"
  unit_amount = 4900 # $49.00

  recurring {
    interval       = "month"
    interval_count = 1
  }

  metadata = {
    plan  = "pro"
    cycle = "monthly"
  }
}

resource "stripe_price" "pro_annual" {
  product     = stripe_product.pro.id
  currency    = "usd"
  unit_amount = 47000 # $470.00/yr (~$39/mo, 2 months free)

  recurring {
    interval       = "year"
    interval_count = 1
  }

  metadata = {
    plan  = "pro"
    cycle = "annual"
  }
}

# ────────────────────────────────────────────────────────────
# Webhook endpoint
# ────────────────────────────────────────────────────────────

resource "stripe_webhook_endpoint" "main" {
  url = var.webhook_url

  enabled_events = [
    "checkout.session.completed",
    "customer.subscription.created",
    "customer.subscription.updated",
    "customer.subscription.deleted",
    "invoice.paid",
    "invoice.payment_failed",
  ]

  description = "testa.run production webhook"

  metadata = {
    managed_by = "terraform"
  }
}

# ────────────────────────────────────────────────────────────
# Customer portal
# ────────────────────────────────────────────────────────────

resource "stripe_portal_configuration" "default" {
  business_profile {
    headline = "Manage your testa.run subscription"
  }

  features {
    subscription_cancel {
      enabled = true
      mode    = "at_period_end"
    }

    subscription_update {
      enabled                = true
      default_allowed_updates = ["price"]
      proration_behavior     = "create_prorations"

      products {
        product = stripe_product.pro.id
        prices  = [
          stripe_price.pro_monthly.id,
          stripe_price.pro_annual.id,
        ]
      }
    }

    payment_method_update {
      enabled = true
    }

    invoice_history {
      enabled = true
    }
  }

  default_return_url = var.portal_return_url
}
