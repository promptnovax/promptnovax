# Backend Server Setup Guide

## Problem: `ERR_CONNECTION_REFUSED` Error

Agar aapko `ERR_CONNECTION_REFUSED` error aa raha hai, iska matlab hai ke backend server chal nahi raha.

## Quick Fix

### Option 1: Run Backend Only
```bash
cd "C:\Users\HS Computers\Documents\pnx latest\PNX-main"
npm install
npm run server
```

Agar sab sahi hai, to terminal me yeh dikhega:
```
Server listening on http://localhost:8787
Health check: http://localhost:8787/health
```

### Option 2: Run Both Frontend + Backend Together (Recommended)
```bash
cd "C:\Users\HS Computers\Documents\pnx latest\PNX-main"
npm install
npm run dev:full
```

Yeh command dono servers ek saath chalayega:
- Frontend: `http://localhost:5173` (or similar)
- Backend: `http://localhost:8787`

## Verify Backend is Running

Browser me yeh URL open karein:
```
http://localhost:8787/health
```

Agar backend chal raha hai, to yeh JSON response aayega:
```json
{
  "status": "ok",
  "timestamp": "...",
  "uptime": ...
}
```

## Troubleshooting

### Port Already in Use
Agar port 8787 already use ho raha hai:
1. `.env` file me `PORT=8788` set karein (or koi aur port)
2. Frontend me bhi `VITE_BACKEND_URL=http://localhost:8788` set karein

### Backend Crashes on Start
1. Check karein ke `backend/` folder me sab dependencies install hain:
   ```bash
   cd backend
   npm install
   ```
2. Check terminal me koi error messages

### Still Not Working?
1. Backend terminal me koi errors check karein
2. Browser console me exact error message check karein
3. Firewall check karein - port 8787 blocked to nahi hai

## Environment Variables (Optional)

Backend ke liye `.env` file `backend/` folder me banao:
```env
PORT=8787
# Optional: Supabase (for database features)
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_key
# Optional: Email (for OTP)
RESEND_API_KEY=your_resend_key
RESEND_DOMAIN=your_domain
SENDER_EMAIL=noreply@yourdomain.com
```

Yeh sab optional hain - basic API Studio bina inke bhi kaam karega.

