import React from 'react';
import { Hash, Users, MessageCircle, Clock, LogOut, UserPlus } from 'lucide-react';

const categoryIcons = {
  'crop_cultivation': '🌾',
  'pest_management': '🐛',
  'weather_discussion': '🌤️',
  'market_prices': '💰',
  'farming_techniques': '🚜',
  'equipment_tools': '🔧',
  'organic_farming': '🌱',
  'government_schemes': '📋',
  'general_discussion': '💬'
};

const categoryLabels = {
  'crop_cultivation': 'Crop Cultivation',
  'pest_management': 'Pest Management',
  'weather_discussion': 'Weather Discussion',
  'market_prices': 'Market Prices',
  'farming_techniques': 'Farming Techniques',
  'equipment_tools': 'Equipment & Tools',
  'organic_farming': 'Organic Farming',
  'government_schemes': 'Government Schemes',
  'general_discussion': 'General Discussion'
};

const ChannelList = ({ 
  channels, 
  currentChannel, 
  onSelectChannel, 
  onJoinChannel, 
  onLeaveChannel 
}) => {
  const formatLastActivity = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  // Group channels by category
  const groupedChannels = channels.reduce((groups, channel) => {
    const category = channel.category || 'general_discussion';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(channel);
    return groups;
  }, {});

  return (
    <div className="flex-1 overflow-y-auto">
      {Object.entries(groupedChannels).map(([category, categoryChannels]) => (
        <div key={category} className="mb-6">
          {/* Category Header */}
          <div className="px-4 py-2 border-b border-gray-100">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
              <span className="text-lg">{categoryIcons[category]}</span>
              <span>{categoryLabels[category]}</span>
              <span className="text-xs text-gray-400">({categoryChannels.length})</span>
            </div>
          </div>

          {/* Channels in Category */}
          <div className="space-y-1 px-2 py-2">
            {categoryChannels.map((channel) => (
              <div
                key={channel.channelId}
                className={`relative group rounded-lg p-3 cursor-pointer transition-all duration-200 ${
                  currentChannel?.channelId === channel.channelId
                    ? 'bg-green-50 border-l-4 border-green-500'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => onSelectChannel(channel)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Hash className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <span className="font-medium text-gray-800 truncate">
                        {channel.name}
                      </span>
                      {channel.unreadCount > 0 && (
                        <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                          {channel.unreadCount > 99 ? '99+' : channel.unreadCount}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 truncate mb-2">
                      {channel.description}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>{channel.memberCount}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" />
                        <span>{channel.messageCount}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatLastActivity(channel.lastActivity)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Role Badge */}
                  {channel.role && (
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      channel.role === 'admin' 
                        ? 'bg-purple-100 text-purple-800'
                        : channel.role === 'moderator'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {channel.role}
                    </span>
                  )}
                </div>

                {/* Hover Actions */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onLeaveChannel(channel.channelId);
                    }}
                    className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                    title="Leave Channel"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {channels.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <MessageCircle className="w-12 h-12 mb-4 text-gray-300" />
          <p className="text-center mb-4">No channels joined yet</p>
          <button
            onClick={() => {/* Navigate to browse channels */}}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            Browse Channels
          </button>
        </div>
      )}
    </div>
  );
};

export default ChannelList;