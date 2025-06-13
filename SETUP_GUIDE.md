# Samvaad Theatre Group - Setup Guide

## Quick Fix for Login Issues

If you're getting "Access denied" error, follow these steps:

### 1. **Add Your Email to Admin List**

Your email has been added to the admin list in `src/context/AuthContext.tsx`:
```javascript
const ADMIN_EMAILS = [
  'admin@samvaadtheatre.com',
  'admin@example.com',
  'devteotia@gmail.com', // Your email is here
  'admin@gmail.com',
  'administrator@samvaadtheatre.com',
];
```

### 2. **Create Supabase Account and Project**

1. Go to [supabase.com](https://supabase.com)
2. Sign up and create a new project
3. Get your project URL and anon key from Settings > API

### 3. **Set Up Environment Variables**

Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. **Set Up Database**

#### Option A: Using Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the migration files from `supabase/migrations/` in order:
   - `20250603110317_wispy_beacon.sql`
   - `20250607095508_mellow_lab.sql`
   - `20250613142702_fancy_wave.sql`
   - `20250613150000_complete_setup.sql`
   - `20250613151000_admin_users.sql`

#### Option B: Using Supabase CLI
```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-id

# Push migrations
supabase db push
```

### 5. **Create Admin User in Supabase**

1. Go to Authentication > Users in your Supabase dashboard
2. Click "Add User"
3. Enter your email and password
4. The user will automatically have admin access

### 6. **Test the Login**

1. Start the development server: `npm run dev`
2. Go to `/login`
3. Use your email and password
4. You should now be able to access the admin dashboard

## Troubleshooting

### "Access denied" Error
- Make sure your email is in the `ADMIN_EMAILS` array
- Check that you're using the correct email/password
- Verify your Supabase project is properly configured

### Database Connection Issues
- Check your environment variables are correct
- Ensure your Supabase project is active
- Verify the database migrations have been run

### Real-time Issues
- Check that real-time is enabled in your Supabase project
- Go to Database > Replication in Supabase dashboard
- Enable real-time for all tables

## Admin Email Management

### Add New Admin Users

#### Method 1: Update Code
Add emails to the `ADMIN_EMAILS` array in `src/context/AuthContext.tsx`

#### Method 2: Use Database
Insert into the `admin_users` table:
```sql
INSERT INTO admin_users (email, name, is_active) 
VALUES ('newadmin@example.com', 'New Admin', true);
```

### Remove Admin Access
```sql
UPDATE admin_users 
SET is_active = false 
WHERE email = 'admin@example.com';
```

## Security Features

- **Row Level Security (RLS)**: All tables have RLS enabled
- **Admin-only Access**: Admin dashboard requires authentication
- **Email Validation**: Only authorized emails can access admin area
- **Session Management**: Automatic session refresh and logout

## Performance Optimizations

- **Database Indexes**: Optimized queries for better performance
- **Real-time Sync**: Efficient real-time updates
- **Caching**: Optimized data fetching
- **Fast Logout**: Immediate state clearing for better UX

## Support

If you continue to have issues:

1. Check the browser console for error messages
2. Verify your Supabase project settings
3. Ensure all migrations have been applied
4. Check that your email is in the admin list

## Default Admin Credentials

For testing purposes, you can use:
- Email: `admin@samvaadtheatre.com`
- Password: (set in Supabase dashboard)

**Important**: Change the default password after first login! 