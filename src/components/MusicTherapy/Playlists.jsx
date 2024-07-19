import React, { useEffect, useState } from "react";
import { AiFillPlusCircle } from "react-icons/ai";
import { Modal } from "@mui/material";
import ViewPlaylist from "./ViewPlaylist";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import rehabAPI from "../../utils/rehab";
import AddPlaylist from "../MusicTherapy/AddPlaylist";
import { Alert, Snackbar } from "@mui/material";
const Playlists = () => {
  const [loading, setLoading] = useState(true);
  const [playlists, setPlaylists] = useState([]);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [playlistSongs, setPlaylistSongs] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const navigate = useNavigate();
  const handleOpenAddModal = () => {
    setOpenAddModal(true);
  };
  const handleCloseAddModal = () => {
    setOpenAddModal(false);
  };

  const handleOpenViewModal = async (playlist) => {
    setSelectedPlaylist(playlist);
    setOpenViewModal(true);

    try {
      const authToken = JSON.parse(localStorage.getItem("user")).authToken;

      const response = await rehabAPI.get(
        `/music-therapy/playlist/${playlist.id}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setPlaylistSongs(response.data.data.songs);
    } catch (error) {
      console.error("Error fetching playlist songs:", error);
    }
  };

  const handleCloseViewModal = () => setOpenViewModal(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));

        if (!user || !user.authToken) {
          navigate("/login");
          return;
        }

        const authToken = user.authToken;

        const response = await rehabAPI.get("/music-therapy/playlists/:type", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        setPlaylists(response.data.data);
        setSuccessMessage("playlist data fetched successfully");
        setSnackbarOpen(true);
      } catch (error) {
        console.error("Error fetching playlists:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  return (
    <div className="flex flex-col gap-4 px-8 py-4 border rounded-lg bg-purple-100">
      <div className="title text-lg text-purple-900 font-extrabold">
        Playlists
      </div>
      <div className="cards flex flex-wrap max-h-[45vh] overflow-auto py-4 gap-4">
        <div className=" w-[150px] md:w-[200px] xl:w-[250px] h-[150px]  bg-white rounded-2xl text-6xl flex justify-center items-center">
          <button className="text-slate-300" onClick={handleOpenAddModal}>
            <AiFillPlusCircle />
          </button>
        </div>
        {playlists.length > 0 ? (
          playlists.map((item) => (
            <div
              key={item.id}
              onClick={() => handleOpenViewModal(item)}
              className="card cursor-pointer h-[10vh] flex w-[150px] md:w-[200px] xl:w-[250px] h-[150px] rounded-2xl justify-start items-end p-3 md:text-xl text-white font-bold capitalize shadow-lg drop-shadow-lg"
              style={{
                backgroundImage: `url(${item.thumbnailLink})`,
                backgroundSize: "cover",
              }}
            >
              {item.name}
            </div>
          ))
        ) : loading ? (
          <p>Loading...</p>
        ) : (
          <p>No playlists found.</p>
        )}
      </div>
      {/* View Playlist Modal */}
      {selectedPlaylist && (
        <Modal
          open={openViewModal}
          onClose={handleCloseViewModal}
          className="flex items-center justify-center"
        >
          <div>
            <ViewPlaylist music={selectedPlaylist} songs={playlistSongs} />
          </div>
        </Modal>
      )}
      <Modal open={openAddModal} onClose={handleCloseAddModal}>
        <AddPlaylist onClose={handleCloseAddModal} />
      </Modal>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }} // Adjust position
      >
        <Alert severity="success" onClose={() => setSnackbarOpen(false)}>
          {successMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Playlists;
