import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import {
  useEffect,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import useSound from 'use-sound';
import menuBack from '../assets/audio/menu-back.wav';
import menuMove from '../assets/audio/menu-move.wav';
import type { MenuItemProps } from '../components/menu';
import Menu from '../components/menu';

export const Route = createFileRoute('/_menu/options')({
  component: Options,
});

const MAX_VOLUME = 10;

function Options() {
  const [volume, setVolume] = useState(5);
  const [isMusicOn, setIsMusicOn] = useState(true);
  const [playMenuMove] = useSound(menuMove);
  const [playMenuBack] = useSound(menuBack);

  const navigate = useNavigate();

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key !== 'Escape') {
        return;
      }

      navigate({ to: '/' });
      playMenuBack();
    }

    document.addEventListener('keydown', handleEscape);

    return () => document.removeEventListener('keydown', handleEscape);
  }, [navigate, playMenuBack]);

  function handleVolumeKeyDown(event: ReactKeyboardEvent<HTMLButtonElement>) {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      const increment = event.key === 'ArrowRight' ? 1 : -1;
      const nextVolume = Math.max(0, Math.min(MAX_VOLUME, volume + increment));

      if (nextVolume === volume) {
        return;
      }

      playMenuMove();
      setVolume(nextVolume);
    }
  }

  const menuItems: MenuItemProps[] = [
    {
      children: 'Audio Volume: ' + volume,
      onKeyDown: handleVolumeKeyDown,
    },
    {
      children: `Music: ${isMusicOn ? 'On' : 'Off'}`,
      onClick: () => {
        setIsMusicOn((prev) => !prev);
      },
    },
    {
      render: <Link to="/" />,
      children: 'Back',
    },
  ];

  return <Menu menuItems={menuItems} />;
}
