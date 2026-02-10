# Eurobridge Language Institute

## Stack
- Frontend: React (Vite), React Router, Axios
- Backend: Node.js, Express
- Database: MongoDB (Mongoose)
- Hosting: Netlify (frontend), Render (backend)

## Folder structure
- /frontend -> React app
- /backend -> Express REST API

## Local setup
1. Create a backend .env file using backend/.env.example.
2. Install dependencies in both /frontend and /backend.
3. Run the backend with `npm run dev`, then the frontend with `npm run dev`.

## Hosting notes
- Render: set `MONGODB_URI`, `MONGODB_DB_NAME`, `CORS_ORIGIN`, `PORT` in the service env vars.
- Netlify: set `VITE_API_BASE_URL` to the Render API URL in site env vars.
