import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy, useState, useEffect, Component, ReactNode } from 'react';
import Layout from './components/layout/Layout';
import LoadingScreen from './components/common/LoadingScreen';
import NotificationContainer from './components/common/NotificationContainer';
import { AuthProvider } from './context/AuthContext';
import AdminRoute from './components/auth/AdminRoute';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const Events = lazy(() => import('./pages/Events'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Core = lazy(() => import('./pages/Core'));
const JoinUs = lazy(() => import('./pages/JoinUs'));
const Admin = lazy(() => import('./pages/Admin'));
const Login = lazy(() => import('./pages/Login'));
const TestAuth = lazy(() => import('./pages/TestAuth'));

// Error Boundary Component
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: { componentStack: string }) {
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-dark-500 flex items-center justify-center p-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-400 mb-4">Something went wrong</h1>
            <p className="text-gray-300 mb-4">The application encountered an error.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="btn btn-primary"
            >
              Reload Page
            </button>
            {this.state.error && (
              <details className="mt-4 text-left">
                <summary className="text-gray-400 cursor-pointer">Error Details</summary>
                <pre className="text-xs text-red-300 mt-2 bg-dark-400 p-2 rounded">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('🚀 App component mounting...');
    
    // Check environment variables
    console.log('🔧 Environment check:');
    console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL ? '✅ Set' : '❌ Missing');
    console.log('VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing');
    
    // Simulate initial loading
    const timer = setTimeout(() => {
      console.log('✅ Initial loading complete');
      setIsLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Layout>
            <Suspense fallback={<LoadingScreen />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/events" element={<Events />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/core" element={<Core />} />
                <Route path="/join-us" element={<JoinUs />} />
                <Route path="/login" element={<Login />} />
                <Route path="/test-auth" element={<TestAuth />} />
                <Route path="/admin/*" element={
                  <AdminRoute>
                    <Admin />
                  </AdminRoute>
                } />
                {/* Fallback route for 404 */}
                <Route path="*" element={
                  <div className="pt-24 pb-16">
                    <div className="container text-center">
                      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
                      <p className="text-gray-300 mb-6">The page you're looking for doesn't exist.</p>
                      <a href="/" className="btn btn-primary">Go Home</a>
                    </div>
                  </div>
                } />
              </Routes>
            </Suspense>
          </Layout>
          <NotificationContainer />
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;