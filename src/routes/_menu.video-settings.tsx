import { createFileRoute, Link } from '@tanstack/react-router';
import Menu, { type MenuItemProps } from '../components/menu';

export const Route = createFileRoute('/_menu/video-settings')({
  component: RouteComponent,
});

const menuItems: MenuItemProps[] = [
  {
    render: <Link to="/" />,
    isBackButton: true,
    children: 'Back',
  },
];

function RouteComponent() {
  return (
    <div className="animate-in fade-in duration-500">
      <Menu menuItems={menuItems} />
    </div>
  );
}
