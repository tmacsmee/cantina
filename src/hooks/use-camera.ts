import { useFrame } from "@react-three/fiber";
import type { EcctrlHandle } from "ecctrl";
import { useRef, type RefObject } from "react";
import { Camera, Vector3 } from "three";

const CAMERA_OFFSET = new Vector3(0, 1.2, 4.2);

export function useCamera(
  ecctrl: RefObject<EcctrlHandle | null>,
  isPaused: boolean,
) {
  const desiredCamPos = useRef(new Vector3());
  const lookAtPos = useRef(new Vector3());

  function updateCamera(camera: Camera, delta: number) {
    if (!ecctrl.current) {
      return;
    }

    const target = ecctrl.current.currPos;

    lookAtPos.current.lerp(target, 1 - Math.pow(0.001, delta));
    desiredCamPos.current.copy(target).add(CAMERA_OFFSET).setY(2);

    camera.position.lerp(desiredCamPos.current, 1 - Math.pow(0.001, delta));
    camera.lookAt(lookAtPos.current);
  }

  useFrame(({ camera }, delta) => {
    if (!ecctrl.current || isPaused) {
      return;
    }

    updateCamera(camera, delta);
  });
}
