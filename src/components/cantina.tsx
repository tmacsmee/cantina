import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { StaticCollider } from 'bvhecctrl';
import { useEffect, useRef } from 'react';
import type { Object3D } from 'three';
import cantinaUrl from '../assets/models/cantina.glb?url';

const CANTINA_SCALE = 3.2;

export default function Cantina() {
  const lamps = useRef<Object3D[]>([]);
  const time = useRef<number>(0);
  const { scenes } = useGLTF(cantinaUrl);

  const [visual, collision] = scenes;

  useFrame((_, delta) => {
    time.current += delta;
    if (time.current >= 0.5) {
      for (const lamp of lamps.current) {
        lamp.scale.y *= -1;
      }

      time.current = 0;
    }
  });

  useEffect(() => {
    lamps.current = [];
    for (let i = 1; i <= 7; i++) {
      const lampGroup = visual.getObjectByName(`lock_${i}_on`);
      if (!lampGroup) {
        continue;
      }

      const [red, green] = lampGroup.children;
      green.visible = false;
      lamps.current.push(red);
    }
  }, [visual]);

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
