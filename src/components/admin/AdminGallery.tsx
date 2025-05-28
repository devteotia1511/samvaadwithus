import { useState, useEffect } from 'react';
import { supabase, GalleryItem } from '../../lib/supabase';
import { Image, Trash, Plus, AlertCircle, Loader, X, Check, UploadCloud, Link as LinkIcon } from 'lucide-react';

const AdminGallery = () => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState<Partial<GalleryItem>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
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
          media_url: 'https://images.pexels.com/photos/11050165/pexels-photo-11050165.jpeg',
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
          title: 'Director\'s Workshop',
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
          title: 'Costume Design Exhibition',
          media_url: 'https://images.pexels.com/photos/2837793/pexels-photo-2837793.jpeg',
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

  const openAddModal = () => {
    setCurrentItem({
      title: '',
      media_url: '',
      is_video: false
    });
    setIsEditing(false);
    setIsModalOpen(true);
    setErrors({});
  };

  const openEditModal = (item: GalleryItem) => {
    setCurrentItem({ ...item });
    setIsEditing(true);
    setIsModalOpen(true);
    setErrors({});
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentItem({});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setCurrentItem(prev => ({ ...prev, [name]: checked }));
    } else {
      setCurrentItem(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!currentItem.title?.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!currentItem.media_url?.trim()) {
      newErrors.media_url = 'Media URL is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real implementation, this would interact with Supabase
      // const { data, error } = isEditing 
      //   ? await supabase.from('gallery').update(currentItem).eq('id', currentItem.id)
      //   : await supabase.from('gallery').insert(currentItem).select();
      
      // For demo purposes, simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (isEditing) {
        // Update existing item in the local state
        setGalleryItems(prev => 
          prev.map(item => item.id === currentItem.id ? { ...item, ...currentItem } as GalleryItem : item)
        );
      } else {
        // Add new item to the local state
        const newItem = {
          ...currentItem,
          id: String(Date.now()),
          created_at: new Date().toISOString()
        } as GalleryItem;
        
        setGalleryItems(prev => [newItem, ...prev]);
      }
      
      closeModal();
    } catch (error) {
      console.error('Error saving gallery item:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (deleteConfirmId !== id) {
      setDeleteConfirmId(id);
      return;
    }
    
    try {
      // In a real implementation, this would interact with Supabase
      // const { error } = await supabase.from('gallery').delete().eq('id', id);
      
      // For demo purposes, simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Remove from local state
      setGalleryItems(prev => prev.filter(item => item.id !== id));
      setDeleteConfirmId(null);
    } catch (error) {
      console.error('Error deleting gallery item:', error);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmId(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Gallery</h2>
        <button 
          className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-md flex items-center transition-colors"
          onClick={openAddModal}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Item
        </button>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader className="h-8 w-8 text-primary-500 animate-spin" />
          <span className="ml-2 text-gray-300">Loading gallery...</span>
        </div>
      ) : galleryItems.length === 0 ? (
        <div className="text-center py-16 bg-dark-300 rounded-lg">
          <Image className="h-12 w-12 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No gallery items found</h3>
          <p className="text-gray-400 mb-6">There are no items in the gallery yet.</p>
          <button 
            className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-md inline-flex items-center transition-colors"
            onClick={openAddModal}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Item
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {galleryItems.map(item => (
            <div 
              key={item.id} 
              className="relative group bg-dark-300 rounded-lg overflow-hidden"
            >
              <div className="aspect-square">
                {item.is_video ? (
                  <video 
                    src={item.media_url} 
                    className="w-full h-full object-cover"
                    poster={item.media_url}
                  />
                ) : (
                  <img 
                    src={item.media_url} 
                    alt={item.title} 
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-t from-dark-500 via-dark-500/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <h3 className="text-white font-bold truncate">{item.title}</h3>
                <div className="flex justify-between items-center mt-4">
                  <button 
                    className="p-2 bg-dark-400/80 hover:bg-dark-300 rounded-full transition-colors"
                    onClick={() => openEditModal(item)}
                    aria-label="Edit gallery item"
                  >
                    <Image className="h-4 w-4 text-white" />
                  </button>
                  
                  {deleteConfirmId === item.id ? (
                    <div className="flex items-center bg-dark-500/80 p-1 rounded-full">
                      <button
                        className="p-1 hover:bg-red-500/20 rounded-full transition-colors"
                        onClick={() => handleDelete(item.id)}
                        aria-label="Confirm delete"
                      >
                        <Check className="h-4 w-4 text-red-500" />
                      </button>
                      <button
                        className="p-1 hover:bg-dark-200 rounded-full transition-colors"
                        onClick={cancelDelete}
                        aria-label="Cancel delete"
                      >
                        <X className="h-4 w-4 text-white" />
                      </button>
                    </div>
                  ) : (
                    <button 
                      className="p-2 bg-dark-400/80 hover:bg-red-500/20 rounded-full transition-colors"
                      onClick={() => handleDelete(item.id)}
                      aria-label="Delete gallery item"
                    >
                      <Trash className="h-4 w-4 text-white" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Gallery Item Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-dark-400 rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">
                  {isEditing ? 'Edit Gallery Item' : 'Add New Gallery Item'}
                </h3>
                <button 
                  className="text-gray-400 hover:text-white"
                  onClick={closeModal}
                  aria-label="Close modal"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  {/* Title */}
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={currentItem.title || ''}
                      onChange={handleInputChange}
                      className={`w-full bg-dark-300 border ${errors.title ? 'border-red-500' : 'border-dark-200'} rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500`}
                      placeholder="Enter gallery item title"
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-500 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {errors.title}
                      </p>
                    )}
                  </div>
                  
                  {/* Media URL */}
                  <div>
                    <label htmlFor="media_url" className="block text-sm font-medium text-gray-300 mb-1">
                      Media URL
                    </label>
                    <div className="flex">
                      <input
                        type="url"
                        id="media_url"
                        name="media_url"
                        value={currentItem.media_url || ''}
                        onChange={handleInputChange}
                        className={`w-full bg-dark-300 border ${errors.media_url ? 'border-red-500' : 'border-dark-200'} rounded-l-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500`}
                        placeholder="Enter media URL"
                      />
                      <div className="relative group">
                        <button
                          type="button"
                          className="h-full px-4 bg-dark-200 text-white rounded-r-md hover:bg-dark-100 transition-colors flex items-center"
                          onClick={() => {
                            // In a real implementation, this would open a file picker
                            // or Supabase Storage browser
                            alert('This would open a file picker in a real implementation');
                          }}
                        >
                          <UploadCloud className="h-5 w-5" />
                        </button>
                        <div className="absolute right-0 bottom-full mb-2 bg-dark-300 text-white text-xs p-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          Upload from device
                        </div>
                      </div>
                    </div>
                    {errors.media_url && (
                      <p className="mt-1 text-sm text-red-500 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {errors.media_url}
                      </p>
                    )}
                    {currentItem.media_url && !errors.media_url && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-400 mb-1">Preview:</p>
                        <div className="w-full h-48 rounded-md overflow-hidden bg-dark-300">
                          {currentItem.is_video ? (
                            <video
                              src={currentItem.media_url}
                              className="w-full h-full object-contain"
                              controls
                            />
                          ) : (
                            <img 
                              src={currentItem.media_url} 
                              alt="Preview" 
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = 'https://via.placeholder.com/150?text=Invalid+Image';
                                setErrors(prev => ({ ...prev, media_url: 'Invalid media URL' }));
                              }}
                            />
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Is Video */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_video"
                      name="is_video"
                      checked={currentItem.is_video || false}
                      onChange={(e) => setCurrentItem(prev => ({ ...prev, is_video: e.target.checked }))}
                      className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-dark-200 rounded"
                    />
                    <label htmlFor="is_video" className="ml-2 block text-sm text-gray-300">
                      This is a video
                    </label>
                  </div>
                  
                  {/* Submit Button */}
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-4 py-2 bg-dark-300 text-white rounded-md hover:bg-dark-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors flex items-center disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader className="animate-spin h-4 w-4 mr-2" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          {isEditing ? 'Update Item' : 'Add to Gallery'}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminGallery;