import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const Events = () => {
  const [events, setEvents] = useState<{ title: string; date: string; image_url: string }[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<{ title: string; date: string; image_url: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');

  useEffect(() => {
    document.title = 'Samvaad Theatre Group - Events';
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      // Updated mock data
      const mockData = [
        {
          title: 'Anitya',
          date: '2024-09-26',
          image_url: 'https://images.pexels.com/photos/269140/pexels-photo-269140.jpeg',
        },
        {
          title: 'Bollywood Day',
          date: '2024-11-13',
          image_url: 'https://images.pexels.com/photos/269140/pexels-photo-269140.jpeg',
        },
        {
          title: 'Fringe Theatre',
          date: '2025-12-25',
          image_url: 'https://images.pexels.com/photos/269140/pexels-photo-269140.jpeg',
        },
        {
          title: 'Bollywood kaleidoscope.',
          date: '2025-12-25',
          image_url: 'https://images.pexels.com/photos/269140/pexels-photo-269140.jpeg',
        },
        {
          title: 'Nukkad Natak - (kisiko ko Batana Mat)',
          date: '25-12-2025',
          image_url: 'https://images.pexels.com/photos/269140/pexels-photo-269140.jpeg',
        },
        {
          title: 'Fringe Theatre - Shaitaan Hai?',
          date: '2025-05-03',
          image_url: 'https://images.pexels.com/photos/269140/pexels-photo-269140.jpeg',
        },
      ];

      setEvents(mockData);
      setFilteredEvents(mockData);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (filter === 'all') {
      setFilteredEvents(events);
    }
  }, [filter, events]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

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

      {/* Events List */}
      <section className="container">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-2xl font-display mb-4">No events found</h3>
            <p className="text-gray-400">There are no events matching your current filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredEvents.map((event, index) => (
              <motion.div
                key={index}
                className="event-card overflow-hidden"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={event.image_url}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-display font-bold mb-2">{event.title}</h3>
                  <div className="flex items-center text-gray-300">
                    <span>{formatDate(event.date)}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Events;
