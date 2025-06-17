# 🔐 Authentication Setup Guide - Step by Step

## Prerequisites
- A Supabase account (free at [supabase.com](https://supabase.com))
- Your email address ready
- Basic understanding of environment variables

---

## Step 1: Create Supabase Project

### 1.1 Sign Up/Login to Supabase
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" or "Sign In"
3. Create an account or login with GitHub/Google

### 1.2 Create New Project
1. Click "New Project"
2. Choose your organization
3. Fill in project details:
   - **Name**: `samvaad-theatre-group`
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to you
4. Click "Create new project"
5. Wait for project to be created (2-3 minutes)

### 1.3 Get Project Credentials
1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - **Anon public key** (starts with `eyJ...`)

---

## Step 2: Configure Environment Variables

### 2.1 Create Environment File
1. In your project root, create a file named `.env`
2. Add your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Example:**
```env
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2.2 Restart Development Server
```bash
# Stop the current server (Ctrl+C)
# Then restart
npm run dev
```

---

## Step 3: Set Up Database Schema

### 3.1 Access SQL Editor
1. In your Supabase dashboard, go to **SQL Editor**
2. Click **"New query"**

### 3.2 Run Database Migrations
Copy and paste each migration file one by one:

#### Migration 1: Initial Schema
```sql
-- Copy content from: supabase/migrations/20250603110317_wispy_beacon.sql
-- (Run this first)
```

#### Migration 2: Complete Setup
```sql
-- Copy content from: supabase/migrations/20250613150000_complete_setup.sql
-- (Run this second)
```

#### Migration 3: Admin Users
```sql
-- Copy content from: supabase/migrations/20250613151000_admin_users.sql
-- (Run this third)
```

### 3.3 Verify Tables Created
1. Go to **Table Editor** in Supabase
2. You should see these tables:
   - `events`
   - `gallery`
   - `team_members`
   - `messages`
   - `departments`
   - `admin_users`

---

## Step 4: Create Admin User

### 4.1 Add User to Authentication
1. Go to **Authentication** → **Users**
2. Click **"Add User"**
3. Fill in details:
   - **Email**: `devteotia@gmail.com` (or your email)
   - **Password**: Create a strong password
4. Click **"Create User"**

### 4.2 Verify Admin Access
1. Go to **SQL Editor**
2. Run this query to check admin users:
```sql
SELECT * FROM admin_users;
```
3. You should see your email in the list

---

## Step 5: Test Authentication

### 5.1 Access Login Page
1. Open your browser
2. Go to: `http://localhost:5173/login`
3. You should see the login form

### 5.2 Login with Your Credentials
1. Enter your email: `devteotia@gmail.com`
2. Enter your password
3. Click **"Sign In"**

### 5.3 Expected Results
- ✅ **Success**: Redirected to `/admin` dashboard
- ❌ **Error**: Check console for error messages

---

## Step 6: Troubleshooting

### 6.1 Common Issues

#### "Access denied" Error
**Solution**: Your email is already in the admin list. Make sure:
- You're using the correct email
- The email is in the `ADMIN_EMAILS` array in `src/context/AuthContext.tsx`

#### "Invalid credentials" Error
**Solution**: 
1. Check your email/password in Supabase Authentication
2. Make sure the user exists in Authentication → Users
3. Try resetting password if needed

#### "Database connection failed" Error
**Solution**:
1. Check your `.env` file has correct credentials
2. Verify Supabase project is active
3. Check internet connection

#### "Tables not found" Error
**Solution**:
1. Make sure all migrations were run successfully
2. Check Table Editor in Supabase
3. Re-run migrations if needed

### 6.2 Debug Steps

#### Check Environment Variables
```bash
# In your terminal, check if .env is loaded
echo $VITE_SUPABASE_URL
```

#### Check Browser Console
1. Open browser developer tools (F12)
2. Go to Console tab
3. Look for error messages
4. Check Network tab for failed requests

#### Check Supabase Logs
1. Go to Supabase dashboard
2. Check **Logs** section
3. Look for authentication errors

---

## Step 7: Verify Everything Works

### 7.1 Test Admin Dashboard
1. Login successfully
2. Navigate through admin sections:
   - Dashboard
   - Events
   - Gallery
   - Team
   - Settings

### 7.2 Test CRUD Operations
1. Go to **Events** section
2. Click **"Add Event"**
3. Fill in details and save
4. Check if it appears in the list

### 7.3 Test User Pages
1. Go to `/events` (public page)
2. Check if events are displayed
3. Verify real-time updates work

---

## Step 8: Security Checklist

### 8.1 Environment Security
- ✅ `.env` file is in `.gitignore`
- ✅ No credentials in code
- ✅ Strong database password

### 8.2 Database Security
- ✅ Row Level Security (RLS) enabled
- ✅ Proper policies in place
- ✅ Admin-only access to admin areas

### 8.3 Authentication Security
- ✅ Strong password policy
- ✅ Email verification (optional)
- ✅ Session management

---

## Quick Commands Reference

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Check environment variables
cat .env

# Check if Supabase is connected
# (Check browser console for connection logs)
```

---

## Support

If you're still having issues:

1. **Check the browser console** for specific error messages
2. **Verify Supabase project** is active and running
3. **Confirm environment variables** are correct
4. **Check database migrations** were applied successfully
5. **Verify admin user** exists in both Authentication and admin_users table

### Contact Information
- Check the browser console for detailed error messages
- Verify all steps were followed correctly
- Ensure Supabase project is in the same region as your location

---

## Success Indicators

You'll know everything is working when:
- ✅ You can login with your email/password
- ✅ You're redirected to the admin dashboard
- ✅ You can see all admin sections (Events, Gallery, Team, Settings)
- ✅ You can create/edit/delete content
- ✅ Changes appear on public pages in real-time
- ✅ No console errors in browser

🎉 **Congratulations!** Your authentication system is now fully functional! 