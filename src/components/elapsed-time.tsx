import { Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import fontUrl from '../assets/fonts/News Gothic Bold.otf';

function formatElapsedTime(elapsedMs: number) {
  const centiseconds = elapsedMs / 10;
  const formattedCentiseconds = Math.floor(centiseconds % 100)
    .toString()
    .padStart(2, '0');

  const seconds = elapsedMs / 1000;
  const formattedSeconds = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0');

  const minutes = seconds / 60;
  const formattedMinutes = Math.floor(minutes % 60)
    .toString()
    .padStart(2, '0');

  const hours = minutes / 60;
  const formattedHours = Math.floor(hours).toString();

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}.${formattedCentiseconds}`;
}

const initialText = '0:00:00.00\n0.0％';

export default function ElapsedTime() {
  const text = useRef<any>(null);

  useFrame(({ clock }) => {
    if (!text.current) {
      return;
    }

    const elapsed = clock.getElapsedTime() * 1000;
    text.current.text = `${formatElapsedTime(elapsed)}\n0.0％`;
  });

  return (
    <Text
      ref={text}
      color="#00befe"
      characters="0123456789:.%"
      outlineColor="black"
      outlineOpacity={0.4}
      outlineWidth={0.035}
      font={fontUrl}
      fontSize={0.5}
      position={[-0.7, 2, 10.4]}
      rotation-y={[2.5]}
      textAlign="center"
      fillOpacity={0.6}
    >
      {initialText}
    </Text>
  );
}
