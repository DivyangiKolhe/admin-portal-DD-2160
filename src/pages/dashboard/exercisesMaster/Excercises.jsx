import React from "react";
import AllExercises from "../../../components/Exercises/AllExcercises";
import MasterExercises from "../../../components/Exercises/MasterExercises";

const Exercises = () => {
  return (
    <div className="flex flex-col gap-4 p-8">
      <MasterExercises />
       <AllExercises />
    </div>
  );
};

export default Exercises;
