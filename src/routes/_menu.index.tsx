import { useGLTF } from '@react-three/drei';
import { createFileRoute, Link, useRouter } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import titleUrl from '../assets/title.svg';
import Menu, { type MenuItemProps } from '../components/menu';
import { useScreenWipe } from '../components/screen-wipe-provider';
import { useSounds } from '../components/sound-provider';
import SplashScreen from '../components/splash-screen';

export const Route = createFileRoute('/_menu/')({
  component: MainMenu,
});

let hasShownSplash = false;

function MainMenu() {
  const [showSplash, setShowSplash] = useState(true);

  const router = useRouter();
  const { wipeIn, wipeOut } = useScreenWipe();
  const {
    titleSound: [playTitleSound],
  } = useSounds();

  function handleSplashDone() {
    setShowSplash(false);
    hasShownSplash = true;
    playTitleSound();
    wipeOut('right');
  }

  useEffect(() => {
    useGLTF.preload('/quigonjinn.glb');
    useGLTF.preload('/cantina.glb');
    router.preloadRoute({ to: '/play' });
  }, [router]);

  useEffect(() => {
    if (hasShownSplash) {
      return;
    }

    wipeIn('left', 0);
  }, [wipeIn]);

  const menuItems: MenuItemProps[] = [
    {
      children: 'New Game',
      onClick: () => {},
    },
    {
      render: <Link to="/options" />,
      children: 'Options',
    },
  ];

  return (
    <div className="relative flex flex-col">
      <img src={titleUrl} className="h-70" />
      <Menu menuItems={menuItems} />
      {showSplash && !hasShownSplash && (
        <SplashScreen onStart={handleSplashDone} />
      )}
    </div>
  );
}
