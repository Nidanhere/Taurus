import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const MODEL_PATH = '/models/charging-bull.glb';

export function BullModel({
  position = [1.9, -0.4, 0],
  scale = 1.4,
  rotation = [0.1, -0.65, 0],
  isMobile = false,
  reducedMotion = false,
  onLoaded,
  scrollProgress = 0,
}) {
  const groupRef = useRef();
  const innerRef = useRef();
  const { scene } = useGLTF(MODEL_PATH);

  const { normalizedScene } = useMemo(() => {
    const clone = scene.clone(true);

    const box = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    box.getSize(size);
    const center = new THREE.Vector3();
    box.getCenter(center);

    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const normFactor = 3.35 / maxDim;

    clone.position.x = -center.x * normFactor;
    clone.position.y = -box.min.y * normFactor;
    clone.position.z = -center.z * normFactor;
    clone.scale.setScalar(normFactor);

    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        if (child.material) {
          const mat = child.material.clone();
          child.material = mat;

          if (!mat.map) {
            mat.color = new THREE.Color('#60482f');
          }

          mat.roughness = THREE.MathUtils.clamp(mat.roughness ?? 0.5, 0.44, 0.64);
          mat.metalness = THREE.MathUtils.clamp(mat.metalness ?? 0.82, 0.72, 0.9);
          mat.envMapIntensity = 0.92;
          mat.needsUpdate = true;
        }
      }
    });

    const wrapper = new THREE.Group();
    wrapper.add(clone);

    return { normalizedScene: wrapper };
  }, [scene]);

  useEffect(() => {
    if (onLoaded) {
      onLoaded();
    }
  }, [onLoaded]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    if (reducedMotion) {
      groupRef.current.rotation.y = rotation[1];
      groupRef.current.position.y = position[1];
      return;
    }

    const time = state.clock.getElapsedTime();
    const pointerX = isMobile ? 0 : state.pointer.x;
    const pointerY = isMobile ? 0 : state.pointer.y;

    // Scroll-based animation
    const scrollRotY = scrollProgress * 0.5; // Rotate based on scroll
    const scrollPosX = scrollProgress * 0.3; // Move based on scroll
    const scrollPosY = scrollProgress * 0.2; // Move down based on scroll

    const targetRotY = rotation[1] + pointerX * 0.075 + scrollRotY;
    const targetRotX = rotation[0] - pointerY * 0.035;
    const targetPosX = position[0] + pointerX * 0.035 + scrollPosX;
    const targetPosY = position[1] + pointerY * 0.018 + Math.sin(time * 0.42) * 0.012 + scrollPosY;

    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, delta * 2.8);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, delta * 2.8);
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetPosX, delta * 2.5);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetPosY, delta * 2.5);

    if (innerRef.current) {
      innerRef.current.rotation.z = Math.sin(time * 0.32) * 0.004;
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      <group ref={innerRef}>
        <primitive object={normalizedScene} />
      </group>
    </group>
  );
}

// Fallback loader for 3D canvas
export function BullModelFallback({ position = [1.9, -0.4, 0], scale = 1.4 }) {
  return (
    <group position={position} scale={scale}>
      <mesh>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshStandardMaterial
          color="#16181d"
          transparent
          opacity={0.2}
          roughness={0.6}
        />
      </mesh>
    </group>
  );
}

// Preload GLB
useGLTF.preload(MODEL_PATH);
