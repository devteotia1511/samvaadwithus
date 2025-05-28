import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Theater, Home } from 'lucide-react';

const NotFound = () => {
  useEffect(() => {
    document.title = 'Samvaad Theatre Group - Page Not Found';
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <Theater className="h-24 w-24 text-primary-500 mx-auto mb-6" />
        
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
          404 - Scene Not Found
        </h1>
        
        <p className="text-xl text-gray-300 mb-8 max-w-lg mx-auto">
          Looks like this scene isn't part of our current production. Let's get you back to the main stage.
        </p>
        
        <Link 
          to="/" 
          className="btn btn-primary inline-flex items-center"
        >
          <Home className="h-5 w-5 mr-2" />
          Return to Homepage
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;