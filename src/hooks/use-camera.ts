import { useFrame } from '@react-three/fiber';
import type { BVHEcctrlApi } from 'bvhecctrl';
import { type RefObject } from 'react';
import { Camera, Vector3 } from 'three';

const CAMERA_ORIGIN = new Vector3(15, 2, 7);
const CAMERA_DISTANCE = 8.2;
const CAMERA_HEIGHT = 2.8;

const viewDirection = new Vector3();
const desiredCamPos = new Vector3();
const lookAtPos = new Vector3();

export function useCamera(
  ecctrl: RefObject<BVHEcctrlApi | null>,
  isPaused: boolean,
) {
  function updateCamera(camera: Camera, delta: number) {
    if (!ecctrl.current?.group) {
      return;
    }

    const target = ecctrl.current.group.position;
    viewDirection.copy(target).sub(CAMERA_ORIGIN).setY(0).normalize();
    desiredCamPos
      .copy(target)
      .addScaledVector(viewDirection, -CAMERA_DISTANCE)
      .setY(CAMERA_HEIGHT);

    lookAtPos.lerp(target, 1 - Math.pow(0.001, delta));
    camera.position.lerp(desiredCamPos, 1 - Math.pow(0.001, delta));
    camera.lookAt(lookAtPos);
  }

  useFrame(({ camera }, delta) => {
    if (!ecctrl.current || isPaused) {
      return;
    }

    updateCamera(camera, delta);
  });
}
