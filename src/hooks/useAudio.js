import { useEffect, useRef } from 'react';

const useAudio = (src) => {
  const audioRef = useRef(new Audio(src));

  useEffect(() => {
    const audio = audioRef.current;
    audio.loop = true;
    audio.volume = 0.5;

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [src]);

  const play = () => {
    audioRef.current.play();
  };

  const pause = () => {
    audioRef.current.pause();
  };

  const stop = () => {
    const audio = audioRef.current;
    audio.pause();
    audio.currentTime = 0;
  };

  return { play, pause, stop };
};

export default useAudio; 