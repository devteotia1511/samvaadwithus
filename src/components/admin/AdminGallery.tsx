import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { dataService, GalleryItem, uploadImageToStorage } from '../../lib/supabase';
import { useNotification } from '../../hooks/useNotification';

const AdminGallery = () => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    media_url: '',
    is_video: false,
  });
  const { addNotification } = useNotification();
  const [uploading, setUploading] = useState(false);

  const fetchGalleryItems = async () => {
    try {
      setLoading(true);
      const data = await dataService.gallery.getAll();
      setGalleryItems(data);
    } catch (error) {
      console.error('Error fetching gallery items:', error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to load gallery items'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting:', formData);
    try {
      if (editingItem) {
        await dataService.gallery.update(editingItem.id, formData);
        addNotification({
          type: 'success',
          title: 'Success',
          message: 'Gallery item updated successfully'
        });
      } else {
        await dataService.gallery.create(formData);
        addNotification({
          type: 'success',
          title: 'Success',
          message: 'Gallery item created successfully'
        });
      }
      setShowForm(false);
      setEditingItem(null);
      resetForm();
      fetchGalleryItems();
    } catch (error) {
      console.error('Error saving gallery item:', error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to save gallery item'
      });
    }
  };

  const handleEdit = (item: GalleryItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      media_url: item.media_url,
      is_video: item.is_video,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this gallery item?')) {
      try {
        await dataService.gallery.delete(id);
        addNotification({
          type: 'success',
          title: 'Success',
          message: 'Gallery item deleted successfully'
        });
        fetchGalleryItems();
      } catch (error) {
        console.error('Error deleting gallery item:', error);
        addNotification({
          type: 'error',
          title: 'Error',
          message: 'Failed to delete gallery item'
        });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      media_url: '',
      is_video: false,
    });
  };

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
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Manage Gallery</h1>
            <button
              onClick={() => {
                setShowForm(true);
                setEditingItem(null);
                resetForm();
              }}
              className="btn btn-primary flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Item
            </button>
          </div>

          {showForm && (
            <div className="bg-dark-400 p-6 rounded-lg border border-dark-300 mb-8">
              <h2 className="text-xl font-semibold mb-4">
                {editingItem ? 'Edit Gallery Item' : 'Add New Gallery Item'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 bg-dark-500 border border-dark-300 rounded-lg focus:outline-none focus:border-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Media File</label>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setUploading(true);
                        try {
                          const url = await uploadImageToStorage(file, 'photos');
                          console.log('Upload returned URL:', url);
                          setFormData((prev) => ({
                            ...prev,
                            media_url: url,
                            is_video: file.type.startsWith('video/')
                          }));
                        } catch (err) {
                          console.error('Media upload error:', err);
                          setFormData((prev) => ({ ...prev, media_url: '' }));
                        }
                        setUploading(false);
                      }
                    }}
                    className="w-full px-3 py-2 bg-dark-500 border border-dark-300 rounded-lg focus:outline-none focus:border-primary-500"
                  />
                  {uploading && <div className="text-xs text-primary-400 mt-2">Uploading...</div>}
                  {formData.media_url && !uploading && (
                    <div className="mt-2">
                      {formData.is_video ? (
                        <video src={formData.media_url} className="w-40 h-24 rounded object-cover border border-dark-300" controls />
                      ) : (
                        <img src={formData.media_url} alt="Preview" className="w-40 h-24 rounded object-cover border border-dark-300" />
                      )}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_video"
                    checked={formData.is_video}
                    onChange={(e) => setFormData({ ...formData, is_video: e.target.checked })}
                    className="rounded border-dark-300 bg-dark-500"
                  />
                  <label htmlFor="is_video" className="text-sm">
                    Is Video (auto-detected from file type)
                  </label>
                </div>
                <div className="flex gap-4">
                  <button type="submit" className="btn btn-primary" disabled={uploading}>
                    {editingItem ? 'Update Item' : 'Create Item'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingItem(null);
                      resetForm();
                    }}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryItems.map((item) => (
              <div key={item.id} className="bg-dark-400 p-6 rounded-lg border border-dark-300">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="aspect-video bg-dark-500 rounded-lg overflow-hidden mb-4">
                  {item.is_video ? (
                    <video
                      src={item.media_url}
                      controls
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={item.media_url}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                      }}
                    />
                  )}
                </div>
                <div className="text-sm text-gray-400">
                  {item.is_video ? 'Video' : 'Image'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminGallery;