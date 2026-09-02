import { useGLTF } from '@react-three/drei';
import { createFileRoute, Outlet, useRouter } from '@tanstack/react-router';
import { useEffect, type CSSProperties } from 'react';
import starfield from '../assets/images/starfield.png';
import useSounds from '../hooks/use-sounds';

export const Route = createFileRoute('/_menu')({
  component: MenuLayout,
});

const starfieldWidths = [250, 300, 350];

function MenuLayout() {
  const router = useRouter();
  const {
    sounds: {
      title: [, { stop }],
    },
  } = useSounds();

  useEffect(() => {
    useGLTF.preload('/quigonjinn.glb');
    useGLTF.preload('/cantina.glb');
    router.preloadRoute({ to: '/play' });
  }, [router]);

  useEffect(() => {
    return () => stop();
  }, [stop]);

  return (
    <main className="flex h-screen items-center justify-center overflow-hidden bg-black">
      {starfieldWidths.map((width) => (
        <Starfield key={width} width={width} />
      ))}
      <div className="relative">
        <Outlet />
      </div>
    </main>
  );
}

function Starfield({ width }: { width: number }) {
  return (
    <div
      style={
        {
          '--starfield-width': `${width}px`,
          'background-image': `url(${starfield})`,
        } as CSSProperties
      }
      className="animate-starfield fixed inset-0 bg-[url('/starfield.png')] bg-size-(--starfield-width) bg-repeat"
    />
  );
}
