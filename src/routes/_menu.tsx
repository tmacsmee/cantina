import { useGLTF } from '@react-three/drei';
import { createFileRoute, Outlet, useRouter } from '@tanstack/react-router';
import { useEffect } from 'react';
import useSounds from '../hooks/use-sounds';

export const Route = createFileRoute('/_menu')({
  component: MenuLayout,
});

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
      <div className="animate-starfield fixed inset-0 bg-[url('/starfield.png')] bg-size-(--starfield-width) bg-repeat [--starfield-width:250px]" />
      <div className="animate-starfield fixed inset-0 bg-[url('/starfield.png')] bg-size-(--starfield-width) bg-repeat [--starfield-width:300px]" />
      <div className="animate-starfield fixed inset-0 bg-[url('/starfield.png')] bg-size-(--starfield-width) bg-repeat [--starfield-width:350px]" />
      <div className="relative">
        <Outlet />
      </div>
    </main>
  );
}
