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

const VoiceChatbot = () => {
  const { user, accessToken } = useAuth();
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [language, setLanguage] = useState("english");
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("disconnected");

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioRef = useRef(null);
  const streamRef = useRef(null);

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

  const startSession = async () => {
    try {
      setIsLoading(true);

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
    } finally {
      setIsLoading(false);
    }
  };

  const endSession = async () => {
    try {
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
    }
  };

  const startRecording = async () => {
    try {
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
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    }
  };

  const processAudio = async (audioBlob) => {
    if (!currentSession) return;

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

      let data;
      if (response.ok) {
        data = await response.json();
      } else {
        // Mock response for demo
        data = {
          success: true,
          data: {
            userText: "नमस्कार, मेरी फसल में कीड़े लग गए हैं। क्या करूं?",
            aiText:
              "आपकी फसल में कीड़ों की समस्या के लिए नीम का तेल का छिड़काव करें। साप्ताहिक रूप से शाम के समय छिड़काव करें। यदि समस्या बनी रहे तो कृषि विशेषज्ञ से सलाह लें।",
            aiAudio: "mock-audio-response-base64",
          },
        };
      }

      if (data.success) {
        const newConversation = {
          id: Date.now(),
          userText: data.data.userText,
          aiText: data.data.aiText,
          aiAudio: data.data.aiAudio,
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
    } finally {
      setIsLoading(false);
    }
  };

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
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const base64ToBlob = (base64, mimeType) => {
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
    });
  };

  return (
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
    </div>
  );
};

export default VoiceChatbot;
