# Stripe Infrastructure

Manages Stripe products, prices, webhooks, and customer portal via Terraform.

## Setup

```bash
cd infra/stripe
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your Stripe secret key

terraform init
terraform plan
terraform apply
```

## After apply

Grab the outputs and add them to your app `.env`:

```bash
terraform output -json
```

Key values:
- `pro_monthly_price_id` → `STRIPE_PRO_MONTHLY_PRICE_ID`
- `pro_annual_price_id` → `STRIPE_PRO_ANNUAL_PRICE_ID`
- `webhook_secret` → `STRIPE_WEBHOOK_SECRET`
- `portal_configuration_id` → `STRIPE_PORTAL_CONFIG_ID`

## What it creates

| Resource | Description |
|----------|-------------|
| Product: Starter | Free tier |
| Product: Pro | $49/mo paid tier |
| Price: Starter monthly | $0/mo |
| Price: Pro monthly | $49/mo |
| Price: Pro annual | $470/yr (~$39/mo) |
| Webhook endpoint | Listens for subscription lifecycle events |
| Customer portal | Self-service plan changes, cancellation, payment updates |

## Destroying

```bash
terraform destroy
```

This deactivates Stripe resources — it does not delete customer data.
