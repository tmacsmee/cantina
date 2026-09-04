import {
  createContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react';
import useSound from 'use-sound';
import cantinaMusic from '../assets/audio/cantina.ogg';
import menuBackSound from '../assets/audio/menu-back.wav';
import menuMoveSound from '../assets/audio/menu-move.wav';
import menuSelectSound from '../assets/audio/menu-select.wav';
import titleMusic from '../assets/audio/title.ogg';

type Sound = ReturnType<typeof useSound>;

type SoundContext = {
  volume: number;
  isMusicOn: boolean;
  setVolume: Dispatch<SetStateAction<number>>;
  setIsMusicOn: Dispatch<SetStateAction<boolean>>;
  sounds: Record<string, Sound>;
};

export const SoundContext = createContext<SoundContext | undefined>(undefined);

export default function SoundProvider({ children }: { children: ReactNode }) {
  const [volume, setVolume] = useState(5);
  const [isMusicOn, setIsMusicOn] = useState(true);

  const scaledVolume = volume / 30;
  const menuMove = useSound(menuMoveSound, { volume: scaledVolume });
  const menuSelect = useSound(menuSelectSound, { volume: scaledVolume });
  const menuBack = useSound(menuBackSound, { volume: scaledVolume });

  const title = useSound(titleMusic, {
    volume: isMusicOn ? scaledVolume : 0,
  });
  const cantina = useSound(cantinaMusic, {
    volume: isMusicOn ? scaledVolume : 0,
  });
  cantina[1].sound?.loop(true);

  const sounds = {
    menuMove,
    menuSelect,
    menuBack,
    title,
    cantina,
  };

  return (
    <SoundContext
      value={{
        volume,
        isMusicOn,
        setVolume,
        setIsMusicOn,
        sounds,
      }}
    >
      {children}
    </SoundContext>
  );
}
