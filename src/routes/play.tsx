import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import Game from '../components/game';
import Hud from '../components/hud';
import Menu from '../components/pause-menu';
import { useSounds } from '../components/sound-context-provider';

export const Route = createFileRoute('/play')({
  component: RouteComponent,
});

function RouteComponent() {
  const [isPaused, setIsPaused] = useState(false);
  const {
    menuSelectSound: [playMenuSelect],
    menuBackSound: [playMenuBack],
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

  function handleMenuOpenChange(isOpen: boolean) {
    if (!isOpen) {
      playMenuBack();
    }

    setIsPaused(isOpen);
  }

  return (
    <div className="h-screen">
      <Game isPaused={isPaused} />
      <Hud />
      <Menu open={isPaused} onOpenChange={handleMenuOpenChange} />
    </div>
  );
}
