import { Dialog } from '@base-ui/react/dialog';
import { Link } from '@tanstack/react-router';
import { useState } from 'react';
import Menu, { type MenuItemProps } from './menu';
import Options from './options';

type Menu = 'main' | 'options' | 'video-settings';

export default function PauseMenu({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
}) {
  const [currentMenu, setCurrentMenu] = useState<Menu>('main');

  const mainMenuItems: MenuItemProps[] = [
    { key: 0, children: 'Resume', onClick: () => onOpenChange(false) },
    {
      key: 1,
      children: 'Options',
      render: <button onClick={() => setCurrentMenu('options')} />,
    },
    { key: 2, children: 'Extras' },
    { key: 3, children: 'Quit', render: <Link to="/" viewTransition /> },
  ];

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Popup className="fixed inset-0 flex items-center justify-center">
          <Dialog.Title className="sr-only">Pause menu</Dialog.Title>
          <Dialog.Description className="sr-only">
            Options to resume the game, change settings, view extras, or quit
            the game.
          </Dialog.Description>
          {currentMenu === 'main' && <Menu menuItems={mainMenuItems} />}
          {currentMenu === 'options' && (
            <Options onBack={() => setCurrentMenu('main')} />
          )}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
