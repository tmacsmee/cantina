import { useGLTF } from '@react-three/drei';
import BVHEcctrl, { type BVHEcctrlApi } from 'bvhecctrl';
import { useRef } from 'react';
import { Object3D } from 'three';
import playerModelUrl from '../assets/models/quigonjinn.glb?url';
import { useCamera } from '../hooks/use-camera';
import useDoubleJump from '../hooks/use-double-jump';
import usePlayerAnimation from '../hooks/use-player-animation';

export default function Player({ isPaused }: { isPaused: boolean }) {
  const ecctrl = useRef<BVHEcctrlApi>(null);
  const player = useRef<Object3D>(null);
  const { scene, animations } = useGLTF(playerModelUrl);

  useCamera(ecctrl, isPaused);

  const { hasDoubleJumped, prevIsOnGround } = useDoubleJump(ecctrl);
  usePlayerAnimation(
    animations,
    player,
    ecctrl,
    hasDoubleJumped,
    prevIsOnGround,
    isPaused,
  );

  return (
    <BVHEcctrl
      // debug
      ref={ecctrl}
      paused={isPaused}
      position={[4, 2, 7]}
      maxWalkSpeed={3.4}
      maxRunSpeed={1.6}
      jumpVel={8}
      gravity={20}
      fallGravityFactor={0.9}
      turnSpeed={9}
      delay={0}
      airDragFactor={1}
    >
      <group ref={player} position={[0, -0.78, 0]} scale={3.2}>
        <primitive object={scene} />
      </group>
    </BVHEcctrl>
  );
}
