import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Play, Pause, CircleDot, Cloud, RotateCcw } from 'lucide-react';
import type { ChemicalElement } from '../../domain/chemistry-types';
import { Nucleus } from './Nucleus';
import { ElectronShells } from './ElectronShells';
import { OrbitalCloud } from './OrbitalCloud';
import { Button } from '../ui/Button';

interface AtomCanvasProps {
  element: ChemicalElement;
  height?: string;
}

export const AtomCanvas: React.FC<AtomCanvasProps> = ({ element, height = 'h-72' }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [showRings, setShowRings] = useState<boolean>(true);
  const [modelType, setModelType] = useState<'bohr' | 'cloud'>('bohr');
  const [resetKey, setResetKey] = useState<number>(0);

  const protons = element.number;
  const neutrons = Math.max(0, Math.round(element.atomicMass) - protons);
  const totalElectrons = element.number;

  const cameraDistance = Math.max(7, 3.5 + element.electronShells.length * 1.1);

  return (
    <div className={`relative w-full ${height} bg-neutral-50 rounded-lg border border-neutral-200 overflow-hidden select-none`}>
      {/* 3D Canvas */}
      <Canvas
        key={resetKey}
        camera={{ position: [0, 2, cameraDistance], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true }}
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[10, 15, 10]} intensity={1.5} />
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

      {/* Floating Atom Controls Overlay */}
      <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-white/95 backdrop-blur-xs p-1 rounded-md border border-neutral-200 shadow-xs z-10">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setIsPlaying(!isPlaying)}
          title={isPlaying ? 'Pausar animación' : 'Reanudar animación'}
          icon={isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        />

        {modelType === 'bohr' && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowRings(!showRings)}
            title={showRings ? 'Ocultar anillos orbitales' : 'Mostrar anillos orbitales'}
            icon={<CircleDot className={`w-3.5 h-3.5 ${showRings ? 'text-blue-600' : 'text-neutral-400'}`} />}
          />
        )}

        <Button
          size="sm"
          variant={modelType === 'cloud' ? 'primary' : 'ghost'}
          onClick={() => setModelType(modelType === 'bohr' ? 'cloud' : 'bohr')}
          title={modelType === 'bohr' ? 'Cambiar a nube cuántica de probabilidad' : 'Cambiar a modelo de capas de Bohr'}
          icon={<Cloud className="w-3.5 h-3.5" />}
        >
          <span className="text-[11px] hidden sm:inline">
            {modelType === 'bohr' ? 'Capas' : 'Nube'}
          </span>
        </Button>

        <Button
          size="sm"
          variant="ghost"
          onClick={() => setResetKey((k) => k + 1)}
          title="Centrar vista 3D"
          icon={<RotateCcw className="w-3.5 h-3.5" />}
        />
      </div>

      {/* Mini Legend Footer */}
      <div className="absolute bottom-2 left-2 flex items-center gap-3 px-2 py-1 bg-white/95 rounded border border-neutral-200 text-[10px] text-neutral-600">
        <span className="flex items-center gap-1 font-medium">
          <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" />
          Protones: {protons}
        </span>
        <span className="flex items-center gap-1 font-medium">
          <span className="w-2 h-2 rounded-full bg-slate-400 inline-block" />
          Neutrones: {neutrons}
        </span>
        <span className="flex items-center gap-1 font-medium">
          <span className="w-2 h-2 rounded-full bg-sky-500 inline-block" />
          Electrones: {totalElectrons}
        </span>
      </div>
    </div>
  );
};
