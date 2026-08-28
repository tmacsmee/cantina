import { createRootRoute, Outlet } from '@tanstack/react-router';
import ScreenWipeProvider from '../components/screen-wipe-provider';
import SoundProvider from '../components/sound-provider';

function RootLayout() {
  return (
    <SoundProvider>
      <ScreenWipeProvider>
        <Outlet />
      </ScreenWipeProvider>
    </SoundProvider>
  );
}

export const Route = createRootRoute({ component: RootLayout });
