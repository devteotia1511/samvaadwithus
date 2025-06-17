# Samvaad Theatre Group – Minimal Fullstack Setup

## 1. Database (Supabase)

- Tables: `events`, `gallery`, `team_members`, `messages`, `departments`, `admin_users`
- RLS: Public read, authenticated full CRUD, public insert for messages
- Admin email seeded: `devteotia1511@gmail.com`
- See `supabase/migrations/20240614_initial_setup.sql` for full schema

## 2. Environment Variables

Add these to your `.env`:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 3. Running Locally

```bash
npm install
npm run build
npm run preview
```

## 4. Deployment

- Deploy to Netlify/Vercel
- Set the same environment variables in the dashboard

## 5. CRUD Operations

- All CRUD for events, gallery, team, messages, departments, admin users is handled via Supabase
- Admin panel uses Supabase JS client for all operations
- RLS ensures only authenticated users can create/update/delete

## 6. Troubleshooting

- If CRUD fails, check:
  - You are logged in as an admin
  - RLS policies are applied (see migration)
  - Environment variables are correct
  - Supabase project is active

## 7. Support

- For any issues, check browser console and Supabase logs
- If you need to reset, re-run the migration in Supabase SQL editor 