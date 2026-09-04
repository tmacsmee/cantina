import { useNavigate } from '@tanstack/react-router';
import { useEffect, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import type { MenuItemProps } from '../components/menu';
import { SubMenu } from '../components/menu';
import useSounds from '../hooks/use-sounds';

const MAX_VOLUME = 10;

export default function Options({ onBack }: { onBack: () => void }) {
  const {
    isMusicOn,
    setIsMusicOn,
    volume,
    setVolume,
    sounds: {
      menuMove: [playMenuMove],
      menuBack: [playMenuBack],
    },
  } = useSounds();

  const navigate = useNavigate();

  const menuItems: MenuItemProps[] = [
    {
      key: 0,
      children: `Audio Volume: ${volume} ⁄ 10`,
      onKeyDown: handleVolumeKeyDown,
    },
    {
      key: 1,
      children: `Music: ${isMusicOn ? 'On' : 'Off'}`,
      onClick: () => {
        setIsMusicOn((prev) => !prev);
      },
    },
  ];

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

  return <SubMenu menuItems={menuItems} onBack={onBack} />;
}
