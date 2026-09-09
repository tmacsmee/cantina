import { Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef, type RefObject } from 'react';
import fontUrl from '../assets/fonts/News Gothic Bold.otf';

const initialText = '0:00:00.00\n0.0％';

const INITIAL_POS_Y = 2;
const INITIAL_ROTATION_Y = 2.5;
const AMPLITUDE_POS_Y = 0.03;
const AMPLITUDE_ROT_Y = 0.25;
const POS_PERIOD = (2 * Math.PI) / 3.5;

const MAX_OPACITY = 0.5;
const MIN_OPACITY = 0.4;
const OPACITY_OPTIONS = [MIN_OPACITY, MAX_OPACITY];

export default function ElapsedTime() {
  const text = useRef<any>(null);
  const frameCount = useRef(0);

  useFrame(({ clock }) => {
    if (!text.current) {
      return;
    }

    frameCount.current++;

    const elapsed = clock.getElapsedTime();
    text.current.text = `${formatElapsedTime(elapsed)}\n0.0％`;

    animateText(text, elapsed, frameCount.current);
  });

  return (
    <Text
      ref={text}
      characters="0123456789:.%"
      color="#00befe"
      fillOpacity={MAX_OPACITY}
      outlineColor="#001f2d"
      outlineOpacity={MAX_OPACITY}
      outlineWidth={0.035}
      font={fontUrl}
      fontSize={0.5}
      position={[-0.7, INITIAL_POS_Y, 10.4]}
      rotation-y={INITIAL_ROTATION_Y}
      textAlign="center"
    >
      {initialText}
    </Text>
  );
}

function animateText(
  text: RefObject<any>,
  elapsed: number,
  frameCount: number,
) {
  text.current.position.y =
    AMPLITUDE_POS_Y * Math.sin(elapsed * POS_PERIOD) + INITIAL_POS_Y;
  text.current.rotation.y =
    AMPLITUDE_ROT_Y * Math.sin(elapsed) + INITIAL_ROTATION_Y;

  if (frameCount % 2 === 0) {
    const randomOpacity = OPACITY_OPTIONS[Math.round(Math.random())];
    text.current.fillOpacity = randomOpacity;
    text.current.outlineOpacity = randomOpacity;
  }
}

function formatElapsedTime(elapsed: number) {
  const centiseconds = elapsed * 100;
  const formattedCentiseconds = Math.floor(centiseconds % 100)
    .toString()
    .padStart(2, '0');

  const seconds = elapsed;
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
