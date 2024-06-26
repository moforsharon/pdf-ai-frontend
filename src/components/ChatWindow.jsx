import React, { useEffect, useRef } from 'react';
import { FaUser, FaRegUserCircle } from 'react-icons/fa';

const ChatWindow = ({ messages, isLoading }) => {
  const chatEndRef = useRef(null);

  // Automatically scroll to the bottom of the chat window when messages update
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Function to scroll to the bottom of the chat window
  const scrollToBottom = () => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-full text-white p-4 space-y-8 overflow-y-auto max-h-[calc(100%-6rem)] text-sm">
      {messages.map((message, index) => (
        <div key={index} className="flex items-start">
          <div className="flex items-center">
            {message.sender === 'user' ? (
              <FaRegUserCircle className="mr-2 text-primary h-6 w-6" />
            ) : (
              <img src={require("../assets/ai.png")} alt="Logo" className="mr-2 h-6" />
            )}
          </div>
          <div className="w-full px-4 rounded-lg text-white leading-7">
            {message.isFormatted ? (
              <div dangerouslySetInnerHTML={{ __html: message.text }} />
            ) : (
              message.text
            )}
          </div>
        </div>
      ))}
      {isLoading && (
        <div className="flex items-start">
          <div className="flex items-center">
            <img src={require("../assets/ai.png")} alt="Logo" className="mr-2 h-6" />
          </div>
          <div className='w-full flex flex-col space-y-3'>
            <div className="w-full px-4 rounded-lg text-white leading-7">
              <div className="loading-bar-1"></div>
            </div>
            <div className="w-full px-4 rounded-lg text-white leading-7">
              <div className="loading-bar-2"></div>
            </div>
            <div className="w-4/6 px-4 rounded-lg text-white leading-7">
              <div className="loading-bar-3"></div>
            </div>
          </div>
        </div>
      )}
      <div ref={chatEndRef} />
    </div>
  );
};

export default ChatWindow;
