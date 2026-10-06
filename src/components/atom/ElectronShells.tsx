import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ElectronShellsProps {
  shells: number[];
  isPlaying: boolean;
  showRings: boolean;
}

interface SingleShellProps {
  shellIndex: number;
  electronCount: number;
  radius: number;
  isPlaying: boolean;
  showRings: boolean;
}

const SingleShell: React.FC<SingleShellProps> = ({
  shellIndex,
  electronCount,
  radius,
  isPlaying,
  showRings,
}) => {
  const groupRef = useRef<THREE.Group>(null);

  // Inclination tilt angle for 3D realism
  const tiltX = (shellIndex * 0.42) % Math.PI;
  const tiltY = (shellIndex * 0.28) % Math.PI;
  const speed = (1.4 / Math.sqrt(shellIndex + 1)) * (shellIndex % 2 === 0 ? 1 : -1);

  useFrame((_, delta) => {
    if (isPlaying && groupRef.current) {
      groupRef.current.rotation.z += delta * speed;
    }
  });

  // Calculate electron positions along the circular orbit
  const electrons = Array.from({ length: electronCount }, (_, i) => {
    const angle = (i / electronCount) * Math.PI * 2;
    return {
      x: radius * Math.cos(angle),
      y: radius * Math.sin(angle),
      z: 0,
    };
  });

  return (
    <group rotation={[tiltX, tiltY, 0]}>
      {/* Orbital Ring Guide */}
      {showRings && (
        <mesh>
          <ringGeometry args={[radius - 0.006, radius + 0.006, 64]} />
          <meshBasicMaterial color="#94A3B8" transparent opacity={0.35} side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Orbiting Electrons */}
      <group ref={groupRef}>
        {electrons.map((pos, idx) => (
          <mesh key={idx} position={[pos.x, pos.y, pos.z]}>
            <sphereGeometry args={[0.06, 12, 12]} />
            <meshStandardMaterial
              color="#0284C7"
              emissive="#0284C7"
              emissiveIntensity={0.6}
              roughness={0.2}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
};

export const ElectronShells: React.FC<ElectronShellsProps> = ({
  shells,
  isPlaying,
  showRings,
}) => {
  return (
    <group>
      {shells.map((count, index) => {
        const radius = 1.2 + index * 0.65;
        return (
          <SingleShell
            key={index}
            shellIndex={index}
            electronCount={count}
            radius={radius}
            isPlaying={isPlaying}
            showRings={showRings}
          />
        );
      })}
    </group>
  );
};
