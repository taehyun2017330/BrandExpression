# 🚀 Deployment Guide

This guide covers deploying the BrandExpression-3 application with the backend on Railway and frontend on GitHub Pages.

## Overview

- **Backend**: Deployed to Railway (or similar service) with API keys as environment secrets
- **Frontend**: Deployed to GitHub Pages as a static site
- **Database**: MySQL hosted on Railway (included with backend deployment)

Users can access the live site without any setup - all API keys are securely stored on the backend.

---

## 📋 Prerequisites

- GitHub account
- Railway account (free tier: https://railway.app)
- Your API keys ready (see backend/.env.example for required keys)

---

## Part 1: Deploy Backend to Railway

### Step 1: Create Railway Project

1. Go to https://railway.app and sign in with GitHub
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your `BrandExpression-3` repository
5. Railway will detect the backend automatically

### Step 2: Add MySQL Database

1. In your Railway project, click **"+ New"**
2. Select **"Database"** → **"MySQL"**
3. Railway will automatically create and link the database

### Step 3: Configure Environment Variables

1. Click on your backend service in Railway
2. Go to **"Variables"** tab
3. Click **"RAW Editor"** and paste all variables from your `backend/.env`:

```env
NODE_ENV=production
SESSION_SECRET=your_session_secret_here
CRYPTO_KEY=your_crypto_key_here
CRYPTO_DELETED_KEY=your_crypto_deleted_key_here

# Database - Railway provides these automatically as DATABASE_URL
# But we need individual variables for this app
DB_HOST=${{MYSQLHOST}}
DB_PORT=${{MYSQLPORT}}
DB_DATABASE=${{MYSQLDATABASE}}
DB_USER=${{MYSQLUSER}}
DB_PASSWORD=${{MYSQLPASSWORD}}

# AWS S3
AWS_ACCESS_KEY=your_aws_access_key
AWS_SECRET_ACCESS=your_aws_secret_key
AWS_REGION=ap-northeast-2

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Email (Optional)
SES_FROM_EMAIL=your_email@example.com

# YouTube API (Optional)
YOUTUBE_API_KEY=your_youtube_api_key

# Social Login (Optional)
KAKAO_REST_API=your_kakao_rest_api_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REFRESH_TOKEN=your_google_refresh_token

# Payment System (Optional)
INICIS_TEST_MID=your_inicis_mid
INICIS_TEST_SIGN_KEY=your_inicis_sign_key
INICIS_TEST_API_KEY=your_inicis_api_key
INICIS_TEST_API_IV=your_inicis_api_iv
INICIS_TEST_INILITE_KEY=your_inicis_inilite_key
```

4. Click **"Save"**

### Step 4: Configure Root Directory

1. In Railway, go to **"Settings"** tab
2. Find **"Root Directory"**
3. Set it to: `backend`
4. Click **"Save"**

### Step 5: Get Your Backend URL

1. Go to **"Settings"** tab
2. Scroll to **"Networking"**
3. Click **"Generate Domain"**
4. Copy the generated URL (e.g., `https://brandexpression-production.up.railway.app`)

### Step 6: Enable CORS for Your Frontend

The backend already has CORS configured. Once deployed, verify it allows requests from your GitHub Pages domain.

---

## Part 2: Deploy Frontend to GitHub Pages

### Step 1: Enable GitHub Pages

1. Go to your GitHub repository
2. Click **"Settings"** → **"Pages"**
3. Under **"Build and deployment"**:
   - Source: **"GitHub Actions"**

### Step 2: Add GitHub Repository Secret

1. In your repository, go to **"Settings"** → **"Secrets and variables"** → **"Actions"**
2. Click **"New repository secret"**
3. Name: `NEXT_PUBLIC_API_URL`
4. Value: Your Railway backend URL (from Part 1, Step 5)
5. Click **"Add secret"**

### Step 3: Deploy

1. Commit and push your changes to the `main` branch:

```bash
git add .
git commit -m "Configure deployment for Railway and GitHub Pages"
git push origin main
```

2. GitHub Actions will automatically:
   - Build your Next.js frontend
   - Deploy to GitHub Pages
   - Your site will be live at: `https://yourusername.github.io/BrandExpression-3`

### Step 4: Verify Deployment

1. Go to **"Actions"** tab in your repository
2. Watch the deployment workflow
3. Once complete, visit your GitHub Pages URL

---

## Part 3: Database Setup

### Initialize Database Schema

1. In Railway, click on your backend service
2. Go to **"Deployments"** tab
3. Once deployed, you need to run the SQL schema

**Option A: Use Railway's MySQL Client**
1. Click on the MySQL database in Railway
2. Click **"Connect"**
3. Use the provided connection details to connect with a MySQL client
4. Run your database schema SQL file

**Option B: Add to Backend Startup**
Consider adding automatic database migration on backend startup (recommended for production)

---

## 🔒 Security Notes

- **Never commit** `.env` files to GitHub
- All secrets are stored on Railway as environment variables
- Frontend only contains the backend API URL (public information)
- GitHub Actions uses secrets for builds

---

## 🛠️ Updating the Application

### Backend Updates
1. Push changes to GitHub
2. Railway automatically redeploys

### Frontend Updates
1. Push changes to GitHub
2. GitHub Actions automatically rebuilds and deploys

---

## 💰 Cost Estimates (Free Tier)

- **Railway**: $5/month credit (usually enough for demos/small apps)
- **GitHub Pages**: Free for public repositories
- **Domain**: Optional (Railway provides free subdomain)

---

## 🚨 Troubleshooting

### Backend won't start
- Check Railway logs: Click service → "Deployments" → View logs
- Verify all environment variables are set
- Check database connection variables

### Frontend can't reach backend
- Verify `NEXT_PUBLIC_API_URL` secret is set correctly
- Check CORS settings in backend
- Ensure Railway backend is running

### Database connection errors
- Railway MySQL takes ~30 seconds to start
- Verify DB_* variables match Railway's MySQL variables
- Check Railway database is running

---

## 📝 Environment Variables Reference

### Required for Backend
- `OPENAI_API_KEY` - For AI features
- `AWS_ACCESS_KEY` & `AWS_SECRET_ACCESS` - For image uploads
- `DB_*` variables - For database connection

### Optional for Backend
- Social login keys (KAKAO, GOOGLE)
- Payment system keys (INICIS)
- YouTube API key
- Email configuration

### Required for Frontend
- `NEXT_PUBLIC_API_URL` - Your Railway backend URL

---

## 🎯 Alternative Deployment Options

Instead of Railway, you can also deploy to:
- **Render**: Similar to Railway (free tier available)
- **Heroku**: Classic option (limited free tier)
- **Fly.io**: Good performance, free tier
- **DigitalOcean App Platform**: $5/month minimum

Configuration is similar - just set environment variables and point to the backend service.

---

## 📞 Support

If you encounter issues during deployment:
1. Check the logs in Railway (Backend)
2. Check GitHub Actions logs (Frontend)
3. Verify all environment variables are correctly set

---

## ✅ Quick Checklist

Backend (Railway):
- [ ] Project created and linked to GitHub
- [ ] MySQL database added
- [ ] All environment variables configured
- [ ] Root directory set to `backend`
- [ ] Domain generated and noted
- [ ] Backend is running (check logs)

Frontend (GitHub Pages):
- [ ] GitHub Pages enabled with "GitHub Actions" source
- [ ] `NEXT_PUBLIC_API_URL` secret added
- [ ] Code pushed to main branch
- [ ] GitHub Actions workflow completed successfully
- [ ] Site is accessible at GitHub Pages URL

Database:
- [ ] Schema initialized
- [ ] Backend can connect to database
