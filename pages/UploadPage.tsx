
import React, { useState, useCallback } from 'react';
import { uploadAndParseFile } from '../services/mockApi';
import { useNavigate } from 'react-router-dom';

// FIX: Renamed component from `FileUpload` to `UploadPage` to match filename and export.
const UploadPage: React.FC = () => {
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleFile = (selectedFile: File) => {
        const allowedTypes = ['application/pdf', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (selectedFile && allowedTypes.includes(selectedFile.type)) {
            setFile(selectedFile);
            setError('');
            setStatus('idle');
        } else {
            setError('Invalid file type. Please upload PDF, TXT, or DOCX.');
            setFile(null);
        }
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFile(e.dataTransfer.files[0]);
            e.dataTransfer.clearData();
        }
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFile(e.target.files[0]);
        }
    };

    const handleUpload = useCallback(async () => {
        if (!file) return;

        setStatus('uploading');
        setProgress(0);
        
        // Simulate progress
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 95) {
                    clearInterval(interval);
                    return 95;
                }
                return prev + 5;
            });
        }, 100);

        try {
            await uploadAndParseFile(file);
            clearInterval(interval);
            setProgress(100);
            setStatus('success');
            setTimeout(() => navigate('/contracts'), 1500);
        } catch (err) {
            clearInterval(interval);
            setStatus('error');
            setError('Upload failed. Please try again.');
        }
    }, [file, navigate]);

    const renderStatus = () => {
        switch (status) {
            case 'uploading':
                return (
                    <div className="w-full text-center">
                        <p className="mb-2 text-gray-600">Processing: {file?.name}</p>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-brand-primary h-2.5 rounded-full" style={{ width: `${progress}%`, transition: 'width 0.2s ease-in-out' }}></div>
                        </div>
                        <p className="mt-2 text-sm text-gray-500">Parsing & chunking document...</p>
                    </div>
                );
            case 'success':
                return <p className="text-green-600 font-semibold">Upload successful! Redirecting...</p>;
            case 'error':
                 return <p className="text-red-600 font-semibold">{error}</p>;
            default:
                return (
                     file ? (
                        <div className="text-center">
                            <p className="font-semibold text-gray-700">{file.name}</p>
                            <p className="text-sm text-gray-500">({(file.size / 1024).toFixed(2)} KB)</p>
                            <button onClick={handleUpload} className="mt-4 bg-brand-primary text-white font-bold py-2 px-6 rounded hover:bg-brand-secondary">
                                Start Analysis
                            </button>
                         </div>
                     ) : (
                        <div className="text-center text-gray-500">
                             <p>Drag & drop your file here</p>
                             <p className="my-2">or</p>
                             <label htmlFor="file-upload" className="cursor-pointer font-semibold text-brand-primary hover:text-brand-accent">
                                 Choose a file
                             </label>
                             <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf,.txt,.docx" />
                             <p className="text-xs mt-2">PDF, TXT, DOCX up to 10MB</p>
                        </div>
                     )
                );
        }
    };


    return (
        <div className="container mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Upload Contract</h1>
            <div
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`flex items-center justify-center w-full h-80 p-6 border-4 border-dashed rounded-lg transition-colors duration-200 ${isDragging ? 'border-brand-accent bg-blue-50' : 'border-gray-300 bg-white'}`}
            >
                {renderStatus()}
            </div>
        </div>
    );
};

export default UploadPage;