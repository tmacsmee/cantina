import { createFileRoute, Link } from '@tanstack/react-router';
import Menu, { type MenuItemProps } from '../components/menu';

export const Route = createFileRoute('/_menu/')({
  component: MainMenu,
});

function MainMenu() {
  const menuItems: MenuItemProps[] = [
    {
      kind: 'link',
      to: '/play',
      children: 'New Game',
    },
    {
      kind: 'link',
      to: '/options',
      children: 'Options',
    },
  ];

  return <Menu menuItems={menuItems} />;
}
