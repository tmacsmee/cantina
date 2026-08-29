import {
  createContext,
  useContext,
  useEffect,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react';
import { useScreenWipe } from './screen-wipe-provider';
import { useSounds } from './sound-provider';

type SplashContext = {
  hasShownSplash: boolean;
  setHasShownSplash: Dispatch<SetStateAction<boolean>>;
};

const SplashContext = createContext<SplashContext | undefined>(undefined);

export default function SplashScreenProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [hasShownSplash, setHasShownSplash] = useState(false);

  return (
    <SplashContext.Provider value={{ hasShownSplash, setHasShownSplash }}>
      {children}
    </SplashContext.Provider>
  );
}

export function SplashScreen() {
  const { hasShownSplash, setHasShownSplash } = useSplash();
  const { wipeIn, wipeOut } = useScreenWipe();
  const {
    titleSound: [playTitleSound],
  } = useSounds();

  useEffect(() => {
    if (hasShownSplash) {
      return;
    }

    wipeIn('left', 0);
  }, [hasShownSplash, wipeIn]);

  useEffect(() => {
    function handleStart() {
      if (hasShownSplash) {
        return;
      }

      wipeOut('right');
      playTitleSound();
      setHasShownSplash(true);
    }

    document.addEventListener('keydown', handleStart);

    return () => {
      document.removeEventListener('keydown', handleStart);
    };
  }, [wipeOut, playTitleSound, setHasShownSplash, hasShownSplash]);

  if (hasShownSplash) {
    return;
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center">
      <div className="flex-1" />
      <span className="font-menu animate-in fade-in fill-mode-backwards text-stroke text-5xl text-[#00befe] delay-1000 duration-1000 [--text-stroke-width:5px]">
        A long time ago in a galaxy far,
        <br />
        far away....
      </span>
      <div className="relative flex w-full flex-1 items-center justify-center">
        <span className="font-menu fill-mode-backwards text-stroke animate-start-text text-3xl text-white delay-2000 [--text-stroke-width:3px]">
          Press any key to start
        </span>
      </div>
    </div>
  );
}

export function useSplash() {
  const context = useContext(SplashContext);

  if (context === undefined) {
    throw new Error('useScreenWipe must be used within a SplashProvider');
  }

  return context;
}
