# FinSights Deployment Guide

## 🚀 Deploying to Vercel

### Frontend Deployment (Vercel)

1. **Push your code to GitHub**
2. **Connect to Vercel:**

   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Set the root directory to `financeai-frontend`

3. **Environment Variables in Vercel:**
   - Go to Project Settings → Environment Variables
   - Add: `VITE_API_URL` = `https://your-backend-url.com/api`

### Backend Deployment Options

#### Option 1: Railway (Recommended - Free)

1. Go to [railway.app](https://railway.app)
2. Connect your GitHub repo
3. Select the `financeai-backend` folder
4. Add environment variables:
   - `OPEN_AI_KEY` = your OpenAI API key
   - `NESSIE_KEY` = your Nessie API key (optional)

#### Option 2: Render (Free)

1. Go to [render.com](https://render.com)
2. Create new Web Service
3. Connect GitHub repo
4. Set root directory to `financeai-backend`
5. Add environment variables

#### Option 3: DigitalOcean App Platform ($5/month)

1. Go to DigitalOcean App Platform
2. Create new app from GitHub
3. Set source directory to `financeai-backend`
4. Add environment variables

### Environment Variables Needed

#### Frontend (Vercel)

```
VITE_API_URL=https://your-backend-url.com/api
```

#### Backend (Railway/Render/DigitalOcean)

```
OPEN_AI_KEY=sk-proj-your-openai-key-here

```

### Deployment Steps

1. **Deploy Backend First:**

   - Choose a platform (Railway recommended)
   - Deploy the `financeai-backend` folder
   - Add environment variables
   - Get the backend URL

2. **Deploy Frontend:**

   - Deploy to Vercel
   - Set `VITE_API_URL` to your backend URL
   - Deploy

3. **Test:**
   - Visit your Vercel URL
   - Test login and dashboard functionality

### File Structure for Deployment

```
FinSights/
├── financeai-frontend/     # Deploy to Vercel
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
├── financeai-backend/      # Deploy to Railway/Render
│   ├── main.go
│   ├── go.mod
│   └── services/
└── DEPLOYMENT.md
```

### Troubleshooting

- **CORS Issues:** Make sure your backend allows your Vercel domain
- **API Key Issues:** Double-check environment variables are set correctly
- **Build Issues:** Ensure all dependencies are in package.json/go.mod
