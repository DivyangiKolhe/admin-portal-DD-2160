import { IconButton, Modal, Snackbar } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { AiFillPlusCircle } from "react-icons/ai";
import ViewTutorial from "./ViewTutorial";
import api from "../../utils/api";
import { useNavigate } from 'react-router-dom';
import AddTutorial from './AddTutorial';

const AllTutorials = () => 
{
    const navigate=useNavigate();

    const [tutorials, setTutorials] = useState([]);
    const [tutorialsLoading, setTutorialsLoading] = useState(true);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    // Add Tutorial Modal
    const [openModal, setOpenModal] = useState(false);
    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);

    //View Tutorial Modal
    const [selectedTutorial, setSelectedTutorial] = useState(null);
    const [openViewModal, setOpenViewModal] = useState(false);
    const handleOpenViewModal = (tutorial) => {
        setSelectedTutorial(tutorial);
        setOpenViewModal(true);
    };
    const handleCloseViewModal = () => setOpenViewModal(false);

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
        setSnackbarMessage('');
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));

                if (!user || !user.authToken) 
                {
                    navigate('/login');
                    return;
                }

                const authTokenUser = user.authToken;

                const response = await api.get(`/tutorials`, {
                    headers: { Authorization: `Bearer ${authTokenUser}` }
                });

                setTutorials(response.data.data.tutorials);
            } catch (error) {
                console.error("Error fetching tutorials:", error);
            }
            finally {
                setTutorialsLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleDeleteTutorial = async (tutorialId) => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));

            if (!user || !user.authToken) {
                // Handle the case where authToken is not available (e.g., redirect or show an error message).
                return;
            }

            const authTokenUser = user.authToken;
            await api.delete(`/tutorials/${tutorialId}`, {
                headers: { Authorization: `Bearer ${authTokenUser}` },
            });

            setOpenViewModal(false);

            // Remove the deleted blog from the state or update the data from the backend.
            setTutorials(prevTut => prevTut.filter(tutorial => tutorial.id !== tutorialId));

            // Show a success snackbar
            setSnackbarMessage('Tutorial successfully deleted');
            setSnackbarOpen(true);
        } catch (error) {
            console.error("Error deleting tutorial:", error);
            // Show an error snackbar
            setSnackbarMessage('Error deleting tutorial');
            setSnackbarOpen(true);
        }
    };

    const addNewTutorial = (newTutorial) => {
        setTutorials([...tutorials, newTutorial]);
        setOpenModal(false);
      };

  return (
    <div className='flex flex-col gap-4 px-8 py-4 border rounded-lg bg-purple-100 overflow-auto'>
    <div className='title text-lg text-purple-900 font-extrabold'>Tutorials</div>
    <div className='flex flex-wrap gap-4 overflow-auto py-4'>
        <div className=' w-[150px] md:w-[200px] xl:w-[250px] h-[155px]  bg-white rounded-2xl text-6xl flex justify-center items-center'>
            <button className='text-slate-300' onClick={handleOpenModal}><AiFillPlusCircle /></button>
        </div>
        
        {tutorials?.length > 0 ?
            tutorials.map((item) => (
                <div key={item.id} onClick={() => handleOpenViewModal(item)} className='card cursor-pointer flex w-[150px] md:w-[200px] xl:w-[250px] h-[155px] rounded-2xl justify-start items-end p-3 md:text-xl text-white font-bold capitalize shadow-lg drop-shadow-lg bg-center bg-cover'
                    style={{
                        backgroundImage: `url(${item.thumbnailLink})`
                    }}>
                    <span className='drop-shadow-lg text-sm md:text-md lg:text-lg'>{item.name}</span>
                </div>
            )) :
            (tutorialsLoading ? <p>loading...</p> : <p></p>)}
    </div>
    {/* View Tutorial Modal */}
    {selectedTutorial && (
        <Modal open={openViewModal} onClose={handleCloseViewModal} className='flex items-center justify-center'>
            <div>
                <ViewTutorial tutorial={selectedTutorial} onClose={handleCloseViewModal} onDelete={handleDeleteTutorial} />
            </div>
        </Modal>
    )}
    {/* Add Tutorial Modal */}
    <Modal open={openModal} onClose={handleCloseModal} className='flex items-center justify-center'>
                <div>
                    <AddTutorial onClose={handleCloseModal} addTutorial={addNewTutorial}/>
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
  )
}

export default AllTutorials;