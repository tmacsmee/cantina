import { mergeProps, useRender } from '@base-ui/react';
import type { KeyboardEvent } from 'react';
import { useEffect, useRef, useState } from 'react';
import { useSounds } from './sound-context-provider';

export default function Menu({ menuItems }: { menuItems: MenuItemProps[] }) {
  const menuItemRefs = useRef<HTMLButtonElement[]>([]);

  const [activeIndex, setActiveIndex] = useState(0);

  const {
    menuMoveSound: [playMenuMove],
    menuSelectSound: [playMenuSelect],
  } = useSounds();

  useEffect(() => {
    menuItemRefs.current[0].focus();
  }, []);

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      if (!menuItemRefs.current) {
        return;
      }

      const increment = event.key === 'ArrowDown' ? 1 : -1;
      const nextIndex = Math.min(
        menuItemRefs.current.length - 1,
        Math.max(0, activeIndex + increment),
      );

      if (nextIndex === activeIndex) {
        return;
      }

      setActiveIndex(nextIndex);
      menuItemRefs.current[nextIndex]?.focus();
      playMenuMove();
    }

    if (event.key === 'Enter') {
      playMenuSelect();
    }
  }

  return (
    <div className="font-menu flex flex-col gap-y-1 text-center text-4xl font-bold tracking-tight text-[#1a72c8] [-webkit-text-stroke:5px_#001327] [paint-order:stroke_fill]">
      {menuItems.map(({ ...props }, index) => (
        <MenuItem
          ref={(item: HTMLButtonElement) => {
            menuItemRefs.current[index] = item;
          }}
          defaultOnKeyDown={handleKeyDown}
          tabIndex={activeIndex === index ? 0 : -1}
          {...props}
        />
      ))}
    </div>
  );
}

export type MenuItemProps = useRender.ComponentProps<'button'> & {
  defaultOnKeyDown?: (event: KeyboardEvent) => void;
};

export function MenuItem({
  render,
  defaultOnKeyDown,
  ...props
}: MenuItemProps) {
  const defaultProps: useRender.ElementProps<'button'> = {
    className: 'focus:animate-menu focus:outline-none',
    onKeyDown: defaultOnKeyDown,
  };

  const element = useRender({
    defaultTagName: 'button',
    render,
    props: mergeProps(defaultProps, props),
  });

  return element;
}
