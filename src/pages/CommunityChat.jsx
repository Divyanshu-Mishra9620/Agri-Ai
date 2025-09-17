<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import  useAuth  from '../hooks/useAuth';
import { Hash, Users, MessageCircle, Search, Plus, Settings, Pin } from 'lucide-react';
import MessageList from '../components/MessageList';
import MessageInput from '../components/MessageInput';
import OnlineMembers from '../components/OnlineMembers';
import CreateChannelModal from '../components/CreateChannelModal';
import ChannelSettingsModal from '../components/ChannelSettingsModal';
import { useSocket } from '../hooks/useSocket';
import ChannelList from '../components/ChannelList';

const CommunityChat = () => {
  const { user,accessToken } = useAuth();
  const {socket} = useSocket();

  
  
=======
import React, { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import {
  Hash,
  Users,
  MessageCircle,
  Search,
  Plus,
  Settings,
  Pin,
} from "lucide-react";
import MessageList from "../components/MessageList";
import MessageInput from "../components/MessageInput";
import OnlineMembers from "../components/OnlineMembers";
import CreateChannelModal from "../components/CreateChannelModal";
import ChannelSettingsModal from "../components/ChannelSettingsModal";
import { useSocket } from "../hooks/useSocket";
import ChannelList from "../components/ChannelList";

const CommunityChat = () => {
  const { user, accessToken } = useAuth();
  const { socket } = useSocket();

>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e
  const [channels, setChannels] = useState([]);
  const [currentChannel, setCurrentChannel] = useState(null);
  const [messages, setMessages] = useState([]);
  const [onlineMembers, setOnlineMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
<<<<<<< HEAD
  const [searchQuery, setSearchQuery] = useState('');
=======
  const [searchQuery, setSearchQuery] = useState("");
>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e
  const [typingUsers, setTypingUsers] = useState([]);

  // Fetch user's channels on component mount
  useEffect(() => {
    fetchUserChannels();
  }, []);

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

<<<<<<< HEAD
    socket.on('channel_joined', handleChannelJoined);
    socket.on('new_community_message', handleNewMessage);
    socket.on('message_reaction_updated', handleReactionUpdate);
    socket.on('message_deleted', handleMessageDeleted);
    socket.on('message_edited', handleMessageEdited);
    socket.on('user_typing', handleUserTyping);
    socket.on('user_joined_channel', handleUserJoinedChannel);
    socket.on('user_left_channel', handleUserLeftChannel);
    socket.on('online_members', handleOnlineMembers);

    return () => {
      socket.off('channel_joined');
      socket.off('new_community_message');
      socket.off('message_reaction_updated');
      socket.off('message_deleted');
      socket.off('message_edited');
      socket.off('user_typing');
      socket.off('user_joined_channel');
      socket.off('user_left_channel');
      socket.off('online_members');
    };
  }, [socket, currentChannel]);

  const fetchUserChannels = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/community/channels/my', {
        headers: {
        //   'Authorization': `Bearer ${localStorage.getItem('token')}`
             'Authorization': `Bearer ${accessToken}`
        }
      });
      const data = await response.json();
      
=======
    socket.on("channel_joined", handleChannelJoined);
    socket.on("new_community_message", handleNewMessage);
    socket.on("message_reaction_updated", handleReactionUpdate);
    socket.on("message_deleted", handleMessageDeleted);
    socket.on("message_edited", handleMessageEdited);
    socket.on("user_typing", handleUserTyping);
    socket.on("user_joined_channel", handleUserJoinedChannel);
    socket.on("user_left_channel", handleUserLeftChannel);
    socket.on("online_members", handleOnlineMembers);

    return () => {
      socket.off("channel_joined");
      socket.off("new_community_message");
      socket.off("message_reaction_updated");
      socket.off("message_deleted");
      socket.off("message_edited");
      socket.off("user_typing");
      socket.off("user_joined_channel");
      socket.off("user_left_channel");
      socket.off("online_members");
    };
  }, [socket, currentChannel]);

  useEffect(() => {
    if (currentChannel) {
      fetchChannelMessages(currentChannel.channelId);
    }
  }, [currentChannel]);

  const fetchUserChannels = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://server-agri-ai.onrender.com/api/community/channels/my",
        {
          headers: {
            //   'Authorization': `Bearer ${localStorage.getItem('token')}`
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = await response.json();

>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e
      if (data.success) {
        setChannels(data.data);
        // Auto-select first channel
        if (data.data.length > 0 && !currentChannel) {
          selectChannel(data.data[0]);
        }
      }
    } catch (error) {
<<<<<<< HEAD
      console.error('Failed to fetch channels:', error);
=======
      console.error("Failed to fetch channels:", error);
>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e
    } finally {
      setLoading(false);
    }
  };

  const selectChannel = async (channel) => {
    if (currentChannel?.channelId === channel.channelId) return;

    // Leave current channel if any
    if (currentChannel) {
<<<<<<< HEAD
      socket.emit('leave_community_channel', { channelId: currentChannel.channelId });
=======
      socket.emit("leave_community_channel", {
        channelId: currentChannel.channelId,
      });
>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e
    }

    setCurrentChannel(channel);
    setMessages([]);
    setOnlineMembers([]);
    setTypingUsers([]);

    // Join new channel
<<<<<<< HEAD
    socket.emit('join_community_channel', { channelId: channel.channelId });
    
    // Fetch channel messages
    await fetchChannelMessages(channel.channelId);
    
    // Get online members
    socket.emit('get_online_members', { channelId: channel.channelId });
=======
    socket?.emit("join_community_channel", { channelId: channel.channelId });

    // Fetch channel messages
    await fetchChannelMessages(channel.channelId);

    // Get online members
    socket?.emit("get_online_members", { channelId: channel.channelId });
>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e
  };

  const fetchChannelMessages = async (channelId, page = 1) => {
    try {
      setMessagesLoading(true);
<<<<<<< HEAD
      const response = await fetch(`http://localhost:5000/api/community/channels/${channelId}/messages?page=${page}&limit=50`, {
        headers: {
        //   'Authorization': `Bearer ${localStorage.getItem('token')}`
        'Authorization': `Bearer ${accessToken}`
        }
      });
      const data = await response.json();
      
=======
      const response = await fetch(
        `https://server-agri-ai.onrender.com/api/community/channels/${channelId}/messages?page=${page}&limit=50`,
        {
          headers: {
            //   'Authorization': `Bearer ${localStorage.getItem('token')}`
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = await response.json();

>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e
      if (data.success) {
        if (page === 1) {
          setMessages(data.data.messages);
        } else {
<<<<<<< HEAD
          setMessages(prev => [...data.data.messages, ...prev]);
        }
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
=======
          setMessages((prev) => [...data.data.messages, ...prev]);
        }
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e
    } finally {
      setMessagesLoading(false);
    }
  };

  const handleChannelJoined = (data) => {
<<<<<<< HEAD
    console.log('Joined channel:', data.channelId);
=======
    console.log("Joined channel:", data.channelId);
>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e
  };

  const handleNewMessage = (data) => {
    if (data.channelId === currentChannel?.channelId) {
<<<<<<< HEAD
      setMessages(prev => [...prev, data.message]);
=======
      setMessages((prev) => [...prev, data.message]);
>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e
    }
  };

  const handleReactionUpdate = (data) => {
<<<<<<< HEAD
    setMessages(prev => prev.map(msg => 
      msg._id === data.messageId 
        ? { ...msg, reactionCounts: data.reactionCounts }
        : msg
    ));
  };

  const handleMessageDeleted = (data) => {
    setMessages(prev => prev.filter(msg => msg._id !== data.messageId));
  };

  const handleMessageEdited = (data) => {
    setMessages(prev => prev.map(msg => 
      msg._id === data.messageId 
        ? { 
            ...msg, 
            content: data.newContent, 
            isEdited: true, 
            editedAt: data.editedAt 
          }
        : msg
    ));
=======
    setMessages((prev) =>
      prev.map((msg) =>
        msg._id === data.messageId
          ? { ...msg, reactionCounts: data.reactionCounts }
          : msg
      )
    );
  };

  const handleMessageDeleted = (data) => {
    setMessages((prev) => prev.filter((msg) => msg._id !== data.messageId));
  };

  const handleMessageEdited = (data) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg._id === data.messageId
          ? {
              ...msg,
              content: data.newContent,
              isEdited: true,
              editedAt: data.editedAt,
            }
          : msg
      )
    );
>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e
  };

  const handleUserTyping = (data) => {
    if (data.channelId !== currentChannel?.channelId) return;

    if (data.isTyping) {
<<<<<<< HEAD
      setTypingUsers(prev => {
        if (!prev.find(user => user.userId === data.userId)) {
=======
      setTypingUsers((prev) => {
        if (!prev.find((user) => user.userId === data.userId)) {
>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e
          return [...prev, data];
        }
        return prev;
      });
<<<<<<< HEAD
      
      // Remove typing indicator after 3 seconds
      setTimeout(() => {
        setTypingUsers(prev => prev.filter(user => user.userId !== data.userId));
      }, 3000);
    } else {
      setTypingUsers(prev => prev.filter(user => user.userId !== data.userId));
=======

      // Remove typing indicator after 3 seconds
      setTimeout(() => {
        setTypingUsers((prev) =>
          prev.filter((user) => user.userId !== data.userId)
        );
      }, 3000);
    } else {
      setTypingUsers((prev) =>
        prev.filter((user) => user.userId !== data.userId)
      );
>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e
    }
  };

  const handleUserJoinedChannel = (data) => {
    // Could show a notification or update online members
<<<<<<< HEAD
    socket.emit('get_online_members', { channelId: data.channelId });
  };

  const handleUserLeftChannel = (data) => {
    socket.emit('get_online_members', { channelId: data.channelId });
=======
    socket.emit("get_online_members", { channelId: data.channelId });
  };

  const handleUserLeftChannel = (data) => {
    socket.emit("get_online_members", { channelId: data.channelId });
>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e
  };

  const handleOnlineMembers = (data) => {
    if (data.channelId === currentChannel?.channelId) {
      setOnlineMembers(data.members);
    }
  };

  const sendMessage = (content, mentions = []) => {
    if (!currentChannel || !content.trim()) return;

<<<<<<< HEAD
    socket.emit('send_community_message', {
      channelId: currentChannel.channelId,
      content: content.trim(),
      mentions
=======
    socket.emit("send_community_message", {
      channelId: currentChannel.channelId,
      content: content.trim(),
      mentions,
>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e
    });
  };

  const toggleReaction = (messageId, emoji) => {
<<<<<<< HEAD
    socket.emit('toggle_message_reaction', { messageId, emoji });
  };

  const deleteMessage = (messageId) => {
    socket.emit('delete_community_message', { messageId });
=======
    socket.emit("toggle_message_reaction", { messageId, emoji });
  };

  const deleteMessage = (messageId) => {
    socket.emit("delete_community_message", { messageId });
>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e
  };

  const handleTyping = (isTyping) => {
    if (currentChannel) {
<<<<<<< HEAD
      socket.emit('community_typing', {
        channelId: currentChannel.channelId,
        isTyping
=======
      socket.emit("community_typing", {
        channelId: currentChannel.channelId,
        isTyping,
>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e
      });
    }
  };

  const joinChannel = async (channelId) => {
    try {
<<<<<<< HEAD
      const response = await fetch(`http://localhost:5000/api/community/channels/${channelId}/join`, {
        method: 'POST',
        headers: {
        //   'Authorization': `Bearer ${localStorage.getItem('token')}`
        'Authorization': `Bearer ${accessToken}`
        }
      });
      const data = await response.json();
      
=======
      const response = await fetch(
        `https://server-agri-ai.onrender.com/api/community/channels/${channelId}/join`,
        {
          method: "POST",
          headers: {
            //   'Authorization': `Bearer ${localStorage.getItem('token')}`
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = await response.json();

>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e
      if (data.success) {
        await fetchUserChannels(); // Refresh channels
      }
    } catch (error) {
<<<<<<< HEAD
      console.error('Failed to join channel:', error);
=======
      console.error("Failed to join channel:", error);
>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e
    }
  };

  const leaveChannel = async (channelId) => {
    try {
<<<<<<< HEAD
      const response = await fetch(`http://localhost:5000/api/community/channels/${channelId}/leave`, {
        method: 'POST',
        headers: {
        //   'Authorization': `Bearer ${localStorage.getItem('token')}`
        'Authorization': `Bearer ${accessToken}`
        }
      });
      const data = await response.json();
      
=======
      const response = await fetch(
        `https://server-agri-ai.onrender.com/api/community/channels/${channelId}/leave`,
        {
          method: "POST",
          headers: {
            //   'Authorization': `Bearer ${localStorage.getItem('token')}`
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = await response.json();

>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e
      if (data.success) {
        if (currentChannel?.channelId === channelId) {
          setCurrentChannel(null);
          setMessages([]);
        }
        await fetchUserChannels(); // Refresh channels
      }
    } catch (error) {
<<<<<<< HEAD
      console.error('Failed to leave channel:', error);
    }
  };

  const filteredChannels = channels.filter(channel =>
    channel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    channel.description.toLowerCase().includes(searchQuery.toLowerCase())
=======
      console.error("Failed to leave channel:", error);
    }
  };

  const filteredChannels = channels.filter(
    (channel) =>
      channel?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
      channel?.description?.toLowerCase()?.includes(searchQuery?.toLowerCase())
>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - Channel List */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <MessageCircle className="w-6 h-6 text-green-600" />
              Community Chat
            </h1>
            <button
              onClick={() => setShowCreateModal(true)}
              className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              title="Create Channel"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
<<<<<<< HEAD
          
=======

>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search channels..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Channel List */}
        <ChannelList
          channels={filteredChannels}
          currentChannel={currentChannel}
          onSelectChannel={selectChannel}
          onJoinChannel={joinChannel}
          onLeaveChannel={leaveChannel}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {currentChannel ? (
          <>
            {/* Chat Header */}
            <div className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Hash className="w-5 h-5 text-gray-500" />
                <div>
<<<<<<< HEAD
                  <h2 className="font-semibold text-gray-800">{currentChannel.name}</h2>
                  <p className="text-sm text-gray-500">{currentChannel.description}</p>
                </div>
              </div>
              
=======
                  <h2 className="font-semibold text-gray-800">
                    {currentChannel.name}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {currentChannel.description}
                  </p>
                </div>
              </div>

>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>{onlineMembers.length} online</span>
                </div>
                <button
                  onClick={() => setShowSettingsModal(true)}
                  className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="Channel Settings"
                >
                  <Settings className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 flex">
              <div className="flex-1 flex flex-col">
                <MessageList
                  messages={messages}
                  currentUser={user}
                  onToggleReaction={toggleReaction}
                  onDeleteMessage={deleteMessage}
                  loading={messagesLoading}
                  typingUsers={typingUsers}
                />
<<<<<<< HEAD
                
=======

>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e
                {/* Message Input */}
                <MessageInput
                  onSendMessage={sendMessage}
                  onTyping={handleTyping}
                  channelMembers={onlineMembers}
                />
              </div>

              {/* Online Members Sidebar */}
<<<<<<< HEAD
              <OnlineMembers
                members={onlineMembers}
                currentUser={user}
              />
=======
              <OnlineMembers members={onlineMembers} currentUser={user} />
>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
<<<<<<< HEAD
              <h3 className="text-xl font-semibold mb-2">Welcome to Community Chat</h3>
=======
              <h3 className="text-xl font-semibold mb-2">
                Welcome to Community Chat
              </h3>
>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e
              <p>Select a channel to start chatting with fellow farmers</p>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateChannelModal
          onClose={() => setShowCreateModal(false)}
          onChannelCreated={() => {
            fetchUserChannels();
            setShowCreateModal(false);
          }}
        />
      )}

      {showSettingsModal && currentChannel && (
        <ChannelSettingsModal
          channel={currentChannel}
          onClose={() => setShowSettingsModal(false)}
          onChannelUpdated={(updatedChannel) => {
            setCurrentChannel(updatedChannel);
            fetchUserChannels();
            setShowSettingsModal(false);
          }}
        />
      )}
    </div>
  );
};

<<<<<<< HEAD
export default CommunityChat;
=======
export default CommunityChat;
>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e
