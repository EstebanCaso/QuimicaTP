import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface OrbitalCloudProps {
  totalElectrons: number;
  isPlaying: boolean;
}

export const OrbitalCloud: React.FC<OrbitalCloudProps> = ({ totalElectrons, isPlaying }) => {
  const pointsRef = useRef<THREE.Points>(null);

  const particleCount = useMemo(() => {
    return Math.min(1800, Math.max(300, totalElectrons * 25));
  }, [totalElectrons]);

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);

    const baseColor = new THREE.Color('#38BDF8');
    const innerColor = new THREE.Color('#2563EB');

    // Seeded pure PRNG
    let seed = (totalElectrons * 1337 + 7919) % 233280;
    const random = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    for (let i = 0; i < particleCount; i++) {
      // Gaussian distribution for radial distance
      const u1 = random();
      const radius = Math.sqrt(-2.0 * Math.log(u1 + 0.0001)) * (1.2 + Math.log2(totalElectrons + 1) * 0.4);

      const theta = random() * Math.PI * 2;
      const phi = Math.acos(2 * random() - 1);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      const lerped = innerColor.clone().lerp(baseColor, Math.min(1, radius / 4));
      col[i * 3] = lerped.r;
      col[i * 3 + 1] = lerped.g;
      col[i * 3 + 2] = lerped.b;
    }

    return { positions: pos, colors: col };
  }, [particleCount, totalElectrons]);

  useFrame((_, delta) => {
    if (isPlaying && pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.15;
      pointsRef.current.rotation.x += delta * 0.08;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        vertexColors
        transparent
        opacity={0.65}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};
