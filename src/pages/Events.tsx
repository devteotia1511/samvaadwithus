import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase, Event, dataService } from '../lib/supabase';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { useRealtimeSync } from '../hooks/useRealtimeSync';

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');

  // Real-time synchronization
  useRealtimeSync({
    table: 'events',
    onInsert: (payload) => {
      setEvents(prev => [payload.new, ...prev]);
    },
    onUpdate: (payload) => {
      setEvents(prev => prev.map(event => 
        event.id === payload.new.id ? payload.new : event
      ));
    },
    onDelete: (payload) => {
      setEvents(prev => prev.filter(event => event.id !== payload.old.id));
    },
    showNotifications: false // Don't show notifications on user pages
  });

  useEffect(() => {
    document.title = 'Samvaad Theatre Group - Events';
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const data = await dataService.events.getAll();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const filteredEvents = events.filter(event => {
    if (filter === 'all') return true;
    if (filter === 'upcoming') return event.is_upcoming;
    if (filter === 'past') return !event.is_upcoming;
    return true;
  });

  const upcomingEvents = events.filter(event => event.is_upcoming);
  const pastEvents = events.filter(event => !event.is_upcoming);

  return (
    <div className="pt-24 space-y-16">
      {/* Hero Section */}
      <section className="relative">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl mb-4">
              Our <span className="text-primary-500">Events</span>
            </h1>
            <div className="w-20 h-1 bg-primary-500 mx-auto mb-6"></div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Discover our upcoming performances and past productions
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="container">
        <div className="flex justify-center mb-8">
          <div className="bg-dark-400 p-1 rounded-lg flex">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-2 rounded-md transition-colors ${
                filter === 'all' 
                  ? 'bg-primary-500 text-white' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              All Events ({events.length})
            </button>
            <button
              onClick={() => setFilter('upcoming')}
              className={`px-6 py-2 rounded-md transition-colors ${
                filter === 'upcoming' 
                  ? 'bg-primary-500 text-white' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Upcoming ({upcomingEvents.length})
            </button>
            <button
              onClick={() => setFilter('past')}
              className={`px-6 py-2 rounded-md transition-colors ${
                filter === 'past' 
                  ? 'bg-primary-500 text-white' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Past Events ({pastEvents.length})
            </button>
          </div>
        </div>
      </section>

      {/* Events List */}
      <section className="container">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-16">
            <Calendar className="h-16 w-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-2xl font-display mb-4">No events found</h3>
            <p className="text-gray-400">
              {filter === 'all' 
                ? 'There are currently no events scheduled.' 
                : filter === 'upcoming'
                ? 'There are no upcoming events at the moment.'
                : 'No past events to display.'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredEvents.map((event, index) => (
              <motion.div
                key={event.id}
                className="event-card overflow-hidden group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={event.image_url}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-500 via-dark-500/50 to-transparent"></div>
                  
                  {/* Event Status Badge */}
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      event.is_upcoming 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                        : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                    }`}>
                      {event.is_upcoming ? 'Upcoming' : 'Past Event'}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-2xl font-display font-bold mb-3 group-hover:text-primary-500 transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-gray-300 mb-4 line-clamp-3">{event.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-300">
                      <Calendar className="h-4 w-4 text-primary-500 mr-3" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <Clock className="h-4 w-4 text-primary-500 mr-3" />
                      <span>{formatTime(event.time)}</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <MapPin className="h-4 w-4 text-primary-500 mr-3" />
                      <span>{event.venue}</span>
                    </div>
                  </div>
                  
                  {event.is_upcoming && (
                    <div className="flex space-x-3">
                      <button className="btn btn-primary flex-1">
                        <Users className="h-4 w-4 mr-2" />
                        Book Tickets
                      </button>
                      <button className="btn btn-outline">
                        Learn More
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Call to Action */}
      {events.length > 0 && (
        <section className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-primary-500 rounded-lg p-8 text-center"
          >
            <h2 className="text-3xl font-display font-bold text-white mb-4">
              Don't Miss Our Next Performance
            </h2>
            <p className="text-white/90 max-w-2xl mx-auto mb-6">
              Stay updated with our latest events and be the first to know about upcoming shows, workshops, and special performances.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/join-us" className="btn bg-white text-primary-500 hover:bg-gray-100">
                Join Our Community
              </a>
              <a href="#newsletter" className="btn btn-outline border-white text-white hover:bg-white hover:text-primary-500">
                Subscribe to Updates
              </a>
            </div>
          </motion.div>
        </section>
      )}
    </div>
  );
};

export default Events;