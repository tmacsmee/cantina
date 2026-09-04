import { useKeyboardControls } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { characterStatus, type BVHEcctrlApi } from 'bvhecctrl';
import { useEffect, useRef, type RefObject } from 'react';
import { Vector3 } from 'three';
import type { Controls } from '../lib/types';

export default function useDoubleJump(ecctrl: RefObject<BVHEcctrlApi | null>) {
  const prevIsOnGround = useRef(false);
  const hasDoubleJumped = useRef(false);

  const [subscribeToKeys] = useKeyboardControls<Controls>();

  useEffect(() => {
    return subscribeToKeys(
      (state) => state.jump,
      (pressed) => {
        const { isOnGround } = characterStatus;
        if (!isOnGround && pressed && !hasDoubleJumped.current) {
          const { linvel } = characterStatus;
          ecctrl.current?.setLinVel(new Vector3(linvel.x, 6.5, linvel.z));
          hasDoubleJumped.current = true;
        }
      },
    );
  }, [subscribeToKeys, ecctrl.current]);

  useFrame(() => {
    const { isOnGround } = characterStatus;

    const wasOnGround = prevIsOnGround.current;
    if (isOnGround && !wasOnGround && hasDoubleJumped.current) {
      hasDoubleJumped.current = false;
    }

    prevIsOnGround.current = isOnGround;
  });

  return { hasDoubleJumped, prevIsOnGround };
}
