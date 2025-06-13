import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Camera, Users, Mail, MessageCircle, Activity, TrendingUp, Eye, RefreshCw, Plus, BarChart3, LogOut, Database } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useRealtimeSync } from '../../hooks/useRealtimeSync';
import { useNotification } from '../../hooks/useNotification';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    events: 0,
    galleryItems: 0,
    teamMembers: 0,
    messages: 0,
    upcomingEvents: 0,
    coreTeamMembers: 0,
    unreadMessages: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('connecting');
  const { addNotification } = useNotification();
  const { signOut, user } = useAuth();

  // Real-time synchronization for all tables
  useRealtimeSync({
    table: 'events',
    onInsert: () => {
      fetchStats();
      fetchRecentActivity();
    },
    onUpdate: () => fetchStats(),
    onDelete: () => fetchStats(),
    showNotifications: false
  });

  useRealtimeSync({
    table: 'gallery',
    onInsert: () => {
      fetchStats();
      fetchRecentActivity();
    },
    onUpdate: () => fetchStats(),
    onDelete: () => fetchStats(),
    showNotifications: false
  });

  useRealtimeSync({
    table: 'team_members',
    onInsert: () => {
      fetchStats();
      fetchRecentActivity();
    },
    onUpdate: () => fetchStats(),
    onDelete: () => fetchStats(),
    showNotifications: false
  });

  useRealtimeSync({
    table: 'messages',
    onInsert: () => {
      fetchStats();
      fetchRecentActivity();
    },
    onUpdate: () => fetchStats(),
    onDelete: () => fetchStats(),
    showNotifications: false
  });

  useEffect(() => {
    initializeDashboard();
  }, []);

  const initializeDashboard = async () => {
    setConnectionStatus('connecting');
    try {
      await Promise.all([fetchStats(), fetchRecentActivity()]);
      setConnectionStatus('connected');
    } catch (error) {
      console.error('Dashboard initialization error:', error);
      setConnectionStatus('disconnected');
      addNotification({
        type: 'error',
        title: 'Connection Error',
        message: 'Failed to connect to database. Some features may not work properly.'
      });
    }
  };

  const fetchStats = async () => {
    try {
      const [
        { count: eventsCount },
        { count: upcomingEventsCount },
        { count: galleryCount },
        { count: teamCount },
        { count: coreTeamCount },
        { count: messagesCount },
        { count: unreadMessagesCount }
      ] = await Promise.all([
        supabase.from('events').select('*', { count: 'exact', head: true }),
        supabase.from('events').select('*', { count: 'exact', head: true }).eq('is_upcoming', true),
        supabase.from('gallery').select('*', { count: 'exact', head: true }),
        supabase.from('team_members').select('*', { count: 'exact', head: true }),
        supabase.from('team_members').select('*', { count: 'exact', head: true }).eq('is_core', true),
        supabase.from('messages').select('*', { count: 'exact', head: true }),
        supabase.from('messages').select('*', { count: 'exact', head: true }).eq('is_read', false)
      ]);

      setStats({
        events: eventsCount || 0,
        galleryItems: galleryCount || 0,
        teamMembers: teamCount || 0,
        messages: messagesCount || 0,
        upcomingEvents: upcomingEventsCount || 0,
        coreTeamMembers: coreTeamCount || 0,
        unreadMessages: unreadMessagesCount || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      addNotification({
        type: 'error',
        title: 'Error Loading Stats',
        message: 'Failed to load dashboard statistics.'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const [
        { data: recentEvents },
        { data: recentGallery },
        { data: recentTeam },
        { data: recentMessages }
      ] = await Promise.all([
        supabase.from('events').select('id, title, created_at').order('created_at', { ascending: false }).limit(2),
        supabase.from('gallery').select('id, title, created_at').order('created_at', { ascending: false }).limit(2),
        supabase.from('team_members').select('id, name, created_at').order('created_at', { ascending: false }).limit(2),
        supabase.from('messages').select('id, name, created_at').order('created_at', { ascending: false }).limit(2)
      ]);

      const activity: any[] = [];

      recentEvents?.forEach(event => {
        activity.push({
          icon: Calendar,
          description: `New event "${event.title}" was created`,
          time: event.created_at,
          type: 'event'
        });
      });

      recentGallery?.forEach(item => {
        activity.push({
          icon: Camera,
          description: `New gallery item "${item.title}" was added`,
          time: item.created_at,
          type: 'gallery'
        });
      });

      recentTeam?.forEach(member => {
        activity.push({
          icon: Users,
          description: `New team member "${member.name}" was added`,
          time: member.created_at,
          type: 'team'
        });
      });

      recentMessages?.forEach(message => {
        activity.push({
          icon: MessageCircle,
          description: `New message received from ${message.name}`,
          time: message.created_at,
          type: 'message'
        });
      });

      // Sort by time and take the most recent 5
      activity.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
      setRecentActivity(activity.slice(0, 5));

    } catch (error) {
      console.error('Error fetching recent activity:', error);
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    await Promise.all([fetchStats(), fetchRecentActivity()]);
    setLastRefresh(new Date());
    addNotification({
      type: 'success',
      title: 'Dashboard Refreshed',
      message: 'All data has been updated successfully.'
    });
  };

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      await signOut();
      addNotification({
        type: 'info',
        title: 'Logged Out',
        message: 'You have been successfully logged out.'
      });
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold">Admin Dashboard</h2>
          <div className="flex items-center gap-4 mt-1">
            <p className="text-gray-400 text-sm">
              Welcome back, {user?.email?.split('@')[0]}
            </p>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                connectionStatus === 'connected' ? 'bg-green-400' : 
                connectionStatus === 'connecting' ? 'bg-yellow-400' : 'bg-red-400'
              }`}></div>
              <span className={`text-xs ${
                connectionStatus === 'connected' ? 'text-green-400' : 
                connectionStatus === 'connecting' ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {connectionStatus === 'connected' ? 'Real-time Connected' : 
                 connectionStatus === 'connecting' ? 'Connecting...' : 'Disconnected'}
              </span>
            </div>
          </div>
          <p className="text-gray-500 text-xs">
            Last updated: {lastRefresh.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={handleRefresh}
            disabled={loading}
            className="text-gray-300 hover:text-white flex items-center disabled:opacity-50 px-3 py-2 bg-dark-300 rounded-md transition-colors"
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button 
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md flex items-center transition-colors"
          >
            <LogOut className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      ) : (
        <>
          {/* Main Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-dark-300 p-4 sm:p-6 rounded-lg hover:bg-dark-200 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary-500/20 flex items-center justify-center">
                  <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-primary-500" />
                </div>
                <div className="text-right">
                  <p className="text-2xl sm:text-3xl font-bold">{stats.events}</p>
                  <p className="text-xs sm:text-sm text-gray-400">Total Events</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <span className="text-xs sm:text-sm text-green-400">
                  {stats.upcomingEvents} upcoming
                </span>
                <Link to="/admin/events" className="text-primary-500 text-xs sm:text-sm hover:underline">
                  Manage →
                </Link>
              </div>
            </div>
            
            <div className="bg-dark-300 p-4 sm:p-6 rounded-lg hover:bg-dark-200 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary-500/20 flex items-center justify-center">
                  <Camera className="h-5 w-5 sm:h-6 sm:w-6 text-primary-500" />
                </div>
                <div className="text-right">
                  <p className="text-2xl sm:text-3xl font-bold">{stats.galleryItems}</p>
                  <p className="text-xs sm:text-sm text-gray-400">Gallery Items</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <span className="text-xs sm:text-sm text-blue-400">
                  <Eye className="h-3 w-3 inline mr-1" />
                  Public gallery
                </span>
                <Link to="/admin/gallery" className="text-primary-500 text-xs sm:text-sm hover:underline">
                  Manage →
                </Link>
              </div>
            </div>
            
            <div className="bg-dark-300 p-4 sm:p-6 rounded-lg hover:bg-dark-200 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary-500/20 flex items-center justify-center">
                  <Users className="h-5 w-5 sm:h-6 sm:w-6 text-primary-500" />
                </div>
                <div className="text-right">
                  <p className="text-2xl sm:text-3xl font-bold">{stats.teamMembers}</p>
                  <p className="text-xs sm:text-sm text-gray-400">Team Members</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <span className="text-xs sm:text-sm text-yellow-400">
                  {stats.coreTeamMembers} core members
                </span>
                <Link to="/admin/team" className="text-primary-500 text-xs sm:text-sm hover:underline">
                  Manage →
                </Link>
              </div>
            </div>
            
            <div className="bg-dark-300 p-4 sm:p-6 rounded-lg hover:bg-dark-200 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary-500/20 flex items-center justify-center">
                  <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-primary-500" />
                </div>
                <div className="text-right">
                  <p className="text-2xl sm:text-3xl font-bold">{stats.messages}</p>
                  <p className="text-xs sm:text-sm text-gray-400">Messages</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <span className="text-xs sm:text-sm text-red-400">
                  {stats.unreadMessages} unread
                </span>
                <Link to="/admin/settings" className="text-primary-500 text-xs sm:text-sm hover:underline">
                  View →
                </Link>
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-dark-300 p-4 rounded-lg">
              <div className="flex items-center">
                <Database className="h-6 w-6 sm:h-8 sm:w-8 text-green-400 mr-3" />
                <div>
                  <p className="text-base sm:text-lg font-semibold">Database Status</p>
                  <p className="text-xs sm:text-sm text-green-400">Connected & Synced</p>
                </div>
              </div>
            </div>
            
            <div className="bg-dark-300 p-4 rounded-lg">
              <div className="flex items-center">
                <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400 mr-3" />
                <div>
                  <p className="text-base sm:text-lg font-semibold">Real-time Updates</p>
                  <p className="text-xs sm:text-sm text-blue-400">
                    {connectionStatus === 'connected' ? 'Active' : 'Inactive'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-dark-300 p-4 rounded-lg">
              <div className="flex items-center">
                <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-purple-400 mr-3" />
                <div>
                  <p className="text-base sm:text-lg font-semibold">Total Records</p>
                  <p className="text-xs sm:text-sm text-purple-400">
                    {stats.events + stats.galleryItems + stats.teamMembers + stats.messages} items
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Recent Activity */}
          <div className="bg-dark-300 rounded-lg p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
              <div className="flex items-center">
                <Activity className="h-5 w-5 text-primary-500 mr-2" />
                <h3 className="text-lg sm:text-xl font-bold">Recent Activity</h3>
              </div>
              <button 
                onClick={fetchRecentActivity}
                className="text-gray-400 hover:text-white text-sm self-start sm:self-auto"
              >
                Refresh
              </button>
            </div>
            
            {recentActivity.length === 0 ? (
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">No recent activity</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex border-b border-dark-200 pb-3 last:border-0">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-dark-400 flex items-center justify-center mr-3 flex-shrink-0">
                      <activity.icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm sm:text-base truncate">{activity.description}</p>
                      <p className="text-gray-400 text-xs sm:text-sm">{formatTimeAgo(activity.time)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Quick Actions */}
          <div className="bg-dark-300 rounded-lg p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-bold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <Link 
                to="/admin/events"
                className="bg-primary-500 hover:bg-primary-600 text-white p-3 sm:p-4 rounded-md transition-colors text-center"
              >
                <Calendar className="h-5 w-5 sm:h-6 sm:w-6 mx-auto mb-2" />
                <span className="block text-xs sm:text-sm font-medium">Add Event</span>
              </Link>
              
              <Link 
                to="/admin/gallery"
                className="bg-dark-400 hover:bg-dark-500 text-white p-3 sm:p-4 rounded-md transition-colors text-center"
              >
                <Camera className="h-5 w-5 sm:h-6 sm:w-6 mx-auto mb-2" />
                <span className="block text-xs sm:text-sm font-medium">Add Media</span>
              </Link>
              
              <Link 
                to="/admin/team"
                className="bg-dark-400 hover:bg-dark-500 text-white p-3 sm:p-4 rounded-md transition-colors text-center"
              >
                <Users className="h-5 w-5 sm:h-6 sm:w-6 mx-auto mb-2" />
                <span className="block text-xs sm:text-sm font-medium">Add Member</span>
              </Link>
              
              <Link 
                to="/admin/settings"
                className="bg-dark-400 hover:bg-dark-500 text-white p-3 sm:p-4 rounded-md transition-colors text-center"
              >
                <Mail className="h-5 w-5 sm:h-6 sm:w-6 mx-auto mb-2" />
                <span className="block text-xs sm:text-sm font-medium">Messages</span>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;