import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase, GalleryItem } from '../lib/supabase';
import { Image, Play, X, Maximize } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Gallery = () => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<GalleryItem | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    document.title = 'Samvaad Theatre Group - Gallery';
    fetchGalleryItems();
  }, []);

  const fetchGalleryItems = async () => {
    setLoading(true);
    try {
      // In a real implementation, this would fetch from Supabase
      // const { data, error } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
      
      // For demo purposes, using mock data
      const mockData: GalleryItem[] = [
        {
          id: '1',
          title: 'Echoes of Time - Rehearsal',
          media_url: 'https://pbs.twimg.com/media/GGwihK4awAEiOeI.jpg:large',
          is_video: false,
          created_at: '2024-04-10T10:00:00Z'
        },
        {
          id: '2',
          title: 'The Silent Monologue - Performance',
          media_url: 'https://images.pexels.com/photos/8107967/pexels-photo-8107967.jpeg',
          is_video: false,
          created_at: '2024-04-11T10:00:00Z'
        },
        {
          id: '3',
          title: 'Backstage Preparations',
          media_url: 'https://images.pexels.com/photos/1916820/pexels-photo-1916820.jpeg',
          is_video: false,
          created_at: '2024-04-12T10:00:00Z'
        },
        {
          id: '4',
          title: 'Shadows of Yesterday - Key Scene',
          media_url: 'https://images.pexels.com/photos/11793942/pexels-photo-11793942.jpeg',
          is_video: false,
          created_at: '2024-01-05T10:00:00Z'
        },
        {
          id: '5',
          title: 'Directors Workshop',
          media_url: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg',
          is_video: false,
          created_at: '2024-02-10T10:00:00Z'
        },
        {
          id: '6',
          title: 'Set Design Process',
          media_url: 'https://images.pexels.com/photos/269140/pexels-photo-269140.jpeg',
          is_video: false,
          created_at: '2024-03-15T10:00:00Z'
        },
        {
          id: '7',
          title: 'Opening Night Celebration',
          media_url: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg',
          is_video: false,
          created_at: '2024-03-20T10:00:00Z'
        },
        {
          id: '8',
          title: 'Fringe Theatre',
          media_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_Zzc9yfXHY018L-v5lADI9GRv8ny10Ff-xQ&s',
          is_video: false,
          created_at: '2024-03-25T10:00:00Z'
        },
        {
          id: '9',
          title: 'Theatre Workshop with Students',
          media_url: 'https://images.pexels.com/photos/2853422/pexels-photo-2853422.jpeg',
          is_video: false,
          created_at: '2024-04-01T10:00:00Z'
        }
      ];
      
      setGalleryItems(mockData);
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
    document.body.style.overflow = 'auto';
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
              Our <span className="text-primary-500">Gallery</span>
            </h1>
            <div className="w-20 h-1 bg-primary-500 mx-auto mb-6"></div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              A visual journey through our performances and behind-the-scenes moments
            </p>
          </motion.div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="container">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : galleryItems.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-2xl font-display mb-4">No gallery items found</h3>
            <p className="text-gray-400">There are currently no items in the gallery.</p>
          </div>
        ) : (
          <div className="grid-gallery">
            {galleryItems.map((item, index) => (
              <motion.div
                key={item.id}
                className="relative overflow-hidden rounded-lg aspect-square group cursor-pointer"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
                onClick={() => openLightbox(item)}
              >
                {/* Media */}
                {item.is_video ? (
                  <div className="relative w-full h-full bg-dark-400">
                    <video 
                      src={item.media_url} 
                      className="w-full h-full object-cover"
                      poster={item.media_url.replace('.mp4', '.jpg')}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-primary-500/80 flex items-center justify-center">
                        <Play className="h-8 w-8 text-white" />
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
                <div className="absolute inset-0 bg-gradient-to-t from-dark-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <h3 className="text-white font-bold">{item.title}</h3>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-gray-300 text-sm">
                      {new Date(item.created_at).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                    <button 
                      className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center"
                      aria-label="View full size"
                    >
                      <Maximize className="h-4 w-4 text-white" />
                    </button>
                  </div>
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
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-dark-400 flex items-center justify-center"
            onClick={closeLightbox}
            aria-label="Close lightbox"
          >
            <X className="h-6 w-6 text-white" />
          </button>
          
          <div className="max-w-4xl max-h-[80vh] relative">
            {currentItem.is_video ? (
              <video 
                src={currentItem.media_url} 
                controls 
                autoPlay 
                className="max-h-[80vh] w-auto"
              />
            ) : (
              <img 
                src={currentItem.media_url} 
                alt={currentItem.title} 
                className="max-h-[80vh] w-auto"
              />
            )}
            
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
              <h3 className="text-white text-xl font-bold">{currentItem.title}</h3>
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