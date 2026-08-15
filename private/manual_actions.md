# Manual Actions Required for Production Readiness

Following the bug fixes for the Admin Payment Settings and P2P Real/Demo modes, please perform the following manual actions:

## 1. Refresh Browser & Re-login (If needed)
The Admin Payment Settings page was previously trying to read the authentication token from a key named `"token"`, which was incorrect. It has been updated to use `"ethsltd_auth_token"`. 
- **Action:** Please refresh your browser window on the Admin page. If you still encounter permission issues, log out and log back in to ensure your session token is properly stored.

## 2. Environment Variables configuration
In the Admin Payment Settings page, the API calls are currently defaulting to `http://localhost:8787` if the environment variable is not found:
```javascript
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787';
```
- **Action (For Production):** Ensure that `NEXT_PUBLIC_API_URL` is correctly set in your production environment (e.g., Vercel, `.env.production`).

## 3. Review Simulated Data
- Ensure that you have manually disabled any demo data entries on the admin panel if you are fully shifting to the real environment, as the P2P workspace will now enforce real information when the toggle is set to "Real".
