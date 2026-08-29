import { useEffect } from 'react';

export default function SplashScreen({ onStart }: { onStart: () => void }) {
  useEffect(() => {
    document.addEventListener('keydown', onStart);

    return () => {
      document.removeEventListener('keydown', onStart);
    };
  }, [onStart]);

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
