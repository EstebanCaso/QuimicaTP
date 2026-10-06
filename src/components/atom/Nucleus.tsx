import React, { useMemo } from 'react';

interface NucleusProps {
  protons: number;
  neutrons: number;
}

export const Nucleus: React.FC<NucleusProps> = ({ protons, neutrons }) => {
  // Cap displayed particle count for ultra-heavy elements to preserve 60 FPS
  const maxDisplayParticles = 90;
  const total = protons + neutrons;
  const ratio = total > maxDisplayParticles ? maxDisplayParticles / total : 1;
  const displayProtons = Math.max(1, Math.round(protons * ratio));
  const displayNeutrons = Math.max(0, Math.round(neutrons * ratio));

  // Generate deterministic cluster positions inside a sphere
  const { protonPositions, neutronPositions } = useMemo(() => {
    const pPos: [number, number, number][] = [];
    const nPos: [number, number, number][] = [];

    const radius = Math.min(0.8, 0.25 + Math.cbrt(total) * 0.08);

    // Seeded pseudo-random generator
    let seed = protons * 1000 + neutrons;
    const random = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    for (let i = 0; i < displayProtons; i++) {
      const u = random();
      const v = random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = Math.cbrt(random()) * radius;
      const sinPhi = Math.sin(phi);
      pPos.push([
        r * sinPhi * Math.cos(theta),
        r * sinPhi * Math.sin(theta),
        r * Math.cos(phi),
      ]);
    }

    for (let i = 0; i < displayNeutrons; i++) {
      const u = random();
      const v = random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = Math.cbrt(random()) * radius;
      const sinPhi = Math.sin(phi);
      nPos.push([
        r * sinPhi * Math.cos(theta),
        r * sinPhi * Math.sin(theta),
        r * Math.cos(phi),
      ]);
    }

    return { protonPositions: pPos, neutronPositions: nPos };
  }, [protons, neutrons, total, displayProtons, displayNeutrons]);

  return (
    <group>
      {/* Protons: Blue Spheres */}
      {protonPositions.map((pos, idx) => (
        <mesh key={`p-${idx}`} position={pos}>
          <sphereGeometry args={[0.07, 12, 12]} />
          <meshStandardMaterial color="#2563EB" roughness={0.3} metalness={0.2} />
        </mesh>
      ))}

      {/* Neutrons: Neutral Slate Spheres */}
      {neutronPositions.map((pos, idx) => (
        <mesh key={`n-${idx}`} position={pos}>
          <sphereGeometry args={[0.07, 12, 12]} />
          <meshStandardMaterial color="#94A3B8" roughness={0.4} metalness={0.1} />
        </mesh>
      ))}
    </group>
  );
};
