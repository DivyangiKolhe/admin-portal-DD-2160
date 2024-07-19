import React, { useState, useEffect } from "react";
import MasterYogaCard from "./MasterYogaCard";
import rehabAPI from "../../utils/rehab";
import { AiFillPlusCircle } from "react-icons/ai";
import AddMasterYoga from "./AddMasterYoga";
import {
    Modal,
    Button,
    Dialog,
    DialogTitle,
    DialogActions,
    Snackbar,
  } from "@mui/material";
const MasterYoga = () => {
  const [masterYogaData, setMasterYogaData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openMasterYogaModal, setMasterOpenYogaModal] = useState(false);
  const OpenMasterYogaModal = () => {
    setMasterOpenYogaModal(true);
  };

  const CloseMasterYogaModal = () => {
    setMasterOpenYogaModal(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));

        if (!user || !user.authToken) {
          console.log("User not authorized");
          return;
        }

        const authTokenUser = user.authToken;

        const response = await rehabAPI.get("/yoga/master-yoga", {
          headers: {
            Authorization: `Bearer ${authTokenUser}`,
          },
        });

        setMasterYogaData(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching master yoga data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="flex flex-col gap-4 px-8 py-4 border rounded-lg bg-purple-100 overflow-auto">
        <div className="title text-lg text-purple-900 font-extrabold">
          Master Yoga
              </div>
              <div className="flex flex-col items-center">
          <div className="w-[150px] md:w-[200px] xl:w-[250px] h-[150px] bg-white rounded-2xl text-6xl flex justify-center items-center">
            <button className="text-slate-300">
              <AiFillPlusCircle onClick={OpenMasterYogaModal} />
            </button>
          </div>
          <button
            className="mt-4 px-4 py-2 bg-purple-500 text-white rounded-md shadow-md hover:bg-purple-600 transition-colors duration-300"
            onClick={OpenMasterYogaModal}
          >
            Add
          </button>
        </div>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="flex flex-wrap gap-4 overflow-auto py-4">
            {masterYogaData.map((data, index) => (
              <MasterYogaCard key={index} data={data} />
            ))}
          </div>
        )}
          </div>
      {openMasterYogaModal && <Modal open={OpenMasterYogaModal} onClose={CloseMasterYogaModal}>
        <div>
        <AddMasterYoga onClose={CloseMasterYogaModal}/>
        </div>
    
      </Modal>}
    </>
  );
};

export default MasterYoga;
