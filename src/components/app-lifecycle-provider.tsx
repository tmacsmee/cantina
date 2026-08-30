import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react';

type AppLifecycleContext = {
  hasShownSplash: boolean;
  showTitleIntro: boolean;
  setHasShownSplash: Dispatch<SetStateAction<boolean>>;
  setShowTitleIntro: Dispatch<SetStateAction<boolean>>;
};

const AppLifecycleContext = createContext<AppLifecycleContext | undefined>(
  undefined,
);

export default function AppLifecycleProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [hasShownSplash, setHasShownSplash] = useState(false);
  const [showTitleIntro, setShowTitleIntro] = useState(false);

  return (
    <AppLifecycleContext.Provider
      value={{
        hasShownSplash,
        setHasShownSplash,
        showTitleIntro,
        setShowTitleIntro,
      }}
    >
      {children}
    </AppLifecycleContext.Provider>
  );
}

export function useAppLifecycle() {
  const context = useContext(AppLifecycleContext);

  if (context === undefined) {
    throw new Error('useAppLifecyle must be used in a AppLifecycleProvider');
  }

  return context;
}
