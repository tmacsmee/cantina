import { useGLTF } from '@react-three/drei';
import { StaticCollider } from 'bvhecctrl';

const CANTINA_SCALE = 3.2;

export default function Cantina() {
  const { scenes } = useGLTF('/cantina.glb');
  const [visual, collision] = scenes;

  return (
    <>
      <group scale={CANTINA_SCALE}>
        <primitive object={visual} />
      </group>
      <StaticCollider scale={CANTINA_SCALE}>
        <group visible={false}>
          <primitive object={collision} />
        </group>
      </StaticCollider>
    </>
  );
}
