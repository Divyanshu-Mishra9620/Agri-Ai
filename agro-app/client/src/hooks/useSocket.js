// hooks/useSocket.js
import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';

const SOCKET_URL = 'http://localhost:5000';

export const useSocket = () => {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const { accessToken } = useSelector(state => state.auth);

  useEffect(() => {
    if (accessToken && !socketRef.current) {
      // Initialize socket connection
      socketRef.current = io(SOCKET_URL, {
        auth: {
          token: accessToken
        },
        transports: ['websocket', 'polling'],
        autoConnect: true
      });

      // Connection event handlers
      socketRef.current.on('connect', () => {
        console.log('Socket connected:', socketRef.current.id);
        setIsConnected(true);
      });

      socketRef.current.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
        setIsConnected(false);
        setIsTyping(false);
      });

      socketRef.current.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        setIsConnected(false);
      });

      // Typing indicators
      socketRef.current.on('assistant_typing', ({ isTyping: typing }) => {
        setIsTyping(typing);
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setIsConnected(false);
        setIsTyping(false);
      }
    };
  }, [accessToken]);

  // Send chat message via socket
  const sendMessage = (messages, context, conversationId, sessionId) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('chat_message', {
        messages,
        context,
        conversationId,
        sessionId
      });
    }
  };

  // Join conversation room
  const joinConversation = (conversationId) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('join_conversation', { conversationId });
    }
  };

  // Submit feedback
  const submitFeedback = (conversationId, messageIndex, rating, feedback) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('submit_feedback', {
        conversationId,
        messageIndex,
        rating,
        feedback
      });
    }
  };

  // Analyze soil image
  const analyzeSoil = (imageData, crop, conversationId) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('analyze_soil', {
        imageData,
        crop,
        conversationId
      });
    }
  };

  // Request weather update
  const requestWeather = (coordinates) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('request_weather', { coordinates });
    }
  };

  // Listen to specific events
  const on = (event, callback) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback);
    }
  };

  // Remove event listeners
  const off = (event, callback) => {
    if (socketRef.current) {
      socketRef.current.off(event, callback);
    }
  };

  return {
    socket: socketRef.current,
    isConnected,
    isTyping,
    sendMessage,
    joinConversation,
    submitFeedback,
    analyzeSoil,
    requestWeather,
    on,
    off
  };
};