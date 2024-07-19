import React, { useState } from 'react';
import AllMoods from '../../../components/MusicTherapy/AllMoods';
import MoodFrequency from '../../../components/MusicTherapy/MoodFrequency';
import Songs from '../../../components/MusicTherapy/Songs';
import Playlists from '../../../components/MusicTherapy/Playlists';

const MusicMaster = () => {
  const [selectedFeature, setSelectedFeature] = useState('music');

  const handleFeatureChange = (event) => {
    setSelectedFeature(event.target.value);
  };

  return (
    <div className="flex flex-col gap-4 px-8 py-8">
      <div className='flex flex-row gap-4'>
        {/* <AllMoods /> */}
        {/* <MoodFrequency /> */}
        <select
          value={selectedFeature}
          onChange={handleFeatureChange}
          className="border border-purple-300 rounded-md px-3 py-2"
        >
          <option value="music">Music Therapy</option>
          <option value="meditation">Meditation Routines</option>
        </select>
      </div>
      <Playlists playlistFor={selectedFeature} />
      {/* <Songs /> */}
    </div>
  );
};

export default MusicMaster;
