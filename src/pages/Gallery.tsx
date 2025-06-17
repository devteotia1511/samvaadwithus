import { useState, useEffect } from 'react';
import { Image, Play } from 'lucide-react';
import { dataService, GalleryItem } from '../lib/supabase';

const Gallery = () => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  useEffect(() => {
    const fetchGalleryItems = async () => {
      try {
        setLoading(true);
        const data = await dataService.gallery.getAll();
        setGalleryItems(data);
      } catch (error) {
        console.error('Error fetching gallery items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryItems();
  }, []);

  if (loading) {
    return (
      <div className="pt-24 pb-16">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-700 rounded w-1/3 mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-dark-400 p-6 rounded-lg border border-dark-300">
                    <div className="h-6 bg-gray-600 rounded w-1/2 mb-4"></div>
                    <div className="h-4 bg-gray-600 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16">
      <div className="container">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Gallery</h1>
          
          {galleryItems.length === 0 ? (
            <div className="text-center py-16">
              <Image className="h-16 w-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No gallery items found</h3>
              <p className="text-gray-400">Check back later for new content.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryItems.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-dark-400 rounded-lg overflow-hidden border border-dark-300 hover:border-primary-500/30 transition-colors cursor-pointer"
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="aspect-video relative overflow-hidden">
                    {item.is_video ? (
                      <>
                        <video
                          src={item.media_url}
                          className="w-full h-full object-cover"
                          poster={item.media_url}
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity">
                          <Play className="w-12 h-12 text-white" />
                        </div>
                      </>
                    ) : (
                      <img
                        src={item.media_url}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://via.placeholder.com/400x300?text=Image';
                        }}
                      />
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedItem && (
        <div 
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedItem(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 text-2xl z-10"
            >
              ×
            </button>
            <div className="bg-dark-400 rounded-lg overflow-hidden">
              {selectedItem.is_video ? (
                <video
                  src={selectedItem.media_url}
                  controls
                  className="max-w-full max-h-[80vh]"
                />
              ) : (
                <img
                  src={selectedItem.media_url}
                  alt={selectedItem.title}
                  className="max-w-full max-h-[80vh] object-contain"
                />
              )}
              <div className="p-4">
                <h3 className="text-xl font-semibold">{selectedItem.title}</h3>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;