import React from 'react';
import { Users, Crown, Shield, User } from 'lucide-react';

const OnlineMembers = ({ members, currentUser }) => {
  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return <Crown className="w-3 h-3 text-purple-600" />;
      case 'moderator':
        return <Shield className="w-3 h-3 text-blue-600" />;
      default:
        return <User className="w-3 h-3 text-gray-400" />;
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'moderator':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  return (
    <div className="w-60 bg-gray-50 border-l border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-gray-600" />
          <span className="font-semibold text-gray-800">
            Online Members ({members.length})
          </span>
        </div>
      </div>

      {/* Members List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {members.map((member) => {
          const isCurrentUser = member.userId === currentUser.id;
          
          return (
            <div
              key={member.userId}
              className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                isCurrentUser 
                  ? 'bg-green-100 border border-green-200' 
                  : 'hover:bg-white hover:shadow-sm'
              }`}
            >
              {/* Avatar with Status */}
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {member.userInfo.name.charAt(0).toUpperCase()}
                </div>
                {/* Online Status Indicator */}
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
              </div>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`font-medium truncate text-sm ${
                    isCurrentUser ? 'text-green-800' : 'text-gray-800'
                  }`}>
                    {member.userInfo.name}
                    {isCurrentUser && ' (You)'}
                  </span>
                  {member.role && member.role !== 'member' && (
                    <span className={`text-xs px-2 py-1 rounded-full border ${getRoleBadgeColor(member.role)}`}>
                      {member.role}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-1 mt-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-xs text-gray-500">Online</span>
                </div>
              </div>

              {/* Role Icon */}
              <div className="flex-shrink-0">
                {getRoleIcon(member.role)}
              </div>
            </div>
          );
        })}

        {members.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">No one else is online</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-200 bg-white">
        <div className="text-xs text-gray-500 text-center">
          {members.length} of {members.length} members online
        </div>
      </div>
    </div>
  );
};

export default OnlineMembers;