// hooks/useSocket.js
<<<<<<< HEAD
import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';

const SOCKET_URL = 'http://localhost:5000';
=======
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";

const SOCKET_URL = "https://server-agri-ai.onrender.com";
>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e

export const useSocket = () => {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
<<<<<<< HEAD
  const { accessToken } = useSelector(state => state.auth);
=======
  const { accessToken } = useSelector((state) => state.auth);
>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e

  useEffect(() => {
    if (accessToken && !socketRef.current) {
      // Initialize socket connection
      socketRef.current = io(SOCKET_URL, {
        auth: {
<<<<<<< HEAD
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
=======
          token: accessToken,
        },
        transports: ["websocket", "polling"],
        autoConnect: true,
      });

      // Connection event handlers
      socketRef.current.on("connect", () => {
        console.log("Socket connected:", socketRef.current.id);
        setIsConnected(true);
      });

      socketRef.current.on("disconnect", (reason) => {
        console.log("Socket disconnected:", reason);
>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e
        setIsConnected(false);
        setIsTyping(false);
      });

<<<<<<< HEAD
      socketRef.current.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
=======
      socketRef.current.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e
        setIsConnected(false);
      });

      // Typing indicators
<<<<<<< HEAD
      socketRef.current.on('assistant_typing', ({ isTyping: typing }) => {
=======
      socketRef.current.on("assistant_typing", ({ isTyping: typing }) => {
>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e
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
<<<<<<< HEAD
      socketRef.current.emit('chat_message', {
        messages,
        context,
        conversationId,
        sessionId
=======
      socketRef.current.emit("chat_message", {
        messages,
        context,
        conversationId,
        sessionId,
>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e
      });
    }
  };

  // Join conversation room
  const joinConversation = (conversationId) => {
    if (socketRef.current && isConnected) {
<<<<<<< HEAD
      socketRef.current.emit('join_conversation', { conversationId });
=======
      socketRef.current.emit("join_conversation", { conversationId });
>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e
    }
  };

  // Submit feedback
  const submitFeedback = (conversationId, messageIndex, rating, feedback) => {
    if (socketRef.current && isConnected) {
<<<<<<< HEAD
      socketRef.current.emit('submit_feedback', {
        conversationId,
        messageIndex,
        rating,
        feedback
=======
      socketRef.current.emit("submit_feedback", {
        conversationId,
        messageIndex,
        rating,
        feedback,
>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e
      });
    }
  };

  // Analyze soil image
  const analyzeSoil = (imageData, crop, conversationId) => {
    if (socketRef.current && isConnected) {
<<<<<<< HEAD
      socketRef.current.emit('analyze_soil', {
        imageData,
        crop,
        conversationId
=======
      socketRef.current.emit("analyze_soil", {
        imageData,
        crop,
        conversationId,
>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e
      });
    }
  };

  // Request weather update
  const requestWeather = (coordinates) => {
    if (socketRef.current && isConnected) {
<<<<<<< HEAD
      socketRef.current.emit('request_weather', { coordinates });
=======
      socketRef.current.emit("request_weather", { coordinates });
>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e
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
<<<<<<< HEAD
    off
  };
};
=======
    off,
  };
};
>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e
