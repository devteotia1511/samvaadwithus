import { useEffect, useState } from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Theater, Calendar, Camera, Users, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Admin Subpages
import AdminDashboard from '../components/admin/AdminDashboard';
import AdminEvents from '../components/admin/AdminEvents';
import AdminGallery from '../components/admin/AdminGallery';
import AdminTeam from '../components/admin/AdminTeam';
import AdminSettings from '../components/admin/AdminSettings';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Samvaad Theatre Group - Admin Panel';
  }, []);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="pt-24 pb-16">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="font-display font-bold text-3xl md:text-4xl mb-4">
            Admin <span className="text-primary-500">Dashboard</span>
          </h1>
          <div className="w-20 h-1 bg-primary-500 mx-auto mb-6"></div>
          <p className="text-gray-300">
            Welcome back, {user?.email}
          </p>
        </motion.div>

        {/* Admin Navigation */}
        <div className="bg-dark-400 rounded-lg mb-8">
          <div className="flex flex-wrap items-center justify-between p-4">
            <div className="flex flex-wrap items-center gap-2">
              <NavLink 
                to="/admin" 
                end
                className={({ isActive }) => 
                  `px-4 py-2 rounded-md transition-colors ${
                    isActive 
                      ? 'bg-primary-500 text-white' 
                      : 'text-gray-300 hover:bg-dark-300'
                  }`
                }
              >
                <div className="flex items-center">
                  <Theater className="h-4 w-4 mr-2" />
                  <span>Dashboard</span>
                </div>
              </NavLink>
              
              <NavLink 
                to="/admin/events" 
                className={({ isActive }) => 
                  `px-4 py-2 rounded-md transition-colors ${
                    isActive 
                      ? 'bg-primary-500 text-white' 
                      : 'text-gray-300 hover:bg-dark-300'
                  }`
                }
              >
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Events</span>
                </div>
              </NavLink>
              
              <NavLink 
                to="/admin/gallery" 
                className={({ isActive }) => 
                  `px-4 py-2 rounded-md transition-colors ${
                    isActive 
                      ? 'bg-primary-500 text-white' 
                      : 'text-gray-300 hover:bg-dark-300'
                  }`
                }
              >
                <div className="flex items-center">
                  <Camera className="h-4 w-4 mr-2" />
                  <span>Gallery</span>
                </div>
              </NavLink>
              
              <NavLink 
                to="/admin/team" 
                className={({ isActive }) => 
                  `px-4 py-2 rounded-md transition-colors ${
                    isActive 
                      ? 'bg-primary-500 text-white' 
                      : 'text-gray-300 hover:bg-dark-300'
                  }`
                }
              >
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  <span>Team</span>
                </div>
              </NavLink>
              
              <NavLink 
                to="/admin/settings" 
                className={({ isActive }) => 
                  `px-4 py-2 rounded-md transition-colors ${
                    isActive 
                      ? 'bg-primary-500 text-white' 
                      : 'text-gray-300 hover:bg-dark-300'
                  }`
                }
              >
                <div className="flex items-center">
                  <Settings className="h-4 w-4 mr-2" />
                  <span>Settings</span>
                </div>
              </NavLink>
            </div>
            
            <button 
              onClick={handleLogout}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors flex items-center"
            >
              <LogOut className="h-4 w-4 mr-2" />
              <span>Logout</span>
            </button>
          </div>
        </div>
        
        {/* Admin Content */}
        <div className="bg-dark-400 rounded-lg p-6">
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/events" element={<AdminEvents />} />
            <Route path="/gallery" element={<AdminGallery />} />
            <Route path="/team" element={<AdminTeam />} />
            <Route path="/settings" element={<AdminSettings />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Admin;