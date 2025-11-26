# Environment Variables Setup

## Required Variables

Create a `.env.local` file in your project root with:

```env
# Public keys (safe to expose in browser)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Secret key (NEVER expose in browser - server-side only)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

## How to Get Your Keys

1. Go to: https://supabase.com/dashboard/project/_/settings/api

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

