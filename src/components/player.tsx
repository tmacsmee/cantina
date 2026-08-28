import { useAnimations, useGLTF, useKeyboardControls } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import {
  Ecctrl,
  EcctrlAnimationStateController,
  type EcctrlHandle,
} from 'ecctrl';
import { useEffect, useRef } from 'react';
import { LoopOnce, LoopRepeat, Object3D } from 'three';
import { useCamera } from '../hooks/use-camera';
import type { Controls } from '../lib/types';

type ActionState = 'IDLE' | 'WALK' | 'RUN' | 'JUMP' | 'JUMP2' | 'FALL' | 'LAND';

type AnimationConfig = {
  loop: boolean;
  clampWhenFinished: boolean;
};

const animationConfig: Record<ActionState, AnimationConfig> = {
  IDLE: { loop: true, clampWhenFinished: false },
  WALK: { loop: true, clampWhenFinished: false },
  RUN: { loop: true, clampWhenFinished: false },
  JUMP: { loop: false, clampWhenFinished: true },
  JUMP2: { loop: false, clampWhenFinished: true },
  FALL: { loop: false, clampWhenFinished: true },
  LAND: { loop: false, clampWhenFinished: true },
};

function getActionState({
  isOnGround,
  wasOnGround,
  isMoving,
  jumpActive,
  runActive,
  isFalling,
  jumpCount,
}: {
  isOnGround: boolean;
  wasOnGround: boolean;
  isMoving: boolean;
  jumpActive: boolean;
  runActive: boolean;
  isFalling: boolean;
  jumpCount: number;
}): ActionState {
  if (jumpActive && wasOnGround) return 'JUMP';

  if (isOnGround) {
    if (!wasOnGround) return 'LAND';
    if (!isMoving) return 'IDLE';
    // want run by default, so swap walk and run
    return runActive ? 'WALK' : 'RUN';
  }

  return isFalling ? 'FALL' : 'JUMP';
}

export default function Player({ isPaused }: { isPaused: boolean }) {
  const ecctrl = useRef<EcctrlHandle>(null);
  const player = useRef<Object3D>(null);
  const prevActionState = useRef<ActionState>('IDLE');
  const prevIsOnGround = useRef(false);
  const jumpCount = useRef(0);

  useCamera(ecctrl, isPaused);

  const [subKeys, getKeys] = useKeyboardControls<Controls>();
  const { scene, animations } = useGLTF('/quigonjinn.glb');
  const { actions, mixer } = useAnimations(animations, player);

  useFrame(() => {
    if (!ecctrl.current || isPaused) {
      return;
    }

    const { forward, backward, leftward, rightward, jump, run } = getKeys();
    ecctrl.current.setMovement({
      forward,
      backward,
      leftward,
      rightward,
      jump,
      run,
    });

    const { isOnGround, isMoving, jumpActive, runActive, isFalling } =
      ecctrl.current;

    const wasOnGround = prevIsOnGround.current;
    if (isOnGround && !wasOnGround && jumpCount.current > 0) {
      jumpCount.current = 0;
    }

    const actionState = getActionState({
      isOnGround,
      wasOnGround,
      isMoving,
      jumpActive,
      runActive,
      isFalling,
      jumpCount: jumpCount.current,
    });

    if (actionState !== prevActionState.current) {
      const prevAction = actions[prevActionState.current]!;
      const action = actions[actionState]!;

      prevAction.fadeOut(0.2);
      action.reset().fadeIn(0.2).play();

      prevActionState.current = actionState;
    }

    prevIsOnGround.current = ecctrl.current.isOnGround;
  });

  useEffect(() => {
    for (const action of Object.values(actions)) {
      if (!action) {
        continue;
      }

      const config = animationConfig[action.getClip().name as ActionState];
      if (!config) {
        continue;
      }

      if (config.loop) {
        action.setLoop(LoopRepeat, Infinity);
      } else {
        action.setLoop(LoopOnce, 1);
      }
      action.clampWhenFinished = config.clampWhenFinished;
    }
  }, [actions]);

  useEffect(() => {
    mixer.timeScale = isPaused ? 0 : 1;
  }, [isPaused, mixer]);

  // useFrame(() => {
  //   const player = ecctrl.current;
  //   if (!player || player.isOnGround) {
  //     return;
  //   }

  //   const velocity = player.currLinVel;

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
      <EcctrlAnimationStateController ecctrl={ecctrl} />
      <Ecctrl
        debug
        ref={ecctrl}
        position={[0, 3, 0]}
        maxWalkVel={3.2}
        maxRunVel={1.6}
        enableToggleRun={false}
        jumpVel={8}
        gravityScale={2.5}
        fallingGravityScale={1.5}
        accDeltaTime={1}
        decDeltaTime={1}
      >
        <group ref={player} position={[0, -0.78, 0]} castShadow>
          <primitive object={scene} />
        </group>
      </Ecctrl>
    </>
  );
}
