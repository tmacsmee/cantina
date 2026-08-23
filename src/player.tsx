import { useAnimations, useGLTF, useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import {
  Ecctrl,
  EcctrlAnimationStateController,
  type EcctrlHandle,
} from "ecctrl";
import { useEffect, useRef } from "react";
import { Camera, LoopOnce, LoopRepeat, Object3D, Vector3 } from "three";
import type { Controls } from "./lib/types";

const CAMERA_OFFSET = new Vector3(0, 1, 3.2);

type ActionState = "IDLE" | "WALK" | "RUN" | "JUMP" | "FALL" | "LAND";

type AnimationConfig = {
  loop: boolean;
  clampWhenFinished: boolean;
};

const animationConfig: Record<ActionState, AnimationConfig> = {
  IDLE: { loop: true, clampWhenFinished: false },
  WALK: { loop: true, clampWhenFinished: false },
  RUN: { loop: true, clampWhenFinished: false },
  JUMP: { loop: false, clampWhenFinished: true },
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
}: {
  isOnGround: boolean;
  wasOnGround: boolean;
  isMoving: boolean;
  jumpActive: boolean;
  runActive: boolean;
  isFalling: boolean;
}): ActionState {
  if (jumpActive && wasOnGround) return "JUMP";

  if (isOnGround) {
    if (!wasOnGround) return "LAND";
    if (!isMoving) return "IDLE";
    return runActive ? "RUN" : "WALK";
  }

  return isFalling ? "FALL" : "JUMP";
}

export default function Player({ isPaused }: { isPaused: boolean }) {
  const ecctrl = useRef<EcctrlHandle>(null);
  const desiredCamPos = useRef(new Vector3());
  const lookAtPos = useRef(new Vector3());
  const player = useRef<Object3D>(null);
  const prevActionState = useRef<ActionState>("IDLE");
  const prevIsOnGround = useRef(false);

  const [, getKeys] = useKeyboardControls<Controls>();
  const { scene, animations } = useGLTF("/quigonjinn.glb");
  const { actions, mixer } = useAnimations(animations, player);

  function updateCamera(camera: Camera, delta: number) {
    if (!ecctrl.current) {
      return;
    }

    const target = ecctrl.current.currPos;

    lookAtPos.current.lerp(target, 1 - Math.pow(0.001, delta));
    desiredCamPos.current.copy(target).add(CAMERA_OFFSET);

    camera.position.lerp(desiredCamPos.current, 1 - Math.pow(0.001, delta));
    camera.lookAt(lookAtPos.current);
  }

  useFrame(({ camera }, delta) => {
    if (!ecctrl.current || isPaused) {
      return;
    }

    updateCamera(camera, delta);

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
    const actionState = getActionState({
      isOnGround,
      wasOnGround,
      isMoving,
      jumpActive,
      runActive,
      isFalling,
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

  return (
    <>
      <EcctrlAnimationStateController ecctrl={ecctrl} />
      <Ecctrl
        // debug
        ref={ecctrl}
        position={[0, 8, 0]}
        maxWalkVel={3}
        maxRunVel={6}
        enableToggleRun={false}
        accDeltaTime={0.5}
      >
        <group ref={player} position={[0, -0.78, 0]} castShadow>
          <primitive object={scene} />
        </group>
      </Ecctrl>
    </>
  );
}
