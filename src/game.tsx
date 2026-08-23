import {
  Box,
  KeyboardControls,
  Plane,
  useAnimations,
  useGLTF,
  useKeyboardControls,
  type KeyboardControlsEntry,
} from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Physics, RigidBody } from "@react-three/rapier";
import {
  Ecctrl,
  EcctrlAnimationStateController,
  useEcctrlAnimationStore,
  type EcctrlHandle,
} from "ecctrl";
import { useRef } from "react";
import { AnimationAction, Object3D, Vector3 } from "three";

export type Controls =
  "forward" | "backward" | "leftward" | "rightward" | "jump" | "run";

const keyboardMap: KeyboardControlsEntry<Controls>[] = [
  { name: "forward", keys: ["ArrowUp", "KeyW"] },
  { name: "backward", keys: ["ArrowDown", "KeyS"] },
  { name: "leftward", keys: ["ArrowLeft", "KeyA"] },
  { name: "rightward", keys: ["ArrowRight", "KeyD"] },
  { name: "jump", keys: ["Space"] },
  { name: "run", keys: ["ShiftLeft", "ShiftRight"] },
];

export default function Game({ isPaused }: { isPaused: boolean }) {
  return (
    <Canvas
      shadows="variance"
      camera={{ fov: 60 }}
      frameloop={isPaused ? "never" : "always"}
    >
      <Physics paused={isPaused}>
        <KeyboardControls map={keyboardMap}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[0, 5, 0]} intensity={2.5} castShadow />
          {/* <pointLight position={[0, 3, 0]} intensity={5} decay={1} castShadow /> */}

          <Character />

          <RigidBody type="fixed">
            <Plane args={[100, 100]} rotation-x={-Math.PI / 2} receiveShadow>
              <meshStandardMaterial color="green" />
            </Plane>
          </RigidBody>

          <RigidBody type="fixed">
            <Box position={[2, 0.5, 0]} castShadow receiveShadow>
              <meshStandardMaterial color="blue" />
            </Box>
          </RigidBody>
        </KeyboardControls>
      </Physics>
    </Canvas>
  );
}

const CAMERA_OFFSET = new Vector3(0, 1, 3.2);

function Character() {
  const ecctrl = useRef<EcctrlHandle>(null);
  const desiredCamPos = useRef(new Vector3());
  const lookAtPos = useRef(new Vector3());
  const objectRef = useRef<Object3D>(null);
  const prevAnimationState = useRef<string | null>(null);
  const prevAction = useRef<AnimationAction | null>(null);

  const [, getKeys] = useKeyboardControls<Controls>();
  const { scene, animations } = useGLTF("/quigonjinn.glb");
  const { actions } = useAnimations(animations, objectRef);
  const animationState = useEcctrlAnimationStore(
    (state) => state.animationState,
  );

  useFrame(({ camera }, delta) => {
    if (!ecctrl.current) {
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

    const target = ecctrl.current.currPos;

    lookAtPos.current.lerp(target, 1 - Math.pow(0.001, delta));
    desiredCamPos.current.copy(target).add(CAMERA_OFFSET);

    camera.position.lerp(desiredCamPos.current, 1 - Math.pow(0.001, delta));
    camera.lookAt(lookAtPos.current);
  });

  if (animationState && prevAnimationState.current !== animationState) {
    const action = actions[animationMap[animationState]];

    if (action) {
      if (prevAction.current) {
        prevAction.current.fadeOut(0.2);
      }

      prevAction.current = action;
      action.reset().fadeIn(0.2).play();
      prevAnimationState.current = animationState;
    }
  }

  return (
    <>
      <EcctrlAnimationStateController ecctrl={ecctrl} />
      <Ecctrl
        debug
        ref={ecctrl}
        position={[0, 8, 0]}
        maxWalkVel={5}
        maxRunVel={10}
        enableToggleRun={false}
        // accDeltaTime={0.5}
      >
        <group ref={objectRef} position={[0, -0.78, 0]} castShadow>
          <primitive object={scene} />
        </group>
      </Ecctrl>
    </>
  );
}

const animationMap: Record<string, string> = {
  IDLE: "IDLE",
  WALK: "WALK",
  RUN: "RUN",
  JUMP_START: "JUMP",
  // JUMP_IDLE: "JUMP",
  JUMP_FALL: "FALL",
  JUMP_LAND: "LAND",
};

function Player() {
  const objectRef = useRef<Object3D>(null);
  const prevAnimationState = useRef<string | null>(null);
  const prevAction = useRef<AnimationAction | null>(null);

  const { scene, animations } = useGLTF("/quigonjinn.glb");
  const { actions } = useAnimations(animations, objectRef);
  const animationState = useEcctrlAnimationStore(
    (state) => state.animationState,
  );

  if (animationState && prevAnimationState.current !== animationState) {
    const action = actions[animationMap[animationState]];

    if (action) {
      if (prevAction.current) {
        prevAction.current.fadeOut(0.2);
      }

      prevAction.current = action;
      action.reset().fadeIn(0.2).play();
      prevAnimationState.current = animationState;
    }
  }

  return (
    <group ref={objectRef} position={[0, -0.78, 0]} castShadow>
      <primitive object={scene} />
    </group>
  );
}
