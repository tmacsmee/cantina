// import {
//   Box,
//   Environment,
//   KeyboardControls,
//   Plane,
//   Sphere,
//   useGLTF,
//   type KeyboardControlsEntry,
// } from '@react-three/drei';
// import { Canvas } from '@react-three/fiber';
// import { Physics, RigidBody } from '@react-three/rapier';
// import { useEffect } from 'react';
// import { Mesh, MeshBasicMaterial } from 'three';
// import type { Controls } from '../lib/types';
// import Player from './player';

// const keyboardMap: KeyboardControlsEntry<Controls>[] = [
//   { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
//   { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
//   { name: 'leftward', keys: ['ArrowLeft', 'KeyA'] },
//   { name: 'rightward', keys: ['ArrowRight', 'KeyD'] },
//   { name: 'jump', keys: ['Space'] },
//   { name: 'run', keys: ['ShiftLeft', 'ShiftRight'] },
// ];

// export default function Game({ isPaused }: { isPaused: boolean }) {
//   return (
//     <Canvas camera={{ fov: 45 }} flat>
//       <Physics paused={isPaused}>
//         <KeyboardControls map={keyboardMap}>
//           <axesHelper position={[0, 1, 0]} args={[4]} />
//           <Environment preset="warehouse" environmentIntensity={0.3} />

//           <Cantina />

//           <Player isPaused={isPaused} />

//           <RigidBody type="fixed">
//             <Plane args={[100, 100]} rotation-x={-Math.PI / 2} receiveShadow>
//               <meshStandardMaterial color="green" />
//             </Plane>
//           </RigidBody>

//           <RigidBody type="fixed">
//             <Box position={[2, 0.5, 0]} castShadow receiveShadow>
//               <meshStandardMaterial color="blue" />
//             </Box>
//           </RigidBody>
//         </KeyboardControls>
//       </Physics>
//     </Canvas>
//   );
// }

// function Cantina() {
//   const { scene, materials } = useGLTF('/cantina_baked.glb');

//   useEffect(() => {
//     scene.traverse((node) => {
//       if (!(node instanceof Mesh)) {
//         return;
//       }
//       const material = node.material;
//       const basicMaterial = new MeshBasicMaterial({
//         map: material.map,
//         lightMap: material.lightMap,
//         lightMapIntensity: material.lightMapIntensity,
//         vertexColors: material.vertexColors,
//         transparent: material.transparent,
//         opacity: material.opacity,
//         alphaTest: material.alphaTest,
//         alphaMap: material.alphaMap,
//         side: material.side,
//         depthWrite: material.depthWrite,
//         name: material.name,
//       });
//       basicMaterial.userData = material.userData;

//       node.material = basicMaterial;
//     });
//   }, [scene, materials]);

//   return (
//     <group scale={3.2} rotation-y={5.9} position={[0, -3.55, 0]}>
//       <primitive object={scene} />
//     </group>
//   );
// }

import {
  Box,
  Environment,
  KeyboardControls,
  Plane,
  Sphere,
  useGLTF,
  type KeyboardControlsEntry,
} from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Physics, RigidBody } from '@react-three/rapier';
import { useEffect } from 'react';
import { Mesh, MeshBasicMaterial } from 'three';
import type { Controls } from '../lib/types';
import Player from './player';

const keyboardMap: KeyboardControlsEntry<Controls>[] = [
  { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
  { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
  { name: 'leftward', keys: ['ArrowLeft', 'KeyA'] },
  { name: 'rightward', keys: ['ArrowRight', 'KeyD'] },
  { name: 'jump', keys: ['Space'] },
  { name: 'run', keys: ['ShiftLeft', 'ShiftRight'] },
];

export default function Game({ isPaused }: { isPaused: boolean }) {
  return (
    <Canvas camera={{ fov: 45 }} flat>
      <Physics paused={isPaused}>
        <KeyboardControls map={keyboardMap}>
          <axesHelper position={[0, 1, 0]} args={[4]} />
          <Environment preset="warehouse" environmentIntensity={0.3} />

          <Player isPaused={isPaused} />

          <Cantina />

          {/* <RigidBody type="fixed">
            <Plane args={[100, 100]} rotation-x={-Math.PI / 2} receiveShadow>
              <meshStandardMaterial color="green" />
            </Plane>
          </RigidBody> */}

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

function Cantina() {
  const { scenes } = useGLTF('/map_cantina_bar_baked_collision_unlit.glb');

  return (
    <group scale={3.2} rotation-y={5.9} position={[0, -3.55, 0]}>
      <primitive object={scenes[0]} />
      <group visible={false}>
        <RigidBody type="fixed" colliders="trimesh">
          <primitive object={scenes[1]} />
        </RigidBody>
      </group>
    </group>
  );
}
