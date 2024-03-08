import { cancion } from "@/types/types";
import { useState, useRef, useEffect } from "react";
import { FaPause, FaPlay, FaVolumeOff } from "react-icons/fa";
import { FaVolumeHigh, FaVolumeLow } from "react-icons/fa6";

export default function AudioPlayer({
  props,
  index,
  currentSongIndex,
  onAudioEnded,
  playlistPlay,
  volumenMaestro
}: {
  props: cancion;
  index: number;
  currentSongIndex: number;
  onAudioEnded: () => void;
  playlistPlay: boolean;
  volumenMaestro: any
}) {

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const currentTimeVisible = `${Math.floor(currentTime / 60)}:${(Math.floor(currentTime % 60) < 10 ? '0' : '') + Math.floor(currentTime % 60)}`;
  const [duration, setDuration] = useState<number>(1);
  const durationVisible = `${Math.floor(duration / 60)}:${(Math.floor(duration % 60) < 10 ? '0' : '') + Math.floor(duration % 60)}`;
  const [volumen, setVolumen] = useState<number>(volumenMaestro);
  const [isVolumenVisible, setIsVolumenVisible] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const volumenBarRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  useEffect(() => {
    const audioElement = document.getElementById(props.nombre) as HTMLAudioElement;
    setAudio(audioElement);
    setVolumen(volumenMaestro);
  }, [volumenMaestro])


  useEffect(() => {
    console.log("currentSongIndex, ", currentSongIndex, " index, ", index)
    const audioElement = document.getElementById(props.nombre) as HTMLAudioElement;
    setAudio(audioElement);
    audioElement.volume = volumen;

    if ((currentSongIndex === index) && playlistPlay) {
      setIsPlaying(true);
      audioElement.play();
    } else {
      setIsPlaying(false);
      audioElement.pause();
    }

    const handleTimeUpdate = () => {
      if (audioElement) {
        setCurrentTime(audioElement.currentTime);
        setDuration(audioElement.duration || 1);
      }
    };

    const handleVolumeUpdate = () => {
      if (audioElement) {
        setVolumen(audioElement.volume)
      }
    };

    const handleEnded = () => {
      if (audioElement) {
        setCurrentTime(0);
        setIsPlaying(false);
      }
      onAudioEnded();
    };

    audioElement?.addEventListener("timeupdate", handleTimeUpdate);
    audioElement?.addEventListener("volumechange", handleVolumeUpdate);
    audioElement?.addEventListener("ended", handleEnded)

    return () => {
      audioElement?.removeEventListener('timeupdate', handleTimeUpdate);
      audioElement?.removeEventListener('volumechange', handleVolumeUpdate);
      audioElement?.removeEventListener('ended', handleEnded);
    };

  }, [currentSongIndex, index, props, onAudioEnded, volumen]);

  const handleMouseDownPista = (event: React.MouseEvent<HTMLDivElement>) => {
    if (progressBarRef.current && audio) {
      setIsDragging(true);
      const progressBarRect = progressBarRef.current.getBoundingClientRect();
      const offsetX = event.clientX - progressBarRect.left;
      const newWidth = Math.min(Math.max(0, offsetX), progressBarRect.width);
      const newTime = (newWidth / progressBarRect.width) * duration;
      setCurrentTime(newTime);
      audio.currentTime = newTime;
    }
  };

  const handleMouseDownVolumen = (event: React.MouseEvent<HTMLDivElement>) => {
    if (volumenBarRef.current && audio) {
      setIsDragging(true);
      const volumenBarRect = volumenBarRef.current.getBoundingClientRect();
      const offsetX = event.clientX - volumenBarRect.left;
      const newWidth = Math.min(Math.max(0, offsetX), volumenBarRect.width);
      const newVolume = (newWidth / volumenBarRect.width);
      setVolumen(newVolume)
      audio.volume = newVolume
      console.log(volumen)
    }
  }

  const handleMouseMovePista = (event: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging && progressBarRef.current && audio) {
      const progressBarRect = progressBarRef.current.getBoundingClientRect();
      const offsetX = event.clientX - progressBarRect.left;
      const newWidth = Math.min(Math.max(0, offsetX), progressBarRect.width);
      const newTime = (newWidth / progressBarRect.width) * duration;
      setCurrentTime(newTime);
      audio.currentTime = newTime;
    }
  };

  const handleMouseMoveVolumen = (event: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging && volumenBarRef.current && audio) {
      const volumenBarRect = volumenBarRef.current.getBoundingClientRect();
      const offsetX = event.clientX - volumenBarRect.left;
      const newWidth = Math.min(Math.max(0, offsetX), volumenBarRect.width);
      const newVolume = (newWidth / volumenBarRect.width);
      setVolumen(newVolume);
      audio.volume = newVolume
      console.log(volumen)
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="p-4  w-full justify-center flex items-center">
      <audio src={`/${props.nombreArchivo}.mp3`} id={`${props.nombre}`} />
      <div className="mr-4 w-60">
        <div className=" overflow-auto transform marquee duration-500">
          <span>{index + 1}. {props.autor} - {props.nombre}</span>
        </div>
      </div>
      {isPlaying ? (
        <button className="mr-5" onClick={() => { setIsPlaying(false); audio?.pause(); }}>
          <FaPause size={20} />
        </button>
      ) : (
        <button className="mr-4" onClick={() => { setIsPlaying(true); audio?.play(); }}>
          <FaPlay size={20} />
        </button>
      )}
      <div
        ref={progressBarRef}
        className='h-3 w-1/5 mr-4 bg-gray-300 rounded-full cursor-pointer'
        onMouseDown={handleMouseDownPista}
        onMouseMove={handleMouseMovePista}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          className='bg-gray-800 h-3 rounded-full'
          style={{ width: `${(currentTime / duration) * 100}%` }}
        />
      </div>
      <div className='mr-3 w-24'>
        {currentTimeVisible} / {durationVisible}
      </div>
      <div className='flex items-center'>
        <div
          className={`cursor-pointer rounded-full p-2 ${isVolumenVisible ? 'bg-gray-300' : ''}`}
          onClick={() => setIsVolumenVisible(!isVolumenVisible)}>
          {volumen > 0.8 ? (
            <FaVolumeHigh size={15} />
          ) : volumen > 0.01 ? (
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
          <div className='h-3 bg-gray-800 rounded-full' style={{ width: `${volumen * 100}%` }} />
        </div>
      </div>
    </div>
  );

}