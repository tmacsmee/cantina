import { mergeProps, useRender } from '@base-ui/react';
import { FocusTrap } from 'focus-trap-react';
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

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      const increment = event.key === 'ArrowDown' ? 1 : -1;
      const nextIndex = Math.min(
        menuItemRefs.current.length - 1,
        Math.max(0, activeIndex + increment),
      );

      if (nextIndex === activeIndex) {
        return;
      }

      setActiveIndex(nextIndex);
      menuItemRefs.current[nextIndex].focus();
      playMenuMove();
    }

    if (event.key === 'Enter' || event.key === 'Space') {
      const isBackButton =
        menuItemRefs.current[activeIndex].textContent === 'Back';
      if (isBackButton) {
        playMenuBack();
      } else {
        playMenuSelect();
      }
    }
  }

  return (
    <FocusTrap>
      <div
        onKeyDown={handleKeyDown}
        className="font-menu text-stroke-md flex flex-col gap-y-1 text-center text-4xl font-bold tracking-tight text-[#1a72c8]"
      >
        {menuItems.map(({ key, ...props }, index) => (
          <MenuItem
            key={key}
            ref={(item: HTMLButtonElement) => {
              menuItemRefs.current[index] = item;
            }}
            tabIndex={activeIndex === index ? 0 : -1}
            {...props}
          />
        ))}
      </div>
    </FocusTrap>
  );
}

export type MenuItemProps = useRender.ComponentProps<'button'> & {
  key: number;
  isBackButton?: boolean;
};

export function MenuItem({ render, ...props }: MenuItemProps) {
  const defaultProps: useRender.ElementProps<'button'> = {
    className: 'focus:animate-menu focus:outline-none',
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
