import { createFileRoute, Link } from '@tanstack/react-router';
import Menu, { type MenuItemProps } from '../components/menu';

export const Route = createFileRoute('/_menu/')({
  component: MainMenu,
});

function MainMenu() {
  const menuItems: MenuItemProps[] = [
    {
      render: <Link to="/play" />,
      children: 'New Game',
    },
    {
      render: <Link to="/options" />,
      children: 'Options',
    },
  ];

  return <Menu menuItems={menuItems} />;
}
