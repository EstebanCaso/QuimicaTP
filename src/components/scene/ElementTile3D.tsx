import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import type { ChemicalElement } from '../../domain/chemistry-types';
import { CATEGORIES_META, getElementCoordinates } from '../../domain/elements/element-metadata';
import { usePeriodicStore } from '../../store/usePeriodicStore';

interface ElementTile3DProps {
  element: ChemicalElement;
  isFilteredOut: boolean;
}

export const ElementTile3D: React.FC<ElementTile3DProps> = ({ element, isFilteredOut }) => {
  const meshRef = useRef<THREE.Group>(null);

  const selectedSymbols = usePeriodicStore((s) => s.selectedSymbols);
  const toggleElement = usePeriodicStore((s) => s.toggleElement);
  const hoveredElement = usePeriodicStore((s) => s.hoveredElement);
  const setHoveredElement = usePeriodicStore((s) => s.setHoveredElement);

  const isSelected = selectedSymbols.includes(element.symbol);
  const isHovered = hoveredElement?.symbol === element.symbol;

  // Spatial coordinates
  // Center: group 9.5 -> x = 0, period 5 -> y = 0
  const coords = useMemo(() => {
    const raw = getElementCoordinates(element.number, element.period, element.group);
    const spacing = 1.08;
    const posX = (raw.x - 9.5) * spacing;
    const posY = -(raw.y - 5.0) * spacing;
    return { x: posX, y: posY };
  }, [element.number, element.period, element.group]);

  const catMeta = CATEGORIES_META[element.category] || CATEGORIES_META.unknown;

  // Color & Materials
  const baseColor = useMemo(() => new THREE.Color(catMeta.color), [catMeta.color]);
  const highlightColor = useMemo(() => new THREE.Color('#3B82F6'), []);
  const dimmedColor = useMemo(() => new THREE.Color('#E5E7EB'), []);

  // Target Z position for smooth elevation
  const targetZ = isSelected ? 0.35 : isHovered ? 0.25 : 0;
  const currentZ = useRef(0);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const factor = Math.min(1, delta * 14);
    currentZ.current += (targetZ - currentZ.current) * factor;
    meshRef.current.position.z = currentZ.current;
  });

  const tileOpacity = isFilteredOut ? 0.18 : 1.0;

  return (
    <group
      ref={meshRef}
      position={[coords.x, coords.y, 0]}
      onClick={(e) => {
        e.stopPropagation();
        toggleElement(element.symbol);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHoveredElement(element);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        if (hoveredElement?.symbol === element.symbol) {
          setHoveredElement(null);
        }
        document.body.style.cursor = 'default';
      }}
    >
      {/* Base Tile Box */}
      <mesh receiveShadow castShadow>
        <boxGeometry args={[1.0, 1.0, 0.12]} />
        <meshStandardMaterial
          color={isFilteredOut ? dimmedColor : baseColor}
          roughness={0.4}
          metalness={0.05}
          transparent={isFilteredOut}
          opacity={tileOpacity}
        />
      </mesh>

      {/* Selected Border Outline */}
      {isSelected && (
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(1.02, 1.02, 0.14)]} />
          <lineBasicMaterial color={highlightColor} linewidth={2} />
        </lineSegments>
      )}

      {/* Atomic Number (top-left) */}
      <Text
        position={[-0.38, 0.36, 0.07]}
        fontSize={0.11}
        color={isFilteredOut ? '#9CA3AF' : '#27272A'}
        anchorX="left"
        anchorY="top"
        fontWeight={600}
      >
        {element.number.toString()}
      </Text>

      {/* Atomic Mass (top-right) */}
      <Text
        position={[0.38, 0.36, 0.07]}
        fontSize={0.08}
        color={isFilteredOut ? '#9CA3AF' : '#71717A'}
        anchorX="right"
        anchorY="top"
        fontWeight={400}
      >
        {element.atomicMass < 100
          ? element.atomicMass.toFixed(2)
          : Math.round(element.atomicMass).toString()}
      </Text>

      {/* Chemical Symbol (center) */}
      <Text
        position={[0, 0.04, 0.07]}
        fontSize={0.32}
        color={isFilteredOut ? '#9CA3AF' : isSelected ? '#1D4ED8' : '#18181B'}
        anchorX="center"
        anchorY="middle"
        fontWeight={700}
      >
        {element.symbol}
      </Text>

      {/* Element Name in Spanish (bottom) */}
      <Text
        position={[0, -0.34, 0.07]}
        fontSize={0.09}
        color={isFilteredOut ? '#9CA3AF' : '#3F3F46'}
        anchorX="center"
        anchorY="bottom"
        maxWidth={0.9}
        fontWeight={500}
      >
        {element.name}
      </Text>
    </group>
  );
};
