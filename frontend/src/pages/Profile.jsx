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
  Camera,
  Key
} from 'lucide-react';
import { Context } from '../main.jsx';  // import global context

const Profile = () => {
  const { user, setUser, isAuthorized } = useContext(Context); // using global context
  const [activeTab, setActiveTab] = useState('profile');
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
        setUser(result.user); // update global context user
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
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
          <div className={`mb-6 p-4 rounded-lg border ${
            message.type === 'success' 
              ? 'bg-green-900/50 border-green-700 text-green-200'
              : 'bg-red-900/50 border-red-700 text-red-200'
          }`}>
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              {/* Profile Picture */}
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <img
                    src={user?.profilePicture || 'https://avatar.iran.liara.run/public/46'}
                    alt="Profile"
                    className="h-20 w-20 rounded-full border-4 border-gray-600"
                  />
                  <button className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full hover:bg-blue-700 transition-colors">
                    <Camera className="h-3 w-3 text-white" />
                  </button>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-white">{user?.name}</h3>
                <p className="text-gray-400 text-sm">{user?.email}</p>
              </div>

              {/* Navigation Tabs */}
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === tab.id
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
                  <h2 className="text-xl font-semibold text-white mb-6">Profile Information</h2>
                  <form onSubmit={handleSubmitProfile(onUpdateProfile)} className="space-y-6">
                    {/* Name */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                        Full Name
                      </label>
                      <input
                        {...registerProfile('name', { required: 'Name is required' })}
                        type="text"
                        className="w-full px-3 py-3 bg-gray-700 text-white rounded-lg border border-gray-600"
                      />
                      {profileErrors.name && (
                        <p className="text-red-400 text-sm">{profileErrors.name.message}</p>
                      )}
                    </div>

                    {/* Email (read-only) */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={user?.email || ''}
                        disabled
                        className="w-full px-3 py-3 bg-gray-600 text-gray-300 rounded-lg border border-gray-600"
                      />
                    </div>

                    {/* Username (read-only) */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Username
                      </label>
                      <input
                        type="text"
                        value={user?.username || ''}
                        disabled
                        className="w-full px-3 py-3 bg-gray-600 text-gray-300 rounded-lg border border-gray-600"
                      />
                    </div>

                    {/* Gender */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Gender
                      </label>
                      <select
                        {...registerProfile('gender', { required: 'Gender is required' })}
                        className="w-full px-3 py-3 bg-gray-700 text-white rounded-lg border border-gray-600"
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                      {profileErrors.gender && (
                        <p className="text-red-400 text-sm">{profileErrors.gender.message}</p>
                      )}
                    </div>

                    {/* Save */}
                    <div>
                      <button
                        type="submit"
                        disabled={updateLoading}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                      >
                        {updateLoading ? 'Updating...' : 'Update Profile'}
                      </button>
                    </div>
                  </form>
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
                      <input
                        {...registerPassword('oldPassword', { required: 'Current password is required' })}
                        type={showOldPassword ? 'text' : 'password'}
                        className="w-full px-3 py-3 bg-gray-700 text-white rounded-lg border border-gray-600"
                      />
                    </div>

                    {/* New Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        New Password
                      </label>
                      <input
                        {...registerPassword('newPassword', { required: 'New password is required' })}
                        type={showNewPassword ? 'text' : 'password'}
                        className="w-full px-3 py-3 bg-gray-700 text-white rounded-lg border border-gray-600"
                      />
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
                        className="w-full px-3 py-3 bg-gray-700 text-white rounded-lg border border-gray-600"
                      />
                    </div>

                    {/* Submit */}
                    <div>
                      <button
                        type="submit"
                        disabled={passwordLoading}
                        className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                      >
                        {passwordLoading ? 'Changing...' : 'Change Password'}
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
