import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signIn: (email: string, password: string) => Promise<{
    error: Error | null;
    data: { user: User | null; session: Session | null } | null;
  }>;
  signOut: () => Promise<void>;
  loading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Admin email addresses - you can modify this list
const ADMIN_EMAILS = [
  'admin@samvaadtheatre.com',
  'admin@example.com',
  'devteotia1511@gmail.com', // Add your email here
  'admin@gmail.com',
  'administrator@samvaadtheatre.com',
  // Add more admin emails as needed
];

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if user is admin
  const checkAdminStatus = (user: User | null) => {
    if (!user?.email) return false;
    
    const userEmail = user.email.toLowerCase();
    console.log('🔍 Checking admin status for:', userEmail);
    
    // Check against hardcoded list
    const isInAdminList = ADMIN_EMAILS.includes(userEmail);
    console.log('📋 In admin list:', isInAdminList);
    
    return isInAdminList;
  };

  useEffect(() => {
    console.log('🚀 AuthProvider initializing...');
    
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Error getting initial session:', error);
          return;
        }
        
        console.log('📦 Initial session:', session ? 'Found' : 'None');
        if (session?.user) {
          console.log('👤 User:', session.user.email);
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        setIsAdmin(checkAdminStatus(session?.user ?? null));
      } catch (error) {
        console.error('❌ Error in getInitialSession:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', event, session?.user?.email);
        
        setSession(session);
        setUser(session?.user ?? null);
        setIsAdmin(checkAdminStatus(session?.user ?? null));
        setLoading(false);
      }
    );

    return () => {
      console.log('🧹 Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log('🔐 Attempting sign in for:', email);
      
      // Input sanitization
      const sanitizedEmail = email.trim().toLowerCase();
      const sanitizedPassword = password.trim();

      if (!sanitizedEmail || !sanitizedPassword) {
        throw new Error('Email and password are required');
      }

      // Check if email is in admin list before attempting login
      if (!ADMIN_EMAILS.includes(sanitizedEmail)) {
        console.log('❌ Email not in admin list:', sanitizedEmail);
        throw new Error('Access denied. This area is restricted to administrators only.');
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: sanitizedEmail,
        password: sanitizedPassword,
      });

      if (error) {
        console.error('❌ Sign in error:', error);
        throw error;
      }

      console.log('✅ Sign in successful for:', data.user?.email);
      console.log('🔑 Session created:', !!data.session);

      return { data, error: null };
    } catch (error) {
      console.error('❌ Error signing in:', error);
      return { 
        data: null, 
        error: error as Error
      };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      console.log('🚪 Signing out user');
      
      // Clear local state immediately for faster logout
      setUser(null);
      setSession(null);
      setIsAdmin(false);
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('❌ Error signing out:', error);
      } else {
        console.log('✅ Sign out successful');
      }
    } catch (error) {
      console.error('❌ Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-500">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading authentication...</p>
        </div>
      </div>
    );
  }

  const value = {
    user,
    session,
    signIn,
    signOut,
    loading,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};