import React from 'react';
import { AiOutlinePlusCircle, AiOutlineSearch } from 'react-icons/ai';
import { FaFilter } from "react-icons/fa";
import SongsPlayer from '../shared/SongsPlayer';

const Music = () => {
    return (
        <div className='flex flex-col gap-4 border rounded-lg p-8'>
            {/* upper div */}
            <div className='flex justify-between'>
                <div className='title text-lg text-purple-900 font-extrabold'>Music</div>
                <div className='flex flex-row gap-4'>
                    {/* search bar */}
                    <div className="flex items-center border rounded-3xl px-3 py-2 text-sm text-slate-700 font-bold">
                        <button className="text-gray-500">
                            <AiOutlineSearch />
                        </button>
                        <input
                            type="text"
                            className="w-full focus:outline-none ml-2"
                            placeholder="Search"
                        />
                    </div>
                    {/* filter button */}
                    <button className='flex flex-row gap-2 text-sm justify-center items-center border rounded-3xl px-3 py-2'>Filter <FaFilter /></button>
                </div>
            </div>
            {/* lower div */}
            <div className='flex flex-col gap-8 mt-4 overflow-auto max-h-[60vh]'>
            <SongsPlayer img={"https://s3.ap-south-1.amazonaws.com/assets.manastik.com/music-therapy/playlistThumbnail/90s_songs.png"} title={"Song"} artist={"artist"} audioUrl={"https://s3.ap-south-1.amazonaws.com/assets.manastik.com/audioFile/musicTherapy/Baanwra+Mann+-+Female+-+Hazaaron+Khwaishein+Aisi_1696962247461.mp3"} />
                <SongsPlayer img={"https://s3.ap-south-1.amazonaws.com/assets.manastik.com/music-therapy/playlistThumbnail/90s_songs.png"} title={"Song"} artist={"artist"} audioUrl={"https://s3.ap-south-1.amazonaws.com/assets.manastik.com/audioFile/musicTherapy/Baanwra+Mann+-+Female+-+Hazaaron+Khwaishein+Aisi_1696962247461.mp3"} />
                <SongsPlayer img={"https://s3.ap-south-1.amazonaws.com/assets.manastik.com/music-therapy/playlistThumbnail/90s_songs.png"} title={"Song"} artist={"artist"} audioUrl={"https://s3.ap-south-1.amazonaws.com/assets.manastik.com/audioFile/musicTherapy/Baanwra+Mann+-+Female+-+Hazaaron+Khwaishein+Aisi_1696962247461.mp3"} />
                <SongsPlayer img={"https://s3.ap-south-1.amazonaws.com/assets.manastik.com/music-therapy/playlistThumbnail/90s_songs.png"} title={"Song"} artist={"artist"} audioUrl={"https://s3.ap-south-1.amazonaws.com/assets.manastik.com/audioFile/musicTherapy/Baanwra+Mann+-+Female+-+Hazaaron+Khwaishein+Aisi_1696962247461.mp3"} />
                <SongsPlayer img={"https://s3.ap-south-1.amazonaws.com/assets.manastik.com/music-therapy/playlistThumbnail/90s_songs.png"} title={"Song"} artist={"artist"} audioUrl={"https://s3.ap-south-1.amazonaws.com/assets.manastik.com/audioFile/musicTherapy/Baanwra+Mann+-+Female+-+Hazaaron+Khwaishein+Aisi_1696962247461.mp3"} />
            </div>
            <button className='border rounded-3xl flex justify-center items-center gap-2 w-[40vw] mx-auto bg-slate-100 py-1'>
                Add <AiOutlinePlusCircle />
            </button>
        </div>
    )
}

export default Music;