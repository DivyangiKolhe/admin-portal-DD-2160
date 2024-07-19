import React, { useState, useEffect } from "react";

import rehabAPI from "../../utils/rehab";
import { AiFillPlusCircle } from "react-icons/ai";

import { Modal } from "@mui/material";
import AddMasterExercises from "./AddMasterExercises";
import MasterExerciseCard from "./MasterExerciseCard";
import neurorehabAPI from "../../utils/neurorehab";
const MasterExercises = () => {
  const [masterExerciseData, setMasterExerciseData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openMasterExerciseModal, setMasterOpenExerciseModal] = useState(false);
  const OpenMasterExerciseModal = () => {
    setMasterOpenExerciseModal(true);
  };

  const CloseMasterExerciseModal = () => {
    setMasterOpenExerciseModal(false);
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

        const response = await neurorehabAPI.get("/master-exercises", {
          headers: {
            Authorization: `Bearer ${authTokenUser}`,
          },
        });

        setMasterExerciseData(response.data.data.masterExercises);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching master Exercise data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="flex flex-col gap-4 px-8 py-4 border rounded-lg bg-purple-100 overflow-auto">
        <div className="title text-lg text-purple-900 font-extrabold">
          Master Exercises
        </div>
        <div className="flex flex-col items-center">
          <div className="w-[150px] md:w-[200px] xl:w-[250px] h-[150px] bg-white rounded-2xl text-6xl flex justify-center items-center">
            <button className="text-slate-300">
              <AiFillPlusCircle onClick={OpenMasterExerciseModal} />
            </button>
          </div>
          <button
            className="mt-4 px-4 py-2 bg-purple-500 text-white rounded-md shadow-md hover:bg-purple-600 transition-colors duration-300"
            onClick={OpenMasterExerciseModal}
          >
            Add
          </button>
        </div>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="flex flex-wrap gap-4 overflow-auto py-4">
            {masterExerciseData.map((data, index) => (
              <MasterExerciseCard key={index} data={data} />
            ))}
          </div>
        )}
      </div>
      {openMasterExerciseModal && (
        <Modal
          open={OpenMasterExerciseModal}
          onClose={CloseMasterExerciseModal}
        >
          <div>
            <AddMasterExercises onClose={CloseMasterExerciseModal} />
          </div>
        </Modal>
      )}
    </>
  );
};

export default MasterExercises;
