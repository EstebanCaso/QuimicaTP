import React, { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { usePeriodicStore } from '../../store/usePeriodicStore';
import { PeriodicTable3D } from './PeriodicTable3D';

function CameraHandler() {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const viewMode = usePeriodicStore((s) => s.viewMode);
  const cameraResetKey = usePeriodicStore((s) => s.cameraResetKey);

  useEffect(() => {
    if (!controlsRef.current) return;
    const controls = controlsRef.current;
    if (viewMode === 'flat') {
      controls.object.position.set(0, -1.1, 17.2);
      controls.target.set(0, -1.1, 0);
      controls.enableRotate = false;
    } else {
      controls.object.position.set(0, -2.6, 18.0);
      controls.target.set(0, -1.1, 0);
      controls.enableRotate = true;
    }
    controls.update();
  }, [viewMode, cameraResetKey]);

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.06}
      minDistance={6}
      maxDistance={35}
      maxPolarAngle={Math.PI / 2 + 0.1}
      target={[0, -1.1, 0]}
    />
  );
}

export const PeriodicScene: React.FC = () => {
  return (
    <div className="w-full h-full relative bg-[#F5F2EA] select-none">
      <Canvas
        camera={{ position: [0, -2.6, 18.0], fov: 42 }}
        dpr={[1, 2]}
        gl={{ antialias: true }}
      >
        <color attach="background" args={['#F5F2EA']} />

        {/* Warm gallery & archival chart illumination */}
        <ambientLight intensity={1.55} color="#FFFDF9" />
        <directionalLight position={[0, 0, 20]} intensity={1.15} color="#FFFDF8" />
        <directionalLight position={[10, 20, 15]} intensity={0.75} color="#FFF9EE" />
        <directionalLight position={[-10, -10, 10]} intensity={0.35} />

        <PeriodicTable3D />
        <CameraHandler />
      </Canvas>
    </div>
  );
};
