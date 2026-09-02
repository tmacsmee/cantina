import { useEffect } from 'react';
import useSounds from '../hooks/use-sounds';
import { screenWipe } from '../lib/utils';
import { useAppLifecycle } from './app-lifecycle-provider';

export default function SplashScreen() {
  const { hasShownSplash, setHasShownSplash, setShowTitleIntro } =
    useAppLifecycle();
  const {
    sounds: {
      title: [playTitleMusic],
    },
  } = useSounds();

  useEffect(() => {
    function handleStart() {
      if (hasShownSplash) {
        return;
      }

      screenWipe(() => setHasShownSplash(true));

      setShowTitleIntro(true);
      playTitleMusic();
    }

    document.addEventListener('keydown', handleStart);

    return () => {
      document.removeEventListener('keydown', handleStart);
    };
  }, [playTitleMusic, setHasShownSplash, hasShownSplash, setShowTitleIntro]);

  if (hasShownSplash) {
    return;
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black">
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
