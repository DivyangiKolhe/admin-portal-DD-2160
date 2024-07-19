import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import neurorehabAPI from "../../utils/neurorehab";
import { AiFillPlusCircle } from "react-icons/ai";
import ExerciseCard from "./ExerciseCard";
import AddExercise from "./AddExercise";
import { Modal } from "@mui/material";

const AllExercises = () => {
  const navigate = useNavigate();
  const [exercisesData, setExercisesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openExerciseModal, setOpenExerciseModal] = useState(false);
  const OpenExerciseModal = () => {
    setOpenExerciseModal(true);
  };

  const CloseExerciseModal = () => {
    setOpenExerciseModal(false);
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
        const response = await neurorehabAPI.get("/exercises", {
          headers: {
            Authorization: `Bearer ${authTokenUser}`,
          },
        });

        setExercisesData((prevData) => {
          const newData = response.data.data.exercises;
          return newData;
        });

        setLoading(false);
      } catch (error) {
        console.error("Error fetching Exercise data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="flex flex-col gap-4 px-8 py-4 border rounded-lg bg-purple-100 overflow-auto">
        <div className="title text-lg text-purple-900 font-extrabold">
          Exercises
        </div>
        <div className="flex flex-col items-center">
          <div className="w-[150px] md:w-[200px] xl:w-[250px] h-[150px] bg-white rounded-2xl text-6xl flex justify-center items-center">
            <button className="text-slate-300">
              <AiFillPlusCircle onClick={OpenExerciseModal} />
            </button>
          </div>
          <button
            className="mt-4 px-4 py-2 bg-purple-500 text-white rounded-md shadow-md hover:bg-purple-600 transition-colors duration-300"
            onClick={OpenExerciseModal}
          >
            Add
          </button>
        </div>
        {loading ? (
          <div>Loading...</div>
        ) : (
          !loading &&
          exercisesData &&
          Array.isArray(exercisesData) &&
          exercisesData.length > 0 && (
            <div className="flex flex-wrap gap-4 overflow-auto py-4">
              {exercisesData.map((exercise, index) => (
                <ExerciseCard key={exercise.id} data={exercise} />
              ))}
            </div>
          )
        )}
      </div>
      {openExerciseModal && (
        <Modal open={OpenExerciseModal} onClose={CloseExerciseModal}>
          <div>
            <AddExercise onClose={CloseExerciseModal} />
          </div>
        </Modal>
      )}
    </>
  );
};

export default AllExercises;
