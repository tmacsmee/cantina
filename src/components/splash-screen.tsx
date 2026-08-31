import { useEffect } from 'react';
import { useScreenWipe } from '../hooks/use-screen-wipe';
import { useSounds } from '../hooks/use-sounds';
import { useAppLifecycle } from './app-lifecycle-provider';

export default function SplashScreen() {
  const { hasShownSplash, setHasShownSplash, setShowTitleIntro } =
    useAppLifecycle();
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
      setShowTitleIntro(true);
    }

    document.addEventListener('keydown', handleStart);

    return () => {
      document.removeEventListener('keydown', handleStart);
    };
  }, [
    wipeOut,
    playTitleSound,
    setHasShownSplash,
    hasShownSplash,
    setShowTitleIntro,
  ]);

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
        <span className="font-menu fill-mode-backwards text-stroke animate-start-text text-3xl text-white delay-2500 [--text-stroke-width:3px]">
          Press any key to start
        </span>
      </div>
    </div>
  );
}
