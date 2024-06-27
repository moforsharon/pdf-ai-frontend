import React, { useState, useEffect } from 'react';
import { FaPlusCircle, FaRegFileAlt } from 'react-icons/fa';

const Header = ({ onFileSelected, uploading, filename, uploadError }) => {
    const [isFileSelected, setIsFileSelected] = useState(false);
    const [fileTypeError, setFileTypeError] = useState(false);

    // Effect to clear the file type error message after 3 seconds
    useEffect(() => {
        if (fileTypeError) {
            const timer = setTimeout(() => {
                setFileTypeError(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [fileTypeError]);

    // Handle file input change
    const handleFileInputChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (file.type === 'application/pdf') {
                setIsFileSelected(true);
                setFileTypeError(false); // Reset file type error if PDF is selected
                onFileSelected(file); // Callback to handle file upload
            } else {
                setIsFileSelected(false);
                setFileTypeError(true); // Show file type error if not PDF
            }
        }
    };

    // Handle input click to reset file selection state
    const handleInputClick = () => {
        setIsFileSelected(false);
    };

    return (
        <div className="flex flex-col">
            <nav className="flex items-center justify-between shadow-md p-6 w-full overflow-hidden">
                <div className="flex items-center flex-shrink-0 mr-20 md:mr-36 md:ml-6">
                    <img src={require("../assets/aiLogo.png")} alt="Logo" className="h-9 md:h-12" />
                </div>
                <div className="flex justify-around space-x-2 md:space-x-5">
                    <div className="flex justify-between items-center space-x-1 text-sm md:text-md text-primary">
                        {filename && <FaRegFileAlt className="text-sm md:text-lg" />}
                        <p>{filename}</p>
                    </div>
                    <label htmlFor="file-upload" className="relative">
                        <div className="relative">
                            <button className="py-2 px-5 border-1 border-secondary bg-secondary text-white font-medium rounded-md flex justify-between items-center space-x-2">
                                <FaPlusCircle className="h-3 md:h-4" />
                                {uploading? <p className="hidden md:text-sm md:block">Uploading...</p> : <p className="hidden md:text-sm md:block">Upload PDF</p>}
                            </button>
                        </div>
                        <input
                            id="file-upload"
                            type="file"
                            accept=".pdf"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={handleFileInputChange}
                            onClick={handleInputClick}
                            disabled={uploading}
                        />
                    </label>
                </div>
            </nav>
            {fileTypeError && (
                <div className="flex w-full justify-around">
                    <div className="flex justify-center bg-gray-800 h-10 p-2 rounded-md mt-3 w-3/6">
                        <p className="text-red-500 text-xs md:text-sm">Unsupported file type. Please select a PDF file.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Header;
