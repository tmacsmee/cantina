import { createRootRoute, Outlet } from '@tanstack/react-router';
import AppLifecycleProvider from '../components/app-lifecycle-provider';
import DeviceCheck from '../components/device-check';
import SoundProvider from '../components/sound-provider';

export const Route = createRootRoute({ component: RootLayout });

function RootLayout() {
  return (
    <DeviceCheck>
      <SoundProvider>
        <AppLifecycleProvider>
          <Outlet />
        </AppLifecycleProvider>
      </SoundProvider>
    </DeviceCheck>
  );
}
