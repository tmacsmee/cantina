import { createRootRoute, Outlet } from '@tanstack/react-router';
import ScreenWipeProvider from '../components/screen-wipe-provider';
import SoundProvider from '../components/sound-provider';
import SplashScreenProvider from '../components/splash-provider';

function RootLayout() {
  return (
    <SoundProvider>
      <ScreenWipeProvider>
        <SplashScreenProvider>
          <Outlet />
        </SplashScreenProvider>
      </ScreenWipeProvider>
    </SoundProvider>
  );
}

export const Route = createRootRoute({ component: RootLayout });
