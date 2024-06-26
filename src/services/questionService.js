import axios from 'axios';

// Function to post a question and get an answer
export const postQuestion = async (documentId, question) => {
    try {
        const response = await axios.post(`https://pdf-ai-backend.onrender.com/api/questions/${documentId}`, { question });
        return response.data;  // Return the response data (question and answer)
    } catch (error) {
        console.error('Error posting question:', error);
        throw error;
    }
};
