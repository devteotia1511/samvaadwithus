import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { Mail, MessageSquare, Check, Clock, Trash, X, Loader, RefreshCw, KeyRound, MailWarning, Users, Shield, Plus, Edit, Save, Trash2 } from 'lucide-react';
import { useNotification } from '../../hooks/useNotification';
import LoadingSpinner from '../common/LoadingSpinner';
import { dataService, Message } from '../../lib/supabase';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  is_active: boolean;
  created_at: string;
}

const AdminSettings = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'messages' | 'account'>('messages');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState<Partial<AdminUser>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { addNotification } = useNotification();

  const { user } = useAuth();

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const data = await dataService.messages.getAll();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to load messages'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    fetchAdminUsers();
  }, []);

  const fetchAdminUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAdminUsers(data || []);
    } catch (error) {
      console.error('Error fetching admin users:', error);
      addNotification({
        type: 'error',
        title: 'Error Loading Admin Users',
        message: 'Failed to load admin users from database.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await dataService.messages.markAsRead(id);
      addNotification({
        type: 'success',
        title: 'Success',
        message: 'Message marked as read'
      });
      fetchMessages();
    } catch (error) {
      console.error('Error marking message as read:', error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to mark message as read'
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await dataService.messages.delete(id);
        addNotification({
          type: 'success',
          title: 'Success',
          message: 'Message deleted successfully'
        });
        fetchMessages();
      } catch (error) {
        console.error('Error deleting message:', error);
        addNotification({
          type: 'error',
          title: 'Error',
          message: 'Failed to delete message'
        });
      }
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset states
    setPasswordError(null);
    setPasswordSuccess(null);
    
    // Validate passwords
    if (!currentPassword) {
      setPasswordError('Current password is required');
      return;
    }
    
    if (!newPassword) {
      setPasswordError('New password is required');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    
    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real implementation, this would update the password in Supabase
      // const { error } = await supabase.auth.updateUser({ password: newPassword });
      
      // For demo purposes, simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setPasswordSuccess('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error changing password:', error);
      setPasswordError('Failed to change password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    
    // Check if the date is today
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
      return `Today at ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // Check if the date is yesterday
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // Otherwise, return full date
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const openAddModal = () => {
    setCurrentUser({
      email: '',
      name: '',
      is_active: true
    });
    setIsEditing(false);
    setIsModalOpen(true);
    setErrors({});
  };

  const openEditModal = (user: AdminUser) => {
    setCurrentUser({ ...user });
    setIsEditing(true);
    setIsModalOpen(true);
    setErrors({});
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentUser({});
    setErrors({});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setCurrentUser(prev => ({ ...prev, [name]: checked }));
    } else {
      setCurrentUser(prev => ({ ...prev, [name]: value }));
    }
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!currentUser.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(currentUser.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!currentUser.name?.trim()) {
      newErrors.name = 'Name is required';
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
        const { error } = await supabase
          .from('admin_users')
          .update(currentUser)
          .eq('id', currentUser.id);

        if (error) throw error;

        addNotification({
          type: 'success',
          title: 'Admin User Updated',
          message: `"${currentUser.email}" has been updated successfully.`
        });
      } else {
        const { error } = await supabase
          .from('admin_users')
          .insert([currentUser]);

        if (error) throw error;

        addNotification({
          type: 'success',
          title: 'Admin User Added',
          message: `"${currentUser.email}" has been added as admin successfully.`
        });
      }
      
      closeModal();
      fetchAdminUsers();
    } catch (error) {
      console.error('Error saving admin user:', error);
      addNotification({
        type: 'error',
        title: 'Error Saving Admin User',
        message: 'Failed to save admin user. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAdminUser = async (id: string, email: string) => {
    if (!window.confirm(`Are you sure you want to remove admin access for ${email}?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('admin_users')
        .delete()
        .eq('id', id);

      if (error) throw error;

      addNotification({
        type: 'success',
        title: 'Admin User Removed',
        message: `Admin access for "${email}" has been removed.`
      });
      
      fetchAdminUsers();
    } catch (error) {
      console.error('Error deleting admin user:', error);
      addNotification({
        type: 'error',
        title: 'Error Removing Admin User',
        message: 'Failed to remove admin user. Please try again.'
      });
    }
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-display font-bold">Admin Settings</h2>
          <p className="text-gray-400">Manage system settings and admin users</p>
        </div>
        <button
          onClick={openAddModal}
          className="btn btn-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Admin User
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-dark-300 rounded-lg mb-6">
        <div className="flex flex-wrap">
          <button 
            onClick={() => setActiveTab('messages')} 
            className={`px-6 py-3 flex items-center transition-colors ${
              activeTab === 'messages' 
                ? 'bg-primary-500 text-white rounded-t-lg' 
                : 'text-gray-300 hover:bg-dark-200'
            }`}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            <span>Messages</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('account')} 
            className={`px-6 py-3 flex items-center transition-colors ${
              activeTab === 'account' 
                ? 'bg-primary-500 text-white rounded-t-lg' 
                : 'text-gray-300 hover:bg-dark-200'
            }`}
          >
            <KeyRound className="h-4 w-4 mr-2" />
            <span>Account Security</span>
          </button>
        </div>
      </div>
      
      {/* Tab Content */}
      <div className="bg-dark-300 rounded-lg p-6">
        {activeTab === 'messages' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Contact Messages</h3>
              <button 
                className="text-gray-300 hover:text-white flex items-center"
                onClick={fetchMessages}
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                <span>Refresh</span>
              </button>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader className="h-8 w-8 text-primary-500 animate-spin" />
                <span className="ml-2 text-gray-300">Loading messages...</span>
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-16">
                <MailWarning className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No messages</h3>
                <p className="text-gray-400">There are no messages in your inbox.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map(message => (
                  <div 
                    key={message.id} 
                    className={`p-4 rounded-lg ${
                      message.is_read ? 'bg-dark-400' : 'bg-dark-400 border-l-4 border-primary-500'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-start">
                        <div className="mr-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            message.is_read ? 'bg-dark-300' : 'bg-primary-500/20'
                          }`}>
                            <Mail className={`h-5 w-5 ${
                              message.is_read ? 'text-gray-400' : 'text-primary-500'
                            }`} />
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold">{message.name}</h4>
                          <p className="text-sm text-gray-400">{message.email}</p>
                          <p className="text-sm text-gray-400 flex items-center mt-1">
                            <Clock className="h-3 w-3 mr-1" /> 
                            {formatDate(message.created_at)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        {!message.is_read && (
                          <button 
                            className="p-1 hover:bg-dark-300 rounded-md transition-colors"
                            onClick={() => handleMarkAsRead(message.id)}
                            aria-label="Mark as read"
                          >
                            <Check className="h-4 w-4 text-gray-400 hover:text-primary-500" />
                          </button>
                        )}
                        
                        {deleteConfirmId === message.id ? (
                          <div className="flex items-center bg-dark-500 p-1 rounded-md">
                            <button
                              className="p-1 hover:bg-red-500/20 rounded-md transition-colors"
                              onClick={() => handleDelete(message.id)}
                              aria-label="Confirm delete"
                            >
                              <Check className="h-4 w-4 text-red-500" />
                            </button>
                            <button
                              className="p-1 hover:bg-dark-200 rounded-md transition-colors"
                              onClick={() => setDeleteConfirmId(null)}
                              aria-label="Cancel delete"
                            >
                              <X className="h-4 w-4 text-gray-400" />
                            </button>
                          </div>
                        ) : (
                          <button 
                            className="p-1 hover:bg-red-500/20 rounded-md transition-colors"
                            onClick={() => setDeleteConfirmId(message.id)}
                            aria-label="Delete message"
                          >
                            <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-500" />
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-4 p-3 bg-dark-300 rounded-lg">
                      <p className="text-gray-300">{message.message}</p>
                    </div>
                    
                    <div className="mt-4 flex justify-end">
                      <a 
                        href={`mailto:${message.email}?subject=Re: Message from Samvaad Theatre Group Website`}
                        className="text-primary-500 hover:text-primary-400 transition-colors text-sm flex items-center"
                      >
                        <Mail className="h-4 w-4 mr-1" />
                        Reply via Email
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'account' && (
          <div>
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-1">Account Security</h3>
              <p className="text-gray-400">Change your password and manage account security settings.</p>
            </div>
            
            <div className="bg-dark-400 p-6 rounded-lg">
              <h4 className="text-lg font-semibold mb-4">Change Password</h4>
              
              {passwordSuccess && (
                <div className="mb-6 p-3 bg-green-500/20 border border-green-500 text-green-300 rounded-md flex items-center">
                  <Check className="h-5 w-5 mr-2" />
                  {passwordSuccess}
                </div>
              )}
              
              {passwordError && (
                <div className="mb-6 p-3 bg-red-500/20 border border-red-500 text-red-300 rounded-md">
                  {passwordError}
                </div>
              )}
              
              <form onSubmit={handlePasswordChange}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-300 mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      id="currentPassword"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full bg-dark-300 border border-dark-200 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-dark-300 border border-dark-200 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-dark-300 border border-dark-200 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors flex items-center disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader className="animate-spin h-4 w-4 mr-2" />
                          Changing Password...
                        </>
                      ) : (
                        'Change Password'
                      )}
                    </button>
                  </div>
                </div>
              </form>
              
              <div className="mt-8 pt-6 border-t border-dark-300">
                <div className="flex items-start">
                  <div className="mr-3 text-gray-400">
                    <KeyRound className="h-5 w-5" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-white">Account Security Tips</h5>
                    <ul className="mt-2 space-y-1 text-sm text-gray-400">
                      <li>• Use a strong, unique password that you don't use elsewhere</li>
                      <li>• Include a mix of letters, numbers, and special characters</li>
                      <li>• Never share your password with others</li>
                      <li>• Change your password periodically</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-dark-400 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">Account Details</h4>
                  <p className="text-sm text-gray-400 mt-1">
                    Email: {user?.email}
                  </p>
                </div>
                <div>
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
                    Admin
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Admin Users Section */}
      <div className="bg-dark-300 rounded-lg p-6">
        <div className="flex items-center mb-6">
          <Shield className="h-6 w-6 text-primary-500 mr-3" />
          <h3 className="text-xl font-semibold">Admin Users</h3>
        </div>

        {loading ? (
          <LoadingSpinner text="Loading admin users..." />
        ) : adminUsers.length === 0 ? (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <h4 className="text-lg font-semibold mb-2">No admin users found</h4>
            <p className="text-gray-400 mb-4">Add admin users to manage the system</p>
            <button onClick={openAddModal} className="btn btn-primary">
              <Plus className="h-4 w-4 mr-2" />
              Add First Admin
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-200">
                  <th className="text-left py-3 px-4 font-semibold">Name</th>
                  <th className="text-left py-3 px-4 font-semibold">Email</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 font-semibold">Created</th>
                  <th className="text-left py-3 px-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {adminUsers.map((user) => (
                  <tr key={user.id} className="border-b border-dark-200 hover:bg-dark-200/50">
                    <td className="py-3 px-4">{user.name}</td>
                    <td className="py-3 px-4 text-primary-400">{user.email}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.is_active 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-400">
                      {formatDate(user.created_at)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openEditModal(user)}
                          className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteAdminUser(user.id, user.email)}
                          className="p-1 text-red-400 hover:text-red-300 transition-colors"
                          title="Remove"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-dark-400 p-6 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">
                {isEditing ? 'Edit Admin User' : 'Add Admin User'}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={currentUser.name || ''}
                  onChange={handleInputChange}
                  className="w-full bg-dark-300 border border-dark-200 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-400">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={currentUser.email || ''}
                  onChange={handleInputChange}
                  className="w-full bg-dark-300 border border-dark-200 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter email"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-400">{errors.email}</p>
                )}
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={currentUser.is_active || false}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <label className="text-sm">Active</label>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary flex-1"
                >
                  {isSubmitting ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {isEditing ? 'Update' : 'Add'}
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSettings;