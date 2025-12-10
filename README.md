# Thought Bloom Engine MVP

## Local Setup Instructions

This project is a minimal MVP built with:
- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

### Prerequisites
- Node.js (v18 or newer recommended)
- npm (comes with Node.js)

### 1. Install dependencies
```bash
npm install
```

### 2. Start the development server
```bash
npm run dev
```

The app will be available at http://localhost:5173 (or as shown in your terminal).

### 3. Environment Variables
If any environment variables are required, copy `.env.example` to `.env` and fill in the values. (If `.env.example` does not exist, no variables are needed for local use.)

### 4. Static Content
All static files are in the `public/` directory. Paths are relative and should work out of the box.

## Supabase Backend Setup

To enable Supabase-powered authentication and database functionality:

### 1. Create a Supabase Project
1. Go to [Supabase](https://supabase.com)
2. Create a new project (choose the free tier for local testing)
3. Wait for the project to provision

### 2. Enable Authentication Providers
1. In the Supabase dashboard, open **Authentication → Providers**
2. Enable Email/Password (default) and optionally Google OAuth
3. Configure redirect URLs if you plan to support OAuth flows

### 3. Obtain API Keys
1. Go to **Project Settings → API**
2. Copy the Project URL and `anon` public key
3. Copy the `service_role` key for secure server-side usage (do not expose this to the client)

### 4. Environment Variables
1. Copy `.env.example` to `.env`
2. Fill in the Supabase values:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (optional, for backend verification)

### 5. Optional Database Tables
The UI currently runs in demo mode without a live database. When you are ready to wire Supabase tables, create the relevant tables (e.g., `prompts`, `users`, `notifications`) and update the data access layer accordingly.

---
**Supabase setup is optional for local development. The app will work without it, but authentication and database features will remain in demo mode until configured.**

## Vercel Deployment

This project is configured for easy deployment on Vercel.

### 1. Connect Repository to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your GitHub repository: `promptnovax/promptnovax`
4. Vercel will automatically detect the Vite framework

### 2. Configure Build Settings

Vercel will auto-detect these settings from `vercel.json`:
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 3. Set Environment Variables

In Vercel project settings, add these environment variables:

**Required:**
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Optional (for backend features):**
```
VITE_API_BASE=https://your-backend-url.com
VITE_BACKEND_URL=https://your-backend-url.com
VITE_ENABLE_LOCAL_PROMPT_FALLBACK=true
```

### 4. Deploy

1. Click "Deploy" - Vercel will automatically build and deploy your app
2. Your app will be live at `https://your-project.vercel.app`
3. Future pushes to the `main` branch will automatically trigger new deployments

### 5. Backend Deployment (Optional)

If you need the Express backend running separately:

1. Deploy the backend to a service like Railway, Render, or Vercel Serverless Functions
2. Update `VITE_API_BASE` and `VITE_BACKEND_URL` environment variables in Vercel to point to your backend URL

---

**Note**: The `vercel.json` file is already configured for optimal Vercel deployment. All routes will be properly handled for client-side routing.

