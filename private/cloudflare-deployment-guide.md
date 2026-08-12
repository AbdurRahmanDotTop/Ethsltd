# Cloudflare Deployment & Continuous Development Guide

This document outlines the step-by-step process for deploying the ETHSLTD Next.js web application to Cloudflare Pages, connecting a custom domain, and establishing a Continuous Development (CI/CD) workflow.

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
