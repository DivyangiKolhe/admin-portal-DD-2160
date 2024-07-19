import React from "react";
import AllYoga from "../../../components/YogaMaster/AllYoga";
import MasterYoga from "../../../components/YogaMaster/MasterYoga";

const YogaMaster = () => {
  return (
    <div className="flex flex-col gap-4 p-8">
      <MasterYoga />
      <AllYoga />
    </div>
  );
};

export default YogaMaster;
