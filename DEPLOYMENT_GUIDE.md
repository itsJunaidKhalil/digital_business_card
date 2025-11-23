# Complete Deployment Guide

This guide will walk you through:
1. Setting up OAuth providers (Google, GitHub, LinkedIn) with Supabase
2. Deploying your application to Vercel

---

## Part 1: Setting Up OAuth with Supabase

### Step 1: Configure Google OAuth

#### 1.1 Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. If prompted, configure the OAuth consent screen:
   - Choose **External** (unless you have a Google Workspace)
   - Fill in:
     - App name: "Digital Business Card"
     - User support email: Your email
     - Developer contact: Your email
   - Click **Save and Continue**
   - Add scopes: `email`, `profile`, `openid`
   - Add test users (your email) if in testing mode
   - Click **Save and Continue**
6. Create OAuth Client ID:
   - Application type: **Web application**
   - Name: "Digital Business Card Web"
   - Authorized JavaScript origins:
     - `http://localhost:3000` (for development)
     - `https://yourdomain.vercel.app` (for production - add after Vercel deployment)
   - Authorized redirect URIs:
     - `https://YOUR_SUPABASE_PROJECT.supabase.co/auth/v1/callback`
     - `http://localhost:3000/auth/callback` (for development)
   - Click **Create**
7. **Copy the Client ID and Client Secret** - you'll need these!

#### 1.2 Configure Google in Supabase

1. Go to your [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Navigate to **Authentication** > **Providers**
4. Find **Google** and click to enable it
5. Enter:
   - **Client ID**: Paste your Google Client ID
   - **Client Secret**: Paste your Google Client Secret
6. Click **Save**

---

### Step 2: Configure GitHub OAuth

#### 2.1 Create GitHub OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **OAuth Apps** > **New OAuth App**
3. Fill in the form:
   - **Application name**: "Digital Business Card"
   - **Homepage URL**: 
     - Development: `http://localhost:3000`
     - Production: `https://yourdomain.vercel.app` (update after deployment)
   - **Authorization callback URL**: 
     - `https://YOUR_SUPABASE_PROJECT.supabase.co/auth/v1/callback`
   - Click **Register application**
4. **Copy the Client ID**
5. Click **Generate a new client secret**
6. **Copy the Client Secret** (you can only see it once!)

#### 2.2 Configure GitHub in Supabase

1. In Supabase Dashboard, go to **Authentication** > **Providers**
2. Find **GitHub** and click to enable it
3. Enter:
   - **Client ID**: Paste your GitHub Client ID
   - **Client Secret**: Paste your GitHub Client Secret
4. Click **Save**

---

### Step 3: Configure LinkedIn OAuth (Optional)

#### 3.1 Create LinkedIn App

1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/)
2. Click **Create app**
3. Fill in:
   - **App name**: "Digital Business Card"
   - **LinkedIn Page**: Select or create a LinkedIn page
   - **Privacy policy URL**: `https://yourdomain.vercel.app/privacy` (or create a simple page)
   - **App logo**: Upload a logo (optional)
   - Click **Create app**
4. Go to **Auth** tab
5. Add redirect URLs:
   - `https://YOUR_SUPABASE_PROJECT.supabase.co/auth/v1/callback`
6. Under **Products**, request access to **Sign In with LinkedIn using OpenID Connect**
7. Copy:
   - **Client ID**
   - **Client Secret** (click "Show" to reveal)

#### 3.2 Configure LinkedIn in Supabase

1. In Supabase Dashboard, go to **Authentication** > **Providers**
2. Find **LinkedIn** and click to enable it
3. Enter:
   - **Client ID**: Paste your LinkedIn Client ID
   - **Client Secret**: Paste your LinkedIn Client Secret
4. Click **Save**

**Note**: You'll need to update the login/register pages to include LinkedIn button if you want to use it.

---

### Step 4: Update Redirect URLs After Deployment

After deploying to Vercel, you'll need to:

1. **Update Google OAuth**:
   - Go back to Google Cloud Console
   - Edit your OAuth client
   - Add your Vercel domain to authorized origins and redirect URIs

2. **Update GitHub OAuth**:
   - Go to GitHub Developer Settings
   - Edit your OAuth App
   - Update Homepage URL and Authorization callback URL

3. **Update LinkedIn OAuth**:
   - Go to LinkedIn Developers
   - Edit your app
   - Update redirect URLs

---

## Part 2: Deploying to Vercel

### Step 1: Prepare Your Code

1. **Create a `.env.local` file** (already done, but verify):
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_KEY=your_supabase_anon_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

2. **Make sure your code is committed to Git**:
```bash
git add .
git commit -m "Ready for deployment"
```

3. **Push to GitHub** (if not already):
```bash
git remote add origin https://github.com/yourusername/your-repo.git
git push -u origin main
```

---

### Step 2: Deploy to Vercel

#### 2.1 Create Vercel Account

1. Go to [Vercel](https://vercel.com/)
2. Click **Sign Up**
3. Choose **Continue with GitHub** (recommended) or use email
4. Authorize Vercel to access your GitHub account

#### 2.2 Import Your Project

1. In Vercel Dashboard, click **Add New** > **Project**
2. Import your GitHub repository:
   - If you used "Continue with GitHub", your repos will be listed
   - Select your `digitalbusinesscard` repository
   - Click **Import**

#### 2.3 Configure Project Settings

1. **Framework Preset**: Should auto-detect as "Next.js" ✅
2. **Root Directory**: Leave as `./` (unless your Next.js app is in a subfolder)
3. **Build Command**: Leave default (`npm run build`)
4. **Output Directory**: Leave default (`.next`)
5. **Install Command**: Leave default (`npm install`)

#### 2.4 Add Environment Variables

Click **Environment Variables** and add:

1. **NEXT_PUBLIC_SUPABASE_URL**
   - Value: Your Supabase project URL
   - Environment: Production, Preview, Development (select all)

2. **NEXT_PUBLIC_SUPABASE_KEY**
   - Value: Your Supabase anon/public key
   - Environment: Production, Preview, Development (select all)

3. **NEXT_PUBLIC_APP_URL**
   - Value: `https://your-project-name.vercel.app` (you'll get this after first deploy)
   - Environment: Production, Preview, Development (select all)

4. **SUPABASE_SERVICE_ROLE_KEY** (Optional, for admin operations)
   - Value: Your Supabase service role key (keep this secret!)
   - Environment: Production only
   - ⚠️ **Never expose this in client-side code!**

#### 2.5 Deploy

1. Click **Deploy**
2. Wait for the build to complete (usually 2-3 minutes)
3. Once deployed, you'll get a URL like: `https://your-project-name.vercel.app`

---

### Step 3: Update Configuration After Deployment

#### 3.1 Update Vercel Environment Variables

1. Go to your project in Vercel Dashboard
2. Go to **Settings** > **Environment Variables**
3. Update **NEXT_PUBLIC_APP_URL** to your actual Vercel URL:
   ```
   https://your-project-name.vercel.app
   ```
4. Click **Save**

#### 3.2 Update OAuth Redirect URLs

Now update all your OAuth providers with the new production URL:

**Google:**
- Go to Google Cloud Console > Your OAuth Client
- Add to Authorized JavaScript origins: `https://your-project-name.vercel.app`
- Add to Authorized redirect URIs: `https://your-project-name.vercel.app/auth/callback`

**GitHub:**
- Go to GitHub Developer Settings > Your OAuth App
- Update Homepage URL: `https://your-project-name.vercel.app`
- Update Authorization callback URL: `https://YOUR_SUPABASE_PROJECT.supabase.co/auth/v1/callback`

**LinkedIn:**
- Go to LinkedIn Developers > Your App > Auth
- Add redirect URL: `https://YOUR_SUPABASE_PROJECT.supabase.co/auth/v1/callback`

#### 3.3 Redeploy

1. In Vercel, go to **Deployments**
2. Click the three dots on the latest deployment
3. Click **Redeploy** (this will use the updated environment variables)

---

### Step 4: Set Up Custom Domain (Optional)

1. In Vercel Dashboard, go to **Settings** > **Domains**
2. Enter your domain name (e.g., `yourdomain.com`)
3. Follow the DNS configuration instructions
4. Vercel will automatically configure SSL certificates

---

## Part 3: Post-Deployment Checklist

### ✅ Verify Everything Works

1. **Test OAuth Login**:
   - [ ] Google login works
   - [ ] GitHub login works
   - [ ] LinkedIn login works (if configured)

2. **Test Profile Features**:
   - [ ] Can create/edit profile
   - [ ] Can upload images
   - [ ] Can add social links
   - [ ] Public profile displays correctly
   - [ ] Social links appear on public profile

3. **Test Analytics**:
   - [ ] Profile views are tracked
   - [ ] Link clicks are tracked

4. **Test VCF Download**:
   - [ ] VCF file downloads correctly

### 🔒 Security Checklist

- [ ] Environment variables are set in Vercel (not in code)
- [ ] Service role key is only in production environment
- [ ] RLS policies are enabled in Supabase
- [ ] OAuth redirect URLs are correctly configured
- [ ] HTTPS is enabled (automatic with Vercel)

### 📊 Monitoring

1. **Vercel Analytics** (Optional):
   - Enable in Vercel Dashboard > Analytics
   - Monitor performance and errors

2. **Supabase Logs**:
   - Check Authentication logs in Supabase Dashboard
   - Monitor API usage

---

## Troubleshooting

### OAuth Not Working

**Issue**: "Redirect URI mismatch"
- **Solution**: Make sure the redirect URI in your OAuth provider matches exactly: `https://YOUR_SUPABASE_PROJECT.supabase.co/auth/v1/callback`

**Issue**: "Invalid client"
- **Solution**: Double-check Client ID and Client Secret in Supabase

### Build Errors on Vercel

**Issue**: "Module not found"
- **Solution**: Make sure all dependencies are in `package.json`

**Issue**: "Environment variable not found"
- **Solution**: Check that all environment variables are set in Vercel Dashboard

### Images Not Loading

**Issue**: Images return 403 or don't load
- **Solution**: 
  1. Check Supabase Storage bucket policies
  2. Make sure buckets are set to "public"
  3. Verify image URLs are correct

### Social Links Not Showing

**Issue**: Links don't appear on public profile
- **Solution**: 
  1. Check RLS policies in Supabase
  2. Verify the "Social links are viewable by everyone" policy exists
  3. Check browser console for errors

---

## Quick Reference

### Supabase Project URL Format
```
https://xxxxxxxxxxxxx.supabase.co
```

### Supabase Keys Location
- Dashboard > Settings > API
- **Project URL**: `NEXT_PUBLIC_SUPABASE_URL`
- **anon/public key**: `NEXT_PUBLIC_SUPABASE_KEY`
- **service_role key**: `SUPABASE_SERVICE_ROLE_KEY` (server-side only!)

### Vercel URLs
- Production: `https://your-project-name.vercel.app`
- Preview: `https://your-project-name-git-branch-username.vercel.app`

### OAuth Redirect URI (All Providers)
```
https://YOUR_SUPABASE_PROJECT.supabase.co/auth/v1/callback
```

---

## Need Help?

- **Supabase Docs**: https://supabase.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs

---

## Summary

1. ✅ Set up OAuth providers (Google, GitHub, LinkedIn)
2. ✅ Configure redirect URIs
3. ✅ Deploy to Vercel
4. ✅ Add environment variables
5. ✅ Update OAuth redirect URLs with production domain
6. ✅ Test everything
7. ✅ Set up custom domain (optional)

Your app should now be live and fully functional! 🚀

