# ETHSLTD Deployment Guide

This guide covers how to deploy the ETHSLTD monorepo to Cloudflare Workers using OpenNext.
Due to native `.node` module dependencies like `sharp` used by OpenNext and Next.js, building the deployment bundle natively on Windows is **not fully supported** and often fails. 

You must build the production deployment using a Linux environment. There are two recommended approaches:

---

## 1. Automated Deployment via GitHub Actions (Recommended)

We have configured a CI/CD pipeline in `.github/workflows/deploy-web.yml`. 
This workflow will automatically spin up a Linux environment, build your Next.js application, and deploy it to Cloudflare every time you push to the `main` branch.

### Setup Instructions
To enable automated deployments, add the following secrets to your GitHub repository (`Settings` > `Secrets and variables` > `Actions`):

- `CLOUDFLARE_API_TOKEN`: Your Cloudflare API token. Ensure it has permissions to edit Workers, Pages, and D1.
- `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare Account ID (found on your Cloudflare dashboard overview).

Once added, any push to the `main` branch will automatically trigger the deployment.

---

## 2. Local Deployment via WSL2 (For Manual Builds)

If you prefer to build and deploy locally from your Windows machine, you **must** use Windows Subsystem for Linux (WSL2).

### Step 1: Install & Setup WSL2
Open your **Administrator PowerShell** on Windows:
```powershell
wsl --install -d Ubuntu
```
Restart your computer if prompted. Then, open the `Ubuntu` terminal.

### Step 2: Install Node.js 22 LTS (inside WSL)
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash
source ~/.bashrc
nvm install 22
nvm use 22
nvm alias default 22
```

### Step 3: Install pnpm & Clone Repository
It is highly recommended to clone your repository directly into the WSL filesystem rather than accessing it through `/mnt/c/`.

```bash
# Enable corepack and pnpm
corepack enable
corepack prepare pnpm@9.0.0 --activate

# Setup project directory
mkdir -p ~/projects
cd ~/projects

# Clone your repo (replace with your actual URL)
git clone https://github.com/your-username/ethsltd.git
cd ethsltd
```

### Step 4: Install Dependencies & Build
Before building, ensure you have a clean slate:
```bash
rm -rf node_modules apps/web/.next apps/web/.open-next
pnpm install --frozen-lockfile

# Login to Cloudflare (this will open a browser on your Windows side)
npx wrangler login
```

Now, navigate to your web app and build the worker:
```bash
cd apps/web
pnpm run build:worker
```

### Step 5: Preview and Deploy
To preview the worker locally before deploying to the live environment:
```bash
pnpm run preview
```
Visit the localhost URL provided to verify your application runs on the Cloudflare runtime.

To deploy to Cloudflare:
```bash
pnpm run deploy
```

---

## Troubleshooting

- **sharp errors on Windows**: If you run `pnpm run build:worker` natively on Windows cmd/PowerShell, it will fail when bundling `sharp`. Always use WSL or GitHub Actions.
- **Node version mismatch**: Ensure you are running Node 22 (`node -v`). Cloudflare Workers prefer modern Node compatibility flags.
- **Outdated wrangler configs**: Ensure `apps/web/wrangler.jsonc` has `nodejs_compat` enabled and a modern `compatibility_date` (e.g., `2026-07-27`).
