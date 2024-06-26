import React, { useState, useRef, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import InputBar from '../components/InputBar';
import ChatWindow from '../components/ChatWindow';
import { uploadDocument } from '../services/documentService';
import { postQuestion } from '../services/questionService';

// Utility functions for localStorage
const getLocalStorage = (key, initialValue) => {
    const savedItem = localStorage.getItem(key);
    return savedItem ? JSON.parse(savedItem) : initialValue;
};

const setLocalStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
};

const MainPage = () => {
    const [documentId, setDocumentId] = useState(getLocalStorage('documentId', null));
    const [messages, setMessages] = useState(getLocalStorage('messages', []));
    const [typingStatus, setTypingStatus] = useState('idle');
    const typingIntervalRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [filename, setFilename] = useState(getLocalStorage('filename', ''));
    const [uploadError, setUploadError] = useState(null);
    const [staticAIResponse, setStaticAIResponse] = useState("Welcome! Upload a PDF document and ask any question about its content.");

    // Add static response as the first message if it's not already there
    useEffect(() => {
        if (!messages.some(message => message.isStatic)) {
            setMessages([{ text: staticAIResponse, sender: 'ai', isStatic: true }, ...messages]);
        }
    }, [staticAIResponse, messages]);

    // Persist documentId in localStorage
    useEffect(() => {
        setLocalStorage('documentId', documentId);
    }, [documentId]);

    // Persist messages in localStorage
    useEffect(() => {
        setLocalStorage('messages', messages);
    }, [messages]);

    // Persist filename in localStorage
    useEffect(() => {
        setLocalStorage('filename', filename);
    }, [filename]);

    // Add a new message to the chat
    const addMessage = async (message, sender) => {
        setMessages(prevMessages => [...prevMessages, { text: message, sender }]);

        if (sender === 'user') {
            setIsLoading(true);
            setTypingStatus('typing');
            try {
                const response = await postQuestion(documentId, message);
                if (response.answer) {
                    displayAIResponse(response.answer);
                } else {
                    displayAIResponse("We're facing a little problem generating your response. Please retry");
                }
            } catch (error) {
                console.error('Error posting question:', error);
                displayAIResponse("Please upload a PDF document. You can click on the \"Upload PDF\" button on the top right corner of the screen.");
            }
        }
    };

    // Display AI response
    const displayAIResponse = (response) => {
        const formattedResponse = parseResponse(response);
        setIsLoading(false);
        setMessages(prevMessages => [
            ...prevMessages,
            { text: formattedResponse, sender: 'ai', isFormatted: true }
        ]);
        setTypingStatus('idle');
    };

    // Parse the response to format it
    const parseResponse = (response) => {
        const lines = response.split('\n');

        return lines.map((line) => {
            const match = line.match(/^\d+\.\s+/);
            if (match) {
                return `<li>${line.replace(match[0], '')}</li>`;
            }
            const boldMatch = line.match(/^\*\*(.*)\*\*$/);
            if (boldMatch) {
                return `<b>${boldMatch[1]}</b>`;
            }
            return line;
        }).join('');
    };

    // Simulate typing effect
    const simulateTyping = (text) => {
        let currentIndex = 0;

        typingIntervalRef.current = setInterval(() => {
            currentIndex++;
            setMessages(prevMessages => {
                const updatedMessages = [...prevMessages];
                if (updatedMessages.length > 0 && updatedMessages[updatedMessages.length - 1].sender === 'ai') {
                    updatedMessages[updatedMessages.length - 1] = {
                        text: text.substring(0, currentIndex),
                        sender: 'ai'
                    };
                } else {
                    updatedMessages.push({
                        text: text.substring(0, currentIndex),
                        sender: 'ai'
                    });
                }

                if (currentIndex === 1) {
                    setIsLoading(false);
                    setTypingStatus('typing');
                }

                return updatedMessages;
            });

            if (currentIndex === text.length) {
                clearInterval(typingIntervalRef.current);
                setTypingStatus('idle');
            }
        }, 40);
    };

    // Pause typing simulation
    const handlePause = () => {
        clearInterval(typingIntervalRef.current);
        setTypingStatus('paused');
    };

    // Resume typing simulation
    const handleResume = () => {
        if (typingStatus === 'paused') {
            const currentMessage = messages[messages.length - 1]?.text || '';
            simulateTyping(currentMessage.substring(messages[messages.length - 1].sender === 'user' ? 0 : 1));
        }
    };

    // Handle file selection for upload
    const handleFileSelected = async (file) => {
        setUploading(true);
        setFilename(file.name);
        setUploadError(null); // Clear previous errors

        try {
            const response = await uploadDocument(file); // Upload the document
            setDocumentId(response.id); // Set the document ID
            console.log('Upload successful:', response);
        } catch (error) {
            console.error('Error uploading document:', error);
            setUploadError('Error uploading document. Please try again.'); // Set error message
            setTimeout(() => {
                setUploadError(null); // Clear upload error message after 3 seconds
            }, 3000);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="App flex flex-col h-screen overflow-y-auto">
            <Header onFileSelected={handleFileSelected} uploading={uploading} filename={filename} uploadError={uploadError} />
            {uploadError && (
                <div className="flex w-full justify-around">
                    <div className="flex justify-center bg-gray-800 h-10 p-2 rounded-md mt-3 w-3/6">
                        <p className="text-red-500 text-xs md:text-sm">{uploadError}</p>
                    </div>
                </div>
            )}
            <div className="flex-grow overflow-y-auto">
                <ChatWindow messages={messages} isLoading={isLoading} />
            </div>
            <div className="fixed bottom-9 left-0 right-0 px-6 md:px-20 lg:px-40 z-20">
                <InputBar onSendMessage={addMessage} typingStatus={typingStatus} onPause={handlePause} onResume={handleResume} />
            </div>
            <Footer />
        </div>
    );
};

export default MainPage;
