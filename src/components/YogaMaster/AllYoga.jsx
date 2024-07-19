import React, { useState, useEffect } from "react";
import YogaCard from "./YogaCard";
import { useNavigate } from "react-router-dom";
import rehabAPI from "../../utils/rehab";
import { AiFillPlusCircle } from "react-icons/ai";
import AddYoga from "./AddYoga";
import {
    Modal,
    Button,
    Dialog,
    DialogTitle,
    DialogActions,
    Snackbar,
  } from "@mui/material";
const AllYoga = () => {
  const navigate = useNavigate();

  const [yogaData, setYogaData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openYogaModal, setOpenYogaModal] = useState(false);
  const OpenYogaModal = () => {
    setOpenYogaModal(true);
  };

  const CloseYogaModal = () => {
    setOpenYogaModal(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));

        if (!user || !user.authToken) {
          navigate("/login");
          return;
        }

        const authTokenUser = user.authToken;

        const response = await rehabAPI.get("/yoga", {
          headers: {
            Authorization: `Bearer ${authTokenUser}`,
          },
        });
        setYogaData(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching yoga data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="flex flex-col gap-4 px-8 py-4 border rounded-lg bg-purple-100 overflow-auto">
        <div className="title text-lg text-purple-900 font-extrabold">Yoga</div>
        <div className="flex flex-col items-center">
          <div className="w-[150px] md:w-[200px] xl:w-[250px] h-[150px] bg-white rounded-2xl text-6xl flex justify-center items-center">
            <button className="text-slate-300">
              <AiFillPlusCircle onClick={OpenYogaModal} />
            </button>
          </div>
          <button
            className="mt-4 px-4 py-2 bg-purple-500 text-white rounded-md shadow-md hover:bg-purple-600 transition-colors duration-300"
            onClick={OpenYogaModal}
          >
            Add
          </button>
        </div>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="flex flex-wrap gap-4 overflow-auto py-4">
            {yogaData.map((data, index) => (
              <YogaCard key={index} data={data} />
            ))}
          </div>
        )}
      </div>
      {openYogaModal && <Modal open={OpenYogaModal} onClose={CloseYogaModal}>
        <div>
        <AddYoga onClose={CloseYogaModal}/>
        </div>
       
      </Modal>}
    </>
  );
};

export default AllYoga;
