# Samvaad Theatre Group - Website

A modern, responsive website for Samvaad Theatre Group with dynamic content management and real-time data synchronization.

## Features

### 🎭 **Dynamic Content Management**
- **Events Management**: Create, update, and delete events with real-time updates
- **Gallery Management**: Upload and manage images/videos with automatic synchronization
- **Team Management**: Manage core team and other members with detailed profiles
- **Message Management**: Handle contact form submissions and inquiries

### 🔄 **Real-Time Data Flow**
- **Live Updates**: Changes in admin dashboard instantly reflect on user pages
- **Real-Time Sync**: Uses Supabase real-time subscriptions for instant data updates
- **No Mock Data**: All data is dynamically fetched from Supabase database
- **Consistent State**: Centralized data service ensures consistent data handling

### 🛡️ **Admin Dashboard**
- **Secure Access**: Protected admin routes with authentication
- **CRUD Operations**: Full Create, Read, Update, Delete functionality
- **Real-Time Notifications**: Instant feedback for all operations
- **Responsive Design**: Works seamlessly on all devices

### 🎨 **User-Facing Pages**
- **Events Page**: Display upcoming and past events with filtering
- **Gallery Page**: Showcase images and videos with lightbox view
- **Core Team Page**: Display team members with contact information
- **Responsive Design**: Optimized for all screen sizes

## Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **State Management**: React Hooks, Context API
- **UI Components**: Lucide React Icons, Framer Motion
- **Build Tool**: Vite

## Database Schema

### Events Table
```sql
CREATE TABLE events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  date date NOT NULL,
  time text NOT NULL,
  venue text NOT NULL,
  image_url text NOT NULL,
  is_upcoming boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);
```

### Gallery Table
```sql
CREATE TABLE gallery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  media_url text NOT NULL,
  is_video boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);
```

### Team Members Table
```sql
CREATE TABLE team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  title text NOT NULL,
  phone text,
  email text,
  photo_url text,
  is_core boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);
```

### Messages Table
```sql
CREATE TABLE messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);
```

## Data Flow Architecture

### 1. **Admin Operations**
```
Admin Dashboard → Data Service → Supabase → Real-time Updates → User Pages
```

### 2. **Real-Time Synchronization**
- **Admin Dashboard**: Uses `useRealtimeSync` hook with notifications enabled
- **User Pages**: Uses `useRealtimeSync` hook with notifications disabled
- **Automatic Updates**: Changes reflect instantly across all connected clients

### 3. **Data Service Layer**
- **Centralized Operations**: All database operations go through `dataService`
- **Error Handling**: Consistent error handling and user feedback
- **Type Safety**: Full TypeScript support for all data operations

## Key Components

### Admin Components
- `AdminEvents.tsx`: Manage events with full CRUD operations
- `AdminGallery.tsx`: Manage gallery items with image/video support
- `AdminTeam.tsx`: Manage team members with core/other distinction
- `AdminDashboard.tsx`: Overview and statistics
- `AdminSettings.tsx`: System configuration

### User Pages
- `Events.tsx`: Display events with filtering and real-time updates
- `Gallery.tsx`: Showcase media with lightbox and real-time updates
- `Core.tsx`: Display team members with real-time updates
- `Home.tsx`: Landing page with dynamic content
- `JoinUs.tsx`: Contact form with message management

### Hooks
- `useRealtimeSync.ts`: Real-time data synchronization
- `useNotification.ts`: Toast notifications system
- `useAuth.ts`: Authentication context

## Setup Instructions

### 1. **Environment Variables**
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. **Install Dependencies**
```bash
npm install
```

### 3. **Database Setup**
Run the migration files in `supabase/migrations/` to set up the database schema.

### 4. **Start Development Server**
```bash
npm run dev
```

## CRUD Operations

### Events
- **Create**: Add new events with title, description, date, time, venue, and image
- **Read**: Fetch all events with automatic sorting by date
- **Update**: Modify existing events with validation
- **Delete**: Remove events with confirmation

### Gallery
- **Create**: Add new gallery items (images/videos) with title and media URL
- **Read**: Fetch all gallery items with automatic sorting
- **Update**: Modify existing gallery items
- **Delete**: Remove gallery items with confirmation

### Team Members
- **Create**: Add team members with core/other distinction
- **Read**: Fetch all team members with automatic filtering
- **Update**: Modify existing team members
- **Delete**: Remove team members with confirmation

### Messages
- **Create**: Submit contact form messages
- **Read**: View all messages in admin dashboard
- **Update**: Mark messages as read
- **Delete**: Remove messages

## Real-Time Features

### Automatic Updates
- When admin creates/updates/deletes content, user pages update instantly
- No page refresh required
- Optimistic updates for better user experience

### Connection Status
- Real-time connection monitoring
- Automatic reconnection on network issues
- Graceful fallback to polling if needed

## Security Features

### Row Level Security (RLS)
- Public read access for user-facing content
- Authenticated user access for admin operations
- Secure message handling

### Authentication
- Supabase Auth integration
- Protected admin routes
- Session management

## Performance Optimizations

### Data Loading
- Lazy loading of components
- Efficient data fetching with proper error handling
- Optimized re-renders with React hooks

### Real-Time Efficiency
- Single subscription per table
- Automatic cleanup on component unmount
- Efficient state updates

## Error Handling

### User-Friendly Messages
- Clear error notifications
- Validation feedback
- Graceful fallbacks

### Developer Logging
- Comprehensive error logging
- Debug information for troubleshooting
- Performance monitoring

## Future Enhancements

### Planned Features
- Image upload with Supabase Storage
- Advanced filtering and search
- Analytics dashboard
- Email notifications
- Multi-language support

### Technical Improvements
- Caching layer implementation
- Offline support
- Progressive Web App features
- Advanced real-time features

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository. 