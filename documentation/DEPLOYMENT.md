# Deployment Guide - Render.com

This guide will help you deploy your Vue.js AIDD Todo App to Render.com with SQLite database persistence.

## Prerequisites

- GitHub account
- Render.com account (free tier available)
- Your code pushed to a GitHub repository

## Step-by-Step Deployment

### 1. Push Code to GitHub

If you haven't already:

```bash
# Ensure latest changes are committed
git add .
git commit -m "Add Render deployment configuration"

# Push to GitHub
git push origin main
```

### 2. Create a Render Account

1. Go to https://render.com
2. Sign up with your GitHub account
3. Authorize Render to access your repositories

### 3. Deploy from Dashboard

**Option A: Using Blueprint (Automatic)**

1. Click **"New +"** → **"Blueprint"**
2. Connect your GitHub repository
3. Render will automatically detect the `render.yaml` file
4. Click **"Apply"** to deploy

**Option B: Manual Setup**

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure the following:
   - **Name**: `vuejs-aidd-todo-app`
   - **Region**: Oregon (or your preferred region)
   - **Branch**: `main`
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
   - **Plan**: Free

4. Add Environment Variables:
   - `NODE_ENV` = `production`
   - `PORT` = `3001`

5. Click **"Create Web Service"**

**Note:** For persistent database storage, upgrade to Starter plan ($7/month) and add a disk under Advanced → Disks.

### 4. Wait for Deployment

Render will:
- ✅ Clone your repository
- ✅ Install dependencies
- ✅ Build the frontend
- ✅ Start the Express server
- ✅ Initialize the SQLite database
- ✅ Deploy to a public URL

This takes about 2-5 minutes.

### 5. Access Your App

Once deployed, you'll get a URL like:
```
https://vuejs-aidd-todo-app.onrender.com
```

Visit this URL to see your live app! 🎉

## Important Notes

### Free Tier Limitations

- ⏱️ Service spins down after 15 minutes of inactivity
- 🐌 First request after inactivity takes 30-60 seconds (cold start)
- 💾 750 hours/month of runtime (enough for a demo/portfolio project)
- ⚠️ **No persistent disk** - Database resets on each deployment

### Database Persistence

**Free Tier:**
- ⚠️ SQLite database stored in container filesystem
- ⚠️ Data is LOST on each deployment or restart
- ✅ Sample todos appear on first run (every time)
- ✅ Perfect for demos and testing

**Paid Tier ($7/month - Starter):**
- ✅ Persistent disks available
- ✅ Data survives deployments and restarts
- ✅ Always-on (no spin down)

**Workarounds for Free Tier:**
1. Use a cloud database (Supabase, PlanetScale) instead of SQLite
2. Accept data reset on deployments (fine for demos)
3. Upgrade to paid plan for persistence

### Automatic Deployments

- 🔄 Render automatically redeploys when you push to GitHub
- 🔄 No manual redeployment needed

## Troubleshooting

### Build Fails

Check the logs in Render dashboard:
1. Go to your service
2. Click **"Logs"**
3. Look for error messages

Common issues:
- Missing dependencies: Run `npm install` locally first
- TypeScript errors: Fix linting issues before deploying
- Build timeout: Try upgrading to paid plan

### App Not Loading

1. Check Health Check:
   - Visit: `https://your-app.onrender.com/api/health`
   - Should return: `{"status":"ok","message":"Server is running"}`

2. Check Logs for errors

3. Verify environment variables are set correctly

### Database Issues

1. Check disk is properly mounted:
   - Go to service → Disks
   - Verify mount path: `/opt/render/project/src/server/db`

2. Check logs for database initialization messages

### Slow First Load

This is normal for the free tier. The service spins down after 15 minutes of inactivity.

Solutions:
- Upgrade to paid plan ($7/month for always-on)
- Use a service like UptimeRobot to ping your app every 14 minutes
- Accept the cold start delay for free tier

## Updating Your App

Simply push to GitHub:

```bash
git add .
git commit -m "Your update message"
git push origin main
```

Render automatically detects changes and redeploys!

## Custom Domain (Optional)

1. Go to service → **Settings** → **Custom Domains**
2. Add your domain
3. Update DNS records as instructed
4. Wait for SSL certificate (automatic)

## Monitoring

Render provides:
- 📊 Real-time logs
- 📈 Metrics (CPU, memory, bandwidth)
- 🔔 Deploy notifications
- ⚠️ Error alerts

Access these in your Render dashboard.

## Backup Your Database

To backup your SQLite database:

1. Use Render Shell:
   ```bash
   # In Render dashboard → Shell
   cat server/db/todos.db | base64
   ```

2. Copy and decode locally:
   ```bash
   # Save output to file and decode
   base64 -d backup.txt > todos.db
   ```

## Cost Estimation

**Free Tier:**
- ✅ 750 hours/month
- ✅ 1 GB disk storage
- ✅ Automatic SSL
- ⏱️ Spins down after 15 min inactivity

**Starter Plan ($7/month):**
- ✅ Always-on (no spin down)
- ✅ Faster deployments
- ✅ Better performance
- ✅ Priority support

## Support

- 📚 Render Docs: https://render.com/docs
- 💬 Render Community: https://community.render.com
- 📧 Support: support@render.com

## Next Steps

After deployment:
1. ✅ Test all features (add, edit, delete todos)
2. ✅ Verify database persistence (refresh page)
3. ✅ Share your live URL!
4. ✅ Add to your portfolio/resume
5. ✅ Consider custom domain

---

**Congratulations! Your app is now live! 🚀**

Share your URL: `https://vuejs-aidd-todo-app.onrender.com`

