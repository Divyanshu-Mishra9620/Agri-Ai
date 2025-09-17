import React, { useState, useEffect, useRef, useCallback } from "react";
import { Send, Wheat, User, Bot, Loader2 } from "lucide-react";

export const ChatBot = ({ selectedDistrict, onDistrictRequest }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "🙏 Namaste! I'm your agricultural assistant. Click a district or ask me about crops, weather, and farming tips!",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const messageIdCounter = useRef(1);
  const shouldAutoScrollRef = useRef(true);
  const generateMessageId = () => {
    messageIdCounter.current += 1;
    return messageIdCounter.current;
  };
  const lastProcessedDistrict = useRef(null);

  const scrollToBottom = useCallback((smooth = true) => {
    if (!messagesContainerRef.current || !shouldAutoScrollRef.current) return;

    const container = messagesContainerRef.current;
    const behavior = smooth ? "smooth" : "auto";

    requestAnimationFrame(() => {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: behavior,
      });
    });
  }, []);

  // Check if user is near the bottom of the chat
  const isNearBottom = useCallback(() => {
    if (!messagesContainerRef.current) return true;

    const container = messagesContainerRef.current;
    const threshold = 100; // pixels from bottom
    return (
      container.scrollHeight - container.scrollTop - container.clientHeight <=
      threshold
    );
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      shouldAutoScrollRef.current = isNearBottom();
    };

    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [isNearBottom]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const fetchAndStreamResponse = useCallback(
    async (query) => {
      setIsTyping(true);

      const botMessageId = generateMessageId();
      setMessages((prev) => [
        ...prev,
        {
          id: botMessageId,
          sender: "bot",
          text: "",
          timestamp: new Date().toISOString(),
        },
      ]);

      // Check if we should auto-scroll before starting
      shouldAutoScrollRef.current = isNearBottom();

      try {
        const response = await fetch(
          "https://agri-ai-17u4.onrender.com/api/get-answer",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query }),
          }
        );

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        const fullText = data.answer.replace(/\*\*/g, "");
        const words = fullText.split(" ");

        let streamedText = "";
        for (const word of words) {
          streamedText += `${word} `;
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === botMessageId ? { ...msg, text: streamedText } : msg
            )
          );

          // Only scroll if user hasn't manually scrolled up
          if (shouldAutoScrollRef.current && words.indexOf(word) % 3 === 0) {
            scrollToBottom(false);
          }

          await new Promise((resolve) => setTimeout(resolve, 50));
        }

        // Final scroll only if user is near bottom
        if (shouldAutoScrollRef.current) {
          scrollToBottom(true);
        }
      } catch (error) {
        console.error("Error fetching response:", error);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMessageId
              ? { ...msg, text: "Sorry, an error occurred. Please try again." }
              : msg
          )
        );
      } finally {
        setIsTyping(false);
      }
    },
    [scrollToBottom, isNearBottom]
  );

  const handleSendMessage = useCallback(() => {
    const query = inputText.trim();
    if (!query) return;

    const userMsg = {
      id: generateMessageId(),
      sender: "user",
      text: query,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");

    // When user sends a message, assume they want to see the response
    shouldAutoScrollRef.current = true;
    fetchAndStreamResponse(query);

    const match = query.match(
      /(?:district|in|on|for|of|show me)\s+([A-Z][a-z]+(?:\s[A-Z][a-z]+)*)/i
    );
    if (match?.[1]) {
      onDistrictRequest(match[1]);
    }
  }, [inputText, fetchAndStreamResponse, onDistrictRequest]);

  useEffect(() => {
    if (
      selectedDistrict?.district &&
      selectedDistrict.district !== lastProcessedDistrict.current
    ) {
      lastProcessedDistrict.current = selectedDistrict.district;

      const query = `Tell me about farming in ${selectedDistrict.district}, ${selectedDistrict.state}`;
      const userMsg = {
        id: generateMessageId(),
        sender: "user",
        text: query,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMsg]);
      shouldAutoScrollRef.current = true;
      fetchAndStreamResponse(query);
    }
  }, [selectedDistrict, fetchAndStreamResponse]);

  const formatMessage = (text) => {
    return text.split("\n").map((line, i) => (
      <span key={i}>
        {line}
        <br />
      </span>
    ));
  };

  return (
    <div className="flex flex-col h-[85vh] w-full bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
      <div className="p-4 bg-gradient-to-r from-green-600 to-green-700 text-white flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Wheat className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Krishi Sahayak</h2>
              <p className="text-xs text-green-100">
                Your AI Farming Assistant
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-xs bg-white/20 px-2 py-1 rounded-full">
            <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
            <span>Online</span>
          </div>
        </div>
      </div>

      {/* Main chat area with proper scrolling */}
      <div className="flex-1 flex flex-col min-h-0">
        <div
          ref={messagesContainerRef}
          className="flex-1 p-4 overflow-y-auto bg-gray-50"
          style={{ maxHeight: "calc(100vh - 280px)" }} // Ensures proper scroll container
        >
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                } animate-fadeIn`}
              >
                <div
                  className={`flex items-start space-x-2 max-w-[80%] ${
                    msg.sender === "user"
                      ? "flex-row-reverse space-x-reverse"
                      : ""
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                      msg.sender === "user" ? "bg-blue-500" : "bg-green-500"
                    }`}
                  >
                    {msg.sender === "user" ? (
                      <User className="w-5 h-5 text-white" />
                    ) : (
                      <Bot className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div
                    className={`px-4 py-3 rounded-2xl break-words ${
                      msg.sender === "user"
                        ? "bg-blue-500 text-white rounded-br-sm"
                        : "bg-white text-gray-800 border border-gray-200 rounded-bl-sm shadow-sm"
                    }`}
                  >
                    <div className="text-sm prose prose-sm max-w-none">
                      {formatMessage(msg.text)}
                      {isTyping &&
                        msg.id === messages[messages.length - 1].id && (
                          <span className="inline-block w-2 h-4 bg-gray-600 animate-pulse ml-1"></span>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {isTyping && messages[messages.length - 1].sender === "user" && (
              <div className="flex justify-start animate-fadeIn">
                <div className="flex items-center space-x-2 bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
                  <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                  <span className="text-sm text-gray-500">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input area */}
        <div className="p-4 border-t border-gray-200 bg-white flex-shrink-0">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Ask about crops, prices, weather..."
              className="flex-grow px-4 py-3 text-sm bg-gray-100 border border-gray-200 rounded-full focus:ring-2 focus:ring-green-500 outline-none transition"
              disabled={isTyping}
            />
            <button
              onClick={handleSendMessage}
              className="p-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isTyping || !inputText.trim()}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
