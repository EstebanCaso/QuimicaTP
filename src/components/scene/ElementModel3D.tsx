import React, { useRef, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import type { ChemicalElement } from '../../domain/chemistry-types';
import customModelsData from '../../data/custom-models.json';

interface ElementModel3DProps {
  element: ChemicalElement;
  isSelected: boolean;
  isHovered: boolean;
}

// Check if element has an external .glb file registered
const customGlbSet = new Set<string>(customModelsData.customGlbSymbols || []);

function CustomGlbLoader({ symbol }: { symbol: string }) {
  const { scene } = useGLTF(`/models/${symbol}.glb`);
  const cloned = React.useMemo(() => scene.clone(), [scene]);
  return <primitive object={cloned} scale={0.25} />;
}

// 1. Ingot geometry (Gold, Silver, Iron, Copper, Platinum, Aluminum)
const IngotModel: React.FC<{
  color: string;
  metalness?: number;
  roughness?: number;
}> = ({ color, metalness = 0.9, roughness = 0.2 }) => {
  return (
    <group position={[0, 0, 0]}>
      {/* Base trapezoidal block */}
      <mesh castShadow>
        <boxGeometry args={[0.34, 0.18, 0.14]} />
        <meshStandardMaterial color={color} metalness={metalness} roughness={roughness} />
      </mesh>
      {/* Top bevel plate */}
      <mesh position={[0, 0, 0.08]}>
        <boxGeometry args={[0.26, 0.12, 0.04]} />
        <meshStandardMaterial color={color} metalness={metalness} roughness={roughness} />
      </mesh>
    </group>
  );
};

// 2. Diatomic gas molecule (O2, H2, N2, Cl2, F2)
const DiatomicMoleculeModel: React.FC<{
  sphereColor: string;
  bondColor?: string;
  scale?: number;
}> = ({ sphereColor, bondColor = '#94A3B8', scale = 1 }) => {
  return (
    <group scale={scale}>
      {/* Left atom */}
      <mesh position={[-0.14, 0, 0]}>
        <sphereGeometry args={[0.11, 16, 16]} />
        <meshStandardMaterial color={sphereColor} roughness={0.25} metalness={0.1} />
      </mesh>
      {/* Connecting bond cylinder */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.03, 0.03, 0.22, 12]} />
        <meshStandardMaterial color={bondColor} roughness={0.4} metalness={0.2} />
      </mesh>
      {/* Right atom */}
      <mesh position={[0.14, 0, 0]}>
        <sphereGeometry args={[0.11, 16, 16]} />
        <meshStandardMaterial color={sphereColor} roughness={0.25} metalness={0.1} />
      </mesh>
    </group>
  );
};

// 3. Faceted Diamond / Polyhedron (Carbon, Silicon, etc.)
const DiamondModel: React.FC<{ color?: string }> = ({ color = '#38BDF8' }) => {
  return (
    <mesh rotation={[0.4, 0.4, 0]}>
      <octahedronGeometry args={[0.18, 0]} />
      <meshStandardMaterial
        color={color}
        roughness={0.1}
        metalness={0.1}
        transparent
        opacity={0.85}
      />
    </mesh>
  );
};

// 4. Noble Gas Orb with faint energy halo (He, Ne, Ar, Kr, Xe, Rn)
const NobleGasOrb: React.FC<{ color: string }> = ({ color }) => {
  return (
    <group>
      {/* Glowing inner core */}
      <mesh>
        <sphereGeometry args={[0.13, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.6}
          roughness={0.2}
          transparent
          opacity={0.8}
        />
      </mesh>
      {/* Outer faint translucent shell */}
      <mesh>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.25}
          roughness={0.1}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};

// 5. Liquid drop (Mercury Hg, Bromine Br)
const LiquidDropModel: React.FC<{ color: string; metalness?: number }> = ({
  color,
  metalness = 0.95,
}) => {
  return (
    <mesh scale={[1.2, 1.2, 0.8]}>
      <sphereGeometry args={[0.16, 20, 20]} />
      <meshStandardMaterial color={color} metalness={metalness} roughness={0.08} />
    </mesh>
  );
};

// 6. Microchip (Silicon Si)
const MicrochipModel: React.FC = () => {
  return (
    <group rotation={[0.2, 0, 0]}>
      {/* Silicon chip PCB */}
      <mesh>
        <boxGeometry args={[0.3, 0.3, 0.04]} />
        <meshStandardMaterial color="#0F172A" roughness={0.5} metalness={0.3} />
      </mesh>
      {/* Die / CPU core */}
      <mesh position={[0, 0, 0.03]}>
        <boxGeometry args={[0.14, 0.14, 0.03]} />
        <meshStandardMaterial color="#F59E0B" roughness={0.2} metalness={0.9} />
      </mesh>
    </group>
  );
};

// 7. Radioactive / Nuclear canister (U, Pu, Ra, Th)
const NuclearBarrelModel: React.FC = () => {
  return (
    <group rotation={[Math.PI / 8, 0, 0]}>
      {/* Barrel cylinder */}
      <mesh>
        <cylinderGeometry args={[0.12, 0.12, 0.28, 16]} />
        <meshStandardMaterial color="#EAB308" roughness={0.35} metalness={0.4} />
      </mesh>
      {/* Black hazard ring */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.123, 0.123, 0.06, 16]} />
        <meshStandardMaterial color="#18181B" roughness={0.5} />
      </mesh>
    </group>
  );
};

// 8. General Atomic Mini-Model (Fallback for all other elements)
const GeneralAtomModel: React.FC<{
  shellCount: number;
  categoryColor: string;
}> = ({ shellCount, categoryColor }) => {
  const ringCount = Math.min(3, Math.max(1, shellCount));

  return (
    <group>
      {/* Nucleus */}
      <mesh>
        <sphereGeometry args={[0.1, 14, 14]} />
        <meshStandardMaterial color={categoryColor} roughness={0.3} metalness={0.3} />
      </mesh>

      {/* 1 or 2 small tilted orbit rings */}
      {Array.from({ length: ringCount }).map((_, i) => (
        <group key={i} rotation={[i * 0.9 + 0.3, i * 0.7, 0]}>
          <mesh>
            <torusGeometry args={[0.2 + i * 0.09, 0.012, 8, 24]} />
            <meshBasicMaterial color="#94A3B8" transparent opacity={0.5} />
          </mesh>
          <mesh position={[0.2 + i * 0.09, 0, 0]}>
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshBasicMaterial color="#2563EB" />
          </mesh>
        </group>
      ))}
    </group>
  );
};

export const ElementModel3D: React.FC<ElementModel3DProps> = ({
  element,
  isSelected,
  isHovered,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const sym = element.symbol;

  useFrame((_, delta) => {
    if (groupRef.current) {
      // Gentle floating rotation
      const spinSpeed = isHovered ? 1.8 : 0.6;
      groupRef.current.rotation.y += delta * spinSpeed;
      if (isHovered) {
        groupRef.current.rotation.x = Math.sin(Date.now() * 0.003) * 0.2;
      } else {
        groupRef.current.rotation.x = 0.1;
      }
    }
  });

  const baseScale = isSelected ? 1.25 : isHovered ? 1.15 : 0.95;

  // Render external GLB if registered in custom-models.json
  if (customGlbSet.has(sym)) {
    return (
      <group
        ref={groupRef}
        position={[0, 0, 0.28]}
        scale={[baseScale, baseScale, baseScale]}
      >
        <Suspense fallback={null}>
          <CustomGlbLoader symbol={sym} />
        </Suspense>
      </group>
    );
  }

  // Render representative procedural 3D model
  const renderThematicContent = () => {
    switch (sym) {
      // 1. Precious and industrial metals
      case 'Au':
        return <IngotModel color="#F59E0B" metalness={0.96} roughness={0.15} />;
      case 'Ag':
        return <IngotModel color="#F1F5F9" metalness={0.96} roughness={0.12} />;
      case 'Pt':
        return <IngotModel color="#E2E8F0" metalness={0.95} roughness={0.15} />;
      case 'Fe':
        return <IngotModel color="#475569" metalness={0.85} roughness={0.35} />;
      case 'Cu':
        return <IngotModel color="#EA580C" metalness={0.92} roughness={0.22} />;
      case 'Al':
        return <IngotModel color="#CBD5E1" metalness={0.75} roughness={0.4} />;
      case 'Ti':
        return <IngotModel color="#94A3B8" metalness={0.88} roughness={0.25} />;
      case 'W':
        return <IngotModel color="#334155" metalness={0.85} roughness={0.3} />;

      // 2. Diatomic gases
      case 'O':
        return <DiatomicMoleculeModel sphereColor="#EF4444" />;
      case 'H':
        return <DiatomicMoleculeModel sphereColor="#FFFFFF" bondColor="#CBD5E1" />;
      case 'N':
        return <DiatomicMoleculeModel sphereColor="#3B82F6" />;
      case 'Cl':
        return <DiatomicMoleculeModel sphereColor="#84CC16" />;
      case 'F':
        return <DiatomicMoleculeModel sphereColor="#FDE047" />;
      case 'Br':
        return <DiatomicMoleculeModel sphereColor="#B91C1C" />;
      case 'I':
        return <DiamondModel color="#7E22CE" />;

      // 3. Noble gases
      case 'He':
        return <NobleGasOrb color="#FB7185" />;
      case 'Ne':
        return <NobleGasOrb color="#F43F5E" />;
      case 'Ar':
        return <NobleGasOrb color="#A855F7" />;
      case 'Kr':
        return <NobleGasOrb color="#38BDF8" />;
      case 'Xe':
        return <NobleGasOrb color="#06B6D4" />;
      case 'Rn':
        return <NobleGasOrb color="#64748B" />;

      // 4. Nonmetal solids and minerals
      case 'C':
        return <DiamondModel color="#38BDF8" />;
      case 'S':
        return <DiamondModel color="#FACC15" />;
      case 'P':
        return <DiamondModel color="#DC2626" />;
      case 'Si':
        return <MicrochipModel />;

      // 5. Unique liquids
      case 'Hg':
        return <LiquidDropModel color="#E2E8F0" metalness={0.98} />;

      // 6. Nuclear / Radioactive actinoids
      case 'U':
      case 'Pu':
      case 'Ra':
      case 'Th':
        return <NuclearBarrelModel />;

      // 7. General Alkali metals
      case 'Li':
      case 'Na':
      case 'K':
      case 'Rb':
      case 'Cs':
        return <IngotModel color="#E2E8F0" metalness={0.7} roughness={0.4} />;

      // Default: clean orbital mini-atom
      default:
        return (
          <GeneralAtomModel
            shellCount={element.electronShells.length}
            categoryColor={
              element.category === 'alkali-metal'
                ? '#EF4444'
                : element.category === 'alkaline-earth-metal'
                ? '#F97316'
                : element.category === 'transition-metal'
                ? '#64748B'
                : element.category === 'post-transition-metal'
                ? '#10B981'
                : element.category === 'metalloid'
                ? '#EAB308'
                : element.category === 'lanthanide'
                ? '#EC4899'
                : element.category === 'actinide'
                ? '#A855F7'
                : '#0EA5E9'
            }
          />
        );
    }
  };

  return (
    <group
      ref={groupRef}
      position={[0, 0, 0.28]}
      scale={[baseScale, baseScale, baseScale]}
    >
      {renderThematicContent()}
    </group>
  );
};
