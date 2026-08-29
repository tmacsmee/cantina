import { useAnimate } from 'motion/react';
import { createContext, useContext, type ReactNode } from 'react';

type Direction = 'top' | 'right' | 'bottom' | 'left';

type ScreenWipeContext = {
  wipeIn: (from: Direction, duration?: number) => Promise<any>;
  wipeOut: (to: Direction, duration?: number) => Promise<any>;
};

const ScreenWipeContext = createContext<ScreenWipeContext | undefined>(
  undefined,
);

export default function ScreenWipeProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [scope, animate] = useAnimate();

  async function wipeIn(from: Direction, duration: number = 1) {
    scope.current.style.transformOrigin = from;
    return animate(
      scope.current,
      {
        scaleX: ['left', 'right'].includes(from) ? [0, 1] : [1, 1],
        scaleY: ['top', 'bottom'].includes(from) ? [0, 1] : [1, 1],
      },
      {
        duration,
      },
    );
  }

  async function wipeOut(to: Direction, duration: number = 1) {
    scope.current.style.transformOrigin = to;
    return animate(
      scope.current,
      {
        scaleX: ['left', 'right'].includes(to) ? [1, 0] : [1, 1],
        scaleY: ['top', 'bottom'].includes(to) ? [1, 0] : [1, 1],
      },
      {
        duration,
      },
    );
  }

  return (
    <ScreenWipeContext.Provider value={{ wipeIn, wipeOut }}>
      <div
        ref={scope}
        style={{ transform: 'scaleX(0) scaleY(0)' }}
        className="fixed inset-0 z-40 bg-black shadow-[0_0_16px_24px_black]"
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
