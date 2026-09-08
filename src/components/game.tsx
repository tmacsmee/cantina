import {
  Box,
  Capsule,
  KeyboardControls,
  Preload,
  useAnimations,
  useGLTF,
  type KeyboardControlsEntry,
} from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { Color, Group, Object3D } from 'three';
import type { Controls } from '../lib/types';
import Cantina from './cantina';
import Freecam from './freecam';
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
      <CantinaBand />
      <ambientLight intensity={0.3} />
      <directionalLight position={[-0.2, 2.5, 1.4]} intensity={2} />
      <KeyboardControls map={keyboardMap}>
        {/* <Freecam /> */}
        <Player isPaused={isPaused} />
      </KeyboardControls>
      <Cantina />
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

import type { ThreeElements } from '@react-three/fiber';
import { StaticCollider } from 'bvhecctrl';
import cantinaBassoon from '../assets/models/cantina_band_bassoon.glb?url';
import cantinaClarinet from '../assets/models/cantina_band_clarinet.glb?url';
import cantinaDrums from '../assets/models/cantina_band_drums.glb?url';

type BandMemberProps = {
  modelUrl: string;
  animationName: 'PLAYDRUMS' | 'PLAYCLARINET' | 'PLAYBASSOON';
} & ThreeElements['group'];

const HEIGHT = 0.4;
const CAPSULE_RADIUS = 0.1;

function BandMember({ modelUrl, animationName, ...props }: BandMemberProps) {
  const model = useRef<Object3D>(null);

  const { scene, animations } = useGLTF(modelUrl);
  const { actions } = useAnimations(animations, model);

  useEffect(() => {
    actions[animationName]?.reset().play();

    return () => {
      actions[animationName]?.stop();
    };
  }, [actions, animationName]);

  return (
    <group ref={model} scale={3.2} {...props}>
      <StaticCollider friction={0}>
        <Capsule
          args={[CAPSULE_RADIUS, HEIGHT - CAPSULE_RADIUS * 2]}
          position-y={HEIGHT - CAPSULE_RADIUS * 2}
          visible={false}
        />
      </StaticCollider>
      <primitive object={scene} />
    </group>
  );
}

function CantinaBand() {
  return (
    <group position={[10, 0.25, 16]} rotation-y={Math.PI}>
      <BandMember modelUrl={cantinaBassoon} animationName="PLAYBASSOON" />
      <BandMember
        modelUrl={cantinaDrums}
        animationName="PLAYDRUMS"
        position={[1, 0, -0.5]}
      />
      <BandMember
        modelUrl={cantinaClarinet}
        animationName="PLAYCLARINET"
        position={[2, 0, 0]}
      />
    </group>
  );
}
