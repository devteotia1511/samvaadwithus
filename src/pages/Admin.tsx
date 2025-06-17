import { useEffect, useState } from 'react';
import { Routes, Route, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Theater, Calendar, Camera, Users, Settings, LogOut, Menu, X, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../hooks/useNotification';
import { lazy, Suspense } from 'react';
import LoadingScreen from '../components/common/LoadingScreen';

// Lazy load admin components
const AdminDashboard = lazy(() => import('../components/admin/AdminDashboard'));
const AdminEvents = lazy(() => import('../components/admin/AdminEvents'));
const AdminGallery = lazy(() => import('../components/admin/AdminGallery'));
const AdminTeam = lazy(() => import('../components/admin/AdminTeam'));
const AdminSettings = lazy(() => import('../components/admin/AdminSettings'));

const Admin = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { addNotification } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    document.title = 'Samvaad Theatre Group - Admin Panel';
  }, []);

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout? This will end your admin session.')) {
      try {
        await signOut();
        addNotification({
          type: 'success',
          title: 'Logged Out Successfully',
          message: 'You have been securely logged out of the admin panel.'
        });
        navigate('/');
      } catch {
        addNotification({
          type: 'error',
          title: 'Logout Error',
          message: 'There was an issue logging out. Please try again.'
        });
      }
    }
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: Theater, end: true },
    { path: '/admin/events', label: 'Events', icon: Calendar },
    { path: '/admin/gallery', label: 'Gallery', icon: Camera },
    { path: '/admin/team', label: 'Team', icon: Users },
    { path: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-dark-500">
      {/* Mobile Header */}
      <div className="lg:hidden bg-dark-400 border-b border-dark-300">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-primary-500 mr-2" />
            <span className="text-xl font-display font-bold">Admin Panel</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md transition-colors"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-300 hover:text-white p-2"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar - Desktop */}
        <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:bg-dark-400 lg:border-r lg:border-dark-300">
          <div className="flex items-center h-16 px-6 border-b border-dark-300">
            <Shield className="h-8 w-8 text-primary-500 mr-3" />
            <div>
              <h1 className="text-xl font-display font-bold">Admin Panel</h1>
              <p className="text-xs text-gray-400">Samvaad Theatre</p>
            </div>
          </div>
          
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-500 text-white'
                      : 'text-gray-300 hover:bg-dark-300 hover:text-white'
                  }`
                }
              >
                <item.icon className="h-5 w-5 mr-3" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
          </nav>
          
          <div className="p-4 border-t border-dark-300">
            <div className="mb-4 p-3 bg-dark-300 rounded-lg">
              <p className="text-sm font-medium text-white">{user?.email}</p>
              <p className="text-xs text-gray-400">Administrator</p>
              <div className="mt-2 flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                <span className="text-xs text-green-400">Session Active</span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3 text-gray-300 hover:text-white hover:bg-red-500/20 rounded-lg transition-colors"
            >
              <LogOut className="h-5 w-5 mr-3" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Mobile Sidebar */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            className="lg:hidden fixed inset-0 z-50 bg-dark-400"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b border-dark-300">
                <div className="flex items-center">
                  <Shield className="h-8 w-8 text-primary-500 mr-3" />
                  <div>
                    <h1 className="text-xl font-display font-bold">Admin Panel</h1>
                    <p className="text-xs text-gray-400">Samvaad Theatre</p>
                  </div>
                </div>
                <button
                  onClick={closeMobileMenu}
                  className="text-gray-300 hover:text-white p-2"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <nav className="flex-1 px-4 py-6 space-y-2">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.end}
                    onClick={closeMobileMenu}
                    className={({ isActive }) =>
                      `flex items-center px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-primary-500 text-white'
                          : 'text-gray-300 hover:bg-dark-300 hover:text-white'
                      }`
                    }
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    <span className="font-medium">{item.label}</span>
                  </NavLink>
                ))}
              </nav>
              
              <div className="p-4 border-t border-dark-300">
                <div className="mb-4 p-3 bg-dark-300 rounded-lg">
                  <p className="text-sm font-medium text-white">{user?.email}</p>
                  <p className="text-xs text-gray-400">Administrator</p>
                  <div className="mt-2 flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                    <span className="text-xs text-green-400">Session Active</span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-3 text-gray-300 hover:text-white hover:bg-red-500/20 rounded-lg transition-colors"
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Main Content */}
        <div className="flex-1 lg:ml-64">
          <div className="p-4 sm:p-6 lg:p-8">
            {/* Page Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-6 sm:mb-8"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-display font-bold mb-2">
                    {navItems.find(item => 
                      item.end ? location.pathname === item.path :         location.pathname.startsWith(item.path)
                    )?.label || 'Admin Dashboard'}
                  </h1>
                  <p className="text-gray-400 text-sm sm:text-base">
                    Welcome back, {user?.email?.split('@')[0]}
                  </p>
                </div>
                <div className="mt-4 sm:mt-0 flex items-center space-x-2">
                  <div className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
                    Online
                  </div>
                  <div className="px-3 py-1 bg-primary-500/20 text-primary-500 rounded-full text-xs font-medium">
                    Admin
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Content Area */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-dark-400 rounded-lg shadow-xl overflow-hidden"
            >
              <div className="p-4 sm:p-6 lg:p-8">
                <Suspense fallback={<LoadingScreen />}>
                  <Routes>
                    <Route path="/" element={<AdminDashboard />} />
                    <Route path="/events" element={<AdminEvents />} />
                    <Route path="/gallery" element={<AdminGallery />} />
                    <Route path="/team" element={<AdminTeam />} />
                    <Route path="/settings" element={<AdminSettings />} />
                  </Routes>
                </Suspense>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={closeMobileMenu}
        />
      )}
    </div>
  );
};

export default Admin;