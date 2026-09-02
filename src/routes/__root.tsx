import { createRootRoute, Outlet } from '@tanstack/react-router';
import AppLifecycleProvider from '../components/app-lifecycle-provider';
import SoundProvider from '../components/sound-provider';

function RootLayout() {
  return (
    <SoundProvider>
      <AppLifecycleProvider>
        <Outlet />
      </AppLifecycleProvider>
    </SoundProvider>
  );
}

export const Route = createRootRoute({ component: RootLayout });
