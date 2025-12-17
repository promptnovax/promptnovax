# Stripe Billing MCP Server

MCP server for Stripe billing operations including customers, subscriptions, and payments.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Set environment variable:
```bash
export STRIPE_API_KEY=sk_test_your_stripe_key_here
```

## Running

```bash
python server.py
```

## Tools

- `stripe_create_customer` - Create a new customer
- `stripe_get_customer` - Get customer by ID
- `stripe_create_subscription` - Create a subscription
- `stripe_cancel_subscription` - Cancel a subscription
- `stripe_create_checkout_session` - Create checkout session
- `stripe_list_invoices` - List customer invoices
- `stripe_create_payment_intent` - Create payment intent
- `stripe_list_products` - List products

## Port

This server runs on port **9004**.

