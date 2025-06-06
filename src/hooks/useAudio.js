import { useEffect, useRef, useState } from 'react';

const useAudio = (src) => {
  const audioRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const audio = new Audio(src);
    audio.loop = true;
    audio.volume = 0.5;

    audio.addEventListener('canplaythrough', () => {
      setIsReady(true);
    });

    audio.addEventListener('error', (e) => {
      console.warn(`Error al cargar el audio ${src}:`, e);
      setIsReady(false);
    });

    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.currentTime = 0;
      audio.removeEventListener('canplaythrough', () => {});
      audio.removeEventListener('error', () => {});
    };
  }, [src]);

  const play = () => {
    if (audioRef.current && isReady) {
      audioRef.current.play().catch(error => {
        console.warn('Error al reproducir audio:', error);
      });
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  return { play, pause, stop, isReady };
};

export default useAudio; 