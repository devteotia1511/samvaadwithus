import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Typewriter from 'typewriter-effect';
import { Link } from 'react-router-dom';
import { Theater, Calendar, Camera, Users, MoveRight } from 'lucide-react';
import qmlogo from '../pages/image/qmlogo.png';

const Home = () => {
  useEffect(() => {
    document.title = 'Samvaad Theatre Group - Home';
  }, []);

  return (
    <div className="space-y-16 pt-16">
      {/* Hero Section */}
      <section className="min-h-[70vh] flex flex-col items-center justify-center relative overflow-hidden">
        {/* 3D Logo Animation */}
        <motion.div
          initial={{ scale: 0, rotateY: -180 }}
          animate={{ scale: 1, rotateY: 0 }}
          transition={{ 
            duration: 1.5, 
            type: "spring", 
            stiffness: 100 
          }}
          className="mb-6"
        >
          <img
            src={qmlogo}
            alt="Samvaad Theatre Logo" 
            className="h-32 w-32 object-contain"
          />
        </motion.div>
        
        {/* Main Heading */}
        <motion.h1 
          className="text-center font-display font-black text-4xl md:text-6xl lg:text-7xl mb-4 text-white"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          style={{ 
            textShadow: '0 0 10px rgba(211, 0, 0, 0.5), 0 0 20px rgba(211, 0, 0, 0.3)' 
          }}
        >
          SAMVAAD THEATRE GROUP
        </motion.h1>
        
        {/* Typewriter Effect */}
        <motion.div
          className="text-xl md:text-2xl text-center text-gray-300 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <Typewriter
            options={{
              strings: [
                'Where Stories Come Alive..',
                'Unite Through Theatre..',
                'Inspire, Create, Perform..',
                'Experience The Magic Of Stage..'
              ],
              autoStart: true,
              loop: true,
              delay: 50,
              deleteSpeed: 30,
            }}
          />
        </motion.div>
        
        {/* CTA Buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.8 }}
        >
          <Link to="/events" className="btn btn-primary">
            <Calendar className="h-5 w-5 mr-2" />
            Our Events
          </Link>
          <Link to="/join-us" className="btn btn-outline">
            <Users className="h-5 w-5 mr-2" />
            Join Our Group
          </Link>
        </motion.div>
        
        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-1 transform -translate-x-1/2 z-0"
          animate={{ 
            y: [0, 5, 0],
            opacity: [0.4, 1, 0.4]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut" 
          }}
        >
          <div className="flex flex-col items-center">
            <span className="text-sm text-gray-400 mb-2">Scroll Down</span>
            <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </motion.div>
      </section>
      
      {/* Quick Links Section */}
      <section className="section">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* About Card */}
            <motion.div 
              className="card p-6 hover:bg-primary-500 hover:shadow-2xl group"
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="mb-4 text-primary-500 group-hover:text-white">
                <Theater className="h-12 w-12" />
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-white">About Us</h3>
              <p className="text-gray-400 group-hover:text-white/90 mb-4">Learn about our mission, history, and the passion that drives our theatre group.</p>
              <Link to="/about" className="inline-flex items-center text-primary-500 group-hover:text-white">
                Learn More <MoveRight className="h-4 w-4 ml-1" />
              </Link>
            </motion.div>
            
            {/* Events Card */}
            <motion.div 
              className="card p-6 hover:bg-primary-500 hover:shadow-2xl group"
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="mb-4 text-primary-500 group-hover:text-white">
                <Calendar className="h-12 w-12" />
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-white">Our Events</h3>
              <p className="text-gray-400 group-hover:text-white/90 mb-4">Discover our upcoming performances, workshops, and theatrical experiences.</p>
              <Link to="/events" className="inline-flex items-center text-primary-500 group-hover:text-white">
                View Events <MoveRight className="h-4 w-4 ml-1" />
              </Link>
            </motion.div>
            
            {/* Gallery Card */}
            <motion.div 
              className="card p-6 hover:bg-primary-500 hover:shadow-2xl group"
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="mb-4 text-primary-500 group-hover:text-white">
                <Camera className="h-12 w-12" />
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-white">Gallery</h3>
              <p className="text-gray-400 group-hover:text-white/90 mb-4">Explore our captivating collection of performances, rehearsals, and behind-the-scenes moments.</p>
              <Link to="/gallery" className="inline-flex items-center text-primary-500 group-hover:text-white">
                Browse Gallery <MoveRight className="h-4 w-4 ml-1" />
              </Link>
            </motion.div>
            
            {/* Join Us Card */}
            <motion.div 
              className="card p-6 hover:bg-primary-500 hover:shadow-2xl group"
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="mb-4 text-primary-500 group-hover:text-white">
                <Users className="h-12 w-12" />
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-white">Join Us</h3>
              <p className="text-gray-400 group-hover:text-white/90 mb-4">Become part of our theatrical family and discover opportunities across all departments.</p>
              <Link to="/join-us" className="inline-flex items-center text-primary-500 group-hover:text-white">
                Get Involved <MoveRight className="h-4 w-4 ml-1" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Featured Content */}
      <section className="section bg-dark-400 py-16 rounded-lg">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Featured Performance</h2>
            <div className="w-20 h-1 bg-primary-500 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="relative rounded-lg overflow-hidden aspect-video">
                <img 
                  src="https://static.toiimg.com/photo/70466019.cmshttps://timeslife.com/thumb/118738133.cms?imgsize=52054&width=616&resizemode=4" 
                  alt="Theatre performance" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-500 to-transparent"></div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <span className="text-primary-500 font-semibold">UPCOMING PRODUCTION</span>
              <h3 className="text-2xl md:text-3xl font-display font-bold">Theatre</h3>
              <p className="text-gray-300">
                Join us for our latest production exploring the intertwined stories of three generations and their journey through the echoes of time. A mesmerizing performance that blends drama, emotion, and innovative staging.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <span className="px-4 py-2 bg-dark-300 rounded-md text-white inline-flex items-center">
                  <Calendar className="h-4 w-4 mr-2" /> August, 2025
                </span>
                <span className="px-4 py-2 bg-dark-300 rounded-md text-white inline-flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Auditorium, Abes Engineering College
                </span>
              </div>
              <div className="pt-4">
                <Link to="/events" className="btn btn-primary">
                  Book Tickets
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="section">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Audience Speaks</h2>
            <div className="w-20 h-1 bg-primary-500 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-dark-400 p-6 rounded-lg relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-primary-500 text-4xl font-serif absolute top-4 left-4 opacity-20">"</div>
                <p className="text-gray-300 mb-4 relative z-10">
                  {testimonial.content}
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="ml-3">
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-gray-400 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

const testimonials = [
  {
    content: "Samvaad Theatre Group's production was absolutely breathtaking. The performances were genuine and moving, transporting me to another world entirely.",
    name: "Anirudh",
    role: "Theatre Enthusiast"
  },
  {
    content: "I've been attending their shows for years and they never disappoint. Their attention to detail in set design and character development is remarkable.",
    name: "Vipul",
    role: "Art Critic"
  },
  {
    content: "As someone new to theatre, I was completely captivated by the energy and passion of the performers. Will definitely be coming back for more shows!",
    name: "Random guy",
    role: "First-time Attendee"
  }
];

export default Home;