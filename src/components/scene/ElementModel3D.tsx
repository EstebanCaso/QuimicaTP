import React, { useRef, useMemo, Suspense } from 'react';
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

// Error Boundary for GLB loading
interface ErrorBoundaryProps {
  fallback: React.ReactNode;
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ModelErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(err: unknown) {
    console.warn('Custom GLB model loading error, falling back to procedural:', err);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

/**
 * Loads any custom .glb file from /models/{symbol}.glb,
 * automatically centers its pivot at (0, 0, 0),
 * and normalizes its scale so it fits neatly above the periodic tile (~0.44 units).
 */
function CustomGlbLoader({ symbol }: { symbol: string }) {
  const { scene } = useGLTF(`/models/${symbol}.glb`);

  const normalizedGroup = useMemo(() => {
    const clone = scene.clone(true);

    // Compute original bounding box
    const box = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    box.getSize(size);
    const center = new THREE.Vector3();
    box.getCenter(center);

    // Calculate scaling factor: largest dimension should be ~0.44 units
    const maxDim = Math.max(size.x, size.y, size.z);
    const targetScale = maxDim > 0 ? 0.44 / maxDim : 0.25;

    // Apply lighting and shadows to all meshes inside
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((m) => {
              m.depthWrite = true;
            });
          } else {
            mesh.material.depthWrite = true;
          }
        }
      }
    });

    const wrapper = new THREE.Group();
    // Offset clone so geometric center aligns precisely with wrapper (0,0,0)
    clone.position.set(-center.x * targetScale, -center.y * targetScale, -center.z * targetScale);
    clone.scale.set(targetScale, targetScale, targetScale);
    wrapper.add(clone);

    return wrapper;
  }, [scene]);

  return <primitive object={normalizedGroup} />;
}

// ================= Procedural Fallback Models =================

// Ingot geometry (Gold, Silver, Iron, Copper, Platinum, Aluminum)
const IngotModel: React.FC<{
  color: string;
  metalness?: number;
  roughness?: number;
}> = ({ color, metalness = 0.92, roughness = 0.2 }) => {
  return (
    <group position={[0, 0, 0]}>
      <mesh castShadow>
        <boxGeometry args={[0.34, 0.18, 0.14]} />
        <meshStandardMaterial color={color} metalness={metalness} roughness={roughness} />
      </mesh>
      <mesh position={[0, 0, 0.08]}>
        <boxGeometry args={[0.26, 0.12, 0.04]} />
        <meshStandardMaterial color={color} metalness={metalness} roughness={roughness} />
      </mesh>
    </group>
  );
};

// Diatomic molecule (O2, H2, N2, Cl2, F2)
const DiatomicMoleculeModel: React.FC<{
  sphereColor: string;
  bondColor?: string;
  scale?: number;
}> = ({ sphereColor, bondColor = '#94A3B8', scale = 1 }) => {
  return (
    <group scale={scale}>
      <mesh position={[-0.14, 0, 0]}>
        <sphereGeometry args={[0.11, 16, 16]} />
        <meshStandardMaterial color={sphereColor} roughness={0.25} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.03, 0.03, 0.22, 12]} />
        <meshStandardMaterial color={bondColor} roughness={0.4} metalness={0.2} />
      </mesh>
      <mesh position={[0.14, 0, 0]}>
        <sphereGeometry args={[0.11, 16, 16]} />
        <meshStandardMaterial color={sphereColor} roughness={0.25} metalness={0.1} />
      </mesh>
    </group>
  );
};

// Faceted Diamond / Polyhedron (Carbon, Silicon, etc.)
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

// Noble Gas Orb with faint energy halo
const NobleGasOrb: React.FC<{ color: string }> = ({ color }) => {
  return (
    <group>
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

// Liquid drop (Mercury Hg)
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

// Microchip (Silicon Si)
const MicrochipModel: React.FC = () => {
  return (
    <group rotation={[0.2, 0, 0]}>
      <mesh>
        <boxGeometry args={[0.3, 0.3, 0.04]} />
        <meshStandardMaterial color="#0F172A" roughness={0.5} metalness={0.3} />
      </mesh>
      <mesh position={[0, 0, 0.03]}>
        <boxGeometry args={[0.14, 0.14, 0.03]} />
        <meshStandardMaterial color="#F59E0B" roughness={0.2} metalness={0.9} />
      </mesh>
    </group>
  );
};

// Radioactive / Nuclear canister
const NuclearBarrelModel: React.FC = () => {
  return (
    <group rotation={[Math.PI / 8, 0, 0]}>
      <mesh>
        <cylinderGeometry args={[0.12, 0.12, 0.28, 16]} />
        <meshStandardMaterial color="#EAB308" roughness={0.35} metalness={0.4} />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.123, 0.123, 0.06, 16]} />
        <meshStandardMaterial color="#18181B" roughness={0.5} />
      </mesh>
    </group>
  );
};

// General Atomic Mini-Model (Fallback)
const GeneralAtomModel: React.FC<{
  shellCount: number;
  categoryColor: string;
}> = ({ shellCount, categoryColor }) => {
  const ringCount = Math.min(3, Math.max(1, shellCount));

  return (
    <group>
      <mesh>
        <sphereGeometry args={[0.1, 14, 14]} />
        <meshStandardMaterial color={categoryColor} roughness={0.3} metalness={0.3} />
      </mesh>

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

  // Render representative procedural 3D model
  const renderThematicContent = () => {
    switch (sym) {
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

      case 'C':
        return <DiamondModel color="#38BDF8" />;
      case 'S':
        return <DiamondModel color="#FACC15" />;
      case 'P':
        return <DiamondModel color="#DC2626" />;
      case 'Si':
        return <MicrochipModel />;

      case 'Hg':
        return <LiquidDropModel color="#E2E8F0" metalness={0.98} />;

      case 'U':
      case 'Pu':
      case 'Ra':
      case 'Th':
        return <NuclearBarrelModel />;

      case 'Li':
      case 'Na':
      case 'K':
      case 'Rb':
      case 'Cs':
        return <IngotModel color="#E2E8F0" metalness={0.7} roughness={0.4} />;

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

  // If a custom GLB is available for this element, load it with auto-normalization & fallback
  if (customGlbSet.has(sym)) {
    return (
      <group
        ref={groupRef}
        position={[0, 0, 0.28]}
        scale={[baseScale, baseScale, baseScale]}
      >
        <ModelErrorBoundary fallback={renderThematicContent()}>
          <Suspense fallback={renderThematicContent()}>
            <CustomGlbLoader symbol={sym} />
          </Suspense>
        </ModelErrorBoundary>
      </group>
    );
  }

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
