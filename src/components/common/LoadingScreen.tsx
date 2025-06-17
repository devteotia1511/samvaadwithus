import { Theater } from 'lucide-react';
import { motion } from 'framer-motion';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-dark-500 flex flex-col items-center justify-center z-50">
      {/* Spotlight effect */}
      <div className="spotlight" style={{ left: '50%', top: '50%' }}></div>
      
      {/* Logo */}
      <motion.div 
        className="relative z-10 mb-8"
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut" 
        }}
      >
        <Theater className="h-20 w-20 text-primary-500" />
      </motion.div>
      
      {/* Text */}
      <motion.h1 
        className="text-2xl md:text-3xl font-display text-white mb-8 text-center relative z-10"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut" 
        }}
      >
        SAMVAAD THEATRE GROUP
      </motion.h1>
      
      {/* Loading Bar */}
      <div className="w-64 h-1 bg-dark-300 rounded-full overflow-hidden relative z-10">
        <motion.div 
          className="h-full bg-primary-500"
          animate={{ 
            width: ["0%", "100%"],
          }}
          transition={{ 
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut" 
          }}
        />
      </div>
      
      {/* Loading text */}
      <motion.p 
        className="mt-4 text-gray-400 relative z-10"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5
        }}
      >
        Setting the stage...
      </motion.p>
    </div>
  );
};

export default LoadingScreen;