<<<<<<< HEAD
import React, { useState } from 'react';
import { X, Settings, Trash2, UserMinus, Shield, Crown } from 'lucide-react';
import useAuth from '../hooks/useAuth';

const ChannelSettingsModal = ({ channel, onClose, onChannelUpdated }) => {
    const { user,accessToken } = useAuth();
  const [activeTab, setActiveTab] = useState('general');
  const [formData, setFormData] = useState({
    name: channel?.name || '',
    description: channel?.description || '',
    icon: channel?.icon || '💬'
=======
import React, { useState } from "react";
import { X, Settings, Trash2, UserMinus, Shield, Crown } from "lucide-react";
import useAuth from "../hooks/useAuth";

const ChannelSettingsModal = ({ channel, onClose, onChannelUpdated }) => {
  const { user, accessToken } = useAuth();
  const [activeTab, setActiveTab] = useState("general");
  const [formData, setFormData] = useState({
    name: channel?.name || "",
    description: channel?.description || "",
    icon: channel?.icon || "💬",
>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const tabs = [
<<<<<<< HEAD
    { id: 'general', label: 'General', icon: Settings },
    { id: 'members', label: 'Members', icon: Shield },
    { id: 'danger', label: 'Danger Zone', icon: Trash2 }
=======
    { id: "general", label: "General", icon: Settings },
    { id: "members", label: "Members", icon: Shield },
    { id: "danger", label: "Danger Zone", icon: Trash2 },
>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e
  ];

  const handleUpdateChannel = async () => {
    if (!formData.name.trim() || !formData.description.trim()) {
<<<<<<< HEAD
      setErrors({ general: 'Name and description are required' });
=======
      setErrors({ general: "Name and description are required" });
>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e
      return;
    }

    setLoading(true);
    try {
<<<<<<< HEAD
      const response = await fetch(`http://localhost:5000/api/community/channels/${channel.channelId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        //   'Authorization': `Bearer ${localStorage.getItem('token')}`
        'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          description: formData.description.trim(),
          icon: formData.icon
        })
      });
=======
      const response = await fetch(
        `https://server-agri-ai.onrender.com/api/community/channels/${channel.channelId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            //   'Authorization': `Bearer ${localStorage.getItem('token')}`
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            name: formData.name.trim(),
            description: formData.description.trim(),
            icon: formData.icon,
          }),
        }
      );
>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e

      const data = await response.json();
      if (data.success) {
        onChannelUpdated(data.data);
      } else {
<<<<<<< HEAD
        setErrors({ general: data.message || 'Failed to update channel' });
      }
    } catch (error) {
      setErrors({ general: 'Network error. Please try again.' });
=======
        setErrors({ general: data.message || "Failed to update channel" });
      }
    } catch (error) {
      setErrors({ general: "Network error. Please try again." });
>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveChannel = async () => {
<<<<<<< HEAD
    if (!confirm('Are you sure you want to leave this channel?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/community/channels/${channel.channelId}/leave`, {
        method: 'POST',
        headers: {
        //   'Authorization': `Bearer ${localStorage.getItem('token')}`
        'Authorization': `Bearer ${accessToken}`
        }
      });
=======
    if (!confirm("Are you sure you want to leave this channel?")) return;

    try {
      const response = await fetch(
        `https://server-agri-ai.onrender.com/api/community/channels/${channel.channelId}/leave`,
        {
          method: "POST",
          headers: {
            //   'Authorization': `Bearer ${localStorage.getItem('token')}`
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e

      if (response.ok) {
        onClose();
        // Navigate away from channel or refresh channels
        window.location.reload();
      }
    } catch (error) {
<<<<<<< HEAD
      console.error('Failed to leave channel:', error);
=======
      console.error("Failed to leave channel:", error);
>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e
    }
  };

  const renderGeneralTab = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Channel Name
        </label>
        <input
          type="text"
          value={formData.name}
<<<<<<< HEAD
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
=======
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, name: e.target.value }))
          }
>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          maxLength={50}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          value={formData.description}
<<<<<<< HEAD
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
=======
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          maxLength={200}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Channel Stats
        </label>
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Members:</span>
            <span className="font-medium">{channel?.memberCount || 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Messages:</span>
            <span className="font-medium">{channel?.messageCount || 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Created:</span>
            <span className="font-medium">
<<<<<<< HEAD
              {channel?.createdAt ? new Date(channel.createdAt).toLocaleDateString() : 'Unknown'}
=======
              {channel?.createdAt
                ? new Date(channel.createdAt).toLocaleDateString()
                : "Unknown"}
>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e
            </span>
          </div>
        </div>
      </div>

<<<<<<< HEAD
      {channel?.role === 'admin' && (
=======
      {channel?.role === "admin" && (
>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e
        <button
          onClick={handleUpdateChannel}
          disabled={loading}
          className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
<<<<<<< HEAD
          {loading ? 'Updating...' : 'Update Channel'}
=======
          {loading ? "Updating..." : "Update Channel"}
>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e
        </button>
      )}
    </div>
  );

  const renderMembersTab = () => (
    <div className="space-y-4">
      <div className="text-sm text-gray-600 mb-4">
        Channel members and their roles
      </div>
<<<<<<< HEAD
      
=======

>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="text-center text-gray-500">
          <Shield className="w-8 h-8 mx-auto mb-2" />
          <p>Member management coming soon</p>
        </div>
      </div>
    </div>
  );

  const renderDangerZoneTab = () => (
    <div className="space-y-4">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-red-800 mb-2">Danger Zone</h3>
        <p className="text-red-700 text-sm mb-4">
          These actions cannot be undone. Please be careful.
        </p>
<<<<<<< HEAD
        
=======

>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e
        <button
          onClick={handleLeaveChannel}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <UserMinus className="w-4 h-4" />
          Leave Channel
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[80vh] m-4 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Settings className="w-6 h-6 text-green-600" />
            <div>
<<<<<<< HEAD
              <h2 className="text-xl font-semibold text-gray-800">Channel Settings</h2>
=======
              <h2 className="text-xl font-semibold text-gray-800">
                Channel Settings
              </h2>
>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e
              <p className="text-sm text-gray-600">#{channel?.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 px-6">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
<<<<<<< HEAD
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
=======
                      ? "border-green-500 text-green-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {errors.general}
            </div>
          )}

<<<<<<< HEAD
          {activeTab === 'general' && renderGeneralTab()}
          {activeTab === 'members' && renderMembersTab()}
          {activeTab === 'danger' && renderDangerZoneTab()}
=======
          {activeTab === "general" && renderGeneralTab()}
          {activeTab === "members" && renderMembersTab()}
          {activeTab === "danger" && renderDangerZoneTab()}
>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e
        </div>
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default ChannelSettingsModal;
=======
export default ChannelSettingsModal;
>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e
