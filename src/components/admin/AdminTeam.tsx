import { useState, useEffect } from 'react';
import { supabase, TeamMember, dataService } from '../../lib/supabase';
import { Users, Edit, Trash, Plus, AlertCircle, Loader, X, Check, UserPlus, UploadCloud } from 'lucide-react';
import { useRealtimeSync } from '../../hooks/useRealtimeSync';
import { useNotification } from '../../hooks/useNotification';
import LoadingSpinner from '../common/LoadingSpinner';

const AdminTeam = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentMember, setCurrentMember] = useState<Partial<TeamMember>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'core' | 'other'>('all');
  const { addNotification } = useNotification();

  // Real-time synchronization
  useRealtimeSync({
    table: 'team_members',
    onInsert: (payload) => {
      setTeamMembers(prev => [payload.new, ...prev]);
    },
    onUpdate: (payload) => {
      setTeamMembers(prev => prev.map(member => 
        member.id === payload.new.id ? payload.new : member
      ));
    },
    onDelete: (payload) => {
      setTeamMembers(prev => prev.filter(member => member.id !== payload.old.id));
    },
    showNotifications: true
  });

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    setLoading(true);
    try {
      const data = await dataService.teamMembers.getAll();
      setTeamMembers(data);
    } catch (error) {
      console.error('Error fetching team members:', error);
      addNotification({
        type: 'error',
        title: 'Error Loading Team',
        message: 'Failed to load team members from database.'
      });
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setCurrentMember({
      name: '',
      title: '',
      phone: '',
      email: '',
      photo_url: '',
      is_core: false
    });
    setIsEditing(false);
    setIsModalOpen(true);
    setErrors({});
  };

  const openEditModal = (member: TeamMember) => {
    setCurrentMember({ ...member });
    setIsEditing(true);
    setIsModalOpen(true);
    setErrors({});
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentMember({});
    setErrors({});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setCurrentMember(prev => ({ ...prev, [name]: checked }));
    } else {
      const sanitizedValue = value.trim();
      setCurrentMember(prev => ({ ...prev, [name]: sanitizedValue }));
    }
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!currentMember.name?.trim()) {
      newErrors.name = 'Name is required';
    } else if (currentMember.name.length > 100) {
      newErrors.name = 'Name must be less than 100 characters';
    }
    
    if (!currentMember.title?.trim()) {
      newErrors.title = 'Title is required';
    } else if (currentMember.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }
    
    if (currentMember.is_core) {
      if (!currentMember.email?.trim()) {
        newErrors.email = 'Email is required for core team members';
      } else if (!/\S+@\S+\.\S+/.test(currentMember.email)) {
        newErrors.email = 'Email is invalid';
      }
      
      if (!currentMember.phone?.trim()) {
        newErrors.phone = 'Phone number is required for core team members';
      }
      
      if (!currentMember.photo_url?.trim()) {
        newErrors.photo_url = 'Photo URL is required for core team members';
      } else {
        try {
          new URL(currentMember.photo_url);
        } catch {
          newErrors.photo_url = 'Please enter a valid URL';
        }
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
        await dataService.teamMembers.update(currentMember.id!, currentMember);
        addNotification({
          type: 'success',
          title: 'Team Member Updated',
          message: `"${currentMember.name}" has been updated successfully.`
        });
      } else {
        await dataService.teamMembers.create(currentMember as Omit<TeamMember, 'id' | 'created_at'>);
        addNotification({
          type: 'success',
          title: 'Team Member Added',
          message: `"${currentMember.name}" has been added to the team successfully.`
        });
      }
      
      closeModal();
    } catch (error) {
      console.error('Error saving team member:', error);
      addNotification({
        type: 'error',
        title: 'Error Saving Team Member',
        message: 'Failed to save team member. Please try again.'
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
      await dataService.teamMembers.delete(id);
      addNotification({
        type: 'success',
        title: 'Team Member Removed',
        message: 'Team member has been removed successfully.'
      });
    } catch (error) {
      console.error('Error deleting team member:', error);
      addNotification({
        type: 'error',
        title: 'Error Removing Team Member',
        message: 'Failed to remove team member. Please try again.'
      });
    } finally {
      setDeleteConfirmId(null);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmId(null);
  };

  const filteredMembers = teamMembers.filter(member => {
    if (filter === 'all') return true;
    if (filter === 'core') return member.is_core;
    if (filter === 'other') return !member.is_core;
    return true;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Team</h2>
        <button 
          className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-md flex items-center transition-colors"
          onClick={openAddModal}
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Add Team Member
        </button>
      </div>
      
      {/* Filters */}
      <div className="bg-dark-300 p-4 rounded-lg flex flex-wrap items-center justify-between mb-6">
        <div className="flex items-center">
          <Users className="h-5 w-5 text-primary-500 mr-2" />
          <span className="text-gray-300 mr-4">Filter Team:</span>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md transition-colors ${filter === 'all' ? 'bg-primary-500 text-white' : 'bg-dark-200 text-gray-300 hover:bg-dark-100'}`}
          >
            All Members
          </button>
          <button
            onClick={() => setFilter('core')}
            className={`px-4 py-2 rounded-md transition-colors ${filter === 'core' ? 'bg-primary-500 text-white' : 'bg-dark-200 text-gray-300 hover:bg-dark-100'}`}
          >
            Core Team
          </button>
          <button
            onClick={() => setFilter('other')}
            className={`px-4 py-2 rounded-md transition-colors ${filter === 'other' ? 'bg-primary-500 text-white' : 'bg-dark-200 text-gray-300 hover:bg-dark-100'}`}
          >
            Other Members
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader className="h-8 w-8 text-primary-500 animate-spin" />
          <span className="ml-2 text-gray-300">Loading team members...</span>
        </div>
      ) : filteredMembers.length === 0 ? (
        <div className="text-center py-16 bg-dark-300 rounded-lg">
          <Users className="h-12 w-12 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No team members found</h3>
          <p className="text-gray-400 mb-6">There are no team members matching your current filter.</p>
          <button 
            className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-md inline-flex items-center transition-colors"
            onClick={openAddModal}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add Team Member
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map(member => (
            <div 
              key={member.id} 
              className="bg-dark-300 rounded-lg overflow-hidden hover:shadow-lg transition-all"
            >
              {/* For core team members with photos */}
              {member.is_core && member.photo_url ? (
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={member.photo_url} 
                    alt={member.name} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 flex space-x-1">
                    <button 
                      className="p-2 bg-dark-400/80 hover:bg-dark-300 rounded-full transition-colors"
                      onClick={() => openEditModal(member)}
                      aria-label="Edit team member"
                    >
                      <Edit className="h-4 w-4 text-white" />
                    </button>
                    
                    {deleteConfirmId === member.id ? (
                      <div className="flex items-center bg-dark-500/80 p-1 rounded-full">
                        <button
                          className="p-1 hover:bg-red-500/20 rounded-full transition-colors"
                          onClick={() => handleDelete(member.id)}
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
                        onClick={() => handleDelete(member.id)}
                        aria-label="Delete team member"
                      >
                        <Trash className="h-4 w-4 text-white" />
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="h-24 bg-dark-400 flex items-center justify-center">
                  <Users className="h-12 w-12 text-dark-200" />
                </div>
              )}
              
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold">{member.name}</h3>
                    <p className="text-primary-500">{member.title}</p>
                  </div>
                  
                  {/* For other members without photos */}
                  {(!member.is_core || !member.photo_url) && (
                    <div className="flex space-x-1">
                      <button 
                        className="p-1 hover:bg-dark-200 rounded-md transition-colors"
                        onClick={() => openEditModal(member)}
                        aria-label="Edit team member"
                      >
                        <Edit className="h-4 w-4 text-gray-400 hover:text-white" />
                      </button>
                      
                      {deleteConfirmId === member.id ? (
                        <div className="flex items-center bg-dark-500 rounded-md">
                          <button
                            className="p-1 hover:bg-red-500/20 rounded-md transition-colors"
                            onClick={() => handleDelete(member.id)}
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
                          className="p-1 hover:bg-red-500/20 rounded-md transition-colors"
                          onClick={() => handleDelete(member.id)}
                          aria-label="Delete team member"
                        >
                          <Trash className="h-4 w-4 text-gray-400 hover:text-red-500" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Only show contact info for core team */}
                {member.is_core && (
                  <div className="mt-3 space-y-1 text-sm">
                    {member.email && (
                      <p className="text-gray-300">Email: {member.email}</p>
                    )}
                    {member.phone && (
                      <p className="text-gray-300">Phone: {member.phone}</p>
                    )}
                  </div>
                )}
                
                <div className="mt-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    member.is_core 
                      ? 'bg-primary-500/20 text-primary-500' 
                      : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {member.is_core ? 'Core Team' : 'Member'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Team Member Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-dark-400 rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">
                  {isEditing ? 'Edit Team Member' : 'Add New Team Member'}
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
                  {/* Core Team Toggle */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_core"
                      name="is_core"
                      checked={currentMember.is_core || false}
                      onChange={(e) => setCurrentMember(prev => ({ ...prev, is_core: e.target.checked }))}
                      className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-dark-200 rounded"
                    />
                    <label htmlFor="is_core" className="ml-2 block text-white">
                      Core Team Member
                    </label>
                  </div>
                  
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={currentMember.name || ''}
                      onChange={handleInputChange}
                      className={`w-full bg-dark-300 border ${errors.name ? 'border-red-500' : 'border-dark-200'} rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500`}
                      placeholder="Enter full name"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-500 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {errors.name}
                      </p>
                    )}
                  </div>
                  
                  {/* Title */}
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
                      Title/Role <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={currentMember.title || ''}
                      onChange={handleInputChange}
                      className={`w-full bg-dark-300 border ${errors.title ? 'border-red-500' : 'border-dark-200'} rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500`}
                      placeholder="e.g., Director, Actor, Designer"
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-500 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {errors.title}
                      </p>
                    )}
                  </div>
                  
                  {/* Contact info - only required for core team */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                        Email {currentMember.is_core && <span className="text-red-500">*</span>}
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={currentMember.email || ''}
                        onChange={handleInputChange}
                        className={`w-full bg-dark-300 border ${errors.email ? 'border-red-500' : 'border-dark-200'} rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500`}
                        placeholder="Enter email address"
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-500 flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {errors.email}
                        </p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
                        Phone {currentMember.is_core && <span className="text-red-500">*</span>}
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={currentMember.phone || ''}
                        onChange={handleInputChange}
                        className={`w-full bg-dark-300 border ${errors.phone ? 'border-red-500' : 'border-dark-200'} rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500`}
                        placeholder="Enter phone number"
                      />
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-500 flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {/* Photo URL - only for core team */}
                  {(currentMember.is_core || currentMember.photo_url) && (
                    <div>
                      <label htmlFor="photo_url" className="block text-sm font-medium text-gray-300 mb-1">
                        Photo URL {currentMember.is_core && <span className="text-red-500">*</span>}
                      </label>
                      <div className="flex">
                        <input
                          type="url"
                          id="photo_url"
                          name="photo_url"
                          value={currentMember.photo_url || ''}
                          onChange={handleInputChange}
                          className={`w-full bg-dark-300 border ${errors.photo_url ? 'border-red-500' : 'border-dark-200'} rounded-l-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500`}
                          placeholder="Enter photo URL"
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
                            Upload photo
                          </div>
                        </div>
                      </div>
                      {errors.photo_url && (
                        <p className="mt-1 text-sm text-red-500 flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {errors.photo_url}
                        </p>
                      )}
                      {currentMember.photo_url && !errors.photo_url && (
                        <div className="mt-2">
                          <p className="text-xs text-gray-400 mb-1">Preview:</p>
                          <div className="w-20 h-20 rounded-full overflow-hidden bg-dark-300">
                            <img 
                              src={currentMember.photo_url} 
                              alt="Preview" 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = 'https://via.placeholder.com/150?text=Invalid+Image';
                                setErrors(prev => ({ ...prev, photo_url: 'Invalid photo URL' }));
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
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
                          {isEditing ? 'Update Member' : 'Add Member'}
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

export default AdminTeam;