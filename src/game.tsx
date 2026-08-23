import {
  Box,
  KeyboardControls,
  Plane,
  type KeyboardControlsEntry,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Physics, RigidBody } from "@react-three/rapier";
import type { Controls } from "./lib/types";
import Player from "./player";

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
    <Canvas shadows="variance" camera={{ fov: 60 }}>
      <Physics paused={isPaused}>
        <KeyboardControls map={keyboardMap}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[0, 5, 0]} intensity={2.5} castShadow />
          {/* <pointLight position={[0, 3, 0]} intensity={5} decay={1} castShadow /> */}

          <Player isPaused={isPaused} />

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
