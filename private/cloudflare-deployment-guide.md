# Cloudflare Deployment & Continuous Development Guide

This document outlines the step-by-step process for deploying the ETHSLTD Next.js web application to Cloudflare Pages, connecting a custom domain, and establishing a Continuous Development (CI/CD) workflow.

## Architecture Strategy: Pages vs Workers
Kyuki ye ek **real crypto trading web app** banne wala hai jisme high traffic, fast API responses, aur real-time data chahiye hoga, iska architecture kuch is tarah hona chahiye:

1. **The Frontend & REST API (Deploy on Cloudflare Pages):** 
   - Next.js ki poori frontend UI aur standard API routes ko **Cloudflare Pages** par hi deploy karna sabse best hai. 
   - Cloudflare Pages inherently aapke Next.js Server-Side code ko background mein **Cloudflare Workers** mein convert kar deta hai (via `@cloudflare/next-on-pages`). Iska matlab aapko Pages ki fast static hosting aur Workers ki edge-computing power dono ek sath milte hain.

2. **The Real-Time Trading Engine (Deploy as standalone Cloudflare Workers):**
   - Jab aap live trading shuru karenge, toh order book aur chart data ko milliseconds mein update karne ke liye **WebSockets** ki zarurat padegi.
   - Us real-time WebSocket connection aur Order Matching Engine ko aap ek alag standalone **Cloudflare Worker (ya Durable Objects)** bana kar deploy karenge, jo aapke Pages frontend se connect hoga.

**Nishkarsh (Conclusion):** 
Abhi ke liye, aur aage chal kar bhi, ye poora Next.js project **Cloudflare Pages** par hi publish hoga. Backend Microservices baad mein alag Workers ke roop mein banengi.

---

## Part 1: Automated Continuous Deployment (CI/CD) Setup

The most robust way to deploy to Cloudflare Pages is by connecting your GitHub repository. This gives you automatic deployments on every push.

### Manual Steps for You:
1. **Push your code to GitHub** (if you haven't already):
   Make sure this entire `Ethsltd` folder is pushed to a repository on your GitHub account.

2. **Log into Cloudflare**:
   Go to [dash.cloudflare.com](https://dash.cloudflare.com/) and log in.

3. **Create a Cloudflare Pages Project**:
   - On the left sidebar, click on **Workers & Pages**.
   - Click the **Create application** button.
   - Go to the **Pages** tab and click **Connect to Git**.
   - Select your GitHub account and authorize Cloudflare to access your `Ethsltd` repository.

4. **Configure the Build Settings**:
   - **Project Name**: `ethsltd-web` (or your preference)
   - **Production Branch**: `main` (or `master`)
   - **Framework Preset**: Select **Next.js**
   - **Build Command**: `npx @cloudflare/next-on-pages@1`
   - **Build Output Directory**: `.vercel/output/static`
   - **Root Directory**: `apps/web` (IMPORTANT: Because we are using a Turborepo/monorepo structure, you must specify `apps/web` as the root directory).

5. **Deploy**:
   - Click **Save and Deploy**. Cloudflare will now clone your repo, build the Next.js app using their Edge adapter, and publish it to a `*.pages.dev` URL.

---

## Part 2: Connecting Your Custom Domain

Once the initial deployment is successful and you can see the site on the `*.pages.dev` URL, you can attach your custom domain.

### Manual Steps for You:
1. **Go to your Pages Project in Cloudflare**:
   Navigate to **Workers & Pages** -> **ethsltd-web**.

2. **Add Custom Domain**:
   - Click on the **Custom Domains** tab.
   - Click **Set up a custom domain**.
   - Enter your domain (e.g., `ethsltd.com` or `www.ethsltd.com`).

3. **Update DNS Records**:
   - **If your domain is managed by Cloudflare**: Cloudflare will automatically add the necessary CNAME records to your DNS settings. Just click "Activate domain".
   - **If your domain is managed elsewhere (e.g., GoDaddy, Namecheap)**: Cloudflare will provide you with a CNAME record (e.g., pointing `ethsltd.com` to `ethsltd-web.pages.dev`). Log into your domain registrar, go to DNS settings, and add that CNAME record.

4. **Wait for SSL/TLS**:
   Cloudflare automatically provisions a free SSL certificate for your domain. It may take a few minutes to authorize.

---

## Part 3: Guide for Continuous Development (CI/CD)

Cloudflare Pages natively supports Continuous Integration and Continuous Deployment (CI/CD). Now that you have connected GitHub, your development workflow should look like this:

### 1. Preview Environments (Staging)
When you are working on a new feature, do not push directly to the `main` branch. 
- Create a new branch: `git checkout -b feature/new-design`
- Make your changes and push them to GitHub.
- **Cloudflare Magic**: Cloudflare will automatically detect the new branch and create a **Preview Deployment**. 
- It will generate a unique URL (e.g., `https://feature-new-design.ethsltd-web.pages.dev`) where you and your team can test the changes *before* they go live.

### 2. Production Releases
Once you are happy with the preview deployment:
- Merge your branch into the `main` branch via a GitHub Pull Request.
- Cloudflare will instantly detect the merge, run the build process, and deploy the new version directly to your production custom domain (`ethsltd.com`).

### 3. Environment Variables (Secrets)
If you ever need to add API keys or database connections:
- Do not hardcode them in your code.
- Go to Cloudflare Dashboard -> **Workers & Pages** -> Your Project -> **Settings** -> **Environment variables**.
- Add them there for both `Production` and `Preview` environments.
- In Next.js, access them using `process.env.YOUR_KEY`.

### Summary of Workflow
`Write Code locally` -> `Push to Branch` -> `Test on Preview URL` -> `Merge to Main` -> `Live on Custom Domain`. 
This guarantees a zero-downtime, professional deployment pipeline!

---

## Part 4: Local Testing & Troubleshooting (Optional)

If you want to test how the site will run on Cloudflare's Edge environment *before* pushing to GitHub, you can use the Cloudflare CLI (`wrangler`).

### Local Preview
1. Install Wrangler globally: `npm install -g wrangler`
2. Build the project for Cloudflare: `npx @cloudflare/next-on-pages@1` (Run this inside the `apps/web` folder).
3. Run the local preview: `npx wrangler pages dev .vercel/output/static`

### Common Troubleshooting
- **Build Fails with Node Version Error**: Cloudflare Pages defaults to an older Node.js version. Go to your Pages project -> Settings -> Environment Variables. Add a variable named `NODE_VERSION` and set its value to `20` or `22`.
- **404 Errors on Refresh**: If you ever switch to a purely static export (`output: 'export'` in next.config.js), ensure you don't use server-side features unless you are using `@cloudflare/next-on-pages`. The current setup uses `@cloudflare/next-on-pages` which handles Next.js App Router seamlessly.
- **Custom Domain Pending**: DNS propagation can take anywhere from 5 minutes to 24 hours depending on your registrar. If it's stuck on "Pending" for more than a day, double-check that you added the exact CNAME record Cloudflare provided.
