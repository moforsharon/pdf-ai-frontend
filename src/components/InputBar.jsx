import React, { useState, useRef, useEffect } from 'react';
import { FaRegPaperPlane, FaRegStopCircle } from 'react-icons/fa';

const InputBar = ({ onSendMessage, typingStatus, onPause, onResume }) => {
  const [inputValue, setInputValue] = useState('');
  const [borderRadius, setBorderRadius] = useState('full');
  const textareaRef = useRef(null);

  // Adjust the height of the textarea when inputValue changes
  useEffect(() => {
    adjustTextareaHeight();
  }, [inputValue]);

  // Function to adjust the height of the textarea based on its content
  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Reset height to auto to shrink
      const newHeight = textareaRef.current.scrollHeight;

      // Limit textarea height to 150px
      if (newHeight > 150) {
        textareaRef.current.style.height = '150px';
      } else {
        textareaRef.current.style.height = `${newHeight}px`;
      }

      // Change border radius to 'lg' when textarea grows beyond 80px
      if (newHeight > 80) {
        setBorderRadius('lg');
      } else {
        setBorderRadius('full');
      }
    }
  };

  // Handle input changes and Enter key events
  const handleInputChange = (event) => {
    // Check if Enter key is pressed without Shift
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // Prevent default behavior (submitting form)
      handleSend(); // Call handleSend function
    } else if (event.key === 'Enter' && event.shiftKey) {
      // Insert a new line in textarea
      setInputValue(prevValue => prevValue + '\n');
    } else {
      setInputValue(event.target.value);
    }
  };

  // Handle sending the message
  const handleSend = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue, 'user'); // Send message
      setInputValue(''); // Clear input
    }
  };

  // Handle button click for sending message or pausing typing
  const handleButtonClick = () => {
    if (typingStatus === 'typing') {
      onPause();
    } else {
      handleSend();
    }
  };

  return (
    <div className={`relative flex items-center justify-between bg-gray-800 ${borderRadius === 'full' ? 'rounded-full' : 'rounded-lg'} shadow-md px-2`}>
      <textarea
        ref={textareaRef}
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleInputChange}
        placeholder="Enter a prompt here"
        className="flex-grow bg-transparent border-none outline-none text-white text-sm placeholder-gray-400 px-6 resize-none pt-5 overflow-y-auto"
      />
      <div className="absolute bottom-4 right-4">
        <button onClick={handleButtonClick}>
          {typingStatus === 'typing' ? <FaRegStopCircle className="text-secondary h-5 w-5" /> : <FaRegPaperPlane className="text-secondary h-5 w-5" />}
        </button>
      </div>
    </div>
  );
};

export default InputBar;
