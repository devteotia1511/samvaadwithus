import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Camera, Users, Mail, MessageCircle, Activity } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    events: 0,
    galleryItems: 0,
    teamMembers: 0,
    messages: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      // In a real implementation, this would fetch from Supabase
      // For demo purposes, using mock data
      setStats({
        events: 6,
        galleryItems: 9,
        teamMembers: 19,
        messages: 12
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
      
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-dark-300 p-4 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-primary-500/20 flex items-center justify-center mr-4">
                  <Calendar className="h-6 w-6 text-primary-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Events</h3>
                  <p className="text-3xl font-bold">{stats.events}</p>
                </div>
              </div>
              <Link to="/admin/events" className="text-primary-500 text-sm hover:underline">
                Manage Events →
              </Link>
            </div>
            
            <div className="bg-dark-300 p-4 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-primary-500/20 flex items-center justify-center mr-4">
                  <Camera className="h-6 w-6 text-primary-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Gallery</h3>
                  <p className="text-3xl font-bold">{stats.galleryItems}</p>
                </div>
              </div>
              <Link to="/admin/gallery" className="text-primary-500 text-sm hover:underline">
                Manage Gallery →
              </Link>
            </div>
            
            <div className="bg-dark-300 p-4 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-primary-500/20 flex items-center justify-center mr-4">
                  <Users className="h-6 w-6 text-primary-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Team</h3>
                  <p className="text-3xl font-bold">{stats.teamMembers}</p>
                </div>
              </div>
              <Link to="/admin/team" className="text-primary-500 text-sm hover:underline">
                Manage Team →
              </Link>
            </div>
            
            <div className="bg-dark-300 p-4 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-primary-500/20 flex items-center justify-center mr-4">
                  <Mail className="h-6 w-6 text-primary-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Messages</h3>
                  <p className="text-3xl font-bold">{stats.messages}</p>
                </div>
              </div>
              <Link to="/admin/settings" className="text-primary-500 text-sm hover:underline">
                View Messages →
              </Link>
            </div>
          </div>
          
          {/* Recent Activity */}
          <div className="bg-dark-300 rounded-lg p-6 mb-8">
            <div className="flex items-center mb-4">
              <Activity className="h-5 w-5 text-primary-500 mr-2" />
              <h3 className="text-xl font-bold">Recent Activity</h3>
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex border-b border-dark-200 pb-3 last:border-0">
                  <div className="w-10 h-10 rounded-full bg-dark-400 flex items-center justify-center mr-3 flex-shrink-0">
                    <activity.icon className="h-5 w-5 text-primary-500" />
                  </div>
                  <div>
                    <p className="text-white">{activity.description}</p>
                    <p className="text-gray-400 text-sm">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="bg-dark-300 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button className="bg-primary-500 hover:bg-primary-600 text-white p-3 rounded-md transition-colors">
                Add New Event
              </button>
              <button className="bg-dark-400 hover:bg-dark-500 text-white p-3 rounded-md transition-colors">
                Upload to Gallery
              </button>
              <button className="bg-dark-400 hover:bg-dark-500 text-white p-3 rounded-md transition-colors">
                Add Team Member
              </button>
              <button className="bg-dark-400 hover:bg-dark-500 text-white p-3 rounded-md transition-colors">
                Update Website
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const recentActivity = [
  {
    icon: Camera,
    description: 'New photos added to gallery',
    time: '2 hours ago'
  },
  {
    icon: Calendar,
    description: 'Event "Echoes of Time" was updated',
    time: '5 hours ago'
  },
  {
    icon: Users,
    description: 'New team member "Vikram Singh" was added',
    time: '1 day ago'
  },
  {
    icon: MessageCircle,
    description: 'New message received from website contact form',
    time: '2 days ago'
  }
];

export default AdminDashboard;