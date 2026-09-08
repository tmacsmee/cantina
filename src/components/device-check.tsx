import { useEffect, useState, type ReactNode } from 'react';
import unsupportedIcon from '../assets/images/monitor-off.svg';

export default function DeviceCheck({ children }: { children: ReactNode }) {
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    function checkDevice() {
      const widthOK = window.innerWidth >= 1024;
      const pointerOK = window.matchMedia('(pointer: fine)').matches;
      setSupported(widthOK && pointerOK);
    }

    checkDevice();

    window.addEventListener('resize', checkDevice);
    return () => {
      window.removeEventListener('resize', checkDevice);
    };
  }, []);

  if (!supported) {
    return (
      <main className="flex h-screen items-center justify-center px-5">
        <div className="flex max-w-md flex-col items-center gap-y-2 text-center">
          <img src={unsupportedIcon} className="size-16 opacity-30" />
          <h1 className="text-center text-2xl font-medium text-gray-900">
            Device not supported
          </h1>
          <p className="text-gray-700">
            Sorry, this application is not supported on touchscreen devices or
            devices with small screens.
          </p>
        </div>
      </main>
    );
  }

  return children;
}
