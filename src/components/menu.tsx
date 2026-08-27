import { Toolbar } from '@base-ui/react';
import { Link, type LinkProps } from '@tanstack/react-router';
import useSound from 'use-sound';
import menuMove from '../assets/audio/menu-move.wav';
import menuSelect from '../assets/audio/menu-select.wav';

export default function Menu({ menuItems }: { menuItems: MenuItemProps[] }) {
  return (
    <Toolbar.Root
      orientation="vertical"
      loopFocus={false}
      className="font-menu flex flex-col gap-y-1 text-center text-4xl font-bold tracking-tight text-[#1a72c8] [-webkit-text-stroke:5px_#001327] [paint-order:stroke_fill]"
    >
      {menuItems.map((props) => (
        <MenuItem {...props} />
      ))}
    </Toolbar.Root>
  );
}

export type MenuItemProps =
  (LinkProps & { kind: 'link' }) | (Toolbar.Button.Props & { kind: 'button' });

export function MenuItem(props: MenuItemProps) {
  const [playMenuMove] = useSound(menuMove);
  const [playMenuSelect] = useSound(menuSelect);

  if (props.kind === 'link') {
    return (
      <Toolbar.Link
        render={<Link {...props} />}
        className="focus:animate-menu focus:outline-none"
        onFocus={() => playMenuMove()}
        onClick={() => playMenuSelect()}
      />
    );
  }

  return (
    <Toolbar.Button
      className="focus:animate-menu focus:outline-none"
      {...props}
      onFocus={() => playMenuMove()}
      onClick={(event) => {
        playMenuMove();
        if (props.onClick) {
          props.onClick(event);
        }
      }}
    />
  );
}
