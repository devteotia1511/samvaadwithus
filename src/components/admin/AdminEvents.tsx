import { useState, useEffect } from 'react';
import { supabase, Event, dataService } from '../../lib/supabase';
import { Calendar, Edit, Trash, Plus, AlertCircle, Loader, X, Check, Clock, MapPin, Save } from 'lucide-react';
import { useRealtimeSync } from '../../hooks/useRealtimeSync';
import { useNotification } from '../../hooks/useNotification';
import LoadingSpinner from '../common/LoadingSpinner';

const AdminEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Partial<Event>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const { addNotification } = useNotification();

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
    showNotifications: true
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const data = await dataService.events.getAll();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
      addNotification({
        type: 'error',
        title: 'Error Loading Events',
        message: 'Failed to load events from database.'
      });
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
    setErrors({});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setCurrentEvent(prev => ({ ...prev, [name]: checked }));
    } else {
      const sanitizedValue = value.trim();
      setCurrentEvent(prev => ({ ...prev, [name]: sanitizedValue }));
    }
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!currentEvent.title?.trim()) {
      newErrors.title = 'Title is required';
    } else if (currentEvent.title.length > 200) {
      newErrors.title = 'Title must be less than 200 characters';
    }
    
    if (!currentEvent.description?.trim()) {
      newErrors.description = 'Description is required';
    } else if (currentEvent.description.length > 1000) {
      newErrors.description = 'Description must be less than 1000 characters';
    }
    
    if (!currentEvent.date) {
      newErrors.date = 'Date is required';
    } else {
      const eventDate = new Date(currentEvent.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (eventDate < today && currentEvent.is_upcoming) {
        newErrors.date = 'Upcoming events cannot be in the past';
      }
    }
    
    if (!currentEvent.time) {
      newErrors.time = 'Time is required';
    }
    
    if (!currentEvent.venue?.trim()) {
      newErrors.venue = 'Venue is required';
    } else if (currentEvent.venue.length > 300) {
      newErrors.venue = 'Venue must be less than 300 characters';
    }
    
    if (!currentEvent.image_url?.trim()) {
      newErrors.image_url = 'Image URL is required';
    } else {
      try {
        new URL(currentEvent.image_url);
      } catch {
        newErrors.image_url = 'Please enter a valid URL';
      }
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
      if (isEditing) {
        await dataService.events.update(currentEvent.id!, currentEvent);
        addNotification({
          type: 'success',
          title: 'Event Updated',
          message: `"${currentEvent.title}" has been updated successfully.`
        });
      } else {
        await dataService.events.create(currentEvent as Omit<Event, 'id' | 'created_at'>);
        addNotification({
          type: 'success',
          title: 'Event Created',
          message: `"${currentEvent.title}" has been created successfully.`
        });
      }
      
      closeModal();
    } catch (error) {
      console.error('Error saving event:', error);
      addNotification({
        type: 'error',
        title: 'Error Saving Event',
        message: 'Failed to save event. Please try again.'
      });
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
      await dataService.events.delete(id);
      addNotification({
        type: 'success',
        title: 'Event Deleted',
        message: 'Event has been removed successfully.'
      });
    } catch (error) {
      console.error('Error deleting event:', error);
      addNotification({
        type: 'error',
        title: 'Error Deleting Event',
        message: 'Failed to delete event. Please try again.'
      });
    } finally {
      setDeleteConfirmId(null);
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
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold">Manage Events</h2>
          <p className="text-gray-400 text-sm">Create, edit, and manage theatre events</p>
        </div>
        <button 
          className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-md flex items-center transition-colors self-start sm:self-auto"
          onClick={openAddModal}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Event
        </button>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <LoadingSpinner size="lg" text="Loading events..." />
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
                  <th className="px-4 py-3 text-left hidden sm:table-cell">Date</th>
                  <th className="px-4 py-3 text-left hidden md:table-cell">Venue</th>
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
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'https://via.placeholder.com/150?text=No+Image';
                            }}
                          />
                        </div>
                        <div className="truncate max-w-xs">
                          <div className="font-semibold truncate">{event.title}</div>
                          <div className="text-sm text-gray-400 truncate sm:hidden">
                            {formatDate(event.date)} • {event.time}
                          </div>
                          <div className="text-sm text-gray-400 truncate hidden sm:block">
                            {event.description.substring(0, 60)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden sm:table-cell">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-primary-500 mr-2" />
                        <span>{formatDate(event.date)}</span>
                      </div>
                      <div className="text-sm text-gray-400 flex items-center mt-1">
                        <Clock className="h-3 w-3 text-gray-500 mr-2" />
                        <span>{event.time}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
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
                      Event Title *
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={currentEvent.title || ''}
                      onChange={handleInputChange}
                      className={`w-full bg-dark-300 border ${errors.title ? 'border-red-500' : 'border-dark-200'} rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500`}
                      placeholder="Enter event title"
                      maxLength={200}
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
                      Description *
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={currentEvent.description || ''}
                      onChange={handleInputChange}
                      rows={4}
                      className={`w-full bg-dark-300 border ${errors.description ? 'border-red-500' : 'border-dark-200'} rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500`}
                      placeholder="Enter event description"
                      maxLength={1000}
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
                        Date *
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
                        Time *
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
                      Venue *
                    </label>
                    <input
                      type="text"
                      id="venue"
                      name="venue"
                      value={currentEvent.venue || ''}
                      onChange={handleInputChange}
                      className={`w-full bg-dark-300 border ${errors.venue ? 'border-red-500' : 'border-dark-200'} rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500`}
                      placeholder="Enter venue name and location"
                      maxLength={300}
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
                      Image URL *
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
                          <Save className="h-4 w-4 mr-2" />
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