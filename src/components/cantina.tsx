import { useGLTF } from '@react-three/drei';
import { StaticCollider } from 'bvhecctrl';
import cantinaUrl from '../assets/models/cantina.glb?url';

const CANTINA_SCALE = 3.2;

export default function Cantina() {
  const { scenes } = useGLTF(cantinaUrl);
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
