import { mergeProps, useRender } from '@base-ui/react';
import type { KeyboardEvent } from 'react';
import { useEffect, useRef, useState } from 'react';
import useSounds from '../hooks/use-sounds';
import { useAppLifecycle } from './app-lifecycle-provider';

export default function Menu({ menuItems }: { menuItems: MenuItemProps[] }) {
  const menuItemRefs = useRef<HTMLButtonElement[]>([]);

  const [activeIndex, setActiveIndex] = useState(0);

  const { hasShownSplash } = useAppLifecycle();

  useEffect(() => {
    menuItemRefs.current[0].focus();
  }, [hasShownSplash]);

  const {
    sounds: {
      menuMove: [playMenuMove],
      menuSelect: [playMenuSelect],
      menuBack: [playMenuBack],
    },
  } = useSounds();

  function handleKeyDown(event: KeyboardEvent, isBackButton?: boolean) {
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
      if (isBackButton) {
        playMenuBack();
      } else {
        playMenuSelect();
      }
    }
  }

  return (
    <div className="font-menu flex flex-col gap-y-1 text-center text-4xl font-bold tracking-tight text-[#1a72c8] [-webkit-text-stroke:5px_#001327] [paint-order:stroke_fill]">
      {menuItems.map(({ isBackButton, key, ...props }, index) => (
        <MenuItem
          key={key}
          ref={(item: HTMLButtonElement) => {
            menuItemRefs.current[index] = item;
          }}
          defaultOnKeyDown={(event) => handleKeyDown(event, isBackButton)}
          tabIndex={activeIndex === index ? 0 : -1}
          {...props}
        />
      ))}
    </div>
  );
}

export type MenuItemProps = useRender.ComponentProps<'button'> & {
  key: number;
  defaultOnKeyDown?: (event: KeyboardEvent) => void;
  isBackButton?: boolean;
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

export function SubMenu({
  menuItems,
  onBack,
}: {
  menuItems: MenuItemProps[];
  onBack: () => void;
}) {
  const withBack = [
    ...menuItems,
    {
      key: menuItems.length,
      render: <button onClick={onBack} />,
      isBackButton: true,
      children: 'Back',
    },
  ];

  return <Menu menuItems={withBack} />;
}
