import { useState, useEffect } from 'react';
import { Calendar, Plus, Edit, Trash2 } from 'lucide-react';
import { dataService, Event, uploadImageToStorage } from '../../lib/supabase';
import { useNotification } from '../../hooks/useNotification';

const AdminEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    venue: '',
    image_url: '',
    is_upcoming: true,
  });
  const { addNotification } = useNotification();
  const [uploading, setUploading] = useState(false);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching events...');
      const data = await dataService.events.getAll();
      console.log('✅ Events fetched:', data);
      setEvents(data);
    } catch (error) {
      console.error('❌ Error fetching events:', error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: `Failed to load events: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting:', formData);
    
    try {
      if (editingEvent) {
        console.log('🔄 Updating event:', editingEvent.id);
        await dataService.events.update(editingEvent.id, formData);
        addNotification({
          type: 'success',
          title: 'Success',
          message: 'Event updated successfully'
        });
      } else {
        console.log('➕ Creating new event');
        await dataService.events.create(formData);
        addNotification({
          type: 'success',
          title: 'Success',
          message: 'Event created successfully'
        });
      }
      setShowForm(false);
      setEditingEvent(null);
      resetForm();
      fetchEvents();
    } catch (error) {
      console.error('❌ Error saving event:', error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: `Failed to save event: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      venue: event.venue,
      image_url: event.image_url,
      is_upcoming: event.is_upcoming,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        console.log('🗑️ Deleting event:', id);
        await dataService.events.delete(id);
        addNotification({
          type: 'success',
          title: 'Success',
          message: 'Event deleted successfully'
        });
        fetchEvents();
      } catch (error) {
        console.error('❌ Error deleting event:', error);
        addNotification({
          type: 'error',
          title: 'Error',
          message: `Failed to delete event: ${error instanceof Error ? error.message : 'Unknown error'}`
        });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      date: '',
      time: '',
      venue: '',
      image_url: '',
      is_upcoming: true,
    });
  };

  if (loading) {
    return (
      <div className="pt-24 pb-16">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-700 rounded w-1/3 mb-8"></div>
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
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
            <h1 className="text-3xl font-bold">Manage Events</h1>
            <button
              onClick={() => {
                setShowForm(true);
                setEditingEvent(null);
                resetForm();
              }}
              className="btn btn-primary flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Event
            </button>
          </div>

          {showForm && (
            <div className="bg-dark-400 p-6 rounded-lg border border-dark-300 mb-8">
              <h2 className="text-xl font-semibold mb-4">
                {editingEvent ? 'Edit Event' : 'Add New Event'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <label className="block text-sm font-medium mb-2">Date</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-3 py-2 bg-dark-500 border border-dark-300 rounded-lg focus:outline-none focus:border-primary-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Time</label>
                    <input
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="w-full px-3 py-2 bg-dark-500 border border-dark-300 rounded-lg focus:outline-none focus:border-primary-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Venue</label>
                    <input
                      type="text"
                      value={formData.venue}
                      onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                      className="w-full px-3 py-2 bg-dark-500 border border-dark-300 rounded-lg focus:outline-none focus:border-primary-500"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 bg-dark-500 border border-dark-300 rounded-lg focus:outline-none focus:border-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Event Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setUploading(true);
                        try {
                          const url = await uploadImageToStorage(file, 'photos');
                          console.log('Upload returned URL:', url);
                          setFormData((prev) => ({ ...prev, image_url: url }));
                        } catch (err) {
                          console.error('Event image upload error:', err);
                          setFormData((prev) => ({ ...prev, image_url: '' }));
                        }
                        setUploading(false);
                      }
                    }}
                    className="w-full px-3 py-2 bg-dark-500 border border-dark-300 rounded-lg focus:outline-none focus:border-primary-500"
                  />
                  {uploading && <div className="text-xs text-primary-400 mt-2">Uploading...</div>}
                  {formData.image_url && !uploading && (
                    <img src={formData.image_url} alt="Preview" className="w-40 h-24 mt-2 rounded object-cover border border-dark-300" />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_upcoming"
                    checked={formData.is_upcoming}
                    onChange={(e) => setFormData({ ...formData, is_upcoming: e.target.checked })}
                    className="rounded border-dark-300 bg-dark-500"
                  />
                  <label htmlFor="is_upcoming" className="text-sm">
                    Mark as upcoming event
                  </label>
                </div>
                <div className="flex gap-4">
                  <button type="submit" className="btn btn-primary" disabled={uploading}>
                    {editingEvent ? 'Update Event' : 'Create Event'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingEvent(null);
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

          <div className="space-y-4">
            {events.map((event) => (
              <div key={event.id} className="bg-dark-400 p-6 rounded-lg border border-dark-300">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                    <p className="text-gray-300 mb-2">{event.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(event.date).toLocaleDateString()}
                      </span>
                      <span>{event.time}</span>
                      <span>{event.venue}</span>
                      {event.is_upcoming && (
                        <span className="text-green-400">Upcoming</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(event)}
                      className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="p-2 text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminEvents;