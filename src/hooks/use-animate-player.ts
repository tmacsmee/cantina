import { useAnimations } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import {
  characterStatus,
  type BVHEcctrlApi,
  type CharacterAnimationStatus,
} from 'bvhecctrl';
import { useEffect, useRef, type RefObject } from 'react';
import { AnimationClip, LoopOnce, LoopRepeat, Object3D } from 'three';

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

function getActionState(
  animationStatus: CharacterAnimationStatus,
): ActionState {
  switch (animationStatus) {
    case 'IDLE':
      return 'IDLE';
    case 'WALK':
      return 'RUN';
    case 'RUN':
      return 'WALK';
    case 'JUMP_START':
      return 'JUMP';
    case 'JUMP_IDLE':
      return 'JUMP';
    case 'JUMP_FALL':
      return 'FALL';
    case 'JUMP_LAND':
      return 'LAND';
  }
}

export default function useAnimatePlayer(
  animations: AnimationClip[],
  player: RefObject<Object3D | null>,
  ecctrl: RefObject<BVHEcctrlApi | null>,
  isPaused: boolean,
) {
  const prevActionState = useRef<ActionState>('IDLE');
  const prevIsOnGround = useRef(false);
  const jumpCount = useRef(0);

  const { actions, mixer } = useAnimations(animations, player);

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

  useFrame(() => {
    if (!ecctrl.current || isPaused) {
      return;
    }

    const { isOnGround, animationStatus } = characterStatus;

    const wasOnGround = prevIsOnGround.current;
    if (isOnGround && !wasOnGround && jumpCount.current > 0) {
      jumpCount.current = 0;
    }

    const actionState = getActionState(animationStatus);

    if (actionState !== prevActionState.current) {
      const prevAction = actions[prevActionState.current];
      const action = actions[actionState];

      if (prevAction) {
        prevAction.fadeOut(0.2);
      }

      if (action) {
        action.reset().fadeIn(0.2).play();
      }

      prevActionState.current = actionState;
    }

    prevIsOnGround.current = isOnGround;
  });
}
