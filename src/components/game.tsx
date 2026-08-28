import {
  Environment,
  KeyboardControls,
  useGLTF,
  type KeyboardControlsEntry,
} from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { StaticCollider } from 'bvhecctrl';
import type { Controls } from '../lib/types';
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
      </KeyboardControls>
    </Canvas>
  );
}

const CANTINA_POSITION: [number, number, number] = [0, -3.55, 0];
const CANTINA_ROTATION: [number, number, number] = [0, 5.9, 0];
const CANTINA_SCALE = 3.2;

function Cantina() {
  const { scenes } = useGLTF('/cantina.glb');
  const [visual, collision] = scenes;

  return (
    <>
      <group
        position={CANTINA_POSITION}
        rotation={CANTINA_ROTATION}
        scale={CANTINA_SCALE}
      >
        <primitive object={visual} />
      </group>
      <StaticCollider
        position={CANTINA_POSITION}
        rotation={CANTINA_ROTATION}
        scale={CANTINA_SCALE}
      >
        <group visible={false}>
          <primitive object={collision} />
        </group>
      </StaticCollider>
    </>
  );
}
