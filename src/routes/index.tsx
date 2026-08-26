import {
  createFileRoute,
  Link,
  type LinkComponentProps,
} from '@tanstack/react-router';
import useSound from 'use-sound';
import menuMove from '../assets/audio/menu-move.wav';

export const Route = createFileRoute('/')({
  component: RouteComponent,
});

const menuItems: { text: string; to: string }[] = [
  { text: 'New Game', to: '/game' },
  { text: 'Options', to: '/options' },
];

function RouteComponent() {
  return (
    <main className="h-screen bg-black">
      <ul className="font-menu flex flex-col gap-y-2 text-center text-4xl font-bold tracking-wide text-[#1a72c8] [-webkit-text-stroke:5px_rgba(0,0,0,0.75)] [paint-order:stroke_fill]">
        {menuItems.map(({ text, to }) => (
          <MenuItem key={text} to={to}>
            {text}
          </MenuItem>
        ))}
      </ul>
    </main>
  );
}

function MenuItem({ children, ...props }: LinkComponentProps) {
  const [playMenuMove] = useSound(menuMove);

  function handleFocus() {
    playMenuMove();
  }

  return (
    <li>
      <Link
        {...props}
        className="focus:animate-menu focus:outline-none"
        onFocus={handleFocus}
      >
        {children}
      </Link>
    </li>
  );
}
