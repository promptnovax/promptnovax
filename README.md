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

## Firebase Backend Setup

To enable Firebase authentication and database functionality:

### 1. Create a Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Follow the setup wizard to create your project

### 2. Enable Required Services
1. **Firestore Database**: Go to Firestore Database → Create database → Start in test mode
2. **Authentication**: Go to Authentication → Get started → Enable Email/Password and Google sign-in
3. **Storage**: Go to Storage → Get started → Start in test mode

### 3. Get Firebase Configuration
1. Go to Project Settings (gear icon) → General tab
2. Scroll down to "Your apps" section
3. Click "Add app" → Web app (</>) → Register app
4. Copy the Firebase configuration object

### 4. Create Service Account
1. Go to Project Settings → Service accounts tab
2. Click "Generate new private key"
3. Download the JSON file (keep it secure!)

### 5. Environment Variables
1. Copy `.env.local.example` to `.env.local`
2. Fill in your Firebase configuration values:
   - `NEXT_PUBLIC_FIREBASE_*` values from step 3
   - `FIREBASE_SERVICE_ACCOUNT_JSON` with the entire JSON content from step 4

### 6. Security Rules (Optional)
Configure Firestore and Storage security rules in the Firebase Console as needed for your application.

---
**Firebase setup is optional for local development. The app will work without it, but authentication and database features will be disabled.**

