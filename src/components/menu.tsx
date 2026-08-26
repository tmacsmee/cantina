import { mergeProps, NavigationMenu, useRender } from '@base-ui/react';
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import useSound from 'use-sound';
import menuMove from '../assets/audio/menu-move.wav';
import menuSelect from '../assets/audio/menu-select.wav';

export default function Menu({ menuItems }: { menuItems: MenuItemProps[] }) {
  const menuItemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    menuItemRefs.current[0]?.focus();
  }, []);

  function moveFocus(index: number) {
    setActiveIndex(index);
    menuItemRefs.current[index]?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault();
      const increment = event.key === 'ArrowUp' ? -1 : 1;

      let nextIndex = activeIndex + increment;
      if (nextIndex >= menuItems.length || nextIndex < 0) {
        nextIndex = activeIndex;
      }
      moveFocus(nextIndex);
    }
  }

  return (
    <NavigationMenu.Root>
      <NavigationMenu.List className="font-menu flex flex-col gap-y-2 text-center text-4xl font-bold tracking-wide text-[#1a72c8] [-webkit-text-stroke:5px_rgba(0,0,0,0.75)] [paint-order:stroke_fill]">
        {menuItems.map((props, index) => (
          <MenuItem
            key={index}
            ref={(item) => {
              menuItemRefs.current[index] = item;
            }}
            tabIndex={activeIndex === index ? 0 : -1}
            onKeyDown={handleKeyDown}
            {...props}
          />
        ))}
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
}

export type MenuItemProps = useRender.ComponentProps<'button'>;

export function MenuItem({ render, ...props }: MenuItemProps) {
  const [playMenuMove] = useSound(menuMove);
  const [playMenuSelect] = useSound(menuSelect);

  const defaultProps: useRender.ElementProps<'button'> = {
    className: 'focus:animate-menu focus:outline-none',
    onFocus: () => playMenuMove(),
    onClick: () => playMenuSelect(),
  };

  const element = useRender({
    defaultTagName: 'button',
    props: mergeProps<'button'>(defaultProps, props),
    render,
  });

  return <li>{element}</li>;
}
