<<<<<<< HEAD
import useAuth from '../hooks/useAuth';
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2, VolumeX, MessageCircle, User, Bot, Play, Pause, StopCircle, Phone, PhoneOff } from 'lucide-react';


=======
import React, { useState, useRef, useEffect } from "react";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  MessageCircle,
  User,
  Bot,
  Play,
  Pause,
} from "lucide-react";
import useAuth from "../hooks/useAuth";
>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e

const VoiceChatbot = () => {
  const { user, accessToken } = useAuth();
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
<<<<<<< HEAD
  const [language, setLanguage] = useState('hindi');
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [currentPlayingId, setCurrentPlayingId] = useState(null);
  
=======
  const [language, setLanguage] = useState("english");
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("disconnected");

>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioRef = useRef(null);
  const streamRef = useRef(null);
<<<<<<< HEAD
  const conversationEndRef = useRef(null);

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);

  // Scroll to bottom when new conversation is added
  useEffect(() => {
    if (conversationEndRef.current) {
      conversationEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversations]);

  // Enhanced cleanup function
  const cleanup = () => {
    // Stop recording if active
    if (mediaRecorderRef.current && isRecording) {
      try {
        mediaRecorderRef.current.stop();
      } catch (error) {
        console.error('Error stopping media recorder:', error);
      }
    }
    
    // Stop audio streams
    if (streamRef.current) {
      try {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      } catch (error) {
        console.error('Error stopping stream:', error);
      }
    }
    
    // Stop audio playback
    if (audioRef.current) {
      try {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current.src = '';
        audioRef.current.load(); // Reset the audio element
      } catch (error) {
        console.error('Error resetting audio:', error);
      }
    }
    
    // Reset states
    setIsRecording(false);
    setIsPlaying(false);
    setCurrentPlayingId(null);
    setIsLoading(false);
  };
=======

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (currentSession) {
        endSession();
      }
    };
  }, [currentSession]);
>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e

  const startSession = async () => {
    try {
      setIsLoading(true);
<<<<<<< HEAD
      
      const response = await fetch('http://localhost:5000/api/voice-chat/start-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({ language })
      });
      
      let data;
      if (response.ok) {
        data = await response.json();
      } else {
        // Mock response for demo
        data = {
          success: true,
          data: { sessionId: 'mock-session-' + Date.now(), language }
        };
      }
      
      if (data.success) {
        setCurrentSession(data.data);
        setConnectionStatus('connected');
        setConversations([]);
        setIsMuted(false); // Reset mute state on new session
      }
    } catch (error) {
      console.error('Error starting session:', error);
      // For demo purposes, create a mock session
      setCurrentSession({ sessionId: 'mock-session-' + Date.now(), language });
      setConnectionStatus('connected');
      setConversations([]);
      setIsMuted(false);
=======

      // Mock API call - replace with actual endpoint
      const response = await fetch(
        "https://server-agri-ai.onrender.com/api/voice-chat/start-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ language }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setCurrentSession(data.data);
        setConnectionStatus("connected");
        setConversations([]);
      }
    } catch (error) {
      console.error("Error starting session:", error);
      // For demo purposes, create a mock session
      setCurrentSession({ sessionId: "mock-session-" + Date.now(), language });
      setConnectionStatus("connected");
      setConversations([]);
>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e
    } finally {
      setIsLoading(false);
    }
  };

  const endSession = async () => {
    try {
<<<<<<< HEAD
      setIsLoading(true);
      
      // Stop any ongoing recording immediately
      if (isRecording && mediaRecorderRef.current) {
        try {
          mediaRecorderRef.current.stop();
        } catch (error) {
          console.error('Error stopping recording:', error);
        }
      }
      
      // Stop any playing audio immediately
      if (audioRef.current) {
        try {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
          audioRef.current.src = '';
          audioRef.current.load();
        } catch (error) {
          console.error('Error stopping audio:', error);
        }
      }
      
      if (currentSession) {
        try {
          await fetch('http://localhost:5000/api/voice-chat/end-session', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({ sessionId: currentSession.sessionId })
          });
        } catch (error) {
          console.error('Error ending session on server:', error);
        }
      }
      
      // Complete cleanup
      cleanup();
      setCurrentSession(null);
      setConnectionStatus('disconnected');
      setIsMuted(false);
      setConversations([]);
    } catch (error) {
      console.error('Error ending session:', error);
      // Force cleanup even if there's an error
      cleanup();
      setCurrentSession(null);
      setConnectionStatus('disconnected');
      setIsMuted(false);
      setConversations([]);
    } finally {
      setIsLoading(false);
=======
      if (currentSession) {
        // Mock API call
        await fetch(
          "https://server-agri-ai.onrender.com/api/voice-chat/end-session",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ sessionId: currentSession.sessionId }),
          }
        );
      }
    } catch (error) {
      console.error("Error ending session:", error);
    } finally {
      setCurrentSession(null);
      setConnectionStatus("disconnected");
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e
    }
  };

  const startRecording = async () => {
    try {
<<<<<<< HEAD
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      streamRef.current = stream;
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm;codecs=opus') 
          ? 'audio/webm;codecs=opus' 
          : 'audio/webm'
      });
      
      audioChunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorderRef.current.onstop = async () => {
        if (audioChunksRef.current.length > 0) {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          await processAudio(audioBlob);
        }
      };
      
      mediaRecorderRef.current.start(1000); // Collect data every second
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Microphone access is required for voice chat. Please enable microphone permissions and try again.');
=======
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      streamRef.current = stream;
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });

      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        await processAudio(audioBlob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
      alert("Microphone access is required for voice chat");
>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
<<<<<<< HEAD
      try {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
        
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
      } catch (error) {
        console.error('Error stopping recording:', error);
        setIsRecording(false);
=======
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e
      }
    }
  };

  const processAudio = async (audioBlob) => {
    if (!currentSession) return;
<<<<<<< HEAD
    
    try {
      setIsLoading(true);
      
      const base64Audio = await blobToBase64(audioBlob);
      
      const response = await fetch('http://localhost:5000/api/voice-chat/process-audio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          sessionId: currentSession.sessionId,
          audioData: base64Audio,
          language
        })
      });
      
=======

    try {
      setIsLoading(true);

      // Convert blob to base64
      const base64Audio = await blobToBase64(audioBlob);

      // Mock API call - replace with actual endpoint
      const response = await fetch(
        "https://server-agri-ai.onrender.com/api/voice-chat/process-audio",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            sessionId: currentSession.sessionId,
            audioData: base64Audio,
            language,
          }),
        }
      );

>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e
      let data;
      if (response.ok) {
        data = await response.json();
      } else {
        // Mock response for demo
        data = {
          success: true,
          data: {
<<<<<<< HEAD
            userText: language === 'hindi' 
              ? "नमस्कार, मेरी फसल में कीड़े लग गए हैं। क्या करूं?" 
              : "Hello, my crops have pests. What should I do?",
            aiText: language === 'hindi'
              ? "आपकी फसल में कीड़ों की समस्या के लिए **नीम का तेल** का छिड़काव करें:\n\n• साप्ताहिक रूप से **शाम के समय** छिड़काव करें\n• 2 मिली नीम तेल प्रति लीटर पानी में मिलाएं\n• यदि समस्या बनी रहे तो **कृषि विशेषज्ञ** से सलाह लें\n\n*प्राकृतिक उपचार सबसे अच्छा होता है!*"
              : "For pest problems in your crop, spray **neem oil**:\n\n• Spray in the **evening** weekly\n• Mix 2ml neem oil per liter of water\n• If problem persists, consult an **agricultural expert**\n\n*Natural treatment works best!*",
            aiAudio: null // Mock no audio for demo
          }
        };
      }
      
=======
            userText: "नमस्कार, मेरी फसल में कीड़े लग गए हैं। क्या करूं?",
            aiText:
              "आपकी फसल में कीड़ों की समस्या के लिए नीम का तेल का छिड़काव करें। साप्ताहिक रूप से शाम के समय छिड़काव करें। यदि समस्या बनी रहे तो कृषि विशेषज्ञ से सलाह लें।",
            aiAudio: "mock-audio-response-base64",
          },
        };
      }

>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e
      if (data.success) {
        const newConversation = {
          id: Date.now(),
          userText: data.data.userText,
          aiText: data.data.aiText,
          aiAudio: data.data.aiAudio,
<<<<<<< HEAD
          timestamp: new Date()
        };
        
        setConversations(prev => [...prev, newConversation]);
        
        // Only auto-play AI response if not muted and audio exists
        if (!isMuted && data.data.aiAudio) {
          await playAudioResponse(data.data.aiAudio, newConversation.id);
        }
      }
    } catch (error) {
      console.error('Error processing audio:', error);
      setConversations(prev => [...prev, {
        id: Date.now(),
        userText: "Audio processing failed",
        aiText: language === 'hindi' 
          ? "**माफ करें**, आपका संदेश समझने में कुछ समस्या आई। कृपया **दोबारा कोशिश** करें।"
          : "**Sorry**, there was an issue understanding your message. Please **try again**.",
        timestamp: new Date()
      }]);
=======
          timestamp: new Date(),
        };

        setConversations((prev) => [...prev, newConversation]);

        // Auto-play AI response if not muted
        if (!isMuted && data.data.aiAudio) {
          await playAudioResponse(data.data.aiAudio);
        }
      }
    } catch (error) {
      console.error("Error processing audio:", error);
      setConversations((prev) => [
        ...prev,
        {
          id: Date.now(),
          userText: "Audio processing failed",
          aiText:
            language === "hindi"
              ? "माफ करें, आपका संदेश समझने में कुछ समस्या आई। कृपया दोबारा कोशिश करें।"
              : "Sorry, there was an issue understanding your message. Please try again.",
          timestamp: new Date(),
        },
      ]);
>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e
    } finally {
      setIsLoading(false);
    }
  };

<<<<<<< HEAD
  const playAudioResponse = async (base64Audio, conversationId = null) => {
    // Don't play if muted
    if (isMuted || !base64Audio) {
      return;
    }
    
    // Stop any currently playing audio
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setCurrentPlayingId(null);
    }
    
    try {
      const audioBlob = base64ToBlob(base64Audio, 'audio/mp3');
      const audioUrl = URL.createObjectURL(audioBlob);
      
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        setIsPlaying(true);
        setCurrentPlayingId(conversationId);
        
        audioRef.current.onended = () => {
          setIsPlaying(false);
          setCurrentPlayingId(null);
          URL.revokeObjectURL(audioUrl);
        };
        
        audioRef.current.onerror = () => {
          setIsPlaying(false);
          setCurrentPlayingId(null);
          URL.revokeObjectURL(audioUrl);
          console.error('Error playing audio');
        };
        
        await audioRef.current.play();
      }
    } catch (error) {
      console.error('Error playing audio response:', error);
      setIsPlaying(false);
      setCurrentPlayingId(null);
    }
  };

  const stopAudioPlayback = () => {
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setCurrentPlayingId(null);
    }
  };

  // Enhanced mute toggle function
  const toggleMute = () => {
    setIsMuted(prev => {
      const newMuted = !prev;
      
      // If muting and audio is currently playing, stop it
      if (newMuted && audioRef.current && isPlaying) {
        stopAudioPlayback();
      }
      
      return newMuted;
    });
  };

  // Parse markdown-like text to JSX
  const parseText = (text) => {
    if (!text) return text;
    
    // Split by newlines to handle line breaks
    const lines = text.split('\n');
    
    return lines.map((line, lineIndex) => {
      if (!line.trim()) return <br key={lineIndex} />;
      
      let parsedLine = line;
      const elements = [];
      let currentIndex = 0;
      
      // Process bold text **text**
      const boldRegex = /\*\*(.*?)\*\*/g;
      let boldMatch;
      
      while ((boldMatch = boldRegex.exec(line)) !== null) {
        // Add text before bold
        if (boldMatch.index > currentIndex) {
          elements.push(line.slice(currentIndex, boldMatch.index));
        }
        
        // Add bold element
        elements.push(<strong key={`bold-${lineIndex}-${boldMatch.index}`} className="font-bold text-gray-900">{boldMatch[1]}</strong>);
        currentIndex = boldMatch.index + boldMatch[0].length;
      }
      
      // Add remaining text
      if (currentIndex < line.length) {
        elements.push(line.slice(currentIndex));
      }
      
      // Handle bullet points
      if (line.trim().startsWith('•')) {
        return (
          <div key={lineIndex} className="flex items-start gap-2 my-1">
            <span className="text-green-600 font-bold mt-0.5">•</span>
            <span>{elements.length > 0 ? elements : line.slice(1).trim()}</span>
          </div>
        );
      }
      
      // Handle italic text *text*
      const processItalics = (content) => {
        if (typeof content === 'string') {
          const italicRegex = /\*(.*?)\*/g;
          return content.replace(italicRegex, '<em class="italic text-gray-700">$1</em>');
        }
        return content;
      };
      
      return (
        <div key={lineIndex} className="my-1">
          {elements.length > 0 ? elements.map((el, i) => 
            typeof el === 'string' ? (
              <span key={i} dangerouslySetInnerHTML={{ __html: processItalics(el) }} />
            ) : el
          ) : (
            <span dangerouslySetInnerHTML={{ __html: processItalics(line) }} />
          )}
        </div>
      );
    });
  };

  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(',')[1]);
=======
  const playAudioResponse = async (base64Audio) => {
    try {
      // Convert base64 to blob and play
      const audioBlob = base64ToBlob(base64Audio, "audio/mp3");
      const audioUrl = URL.createObjectURL(audioBlob);

      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        setIsPlaying(true);

        audioRef.current.onended = () => {
          setIsPlaying(false);
          URL.revokeObjectURL(audioUrl);
        };

        await audioRef.current.play();
      }
    } catch (error) {
      console.error("Error playing audio response:", error);
      setIsPlaying(false);
    }
  };

  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(",")[1]);
>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const base64ToBlob = (base64, mimeType) => {
<<<<<<< HEAD
    try {
      const byteCharacters = atob(base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      return new Blob([byteArray], { type: mimeType });
    } catch (error) {
      console.error('Error converting base64 to blob:', error);
      return null;
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit' 
=======
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e
    });
  };

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-gradient-to-br from-green-50/30 via-white to-emerald-50/30 relative overflow-hidden">
      {/* Clean floating elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 text-4xl opacity-5"
          animate={{
            y: [-20, 20, -20],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        >
          🌾
        </motion.div>
        <motion.div
          className="absolute top-60 right-20 text-3xl opacity-5"
          animate={{
            y: [20, -20, 20],
            rotate: [0, -5, 5, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
        >
          🤖
        </motion.div>
        <motion.div
          className="absolute bottom-40 left-1/4 text-3xl opacity-5"
          animate={{
            y: [-15, 15, -15],
            rotate: [0, 10, -10, 0]
          }}
          transition={{ duration: 9, repeat: Infinity, delay: 4 }}
        >
          🎤
        </motion.div>
      </div>

      <div className="max-w-4xl mx-auto p-4 relative z-10">
        <motion.div 
          className="bg-white/95 backdrop-blur-xl rounded-[32px] shadow-2xl border border-white/60 overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-700 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <MessageCircle className="w-10 h-10" />
                </motion.div>
                <div>
                  <h1 className="text-3xl font-black">
                    {language === 'hindi' ? 'किसान सहायक AI' : 'Farmer Assistant AI'}
                  </h1>
                  <p className="text-green-100 font-medium">
                    {language === 'hindi' ? 'आवाज आधारित सहायक' : 'Voice-powered farming assistant'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full ${
                    connectionStatus === 'connected' 
                      ? 'bg-green-300 animate-pulse shadow-lg shadow-green-300/50' 
                      : 'bg-red-300 shadow-lg shadow-red-300/50'
                  }`}></div>
                  <span className="text-sm font-medium">
                    {connectionStatus === 'connected' ? 'Connected' : 'Disconnected'}
                  </span>
                </div>
                
                <select 
                  value={language} 
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-white/20 text-white rounded-xl px-4 py-2 text-sm border border-white/30 font-medium backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-white/30"
                  disabled={currentSession}
                >
                  <option value="hindi" className="text-black">🇮🇳 हिंदी</option>
                  <option value="english" className="text-black">🇬🇧 English</option>
                </select>
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="h-96 overflow-y-auto p-6 space-y-4 bg-gradient-to-br from-gray-50/50 to-white">
            <AnimatePresence>
              {conversations.length === 0 ? (
                <motion.div 
                  className="text-center text-gray-500 py-16"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <motion.div
                    animate={{ y: [-5, 5, -5] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <MessageCircle className="w-20 h-20 mx-auto mb-6 text-gray-300" />
                  </motion.div>
                  <p className="text-xl mb-3 font-semibold">
                    {language === 'hindi' 
                      ? 'अपने सवाल पूछने के लिए माइक बटन दबाएं' 
                      : 'Press the microphone button to ask your questions'
                    }
                  </p>
                  <p className="text-sm text-gray-400">
                    {language === 'hindi'
                      ? 'फसल, बीमारी, उर्वरक आदि के बारे में पूछें'
                      : 'Ask about crops, diseases, fertilizers, etc.'
                    }
                  </p>
                </motion.div>
              ) : (
                conversations.map((conv) => (
                  <motion.div 
                    key={conv.id} 
                    className="space-y-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    {/* User Message */}
                    <div className="flex items-start space-x-3">
                      <div className="bg-green-100 p-2 rounded-full flex-shrink-0">
                        <User className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="bg-green-500 text-white px-5 py-3 rounded-2xl rounded-tl-md max-w-xs shadow-lg">
                        <div className="text-sm font-medium">{parseText(conv.userText)}</div>
                        <span className="text-xs text-green-100 mt-2 block">
                          {formatTime(conv.timestamp)}
                        </span>
                      </div>
                    </div>

                    {/* AI Response */}
                    <div className="flex items-start space-x-3 justify-end">
                      <div className="bg-white border border-gray-200 px-5 py-3 rounded-2xl rounded-tr-md max-w-md shadow-lg">
                        <div className="text-sm text-gray-800 font-medium leading-relaxed">
                          {parseText(conv.aiText)}
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-xs text-gray-500">
                            {formatTime(conv.timestamp)}
                          </span>
                          {conv.aiAudio && (
                            <div className="flex items-center gap-2">
                              <motion.button
                                onClick={() => playAudioResponse(conv.aiAudio, conv.id)}
                                className={`p-1 rounded-full transition-all ${
                                  currentPlayingId === conv.id && isPlaying
                                    ? 'text-green-700 bg-green-50' 
                                    : 'text-green-600 hover:text-green-700 hover:bg-green-50'
                                } ${isMuted ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={isMuted}
                                whileHover={!isMuted ? { scale: 1.1 } : {}}
                                whileTap={!isMuted ? { scale: 0.9 } : {}}
                                title={isMuted ? 'Unmute to play audio' : 'Play audio response'}
                              >
                                {currentPlayingId === conv.id && isPlaying ? 
                                  <Pause className="w-4 h-4" /> : 
                                  <Play className="w-4 h-4" />
                                }
                              </motion.button>
                              {currentPlayingId === conv.id && isPlaying && (
                                <motion.button
                                  onClick={stopAudioPlayback}
                                  className="text-red-600 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  title="Stop audio"
                                >
                                  <StopCircle className="w-4 h-4" />
                                </motion.button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="bg-emerald-100 p-2 rounded-full flex-shrink-0">
                        <Bot className="w-5 h-5 text-emerald-600" />
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
            
            {isLoading && (
              <motion.div 
                className="flex justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="bg-white/90 backdrop-blur-xl px-6 py-3 rounded-full flex items-center space-x-3 border border-white/60 shadow-lg">
                  <div className="animate-spin w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full"></div>
                  <span className="text-sm text-gray-700 font-medium">
                    {language === 'hindi' ? 'प्रोसेसिंग...' : 'Processing...'}
                  </span>
                </div>
              </motion.div>
            )}
            
            <div ref={conversationEndRef} />
          </div>

          {/* Enhanced Controls */}
          <div className="p-8 bg-white border-t border-gray-100">
            <div className="flex items-center justify-center space-x-8">
              {!currentSession ? (
                <motion.button
                  onClick={startSession}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-10 py-4 rounded-2xl font-bold shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Phone className="w-6 h-6" />
                  {isLoading 
                    ? (language === 'hindi' ? 'शुरू हो रहा है...' : 'Starting...') 
                    : (language === 'hindi' ? 'वॉइस चैट शुरू करें' : 'Start Voice Chat')
                  }
                </motion.button>
              ) : (
                <>
                  <motion.button
                    onClick={toggleMute}
                    className={`p-4 rounded-2xl transition-all duration-300 shadow-lg ${
                      isMuted 
                        ? 'bg-red-100 text-red-600 hover:bg-red-200 shadow-red-200/50' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 shadow-gray-200/50'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title={isMuted ? 'Unmute audio' : 'Mute audio'}
                  >
                    {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                  </motion.button>

                  <motion.button
                    onClick={isRecording ? stopRecording : startRecording}
                    disabled={isLoading}
                    className={`p-6 rounded-full transition-all transform shadow-2xl ${
                      isRecording 
                        ? 'bg-red-500 hover:bg-red-600 scale-110 animate-pulse shadow-red-300/50' 
                        : 'bg-green-500 hover:bg-green-600 hover:scale-110 shadow-green-300/50'
                    } text-white disabled:opacity-50 disabled:cursor-not-allowed`}
                    whileHover={{ scale: isRecording ? 1.1 : 1.15 }}
                    whileTap={{ scale: 0.95 }}
                    title={isRecording ? 'Stop recording' : 'Start recording'}
                  >
                    {isRecording ? <MicOff className="w-10 h-10" /> : <Mic className="w-10 h-10" />}
                  </motion.button>

                  <motion.button
                    onClick={endSession}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-2xl transition-all duration-300 font-semibold flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-red-200/50"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title="End voice chat session"
                  >
                    <PhoneOff className="w-5 h-5" />
                    {language === 'hindi' ? 'चैट समाप्त करें' : 'End Chat'}
                  </motion.button>
                </>
              )}
            </div>
            
            {/* Status and Instructions */}
            <div className="text-center mt-6 space-y-2">
              {currentSession && (
                <div className="flex items-center justify-center gap-4 text-sm">
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
                    isMuted ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    {isMuted 
                      ? (language === 'hindi' ? 'ऑडियो बंद' : 'Audio Muted')
                      : (language === 'hindi' ? 'ऑडियो चालू' : 'Audio On')
                    }
                  </div>
                  {isPlaying && (
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      {language === 'hindi' ? 'ऑडियो बज रहा है' : 'Playing Audio'}
                    </div>
                  )}
                </div>
              )}
              
              <p className="text-sm text-gray-600 font-medium">
                {isRecording 
                  ? (language === 'hindi' ? '🎤 सुन रहा हूं... बोलें' : '🎤 Listening... Speak now')
                  : currentSession
                    ? (language === 'hindi' 
                      ? 'माइक बटन दबाएं और अपना सवाल पूछें' 
                      : 'Press the mic button and ask your question'
                    )
                    : (language === 'hindi'
                      ? 'वॉइस चैट शुरू करने के लिए ऊपर का बटन दबाएं'
                      : 'Press the button above to start voice chat'
                    )
                }
              </p>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Quick Tips */}
        <motion.div 
          className="mt-8 bg-white/95 backdrop-blur-xl rounded-[32px] shadow-2xl border border-white/60 p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-2xl font-black text-gray-800 mb-6 text-center">
            {language === 'hindi' ? '💡 सुझाव और टिप्स' : '💡 Quick Tips'}
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: language === 'hindi' ? 'फसल संबंधी प्रश्न' : 'Crop Related Questions',
                desc: language === 'hindi' 
                  ? 'बुआई, कटाई, बीज, उर्वरक के बारे में पूछें' 
                  : 'Ask about sowing, harvesting, seeds, fertilizers',
                color: 'green',
                icon: '🌾'
              },
              {
                title: language === 'hindi' ? 'बीमारी और कीट' : 'Disease & Pests',
                desc: language === 'hindi' 
                  ? 'पौधों की बीमारियों और कीड़ों का इलाज जानें' 
                  : 'Learn about plant diseases and pest control',
                color: 'blue',
                icon: '🔍'
              },
              {
                title: language === 'hindi' ? 'मौसम की जानकारी' : 'Weather Information',
                desc: language === 'hindi' 
                  ? 'मौसम के अनुसार खेती की सलाह पाएं' 
                  : 'Get weather-based farming advice',
                color: 'amber',
                icon: '🌤️'
              },
              {
                title: language === 'hindi' ? 'सरकारी योजनाएं' : 'Government Schemes',
                desc: language === 'hindi' 
                  ? 'किसानों के लिए योजनाओं की जानकारी' 
                  : 'Information about schemes for farmers',
                color: 'purple',
                icon: '🏛️'
              },
            ].map((tip, index) => (
              <motion.div
                key={index}
                className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border border-gray-200/50 hover:shadow-lg transition-all duration-300 hover:border-gray-300/50"
                whileHover={{ scale: 1.02, y: -2 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <div className="flex items-start gap-4">
                  <span className="text-3xl">{tip.icon}</span>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-2 text-lg">
                      {tip.title}
                    </h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {tip.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Usage Instructions */}
        <motion.div 
          className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-[32px] p-6 border border-blue-200/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="text-center">
            <h4 className="font-bold text-blue-800 text-lg mb-3">
              {language === 'hindi' ? '📱 उपयोग के निर्देश' : '📱 Usage Instructions'}
            </h4>
            <div className="text-sm text-blue-700 space-y-2">
              <p>
                {language === 'hindi' 
                  ? '• वॉइस चैट शुरू करें → माइक बटन दबाएं → अपना सवाल पूछें → AI का जवाब सुनें'
                  : '• Start Voice Chat → Press Mic Button → Ask Your Question → Listen to AI Response'
                }
              </p>
              <p>
                {language === 'hindi'
                  ? '• ऑडियो को म्यूट/अनम्यूट करने के लिए स्पीकर बटन का उपयोग करें'
                  : '• Use the speaker button to mute/unmute audio responses'
                }
              </p>
              <p>
                {language === 'hindi'
                  ? '• बेहतर अनुभव के लिए शांत जगह पर बोलें'
                  : '• Speak in a quiet environment for better experience'
                }
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Hidden audio element for playing AI responses */}
      <audio 
        ref={audioRef} 
        style={{ display: 'none' }}
        preload="none"
        controlsList="nodownload"
      />
=======
    <div className="max-w-4xl mx-auto p-4 bg-gradient-to-br from-green-50 to-blue-50 min-h-screen">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MessageCircle className="w-8 h-8" />
              <div>
                <h1 className="text-2xl font-bold">किसान सहायक AI</h1>
                <p className="text-green-100">Farmer Assistant Voice Chat</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    connectionStatus === "connected"
                      ? "bg-green-300"
                      : "bg-red-300"
                  }`}
                ></div>
                <span className="text-sm">
                  {connectionStatus === "connected"
                    ? "Connected"
                    : "Disconnected"}
                </span>
              </div>

              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-white/20 text-white rounded-lg px-3 py-1 text-sm border border-white/30"
                disabled={currentSession}
              >
                <option value="hindi" className="text-black">
                  हिंदी
                </option>
                <option value="english" className="text-black">
                  English
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="h-96 overflow-y-auto p-6 space-y-4 bg-gray-50">
          {conversations.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg mb-2">
                {language === "hindi"
                  ? "अपने सवाल पूछने के लिए माइक बटन दबाएं"
                  : "Press the microphone button to ask your questions"}
              </p>
              <p className="text-sm text-gray-400">
                {language === "hindi"
                  ? "फसल, बीमारी, उर्वरक आदि के बारे में पूछें"
                  : "Ask about crops, diseases, fertilizers, etc."}
              </p>
            </div>
          ) : (
            conversations.map((conv) => (
              <div key={conv.id} className="space-y-3">
                {/* User Message */}
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="bg-blue-500 text-white px-4 py-2 rounded-2xl rounded-tl-md max-w-xs">
                    <p className="text-sm">{conv.userText}</p>
                    <span className="text-xs text-blue-100 mt-1 block">
                      {formatTime(conv.timestamp)}
                    </span>
                  </div>
                </div>

                {/* AI Response */}
                <div className="flex items-start space-x-3 justify-end">
                  <div className="bg-green-500 text-white px-4 py-2 rounded-2xl rounded-tr-md max-w-xs">
                    <p className="text-sm">{conv.aiText}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-green-100">
                        {formatTime(conv.timestamp)}
                      </span>
                      {conv.aiAudio && (
                        <button
                          onClick={() => playAudioResponse(conv.aiAudio)}
                          className="text-green-100 hover:text-white"
                          disabled={isPlaying}
                        >
                          {isPlaying ? (
                            <Pause className="w-4 h-4" />
                          ) : (
                            <Play className="w-4 h-4" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="bg-green-100 p-2 rounded-full">
                    <Bot className="w-5 h-5 text-green-600" />
                  </div>
                </div>
              </div>
            ))
          )}

          {isLoading && (
            <div className="flex justify-center">
              <div className="bg-gray-200 px-4 py-2 rounded-full flex items-center space-x-2">
                <div className="animate-spin w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full"></div>
                <span className="text-sm text-gray-600">Processing...</span>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="p-6 bg-white border-t">
          <div className="flex items-center justify-center space-x-6">
            {!currentSession ? (
              <button
                onClick={startSession}
                disabled={isLoading}
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Starting..." : "Start Voice Chat"}
              </button>
            ) : (
              <>
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`p-3 rounded-full transition-colors ${
                    isMuted
                      ? "bg-red-100 text-red-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {isMuted ? (
                    <VolumeX className="w-6 h-6" />
                  ) : (
                    <Volume2 className="w-6 h-6" />
                  )}
                </button>

                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={isLoading}
                  className={`p-4 rounded-full transition-all transform ${
                    isRecording
                      ? "bg-red-500 hover:bg-red-600 scale-110 animate-pulse shadow-lg"
                      : "bg-green-500 hover:bg-green-600 hover:scale-105"
                  } text-white disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isRecording ? (
                    <MicOff className="w-8 h-8" />
                  ) : (
                    <Mic className="w-8 h-8" />
                  )}
                </button>

                <button
                  onClick={endSession}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-full transition-colors"
                >
                  End Chat
                </button>
              </>
            )}
          </div>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-500">
              {isRecording
                ? language === "hindi"
                  ? "सुन रहा हूं... बोलें"
                  : "Listening... Speak now"
                : language === "hindi"
                ? "माइक बटन दबाएं और अपना सवाल पूछें"
                : "Press the mic button and ask your question"}
            </p>
          </div>
        </div>
      </div>

      {/* Hidden audio element for playing AI responses */}
      <audio ref={audioRef} style={{ display: "none" }} />

      {/* Quick Tips */}
      <div className="mt-6 bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {language === "hindi" ? "सुझाव" : "Quick Tips"}
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-green-50 p-4 rounded-xl">
            <h4 className="font-medium text-green-800 mb-2">
              {language === "hindi"
                ? "फसल संबंधी प्रश्न"
                : "Crop Related Questions"}
            </h4>
            <p className="text-sm text-green-600">
              {language === "hindi"
                ? "बुआई, कटाई, बीज, उर्वरक के बारे में पूछें"
                : "Ask about sowing, harvesting, seeds, fertilizers"}
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-xl">
            <h4 className="font-medium text-blue-800 mb-2">
              {language === "hindi" ? "बीमारी और कीट" : "Disease & Pests"}
            </h4>
            <p className="text-sm text-blue-600">
              {language === "hindi"
                ? "पौधों की बीमारियों और कीड़ों का इलाज जानें"
                : "Learn about plant diseases and pest control"}
            </p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-xl">
            <h4 className="font-medium text-yellow-800 mb-2">
              {language === "hindi" ? "मौसम की जानकारी" : "Weather Information"}
            </h4>
            <p className="text-sm text-yellow-600">
              {language === "hindi"
                ? "मौसम के अनुसार खेती की सलाह पाएं"
                : "Get weather-based farming advice"}
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-xl">
            <h4 className="font-medium text-purple-800 mb-2">
              {language === "hindi" ? "सरकारी योजनाएं" : "Government Schemes"}
            </h4>
            <p className="text-sm text-purple-600">
              {language === "hindi"
                ? "किसानों के लिए योजनाओं की जानकारी"
                : "Information about schemes for farmers"}
            </p>
          </div>
        </div>
      </div>
>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e
    </div>
  );
};

export default VoiceChatbot;
