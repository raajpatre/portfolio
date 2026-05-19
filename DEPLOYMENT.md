# Deployment Guide for Raaj Patre Portfolio

Follow these steps to deploy your portfolio website to Vercel.

## 1. Push to GitHub
1. Create a private repository on GitHub.
2. Initialize and push your code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

## 2. Connect to Vercel
1. Log in to [Vercel](https://vercel.com).
2. Click **Add New...** > **Project**.
3. Import your newly created GitHub repository.

## 3. Configure Environment Variables
Before clicking Deploy, open the **Environment Variables** section and add **ALL** variables from your local `.env.local` file for both **Production** and **Preview** environments:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (Must be secret)
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- `NEXT_PUBLIC_CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET` (Must be secret)
- `ADMIN_EMAIL`

## 4. Deploy
1. Ensure the Framework Preset is set to **Next.js**.
2. Click **Deploy**. Vercel will build and assign a `.vercel.app` domain.

## 5. Add Custom Domain
1. In the Vercel project dashboard, go to **Settings** > **Domains**.
2. Enter your custom domain (e.g., `raaj.me`) and click **Add**.
3. Vercel will provide DNS records (usually an `A` record pointing to `76.76.21.21` or a `CNAME` pointing to `cname.vercel-dns.com`).

## 6. Configure DNS at Registrar
1. Log in to your domain registrar (e.g., GoDaddy, Namecheap, Cloudflare).
2. Add the DNS records provided by Vercel.
3. Wait for the DNS to propagate (can take a few minutes to a few hours).

## 7. Verification
1. Vercel will automatically provision an SSL certificate once DNS is verified.
2. Visit `https://raaj.me` and verify that `www.raaj.me` redirects correctly to your apex domain (or vice-versa, depending on your Vercel settings).
