import { useAuth } from '../../context/AuthContext';

const AuthDebug = () => {
  const { user, session, loading, isAdmin } = useAuth();

  if (!import.meta.env.DEV) {
    return null; // Only show in development
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h3 className="font-bold mb-2">🔐 Auth Debug</h3>
      <div className="space-y-1">
        <div>Loading: {loading ? '✅' : '❌'}</div>
        <div>User: {user ? user.email : 'None'}</div>
        <div>Session: {session ? 'Active' : 'None'}</div>
        <div>Admin: {isAdmin ? '✅' : '❌'}</div>
        <div>User ID: {user?.id || 'None'}</div>
        <div>Session Expires: {session?.expires_at ? new Date(session.expires_at * 1000).toLocaleTimeString() : 'None'}</div>
      </div>
    </div>
  );
};

export default AuthDebug; 