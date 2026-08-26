import { Dialog } from '@base-ui/react/dialog';
import { Link } from '@tanstack/react-router';
import {
  useRef,
  useState,
  type ComponentPropsWithRef,
  type ElementType,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
} from 'react';
import { useSound } from 'use-sound';
import menuMove from '../assets/audio/menu-move.wav';

const menuItems: { text: string; as?: 'close' | 'link'; to?: '/' }[] = [
  { text: 'Resume', as: 'close' },
  { text: 'Options' },
  { text: 'Extras' },
  { text: 'Quit', as: 'link', to: '/' },
];

export default function Menu({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
}) {
  const menuItemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const [activeIndex, setActiveIndex] = useState(0);

  function moveFocus(index: number) {
    setActiveIndex(index);
    menuItemRefs.current[index]?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault();
      const increment = event.key === 'ArrowUp' ? -1 : 1;

      const nextIndex =
        (activeIndex + increment + menuItems.length) % menuItems.length;
      moveFocus(nextIndex);
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Popup className="fixed inset-0 flex items-center justify-center">
          <Dialog.Title className="sr-only">Pause menu</Dialog.Title>
          <Dialog.Description className="sr-only">
            Options to resume the game, change settings, view extras, or quit
            the game.
          </Dialog.Description>
          <ul className="font-menu flex flex-col gap-y-2 text-center text-4xl font-bold tracking-wide text-[#1a72c8] [-webkit-text-stroke:5px_rgba(0,0,0,0.75)] [paint-order:stroke_fill]">
            {menuItems.map(({ text, as }, index) => (
              <MenuItem
                ref={(item) => {
                  menuItemRefs.current[index] = item;
                }}
                key={index}
                as={as}
                to="/"
                tabIndex={activeIndex === index ? 0 : -1}
                onKeyDown={handleKeyDown}
              >
                {text}
              </MenuItem>
            ))}
          </ul>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

type MenuItemProps = ComponentPropsWithRef<'button'> & {
  as: 'close' | 'link';
  to: string;
};

function MenuItem({ as, children, ...props }: MenuItemProps) {
  const [playMenuMove] = useSound(menuMove);

  function handleFocus() {
    playMenuMove();
  }

  let Comp: ElementType = 'button';
  if (as === 'close') {
    Comp = Dialog.Close;
  } else if (as === 'link') {
    Comp = Link;
  }

  return (
    <li>
      <Comp
        {...props}
        className="focus:animate-menu focus:outline-none"
        onFocus={handleFocus}
      >
        {children}
      </Comp>
    </li>
  );
}
