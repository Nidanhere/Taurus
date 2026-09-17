import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  ContactShadows,
  Environment,
  PerspectiveCamera,
} from '@react-three/drei';
import * as THREE from 'three';
import { BullModel, BullModelFallback } from './BullModel';

function getSceneConfig(isMobile, isTablet) {
  if (isMobile) {
    return {
      bullPosition: [0, -1.1, 0],
      bullScale: 1.05,
      bullRotation: [0.06, -0.65, 0],
      cameraPosition: [0, 0.45, 6.6],
      cameraFov: 42,
      floorY: -1.15,
      cameraTarget: [0, -0.3, 0],
    };
  }

  if (isTablet) {
    return {
      bullPosition: [0, -1.05, 0],
      bullScale: 1.25,
      bullRotation: [0.07, -0.68, 0],
      cameraPosition: [0, 0.4, 6.4],
      cameraFov: 38,
      floorY: -1.08,
      cameraTarget: [0, -0.25, 0],
    };
  }

  // Desktop: perfectly anchored bronze bull integrated into full-viewport canvas
  return {
    bullPosition: [0, -1.0, 0],
    bullScale: 1.45,
    bullRotation: [0.06, -0.7, 0],
    cameraPosition: [0, 0.35, 6.0],
    cameraFov: 35,
    floorY: -1.02,
    cameraTarget: [0, -0.2, 0],
  };
}

function CameraRig({ basePosition, target, fov, reducedMotion, isMobile }) {
  const cameraRef = useRef(null);
  const lookAtTarget = useRef(new THREE.Vector3(...target));

  useFrame((state, delta) => {
    if (!cameraRef.current || reducedMotion || isMobile) return;

    const targetX = basePosition[0] + state.pointer.x * 0.05;
    const targetY = basePosition[1] + state.pointer.y * 0.02;

    cameraRef.current.position.x = THREE.MathUtils.lerp(cameraRef.current.position.x, targetX, delta * 2);
    cameraRef.current.position.y = THREE.MathUtils.lerp(cameraRef.current.position.y, targetY, delta * 2);
    cameraRef.current.lookAt(lookAtTarget.current);
  });

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      position={basePosition}
      fov={fov}
      onUpdate={(camera) => camera.lookAt(lookAtTarget.current)}
    />
  );
}

function StudioLighting({ reducedMotion }) {
  const rimLightRef = useRef(null);

  useFrame((state) => {
    if (!rimLightRef.current || reducedMotion) return;

    const time = state.clock.getElapsedTime();
    rimLightRef.current.position.x = 4.4 + Math.sin(time * 0.22) * 0.16;
    rimLightRef.current.intensity = 3.6 + Math.sin(time * 0.18) * 0.18;
  });

  return (
    <>
      <hemisphereLight args={['#fff2df', '#070706', 0.65]} />
      <ambientLight intensity={0.32} color="#f5efe3" />
      {/* Key Light */}
      <directionalLight
        position={[-3.6, 5.8, 4.8]}
        intensity={3.2}
        color="#fff4df"
        castShadow
        shadow-mapSize-width={1536}
        shadow-mapSize-height={1536}
        shadow-bias={-0.00008}
      />
      {/* Warm Fill */}
      <directionalLight position={[2.5, 2.8, 3.8]} intensity={0.8} color="#e5d0b1" />
      {/* Luxury Gold Rim */}
      <directionalLight
        ref={rimLightRef}
        position={[4.4, 3.7, -3.2]}
        intensity={3.8}
        color="#d4af37"
      />
      {/* Bronze Accent Light */}
      <pointLight position={[1.4, 1.05, 2.0]} intensity={0.85} color="#b8860b" distance={6} />
    </>
  );
}

export function HeroScene({
  isMobile = false,
  isTablet = false,
  reducedMotion = false,
  onSceneReady,
  scrollProgress = 0,
}) {
  const config = getSceneConfig(isMobile, isTablet);

  return (
    <div className="absolute inset-0 h-full w-full pointer-events-auto">
      <Canvas
        dpr={[1, 1.65]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        shadows
        onCreated={({ gl, scene }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.1;
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.setClearColor('#070706', 0);
          scene.background = null;
        }}
      >
        <CameraRig
          basePosition={config.cameraPosition}
          target={config.cameraTarget}
          fov={config.cameraFov}
          reducedMotion={reducedMotion}
          isMobile={isMobile}
        />

        <Environment preset="studio" environmentIntensity={0.45} />
        <StudioLighting reducedMotion={reducedMotion} />

        <Suspense
          fallback={
            <BullModelFallback
              position={config.bullPosition}
              scale={config.bullScale}
            />
          }
        >
          <BullModel
            position={config.bullPosition}
            scale={config.bullScale}
            rotation={config.bullRotation}
            isMobile={isMobile}
            reducedMotion={reducedMotion}
            onLoaded={onSceneReady}
            scrollProgress={scrollProgress}
          />
        </Suspense>

        <ContactShadows
          position={[config.bullPosition[0], config.floorY + 0.015, config.bullPosition[2]]}
          opacity={0.65}
          scale={7.5}
          blur={2.8}
          far={3.0}
          resolution={512}
          color="#000000"
        />
      </Canvas>
    </div>
  );
}
