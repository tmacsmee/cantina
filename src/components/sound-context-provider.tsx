import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react';
import useSound from 'use-sound';
import menuBack from '../assets/audio/menu-back.wav';
import menuMove from '../assets/audio/menu-move.wav';
import menuSelect from '../assets/audio/menu-select.wav';

type Sound = ReturnType<typeof useSound>;

type SoundContext = {
  volume: number;
  isMusicOn: boolean;
  setVolume: Dispatch<SetStateAction<number>>;
  setIsMusicOn: Dispatch<SetStateAction<boolean>>;
  menuMoveSound: Sound;
  menuSelectSound: Sound;
  menuBackSound: Sound;
};

export const SoundContext = createContext<SoundContext | undefined>(undefined);

export function useSounds() {
  const context = useContext(SoundContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

export default function SoundContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [volume, setVolume] = useState(5);
  const [isMusicOn, setIsMusicOn] = useState(true);

  console.log(volume);

  const scaledVolume = volume / 10;
  const menuMoveSound = useSound(menuMove, { volume: scaledVolume });
  const menuSelectSound = useSound(menuSelect, { volume: scaledVolume });
  const menuBackSound = useSound(menuBack, { volume: scaledVolume });

  return (
    <SoundContext.Provider
      value={{
        volume,
        isMusicOn,
        setVolume,
        setIsMusicOn,
        menuMoveSound,
        menuSelectSound,
        menuBackSound,
      }}
    >
      {children}
    </SoundContext.Provider>
  );
}
