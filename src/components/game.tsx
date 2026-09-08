import {
  KeyboardControls,
  Preload,
  type KeyboardControlsEntry,
} from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Color } from 'three';
import type { Controls } from '../lib/types';
import Cantina from './cantina';
import CantinaBand from './cantina-band';
import Player from './player';

const keyboardMap: KeyboardControlsEntry<Controls>[] = [
  { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
  { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
  { name: 'leftward', keys: ['ArrowLeft', 'KeyA'] },
  { name: 'rightward', keys: ['ArrowRight', 'KeyD'] },
  { name: 'jump', keys: ['Space'] },
  { name: 'run', keys: ['ShiftLeft', 'ShiftRight'] },
  { name: 'crouch', keys: ['ControlLeft'] },
];

export default function Game({
  isPaused,
  onReady,
}: {
  isPaused: boolean;
  onReady: () => void;
}) {
  return (
    <Canvas
      camera={{ fov: 30 }}
      flat
      gl={{ antialias: false }}
      scene={{ background: new Color('#313024') }}
    >
      <Preload all />
      <SceneReady onReady={onReady} />
      <ambientLight intensity={0.3} />
      <directionalLight position={[-0.2, 2.5, 1.4]} intensity={2} />
      <KeyboardControls map={keyboardMap}>
        {/* <Freecam /> */}
        <Player isPaused={isPaused} />
      </KeyboardControls>
      <Cantina />
      <CantinaBand />
    </Canvas>
  );
}

function SceneReady({ onReady }: { onReady: () => void }) {
  const frames = useRef(0);

  useFrame(() => {
    frames.current++;
    if (frames.current === 2) {
      onReady();
    }
  });

  return null;
}
