# Portfolio Website - Phase 1

## Setup Instructions

1. **Environment Variables**:
   Copy `.env.example` to `.env.local` and fill in the required credentials.
   ```bash
   cp .env.example .env.local
   ```

2. **Supabase Setup**:
   - Create a new project in your Supabase dashboard.
   - Go to the SQL Editor and run the queries found in `SUPABASE_MIGRATION.sql` to initialize the database schema and RLS policies.
   - Get the URL, Anon Key, and Service Role Key from Project Settings > API and add them to `.env.local`.

3. **Cloudinary Setup**:
   - Create a Cloudinary account.
   - Get your Cloud Name, API Key, and API Secret and add them to `.env.local`.
   - Create a signed upload preset or folder named `raaj-portfolio/projects` and `raaj-portfolio/certificates`.

4. **Run Development Server**:
   ```bash
   npm run dev
   ```
