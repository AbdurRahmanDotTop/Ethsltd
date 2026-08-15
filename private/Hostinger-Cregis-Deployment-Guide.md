# Hostinger Shared Hosting - Cregis Proxy Deployment Guide

Ye guide step-by-step explain karti hai ki aap apne Hostinger account (`ethsltd.techilyfly.com`) par **Cregis PHP Proxy** ko kaise manually host aur configure kar sakte hain taaki Cloudflare Workers ki dynamic IP bypass ho sake aur real deposits & withdrawals securely kaam karein.

---

## Step 1: Proxy File Ko Apne Computer Par Save Karein

1. Apne VS Code (ya kisi bhi text editor) mein `services/cregis-proxy/index.php` file ko open karein.
2. Is file ka poora code copy karein (CTRL+C).
3. Apne computer par Desktop par ek nayi file banayein jiska naam rakhein `cregis-proxy.php`.
4. Copy kiya hua code is `cregis-proxy.php` mein paste karein aur save (CTRL+S) kar dein.

*(Note: Is file mein aapki **Payment Engine** aur **WaaS** ki dono API Keys aur Project IDs already securely embed kiye gaye hain. Aapko file mein kuch bhi type karne ki zaroorat nahi hai).*

---

## Step 2: Hostinger hPanel Par File Upload Karein

1. Apne Hostinger account (hPanel) mein login karein.
2. Apni hosting profile/website (`ethsltd.techilyfly.com`) par click karein aur uske **Dashboard** mein jayein.
3. Left-side menu mein **"Files"** section dhoondein aur **"File Manager"** par click karein.
4. File Manager khulne ke baad, `public_html` folder par double-click karke use open karein. 
   *(Ye wo folder hota hai jahan aapki website ki main files hoti hain).*
5. `public_html` folder ke andar rehte hue, upar right side mein **"Upload"** icon (Upar ki taraf arrow bana hoga) par click karein aur **"File"** choose karein.
6. Apne computer se wo `cregis-proxy.php` file select karein jo aapne Step 1 mein banayi thi aur upload hone dein.

---

## Step 3: Deployment Verify Karein

1. Apne web browser mein ek naya tab kholein.
2. URL bar mein ye address type karein: `https://ethsltd.techilyfly.com/cregis-proxy.php` aur Enter press karein.
3. Agar file sahi se upload hui hai, toh aapko browser screen par kuch aisi error JSON message dikhegi:
   ```json
   {"error":"Unauthorized access to proxy"}
   ```
   *(Ye ek **ACCHI BAAT HAI**. Iska matlab hai script zinda hai aur secure hai, ye bina secret token ke kisi ko access nahi de rahi).*

---

## Step 4: Cregis Dashboard Mein IP Whitelist Karein

1. **Cregis Dashboard** mein login karein.
2. Apne **Payment Engine** project ki settings mein jayein -> **Security** ya **API Whitelist** section dhoondein.
3. Wahan apne Hostinger ka Shared IP address: `145.79.58.207` add karein.
4. Same procedure apne **WaaS** (Wallet as a Service) project ke dashboard mein bhi jaakar follow karein aur wahan bhi `145.79.58.207` add karein.

---

## Step 5: Cloudflare (Production) Backend Variables Configure Karein

Cregis Proxy successfully host ho chuka hai. Ab bas Cloudflare ko batana hai ki Cregis se directly baat karne ke bajaye, us proxy se baat kare.

1. Agar aap **Local Development** kar rahe hain:
   `apps/api/.dev.vars` (aur backend ke `.dev.vars`) mein check karein ki ye dono lines mojud hain:
   ```env
   CREGIS_PROXY_URL="https://ethsltd.techilyfly.com/cregis-proxy.php"
   CREGIS_PROXY_SECRET="ETHSLTD_CREGIS_PROXY_SECURE_TOKEN_2026"
   ```

2. Agar aap **Cloudflare Dashboard (Production)** par hain:
   - Cloudflare dashboard mein login karein -> **Workers & Pages** -> Apne Backend Worker ko select karein.
   - **Settings** -> **Variables and Secrets** mein jayein.
   - Naye variables add karein:
     - **Name:** `CREGIS_PROXY_URL` | **Value:** `https://ethsltd.techilyfly.com/cregis-proxy.php`
     - **Name:** `CREGIS_PROXY_SECRET` | **Value:** `ETHSLTD_CREGIS_PROXY_SECURE_TOKEN_2026`
   - Save karke deploy kar dein.

---

### Badi Badhai Ho! 🎉
Ab aapke platform se hone wale saare Cregis Deposits (Payment Engine) aur Withdrawals (WaaS) pehle Hostinger ke server par jayenge aur wahan se stable IP (`145.79.58.207`) le kar Cregis server tak jayenge. Ye system 100% stable aur secure hai.
