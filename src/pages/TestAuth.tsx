import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface TestResults {
  connection?: boolean;
  error?: string;
  adminTableAccessible?: boolean;
  adminTableError?: string;
}

const TestAuth = () => {
  const { user, session, loading, isAdmin, signOut } = useAuth();
  const [supabaseStatus, setSupabaseStatus] = useState<string>('Checking...');
  const [testResults, setTestResults] = useState<TestResults>({});

  useEffect(() => {
    console.log('=== AUTH DEBUG INFO ===');
    console.log('Loading:', loading);
    console.log('User:', user);
    console.log('Session:', session);
    console.log('Is Admin:', isAdmin);
    console.log('=======================');
  }, [user, session, loading, isAdmin]);

  const testSupabaseConnection = async () => {
    try {
      setSupabaseStatus('Testing connection...');
      
      // Test basic connection
      const { error } = await supabase.from('admin_users').select('count').limit(1);
      
      if (error) {
        setSupabaseStatus('❌ Connection failed: ' + error.message);
        setTestResults({ connection: false, error: error.message });
      } else {
        setSupabaseStatus('✅ Connection successful');
        setTestResults({ connection: true });
      }
    } catch (error) {
      setSupabaseStatus('❌ Connection error: ' + (error as Error).message);
      setTestResults({ connection: false, error: (error as Error).message });
    }
  };

  const testAdminUsersTable = async () => {
    try {
      const { error } = await supabase.from('admin_users').select('*');
      
      if (error) {
        console.error('Admin users table error:', error);
        setTestResults(prev => ({ ...prev, adminTableError: error.message }));
      } else {
        console.log('Admin users table accessible');
        setTestResults(prev => ({ ...prev, adminTableAccessible: true }));
      }
    } catch (error) {
      console.error('Admin users test error:', error);
      setTestResults(prev => ({ ...prev, adminTableError: (error as Error).message }));
    }
  };

  const handleSignOut = async () => {
    console.log('Signing out...');
    await signOut();
  };

  const clearLocalStorage = () => {
    try {
      localStorage.clear();
      console.log('Local storage cleared');
      window.location.reload();
    } catch (error) {
      console.error('Error clearing local storage:', error);
    }
  };

  return (
    <div className="pt-24 pb-16">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">🔐 Authentication Test & Debug</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Current State */}
            <div className="bg-dark-400 p-6 rounded-lg border border-dark-300">
              <h2 className="text-xl font-semibold mb-4">Current State</h2>
              <div className="space-y-2 text-sm">
                <div>Loading: <span className={loading ? 'text-green-400' : 'text-red-400'}>{loading ? 'Yes' : 'No'}</span></div>
                <div>User: <span className={user ? 'text-green-400' : 'text-red-400'}>{user ? user.email : 'None'}</span></div>
                <div>Session: <span className={session ? 'text-green-400' : 'text-red-400'}>{session ? 'Active' : 'None'}</span></div>
                <div>Admin: <span className={isAdmin ? 'text-green-400' : 'text-red-400'}>{isAdmin ? 'Yes' : 'No'}</span></div>
                {user && (
                  <>
                    <div>User ID: {user.id}</div>
                    <div>Email Verified: {user.email_confirmed_at ? 'Yes' : 'No'}</div>
                    <div>Created: {new Date(user.created_at).toLocaleString()}</div>
                  </>
                )}
                {session && (
                  <>
                    <div>Session Expires: {new Date(session.expires_at * 1000).toLocaleString()}</div>
                    <div>Access Token: {session.access_token ? 'Present' : 'Missing'}</div>
                  </>
                )}
              </div>
            </div>

            {/* Supabase Status */}
            <div className="bg-dark-400 p-6 rounded-lg border border-dark-300">
              <h2 className="text-xl font-semibold mb-4">Supabase Status</h2>
              <div className="space-y-4">
                <div>Status: {supabaseStatus}</div>
                <div className="text-xs bg-dark-500 p-4 rounded border border-dark-300">
                  <div>Environment Variables:</div>
                  <div>VITE_SUPABASE_URL: {import.meta.env.VITE_SUPABASE_URL ? '✅ Set' : '❌ Missing'}</div>
                  <div>VITE_SUPABASE_ANON_KEY: {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}</div>
                </div>
                <button 
                  onClick={testSupabaseConnection}
                  className="btn btn-secondary text-sm"
                >
                  Test Connection
                </button>
                <button 
                  onClick={testAdminUsersTable}
                  className="btn btn-secondary text-sm"
                >
                  Test Admin Table
                </button>
              </div>
            </div>
          </div>

          {/* Test Results */}
          {Object.keys(testResults).length > 0 && (
            <div className="bg-dark-400 p-6 rounded-lg border border-dark-300 mt-6">
              <h2 className="text-xl font-semibold mb-4">Test Results</h2>
              <pre className="text-xs bg-dark-500 p-4 rounded border border-dark-300 overflow-auto">
                {JSON.stringify(testResults, null, 2)}
              </pre>
            </div>
          )}

          {/* Actions */}
          <div className="bg-dark-400 p-6 rounded-lg border border-dark-300 mt-6">
            <h2 className="text-xl font-semibold mb-4">Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button 
                onClick={() => window.location.reload()}
                className="btn btn-secondary"
              >
                Refresh Page
              </button>
              
              {user && (
                <button 
                  onClick={handleSignOut}
                  className="btn btn-danger"
                >
                  Sign Out
                </button>
              )}
              
              <button 
                onClick={clearLocalStorage}
                className="btn btn-warning"
              >
                Clear Storage
              </button>
              
              <a href="/login" className="btn btn-primary">
                Go to Login
              </a>
              
              <a href="/admin" className="btn btn-primary">
                Go to Admin
              </a>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-dark-400 p-6 rounded-lg border border-dark-300 mt-6">
            <h2 className="text-xl font-semibold mb-4">Debug Instructions</h2>
            <div className="space-y-2 text-sm">
              <p>1. <strong>Check Browser Console</strong> (F12) for detailed authentication logs</p>
              <p>2. <strong>Test Supabase Connection</strong> to verify database access</p>
              <p>3. <strong>Verify User Exists</strong> in Supabase Authentication dashboard</p>
              <p>4. <strong>Check Admin List</strong> - your email should be in the hardcoded list</p>
              <p>5. <strong>Clear Storage</strong> if session is stuck</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestAuth; 