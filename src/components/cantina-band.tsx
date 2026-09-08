import { Capsule, useAnimations, useGLTF } from '@react-three/drei';
import type { ThreeElements } from '@react-three/fiber';
import { StaticCollider } from 'bvhecctrl';
import { useEffect, useRef } from 'react';
import type { Object3D } from 'three';
import cantinaBassoon from '../assets/models/cantina_band_bassoon.glb?url';
import cantinaClarinet from '../assets/models/cantina_band_clarinet.glb?url';
import cantinaDrums from '../assets/models/cantina_band_drums.glb?url';

type BandMemberProps = {
  modelUrl: string;
  animationName: 'PLAYDRUMS' | 'PLAYCLARINET' | 'PLAYBASSOON';
} & ThreeElements['group'];

const HEIGHT = 0.4;
const CAPSULE_RADIUS = 0.1;

function BandMember({ modelUrl, animationName, ...props }: BandMemberProps) {
  const model = useRef<Object3D>(null);

  const { scene, animations } = useGLTF(modelUrl);
  const { actions } = useAnimations(animations, model);

  useEffect(() => {
    actions[animationName]?.reset().play();

    return () => {
      actions[animationName]?.stop();
    };
  }, [actions, animationName]);

  return (
    <group ref={model} scale={3.2} {...props}>
      <StaticCollider friction={0}>
        <Capsule
          args={[CAPSULE_RADIUS, HEIGHT - CAPSULE_RADIUS * 2]}
          position-y={HEIGHT - CAPSULE_RADIUS * 2}
          visible={false}
        />
      </StaticCollider>
      <primitive object={scene} />
    </group>
  );
}

export default function CantinaBand() {
  return (
    <group position={[10, 0.25, 16]} rotation-y={Math.PI}>
      <BandMember modelUrl={cantinaBassoon} animationName="PLAYBASSOON" />
      <BandMember
        modelUrl={cantinaDrums}
        animationName="PLAYDRUMS"
        position={[1, 0, -0.5]}
      />
      <BandMember
        modelUrl={cantinaClarinet}
        animationName="PLAYCLARINET"
        position={[2, 0, 0]}
      />
    </group>
  );
}
