"use client"

import AudioPlayer from '@/components/audioPlayer';
import { canciones } from '@/database/songs';
import { cancion } from '@/types/types';
import { useEffect, useState, useRef } from 'react';
import { FaPlay, FaPause, FaVolumeHigh, FaVolumeLow, FaVolumeOff } from 'react-icons/fa6';
import { IoPlayForward } from "react-icons/io5";


export default function Home() {

  const listaCanciones: cancion[] = canciones;
  const [isVolumenVisible, setIsVolumenVisible] = useState(false);
  const [playlistPlay, setPlaylistPlay] = useState<boolean>(false);
  const [currentSongIndex, setCurrentSongIndex] = useState<number>(0);
  const [volumenMaestro, setVolumenMaestro] = useState<number>(0.9);
  const volumenBarRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);


  const handleMouseDownVolumen = (event: React.MouseEvent<HTMLDivElement>) => {

    if (volumenBarRef.current) {
      setIsDragging(true);
      const volumenBarRect = volumenBarRef.current.getBoundingClientRect();
      const offsetX = event.clientX - volumenBarRect.left;
      const newWidth = Math.min(Math.max(0, offsetX), volumenBarRect.width);
      const newVolume = (newWidth / volumenBarRect.width);
      setVolumenMaestro(newVolume)
    }
  }

  const handleMouseMoveVolumen = (event: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging && volumenBarRef.current) {
      const volumenBarRect = volumenBarRef.current.getBoundingClientRect();
      const offsetX = event.clientX - volumenBarRect.left;
      const newWidth = Math.min(Math.max(0, offsetX), volumenBarRect.width);
      const newVolume = (newWidth / volumenBarRect.width);
      setVolumenMaestro(newVolume);
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  console.log(listaCanciones)

  return (
    <div className='w-full'>
      <div className='flex justify-center border-b border-gray-200 p-2'>
        <span className='mr-4'>{playlistPlay ? "Pausar" : "Reproducir"} Playlist</span>
        <button type='button' onClick={() => setPlaylistPlay(!playlistPlay)}>
          {
            playlistPlay ? <FaPause size={21} /> : <FaPlay size={21} />
          }
        </button>
        <button type='button' onClick={() => setCurrentSongIndex(+1)}>
          <IoPlayForward size={21}/>
        </button>
        <div className='flex items-center'>
          <div
            className={`cursor-pointer rounded-full p-2 ${isVolumenVisible ? 'bg-gray-300' : ''}`}
            onClick={() => setIsVolumenVisible(!isVolumenVisible)}>
            {volumenMaestro > 0.8 ? (
              <FaVolumeHigh size={15} />
            ) : volumenMaestro > 0.01 ? (
              <FaVolumeLow size={15} />
            ) : (
              <FaVolumeOff size={15} />
            )}
          </div>
          <div
            className={`h-3 w-24 ml-4 bg-gray-300 rounded-full cursor-pointer ${isVolumenVisible ? "" : "invisible"}`}
            ref={volumenBarRef}
            onMouseDown={handleMouseDownVolumen}
            onMouseMove={handleMouseMoveVolumen}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}>
            <div className='h-3 bg-gray-800 rounded-full' style={{ width: `${volumenMaestro * 100}%` }} />
          </div>
        </div>
      </div>

      {listaCanciones.map((cancion, index) => {
        return (
          <div key={index}>
            <AudioPlayer
              volumenMaestro={volumenMaestro}
              props={cancion}
              index={index}
              currentSongIndex={currentSongIndex}
              playlistPlay={playlistPlay}
              onAudioEnded={() => {
                setCurrentSongIndex((prevIndex) =>
                  prevIndex === listaCanciones.length - 1 ? 0 : prevIndex + 1
                );
              }}
            />
          </div>
        )
      })}
    </div >
  )
}
