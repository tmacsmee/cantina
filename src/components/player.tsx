import { useGLTF } from '@react-three/drei';
import BVHEcctrl, { type BVHEcctrlApi } from 'bvhecctrl';
import { useRef } from 'react';
import { Object3D } from 'three';
import useAnimatePlayer from '../hooks/use-animate-player';
import { useCamera } from '../hooks/use-camera';

export default function Player({ isPaused }: { isPaused: boolean }) {
  const ecctrl = useRef<BVHEcctrlApi>(null);
  const player = useRef<Object3D>(null);
  const { scene, animations } = useGLTF('/quigonjinn.glb');

  useCamera(ecctrl, isPaused);
  useAnimatePlayer(animations, player, ecctrl, isPaused);

  return (
    <BVHEcctrl
      // debug
      ref={ecctrl}
      paused={isPaused}
      position={[4, 2, 7]}
      maxWalkSpeed={3.4}
      maxRunSpeed={1.6}
      jumpVel={8}
      gravity={22}
      fallGravityFactor={1}
      turnSpeed={9}
      delay={0}
    >
      <group ref={player} position={[0, -0.78, 0]} scale={3.2} castShadow>
        <primitive object={scene} />
      </group>
    </BVHEcctrl>
  );
}
