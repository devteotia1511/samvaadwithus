import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase, GalleryItem, dataService } from '../lib/supabase';
import { Image, Play, X, Maximize, Filter } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRealtimeSync } from '../hooks/useRealtimeSync';

const Gallery = () => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<GalleryItem | null>(null);
  const [filter, setFilter] = useState<'all' | 'images' | 'videos'>('all');
  const { user } = useAuth();

  // Real-time synchronization
  useRealtimeSync({
    table: 'gallery',
    onInsert: (payload) => {
      setGalleryItems(prev => [payload.new, ...prev]);
    },
    onUpdate: (payload) => {
      setGalleryItems(prev => prev.map(item => 
        item.id === payload.new.id ? payload.new : item
      ));
    },
    onDelete: (payload) => {
      setGalleryItems(prev => prev.filter(item => item.id !== payload.old.id));
    },
    showNotifications: false // Don't show notifications on user pages
  });

  useEffect(() => {
    document.title = 'Samvaad Theatre Group - Gallery';
    fetchGalleryItems();
  }, []);

  const fetchGalleryItems = async () => {
    setLoading(true);
    try {
      const data = await dataService.gallery.getAll();
      setGalleryItems(data);
    } catch (error) {
      console.error('Error fetching gallery items:', error);
    } finally {
      setLoading(false);
    }
  };

  const openLightbox = (item: GalleryItem) => {
    setCurrentItem(item);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setCurrentItem(null);
    document.body.style.overflow = 'auto';
  };

  const filteredItems = galleryItems.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'images') return !item.is_video;
    if (filter === 'videos') return item.is_video;
    return true;
  });

  const imageCount = galleryItems.filter(item => !item.is_video).length;
  const videoCount = galleryItems.filter(item => item.is_video).length;

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
              Our <span className="text-primary-500">Gallery</span>
            </h1>
            <div className="w-20 h-1 bg-primary-500 mx-auto mb-6"></div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              A visual journey through our performances and behind-the-scenes moments
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Controls */}
      {galleryItems.length > 0 && (
        <section className="container">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
            <div className="flex items-center mb-4 sm:mb-0">
              <Filter className="h-5 w-5 text-primary-500 mr-2" />
              <span className="text-gray-300 mr-4">Filter by:</span>
              <div className="bg-dark-400 p-1 rounded-lg flex">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-md transition-colors text-sm ${
                    filter === 'all' 
                      ? 'bg-primary-500 text-white' 
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  All ({galleryItems.length})
                </button>
                <button
                  onClick={() => setFilter('images')}
                  className={`px-4 py-2 rounded-md transition-colors text-sm ${
                    filter === 'images' 
                      ? 'bg-primary-500 text-white' 
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  Images ({imageCount})
                </button>
                <button
                  onClick={() => setFilter('videos')}
                  className={`px-4 py-2 rounded-md transition-colors text-sm ${
                    filter === 'videos' 
                      ? 'bg-primary-500 text-white' 
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  Videos ({videoCount})
                </button>
              </div>
            </div>
            
            <div className="text-gray-400 text-sm">
              Showing {filteredItems.length} of {galleryItems.length} items
            </div>
          </div>
        </section>
      )}

      {/* Gallery Grid */}
      <section className="container">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-16">
            <Image className="h-16 w-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-2xl font-display mb-4">
              {galleryItems.length === 0 ? 'No gallery items found' : 'No items match your filter'}
            </h3>
            <p className="text-gray-400">
              {galleryItems.length === 0 
                ? 'There are currently no items in the gallery.' 
                : 'Try adjusting your filter to see more content.'
              }
            </p>
          </div>
        ) : (
          <div className="grid-gallery">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                className="relative overflow-hidden rounded-lg aspect-square group cursor-pointer bg-dark-400"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
                onClick={() => openLightbox(item)}
              >
                {/* Media */}
                {item.is_video ? (
                  <div className="relative w-full h-full">
                    <video 
                      src={item.media_url} 
                      className="w-full h-full object-cover"
                      poster={item.media_url.replace('.mp4', '.jpg')}
                      preload="metadata"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <div className="w-16 h-16 rounded-full bg-primary-500/90 flex items-center justify-center group-hover:bg-primary-500 transition-colors">
                        <Play className="h-8 w-8 text-white ml-1" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <img 
                    src={item.media_url} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                )}
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-dark-500 via-dark-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <h3 className="text-white font-bold mb-2">{item.title}</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm">
                      {new Date(item.created_at).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                    <button 
                      className="w-8 h-8 bg-primary-500/80 hover:bg-primary-500 rounded-full flex items-center justify-center transition-colors"
                      aria-label="View full size"
                    >
                      <Maximize className="h-4 w-4 text-white" />
                    </button>
                  </div>
                </div>

                {/* Media Type Indicator */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    item.is_video 
                      ? 'bg-red-500/80 text-white' 
                      : 'bg-blue-500/80 text-white'
                  }`}>
                    {item.is_video ? 'Video' : 'Image'}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
      
      {/* Admin CTA (only visible to logged in users) */}
      {user && (
        <section className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-dark-400 p-6 rounded-lg text-center"
          >
            <h2 className="text-2xl font-display font-bold mb-4">Gallery Management</h2>
            <p className="text-gray-300 mb-6">
              As an admin, you can manage gallery content in the admin panel.
            </p>
            <a href="/admin/gallery" className="btn btn-primary">
              Go to Gallery Admin
            </a>
          </motion.div>
        </section>
      )}

      {/* Lightbox */}
      {lightboxOpen && currentItem && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          <button 
            className="absolute top-4 right-4 w-12 h-12 rounded-full bg-dark-400/80 hover:bg-dark-400 flex items-center justify-center transition-colors z-10"
            onClick={closeLightbox}
            aria-label="Close lightbox"
          >
            <X className="h-6 w-6 text-white" />
          </button>
          
          <div className="max-w-5xl max-h-[90vh] relative">
            {currentItem.is_video ? (
              <video 
                src={currentItem.media_url} 
                controls 
                autoPlay 
                className="max-h-[90vh] w-auto rounded-lg"
              />
            ) : (
              <img 
                src={currentItem.media_url} 
                alt={currentItem.title} 
                className="max-h-[90vh] w-auto rounded-lg"
              />
            )}
            
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg">
              <h3 className="text-white text-2xl font-bold mb-2">{currentItem.title}</h3>
              <p className="text-gray-300">
                {new Date(currentItem.created_at).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;