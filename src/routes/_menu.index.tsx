import { useGLTF } from '@react-three/drei';
import { createFileRoute, Link, useRouter } from '@tanstack/react-router';
import { useEffect } from 'react';
import Menu, { type MenuItemProps } from '../components/menu';
import { useScreenWipe } from '../components/screen-wipe-provider';

export const Route = createFileRoute('/_menu/')({
  component: MainMenu,
});

function MainMenu() {
  const router = useRouter();
  const screenWipe = useScreenWipe();

  useEffect(() => {
    useGLTF.preload('/quigonjinn.glb');
    useGLTF.preload('/cantina.glb');
    router.preloadRoute({ to: '/play' });
  }, [router]);

  const menuItems: MenuItemProps[] = [
    {
      children: 'New Game',
      onClick: () => screenWipe('/play', 'left', 'right'),
    },
    {
      render: <Link to="/options" />,
      children: 'Options',
    },
  ];

  return <Menu menuItems={menuItems} />;
}
