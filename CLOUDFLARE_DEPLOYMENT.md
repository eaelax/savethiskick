# SaveThisKick – Complete Launch & Deployment Guide
(GitHub + Cloudflare + Unstoppable Domains + Google Search Console + pSEO)

This comprehensive guide takes you step-by-step from code repository to live production with your custom domain from **Unstoppable Domains**, managed by **Cloudflare**, verified on **Google Search Console**, and indexed with an advanced **pSEO (Programmatic SEO) engine**.

---

## 1. GitHub Repository Setup

1. **Initialize and Push to GitHub:**
   - Create a new repository on your GitHub account (e.g. `savethiskick`).
   - Push your project files to the repository:
     ```bash
     git init
     git add .
     git commit -m "feat: complete SaveThisKick application ready for production"
     git branch -M main
     git remote add origin https://github.com/YOUR_USERNAME/savethiskick.git
     git push -u origin main
     ```

---

## 2. Cloudflare Pages & Full-Stack Deployment

Because SaveThisKick includes server-side API routes (`/api/kick/resolve`, `/api/kick/download`, `/api/kick/proxy`, `/api/admin/metrics`) that bypass CORS restrictions and parse Kick.com streaming manifests, deploy it as a full-stack Next.js project on Cloudflare Pages using the standard Next.js adapter.

### Step 1: Connect GitHub to Cloudflare Pages
1. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. In the left navigation, go to **Compute (Workers & Pages)** > **Create** > **Pages** > **Connect to Git**.
3. Authorize Cloudflare to access your GitHub account and choose the `savethiskick` repository.
4. Click **Begin setup**.

### Step 2: Build & Environment Settings
- **Project Name:** `savethiskick` (or your choice)
- **Production branch:** `main`
- **Framework preset:** `Next.js`
- **Build command:** `npx @opennextjs/cloudflare` or standard `npm run build`
- **Build output directory:** `.next` or `.worker-next` (OpenNext handles edge bundling automatically)
- **Root directory:** `/` (leave empty)

### Step 3: Environment Variables
Under **Settings** > **Environment variables**, set:
- `NODE_VERSION`: `20.18.0` (or `20.x`)
- `NEXT_TELEMETRY_DISABLED`: `1`
- `APP_URL`: `https://yourcustomdomain.com` (replace with your actual domain, e.g., `https://savethiskick.com`)
- `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`: *(Your verification string from Google Search Console, see Section 4)*

Click **Save and Deploy**. Cloudflare will run the build and assign you an initial `*.pages.dev` URL.

---

## 3. Custom Domain from Unstoppable Domains + Cloudflare DNS

Whether you purchased a traditional Web2 domain (`.com`, `.net`, `.cc`) or a Web3 domain through Unstoppable Domains, configuring Cloudflare as your authoritative DNS provider gives you DDoS mitigation, edge caching, and free auto-renewing SSL certificates.

### Step 1: Add Domain to Cloudflare
1. In Cloudflare Dashboard, click **Websites** > **Add a Site**.
2. Enter your domain (e.g. `savethiskick.com`).
3. Select the **Free** plan and click **Continue**.
4. Cloudflare will scan existing DNS records and present you with two unique Cloudflare nameservers (e.g. `adam.ns.cloudflare.com` and `eve.ns.cloudflare.com`).

### Step 2: Update Nameservers in Unstoppable Domains
1. Log in to your [Unstoppable Domains](https://unstoppabledomains.com/) dashboard.
2. Navigate to **My Domains** and click on your domain.
3. Go to **Manage** > **DNS** (or **Nameservers**).
4. Select **Custom Nameservers**.
5. Enter the two Cloudflare nameservers provided in Step 1.
6. Save changes. *(DNS propagation typically takes anywhere from 5 minutes to a couple of hours).*

### Step 3: Link Custom Domain in Cloudflare Pages
1. Go to your Cloudflare Pages project > **Custom domains**.
2. Click **Set up a custom domain**.
3. Enter your apex domain (e.g. `savethiskick.com`) and/or `www.savethiskick.com`.
4. Click **Continue**. Cloudflare automatically adds the appropriate CNAME records pointing to your Pages project.

### Step 4: Enforce HTTPS & Edge Caching
In Cloudflare:
- **SSL/TLS Mode:** Set to **Full (strict)** under **SSL/TLS** > **Overview**.
- **Edge Certificates:**
  - Turn **Always Use HTTPS** to **ON**.
  - Turn **Automatic HTTPS Rewrites** to **ON**.
  - Minimum TLS version: **TLS 1.2**.
- The `public/_headers` file already provides caching rules:
  - Static images and CSS: 1 year cache (`max-age=31536000, immutable`).
  - `/sitemap.xml` and `/robots.txt`: 1 hour cache (`max-age=3600`).
  - API routes (`/api/*`): edge cache bypass to prevent stale chunks.

---

## 4. Google Search Console & Instant Indexing Guide

Google Search Console (GSC) is essential for monitoring search traffic, submitting your sitemap, and ensuring all pSEO streamer pages get indexed.

### Step 1: Add Property in Google Search Console
1. Go to [Google Search Console](https://search.google.com/search-console).
2. Click **Add property**.
3. Choose **Domain** property type (recommended) and enter `savethiskick.com`.
4. Google will supply a DNS TXT verification record (e.g. `google-site-verification=AbCdEf12345...`).

### Step 2: Add TXT Record in Cloudflare DNS
1. In Cloudflare Dashboard, open your domain and click **DNS** > **Records** > **Add record**.
2. **Type:** `TXT`
3. **Name:** `@` (or your domain)
4. **Content:** `google-site-verification=AbCdEf12345...`
5. Click **Save**.
6. Return to Google Search Console and click **Verify**. Verification is typically instantaneous!
*(Alternatively, copy the verification code string into your `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` environment variable in Cloudflare Pages).*

### Step 3: Submit the Dynamic Sitemap
1. In Google Search Console, click **Sitemaps** in the left sidebar.
2. Under "Add a new sitemap", enter:
   `sitemap.xml`
3. Click **Submit**.
4. Status will change to **Success**. Google will now begin discovering and crawling all 180+ programmatic SEO routes.

---

## 5. Advanced pSEO (Programmatic SEO) Architecture

SaveThisKick includes an automated programmatic SEO engine that captures high-volume search traffic across multiple search intents:

### 1. High-Value Dedicated Tool Hubs (`/tools/*`):
- `/tools/kick-vod-downloader` (Target: "Kick VOD Downloader", "download kick vods")
- `/tools/kick-clips-downloader` (Target: "Kick Clip Downloader", "save kick clips hd")
- `/tools/kick-audio-mp3-extractor` (Target: "Kick to MP3", "extract kick audio")
- `/tools/kick-to-mpg-1080p` (Target: "Kick to MPG 1080p", "play kick vod on windows player")
- `/tools/download-kick-stream-without-buffering` (Target: "fast kick downloader no lag")
- `/tools/kick-past-broadcasts-saver` (Target: "save kick past broadcasts")
- `/tools/kick-m3u8-downloader` (Target: "kick m3u8 stream parser")
- `/tools/kick-vod-to-mp4-converter` (Target: "convert kick stream to video")
- Device-specific pages: `/tools/download-kick-vod-iphone-ios`, `/tools/download-kick-vod-android`, `/tools/download-kick-vod-mac-pc`

### 2. Top 60+ Streamer Search Matrices (`/download/*` and `/streamer/*`):
- Dynamic routes for major broadcasters:
  - `/download/xqc-vod`, `/streamer/xqc`, `/download/xqc-clips`
  - `/download/adinross-vod`, `/streamer/adinross`, `/download/adinross-clips`
  - `/download/westcol-vod`, `/streamer/westcol`
  - `/download/trainwreckstv-vod`, `/streamer/trainwreckstv`
  - Plus Hikaru, Roshtein, N3on, Amouranth, Fousey, Vitaly, Mellstroy, BruceDropEmOff, DrDisrespect, PlaqueBoyMax, and 50+ more.
- Each URL automatically resolves into a fully functional downloader pre-loaded with the broadcaster's stream link and renders unique, high-intent OpenGraph cards, Twitter cards, and Schema.org BreadcrumbList / WebPage structured data.

---

## 6. Pre-Launch Verification Checklist

Before announcing your site, verify:
- [ ] `npm run build` succeeds locally without warnings.
- [ ] Visit `https://yourdomain.com/sitemap.xml` in your browser and confirm all routes and domain URLs render cleanly.
- [ ] Visit `https://yourdomain.com/robots.txt` and confirm Googlebot and sitemap location are visible.
- [ ] Run a test download with a live Kick URL or past VOD.
- [ ] In Google Search Console, use **URL Inspection** on `https://yourdomain.com` and click **Request Indexing** to fast-track your homepage indexing.

