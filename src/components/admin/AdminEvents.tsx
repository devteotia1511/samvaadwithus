import { useState, useEffect } from 'react';
import { supabase, Event } from '../../lib/supabase';
import { Calendar, Edit, Trash, Plus, AlertCircle, Loader, X, Check, Clock, MapPin } from 'lucide-react';

const AdminEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Partial<Event>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      // In a real implementation, this would fetch from Supabase
      // const { data, error } = await supabase.from('events').select('*').order('date', { ascending: false });
      
      // For demo purposes, using mock data
      const mockData: Event[] = [
        {
          id: '1',
          title: 'Echoes of Time',
          description: 'A mesmerizing performance that blends drama, music, and innovative staging to explore the intertwined stories of three generations.',
          date: '2025-05-15',
          time: '19:00',
          venue: 'City Theatre, Mumbai',
          image_url: 'https://images.pexels.com/photos/11050165/pexels-photo-11050165.jpeg',
          is_upcoming: true,
          created_at: '2024-04-10T10:00:00Z'
        },
        {
          id: '2',
          title: 'The Silent Monologue',
          description: 'An innovative performance exploring the power of non-verbal communication through a series of interconnected silent monologues.',
          date: '2025-06-22',
          time: '18:30',
          venue: 'Experimental Theatre, Delhi',
          image_url: 'https://images.pexels.com/photos/8107967/pexels-photo-8107967.jpeg',
          is_upcoming: true,
          created_at: '2024-04-11T10:00:00Z'
        },
        {
          id: '3',
          title: 'Threads of Destiny',
          description: 'A powerful drama following the lives of five individuals whose destinies become intertwined through a series of seemingly random events.',
          date: '2025-07-10',
          time: '20:00',
          venue: 'National Centre for Performing Arts, Mumbai',
          image_url: 'https://images.pexels.com/photos/1916820/pexels-photo-1916820.jpeg',
          is_upcoming: true,
          created_at: '2024-04-12T10:00:00Z'
        },
        {
          id: '4',
          title: 'Shadows of Yesterday',
          description: 'An immersive theatrical experience exploring themes of memory, loss, and redemption through a blend of traditional and experimental techniques.',
          date: '2025-01-15',
          time: '19:30',
          venue: 'Heritage Theatre, Pune',
          image_url: 'https://images.pexels.com/photos/11793942/pexels-photo-11793942.jpeg',
          is_upcoming: false,
          created_at: '2024-01-05T10:00:00Z'
        },
        {
          id: '5',
          title: 'Voices Unheard',
          description: 'A groundbreaking production giving voice to marginalized stories through a powerful combination of verbatim theatre and original music.',
          date: '2024-11-30',
          time: '18:00',
          venue: 'Community Arts Center, Bangalore',
          image_url: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg',
          is_upcoming: false,
          created_at: '2024-02-10T10:00:00Z'
        },
        {
          id: '6',
          title: 'The Last Poem',
          description: 'A poetic exploration of life, love, and art through the final works of a fictional poet facing their mortality.',
          date: '2024-09-05',
          time: '19:00',
          venue: 'Literary Theatre, Kolkata',
          image_url: 'https://images.pexels.com/photos/269140/pexels-photo-269140.jpeg',
          is_upcoming: false,
          created_at: '2024-03-15T10:00:00Z'
        }
      ];
      
      setEvents(mockData);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setCurrentEvent({
      title: '',
      description: '',
      date: '',
      time: '',
      venue: '',
      image_url: '',
      is_upcoming: true
    });
    setIsEditing(false);
    setIsModalOpen(true);
    setErrors({});
  };

  const openEditModal = (event: Event) => {
    setCurrentEvent({ ...event });
    setIsEditing(true);
    setIsModalOpen(true);
    setErrors({});
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentEvent({});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setCurrentEvent(prev => ({ ...prev, [name]: checked }));
    } else {
      setCurrentEvent(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!currentEvent.title?.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!currentEvent.description?.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!currentEvent.date) {
      newErrors.date = 'Date is required';
    }
    
    if (!currentEvent.time) {
      newErrors.time = 'Time is required';
    }
    
    if (!currentEvent.venue?.trim()) {
      newErrors.venue = 'Venue is required';
    }
    
    if (!currentEvent.image_url?.trim()) {
      newErrors.image_url = 'Image URL is required';
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
      //   ? await supabase.from('events').update(currentEvent).eq('id', currentEvent.id)
      //   : await supabase.from('events').insert(currentEvent).select();
      
      // For demo purposes, simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (isEditing) {
        // Update existing event in the local state
        setEvents(prev => 
          prev.map(event => event.id === currentEvent.id ? { ...event, ...currentEvent } as Event : event)
        );
      } else {
        // Add new event to the local state
        const newEvent = {
          ...currentEvent,
          id: String(Date.now()),
          created_at: new Date().toISOString()
        } as Event;
        
        setEvents(prev => [newEvent, ...prev]);
      }
      
      closeModal();
    } catch (error) {
      console.error('Error saving event:', error);
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
      // const { error } = await supabase.from('events').delete().eq('id', id);
      
      // For demo purposes, simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Remove from local state
      setEvents(prev => prev.filter(event => event.id !== id));
      setDeleteConfirmId(null);
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmId(null);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Events</h2>
        <button 
          className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-md flex items-center transition-colors"
          onClick={openAddModal}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Event
        </button>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader className="h-8 w-8 text-primary-500 animate-spin" />
          <span className="ml-2 text-gray-300">Loading events...</span>
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-16 bg-dark-300 rounded-lg">
          <Calendar className="h-12 w-12 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No events found</h3>
          <p className="text-gray-400 mb-6">There are no events in the database yet.</p>
          <button 
            className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-md inline-flex items-center transition-colors"
            onClick={openAddModal}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Event
          </button>
        </div>
      ) : (
        <div className="bg-dark-300 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dark-400">
                <tr>
                  <th className="px-4 py-3 text-left">Title</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Venue</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-200">
                {events.map(event => (
                  <tr key={event.id} className="hover:bg-dark-400/50 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-md overflow-hidden mr-3 flex-shrink-0">
                          <img 
                            src={event.image_url} 
                            alt={event.title} 
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="truncate max-w-xs">
                          <div className="font-semibold truncate">{event.title}</div>
                          <div className="text-sm text-gray-400 truncate">{event.description.substring(0, 60)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-primary-500 mr-2" />
                        <span>{formatDate(event.date)}</span>
                      </div>
                      <div className="text-sm text-gray-400 flex items-center mt-1">
                        <Clock className="h-3 w-3 text-gray-500 mr-2" />
                        <span>{event.time}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-primary-500 mr-2" />
                        <span className="truncate max-w-[150px]">{event.venue}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        event.is_upcoming 
                          ? 'bg-primary-500/20 text-primary-500' 
                          : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {event.is_upcoming ? 'Upcoming' : 'Past'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          className="p-2 hover:bg-dark-200 rounded-md transition-colors"
                          onClick={() => openEditModal(event)}
                          aria-label="Edit event"
                        >
                          <Edit className="h-4 w-4 text-gray-400 hover:text-white" />
                        </button>
                        
                        {deleteConfirmId === event.id ? (
                          <div className="flex items-center bg-dark-500 p-1 rounded-md">
                            <button
                              className="p-1 hover:bg-red-500/20 rounded-md transition-colors"
                              onClick={() => handleDelete(event.id)}
                              aria-label="Confirm delete"
                            >
                              <Check className="h-4 w-4 text-red-500" />
                            </button>
                            <button
                              className="p-1 hover:bg-dark-200 rounded-md transition-colors"
                              onClick={cancelDelete}
                              aria-label="Cancel delete"
                            >
                              <X className="h-4 w-4 text-gray-400" />
                            </button>
                          </div>
                        ) : (
                          <button 
                            className="p-2 hover:bg-red-500/20 rounded-md transition-colors"
                            onClick={() => handleDelete(event.id)}
                            aria-label="Delete event"
                          >
                            <Trash className="h-4 w-4 text-gray-400 hover:text-red-500" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Event Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-dark-400 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">
                  {isEditing ? 'Edit Event' : 'Add New Event'}
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
                      Event Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={currentEvent.title || ''}
                      onChange={handleInputChange}
                      className={`w-full bg-dark-300 border ${errors.title ? 'border-red-500' : 'border-dark-200'} rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500`}
                      placeholder="Enter event title"
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-500 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {errors.title}
                      </p>
                    )}
                  </div>
                  
                  {/* Description */}
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={currentEvent.description || ''}
                      onChange={handleInputChange}
                      rows={4}
                      className={`w-full bg-dark-300 border ${errors.description ? 'border-red-500' : 'border-dark-200'} rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500`}
                      placeholder="Enter event description"
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-500 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {errors.description}
                      </p>
                    )}
                  </div>
                  
                  {/* Date and Time */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-1">
                        Date
                      </label>
                      <input
                        type="date"
                        id="date"
                        name="date"
                        value={currentEvent.date || ''}
                        onChange={handleInputChange}
                        className={`w-full bg-dark-300 border ${errors.date ? 'border-red-500' : 'border-dark-200'} rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500`}
                      />
                      {errors.date && (
                        <p className="mt-1 text-sm text-red-500 flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {errors.date}
                        </p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="time" className="block text-sm font-medium text-gray-300 mb-1">
                        Time
                      </label>
                      <input
                        type="time"
                        id="time"
                        name="time"
                        value={currentEvent.time || ''}
                        onChange={handleInputChange}
                        className={`w-full bg-dark-300 border ${errors.time ? 'border-red-500' : 'border-dark-200'} rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500`}
                      />
                      {errors.time && (
                        <p className="mt-1 text-sm text-red-500 flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {errors.time}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {/* Venue */}
                  <div>
                    <label htmlFor="venue" className="block text-sm font-medium text-gray-300 mb-1">
                      Venue
                    </label>
                    <input
                      type="text"
                      id="venue"
                      name="venue"
                      value={currentEvent.venue || ''}
                      onChange={handleInputChange}
                      className={`w-full bg-dark-300 border ${errors.venue ? 'border-red-500' : 'border-dark-200'} rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500`}
                      placeholder="Enter venue name and location"
                    />
                    {errors.venue && (
                      <p className="mt-1 text-sm text-red-500 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {errors.venue}
                      </p>
                    )}
                  </div>
                  
                  {/* Image URL */}
                  <div>
                    <label htmlFor="image_url" className="block text-sm font-medium text-gray-300 mb-1">
                      Image URL
                    </label>
                    <input
                      type="url"
                      id="image_url"
                      name="image_url"
                      value={currentEvent.image_url || ''}
                      onChange={handleInputChange}
                      className={`w-full bg-dark-300 border ${errors.image_url ? 'border-red-500' : 'border-dark-200'} rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500`}
                      placeholder="Enter image URL"
                    />
                    {errors.image_url && (
                      <p className="mt-1 text-sm text-red-500 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {errors.image_url}
                      </p>
                    )}
                    {currentEvent.image_url && !errors.image_url && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-400 mb-1">Image preview:</p>
                        <div className="w-24 h-24 rounded-md overflow-hidden">
                          <img 
                            src={currentEvent.image_url} 
                            alt="Preview" 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'https://via.placeholder.com/150?text=Invalid+Image';
                              setErrors(prev => ({ ...prev, image_url: 'Invalid image URL' }));
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Is Upcoming */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_upcoming"
                      name="is_upcoming"
                      checked={currentEvent.is_upcoming || false}
                      onChange={(e) => setCurrentEvent(prev => ({ ...prev, is_upcoming: e.target.checked }))}
                      className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-dark-200 rounded"
                    />
                    <label htmlFor="is_upcoming" className="ml-2 block text-sm text-gray-300">
                      Mark as upcoming event
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
                          {isEditing ? 'Update Event' : 'Create Event'}
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

export default AdminEvents;