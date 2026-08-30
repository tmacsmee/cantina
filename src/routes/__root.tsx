import { createRootRoute, Outlet } from '@tanstack/react-router';
import AppLifecycleProvider from '../components/app-lifecycle-provider';
import ScreenWipeProvider from '../components/screen-wipe-provider';
import SoundProvider from '../components/sound-provider';

function RootLayout() {
  return (
    <SoundProvider>
      <ScreenWipeProvider>
        <AppLifecycleProvider>
          <Outlet />
        </AppLifecycleProvider>
      </ScreenWipeProvider>
    </SoundProvider>
  );
}

export const Route = createRootRoute({ component: RootLayout });
