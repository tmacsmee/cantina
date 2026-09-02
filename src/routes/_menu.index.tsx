import { createFileRoute, Link } from '@tanstack/react-router';
import titleUrl from '../assets/images/title.svg';
import { useAppLifecycle } from '../components/app-lifecycle-provider';
import Menu, { type MenuItemProps } from '../components/menu';
import SplashScreen from '../components/splash-screen';
import { cn } from '../lib/utils';

export const Route = createFileRoute('/_menu/')({
  component: MainMenu,
});

const menuItems: MenuItemProps[] = [
  {
    key: 0,
    render: <Link to="/play" viewTransition />,
    children: 'New Game',
  },
  {
    key: 1,
    render: <Link to="/options" />,
    children: 'Options',
  },
  {
    key: 2,
    render: <Link to="/video-settings" />,
    children: 'Video Settings',
  },
];

function MainMenu() {
  const { showTitleIntro, hasShownSplash, setShowTitleIntro } =
    useAppLifecycle();

  return (
    <div className="flex flex-col">
      {hasShownSplash && (
        <>
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
            <Menu menuItems={menuItems} />
          </div>
        </>
      )}

      <SplashScreen />
    </div>
  );
}
