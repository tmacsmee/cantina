import { useGLTF } from '@react-three/drei';
import {
  createFileRoute,
  Link,
  useNavigate,
  useRouter,
} from '@tanstack/react-router';
import { useEffect } from 'react';
import titleUrl from '../assets/title.svg';
import Menu, { type MenuItemProps } from '../components/menu';
import { useSounds } from '../components/sound-provider';
import { SplashScreen } from '../components/splash-provider';

export const Route = createFileRoute('/_menu/')({
  component: MainMenu,
});

function MainMenu() {
  const router = useRouter();
  const navigate = useNavigate();
  const {
    titleSound: [playTitleSound],
  } = useSounds();

  useEffect(() => {
    useGLTF.preload('/quigonjinn.glb');
    useGLTF.preload('/cantina.glb');
    router.preloadRoute({ to: '/play' });
  }, [router]);

  const menuItems: MenuItemProps[] = [
    {
      children: 'New Game',
      onClick: () => {
        navigate({ to: '/play' });
      },
    },
    {
      render: <Link to="/options" />,
      children: 'Options',
    },
  ];

  return (
    <div className="flex flex-col">
      <img src={titleUrl} className="h-70" />
      <Menu menuItems={menuItems} />
      <SplashScreen />
    </div>
  );
}
