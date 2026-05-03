# 🚀 Deployment Guide - Daily Finance App

## Prerequisites
- ✅ GitHub account with this repo
- ✅ Render account created
- ✅ Vercel account created

---

## Step 1: Deploy Backend to Render

### 1.1 Connect GitHub to Render
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Under "Connect a repository", find your GitHub repo (`jhonrsalcedo/dailyfinance`)
4. Click **"Connect"**

### 1.2 Configure the Service
After connecting, you'll see the configuration:
- **Name**: `dailyfinance-api`
- **Branch**: `main`
- **Build Command**: `pip install -r backend/requirements.txt` (should auto-detect)
- **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT` (should auto-detect)

### 1.3 Set Environment Variables
Click **"Advanced"** and add these env vars:

| Key | Value | Notes |
|-----|-------|-------|
| `DATABASE_URL` | `libsql://dailyfinance-db.turso.io` | Create free DB in Turso first |
| `TURSO_AUTH_TOKEN` | Your Turso token | Get from Turso dashboard |
| `JWT_SECRET` | Generate: `python -c "import secrets; print(secrets.token_hex(32))"` | Copy the output |
| `ENVIRONMENT` | `production` | |

### 1.4 Create the Service
1. Click **"Create Web Service"**
2. Wait for build to complete (~2-3 minutes)
3. Once deployed, you'll see a URL like: `https://dailyfinance-api.onrender.com`
4. Test: Visit `https://dailyfinance-api.onrender.com/health`

---

## Step 2: Deploy Frontend to Vercel

### 2.1 Connect GitHub to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Find your GitHub repo (`jhonrsalcedo/dailyfinance`)
4. Click **"Import"**

### 2.2 Configure the Project
Settings should auto-detect:
- **Framework Preset**: `Next.js`
- **Build Command**: `next build` (or `npm run build`)
- **Output Directory**: `.next`

### 2.3 Set Environment Variables
In the "Environment Variables" section, add:

| Key | Value |
|-----|-------|
| `NEXTAUTH_SECRET` | Generate: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `NEXTAUTH_URL` | `https://your-app-name.vercel.app` (use the URL Vercel gives you) |
| `NEXT_PUBLIC_API_URL` | `https://dailyfinance-api.onrender.com/api/v1` (your Render URL) |

### 2.4 Deploy
1. Click **"Deploy"**
2. Wait for build (~2-3 minutes)
3. Visit your Vercel URL: `https://dailyfinance-xxx.vercel.app`

---

## Step 3: Verify Everything Works

### Test the Backend
```bash
# Should return {"status": "healthy"}
curl https://dailyfinance-api.onrender.com/health

# Should return categories
curl https://dailyfinance-api.onrender.com/api/v1/categories
```

### Test the Frontend
1. Visit your Vercel URL
2. You should see the Dashboard in "Demo Mode"
3. Try logging in or registering
4. Test adding a transaction

### Test Authentication
1. Register a new user
2. Login
3. Create a transaction
4. Check Dashboard updates

---

## 🔧 Troubleshooting

### CORS Issues
If frontend can't reach backend:
1. Check `NEXT_PUBLIC_API_URL` in Vercel is correct
2. Verify backend CORS allows your Vercel URL
3. Check browser console for CORS errors

### Database Issues
If you see database errors:
1. Verify Turso DATABASE_URL is correct
2. Check TURSO_AUTH_TOKEN is valid
3. Ensure database has data (seed runs on first start)

### Auth Issues
If login doesn't work:
1. Verify JWT_SECRET is set in Render
2. Check NEXTAUTH_SECRET matches in Vercel and Render
3. Check browser cookies are enabled

---

## 📝 Notes

- **Free Tier**: Both Render and Vercel have free tiers suitable for demo
- **Cold Start**: Render's free tier sleeps after 15 min of inactivity
- **Database**: Turso offers 5GB free storage

---

## 🚀 Quick Commands

Generate secrets:
```bash
# Python (for backend)
python -c "import secrets; print(secrets.token_hex(32))"

# Node.js (for frontend)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```