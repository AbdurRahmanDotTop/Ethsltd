# DNS Propagation & Local Caching Troubleshooting

If the domains (`ethsltd.com`, `www.ethsltd.com`, or `api.ethsltd.com`) are pointing to the old Hostinger website or showing SSL/NXDOMAIN errors after deploying to Cloudflare Workers, this is due to **Local DNS Caching**. The computer or ISP is still holding onto the old Hostinger IP addresses (`145.79.58.207`) instead of the new Cloudflare IPs.

## Steps to Fix / Verify

### 1. Flush DNS Cache (Windows)
1. Open the **Start** menu and type `cmd` to open the **Command Prompt**.
2. Run the following command and press Enter:
   ```cmd
   ipconfig /flushdns
   ```
3. Completely close and reopen your browser, then try accessing the site again.

### 2. Test on Mobile Data
1. Turn **OFF** WiFi on your mobile phone.
2. Turn **ON** Mobile Data (4G/5G).
3. Open an incognito/private tab in your mobile browser.
4. Visit `https://ethsltd.com` and `https://api.ethsltd.com`.
*Why this works: Mobile networks update their DNS records much faster than local broadband ISPs.*

### 3. Change Local DNS to Cloudflare (1.1.1.1) or Google (8.8.8.8)
If flushing doesn't work, your ISP's DNS servers might be slow to update. You can manually change your computer's DNS:
1. Open **Network Connections** (press `Win + R`, type `ncpa.cpl`, hit Enter).
2. Right-click your active connection (Wi-Fi or Ethernet) and select **Properties**.
3. Double-click **Internet Protocol Version 4 (TCP/IPv4)**.
4. Select **Use the following DNS server addresses** and enter:
   - Preferred: `8.8.8.8` (Google) or `1.1.1.1` (Cloudflare)
   - Alternate: `8.8.4.4` (Google) or `1.0.0.1` (Cloudflare)
5. Click **OK**, flush DNS again, and retry.

### 4. Wait for Global Propagation
If the above steps are not possible, standard DNS propagation takes anywhere from **15 minutes to 24 hours** depending on the region and the ISP's Time-To-Live (TTL) cache limits. Since the global authoritative servers (Google DNS, Cloudflare DNS) are already serving the correct records, it will automatically fix itself over time.

---
**Status Confirmation:**
- **Code:** Both frontend Next.js and API Workers are successfully built and deployed.
- **Cloudflare:** Custom Domains are bound correctly and returning 200 OK via global DNS.
- **Hostinger:** Nameservers have been successfully switched to Cloudflare (`emma.ns.cloudflare.com`, `henry.ns.cloudflare.com`).
