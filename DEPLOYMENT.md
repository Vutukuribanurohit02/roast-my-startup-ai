# Netlify Deployment Guide - Roast My Startup AI

Follow these instructions to deploy the full-stack **Roast My Startup AI** application to Netlify.

---

## 1. Project Configuration Details

- **Framework**: Next.js (with App Router and Route Handlers)
- **Build Command**: `npm run build`
- **Publish Directory**: `.next`
- **Configuration File**: [netlify.toml](file:///C:/Users/vutuk/.gemini/antigravity/scratch/roast-my-startup-ai/netlify.toml) (already included in the repository)

The `netlify.toml` file is pre-configured to utilize the Next.js runtime plugin (`@netlify/plugin-nextjs`) which compiles Next.js API route handlers into Netlify Serverless Functions automatically.

---

## 2. Environment Variables Configuration

Before deploying, ensure you configure the following variables in the **Netlify Dashboard** under **Site settings > Environment variables**:

| Variable Name | Description | Required / Optional |
| :--- | :--- | :--- |
| `OPENAI_API_KEY` | OpenAI API key OR Google Gemini API key (keys starting with `AQ.` or `AIzaSy`). | Required for AI Roast memo generations. |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL. | Required for persistent DB and user accounts. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase Project Public/Anon Key. | Required for frontend database and auth client. |
| `SUPABASE_URL` | Mirror of `NEXT_PUBLIC_SUPABASE_URL`. | Optional (fallback for server-side code). |
| `SUPABASE_ANON_KEY` | Mirror of `NEXT_PUBLIC_SUPABASE_ANON_KEY`. | Optional (fallback for server-side code). |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase Project Service Role Key. | Optional (for admin backend database access). |

> [!NOTE]
> If `OPENAI_API_KEY` or Supabase variables are absent, the application gracefully operates in **Demo Mode**, utilizing browser LocalStorage and pre-defined high-quality mock roast generator schemas, preventing database and serverless crashes.

---

## 3. Step-by-Step Deployment Steps

### Step 1: Push to GitHub / Git Provider
Initialize git (if not already set up), commit files, and push your repository to your Git provider (GitHub, GitLab, or Bitbucket):
```bash
git init
git add .
git commit -m "Configure Netlify deployment and Gemini API support"
git remote add origin <your-git-repo-url>
git branch -M main
git push -u origin main
```

### Step 2: Create a Netlify Site
1. Log in to your [Netlify Dashboard](https://app.netlify.com/).
2. Click **Add new site** -> Select **Import an existing project**.
3. Choose your Git provider (e.g. GitHub) and authorize it.
4. Search for and select your `roast-my-startup-ai` repository.

### Step 3: Configure Build & Environment Settings
1. Netlify will auto-detect Next.js:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
2. Scroll down and click **Add environment variables**.
3. Input the required keys listed in Section 2 above (specifically `OPENAI_API_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, and `NEXT_PUBLIC_SUPABASE_ANON_KEY`).

### Step 4: Deploy and Verify
1. Click **Deploy site**.
2. Wait for Netlify to finish the build. You can track progress in the **Deploy Log**.
3. Once the build status shifts to **Published**, click the site URL link to launch your live Roast My Startup AI dashboard!
