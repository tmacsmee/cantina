import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useSound } from 'use-sound';
import menuBack from '../assets/audio/menu-back.wav';
import menuSelect from '../assets/audio/menu-select.wav';
import Game from '../components/game';
import Hud from '../components/hud';
import Menu from '../components/menu';

export const Route = createFileRoute('/game')({
  component: RouteComponent,
});

function RouteComponent() {
  const [isPaused, setIsPaused] = useState(false);
  const [playMenuSelect] = useSound(menuSelect);
  const [playMenuBack] = useSound(menuBack);

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
