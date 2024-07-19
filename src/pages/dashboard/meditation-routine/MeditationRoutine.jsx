import React from 'react'
import Quotes from '../../../components/MeditationRoutine/Quotes'
import Playlists from '../../../components/MeditationRoutine/Playlists';
import Music from '../../../components/MeditationRoutine/Music'
import Blogs from '../../../components/MeditationRoutine/Blogs'
import Tutorials from '../../../components/MeditationRoutine/Tutorials'
import Exercises from '../../../components/MeditationRoutine/Exercises'

const MeditationRoutine = () => {
  return (
    <div className='flex flex-col gap-4 px-8 py-7'>
      {/* <Quotes /> */}
       <Playlists />
      <Blogs />
      <Tutorials />
      {/*<Exercises />*/}
     { /*<Music />*/}
    </div>
  )
}

export default MeditationRoutine