import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy, useState, useEffect } from 'react';
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

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
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
            </Routes>
          </Suspense>
        </Layout>
        <NotificationContainer />
      </Router>
    </AuthProvider>
  );
}

export default App;