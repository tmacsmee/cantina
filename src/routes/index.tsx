import { NavigationMenu } from '@base-ui/react/navigation-menu';
import {
  createFileRoute,
  Link,
  type LinkComponentProps,
} from '@tanstack/react-router';
import { type KeyboardEvent, useEffect, useRef, useState } from 'react';
import useSound from 'use-sound';
import menuMove from '../assets/audio/menu-move.wav';
import menuSelect from '../assets/audio/menu-select.wav';

export const Route = createFileRoute('/')({
  component: RouteComponent,
});

const menuItems: { text: string; to: string }[] = [
  { text: 'New Game', to: '/game' },
  { text: 'Options', to: '/options' },
];

function RouteComponent() {
  const menuItemRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    menuItemRefs.current[0]?.focus();
  }, []);

  function moveFocus(index: number) {
    setActiveIndex(index);
    menuItemRefs.current[index]?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLAnchorElement>) {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault();
      const increment = event.key === 'ArrowUp' ? -1 : 1;

      const nextIndex =
        (activeIndex + increment + menuItems.length) % menuItems.length;
      moveFocus(nextIndex);
    }
  }

  return (
    <main className="isolate flex h-screen items-center justify-center bg-black">
      <div className="animate-starfield fixed inset-0 -z-10 bg-[url('/starfield.png')] bg-size-(--starfield-width) bg-repeat [--starfield-width:250px]" />
      <div className="animate-starfield fixed inset-0 -z-10 bg-[url('/starfield.png')] bg-size-(--starfield-width) bg-repeat [--starfield-width:300px]" />
      <div className="animate-starfield fixed inset-0 -z-10 bg-[url('/starfield.png')] bg-size-(--starfield-width) bg-repeat [--starfield-width:350px]" />
      <NavigationMenu.Root>
        <NavigationMenu.List className="font-menu flex flex-col gap-y-2 text-center text-4xl font-bold tracking-wide text-[#1a72c8] [-webkit-text-stroke:5px_rgba(0,0,0,0.75)] [paint-order:stroke_fill]">
          {menuItems.map(({ text, to }, index) => (
            <MenuItem
              ref={(item) => {
                menuItemRefs.current[index] = item;
              }}
              key={text}
              to={to}
              tabIndex={activeIndex === index ? 0 : -1}
              autoFocus={index === 0}
              onKeyDown={handleKeyDown}
            >
              {text}
            </MenuItem>
          ))}
        </NavigationMenu.List>
      </NavigationMenu.Root>
    </main>
  );
}

function MenuItem({ children, autoFocus, ...props }: LinkComponentProps) {
  const [playMenuMove] = useSound(menuMove);
  const [playMenuSelect] = useSound(menuSelect);

  function handleFocus() {
    playMenuMove();
  }

  function handleClick() {
    playMenuSelect();
  }

  return (
    <NavigationMenu.Item>
      <Link
        {...props}
        className="focus:animate-menu focus:outline-none"
        onFocus={handleFocus}
        onClick={handleClick}
      >
        {children}
      </Link>
    </NavigationMenu.Item>
  );
}
