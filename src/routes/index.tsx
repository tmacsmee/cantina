import { useGLTF } from '@react-three/drei';
import { createFileRoute, Link, useRouter } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import titleUrl from '../assets/images/title.webp';
import cantinaUrl from '../assets/models/cantina.glb?url';
import playerModelUrl from '../assets/models/quigonjinn.glb?url';
import { useAppLifecycle } from '../components/app-lifecycle-provider';
import Menu, { type MenuItemProps } from '../components/menu';
import Options from '../components/options';
import SplashScreen from '../components/splash-screen';
import VideoSettings from '../components/video-settings';
import useSounds from '../hooks/use-sounds';
import { cn } from '../lib/utils';

export const Route = createFileRoute('/')({
  component: MenuRoute,
});

type Menu = 'main' | 'options' | 'video-settings';

function MenuRoute() {
  const [currentMenu, setCurrentMenu] = useState<Menu>('main');
  const { showTitleIntro, hasShownSplash, setShowTitleIntro } =
    useAppLifecycle();
  const router = useRouter();

  const {
    sounds: {
      title: [, { stop }],
    },
  } = useSounds();

  const menuItems: MenuItemProps[] = [
    {
      key: 0,
      render: <Link to="/play" viewTransition />,
      children: 'New Game',
    },
    {
      key: 1,
      render: <button onClick={() => setCurrentMenu('options')} />,
      children: 'Options',
    },
    {
      key: 2,
      render: <button onClick={() => setCurrentMenu('video-settings')} />,
      children: 'Video Settings',
    },
  ];

  useEffect(() => {
    useGLTF.preload(playerModelUrl);
    useGLTF.preload(cantinaUrl);
    router.preloadRoute({ to: '/play' });

    // preload title image
    const title = new Image();
    title.src = titleUrl;
  }, [router]);

  useEffect(() => {
    return () => stop();
  }, [stop]);

  return (
    <>
      <main className="animate-starfield starfield flex h-screen items-center justify-center overflow-hidden bg-black">
        {hasShownSplash && (
          <div className="relative flex flex-col">
            <img
              src={titleUrl}
              className={cn(
                'animate-in h-70 will-change-transform',
                showTitleIntro
                  ? 'zoom-in-300 duration-3500 ease-out'
                  : 'fade-in duration-1000',
              )}
              onAnimationEnd={() => {
                if (showTitleIntro) {
                  setShowTitleIntro(false);
                }
              }}
            />

            <div
              className={cn(
                'fade-in animate-in fill-mode-backwards',
                showTitleIntro ? 'delay-3000 duration-1000' : 'duration-500',
              )}
            >
              {currentMenu === 'main' && <Menu menuItems={menuItems} />}
              {currentMenu === 'options' && (
                <Options onBack={() => setCurrentMenu('main')} />
              )}
              {currentMenu === 'video-settings' && (
                <VideoSettings onBack={() => setCurrentMenu('main')} />
              )}
            </div>
          </div>
        )}
      </main>

      <SplashScreen />
    </>
  );
}
