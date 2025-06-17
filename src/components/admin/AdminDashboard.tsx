import { useState, useEffect } from 'react';
import { Calendar, Users, MessageSquare, BarChart3, Plus, Trash2, Edit } from 'lucide-react';
import { dataService } from '../../lib/supabase';
import { useNotification } from '../../hooks/useNotification';
import { useAuth } from '../../context/AuthContext';

interface Stats {
  totalEvents: number;
  upcomingEvents: number;
  totalGalleryItems: number;
  totalTeamMembers: number;
  totalMessages: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats>({
    totalEvents: 0,
    upcomingEvents: 0,
    totalGalleryItems: 0,
    totalTeamMembers: 0,
    totalMessages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [testResult, setTestResult] = useState<string>('');
  const { addNotification } = useNotification();
  const { user, isAdmin } = useAuth();
  const [recentActivity, setRecentActivity] = useState<string[]>([]);

  const initializeDashboard = async () => {
    try {
      setLoading(true);
      console.log('🔍 Initializing dashboard...');
      console.log('👤 Current user:', user?.email);
      console.log('🔑 Is admin:', isAdmin);

      // Fetch all data
      const [events, galleryItems, teamMembers, messages] = await Promise.all([
        dataService.events.getAll(),
        dataService.gallery.getAll(),
        dataService.teamMembers.getAll(),
        dataService.messages.getAll(),
      ]);

      const upcomingEvents = events.filter(event => event.is_upcoming);

      setStats({
        totalEvents: events.length,
        upcomingEvents: upcomingEvents.length,
        totalGalleryItems: galleryItems.length,
        totalTeamMembers: teamMembers.length,
        totalMessages: messages.length,
      });

      console.log('✅ Dashboard initialized successfully');
    } catch (error) {
      console.error('❌ Error initializing dashboard:', error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to load dashboard data'
      });
    } finally {
      setLoading(false);
    }
  };

  const testCRUDOperations = async () => {
    try {
      setTestResult('Testing CRUD operations...');
      console.log('🧪 Testing CRUD operations...');

      // Test CREATE
      const testEvent = {
        title: 'Test Event',
        description: 'This is a test event',
        date: '2024-12-31',
        time: '19:00',
        venue: 'Test Venue',
        image_url: 'https://example.com/test.jpg',
        is_upcoming: true,
      };

      console.log('➕ Creating test event...');
      const createdEvent = await dataService.events.create(testEvent);
      console.log('✅ Test event created:', createdEvent);

      // Test READ
      console.log('📖 Reading events...');
      const events = await dataService.events.getAll();
      console.log('✅ Events read:', events);

      // Test UPDATE
      console.log('🔄 Updating test event...');
      const updatedEvent = await dataService.events.update(createdEvent.id, {
        title: 'Updated Test Event'
      });
      console.log('✅ Test event updated:', updatedEvent);

      // Test DELETE
      console.log('🗑️ Deleting test event...');
      await dataService.events.delete(createdEvent.id);
      console.log('✅ Test event deleted');

      setTestResult('✅ All CRUD operations successful!');
      addNotification({
        type: 'success',
        title: 'Test Complete',
        message: 'All CRUD operations are working correctly'
      });
    } catch (error) {
      console.error('❌ CRUD test failed:', error);
      setTestResult(`❌ Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      addNotification({
        type: 'error',
        title: 'Test Failed',
        message: `CRUD test failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }
  };

  useEffect(() => {
    initializeDashboard();
  }, []);

  if (loading) {
    return (
      <div className="pt-24 pb-16">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-700 rounded w-1/3 mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-dark-400 p-6 rounded-lg border border-dark-300">
                    <div className="h-6 bg-gray-600 rounded w-1/2 mb-4"></div>
                    <div className="h-8 bg-gray-600 rounded w-1/3"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Events',
      value: stats.totalEvents,
      icon: Calendar,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
      borderColor: 'border-blue-500/30',
    },
    {
      title: 'Upcoming Events',
      value: stats.upcomingEvents,
      icon: BarChart3,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
      borderColor: 'border-green-500/30',
    },
    {
      title: 'Gallery Items',
      value: stats.totalGalleryItems,
      icon: MessageSquare,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
      borderColor: 'border-purple-500/30',
    },
    {
      title: 'Team Members',
      value: stats.totalTeamMembers,
      icon: Users,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20',
      borderColor: 'border-yellow-500/30',
    },
    {
      title: 'Total Messages',
      value: stats.totalMessages,
      icon: MessageSquare,
      color: 'text-pink-400',
      bgColor: 'bg-pink-500/20',
      borderColor: 'border-pink-500/30',
    },
  ];

  return (
    <div className="pt-24 pb-16">
      <div className="container">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
            <p className="text-gray-300">Welcome back, {user?.email}</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
            {statCards.map((stat, index) => (
              <div
                key={index}
                className={`p-6 rounded-lg border ${stat.bgColor} ${stat.borderColor}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">{stat.title}</p>
                    <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  </div>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </div>
            ))}
          </div>

          {/* Recent Activity - now full width and dynamic */}
          <div className="bg-dark-400 p-6 rounded-lg border border-dark-300 mb-8 w-full">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-2 text-sm text-gray-300">
              {recentActivity.length === 0 ? (
                <p>No recent activity yet.</p>
              ) : (
                recentActivity.map((activity, idx) => (
                  <p key={idx}>{activity}</p>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;