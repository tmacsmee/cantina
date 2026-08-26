import { createFileRoute, Link } from '@tanstack/react-router';
import Menu, { type MenuItemProps } from '../components/menu';

export const Route = createFileRoute('/')({
  component: RouteComponent,
});

const menuItems: MenuItemProps[] = [
  { children: 'New Game', render: <Link to="/game" /> },
  { children: 'Options', render: <Link to="/options" /> },
];

function RouteComponent() {
  return (
    <main className="isolate flex h-screen items-center justify-center bg-black">
      <div className="animate-starfield fixed inset-0 -z-10 bg-[url('/starfield.png')] bg-size-(--starfield-width) bg-repeat [--starfield-width:250px]" />
      <div className="animate-starfield fixed inset-0 -z-10 bg-[url('/starfield.png')] bg-size-(--starfield-width) bg-repeat [--starfield-width:300px]" />
      <div className="animate-starfield fixed inset-0 -z-10 bg-[url('/starfield.png')] bg-size-(--starfield-width) bg-repeat [--starfield-width:350px]" />
      <Menu menuItems={menuItems} />
    </main>
  );
}
