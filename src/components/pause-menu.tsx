import { Dialog } from '@base-ui/react/dialog';
import { Link } from '@tanstack/react-router';
import Menu, { type MenuItemProps } from './menu';

export default function PauseMenu({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
}) {
  const menuItems: MenuItemProps[] = [
    { children: 'Resume' },
    { children: 'Options' },
    { children: 'Extras' },
    { children: 'Quit', render: <Link to="/" /> },
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
          <Menu menuItems={menuItems} />
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
