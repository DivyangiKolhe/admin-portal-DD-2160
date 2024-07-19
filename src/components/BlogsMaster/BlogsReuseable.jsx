import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton, Modal, Snackbar } from '@mui/material';
import { AiFillPlusCircle } from 'react-icons/ai';
import AddBlogs from './AddBlogs';
import ViewBlog from './ViewBlog';
// import { extractText } from "../shared/index";
import api from '../../utils/api';
import { stripHtmlTags } from '../..//utils/utils';

const BlogsReuseable = ({ blogFor }) => {
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState([]);
    const [blogsLoading, setBlogsLoading] = useState(true);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    // Add Blog Modal
    const [openModal, setOpenModal] = useState(false);
    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);

    // View Blog
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [openViewModal, setOpenViewModal] = useState(false);
    const handleOpenViewModal = (blog) => {
        setSelectedBlog(blog);
        setOpenViewModal(true);
    };
    const handleCloseViewModal = () => setOpenViewModal(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));

                if (!user || !user.authToken) {
                    // If authToken is not available, handle it accordingly (e.g., redirect or set an error state)
                    // console.log('User or authToken not available');
                    return;
                }

                const authTokenUser = user.authToken;

                const response = await api.get(`/blogs`, {
                    headers: { Authorization: `Bearer ${authTokenUser}` },
                    params: { blogType: blogFor },
                });

                setBlogs(response.data.data.blogs);
            } catch (error) {
                console.error("Error fetching blogs:", error);
            } finally {
                setBlogsLoading(false);
            }
        };

        fetchData();
    }, []);

    const addNewBlog = (newBlog) => {
        setBlogs([...blogs, newBlog]);
        setOpenModal(false);
      };

    const handleDeleteBlog = async (blogId) => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));

            if (!user || !user.authToken) {
                // Handle the case where authToken is not available (e.g., redirect or show an error message).
                return;
            }

            const authTokenUser = user.authToken;
            await api.delete(`/blogs/${blogId}`, {
                headers: { Authorization: `Bearer ${authTokenUser}` },
            });

            setOpenViewModal(false);

            // Remove the deleted blog from the state or update the data from the backend.
            setBlogs(prevBlogs => prevBlogs.filter(blog => blog.id !== blogId));

            // Show a success snackbar
            setSnackbarMessage('Blog successfully deleted');
            setSnackbarOpen(true);
        } catch (error) {
            console.error("Error deleting blog:", error);
            // Show an error snackbar
            setSnackbarMessage('Error deleting blog');
            setSnackbarOpen(true);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
        setSnackbarMessage('');
    };

    return (
        <div className='flex flex-col gap-4 px-8 py-4 border rounded-lg bg-purple-100'>
            <div className='title text-lg text-purple-900 font-extrabold capitalize'>{blogFor} Blogs</div>
            <div className='flex flex-wrap gap-4 max-h-[50vh] overflow-auto py-4'>
            <div className='w-[250px] h-[325px] bg-white rounded-2xl text-7xl flex justify-center items-center'>
                    <button className='text-slate-300' onClick={handleOpenModal}><AiFillPlusCircle /></button>
                </div>
                {blogs.length > 0 ? (
                    blogs.map((item) => (
                        <div key={item.id}  
                        className='flex flex-col gap-2 bg-white rounded-lg  w-[250px] h-[325px] p-4 justify-between'>
                            <div className='h-[6rem] rounded-lg bg-center bg-cover' style={{backgroundImage: `url(${item.imageUrl})`}} />
                            <div className='flex flex-col gap-1'>
                                <div className='text-purple-900 font-extrabold text-sm md:text-[15px] max-h-[90px]'>{item.title}</div>
                                <div className='text-purple-800 text-sm'>{stripHtmlTags(item.text).slice(0,65)}...</div>
                            </div>
                            <button className='bg-purple-700 text-white flex justify-center items-center rounded-lg py-2' onClick={() => handleOpenViewModal(item)}>Read More</button>
                        {/* <MusicCard
                            title={item.title}
                            img={item.imageUrl}
                            desc={item.text.slice(0, 50)}
                            onDeleteClick={() => handleDeleteBlog(item.id)} // Pass the delete function
                        /> */}
                        </div>
                    ))
                ) : (
                    blogsLoading ? <p>loading...</p> : <p></p>
                )}
            </div>
            {/* View Blog Modal */}
            {selectedBlog && (
                <Modal open={openViewModal} onClose={handleCloseViewModal} className='flex items-center justify-center'>
                    <div>
                        <ViewBlog blog={selectedBlog} blogFor={blogFor} onDelete={handleDeleteBlog} onClose={handleCloseViewModal} />
                    </div>
                </Modal>
            )}
            {/* Add Blog Modal */}
            <Modal open={openModal} onClose={handleCloseModal} className='flex items-center justify-center'>
                <div>
                    <AddBlogs addBlog={addNewBlog} blogFor={blogFor} onClose={handleCloseModal} />
                </div>
            </Modal>
            {/* Snackbar */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                message={snackbarMessage}
                action={
                    <IconButton size="small" aria-label="close" color="inherit" onClick={handleSnackbarClose}>
                        <span>&times;</span>
                    </IconButton>
                }
            />
        </div>
    );
};

export default BlogsReuseable;
