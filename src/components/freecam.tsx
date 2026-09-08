import {
  PerspectiveCamera,
  PointerLockControls,
  useKeyboardControls,
} from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { PerspectiveCamera as TPerspectiveCamera, Vector3 } from 'three';
import type { Controls } from '../lib/types';

const cameraUp = new Vector3(0, 1, 0);
const cameraForward = new Vector3();
const cameraRight = new Vector3();
const delta = new Vector3();

export default function Freecam() {
  const camera = useRef<TPerspectiveCamera>(null);
  const [, getKeys] = useKeyboardControls<Controls>();

  useEffect(() => {
    function handleKeyPress(event: KeyboardEvent) {
      if (!camera.current) {
        return;
      }

      if (event.key === '`') {
        console.log(camera.current.position);
      }
    }

    document.addEventListener('keypress', handleKeyPress);
    return () => {
      document.removeEventListener('keypress', handleKeyPress);
    };
  }, []);

  useFrame(({ camera }) => {
    const { leftward, rightward, forward, backward, run, jump, crouch } =
      getKeys();

    camera.getWorldDirection(cameraForward);
    cameraRight.crossVectors(cameraForward, cameraUp);

    delta
      .set(0, 0, 0)
      .addScaledVector(cameraForward, Number(forward) - Number(backward))
      .addScaledVector(cameraRight, Number(rightward) - Number(leftward))
      .addScaledVector(cameraUp, Number(jump) - Number(crouch))
      .normalize();

    if (!run) {
      delta.multiplyScalar(0.2);
    }

    camera.position.add(delta);
  });

  return (
    <PointerLockControls>
      <PerspectiveCamera ref={camera} fov={60} makeDefault />
    </PointerLockControls>
  );
}
