import { SubMenu, type MenuItemProps } from './menu';

export default function VideoSettings({ onBack }: { onBack: () => void }) {
  const menuItems: MenuItemProps[] = [];

  return <SubMenu menuItems={menuItems} onBack={onBack} />;
}
