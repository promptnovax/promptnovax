# API Keys Setup Guide

This guide explains how to obtain and configure API keys for different AI providers in the Seller Dashboard.

## Overview

The Seller Dashboard supports multiple AI providers for testing prompts. Each provider requires an API key that you can obtain from their respective platforms.

## Supported Providers

### 1. OpenAI
**Best for:** GPT-4, GPT-3.5, DALL-E, Whisper

**How to get API key:**
1. Visit [OpenAI Platform](https://platform.openai.com)
2. Sign up or log in to your account
3. Navigate to [API Keys](https://platform.openai.com/api-keys)
4. Click "Create new secret key"
5. Copy the key (starts with `sk-`)
6. **Important:** Save it immediately - you won't be able to see it again

**Pricing:** Pay-per-use, varies by model
- GPT-4 Turbo: ~$0.01 per 1K tokens
- GPT-3.5 Turbo: ~$0.0015 per 1K tokens
- DALL-E 3: $0.04 per image

**Free tier:** $5 credit for new users

---

### 2. Anthropic (Claude)
**Best for:** Claude 3 Opus, Sonnet, Haiku - excellent reasoning

**How to get API key:**
1. Visit [Anthropic Console](https://console.anthropic.com)
2. Sign up or log in
3. Go to [API Keys](https://console.anthropic.com/settings/keys)
4. Click "Create Key"
5. Copy the key (starts with `sk-ant-`)

**Pricing:** Pay-per-use
- Claude 3 Opus: ~$0.015 per 1K tokens
- Claude 3 Sonnet: ~$0.003 per 1K tokens
- Claude 3 Haiku: ~$0.00025 per 1K tokens

**Free tier:** Limited credits for new users

---

### 3. OpenRouter
**Best for:** Unified access to 100+ models from multiple providers

**How to get API key:**
1. Visit [OpenRouter](https://openrouter.ai)
2. Sign up or log in
3. Go to [Keys](https://openrouter.ai/keys)
4. Click "Create Key"
5. Copy the key (starts with `sk-or-`)

**Pricing:** Aggregated pricing across providers
- Typically 10-20% markup on base provider prices
- Pay-per-use model

**Free tier:** Limited credits available

**Advantages:**
- Access to multiple models with one key
- Automatic fallback between providers
- Unified API interface

---

### 4. Hugging Face
**Best for:** Open-source models, free tier available

**How to get API key:**
1. Visit [Hugging Face](https://huggingface.co)
2. Sign up or log in
3. Go to [Settings > Access Tokens](https://huggingface.co/settings/tokens)
4. Click "New token"
5. Select "Read" or "Write" permissions
6. Copy the token

**Pricing:** 
- Free tier: Limited requests
- Pro: $9/month for more requests
- Pay-per-use for Inference API

**Models available:**
- Llama 2, Mistral, Stable Diffusion, and many more

---

### 5. Mistral AI
**Best for:** Mistral 7B, Mixtral 8x7B models

**How to get API key:**
1. Visit [Mistral AI Console](https://console.mistral.ai)
2. Sign up or log in
3. Navigate to [API Keys](https://console.mistral.ai/api-keys/)
4. Click "Create API Key"
5. Copy the key

**Pricing:** Pay-per-use
- Mistral Large: ~$0.007 per 1K tokens
- Mistral Medium: ~$0.002 per 1K tokens
- Mistral Small: ~$0.0002 per 1K tokens

---

### 6. Google AI (Gemini)
**Best for:** Gemini Pro, PaLM 2 - generous free tier

**How to get API key:**
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with Google account
3. Click "Create API Key"
4. Copy the key

**Pricing:**
- Free tier: 60 requests per minute
- Paid: Very affordable pricing

**Models:**
- Gemini Pro
- Gemini Pro Vision
- PaLM 2

---

### 7. Cohere
**Best for:** Command, Embed, Classify models

**How to get API key:**
1. Visit [Cohere Dashboard](https://dashboard.cohere.com)
2. Sign up or log in
3. Go to [API Keys](https://dashboard.cohere.com/api-keys)
4. Copy your API key

**Pricing:** Pay-per-use
- Command: ~$0.01 per 1K tokens
- Embed: ~$0.0001 per 1K tokens

---

### 8. Stability AI
**Best for:** Stable Diffusion image generation

**How to get API key:**
1. Visit [Stability AI Platform](https://platform.stability.ai)
2. Sign up or log in
3. Go to [Account > API Keys](https://platform.stability.ai/account/keys)
4. Click "Generate API Key"
5. Copy the key

**Pricing:**
- Per image: ~$0.02
- Subscription plans available

---

### 9. Midjourney
**Best for:** High-quality AI image generation

**How to get API key:**
1. Visit [Midjourney](https://www.midjourney.com)
2. Subscribe to a plan
3. Access API through your account dashboard
4. Generate API key

**Pricing:**
- Subscription-based
- ~$0.05 per image (varies by plan)

**Note:** Midjourney API access requires active subscription

---

### 10. Replicate
**Best for:** Running open-source models

**How to get API key:**
1. Visit [Replicate](https://replicate.com)
2. Sign up or log in
3. Go to [Account > API Tokens](https://replicate.com/account/api-tokens)
4. Copy your token

**Pricing:**
- Pay-per-second of compute
- Varies by model and hardware

---

## Security Best Practices

1. **Never share your API keys** - They provide full access to your account
2. **Use separate keys for testing** - Don't use production keys in the dashboard
3. **Rotate keys regularly** - Generate new keys and revoke old ones periodically
4. **Set usage limits** - Most providers allow you to set spending limits
5. **Monitor usage** - Regularly check your API usage and costs

## Adding Keys to Seller Dashboard

1. Navigate to **Seller Dashboard > Integrations**
2. Browse available providers
3. Click **"Connect"** on a provider
4. Paste your API key
5. Optionally add a label (e.g., "Personal Key", "Work Key")
6. Click **"Connect"** - the system will test the key
7. Once verified, the integration will be active

## Testing Your Keys

After adding a key, the system automatically:
- Validates the key format
- Tests the connection
- Verifies access to the API

If a key fails:
- Check that you copied it correctly
- Ensure the key hasn't expired
- Verify your account has sufficient credits/quota
- Check provider status page for outages

## Cost Management

### Setting Budgets
- Most providers allow setting monthly spending limits
- Monitor your usage in the Testing Lab
- Use cost estimates before running batch tests

### Free Tier Recommendations
- **Google AI**: Best free tier for testing
- **Hugging Face**: Good for open-source models
- **OpenAI**: $5 credit for new users

### Cost-Effective Testing
- Start with free tier providers
- Use smaller models for initial testing
- Test with limited inputs before batch runs
- Use OpenRouter to compare costs across providers

## Troubleshooting

### Key Not Working
- Verify key format (check prefix)
- Ensure key hasn't been revoked
- Check account status and billing
- Try regenerating the key

### Rate Limits
- Most providers have rate limits
- Wait a few minutes and retry
- Consider upgrading your plan
- Use multiple keys for higher throughput

### Connection Errors
- Check your internet connection
- Verify provider status
- Ensure firewall isn't blocking requests
- Contact support if issues persist

## Support

For provider-specific issues:
- Check provider documentation
- Visit provider status pages
- Contact provider support

For dashboard issues:
- Check our help center
- Contact seller support
- Report bugs through the dashboard

---

**Last Updated:** January 2024

**Note:** Pricing and features are subject to change. Always check provider websites for the latest information.

