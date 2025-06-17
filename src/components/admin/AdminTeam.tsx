import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { dataService, TeamMember, uploadImageToStorage } from '../../lib/supabase';
import { useNotification } from '../../hooks/useNotification';

const AdminTeam = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    phone: '',
    email: '',
    photo_url: '',
    is_core: false,
  });
  const { addNotification } = useNotification();
  const [uploading, setUploading] = useState(false);

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      const data = await dataService.teamMembers.getAll();
      setTeamMembers(data);
    } catch (error) {
      console.error('Error fetching team members:', error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to load team members'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting:', formData);
    try {
      if (editingMember) {
        await dataService.teamMembers.update(editingMember.id, formData);
        addNotification({
          type: 'success',
          title: 'Success',
          message: 'Team member updated successfully'
        });
      } else {
        await dataService.teamMembers.create(formData);
        addNotification({
          type: 'success',
          title: 'Success',
          message: 'Team member created successfully'
        });
      }
      setShowForm(false);
      setEditingMember(null);
      resetForm();
      fetchTeamMembers();
    } catch (error) {
      console.error('Error saving team member:', error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to save team member'
      });
    }
  };

  const handleEdit = (member: TeamMember) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      title: member.title,
      phone: member.phone,
      email: member.email,
      photo_url: member.photo_url,
      is_core: member.is_core,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this team member?')) {
      try {
        await dataService.teamMembers.delete(id);
        addNotification({
          type: 'success',
          title: 'Success',
          message: 'Team member deleted successfully'
        });
        fetchTeamMembers();
      } catch (error) {
        console.error('Error deleting team member:', error);
        addNotification({
          type: 'error',
          title: 'Error',
          message: 'Failed to delete team member'
        });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      title: '',
      phone: '',
      email: '',
      photo_url: '',
      is_core: false,
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
            <h1 className="text-3xl font-bold">Manage Team</h1>
            <button
              onClick={() => {
                setShowForm(true);
                setEditingMember(null);
                resetForm();
              }}
              className="btn btn-primary flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Member
            </button>
          </div>

          {showForm && (
            <div className="bg-dark-400 p-6 rounded-lg border border-dark-300 mb-8">
              <h2 className="text-xl font-semibold mb-4">
                {editingMember ? 'Edit Team Member' : 'Add New Team Member'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 bg-dark-500 border border-dark-300 rounded-lg focus:outline-none focus:border-primary-500"
                      required
                    />
                  </div>
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
                  {/* <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 bg-dark-500 border border-dark-300 rounded-lg focus:outline-none focus:border-primary-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 bg-dark-500 border border-dark-300 rounded-lg focus:outline-none focus:border-primary-500"
                      required
                    />
                  </div> */}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_core"
                    checked={formData.is_core}
                    onChange={(e) => setFormData({ ...formData, is_core: e.target.checked })}
                    className="rounded border-dark-300 bg-dark-500"
                  />
                  <label htmlFor="is_core" className="text-sm">
                    Core Team Member
                  </label>
                </div>
                {formData.is_core && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2">Photo</label>
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
                              setFormData((prev) => ({ ...prev, photo_url: url }));
                            } catch (err) {
                              console.error('Photo upload error:', err);
                              setFormData((prev) => ({ ...prev, photo_url: '' }));
                            }
                            setUploading(false);
                          }
                        }}
                        className="w-full px-3 py-2 bg-dark-500 border border-dark-300 rounded-lg focus:outline-none focus:border-primary-500"
                      />
                      {uploading && <div className="text-xs text-primary-400 mt-2">Uploading...</div>}
                      {formData.photo_url && !uploading && (
                        <img src={formData.photo_url} alt="Preview" className="w-20 h-20 mt-2 rounded object-cover border border-dark-300" />
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3 py-2 bg-dark-500 border border-dark-300 rounded-lg focus:outline-none focus:border-primary-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Phone</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3 py-2 bg-dark-500 border border-dark-300 rounded-lg focus:outline-none focus:border-primary-500"
                        required
                      />
                    </div>
                  </>
                )}
                <div className="flex gap-4">
                  <button type="submit" className="btn btn-primary" disabled={uploading}>
                    {editingMember ? 'Update Member' : 'Create Member'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingMember(null);
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
            {teamMembers.map((member) => (
              <div key={member.id} className="bg-dark-400 p-6 rounded-lg border border-dark-300">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{member.name}</h3>
                    <p className="text-gray-300">{member.title}</p>
                    {member.is_core && (
                      <span className="inline-block bg-primary-500/20 text-primary-400 text-xs px-2 py-1 rounded mt-2">
                        Core Team
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(member)}
                      className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(member.id)}
                      className="p-2 text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-gray-400">
                  <div>Email: {member.email}</div>
                  <div>Phone: {member.phone}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTeam;