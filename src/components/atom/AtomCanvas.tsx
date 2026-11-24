import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Play, Pause, RotateCcw } from 'lucide-react';
import type { ChemicalElement } from '../../domain/chemistry-types';
import { Nucleus } from './Nucleus';
import { ElectronShells } from './ElectronShells';
import { OrbitalCloud } from './OrbitalCloud';

interface AtomCanvasProps {
  element: ChemicalElement;
  height?: string;
}

export const AtomCanvas: React.FC<AtomCanvasProps> = ({ element, height = 'h-64' }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [showRings, setShowRings] = useState<boolean>(true);
  const [modelType, setModelType] = useState<'bohr' | 'cloud'>('bohr');
  const [resetKey, setResetKey] = useState<number>(0);

  const protons = element.number;
  const neutrons = Math.max(0, Math.round(element.atomicMass) - protons);
  const totalElectrons = element.number;

  const cameraDistance = Math.max(7, 3.5 + element.electronShells.length * 1.1);

  return (
    <div className={`relative w-full ${height} bg-[#F5F2EA] border border-[#1A1917] overflow-hidden select-none`}>
      {/* 3D Canvas */}
      <Canvas
        key={resetKey}
        camera={{ position: [0, 2, cameraDistance], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true }}
      >
        <color attach="background" args={['#F5F2EA']} />
        <ambientLight intensity={1.3} />
        <directionalLight position={[10, 15, 10]} intensity={1.4} />
        <directionalLight position={[-10, -10, -10]} intensity={0.5} />

        <Nucleus protons={protons} neutrons={neutrons} />

        {modelType === 'bohr' ? (
          <ElectronShells
            shells={element.electronShells}
            isPlaying={isPlaying}
            showRings={showRings}
          />
        ) : (
          <OrbitalCloud totalElectrons={totalElectrons} isPlaying={isPlaying} />
        )}

        <OrbitControls
          enableDamping
          dampingFactor={0.08}
          minDistance={3}
          maxDistance={40}
        />
      </Canvas>

      {/* Top-left Figure Caption */}
      <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-[#FCFBF7] border border-[#C8C1B2] font-mono text-[9px] uppercase tracking-wider text-[#57534A] pointer-events-none">
        {modelType === 'bohr' ? 'Modelo de Bohr (Capas)' : 'Densidad Orbital |ψ|²'}
      </div>

      {/* Top-right Technical Controls */}
      <div className="absolute top-2 right-2 inline-flex bg-[#FCFBF7] border border-[#1A1917] z-10">
        <button
          type="button"
          onClick={() => setIsPlaying(!isPlaying)}
          className="px-2 py-1 text-[#1A1917] hover:bg-[#EDE9DF] border-r border-[#D5CFC2] cursor-pointer"
          title={isPlaying ? 'Pausar animación orbital' : 'Reanudar animación orbital'}
        >
          {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
        </button>

        {modelType === 'bohr' && (
          <button
            type="button"
            onClick={() => setShowRings(!showRings)}
            className={`px-2 py-1 font-mono text-[10px] uppercase border-r border-[#D5CFC2] cursor-pointer ${
              showRings ? 'bg-[#E6ECF4] text-[#1B3B6F] font-semibold' : 'text-[#57534A] hover:bg-[#EDE9DF]'
            }`}
            title={showRings ? 'Ocultar guías orbitales' : 'Mostrar guías orbitales'}
          >
            Órbitas
          </button>
        )}

        <button
          type="button"
          onClick={() => setModelType(modelType === 'bohr' ? 'cloud' : 'bohr')}
          className={`px-2 py-1 font-mono text-[10px] uppercase border-r border-[#D5CFC2] cursor-pointer ${
            modelType === 'cloud'
              ? 'bg-[#1B3B6F] text-[#FCFBF7] font-semibold'
              : 'text-[#1A1917] hover:bg-[#EDE9DF]'
          }`}
          title="Conmutar entre modelo de capas de Bohr y nube de probabilidad cuántica"
        >
          {modelType === 'bohr' ? 'Nube ψ²' : 'Bohr'}
        </button>

        <button
          type="button"
          onClick={() => setResetKey((k) => k + 1)}
          className="px-2 py-1 text-[#1A1917] hover:bg-[#EDE9DF] cursor-pointer"
          title="Restablecer vista del átomo"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
      </div>

      {/* Subatomic Particle Tally Footer */}
      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between px-2.5 py-1 bg-[#FCFBF7] border border-[#C8C1B2] font-mono text-[10px] text-[#57534A]">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 bg-[#2563EB] inline-block" />
          p⁺ = <strong className="text-[#1A1917]">{protons}</strong>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 bg-[#94A3B8] inline-block" />
          n⁰ ≈ <strong className="text-[#1A1917]">{neutrons}</strong>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 bg-[#0284C7] inline-block" />
          e⁻ = <strong className="text-[#1A1917]">{totalElectrons}</strong>
        </span>
      </div>
    </div>
  );
};
