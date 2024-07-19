import React, { useEffect, useRef, useState } from 'react';
import { BsFillPlayCircleFill, BsFillPauseCircleFill } from 'react-icons/bs';
import { LiaDownloadSolid } from 'react-icons/lia';
import WaveSurfer from 'wavesurfer.js';

const formatTime = (durationInSeconds) => {
  const minutes = Math.floor(durationInSeconds / 60);
  const seconds = Math.floor(durationInSeconds % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const SongsPlayer = ({ img, audioUrl, title, artist }) => {
  const waveformRef = useRef(null);
  const wavesurferRef = useRef(null);
  const audioContextRef = useRef(null);

  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const createAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
  };

  useEffect(() => {
    const wavesurfer = WaveSurfer.create({
      container: waveformRef.current,
      backend: 'WebAudio',
      waveColor: '#c1c1c1',
      progressColor: '#9b4dcc',
      cursorWidth: 1,
      height: 60,
      barWidth: 2,
    });

    // Load the audio from the provided URL
    wavesurfer.load(audioUrl);

    // Store the wavesurfer instance in the ref
    wavesurferRef.current = wavesurfer;

    // Handle 'ready' event to set the duration
    wavesurfer.on('ready', () => {
      const audioDuration = wavesurfer.getDuration();
      setDuration(formatTime(audioDuration));
    });

    // Handle 'play' and 'pause' events to update the play state
    wavesurfer.on('play', () => {
      setIsPlaying(true);
    });

    wavesurfer.on('pause', () => {
      setIsPlaying(false);
    });

    return () => {
      wavesurfer.destroy();
    };
  }, [audioUrl]);

  const playAudio = () => {
    const wavesurfer = wavesurferRef.current;
    createAudioContext();
    if (wavesurfer.isPlaying()) {
      wavesurfer.pause();
    } else {
      wavesurfer.play();
    }
  };

  return (
    <div className="w-full flex justify-between">
      <div className="flex flex-row gap-8">
        <div className='flex justify-center items-center'>
        <img
          src={img}
          alt=""
          className="w-[3rem] h-[3rem] rounded-xl object-cover hidden xl:block"
        />
        </div>
        <button
          className="text-purple-700 text-4xl flex justify-center items-center"
          onClick={playAudio}
        >
          {isPlaying  ? (
            <BsFillPauseCircleFill />
          ) : (
            <BsFillPlayCircleFill />
          )}
        </button>
        <div className="flex flex-col justify-center items-start">
          <p className="text-md text-slate-700 font-bold">{title}</p>
          <p className="text-sm text-slate-400">{artist}</p>
        </div>
      </div>
      <div className='flex flex-row gap-4 md:gap-8 '>
        <p className='flex justify-center items-center'>{duration}</p>
        <div
          ref={waveformRef}
          className="w-[20vw] h-[60px] hidden md:block"
        />
        <button className='flex justify-center items-center text-xl text-slate-500'><LiaDownloadSolid /></button>
      </div>
    </div>
  );
};

export default SongsPlayer;