import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../hooks/useSocket';
import useTranslation from '../hooks/useTranslation';
import { skipToken } from '@reduxjs/toolkit/query/react';
import {
  useChatSuggestMutation,
  useAnalyzeSoilImageMutation,
  useGeocodeAddressMutation,
  useWeatherByCoordsQuery,
  useMarketTrendsQuery,
} from '../features/suggestions/suggestionsApi';
import SoilAnalysisResult from './suggestion/SoilAnalysisResult';

export default function Suggestions() {
  const t = useTranslation();
  const askPlaceholderText = t('askPlaceholder') || "Ask me about crops, weather, pests, soil health, or market prices...";
  
  // WebSocket integration
  const { isConnected, isTyping, sendMessage, on, off } = useSocket();

  const [messages, setMessages] = useState(() => [
    { role: 'assistant', content: "🌾 Namaste! I'm your farming assistant. I can help you with crop selection, pest management, soil health, weather planning, and market information. What would you like to know?" }
  ]);

  const [input, setInput] = useState('');
  const [address, setAddress] = useState('');
  const [crop, setCrop] = useState('');
  const [coords, setCoords] = useState(null);
  const [soilFile, setSoilFile] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');

  // API fallback mutations (for when socket is not available)
  const [chatSuggest, { isLoading: chatting }] = useChatSuggestMutation();
  const [analyzeSoilImage, { data: soilResult, isLoading: analyzing }] = useAnalyzeSoilImageMutation();
  const [geocodeAddress, { isLoading: geocoding }] = useGeocodeAddressMutation();

  const { data: weather, isLoading: weatherLoading } = useWeatherByCoordsQuery(
    coords ? { lat: coords.lat, lon: coords.lon } : skipToken
  );
  const { data: trends, isLoading: trendsLoading } = useMarketTrendsQuery(
    coords ? { state: coords.state, district: coords.district, crop } : skipToken
  );

  const chatRef = useRef();

  // Update connection status
  useEffect(() => {
    setConnectionStatus(isConnected ? 'connected' : 'disconnected');
  }, [isConnected]);

  // Socket event listeners
  useEffect(() => {
    // Listen for chat responses
    const handleChatResponse = ({ replies, conversationId: newConversationId }) => {
      if (replies && replies.length > 0) {
        setMessages(prev => [...prev, ...replies]);
        if (newConversationId) {
          setConversationId(newConversationId);
        }
      }
    };

    // Listen for errors
    const handleChatError = ({ message, error }) => {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: message || "I'm sorry, I'm having trouble responding right now. Please try again."
      }]);
    };

    // Listen for conversation joined
    const handleConversationJoined = ({ conversationId: joinedId, messageCount }) => {
      console.log(`Joined conversation ${joinedId} with ${messageCount} messages`);
    };

    // Listen for feedback confirmation
    const handleFeedbackReceived = ({ message }) => {
      console.log('Feedback received:', message);
    };

    if (isConnected) {
      on('chat_response', handleChatResponse);
      on('chat_error', handleChatError);
      on('conversation_joined', handleConversationJoined);
      on('feedback_received', handleFeedbackReceived);
    }

    return () => {
      if (isConnected) {
        off('chat_response', handleChatResponse);
        off('chat_error', handleChatError);
        off('conversation_joined', handleConversationJoined);
        off('feedback_received', handleFeedbackReceived);
      }
    };
  }, [isConnected, on, off]);

  // Auto-scroll chat
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // FIXED: Create properly structured context object that matches backend validation
  const createValidContext = () => {
    const context = {};

    // Add crop if present
    if (crop && crop.trim()) {
      context.crop = crop.trim();
    }

    // Add location if coordinates exist
    if (coords) {
      context.location = {};
      
      if (coords.formatted) {
        context.location.address = coords.formatted;
      }
      
      // FIXED: Use correct coordinate field names (lat/lon, not latitude/longitude)
      if (coords.lat != null && coords.lon != null) {
        context.location.coordinates = {
          lat: coords.lat,
          lon: coords.lon
        };
      }
      
      if (coords.state) {
        context.location.state = coords.state;
      }
      
      if (coords.district) {
        context.location.district = coords.district;
      }
    }

    // Add weather if available
    if (weather) {
      context.weather = {};
      
      if (typeof weather.temp === 'number') {
        context.weather.temp = weather.temp;
      }
      
      if (typeof weather.humidity === 'number') {
        context.weather.humidity = weather.humidity;
      }
      
      if (typeof weather.rain === 'number') {
        context.weather.rain = weather.rain;
      } else if (weather.rain === undefined || weather.rain === null) {
        context.weather.rain = 0;
      }
      
      if (weather.description && typeof weather.description === 'string') {
        context.weather.description = weather.description.trim();
      }
    }

    // Add soil analysis if available
    if (soilResult) {
      context.soilAnalysis = {};
      
      if (soilResult.summary && typeof soilResult.summary === 'string') {
        context.soilAnalysis.summary = soilResult.summary.trim();
      }
      
      if (Array.isArray(soilResult.recommendations)) {
        context.soilAnalysis.recommendations = soilResult.recommendations
          .filter(rec => typeof rec === 'string' && rec.trim())
          .map(rec => rec.trim());
      }
      
      if (typeof soilResult.confidence === 'number') {
        context.soilAnalysis.confidence = soilResult.confidence;
      }
    }

    // Add market data if available
    if (trends) {
      context.marketData = {};
      
      if (typeof trends.currentPrice === 'number') {
        context.marketData.currentPrice = trends.currentPrice;
      }
      
      if (trends.trend && typeof trends.trend === 'string') {
        context.marketData.trend = trends.trend.trim();
      }
      
      if (typeof trends.changePercent === 'number') {
        context.marketData.changePercent = trends.changePercent;
      }
      
      if (trends.forecast && typeof trends.forecast === 'string') {
        context.marketData.forecast = trends.forecast.trim();
      }
    }

    console.log('Created context:', context);
    return context;
  };

  const sendChatMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage = { role: 'user', content: input.trim() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');

    const context = createValidContext();
    console.log('Sending context:', context);

    try {
      if (isConnected) {
        // Use WebSocket for real-time communication
        sendMessage(updatedMessages, context, conversationId, sessionId);
      } else {
        // Fallback to REST API
        const res = await chatSuggest({
          messages: updatedMessages,
          context,
        }).unwrap();
        
        if (res.success && res.replies) {
          setMessages([...updatedMessages, ...res.replies]);
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages([...updatedMessages, {
        role: 'assistant',
        content: "I apologize, but I'm experiencing technical difficulties. Please try again in a moment."
      }]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendChatMessage();
    }
  };

  const onPickImage = (e) => {
    const f = e.target.files && e.target.files[0];
    if (f) setSoilFile(f);
  };

  const submitSoil = async () => {
    if (!soilFile) return;
    try {
      await analyzeSoilImage({ file: soilFile, crop });
    } catch (error) {
      console.error('Soil analysis error:', error);
    }
  };

  const resolveAddress = async () => {
    if (!address.trim()) return;
    try {
      const res = await geocodeAddress({ address }).unwrap();
      if (res.success) {
        setCoords(res);
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    }
  };

  const clearChat = () => {
    setMessages([
      { role: 'assistant', content: "🌾 Namaste! I'm your farming assistant. I can help you with crop selection, pest management, soil health, weather planning, and market information. What would you like to know?" }
    ]);
    setConversationId(null);
  };

  const formatMessage = (content) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br />');
  };

  const isProcessing = isTyping || chatting;

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 px-4">
      {/* Chat panel */}
      <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl p-6 flex flex-col max-h-[800px]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">🤖 {t('smartSuggestions') || 'Smart Farming Assistant'}</h1>
            
            {/* Connection status indicator */}
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                connectionStatus === 'connected' 
                  ? 'bg-green-500 animate-pulse' 
                  : 'bg-red-500'
              }`}></div>
              <span className="text-xs text-gray-500">
                {connectionStatus === 'connected' ? 'Real-time' : 'Standard'}
              </span>
            </div>
          </div>
          
          <button
            onClick={clearChat}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition"
          >
            Clear Chat
          </button>
        </div>

        <div
          ref={chatRef}
          className="flex-1 border rounded-2xl p-4 bg-gradient-to-br from-gray-50 to-gray-100 overflow-y-auto space-y-4 min-h-[500px]"
        >
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[80%] px-4 py-3 rounded-2xl shadow-sm text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-emerald-600 text-white rounded-br-none'
                    : 'bg-white border rounded-bl-none'
                }`}
              >
                {m.role === 'assistant' ? (
                  <div dangerouslySetInnerHTML={{ __html: formatMessage(m.content) }} />
                ) : (
                  m.content
                )}
              </div>
            </div>
          ))}
          
          {isProcessing && (
            <div className="flex justify-start">
              <div className="bg-white border rounded-bl-none rounded-2xl px-4 py-3 shadow-sm">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                  <span className="text-sm text-gray-500">
                    {isTyping ? 'Assistant is thinking...' : 'Processing...'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4">
          <div className="flex gap-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 resize-none"
              placeholder={askPlaceholderText}
              rows="2"
              disabled={isProcessing}
            />
            <button
              onClick={sendChatMessage}
              disabled={isProcessing || !input.trim()}
              className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                t('send') || 'Send'
              )}
            </button>
          </div>
          
          {/* Quick suggestion buttons */}
          <div className="flex flex-wrap gap-2 mt-3">
            {[
              "What crops should I plant this season?",
              "How to manage pests naturally?",
              "Check soil health",
              "Market prices today"
            ].map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => setInput(suggestion)}
                className="px-3 py-1 text-xs bg-emerald-50 text-emerald-700 rounded-full hover:bg-emerald-100 transition"
                disabled={isProcessing}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Context panel */}
      <div className="bg-white rounded-3xl shadow-xl p-6 space-y-6 max-h-[800px] overflow-y-auto">
        <h2 className="text-lg font-semibold">{t('fieldContext') || 'Field Context'}</h2>

        {/* Debug Panel - Remove this in production */}
        <div className="bg-gray-50 p-3 rounded-lg text-xs">
          <div className="font-medium text-gray-700 mb-2">Debug Info:</div>
          <div className="space-y-1 text-gray-600">
            <div>Crop: {crop || 'None'}</div>
            <div>Location: {coords?.formatted || 'None'}</div>
            <div>Weather: {weather ? 'Available' : 'None'}</div>
            <div>Soil: {soilResult ? 'Available' : 'None'}</div>
            <div>Market: {trends ? 'Available' : 'None'}</div>
            <div>Connection: {connectionStatus}</div>
          </div>
        </div>

        {/* Connection Status */}
        <div className={`p-3 rounded-lg text-sm ${
          connectionStatus === 'connected' 
            ? 'bg-green-50 text-green-700 border border-green-200'
            : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
        }`}>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              connectionStatus === 'connected' ? 'bg-green-500' : 'bg-yellow-500'
            }`}></div>
            <span className="font-medium">
              {connectionStatus === 'connected' ? 'Real-time Chat Active' : 'Standard Mode'}
            </span>
          </div>
          <div className="text-xs mt-1">
            {connectionStatus === 'connected' 
              ? 'Instant responses via WebSocket connection'
              : 'Using REST API for communication'
            }
          </div>
        </div>

        {/* Crop Input */}
        <div>
          <label className="block text-sm font-medium mb-1">{t('cropLabel') || 'Current Crop'}</label>
          <input
            value={crop}
            onChange={(e) => setCrop(e.target.value)}
            className="form-input w-full p-3 rounded-xl border-gray-300 focus:ring-2 focus:ring-emerald-500"
            placeholder="e.g., Wheat, Rice, Tomato, Cotton"
          />
        </div>

        {/* Address Input */}
        <div>
          <label className="block text-sm font-medium mb-1">{t('addressLabel') || 'Farm Location'}</label>
          <div className="flex gap-2">
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="flex-1 p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500"
              placeholder="Village, District, State"
            />
            <button
              onClick={resolveAddress}
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition disabled:opacity-50"
              disabled={geocoding || !address.trim()}
            >
              {geocoding ? '...' : 'Find'}
            </button>
          </div>
          {coords && (
            <p className="text-xs text-emerald-600 mt-2 bg-emerald-50 p-2 rounded">
              📍 {coords.formatted} ({coords.lat?.toFixed(3)}, {coords.lon?.toFixed(3)})
            </p>
          )}
        </div>

        {/* Weather Display */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 shadow-inner">
          <div className="text-sm text-gray-700 font-medium flex items-center gap-2">
            ⛅ Weather
            {weatherLoading && <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>}
          </div>
          {coords && weather ? (
            <div className="text-sm mt-2 space-y-1">
              <div>🌡 Temperature: {Math.round(weather.temp)}°C</div>
              <div>💧 Humidity: {weather.humidity}%</div>
              <div>☔ Rain: {weather.rain || 0} mm</div>
              {weather.description && <div>📋 {weather.description}</div>}
            </div>
          ) : (
            <div className="text-xs text-gray-400 mt-1">
              Provide location for weather data
            </div>
          )}
        </div>

        {/* Soil Analysis */}
        <div>
          <label className="block text-sm font-medium mb-2">Upload Soil/Plant Photo</label>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={onPickImage}
            className="block w-full text-sm cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-emerald-600 file:text-white hover:file:bg-emerald-700"
          />
          {soilFile && (
            <p className="text-xs text-gray-600 mt-1">Selected: {soilFile.name}</p>
          )}
          <button
            onClick={submitSoil}
            className="mt-3 w-full px-4 py-2 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition disabled:opacity-50"
            disabled={analyzing || !soilFile}
          >
            {analyzing ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Analyzing...
              </div>
            ) : (
              'Analyze Soil/Plant'
            )}
          </button>
          
          {/* {soilResult && (
            <div className="mt-3 p-3 bg-green-50 rounded-lg text-sm">
              <div className="font-medium text-green-800 mb-1">Analysis Result:</div>
              <div className="text-green-700">{soilResult.summary}</div>
              {soilResult.recommendations && (
                <div className="mt-2">
                  <div className="font-medium text-green-800">Recommendations:</div>
                  <ul className="text-green-700 text-xs mt-1 list-disc list-inside">
                    {soilResult.recommendations.map((rec, idx) => (
                      <li key={idx}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )} */}
          {soilResult && <SoilAnalysisResult soilResult={soilResult} />}
        </div>

        {/* Market Trends */}
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 shadow-inner">
          <div className="text-sm text-gray-700 font-medium flex items-center gap-2">
            📈 Market Trends
            {trendsLoading && <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>}
          </div>
          {coords && crop && trends ? (
            <div className="text-sm mt-2 space-y-1">
              <div>💰 Current Price: ₹{trends.currentPrice}/kg</div>
              <div className={`flex items-center gap-1 ${trends.trend === 'up' ? 'text-green-600' : trends.trend === 'down' ? 'text-red-600' : 'text-gray-600'}`}>
                {trends.trend === 'up' ? '📈' : trends.trend === 'down' ? '📉' : '➡️'}
                Trend: {trends.trend || 'stable'}
                {trends.changePercent && ` (${trends.changePercent > 0 ? '+' : ''}${trends.changePercent}%)`}
              </div>
              {trends.forecast && <div>🔮 Forecast: {trends.forecast}</div>}
            </div>
          ) : (
            <div className="text-xs text-gray-400 mt-1">
              Provide location and crop for market data
            </div>
          )}
        </div>

        {/* Session Info */}
        <div className="text-xs text-gray-400 p-2 bg-gray-50 rounded">
          Session: {sessionId.slice(-8)}
          {conversationId && <div>Chat ID: {conversationId.slice(-8)}</div>}
        </div>
      </div>
    </div>
  );
}