import { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, Ticket, Theater, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  scrolled: boolean;
}

const Navbar = ({ scrolled }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={`top-0 left-0 right-0 mx-4 sm:mx-8 md:mx-16 z-40 transition-all duration-300 relative ${scrolled ? 'py-2' : 'py-4'}`}>
      <div className={`rounded-b-lg ${scrolled ? 'bg-dark-500/95 shadow-xl' : 'bg-transparent'} transition-all duration-300`}>
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <Theater className="h-6 w-6 sm:h-8 sm:w-8 text-primary-500 mr-2" />
              <span className="text-lg sm:text-xl font-display font-bold">SAMVAAD</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
              <NavLink to="/" className={({isActive}) => `nav-link text-sm lg:text-base ${isActive ? 'active' : ''}`}>HOME</NavLink>
              <NavLink to="/events" className={({isActive}) => `nav-link text-sm lg:text-base ${isActive ? 'active' : ''}`}>EVENTS</NavLink>
              <NavLink to="/gallery" className={({isActive}) => `nav-link text-sm lg:text-base ${isActive ? 'active' : ''}`}>GALLERY</NavLink>
              <NavLink to="/core" className={({isActive}) => `nav-link text-sm lg:text-base ${isActive ? 'active' : ''}`}>CORE</NavLink>
              <NavLink to="/join-us" className={({isActive}) => `nav-link text-sm lg:text-base ${isActive ? 'active' : ''}`}>JOIN US</NavLink>
              {user ? (
                <>
                  <NavLink to="/admin" className={({isActive}) => `nav-link text-sm lg:text-base ${isActive ? 'active' : ''} flex items-center`}>
                    <Shield className="h-4 w-4 mr-1" />
                    ADMIN
                  </NavLink>
                  <button onClick={() => signOut()} className="btn btn-outline py-2 px-3 lg:px-4 text-sm">LOGOUT</button>
                </>
              ) : (
                <NavLink to="/login" className="btn btn-primary py-2 px-3 lg:px-4 text-sm">
                  <Ticket className="h-4 w-4 mr-1" />
                  LOGIN
                </NavLink>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden text-white focus:outline-none p-2"
              onClick={toggleMenu}
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </nav>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-dark-400 rounded-b-lg overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-col space-y-4">
                <NavLink to="/" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>HOME</NavLink>
                <NavLink to="/events" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>EVENTS</NavLink>
                <NavLink to="/gallery" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>GALLERY</NavLink>
                <NavLink to="/core" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>CORE</NavLink>
                <NavLink to="/join-us" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>JOIN US</NavLink>
                {user ? (
                  <>
                    <NavLink to="/admin" className={({isActive}) => `nav-link ${isActive ? 'active' : ''} flex items-center`}>
                      <Shield className="h-4 w-4 mr-2" />
                      ADMIN PANEL
                    </NavLink>
                    <button onClick={() => signOut()} className="btn btn-outline w-full">LOGOUT</button>
                  </>
                ) : (
                  <NavLink to="/login" className="btn btn-primary w-full">
                    <Ticket className="h-4 w-4 mr-2" />
                    ADMIN LOGIN
                  </NavLink>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default Navbar;