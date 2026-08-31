import { useGLTF } from '@react-three/drei';
import { StaticCollider } from 'bvhecctrl';

const CANTINA_POSITION: [number, number, number] = [0, -3.55, 0];
const CANTINA_ROTATION: [number, number, number] = [0, 5.9, 0];
const CANTINA_SCALE = 3.2;

export default function Cantina() {
  const { scenes } = useGLTF('/cantina.glb');
  const [visual, collision] = scenes;

  return (
    <>
      <group
        position={CANTINA_POSITION}
        rotation={CANTINA_ROTATION}
        scale={CANTINA_SCALE}
      >
        <primitive object={visual} />
      </group>
      <StaticCollider
        position={CANTINA_POSITION}
        rotation={CANTINA_ROTATION}
        scale={CANTINA_SCALE}
      >
        <group visible={false}>
          <primitive object={collision} />
        </group>
      </StaticCollider>
    </>
  );
}
