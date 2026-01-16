# Environment Variables Setup

## Required Variables

Create a `.env.local` file in your project root with:

```env
# Public keys (safe to expose in browser)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY=your-site-key-here

# Secret keys (NEVER expose in browser - server-side only)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
CLOUDFLARE_TURNSTILE_SECRET_KEY=your-secret-key-here
SMTP_USER=your-gmail@gmail.com
SMTP_PASSWORD=your-16-char-app-password
```

## How to Get Your API Keys

### 1. Supabase Keys
Go to: https://supabase.com/dashboard/project/_/settings/api

### 2. Gmail SMTP (Nodemailer)
To send emails using Gmail, you need an **App Password**:
1. Go to your [Google Account Security](https://myaccount.google.com/security).
2. Enable **2-Step Verification**.
3. Search for **"App passwords"** in the top search bar.
4. Select "Other" name it "Nodemailer" and click **Create**.
5. Copy the 16-character password and paste it into `SMTP_PASSWORD`.
6. Use your full Gmail address for `SMTP_USER`.

### 3. Cloudflare Turnstile
Go to the [Cloudflare Dashboard](https://dash.cloudflare.com/) > Turnstile to create your site/secret keys for spam protection.


2. **Project URL** → Copy to `NEXT_PUBLIC_SUPABASE_URL`
   - Example: `https://abcdefghijklmnop.supabase.co`

3. **anon public** key → Copy to `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - This is the "anon" or "public" key (safe to expose)

4. **service_role** key → Copy to `SUPABASE_SERVICE_ROLE_KEY`
   - ⚠️ **SECRET KEY** - Never commit or expose this!
   - Click "Reveal" to see it
   - This is needed for admin operations

## After Adding Variables

1. **Restart your dev server** (important!)
   - Stop: `Ctrl+C`
   - Start: `npm run dev`

2. Verify it works by visiting `/admin/create-admin`

## Security Notes

- ✅ `NEXT_PUBLIC_*` variables are safe to expose
- ❌ `SUPABASE_SERVICE_ROLE_KEY` is SECRET - server-side only
- 🔒 Never commit `.env.local` to git (already in .gitignore)
- 🛡️ Service role key bypasses all security - use carefully!

