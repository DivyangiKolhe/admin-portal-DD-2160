import React, { useEffect, useState } from 'react';
import { IoMdRefresh } from "react-icons/io";
import { PiCopy } from "react-icons/pi";
import { MdArrowBack, MdOpenInNew } from "react-icons/md";
import { IoMdCloudUpload } from 'react-icons/io';
import { AiOutlineFolderAdd } from 'react-icons/ai';
import { AiOutlineFile, AiOutlineFolder } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { getTree } from '../../services/S3Service';
import PreviewPane from './PreviewPane';

const S3Management = () => {

    const navigate = useNavigate();

    const [tree, setTree] = useState({});
    const [currentNode, setCurrentNode] = useState(tree);
    const [prefix, setPrefix] = useState(''); // State to manage the prefix
    const [previewUrl, setPreviewUrl] = useState('');
    const [refreshFlag, setRefreshFlag] = useState(false);

    useEffect(() => {
        async function fetchData() {
            const treeData = await getTree(); // Assuming getTree fetches the tree structure
            setTree(treeData);
            setCurrentNode(treeData);
        }
        fetchData();
    }, [refreshFlag]);

    const handleAddFileClick = () => {
        navigate('/manage-assets/upload', { state: { prefix } });
    }

    const handleCreateFolderClick = () => {
        navigate('/manage-assets/create-folder', { state: { prefix } });
    }

    const handleFileClick = (fileDetails) => {
        const { url } = fileDetails;
        // Process the file details or pass the URL to another component
        setPreviewUrl(url); // Assuming you have state to hold the preview URL
    };

    const handleNodeClick = (key) => {
        const clickedNode = currentNode.children[key];

        if (clickedNode.isFile) {
            const fileUrl = `https://s3.${import.meta.env.VITE_AWS_REGION}.amazonaws.com/${import.meta.env.VITE_S3_BUCKET_NAME}/${prefix ? prefix + '/' : ''}${clickedNode.key}`;
            setPreviewUrl(fileUrl); // Assuming you have a state variable to hold the preview URL
        } else {
            setCurrentNode(clickedNode);
            setPrefix((prevPrefix) => {
                return prevPrefix ? `${prevPrefix}/${key}` : key;
            });
        }
    };

    const handleGoBack = () => {
        // Assuming root node doesn't have a parent
        if (prefix !== '') {
            const parts = prefix.split('/');
            parts.pop();
            const newPrefix = parts.join('/');
            setPrefix(newPrefix);
            // Traverse back in the tree to the parent node
            let parentNode = tree;
            parts.forEach((part) => {
                if (parentNode.children && parentNode.children[part]) {
                    parentNode = parentNode.children[part];
                }
            });
            setCurrentNode(parentNode);
        }
    };

    const removeTreeDataFromLocalStorage = () => {
        localStorage.removeItem('treeData'); // Remove the treeData from localStorage
        setRefreshFlag(prevFlag => !prevFlag);
    };

    return (
        <div className='flex flex-col mx-2 md:mx-4 p-4 bg-gray-200'>
            {/* breadcrumb */}

            <h1 className='text-2xl'>{prefix || import.meta.env.VITE_S3_BUCKET_NAME}</h1>

            <div className='flex flex-col mt-4 border border-gray-500 border-1 shadow-lg p-4'>
                <p className='text-xl font-bold'>Objects (23)</p>

                {/* buttons */}
                <div className='flex flex-wrap gap-3 mt-4'>
                    <button onClick={handleGoBack} className='flex justify-center items-center border border-gray-500 border-1 py-1 px-3 gap-2'>
                        <MdArrowBack className='text-2xl text-gray-500' /> <span>Go Back</span>
                    </button>
                    <button onClick={removeTreeDataFromLocalStorage} className='flex justify-center items-center border border-gray-500 border-1 py-1 px-3 gap-2'>
                        <IoMdRefresh className='text-2xl text-gray-500' />
                    </button>
                    {/* <button className='flex justify-center items-center border border-gray-500 border-1 py-1 px-3 gap-2'>
                        <PiCopy className='text-2xl text-gray-500' /> <span>Copy S3 URI</span>
                    </button>
                    <button className='flex justify-center items-center border border-gray-500 border-1 py-1 px-3 gap-2'>
                        <PiCopy className='text-2xl text-gray-500' /> <span>Copy URL</span>
                    </button>
                    <button className='flex justify-center items-center border border-gray-500 border-1 py-1 px-3 gap-2'>
                        <MdOpenInNew className='text-2xl text-gray-500' /><span>Open</span>
                    </button> */}
                    <button onClick={handleAddFileClick} className='flex justify-center items-center border border-gray-500 border-1 py-1 px-3 gap-2'>
                        <IoMdCloudUpload className='text-2xl text-gray-500' /><span>Add File</span>
                    </button>
                    <button onClick={handleCreateFolderClick} className='flex justify-center items-center border border-gray-500 border-1 py-1 px-3 gap-2'>
                        <AiOutlineFolderAdd className='text-2xl text-gray-500' /><span>Create Folder</span>
                    </button>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 mt-4'>
                    {/* directory structure */}
                    <div className='flex flex-col'>
                        <p>Current Prefix: {prefix}</p>
                        <ul className='flex flex-wrap gap-4 mt-4'>
                            {Object.keys(currentNode.children || {}).map((key) => {
                                const node = currentNode.children[key];
                                const hasChildren = Object.keys(node.children || {}).length > 0;

                                // Skip rendering empty folders/files
                                if (!key || (node.isFile && node.fileData.Size === 0 && !hasChildren)) {
                                    return null;
                                }

                                return (
                                    <li key={key} onClick={() => handleNodeClick(key)} className='cursor-pointer rounded py-2 px-4 mb-2 '>
                                        {node.isFile ? (
                                            <div className='flex justify-center items-center gap-2'>
                                                <AiOutlineFile className='text-3xl text-blue-500' /> {/* File icon */}
                                                <span className='text-sm'>{key}</span>
                                            </div>
                                        ) : (
                                            <div className='flex justify-center items-center gap-2'>
                                                <AiOutlineFolder className='text-3xl text-yellow-500' /> {/* Folder icon */}
                                                <span className='text-sm'>{key}</span>
                                            </div>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>

                    </div>
                    {/* preview pane */}
                    <div className='mt-4 md:mt-0'>
                        <PreviewPane fileUrl={previewUrl} />
                    </div>
                </div>

            </div>

        </div>
    )
}

export default S3Management;