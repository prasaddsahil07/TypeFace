/**
 * Profile page component for viewing and updating user information
 * Includes profile details and password change functionality
 */
import React, { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import {
  User,
  Mail,
  Users,
  Lock,
  Eye,
  EyeOff,
  Save,
  Key,
  Edit2,
  X,
  Check
} from 'lucide-react';
import { Context } from '../main.jsx';  // import global context

const Profile = () => {
  const { user, setUser, isAuthorized } = useContext(Context); // using global context
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Profile update form
  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors },
    reset: resetProfile,
    setValue: setProfileValue
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      gender: user?.gender || '',
    }
  });

  // Password change form
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
    reset: resetPassword,
    watch
  } = useForm();

  const watchNewPassword = watch('newPassword');

  // Generate consistent avatar based on user data
  const getAvatarUrl = (userData) => {
    if (userData?.profilePicture) {
      return userData.profilePicture;
    }
    
    // Create a consistent avatar based on user ID or email
    const seed = userData?.id || userData?.email || userData?.username || 'default';
    const genderParam = userData?.gender === 'female' ? 'women' : userData?.gender === 'male' ? 'men' : 'human';
    
    // Use a more consistent avatar service or create initials-based avatar
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(userData?.name || 'User')}&background=4f46e5&color=fff&size=80&rounded=true`;
  };

  // Handle edit mode toggle
  const handleEditToggle = () => {
    if (isEditing) {
      // Reset form to original values when canceling
      resetProfile({
        name: user?.name || '',
        gender: user?.gender || '',
      });
      setMessage('');
    } else {
      // Set current values when entering edit mode
      setProfileValue('name', user?.name || '');
      setProfileValue('gender', user?.gender || '');
    }
    setIsEditing(!isEditing);
  };

  // Update Profile Handler
  const onUpdateProfile = async (data) => {
    setUpdateLoading(true);
    setMessage('');

    try {
      const res = await fetch('http://localhost:8000/api/v1/users/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // important for cookie auth
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        // Preserve existing user data and only update the changed fields
        const updatedUser = {
          ...user, // Keep all existing user data
          ...result.data, // Override with updated data from API (note: using result.data not result.user)
          // Ensure critical fields are preserved if missing from API response
          email: result.data.email || user.email,
          username: result.data.username || user.username,
          id: result.data.id || result.data._id || user.id,
        };
        
        setUser(updatedUser); // update global context user
        setMessage({ type: 'success', text: result.message || 'Profile updated successfully!' });
        setIsEditing(false);
        
        // Clear message after 3 seconds
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage({ type: 'error', text: result.message || 'Update failed' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Something went wrong' });
    }

    setUpdateLoading(false);
  };

  // Change Password Handler
  const onChangePassword = async (data) => {
    setPasswordLoading(true);
    setMessage('');

    try {
      const res = await fetch('http://localhost:8000/api/v1/users/change-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          oldPassword: data.oldPassword,
          newPassword: data.newPassword,
        }),
      });

      const result = await res.json();

      if (res.ok) {
        setMessage({ type: 'success', text: 'Password changed successfully!' });
        resetPassword();
        
        // Clear message after 3 seconds
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage({ type: 'error', text: result.message || 'Password change failed' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Something went wrong' });
    }

    setPasswordLoading(false);
  };

  const tabs = [
    { id: 'profile', name: 'Profile Information', icon: User },
    { id: 'password', name: 'Change Password', icon: Key },
  ];

  if (!isAuthorized) {
    return (
      <div className="text-center text-white mt-20">
        <h2>Please login to view your profile.</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Profile Settings</h1>
          <p className="text-gray-400">Manage your account information and security</p>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg border ${message.type === 'success'
              ? 'bg-green-900/50 border-green-700 text-green-200'
              : 'bg-red-900/50 border-red-700 text-red-200'
            }`}>
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 ">
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              {/* Profile Picture */}
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <img
                    src={getAvatarUrl(user)}
                    alt="Profile"
                    className="h-20 w-20 rounded-full border-4 border-gray-600"
                  />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-white">{user?.name || 'User'}</h3>
                <p className="text-gray-400 text-sm">{user?.email || 'No email'}</p>
              </div>

              {/* Navigation Tabs */}
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === tab.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:text-white hover:bg-gray-700'
                      }`}
                  >
                    <tab.icon className="mr-3 h-5 w-5" />
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              {activeTab === 'profile' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-white">Profile Information</h2>
                    {!isEditing ? (
                      <button
                        onClick={handleEditToggle}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Edit2 className="mr-2 h-4 w-4" />
                        Edit Profile
                      </button>
                    ) : (
                      <div className="flex space-x-2">
                        <button
                          onClick={handleEditToggle}
                          className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          <X className="mr-2 h-4 w-4" />
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>

                  {!isEditing ? (
                    // Read-only view
                    <div className="space-y-6">
                      {/* Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Full Name
                        </label>
                        <div className="w-full px-3 py-3 bg-gray-700 text-white rounded-lg border border-gray-600">
                          {user?.name || 'Not provided'}
                        </div>
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Email
                        </label>
                        <div className="w-full px-3 py-3 bg-gray-700 text-white rounded-lg border border-gray-600">
                          {user?.email || 'Not provided'}
                        </div>
                      </div>

                      {/* Username */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Username
                        </label>
                        <div className="w-full px-3 py-3 bg-gray-700 text-white rounded-lg border border-gray-600">
                          {user?.username || 'Not provided'}
                        </div>
                      </div>

                      {/* Gender */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Gender
                        </label>
                        <div className="w-full px-3 py-3 bg-gray-700 text-white rounded-lg border border-gray-600">
                          {user?.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : 'Not provided'}
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Edit form
                    <form onSubmit={handleSubmitProfile(onUpdateProfile)} className="space-y-6">
                      {/* Name */}
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                          Full Name
                        </label>
                        <input
                          {...registerProfile('name', { required: 'Name is required' })}
                          type="text"
                          className="w-full px-3 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        />
                        {profileErrors.name && (
                          <p className="text-red-400 text-sm mt-1">{profileErrors.name.message}</p>
                        )}
                      </div>

                      {/* Email (read-only) */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Email
                        </label>
                        <div className="w-full px-3 py-3 bg-gray-600 text-gray-300 rounded-lg border border-gray-600">
                          {user?.email || 'Not provided'}
                        </div>
                        <p className="text-xs text-gray-400 mt-1">This field cannot be edited</p>
                      </div>

                      {/* Username (read-only) */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Username
                        </label>
                        <div className="w-full px-3 py-3 bg-gray-600 text-gray-300 rounded-lg border border-gray-600">
                          {user?.username || 'Not provided'}
                        </div>
                        <p className="text-xs text-gray-400 mt-1">This field cannot be edited</p>
                      </div>

                      {/* Gender */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Gender
                        </label>
                        <select
                          {...registerProfile('gender', { required: 'Gender is required' })}
                          className="w-full px-3 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        >
                          <option value="">Select gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                        {profileErrors.gender && (
                          <p className="text-red-400 text-sm mt-1">{profileErrors.gender.message}</p>
                        )}
                      </div>

                      {/* Save Button */}
                      <div className="flex space-x-4">
                        <button
                          type="submit"
                          disabled={updateLoading}
                          className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                        >
                          {updateLoading ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Updating...
                            </>
                          ) : (
                            <>
                              <Check className="mr-2 h-4 w-4" />
                              Save Changes
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {activeTab === 'password' && (
                <div>
                  <h2 className="text-xl font-semibold text-white mb-6">Change Password</h2>
                  <form onSubmit={handleSubmitPassword(onChangePassword)} className="space-y-6">
                    {/* Old Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          {...registerPassword('oldPassword', { required: 'Current password is required' })}
                          type={showOldPassword ? 'text' : 'password'}
                          className="w-full px-3 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        />
                        <button
                          type="button"
                          onClick={() => setShowOldPassword(!showOldPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                        >
                          {showOldPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                      {passwordErrors.oldPassword && (
                        <p className="text-red-400 text-sm mt-1">{passwordErrors.oldPassword.message}</p>
                      )}
                    </div>

                    {/* New Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          {...registerPassword('newPassword', { 
                            required: 'New password is required',
                            minLength: {
                              value: 6,
                              message: 'Password must be at least 6 characters'
                            }
                          })}
                          type={showNewPassword ? 'text' : 'password'}
                          className="w-full px-3 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                        >
                          {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                      {passwordErrors.newPassword && (
                        <p className="text-red-400 text-sm mt-1">{passwordErrors.newPassword.message}</p>
                      )}
                    </div>

                    {/* Confirm New Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Confirm New Password
                      </label>
                      <input
                        {...registerPassword('confirmPassword', {
                          required: 'Please confirm your password',
                          validate: (val) => val === watchNewPassword || 'Passwords do not match',
                        })}
                        type="password"
                        className="w-full px-3 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      />
                      {passwordErrors.confirmPassword && (
                        <p className="text-red-400 text-sm mt-1">{passwordErrors.confirmPassword.message}</p>
                      )}
                    </div>

                    {/* Submit */}
                    <div>
                      <button
                        type="submit"
                        disabled={passwordLoading}
                        className="flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                      >
                        {passwordLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Changing...
                          </>
                        ) : (
                          <>
                            <Key className="mr-2 h-4 w-4" />
                            Change Password
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;