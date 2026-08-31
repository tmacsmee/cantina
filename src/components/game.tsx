import {
  Environment,
  KeyboardControls,
  type KeyboardControlsEntry,
} from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { EffectComposer } from '@react-three/postprocessing';
import type { Controls } from '../lib/types';
import Cantina from './cantina';
import Player from './player';

const keyboardMap: KeyboardControlsEntry<Controls>[] = [
  { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
  { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
  { name: 'leftward', keys: ['ArrowLeft', 'KeyA'] },
  { name: 'rightward', keys: ['ArrowRight', 'KeyD'] },
  { name: 'jump', keys: ['Space'] },
  { name: 'run', keys: ['ShiftLeft', 'ShiftRight'] },
];

export default function Game({ isPaused }: { isPaused: boolean }) {
  return (
    <Canvas camera={{ fov: 30 }} flat gl={{ antialias: false }}>
      <KeyboardControls map={keyboardMap}>
        <Environment preset="warehouse" environmentIntensity={0.3} />
        <Player isPaused={isPaused} />
        <Cantina />
        <EffectComposer enabled={true}>
          {/* <Bloom mipmapBlur luminanceThreshold={1} /> */}
          {null}
        </EffectComposer>
      </KeyboardControls>
    </Canvas>
  );
}
