import React from 'react'
import Quotes from '../../../components/MeditationRoutine/Quotes'
import Playlists from '../../../components/MusicTherapy/Playlists';
import Music from '../../../components/MeditationRoutine/Music'
import Blogs from '../../../components/MeditationRoutine/Blogs'
import Tutorials from '../../../components/MeditationRoutine/Tutorials'
import Exercises from '../../../components/MeditationRoutine/Exercises'

const MusicTherapy = () => {
  return (
    <div className='flex flex-col gap-4 px-8 py-7'>
   
       <Playlists />
 
    </div>
  )
}

export default MusicTherapy;