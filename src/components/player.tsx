// import { useAnimations, useGLTF, useKeyboardControls } from '@react-three/drei';
// import { useFrame } from '@react-three/fiber';
// import {
//   Ecctrl,
//   EcctrlAnimationStateController,
//   type EcctrlHandle,
// } from 'ecctrl';
// import { useEffect, useRef } from 'react';
// import { LoopOnce, LoopRepeat, Object3D } from 'three';
// import { useCamera } from '../hooks/use-camera';
// import type { Controls } from '../lib/types';

// type ActionState = 'IDLE' | 'WALK' | 'RUN' | 'JUMP' | 'JUMP2' | 'FALL' | 'LAND';

// type AnimationConfig = {
//   loop: boolean;
//   clampWhenFinished: boolean;
// };

// const animationConfig: Record<ActionState, AnimationConfig> = {
//   IDLE: { loop: true, clampWhenFinished: false },
//   WALK: { loop: true, clampWhenFinished: false },
//   RUN: { loop: true, clampWhenFinished: false },
//   JUMP: { loop: false, clampWhenFinished: true },
//   JUMP2: { loop: false, clampWhenFinished: true },
//   FALL: { loop: false, clampWhenFinished: true },
//   LAND: { loop: false, clampWhenFinished: true },
// };

// function getActionState({
//   isOnGround,
//   wasOnGround,
//   isMoving,
//   jumpActive,
//   runActive,
//   isFalling,
//   jumpCount,
// }: {
//   isOnGround: boolean;
//   wasOnGround: boolean;
//   isMoving: boolean;
//   jumpActive: boolean;
//   runActive: boolean;
//   isFalling: boolean;
//   jumpCount: number;
// }): ActionState {
//   if (jumpActive && wasOnGround) return 'JUMP';

//   if (isOnGround) {
//     if (!wasOnGround) return 'LAND';
//     if (!isMoving) return 'IDLE';
//     // want run by default, so swap walk and run
//     return runActive ? 'WALK' : 'RUN';
//   }

//   return isFalling ? 'FALL' : 'JUMP';
// }

// export default function Player({ isPaused }: { isPaused: boolean }) {
//   const ecctrl = useRef<EcctrlHandle>(null);
//   const player = useRef<Object3D>(null);
//   const prevActionState = useRef<ActionState>('IDLE');
//   const prevIsOnGround = useRef(false);
//   const jumpCount = useRef(0);

//   useCamera(ecctrl, isPaused);

//   const [subKeys, getKeys] = useKeyboardControls<Controls>();
//   const { scene, animations } = useGLTF('/quigonjinn.glb');
//   const { actions, mixer } = useAnimations(animations, player);
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

  // useFrame(() => {
  //   const player = ecctrl.current;
  //   if (!player || player.isOnGround) {
  //     return;
  //   }

  //   const velocity = player.group;

  //   const up = player.upAxis;
  //   const verticalVelocity = up.clone().multiplyScalar(velocity.dot(up));
  //   const horizontalVelocity = velocity.clone().sub(verticalVelocity);

  //   const finalVelocity = new Vector3();
  //   if (player.isMoving) {
  //     finalVelocity
  //       .copy(player.inputDir)
  //       .multiplyScalar(horizontalVelocity.dot(player.inputDir));

  //     finalVelocity.add(verticalVelocity);
  //   } else {
  //     finalVelocity.copy(verticalVelocity);
  //   }

  //   player.body.setLinvel(finalVelocity, true);
  // });

  return (
    <>
      <BVHEcctrl
        debug
        ref={ecctrl}
        paused={isPaused}
        position={[0, 3, 0]}
        maxWalkSpeed={3.2}
        maxRunSpeed={1.6}
        jumpVel={8}
        gravity={22}
        fallGravityFactor={1}
        turnSpeed={9}
      >
        <group ref={player} position={[0, -0.78, 0]} castShadow>
          <primitive object={scene} />
        </group>
      </BVHEcctrl>
    </>
  );
}
