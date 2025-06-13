# Samvaad Theatre Group - Backend & Database Setup Guide

## 🚀 Quick Setup Instructions

### 1. **Supabase Project Setup**

1. **Create a new Supabase project:**
   - Go to [supabase.com](https://supabase.com)
   - Click "New Project"
   - Choose your organization
   - Enter project name: "samvaad-theatre-group"
   - Set a secure database password
   - Choose a region close to your users

2. **Get your project credentials:**
   - Go to Settings → API
   - Copy your Project URL and anon/public key

### 2. **Environment Configuration**

Create a `.env` file in your project root:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. **Database Setup**

#### Option A: Using Supabase Dashboard (Recommended)
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `supabase/migrations/20250613150000_complete_setup.sql`
4. Run the script

#### Option B: Using Supabase CLI
```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

### 4. **Create Admin User**

1. Go to Authentication → Users in your Supabase dashboard
2. Click "Add User"
3. Create an admin user with one of these emails:
   - `admin@samvaadtheatre.com`
   - `admin@example.com`
4. Set a secure password
5. The user will automatically have admin privileges

### 5. **Test the Setup**

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `/login`
3. Use your admin credentials to log in
4. You should be redirected to `/admin` dashboard

## 🔧 Advanced Configuration

### Customizing Admin Emails

Edit `src/context/AuthContext.tsx` and modify the `ADMIN_EMAILS` array:

```typescript
const ADMIN_EMAILS = [
  'admin@samvaadtheatre.com',
  'admin@example.com',
  'your-email@domain.com', // Add your email
];
```

### Database Schema Details

#### Tables Created:
- **events**: Theatre events and performances
- **gallery**: Images and videos from performances
- **team_members**: Core team and other members
- **messages**: Contact form submissions
- **departments**: Theatre departments

#### Security Features:
- **Row Level Security (RLS)**: Enabled on all tables
- **Public Read Access**: User-facing content is publicly readable
- **Authenticated Write Access**: Only authenticated users can modify data
- **Admin-Only Access**: Admin dashboard requires specific email addresses

### Performance Optimizations

#### Database Indexes:
- Events by date (for sorting)
- Upcoming events (for filtering)
- Gallery by creation date
- Team members by core status
- Unread messages
- Messages by creation date

#### Real-time Features:
- Automatic updates across all connected clients
- Optimistic updates for better UX
- Connection status monitoring
- Automatic reconnection

## 🛡️ Security Features

### Authentication Flow:
1. **Email Validation**: Only pre-approved admin emails can log in
2. **Password Security**: Secure password handling with Supabase Auth
3. **Session Management**: Automatic session refresh and cleanup
4. **Access Control**: Admin-only access to dashboard

### Database Security:
- **RLS Policies**: Row-level security on all tables
- **Permission Grants**: Proper permission setup for public and authenticated users
- **Input Validation**: Server-side validation for all inputs
- **SQL Injection Protection**: Parameterized queries through Supabase

## 🔄 Real-time Data Flow

### How it works:
1. **Admin makes changes** → Data saved to Supabase
2. **Real-time subscription triggers** → All connected clients notified
3. **User pages update automatically** → No page refresh needed
4. **Consistent data across all views** → Single source of truth

### Components using real-time:
- **Admin Dashboard**: All CRUD operations
- **Events Page**: Live event updates
- **Gallery Page**: Real-time media updates
- **Core Team Page**: Live team member updates

## 🚨 Troubleshooting

### Common Issues:

#### 1. **Login not working**
- Check if your email is in the `ADMIN_EMAILS` array
- Verify Supabase credentials in `.env`
- Check browser console for errors

#### 2. **Database connection issues**
- Verify Supabase project is active
- Check network connectivity
- Ensure RLS policies are properly set

#### 3. **Real-time not working**
- Check Supabase real-time is enabled
- Verify subscription permissions
- Check browser console for connection errors

#### 4. **Build errors**
- Run `npm install` to ensure all dependencies
- Check TypeScript errors
- Verify all imports are correct

### Debug Commands:

```bash
# Check Supabase connection
npm run dev

# Build for production
npm run build

# Check for TypeScript errors
npx tsc --noEmit

# Lint code
npm run lint
```

## 📊 Monitoring & Analytics

### Supabase Dashboard Features:
- **Database Performance**: Monitor query performance
- **Authentication Logs**: Track login attempts
- **Real-time Connections**: Monitor active connections
- **Storage Usage**: Track database size

### Application Logging:
- **Console Logs**: Detailed logging for debugging
- **Error Tracking**: Comprehensive error handling
- **Performance Monitoring**: Real-time sync status

## 🔄 Backup & Recovery

### Database Backups:
1. **Automatic Backups**: Supabase provides daily backups
2. **Manual Backups**: Export data through Supabase dashboard
3. **Migration Files**: Keep migration files for schema versioning

### Recovery Procedures:
1. **Restore from Backup**: Use Supabase point-in-time recovery
2. **Re-run Migrations**: Use migration files to rebuild schema
3. **Data Import**: Import sample data from migration files

## 🚀 Production Deployment

### Environment Variables:
```env
VITE_SUPABASE_URL=https://your-production-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-production-anon-key
```

### Build Commands:
```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Deployment Platforms:
- **Vercel**: Recommended for React apps
- **Netlify**: Alternative deployment option
- **GitHub Pages**: Free hosting option

## 📞 Support

### Getting Help:
1. **Check Documentation**: Review this setup guide
2. **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
3. **GitHub Issues**: Create issues for bugs
4. **Community**: Join Supabase Discord

### Contact Information:
- **Email**: admin@samvaadtheatre.com
- **GitHub**: Create issues in the repository
- **Documentation**: Keep this guide updated

---

## ✅ Setup Checklist

- [ ] Supabase project created
- [ ] Environment variables configured
- [ ] Database migration run
- [ ] Admin user created
- [ ] Login tested successfully
- [ ] CRUD operations working
- [ ] Real-time updates working
- [ ] User pages displaying data
- [ ] Security policies verified
- [ ] Performance optimized

**🎉 Congratulations! Your Samvaad Theatre Group website is now fully configured with a robust backend and database system.** 