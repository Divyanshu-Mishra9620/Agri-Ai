<<<<<<< HEAD
import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Smile, AtSign } from 'lucide-react';

const MessageInput = ({ onSendMessage, onTyping, channelMembers }) => {
  const [message, setMessage] = useState('');
  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
=======
import React, { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Smile, AtSign } from "lucide-react";

const MessageInput = ({ onSendMessage, onTyping, channelMembers }) => {
  const [message, setMessage] = useState("");
  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState("");
>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e
  const [selectedMentions, setSelectedMentions] = useState([]);
  const [cursorPosition, setCursorPosition] = useState(0);
  const textareaRef = useRef(null);
  const mentionsRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Auto-resize textarea
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
<<<<<<< HEAD
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
=======
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px";
>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  // Handle typing indicators
  useEffect(() => {
    if (message.trim()) {
      onTyping(true);
<<<<<<< HEAD
      
=======

>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e
      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
<<<<<<< HEAD
      
=======

>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e
      // Set new timeout to stop typing indicator
      typingTimeoutRef.current = setTimeout(() => {
        onTyping(false);
      }, 1000);
    } else {
      onTyping(false);
    }

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [message, onTyping]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    const position = e.target.selectionStart;
<<<<<<< HEAD
    
=======

>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e
    setMessage(value);
    setCursorPosition(position);

    // Check for mention trigger (@)
    const textBeforeCursor = value.substring(0, position);
    const mentionMatch = textBeforeCursor.match(/@(\w*)$/);
<<<<<<< HEAD
    
=======

>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e
    if (mentionMatch) {
      setShowMentions(true);
      setMentionQuery(mentionMatch[1]);
    } else {
      setShowMentions(false);
<<<<<<< HEAD
      setMentionQuery('');
=======
      setMentionQuery("");
>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e
    }
  };

  const handleKeyDown = (e) => {
<<<<<<< HEAD
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
    
    if (e.key === 'Escape') {
=======
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }

    if (e.key === "Escape") {
>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e
      setShowMentions(false);
    }
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;

    // Extract mentioned user IDs
<<<<<<< HEAD
    const mentionedIds = selectedMentions.map(mention => mention._id);
    
    onSendMessage(message, mentionedIds);
    setMessage('');
    setSelectedMentions([]);
    setShowMentions(false);
    onTyping(false);
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
=======
    const mentionedIds = selectedMentions.map((mention) => mention._id);

    onSendMessage(message, mentionedIds);
    setMessage("");
    setSelectedMentions([]);
    setShowMentions(false);
    onTyping(false);

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e
    }
  };

  const handleMentionClick = (member) => {
    const textarea = textareaRef.current;
    const textBeforeCursor = message.substring(0, cursorPosition);
    const textAfterCursor = message.substring(cursorPosition);
<<<<<<< HEAD
    
    // Find the @ symbol position
    const mentionStart = textBeforeCursor.lastIndexOf('@');
    const newText = 
      textBeforeCursor.substring(0, mentionStart) + 
      `@${member.name} ` + 
      textAfterCursor;
    
    setMessage(newText);
    setSelectedMentions(prev => [...prev, member]);
    setShowMentions(false);
    
=======

    // Find the @ symbol position
    const mentionStart = textBeforeCursor.lastIndexOf("@");
    const newText =
      textBeforeCursor.substring(0, mentionStart) +
      `@${member.name} ` +
      textAfterCursor;

    setMessage(newText);
    setSelectedMentions((prev) => [...prev, member]);
    setShowMentions(false);

>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e
    // Focus back to textarea
    setTimeout(() => {
      textarea.focus();
      const newPosition = mentionStart + member.name.length + 2;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  // Filter members based on mention query
<<<<<<< HEAD
  const filteredMembers = channelMembers.filter(member =>
    member.userInfo.name.toLowerCase().includes(mentionQuery.toLowerCase())
  ).slice(0, 5);
=======
  const filteredMembers = channelMembers
    .filter((member) =>
      member?.userInfo?.name
        ?.toLowerCase()
        ?.includes(mentionQuery?.toLowerCase())
    )
    .slice(0, 5);
>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e

  return (
    <div className="border-t border-gray-200 bg-white">
      {/* Selected Mentions */}
      {selectedMentions.length > 0 && (
        <div className="px-4 py-2 border-b border-gray-100">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-600">Mentioning:</span>
            {selectedMentions.map((mention, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center gap-1"
              >
                @{mention.name}
                <button
                  onClick={() => {
<<<<<<< HEAD
                    setSelectedMentions(prev => prev.filter((_, i) => i !== index));
=======
                    setSelectedMentions((prev) =>
                      prev.filter((_, i) => i !== index)
                    );
>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e
                  }}
                  className="text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="relative p-4">
        {/* Mentions Dropdown */}
        {showMentions && filteredMembers.length > 0 && (
<<<<<<< HEAD
          <div 
=======
          <div
>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e
            ref={mentionsRef}
            className="absolute bottom-full left-4 right-4 mb-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto z-10"
          >
            {filteredMembers.map((member) => (
              <button
                key={member.userId}
                onClick={() => handleMentionClick(member.userInfo)}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-3 border-b border-gray-100 last:border-b-0"
              >
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  {member.userInfo.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-medium text-gray-800">
                    {member.userInfo.name}
                  </div>
                  <div className="text-sm text-gray-500">
<<<<<<< HEAD
                    @{member.userInfo.name.toLowerCase().replace(/\s+/g, '')}
=======
                    @
                    {member?.userInfo?.name?.toLowerCase()?.replace(/\s+/g, "")}
>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Input Area */}
        <div className="flex items-end gap-3">
          {/* Text Input */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Type a message... (Use @ to mention someone)"
              className="w-full resize-none border border-gray-300 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              rows={1}
<<<<<<< HEAD
              style={{ minHeight: '48px' }}
            />
            
=======
              style={{ minHeight: "48px" }}
            />

>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e
            {/* Input Actions */}
            <div className="absolute right-2 bottom-2 flex items-center gap-1">
              <button
                type="button"
                className="p-2 text-gray-400 hover:text-gray-600 rounded transition-colors"
                title="Add Emoji"
              >
                <Smile className="w-4 h-4" />
              </button>
<<<<<<< HEAD
              
=======

>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e
              <button
                type="button"
                className="p-2 text-gray-400 hover:text-gray-600 rounded transition-colors"
                title="Attach File"
              >
                <Paperclip className="w-4 h-4" />
              </button>
<<<<<<< HEAD
              
=======

>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e
              <button
                type="button"
                onClick={() => setShowMentions(!showMentions)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded transition-colors"
                title="Mention Someone"
              >
                <AtSign className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Send Button */}
          <button
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className={`p-3 rounded-lg transition-colors ${
              message.trim()
<<<<<<< HEAD
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
=======
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e
            }`}
            title="Send Message"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>

        {/* Character Count */}
        <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <span>Shift + Enter for new line</span>
            {selectedMentions.length > 0 && (
<<<<<<< HEAD
              <span>{selectedMentions.length} mention{selectedMentions.length !== 1 ? 's' : ''}</span>
            )}
          </div>
          <span className={`${message.length > 900 ? 'text-red-500' : ''}`}>
=======
              <span>
                {selectedMentions.length} mention
                {selectedMentions.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
          <span className={`${message.length > 900 ? "text-red-500" : ""}`}>
>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e
            {message.length}/1000
          </span>
        </div>
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default MessageInput;
=======
export default MessageInput;
>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e
