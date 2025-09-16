import React, { useRef, useEffect, useState } from 'react';
import { MoreVertical, Reply, Trash2, Edit3, Pin, Heart, ThumbsUp, Smile, Frown } from 'lucide-react';

const reactions = [
  { emoji: '👍', icon: ThumbsUp },
  { emoji: '❤️', icon: Heart },
  { emoji: '😊', icon: Smile },
//   { emoji: '👏', icon: HandClap },// import from lucide react
//   { emoji: '🤔', icon: ThinkingFace },// import from lucide react it goives error now
  { emoji: '😢', icon: Frown }
];

const MessageItem = ({ 
  message, 
  currentUser, 
  onToggleReaction, 
  onDeleteMessage,
  onReplyToMessage 
}) => {
  const [showActions, setShowActions] = useState(false);
  const [showReactions, setShowReactions] = useState(false);

  const isOwnMessage = message.userId._id === currentUser.id;
  const messageTime = new Date(message.createdAt).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  const handleReactionClick = (emoji) => {
    onToggleReaction(message._id, emoji);
    setShowReactions(false);
  };

  return (
    <div 
      className={`group flex gap-3 px-4 py-2 hover:bg-gray-50 ${
        message.isPinned ? 'bg-yellow-50 border-l-4 border-yellow-400' : ''
      }`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => {
        setShowActions(false);
        setShowReactions(false);
      }}
    >
      {/* Avatar */}
      <div className="flex-shrink-0">
        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">
          {message.userId.name.charAt(0).toUpperCase()}
        </div>
      </div>

      {/* Message Content */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-baseline gap-2 mb-1">
          <span className="font-semibold text-gray-900">
            {message.userId.name}
          </span>
          <span className="text-xs text-gray-500">
            {messageTime}
          </span>
          {message.isEdited && (
            <span className="text-xs text-gray-400">(edited)</span>
          )}
          {message.isPinned && (
            <Pin className="w-3 h-3 text-yellow-600" />
          )}
        </div>

        {/* Message Text */}
        <div className="text-gray-800 break-words">
          {message.content.split('\n').map((line, index) => (
            <div key={index}>
              {line}
              {index < message.content.split('\n').length - 1 && <br />}
            </div>
          ))}
        </div>

        {/* Mentions */}
        {message.mentions && message.mentions.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {message.mentions.map((mention) => (
              <span 
                key={mention._id}
                className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
              >
                @{mention.name}
              </span>
            ))}
          </div>
        )}

        {/* Reactions */}
        {message.reactions && message.reactions.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {Object.entries(message.reactionCounts || {}).map(([emoji, count]) => (
              <button
                key={emoji}
                onClick={() => handleReactionClick(emoji)}
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs border transition-colors ${
                  message.reactions.some(r => r.userId === currentUser.id && r.emoji === emoji)
                    ? 'bg-blue-100 border-blue-300 text-blue-700'
                    : 'bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span>{emoji}</span>
                <span>{count}</span>
              </button>
            ))}
          </div>
        )}

        {/* Replies */}
        {message.replies && message.replies.length > 0 && (
          <div className="mt-3 space-y-2 pl-4 border-l-2 border-gray-200">
            {message.replies.map((reply) => (
              <div key={reply._id} className="text-sm">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-gray-700">
                    {reply.userId.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(reply.createdAt).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
                <div className="text-gray-600">
                  {reply.content}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      {showActions && (
        <div className="flex items-center gap-1">
          {/* Quick Reactions */}
          <div className="relative">
            <button
              onClick={() => setShowReactions(!showReactions)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors"
              title="Add Reaction"
            >
              <Smile className="w-4 h-4" />
            </button>
            
            {showReactions && (
              <div className="absolute bottom-full mb-2 left-0 bg-white border border-gray-300 rounded-lg shadow-lg p-2 flex gap-1 z-10">
                {reactions.map(({ emoji, icon: Icon }) => (
                  <button
                    key={emoji}
                    onClick={() => handleReactionClick(emoji)}
                    className="p-2 hover:bg-gray-100 rounded transition-colors"
                    title={`React with ${emoji}`}
                  >
                    <span className="text-lg">{emoji}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Reply */}
          <button
            onClick={() => onReplyToMessage(message)}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors"
            title="Reply"
          >
            <Reply className="w-4 h-4" />
          </button>

          {/* More Actions */}
          {isOwnMessage && (
            <div className="relative group/actions">
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors">
                <MoreVertical className="w-4 h-4" />
              </button>
              
              <div className="absolute bottom-full mb-2 right-0 bg-white border border-gray-300 rounded-lg shadow-lg py-1 opacity-0 group-hover/actions:opacity-100 transition-opacity z-10">
                <button
                  onClick={() => {/* Handle edit */}}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => onDeleteMessage(message._id)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const TypingIndicator = ({ typingUsers }) => {
  if (typingUsers.length === 0) return null;

  const names = typingUsers.map(user => user.userInfo.name).join(', ');
  const verb = typingUsers.length === 1 ? 'is' : 'are';

  return (
    <div className="px-4 py-2 text-sm text-gray-500 italic">
      {names} {verb} typing...
      <span className="inline-flex ml-2">
        <span className="animate-bounce">.</span>
        <span className="animate-bounce" style={{ animationDelay: '0.1s' }}>.</span>
        <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>.</span>
      </span>
    </div>
  );
};

const MessageList = ({ 
  messages, 
  currentUser, 
  onToggleReaction, 
  onDeleteMessage,
  loading,
  typingUsers = []
}) => {
  const messagesEndRef = useRef(null);
  const [replyingTo, setReplyingTo] = useState(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleReplyToMessage = (message) => {
    setReplyingTo(message);
    // You can emit this to parent component to handle reply functionality
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💬</span>
              </div>
              <p>No messages yet. Start the conversation!</p>
            </div>
          </div>
        ) : (
          <div className="py-4">
            {messages.map((message, index) => {
              const prevMessage = messages[index - 1];
              const showDateSeparator = !prevMessage || 
                new Date(message.createdAt).toDateString() !== 
                new Date(prevMessage.createdAt).toDateString();

              return (
                <div key={message._id}>
                  {showDateSeparator && (
                    <div className="flex items-center justify-center my-4">
                      <div className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
                        {new Date(message.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  )}
                  
                  <MessageItem
                    message={message}
                    currentUser={currentUser}
                    onToggleReaction={onToggleReaction}
                    onDeleteMessage={onDeleteMessage}
                    onReplyToMessage={handleReplyToMessage}
                  />
                </div>
              );
            })}
            
            {/* Typing Indicator */}
            <TypingIndicator typingUsers={typingUsers} />
            
            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageList;