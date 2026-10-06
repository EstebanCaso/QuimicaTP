import React, { useMemo } from 'react';
import { Text } from '@react-three/drei';
import { ElementRepository } from '../../domain/elements/element-repository';
import { usePeriodicStore } from '../../store/usePeriodicStore';
import { ElementTile3D } from './ElementTile3D';

export const PeriodicTable3D: React.FC = () => {
  const allElements = useMemo(() => ElementRepository.getAllElements(), []);

  const categoryFilter = usePeriodicStore((s) => s.categoryFilter);
  const blockFilter = usePeriodicStore((s) => s.blockFilter);
  const phaseFilter = usePeriodicStore((s) => s.phaseFilter);
  const searchQuery = usePeriodicStore((s) => s.searchQuery);

  const filteredSet = useMemo(() => {
    const matching = ElementRepository.filterElements({
      category: categoryFilter,
      block: blockFilter,
      phase: phaseFilter,
      search: searchQuery,
    });
    return new Set(matching.map((e) => e.symbol));
  }, [categoryFilter, blockFilter, phaseFilter, searchQuery]);

  const spacing = 1.08;
  const lanthX = (3 - 9.5) * spacing;
  const lanthY = -(6 - 5.0) * spacing;
  const actX = (3 - 9.5) * spacing;
  const actY = -(7 - 5.0) * spacing;

  return (
    <group>
      {/* 118 Element Tiles */}
      {allElements.map((el) => {
        const isFilteredOut = !filteredSet.has(el.symbol);
        return <ElementTile3D key={el.number} element={el} isFilteredOut={isFilteredOut} />;
      })}

      {/* Lanthanide Placeholder Tile in Row 6, Group 3 */}
      <group position={[lanthX, lanthY, 0]}>
        <mesh>
          <boxGeometry args={[1.0, 1.0, 0.08]} />
          <meshStandardMaterial color="#FCE7F3" roughness={0.5} opacity={0.6} transparent />
        </mesh>
        <Text position={[0, 0.15, 0.05]} fontSize={0.15} color="#9D174D" fontWeight={700}>
          57-71
        </Text>
        <Text position={[0, -0.15, 0.05]} fontSize={0.11} color="#9D174D" fontWeight={500}>
          Lantánidos
        </Text>
      </group>

      {/* Actinide Placeholder Tile in Row 7, Group 3 */}
      <group position={[actX, actY, 0]}>
        <mesh>
          <boxGeometry args={[1.0, 1.0, 0.08]} />
          <meshStandardMaterial color="#F3E8FF" roughness={0.5} opacity={0.6} transparent />
        </mesh>
        <Text position={[0, 0.15, 0.05]} fontSize={0.15} color="#6B21A8" fontWeight={700}>
          89-103
        </Text>
        <Text position={[0, -0.15, 0.05]} fontSize={0.11} color="#6B21A8" fontWeight={500}>
          Actínidos
        </Text>
      </group>
    </group>
  );
};
