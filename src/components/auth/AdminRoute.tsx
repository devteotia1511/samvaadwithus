import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingScreen from '../common/LoadingScreen';

interface AdminRouteProps {
  children: ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();

  // Show loading while checking authentication
  if (loading) {
    console.log('⏳ AdminRoute: Loading...');
    return <LoadingScreen />;
  }

  // Redirect to login if no user
  if (!user) {
    console.log('❌ AdminRoute: No user found, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check admin status
  if (!isAdmin) {
    console.log('🚫 AdminRoute: User is not admin:', user.email);
    return (
      <div className="pt-24 pb-16">
        <div className="container text-center">
          <div className="bg-red-500/20 border border-red-500 rounded-lg p-8 max-w-md mx-auto">
            <h1 className="text-3xl font-bold mb-4 text-red-400">Access Denied</h1>
            <p className="text-gray-300 mb-6">
              You don't have administrator privileges to access this area.
            </p>
            <p className="text-sm text-gray-400 mb-6">
              If you believe this is an error, please contact the system administrator.
            </p>
            <a href="/" className="btn btn-primary">Return to Home</a>
          </div>
        </div>
      </div>
    );
  }

  // User is authenticated and is admin
  console.log('✅ AdminRoute: Access granted for:', user.email);
  return <>{children}</>;
};

export default AdminRoute;