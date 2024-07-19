import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { AiOutlineFile, AiOutlineCopy, AiOutlineClose } from 'react-icons/ai';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

const UploadFile = () => {
    const location = useLocation();
    const { prefix } = location.state;

    const [uploadedUrls, setUploadedUrls] = useState([]);
    const [showSnackbar, setShowSnackbar] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isUploadEnabled, setIsUploadEnabled] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const removeTreeDataFromLocalStorage = () => {
        localStorage.removeItem('treeData'); // Remove the treeData from localStorage
    };

    //   const onDrop = (acceptedFiles) => {
    //     const uploadedFilesUrls = acceptedFiles.map((file) => URL.createObjectURL(file));
    //     setUploadedUrls(uploadedFilesUrls);
    //   };

    const onDrop = async (acceptedFiles) => {
        try {
            if (acceptedFiles.length === 0) {
                console.error('No files to upload.');
                return;
            }

            setSelectedFiles(acceptedFiles);
            setIsUploadEnabled(true); // Enable the upload button after files are dropped
            console.log('Files dropped:', acceptedFiles);
        } catch (error) {
            console.error('Error handling dropped files:', error);
        }
    };

    const handleFileRemove = (fileToRemove) => {
        const updatedFiles = selectedFiles.filter((file) => file !== fileToRemove);
        setSelectedFiles(updatedFiles);
        if (updatedFiles.length === 0) {
            setIsUploadEnabled(false); // Disable upload button if no files are selected
        }
    };

    const handleUpload = async () => {
        console.log('Selected files to upload:', selectedFiles);
        setIsUploading(true);

        try {
            if (selectedFiles.length === 0) {
                console.error('No files to upload.');
                return;
            }

            const accessKeyId = import.meta.env.VITE_AWS_ACCESS_KEY_ID;
            const secretAccessKey = import.meta.env.VITE_AWS_SECRET_ACCESS_KEY;
            const region = import.meta.env.VITE_AWS_REGION;
            const bucketName = import.meta.env.VITE_S3_BUCKET_NAME;

            const client = new S3Client({
                region,
                credentials: {
                    accessKeyId,
                    secretAccessKey,
                },
            });

            const uploadedFilesUrls = [];

            let acceptedFiles = selectedFiles;
            setSelectedFiles([]);

            for (const file of acceptedFiles) {
                let pathPrefix = prefix === '' ? '' : prefix + '/';
                if (prefix.endsWith('/')) {
                    pathPrefix = prefix; // If it's a folder, directly upload to that folder
                }

                const command = new PutObjectCommand({
                    Bucket: bucketName,
                    Key: pathPrefix + file.name,
                    Body: file,
                });

                await client.send(command);

                setIsUploadEnabled(false); // Disable the upload button till upload completes

                // Constructing the simulated URL for the uploaded file
                let simulatedFileUrl;
                if(bucketName==="assets.manastik.com")
                {
                    simulatedFileUrl = `https://${bucketName}/${pathPrefix}${file.name}`;
                }
                else
                {
                    simulatedFileUrl = `https://s3.${region}.amazonaws.com/${bucketName}/${pathPrefix}${file.name}`;
                }

                uploadedFilesUrls.push(simulatedFileUrl);
            }

            setUploadedUrls(uploadedFilesUrls); // Update uploaded URLs
            console.log('Files uploaded successfully.');

            removeTreeDataFromLocalStorage(); // Remove tree data after successful upload
        } catch (error) {
            console.error('Error uploading files:', error);
        }
        finally {
            setIsUploading(false); // Set uploading state to false after upload completes
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    const copyToClipboard = (url) => {
        navigator.clipboard.writeText(url).then(() => {
            setShowSnackbar(true);
        });
    };

    const handleCloseSnackbar = () => {
        setShowSnackbar(false);
    };

    return (
        <div className='flex flex-col mx-2 md:mx-4 p-4 bg-gray-200'>
            <div className='flex flex-wrap justify-between'>
                <h1 className='text-2xl'>Upload File</h1>
                <button
                    onClick={handleUpload}
                    disabled={!isUploadEnabled || isUploading} // Disable when not enabled or currently uploading
                    className={`bg-${isUploadEnabled ? 'green' : 'gray'}-500 text-white px-4 py-2 rounded hover:bg-${isUploadEnabled ? 'green' : 'gray'}-600 focus:outline-none disabled:bg-gray-400 disabled:cursor-not-allowed`}
                >
                    {isUploading ? 'Uploading...' : 'Upload'}
                </button>
            </div>
            <div
                {...getRootProps()}
                className={`dropzone border-2 border-dashed border-gray-300 rounded-lg p-8 mt-4 text-center ${isDragActive ? 'border-green-500 bg-green-100' : 'bg-gray-100'
                    }`}
            >
                <input {...getInputProps()} />
                {isDragActive ? (
                    <p>Drop the files here...</p>
                ) : (
                    <div>
                        <AiOutlineFile className='mx-auto text-4xl text-gray-400 mb-4' />
                        <p className='text-gray-500'>Drag 'n' drop some files here, or click to select files</p>
                    </div>
                )}
            </div>

            <div className='mt-4'>
                {selectedFiles.map((file, index) => (
                    <div key={index} className='flex items-center justify-between mt-2'>
                        <p>{file.name}</p>
                        <button
                            onClick={() => handleFileRemove(file)}
                            className='bg-red-500 text-white rounded-full px-2 py-1 focus:outline-none'
                        >
                            <AiOutlineClose />
                        </button>
                    </div>
                ))}
            </div>

            <div className='mt-4'>
                {uploadedUrls.map((url, index) => (
                    <div key={index} className='flex items-center justify-between mt-2'>
                        <a href={url} target='_blank' rel='noopener noreferrer' className='text-blue-600 underline'>
                            {url}
                        </a>
                        <button
                            onClick={() => copyToClipboard(url)}
                            className='bg-blue-500 text-white rounded px-4 py-2 focus:outline-none'
                        >
                            <AiOutlineCopy className='text-2xl' />
                        </button>
                    </div>
                ))}
            </div>

            <Snackbar open={showSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'left' }}>
                <MuiAlert onClose={handleCloseSnackbar} severity='success' sx={{ width: '100%' }}>
                    Link copied to clipboard!
                </MuiAlert>
            </Snackbar>
        </div>
    );
};

export default UploadFile;
