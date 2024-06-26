import axios from 'axios';

// Function to upload a document
export const uploadDocument = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await axios.post("/api/documents/", formData);
        return response.data; // Return the response data on success
    } catch (error) {
        console.error('Error uploading document:', error);
        throw error; // Re-throw the error to be handled by the caller
    }
};
