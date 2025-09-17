<<<<<<< HEAD


const api ='http://localhost:5000';

export const communityChatApi = {

  getChannels: (params = {}) => 
    api.get('/community/channels', { params }),

  getChannel: (channelId) => 
    api.get(`/community/channels/${channelId}`),

  createChannel: (data) => 
    api.post('/community/channels', data),

  updateChannel: (channelId, data) => 
    api.put(`/community/channels/${channelId}`, data),

  getUserChannels: () => 
    api.get('/community/channels/my'),

  // Channel membership
  joinChannel: (channelId) => 
    api.post(`/community/channels/${channelId}/join`),

  leaveChannel: (channelId) => 
    api.post(`/community/channels/${channelId}/leave`),

  getChannelMembers: (channelId, params = {}) => 
    api.get(`/community/channels/${channelId}/members`, { params }),

  // Messages
  getChannelMessages: (channelId, params = {}) => 
    api.get(`/community/channels/${channelId}/messages`, { params }),

  sendMessage: (channelId, data) => 
    api.post(`/community/channels/${channelId}/messages`, data),

  deleteMessage: (messageId) => 
    api.delete(`/community/messages/${messageId}`),

  // Reactions
  addReaction: (messageId, emoji) => 
    api.post(`/community/messages/${messageId}/reactions`, { emoji }),

  removeReaction: (messageId, emoji) => 
    api.delete(`/community/messages/${messageId}/reactions`, { 
      data: { emoji } 
    }),

  // Search
  searchMessages: (query, params = {}) => 
    api.get('/community/search/messages', { 
      params: { query, ...params } 
    }),

  // Analytics (for moderators)
  getChannelAnalytics: (channelId, days = 7) => 
    api.get(`/community/channels/${channelId}/analytics`, { 
      params: { days } 
    })
};
=======
const api = "https://server-agri-ai.onrender.com";

export const communityChatApi = {
  getChannels: (params = {}) => api.get("/community/channels", { params }),

  getChannel: (channelId) => api.get(`/community/channels/${channelId}`),

  createChannel: (data) => api.post("/community/channels", data),

  updateChannel: (channelId, data) =>
    api.put(`/community/channels/${channelId}`, data),

  getUserChannels: () => api.get("/community/channels/my"),

  // Channel membership
  joinChannel: (channelId) => api.post(`/community/channels/${channelId}/join`),

  leaveChannel: (channelId) =>
    api.post(`/community/channels/${channelId}/leave`),

  getChannelMembers: (channelId, params = {}) =>
    api.get(`/community/channels/${channelId}/members`, { params }),

  // Messages
  getChannelMessages: (channelId, params = {}) =>
    api.get(`/community/channels/${channelId}/messages`, { params }),

  sendMessage: (channelId, data) =>
    api.post(`/community/channels/${channelId}/messages`, data),

  deleteMessage: (messageId) => api.delete(`/community/messages/${messageId}`),

  // Reactions
  addReaction: (messageId, emoji) =>
    api.post(`/community/messages/${messageId}/reactions`, { emoji }),

  removeReaction: (messageId, emoji) =>
    api.delete(`/community/messages/${messageId}/reactions`, {
      data: { emoji },
    }),

  // Search
  searchMessages: (query, params = {}) =>
    api.get("/community/search/messages", {
      params: { query, ...params },
    }),

  // Analytics (for moderators)
  getChannelAnalytics: (channelId, days = 7) =>
    api.get(`/community/channels/${channelId}/analytics`, {
      params: { days },
    }),
};
>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e
