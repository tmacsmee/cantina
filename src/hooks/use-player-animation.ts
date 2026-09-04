import { useAnimations, useKeyboardControls } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { characterStatus, type BVHEcctrlApi } from 'bvhecctrl';
import { useEffect, useRef, type RefObject } from 'react';
import { AnimationClip, LoopOnce, LoopRepeat, Object3D, Vector3 } from 'three';
import type { Controls } from '../lib/types';

type ActionState =
  'IDLE' | 'WALK' | 'RUN' | 'JUMP' | 'JUMP2' | 'FALL' | 'LAND' | 'LAND2';

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
  LAND2: { loop: false, clampWhenFinished: true },
};

function getAnimation(
  run: boolean,
  jump: boolean,
  isOnGround: boolean,
  prevIsOnGround: RefObject<boolean>,
  isFalling: boolean,
  inputDir: Vector3,
  hasDoubleJumped: RefObject<boolean>,
  linvel: Vector3,
): ActionState | null {
  if (isOnGround) {
    if (!prevIsOnGround.current) {
      if (hasDoubleJumped.current) {
        return 'LAND2';
      }
      return 'LAND';
    }
    if (inputDir.lengthSq() === 0) return 'IDLE';
    return run ? 'WALK' : 'RUN'; // hack to show running as walking
  } else {
    if (prevIsOnGround.current && jump) return 'JUMP';

    if (isFalling && linvel.y < -5) {
      // prevent falling too early
      return 'FALL';
    } else {
      if (hasDoubleJumped.current) {
        return 'JUMP2';
      }
      return 'JUMP';
    }
  }
}

export default function usePlayerAnimation(
  animations: AnimationClip[],
  player: RefObject<Object3D | null>,
  ecctrl: RefObject<BVHEcctrlApi | null>,
  hasDoubleJumped: RefObject<boolean>,
  prevIsOnGround: RefObject<boolean>,
  isPaused: boolean,
) {
  const prevActionState = useRef<ActionState>('IDLE');
  const { actions, mixer } = useAnimations(animations, player);
  const [, getKeys] = useKeyboardControls<Controls>();

  useEffect(() => {
    // initialise actions
    for (const [name, config] of Object.entries(animationConfig)) {
      const action = actions[name];
      if (!action) {
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

  useFrame(() => {
    if (!ecctrl.current || isPaused) {
      return;
    }

    const { run, jump } = getKeys();

    const { isOnGround, inputDir, animationStatus, linvel } = characterStatus;

    const isFalling = animationStatus === 'JUMP_FALL';
    const actionState = getAnimation(
      run,
      jump,
      isOnGround,
      prevIsOnGround,
      isFalling,
      inputDir,
      hasDoubleJumped,
      linvel,
    );

    if (actionState === null) {
      return;
    }

    if (actionState !== prevActionState.current) {
      const prevAction = actions[prevActionState.current];
      const action = actions[actionState];

      if (!action) {
        return;
      }

      if (!prevAction) {
        action?.reset().play();
      } else {
        action.reset();
        prevAction.crossFadeTo(action, 0.2, true).play();
      }

      prevActionState.current = actionState;
    }
  });
}
