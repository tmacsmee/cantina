import { createFileRoute, Link } from '@tanstack/react-router';
import Menu, { type MenuItemProps } from '../components/menu';

export const Route = createFileRoute('/_menu/')({
  component: MainMenu,
});

const menuItems: MenuItemProps[] = [
  { children: 'New Game', render: <Link to="/play" /> },
  { children: 'Options', render: <Link to="/options" /> },
];

function MainMenu() {
  return <Menu menuItems={menuItems} />;
}
