import { useNavigate } from '@tanstack/react-router';
import { scale, useAnimate } from 'motion/react';
import { createContext, useContext, type ReactNode } from 'react';

type ScreenWipeContext = (href: string, from: Direction, to: Direction) => void;

const ScreenWipeContext = createContext<ScreenWipeContext | undefined>(
  undefined,
);

type Direction = 'top' | 'right' | 'bottom' | 'left';

export default function ScreenWipeProvider({
  children,
}: {
  children: ReactNode;
}) {
  const navigate = useNavigate();
  const [scope, animate] = useAnimate();

  async function handleNavigate(href: string, from: Direction, to: Direction) {
    scope.current.style.transformOrigin = from;
    await animate(
      scope.current,
      {
        scaleX: ['left', 'right'].includes(from) ? [0, 1] : [1, 1],
        scaleY: ['top', 'bottom'].includes(from) ? [0, 1] : [1, 1],
      },
      {
        duration: 1,
      },
    );

    await navigate({ to: href });

    scope.current.style.transformOrigin = to;
    await animate(
      scope.current,
      {
        scaleX: ['left', 'right'].includes(to) ? [1, 0] : [1, 1],
        scaleY: ['top', 'bottom'].includes(to) ? [1, 0] : [1, 1],
      },
      {
        duration: 1,
      },
    );
  }

  return (
    <ScreenWipeContext.Provider value={handleNavigate}>
      <div
        ref={scope}
        style={{ transform: 'scaleX(0) scaleY(0)' }}
        className="fixed inset-0 z-50 bg-black shadow-[0_0_16px_24px_black]"
      />
      {children}
    </ScreenWipeContext.Provider>
  );
}

export function useScreenWipe() {
  const context = useContext(ScreenWipeContext);

  if (context === undefined) {
    throw new Error('useScreenWipe must be used within a ScreenWipeProvider');
  }

  return context;
}
