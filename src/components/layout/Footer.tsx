import { Link } from 'react-router-dom';
import { Instagram, Youtube, MessageCircle, Theater } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark-400 pt-12 mx-8 md:mx-16 mb-8 rounded-t-lg">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and About */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center mb-4">
              <Theater className="h-8 w-8 text-primary-500 mr-2" />
              <span className="text-xl font-display font-bold">SAMVAAD</span>
            </Link>
            <p className="text-gray-400 mb-4">
              Where stories come alive through the magic of theatre.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/samvaadwithus/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary-500 transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="https://www.youtube.com/@samvaadwithus" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary-500 transition-colors">
                <Youtube className="h-6 w-6" />
              </a>
              <a href="https://chat.whatsapp.com/Jb1JxgJOE18AwsY2xboL4n" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary-500 transition-colors">
                <MessageCircle className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-primary-500 transition-colors">Home</Link></li>
              {/* <li><Link to="/about" className="text-gray-400 hover:text-primary-500 transition-colors">About</Link></li> */}
              <li><Link to="/events" className="text-gray-400 hover:text-primary-500 transition-colors">Events</Link></li>
              <li><Link to="/gallery" className="text-gray-400 hover:text-primary-500 transition-colors">Gallery</Link></li>
              <li><Link to="/core" className="text-gray-400 hover:text-primary-500 transition-colors">Core</Link></li>
              <li><Link to="/join-us" className="text-gray-400 hover:text-primary-500 transition-colors">Join Us</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <address className="not-italic text-gray-400">
              <p className="mb-2">Samvaad Theatre Group</p>
              <p className="mb-2">ABES ENGINEERING COLLEGE</p>
              <p className="mb-2">NH91, GHAZIABAD, UTTAR PRADESH</p>
              <p className="mb-2">Email: samvaadwithus@gmail.com</p>
              <p>Phone: +91 93110 31192</p>
            </address>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
            <p className="text-gray-400 mb-4">Subscribe to our newsletter for updates on upcoming performances and events.</p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Your email" 
                className="bg-dark-300 text-white px-4 py-2 rounded-l-md focus:outline-none w-full"
                aria-label="Email for newsletter"
              />
              <button 
                className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-r-md transition-colors"
                aria-label="Subscribe to newsletter"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-dark-300 mt-8 py-6 text-center">
          <p className="text-gray-400">
            © {currentYear} Samvaad Theatre Group. All rights reserved. | Designed & Developed by Dev Teotia
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;