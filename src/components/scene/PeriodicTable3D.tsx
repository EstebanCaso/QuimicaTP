import React, { useMemo } from 'react';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { ElementRepository } from '../../domain/elements/element-repository';
import { GROUP_CAS_LABELS, GROUP_TOP_PERIOD } from '../../domain/elements/element-metadata';
import { usePeriodicStore } from '../../store/usePeriodicStore';
import { ElementTile3D } from './ElementTile3D';

const PLACEHOLDER_GEO = new THREE.BoxGeometry(1.0, 1.0, 0.08);
const PLACEHOLDER_EDGES = new THREE.EdgesGeometry(new THREE.BoxGeometry(1.005, 1.005, 0.085));

const GROUPS = Array.from({ length: 18 }, (_, i) => i + 1);
const PERIODS = [1, 2, 3, 4, 5, 6, 7];

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

  const spacing = 1.06;
  const lanthX = (3 - 9.5) * spacing;
  const lanthY = -(6 - 5.0) * spacing;
  const actX = (3 - 9.5) * spacing;
  const actY = -(7 - 5.0) * spacing;

  const periodColX = (0.22 - 9.5) * spacing;
  const fSeriesLabelX = (2.25 - 9.5) * spacing;
  const lanthRowY = -(8.4 - 5.0) * spacing;
  const actRowY = -(9.5 - 5.0) * spacing;

  return (
    <group>
      {/* Stepped Classical Group Headers (1-18 + IA-VIIIA) */}
      {GROUPS.map((g) => {
        const topPeriod = GROUP_TOP_PERIOD[g] || 4;
        const x = (g - 9.5) * spacing;
        const topTileY = -(topPeriod - 5.0) * spacing;
        const labelY = topTileY + 0.72;

        return (
          <group key={`grp-${g}`} position={[x, labelY, 0]}>
            <Text
              position={[0, 0.1, 0]}
              fontSize={0.14}
              color="#1A1917"
              anchorX="center"
              anchorY="middle"
              fontWeight={700}
            >
              {g.toString()}
            </Text>
            <Text
              position={[0, -0.07, 0]}
              fontSize={0.09}
              color="#787163"
              anchorX="center"
              anchorY="middle"
              fontWeight={500}
            >
              {GROUP_CAS_LABELS[g]}
            </Text>
          </group>
        );
      })}

      {/* Left Margin Period Labels (1-7) */}
      <Text
        position={[periodColX, -(1 - 5.0) * spacing + 0.75, 0]}
        fontSize={0.085}
        color="#787163"
        anchorX="center"
        anchorY="middle"
        fontWeight={600}
      >
        PER.
      </Text>
      {PERIODS.map((p) => {
        const y = -(p - 5.0) * spacing;
        return (
          <Text
            key={`per-${p}`}
            position={[periodColX, y, 0]}
            fontSize={0.15}
            color="#57534A"
            anchorX="center"
            anchorY="middle"
            fontWeight={700}
          >
            {p.toString()}
          </Text>
        );
      })}

      {/* 118 Element Tiles */}
      {allElements.map((el) => {
        const isFilteredOut = !filteredSet.has(el.symbol);
        return <ElementTile3D key={el.number} element={el} isFilteredOut={isFilteredOut} />;
      })}

      {/* Lanthanide Callout Placeholder in Period 6, Group 3 */}
      <group position={[lanthX, lanthY, 0]}>
        <mesh geometry={PLACEHOLDER_GEO}>
          <meshStandardMaterial color="#F0D9E2" roughness={0.7} opacity={0.78} transparent />
        </mesh>
        <lineSegments geometry={PLACEHOLDER_EDGES}>
          <lineBasicMaterial color="#CFA8B8" />
        </lineSegments>
        <Text position={[0, 0.16, 0.05]} fontSize={0.13} color="#66243F" fontWeight={700}>
          57–71 *
        </Text>
        <Text position={[0, -0.06, 0.05]} fontSize={0.11} color="#66243F" fontWeight={600}>
          La–Lu
        </Text>
        <Text position={[0, -0.27, 0.05]} fontSize={0.078} color="#7A3B54" fontWeight={500}>
          Lantánidos
        </Text>
      </group>

      {/* Actinide Callout Placeholder in Period 7, Group 3 */}
      <group position={[actX, actY, 0]}>
        <mesh geometry={PLACEHOLDER_GEO}>
          <meshStandardMaterial color="#E8D8EC" roughness={0.7} opacity={0.78} transparent />
        </mesh>
        <lineSegments geometry={PLACEHOLDER_EDGES}>
          <lineBasicMaterial color="#C3A6CC" />
        </lineSegments>
        <Text position={[0, 0.16, 0.05]} fontSize={0.125} color="#522661" fontWeight={700}>
          89–103 **
        </Text>
        <Text position={[0, -0.06, 0.05]} fontSize={0.11} color="#522661" fontWeight={600}>
          Ac–Lr
        </Text>
        <Text position={[0, -0.27, 0.05]} fontSize={0.078} color="#643B73" fontWeight={500}>
          Actínidos
        </Text>
      </group>

      {/* F-Block Row Labels beside Separated Series */}
      <Text
        position={[fSeriesLabelX, lanthRowY, 0]}
        fontSize={0.12}
        color="#66243F"
        anchorX="right"
        anchorY="middle"
        fontWeight={700}
      >
        * 6f
      </Text>
      <Text
        position={[fSeriesLabelX, actRowY, 0]}
        fontSize={0.12}
        color="#522661"
        anchorX="right"
        anchorY="middle"
        fontWeight={700}
      >
        ** 7f
      </Text>
    </group>
  );
};
