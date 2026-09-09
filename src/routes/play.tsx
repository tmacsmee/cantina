import { createFileRoute } from '@tanstack/react-router';
import { Suspense, useEffect, useState } from 'react';
import blueRing from '../assets/images/blue_ring.png';
import greenRing from '../assets/images/green_ring.png';
import obiWan from '../assets/images/obi_wan.png';
import quiGon from '../assets/images/quigonjinn.png';
import Game from '../components/game';
import Hud from '../components/hud';
import PauseMenu from '../components/pause-menu';
import useSounds from '../hooks/use-sounds';
import { cn, screenWipe } from '../lib/utils';

export const Route = createFileRoute('/play')({
  component: RouteComponent,
});

function RouteComponent() {
  const [isPaused, setIsPaused] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isLoadingScreenFinished, setIsLoadingScreenFinished] = useState(false);

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

  function handleLoadingScreenFinished() {
    screenWipe(() => setIsLoadingScreenFinished(true));
  }

  return (
    <div className="h-screen">
      <Suspense fallback={null}>
        <Game isPaused={isPaused} onReady={handleReady} />
      </Suspense>
      <PauseMenu open={isPaused} onOpenChange={handleMenuOpenChange} />
      <Hud />
      {!isLoadingScreenFinished && (
        <LoadingScreen
          isReady={isReady}
          onFinish={handleLoadingScreenFinished}
        />
      )}
    </div>
  );
}

function LoadingScreen({
  isReady,
  onFinish,
}: {
  isReady: boolean;
  onFinish: () => void;
}) {
  const [hasEntered, setHasEntered] = useState(false);

  let playerOneAnimation: string =
    'animate-in slide-in-from-left-100 fill-mode-backwards fade-in delay-1000 ease-out duration-1000';
  let playerTwoAnimation: string =
    'animate-in slide-in-from-right-100 fill-mode-backwards fade-in delay-1400 ease-out duration-1000';

  if (hasEntered) {
    if (isReady) {
      playerOneAnimation =
        'animate-out fade-out fill-mode-forwards duration-1500';
      playerTwoAnimation =
        'animate-out fade-out fill-mode-forwards delay-400 duration-1500';
    } else {
      playerOneAnimation = 'animate-pulse';
      playerTwoAnimation = 'animate-pulse delay-400';
    }
  }

  function handleAnimationEnd() {
    if (!hasEntered) {
      setHasEntered(true);
      return;
    } else if (isReady) {
      onFinish();
    }
  }

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black">
      <div
        className={cn(
          'relative -mb-6 -ml-26 size-36 duration-2000',
          playerOneAnimation,
        )}
      >
        <img src={blueRing} className="absolute size-full" />
        <img src={quiGon} className="absolute size-full" />
      </div>

      <div
        className={cn('relative -mt-6 -mr-26 size-36', playerTwoAnimation)}
        onAnimationEnd={handleAnimationEnd}
      >
        <img src={greenRing} className="absolute size-full" />
        <img src={obiWan} className="absolute size-full" />
      </div>
    </div>
  );
}
