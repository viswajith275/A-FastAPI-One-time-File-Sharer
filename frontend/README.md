# Frontend for FastAPI Secure File Share

Quick Vite + React frontend to interact with the FastAPI backend.

Prerequisites
- Node.js 18+ and `npm` installed

Run locally (development):

```fish
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser. The frontend expects the API at `http://localhost:8000` by default; change `VITE_API_URL` in `.env` if your API is running elsewhere.

Features
- Register and login (stores JWT in `localStorage`)
- Upload file (sends Authorization header)
- Displays one-time link, copy and open actions
