import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import type { ChemicalElement } from '../../domain/chemistry-types';
import { CATEGORIES_META, getElementCoordinates } from '../../domain/elements/element-metadata';
import { usePeriodicStore } from '../../store/usePeriodicStore';
import { ElementModel3D } from './ElementModel3D';

interface ElementTile3DProps {
  element: ChemicalElement;
  isFilteredOut: boolean;
}

// Shared geometries for all 118 tiles to minimize GPU memory & draw overhead
const SHARED_TILE_GEO = new THREE.BoxGeometry(1.0, 1.0, 0.12);
const SHARED_BORDER_EDGES = new THREE.EdgesGeometry(new THREE.BoxGeometry(1.005, 1.005, 0.125));
const SHARED_SELECTED_EDGES = new THREE.EdgesGeometry(new THREE.BoxGeometry(1.03, 1.03, 0.15));

export const ElementTile3D: React.FC<ElementTile3DProps> = ({ element, isFilteredOut }) => {
  const meshRef = useRef<THREE.Group>(null);

  const selectedSymbols = usePeriodicStore((s) => s.selectedSymbols);
  const toggleElement = usePeriodicStore((s) => s.toggleElement);
  const hoveredElement = usePeriodicStore((s) => s.hoveredElement);
  const setHoveredElement = usePeriodicStore((s) => s.setHoveredElement);
  const viewMode = usePeriodicStore((s) => s.viewMode);
  const show3DObjects = usePeriodicStore((s) => s.show3DObjects);

  const isSelected = selectedSymbols.includes(element.symbol);
  const isHovered = hoveredElement?.symbol === element.symbol;

  // Show 3D objects ONLY in 3D mode when enabled and not filtered out
  const shouldRender3DModel = viewMode === '3d' && show3DObjects && !isFilteredOut;

  // Spatial coordinates
  const coords = useMemo(() => {
    const raw = getElementCoordinates(element.number, element.period, element.group);
    const spacing = 1.06;
    const posX = (raw.x - 9.5) * spacing;
    const posY = -(raw.y - 5.0) * spacing;
    return { x: posX, y: posY };
  }, [element.number, element.period, element.group]);

  const catMeta = CATEGORIES_META[element.category] || CATEGORIES_META.unknown;

  // Colors
  const baseColor = useMemo(() => new THREE.Color(catMeta.color), [catMeta.color]);
  const borderRuleColor = useMemo(() => new THREE.Color(catMeta.borderColor), [catMeta.borderColor]);
  const prussianColor = useMemo(() => new THREE.Color('#1B3B6F'), []);
  const inkColor = useMemo(() => new THREE.Color('#1A1917'), []);
  const dimmedColor = useMemo(() => new THREE.Color('#E8E4DA'), []);

  // Smooth elevation on Z
  const targetZ = isSelected ? 0.36 : isHovered ? 0.24 : 0;
  const currentZ = useRef(0);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const factor = Math.min(1, delta * 14);
    currentZ.current += (targetZ - currentZ.current) * factor;
    meshRef.current.position.z = currentZ.current;
  });

  const tileOpacity = isFilteredOut ? 0.22 : 1.0;

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
      {/* Lithographic Tile Block */}
      <mesh geometry={SHARED_TILE_GEO} receiveShadow castShadow>
        <meshStandardMaterial
          color={isFilteredOut ? dimmedColor : baseColor}
          roughness={0.65}
          metalness={0.02}
          transparent={isFilteredOut}
          opacity={tileOpacity}
        />
      </mesh>

      {/* Architectural Hairline Cell Border (gives traditional printed cell definition) */}
      <lineSegments geometry={SHARED_BORDER_EDGES}>
        <lineBasicMaterial
          color={isSelected ? prussianColor : isHovered ? inkColor : borderRuleColor}
          transparent={isFilteredOut}
          opacity={isFilteredOut ? 0.2 : 0.85}
        />
      </lineSegments>

      {/* Outer Frame when Selected */}
      {isSelected && (
        <lineSegments geometry={SHARED_SELECTED_EDGES}>
          <lineBasicMaterial color={inkColor} />
        </lineSegments>
      )}

      {/* Atomic Number (top-left) */}
      <Text
        position={[-0.41, 0.4, 0.068]}
        fontSize={0.11}
        color={isFilteredOut ? '#9E988B' : '#1A1917'}
        anchorX="left"
        anchorY="top"
        fontWeight={700}
      >
        {element.number.toString()}
      </Text>

      {/* Atomic Mass (top-right) */}
      <Text
        position={[0.41, 0.4, 0.068]}
        fontSize={0.082}
        color={isFilteredOut ? '#9E988B' : '#57534A'}
        anchorX="right"
        anchorY="top"
        fontWeight={500}
      >
        {element.atomicMass < 100
          ? element.atomicMass.toFixed(2)
          : Math.round(element.atomicMass).toString()}
      </Text>

      {/* 3D Thematic / GLB Model (Visible strictly in 3D mode) */}
      {shouldRender3DModel && (
        <ElementModel3D
          element={element}
          isSelected={isSelected}
          isHovered={isHovered}
        />
      )}

      {/* Chemical Symbol */}
      <Text
        position={shouldRender3DModel ? [0, -0.21, 0.068] : [0, 0.03, 0.068]}
        fontSize={shouldRender3DModel ? 0.22 : 0.33}
        color={isFilteredOut ? '#9E988B' : isSelected ? '#1B3B6F' : '#1A1917'}
        anchorX="center"
        anchorY="middle"
        fontWeight={700}
      >
        {element.symbol}
      </Text>

      {/* Element Name in Spanish (bottom) */}
      <Text
        position={[0, -0.4, 0.068]}
        fontSize={shouldRender3DModel ? 0.075 : 0.088}
        color={isFilteredOut ? '#9E988B' : '#3A3731'}
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
