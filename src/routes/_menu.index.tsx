import { useGLTF } from '@react-three/drei';
import {
  createFileRoute,
  Link,
  useNavigate,
  useRouter,
} from '@tanstack/react-router';
import { useEffect } from 'react';
import titleUrl from '../assets/title.svg';
import { useAppLifecycle } from '../components/app-lifecycle-provider';
import Menu, { type MenuItemProps } from '../components/menu';
import SplashScreen from '../components/splash-screen';
import { useScreenWipe } from '../hooks/use-screen-wipe';
import { cn } from '../lib/utils';

export const Route = createFileRoute('/_menu/')({
  component: MainMenu,
});

function MainMenu() {
  const { showTitleIntro, hasShownSplash, setShowTitleIntro } =
    useAppLifecycle();
  const router = useRouter();
  const navigate = useNavigate();
  const { wipeIn } = useScreenWipe();

  useEffect(() => {
    useGLTF.preload('/quigonjinn.glb');
    useGLTF.preload('/cantina.glb');
    router.preloadRoute({ to: '/play' });
  }, [router]);

  const menuItems: MenuItemProps[] = [
    {
      children: 'New Game',
      onClick: async () => {
        navigate({ to: '/play' });
      },
    },
    {
      render: <Link to="/options" />,
      children: 'Options',
    },
    {
      render: <Link to="/video-settings" />,
      children: 'Video Settings',
    },
  ];

  return (
    <div className="flex flex-col">
      <img
        src={titleUrl}
        className={cn(
          'h-70',
          hasShownSplash &&
            !showTitleIntro &&
            'animate-in fade-in duration-1000',
          showTitleIntro && 'animate-in zoom-in-300 duration-3500 ease-out',
        )}
        onAnimationEnd={() => {
          if (!showTitleIntro) {
            return;
          }

          setShowTitleIntro(false);
        }}
      />

      <div
        className={cn(
          'fade-in fill-mode-backwards',
          hasShownSplash && !showTitleIntro && 'animate-in duration-500',
          showTitleIntro && 'animate-in delay-3000 duration-1000',
        )}
      >
        <Menu menuItems={menuItems} />
      </div>
      <SplashScreen />
    </div>
  );
}
