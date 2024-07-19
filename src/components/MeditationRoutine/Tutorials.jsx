// Tutorials.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiFillPlusCircle } from "react-icons/ai";
import {
  Modal,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  Snackbar,
} from "@mui/material";
import ViewTutorial from "./ViewTutorial";
import rehabAPI from "../../utils/rehab";
import AddTutorial from "./AddTutorial";

const Tutorials = () => {
  const navigate = useNavigate();
  const [tutorials, setTutorials] = useState([]);
  const [tutorialsLoading, setTutorialsLoading] = useState(true);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [selectedTutorials, setSelectedTutorials] = useState(null);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  const handleOpenAddModal = () => {
    setOpenAddModal(true);
  };

  const handleCloseAddModal = () => {
    setOpenAddModal(false);
  };

  const handleOpenViewModal = (tutorial) => {
    setSelectedTutorials(tutorial);
    setOpenViewModal(true);
  };

  const handleCloseViewModal = () => {
    setSelectedTutorials(null);
    setOpenViewModal(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));

        if (!user || !user.authToken) {
          return;
        }

        const authTokenUser = user.authToken;

        const response = await rehabAPI.get(`/meditation-routine/tutorials`, {
          headers: { Authorization: `Bearer ${authTokenUser}` },
        });

        if (response.data && response.data.data) {
          setTutorials(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching tutorials:", error);
      } finally {
        setTutorialsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = (tutorialId) => {
    setConfirmDelete(tutorialId);
  };

  const deleteTutorial = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user || !user.authToken) {
        throw new Error("User or authToken not available");
      }

      const authTokenUser = user.authToken;

      await rehabAPI.delete(`/meditation-routine/tutorials/${confirmDelete}`, {
        headers: {
          Authorization: `Bearer ${authTokenUser}`,
        },
      });

      setDeleteSuccess(true);
      handleCloseViewModal();
      fetchData();
    } catch (error) {
      console.error("Error deleting tutorial:", error);
    } finally {
      setConfirmDelete(null);
    }
  };

  const renderDeleteConfirmation = () => {
    return (
      <Dialog
        open={confirmDelete !== null}
        onClose={() => setConfirmDelete(null)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogActions>
          <Button onClick={deleteTutorial}>Yes</Button>
          <Button onClick={() => setConfirmDelete(null)}>No</Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <div className="flex flex-col gap-4 px-8 py-4 border rounded-lg bg-purple-100">
      <div className="title text-lg text-purple-900 font-extrabold">
        Tutorials
      </div>
      <div className="flex flex-wrap gap-4 max-h-[50vh] overflow-auto py-4">
        <div className=" w-[150px] md:w-[200px] xl:w-[250px] h-[150px] bg-white rounded-2xl text-6xl flex justify-center items-center">
          <button className="text-slate-300">
            <AiFillPlusCircle onClick={handleOpenAddModal} />
          </button>
        </div>
        {tutorials && tutorials.length > 0 ? (
          tutorials.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-2 bg-white rounded-lg  w-[250px] h-[325px] p-4 justify-between"
            >
              <div
                className="h-[6rem] rounded-lg bg-center bg-cover"
                style={{
                  backgroundImage: `url(${item.thumbnailLink})`,
                  backgroundSize: "cover",
                }}
              />
              <div className="flex flex-col gap-1">
                <div className="text-purple-900 font-extrabold text-sm md:text-[15px] max-h-[90px]">
                  {item.name}
                </div>
              </div>
              <button
                className="bg-purple-700 text-white flex justify-center items-center rounded-lg py-2"
                onClick={() => handleOpenViewModal(item)}
              >
                Details
              </button>
            </div>
          ))
        ) : tutorialsLoading ? (
          <p>Loading...</p>
        ) : (
          <p>No tutorials available</p>
        )}
      </div>
      {/* View Tutorial Modal */}
      <Modal
        open={openViewModal}
        onClose={handleCloseViewModal}
        className="flex items-center justify-center"
      >
        <div>
          <ViewTutorial
            tutorials={selectedTutorials}
            onCloseModal={handleCloseViewModal}
            onDelete={handleDelete}
          />
        </div>
      </Modal>
      {/* Add Tutorial Modal */}
      <Modal open={openAddModal} onClose={handleCloseAddModal}>
        <div>
          <AddTutorial onClose={handleCloseAddModal} onDelete={handleDelete} />
        </div>
      </Modal>
      {renderDeleteConfirmation()}
      {/* Snackbar for delete success */}
      <Snackbar
        open={deleteSuccess}
        autoHideDuration={3000}
        onClose={() => setDeleteSuccess(false)}
        message="Tutorial deleted successfully"
      />
    </div>
  );
};

export default Tutorials;
