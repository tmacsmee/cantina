import { useProgress } from '@react-three/drei';
import { createFileRoute } from '@tanstack/react-router';
import { Suspense, useEffect, useState } from 'react';
import Game from '../components/game';
import Hud from '../components/hud';
import Menu from '../components/pause-menu';
import useSounds from '../hooks/use-sounds';
import { cn } from '../lib/utils';

export const Route = createFileRoute('/play')({
  component: RouteComponent,
});

function RouteComponent() {
  const [isPaused, setIsPaused] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const {
    sounds: {
      menuSelect: [playMenuSelect],
      menuBack: [playMenuBack],
      cantina: [playCantina, { stop }],
    },
  } = useSounds();

  useEffect(() => {
    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === 'Escape' && !isPaused) {
        playMenuSelect();
        setIsPaused((prev) => !prev);
      }
    }

    window.addEventListener('keydown', handleEscapeKey);

    return () => {
      window.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isPaused, playMenuSelect]);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    playCantina();
    return () => stop();
  }, [isReady, playCantina, stop]);

  function handleMenuOpenChange(isOpen: boolean) {
    if (!isOpen) {
      playMenuBack();
    }

    setIsPaused(isOpen);
  }

  function handleReady() {
    setIsReady(true);
  }

  return (
    <div className="h-screen">
      <Suspense fallback={null}>
        <Game isPaused={isPaused} onReady={handleReady} />
      </Suspense>
      <Menu open={isPaused} onOpenChange={handleMenuOpenChange} />
      <Hud />
      <LoadingScreen isReady={isReady} />
    </div>
  );
}

function LoadingScreen({ isReady }: { isReady: boolean }) {
  const [fadeFinished, setFadeFinished] = useState(false);

  return (
    <div
      className={cn(
        'fixed inset-0 flex flex-col items-center justify-center bg-black',
        fadeFinished && 'animate-out fade-out fill-mode-forwards duration-1000',
      )}
    >
      <div
        className={cn(
          'relative -mb-6 -ml-26 size-36 duration-2000',
          isReady
            ? 'animate-out fade-out fill-mode-forwards delay-2000'
            : 'animate-in slide-in-from-left fill-mode-backwards fade-in delay-1000',
        )}
        onAnimationEnd={() => {
          if (isReady) {
            setFadeFinished(true);
          }
        }}
      >
        <img src="/blue_ring.png" className="absolute size-full" />
        <img src="/quigonjinn.png" className="absolute size-full" />
      </div>

      <div
        className={cn(
          'relative -mt-6 -mr-26 size-36 duration-2500',
          isReady
            ? 'animate-out fade-out fill-mode-forwards delay-2200'
            : 'animate-in slide-in-from-right fill-mode-backwards fade-in delay-2700',
        )}
      >
        <img src="/green_ring.png" className="absolute size-full" />
        <img src="/quigonjinn.png" className="absolute size-full" />
      </div>
    </div>
  );
}
