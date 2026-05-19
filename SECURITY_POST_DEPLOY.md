# Post-Deployment Security Verification

After deploying your site to production, you MUST run through this checklist to ensure all security measures are active and correctly configured.

## 1. Middleware Route Protection
- Open an **Incognito/Private** browsing window.
- Navigate to `https://<your-domain>/admin`.
- **Result:** You should be immediately redirected to `https://<your-domain>/admin/login`.

## 2. Secrets Leakage Check
- Open your production website in the browser (e.g., `https://<your-domain>`).
- Open **Developer Tools** (F12 or Right-Click > Inspect).
- Go to the **Network** tab, reload the page, and search the downloaded JS files for your secret keys (or just View Page Source and search):
  - Search for your `SUPABASE_SERVICE_ROLE_KEY`.
  - Search for your `CLOUDINARY_API_SECRET`.
- **Result:** These keys MUST NOT be found in any client-side bundles. (They should only exist on the server).

## 3. Supabase RLS Verification
Sometimes policies can drift or get accidentally disabled during development.
- Go to your Supabase Dashboard > Authentication > Policies.
- Check the `projects`, `certificates`, and `feed_entries` tables.
- **Result:** Ensure RLS is **ENABLED** for all three tables. Ensure the only active policies allow `SELECT` (read) access for anon/public users. There should be NO open `INSERT`, `UPDATE`, or `DELETE` policies.

## 4. Rate Limiting Check
- If you implemented rate-limiting in your Next.js middleware, spam-refresh the `/admin/login` page or an API route.
- **Result:** You should eventually hit a `429 Too Many Requests` response.

If any of these checks fail, your site is vulnerable. Re-check your environment variables and middleware configuration before publicizing the link.
