import { createFileRoute } from '@tanstack/react-router';
import { useState, type KeyboardEvent } from 'react';
import useSound from 'use-sound';
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

  function handleVolumeKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
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
      kind: 'button',
      children: 'Audio Volume: ' + volume,
      onKeyDown: handleVolumeKeyDown,
    },
    {
      kind: 'button',
      children: 'Music: ' + (isMusicOn ? 'On' : 'Off'),
      onClick: () => {
        setIsMusicOn((prev) => !prev);
      },
    },
    {
      kind: 'link',
      children: 'Back',
      to: '/',
    },
  ];

  return <Menu menuItems={menuItems} />;
}
