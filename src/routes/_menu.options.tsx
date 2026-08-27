import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import type { MenuItemProps } from '../components/menu';
import Menu from '../components/menu';

export const Route = createFileRoute('/_menu/options')({
  component: Options,
});

const menuItems: MenuItemProps[] = [
  { children: 'Audio Volume: 2/10', render: <AudioVolume /> },
  { children: 'Options', render: <Link to="/options" /> },
];

function Options() {
  return <Menu menuItems={menuItems} />;
}

function AudioVolume() {
  const [volume, setVolume] = useState(5);

  return <button onClick={() => setVolume((prev) => prev + 1)} />;
}
