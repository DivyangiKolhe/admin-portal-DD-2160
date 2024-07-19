import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import React, { useState } from 'react';
import { AiOutlineFolderAdd } from 'react-icons/ai';
import { useLocation } from 'react-router-dom';

const CreateFolder = () => {
    const location = useLocation();
    const { prefix } = location.state;

    // State to hold the folder name input value and loading state
    const [folderName, setFolderName] = useState('');
    const [loading, setLoading] = useState(false);
    const [folderCreated, setFolderCreated] = useState('');

    const removeTreeDataFromLocalStorage = () => {
        localStorage.removeItem('treeData'); // Remove the treeData from localStorage
    };

    const handleFolderCreation = async () => {
        if (!folderName) {
            console.error('Please enter a folder name.');
            return;
        }

        setLoading(true);
        try {
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

            let folderKey = '';
            if (prefix === '') {
                folderKey = folderName + '/';
            } else {
                folderKey = prefix.endsWith('/') ? prefix + folderName + '/' : prefix + '/' + folderName + '/';
            }

            const command = new PutObjectCommand({
                Bucket: bucketName,
                Key: folderKey,
                Body: '',
            });

            await client.send(command);
            console.log('Folder created successfully.');
            setFolderCreated(`${prefix}/${folderName}`); // Set folder created message

            removeTreeDataFromLocalStorage(); // Remove tree data after successful upload
        } catch (error) {
            console.error('Error creating folder:', error);
        } finally {
            setLoading(false);
            setFolderName(''); // Reset the folder name field after folder creation
        }
    };

    return (
        <div className='flex flex-col mx-2 md:mx-4 p-4 bg-gray-200'>
            <h1 className='text-2xl'>Create Folder</h1>
            <div className='mt-4'>
                <label htmlFor='folderName' className='block mb-2 font-bold text-gray-700'>
                    Folder Name
                </label>
                <div className='flex items-center'>
                    <input
                        type='text'
                        id='folderName'
                        value={folderName}
                        onChange={(e) => setFolderName(e.target.value)}
                        className='border border-gray-400 py-2 px-3 rounded-md mr-2 focus:outline-none focus:border-blue-500'
                        placeholder='Enter folder name...'
                    />
                    <button
                        onClick={handleFolderCreation}
                        className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
                        disabled={!folderName || loading} // Disable if folder name is empty or while loading
                    >
                        {loading ? 'Creating...' : 'Create'}
                    </button>
                </div>
                {folderCreated && (
                    <p className='mt-2 text-green-600'>
                        Folder created at: {folderCreated}
                    </p>
                )}
            </div>
        </div>
    );
};

export default CreateFolder;
