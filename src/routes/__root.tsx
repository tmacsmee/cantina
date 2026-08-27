import { createRootRoute, Outlet } from '@tanstack/react-router';
import SoundContextProvider from '../components/sound-context-provider';

function RootLayout() {
  return (
    <SoundContextProvider>
      <Outlet />
    </SoundContextProvider>
  );
}

export const Route = createRootRoute({ component: RootLayout });
