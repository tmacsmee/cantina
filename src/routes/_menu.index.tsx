// import { createFileRoute, Link } from '@tanstack/react-router';
// import titleUrl from '../assets/title.svg';
// import { useAppLifecycle } from '../components/app-lifecycle-provider';
// import Menu, { type MenuItemProps } from '../components/menu';
// import SplashScreen from '../components/splash-screen';
// import { cn } from '../lib/utils';

// export const Route = createFileRoute('/_menu/')({
//   component: MainMenu,
// });

// function MainMenu() {
//   const { showTitleIntro, hasShownSplash, setShowTitleIntro } =
//     useAppLifecycle();

//   const menuItems: MenuItemProps[] = [
//     {
//       render: <Link to="/play" viewTransition />,
//       children: 'New Game',
//     },
//     {
//       render: <Link to="/options" />,
//       children: 'Options',
//     },
//     {
//       render: <Link to="/video-settings" />,
//       children: 'Video Settings',
//     },
//   ];

//   return (
//     <div className="flex flex-col">
//       <img
//         src={titleUrl}
//         className={cn(
//           'h-70 will-change-transform',
//           hasShownSplash &&
//             !showTitleIntro &&
//             'animate-in fade-in duration-1000',
//           showTitleIntro && 'animate-in zoom-in-300 duration-3500 ease-out',
//         )}
//         onAnimationEnd={() => {
//           if (!showTitleIntro) {
//             return;
//           }

//           setShowTitleIntro(false);
//         }}
//       />

//       <div
//         className={cn(
//           'fade-in fill-mode-backwards',
//           hasShownSplash && !showTitleIntro && 'animate-in duration-500',
//           showTitleIntro && 'animate-in delay-3000 duration-1000',
//         )}
//       >
//         <Menu menuItems={menuItems} />
//       </div>
//       <SplashScreen />
//     </div>
//   );
// }

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
