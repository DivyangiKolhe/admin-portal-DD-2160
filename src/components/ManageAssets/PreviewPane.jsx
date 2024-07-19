import React, { useEffect, useState } from 'react';
import { Page, Document, pdfjs } from 'react-pdf';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
// Ace Editor
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';
import { AiOutlineFile, AiOutlineCopy, AiOutlineClose } from 'react-icons/ai';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

const PreviewPane = ({ fileUrl }) => {

    const [initialData, setInitialData] = useState('');
    const [loading, setLoading] = useState(true);
    const [isModified, setIsModified] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const s3BucketName = import.meta.env.VITE_S3_BUCKET_NAME;
    // console.log(s3BucketName);

    // Function to replace S3 URL with custom domain
    const transformFileUrl = (url, bucketName) => {
        const s3Pattern = new RegExp(`s3\\.\\w+\\.amazonaws\\.com/${bucketName}`, 'i');
        return url.replace(s3Pattern, bucketName);
    };

    const shouldTransform = s3BucketName === "assets.manastik.com";
    const updatedFileUrl = shouldTransform ? fileUrl.replace(`s3.${import.meta.env.VITE_AWS_REGION}.amazonaws.com/`,"") : fileUrl;

    // Function to get file extension from URL
    const getFileExtension = (url) => {
        return url.split('.').pop().toLowerCase();
    };

    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [showSnackbar, setShowSnackbar] = useState(false);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    const handleNextPage = () => {
        setPageNumber((prevPageNumber) => prevPageNumber + 1);
    };

    const handlePrevPage = () => {
        setPageNumber((prevPageNumber) => prevPageNumber - 1);
    };

    useEffect(() => {
        pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

        return () => {
            // Cleanup if necessary
        };
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch(fileUrl);
                const data = await response.text();
                setInitialData(data);
            } catch (error) {
                console.error('Error fetching file:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
        setIsModified(false);
    }, [fileUrl]);

    // Function to handle AceEditor content change
    const handleEditorChange = (newValue) => {
        setInitialData(newValue); // Update AceEditor content
        setIsModified(true); // Set modified flag when content changes
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const client = new S3Client({
                region: import.meta.env.VITE_AWS_REGION,
                credentials: {
                    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
                    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
                },
            });

            const updatedContent = initialData;
            const key = fileUrl.split(`/${import.meta.env.VITE_S3_BUCKET_NAME}/`)[1];
            console.log(key);

            const params = {
                Bucket: import.meta.env.VITE_S3_BUCKET_NAME,
                Key: key,
                Body: updatedContent,
            };

            const uploadResult = await client.send(new PutObjectCommand(params));
            console.log('File saved:', uploadResult);
            setSnackbarMessage('File saved successfully!');
            setShowSnackbar(true); 
            setIsModified(false); 
        } catch (error) {
            console.error('Error saving file:', error);
            // Handle error accordingly, show error message, etc.
        } finally {
            setLoading(false);
        }
    };

    // Function to render components based on file type
    const renderFilePreview = (fileType) => {
        if (fileType === 'png' || fileType === 'jpg' || fileType === 'jpeg' || fileType === 'gif') {
            return <img src={fileUrl} alt="imagePreview" />;
        } else if (fileType === 'mp4' || fileType === 'webm' || fileType === 'ogg') {
            return <video controls src={fileUrl} />;
        } else if (fileType === 'mp3' || fileType === 'wav' || fileType === 'ogg') {
            return <audio controls src={fileUrl} />;
        } else if (fileType === 'pdf') {
            // Render PDF viewer component
            return (
                <div className="relative mx-auto">
                    <FaArrowLeft
                        onClick={handlePrevPage}
                        disabled={pageNumber <= 1}
                        className={`absolute z-50 top-1/2 left-4 text-2xl transform -translate-y-1/2 cursor-pointer ${pageNumber <= 1 ? 'pointer-events-none text-gray-300' : ''
                            }`}
                    />
                    <FaArrowRight
                        onClick={handleNextPage}
                        disabled={pageNumber >= numPages}
                        className={`absolute z-50 top-1/2 right-4 text-2xl transform -translate-y-1/2 cursor-pointer ${pageNumber >= numPages ? 'pointer-events-none text-gray-300' : ''
                            }`}
                    />
                    <Document file={fileUrl} onLoadSuccess={onDocumentLoadSuccess} options={{ width: 500 }}>
                        <Page pageNumber={pageNumber} width={500} />
                    </Document>
                    <div className="text-center">
                        <p>
                            Page {pageNumber} of {numPages}
                        </p>
                    </div>
                </div>
            );
        } else {

            // For JSON, text, or code files (editable)
            const renderSaveButton = fileType === 'json' || fileType === 'txt';
            const saveButton = (
                <button onClick={handleSave} className='bg-green-500 text-white rounded p-2 focus:outline-none'>
                    Save
                </button>
            );

            return loading ? <p>Loading...</p> : (<div className='flex flex-col'>
                {renderSaveButton && isModified && saveButton}
                <AceEditor
                    mode='json'
                    theme='monokai'
                    name='edit_json_objects'
                    editorProps={{ $blockScrolling: true }}
                    width='100%'
                    fontSize={14}
                    value={initialData}
                    onChange={handleEditorChange}
                    showPrintMargin={false}
                    showGutter={true}
                    highlightActiveLine={true}
                    setOptions={{
                        showLineNumbers: true,
                        tabSize: 2,
                        wrap: false,
                    }}
                />
                </div>
            );
        }
    };

    const fileType = getFileExtension(fileUrl);

    const copyToClipboard = (url) => {
        navigator.clipboard.writeText(url).then(() => {
            setSnackbarMessage('Link copied to clipboard!');
            setShowSnackbar(true);
        });
    };

    const handleCloseSnackbar = () => {
        setShowSnackbar(false);
    };

    return (
        <div className='flex flex-col gap-2'>
            <h1 className='text-xl font-bold text-slate-700'>Preview Pane</h1>
            <div className='flex gap-2'>
                <p className='text-slate-500 font-bold'>Link:</p>
                <a href={fileUrl}><span className='text-sm text-slate-500 underline'>{fileUrl}</span></a>
            </div>
            <div className='flex gap-2'>
                <a href={fileUrl}><span className='text-sm text-slate-500 underline'>{updatedFileUrl}</span></a>
                <button
                    onClick={() => copyToClipboard(updatedFileUrl)}
                    className='bg-blue-500 text-white rounded p-2 focus:outline-none'
                >
                    <AiOutlineCopy className='text-lg' />
                </button>
            </div>
            {renderFilePreview(fileType)}

            <Snackbar open={showSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'left' }}>
                <MuiAlert onClose={handleCloseSnackbar} severity='success' sx={{ width: '100%' }}>
                {snackbarMessage}
                </MuiAlert>
            </Snackbar>
        </div>
    );
};

export default PreviewPane;
