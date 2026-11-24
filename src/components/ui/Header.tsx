import React, { useState } from 'react';
import { RotateCcw, X } from 'lucide-react';
import { usePeriodicStore } from '../../store/usePeriodicStore';
import { Button } from './Button';

export const Header: React.FC = () => {
  const [showHelp, setShowHelp] = useState<boolean>(false);

  const viewMode = usePeriodicStore((s) => s.viewMode);
  const setViewMode = usePeriodicStore((s) => s.setViewMode);
  const triggerCameraReset = usePeriodicStore((s) => s.triggerCameraReset);
  const show3DObjects = usePeriodicStore((s) => s.show3DObjects);
  const toggle3DObjects = usePeriodicStore((s) => s.toggle3DObjects);

  return (
    <>
      <header className="w-full bg-[#FCFBF7] border-b border-[#1A1917] px-3 sm:px-5 py-2 flex flex-wrap items-center justify-between gap-3 z-30 select-none">
        {/* Left: Classical Periodic Wall-Chart Cartouche */}
        <div className="flex items-center gap-3">
          {/* Miniature Authentic Hydrogen Specimen Cell */}
          <div
            className="w-9 h-10 bg-[#D4E6EC] border border-[#1A1917] flex flex-col justify-between p-1 shrink-0"
            aria-hidden="true"
          >
            <div className="flex justify-between items-center font-mono text-[7px] leading-none text-[#1A1917]">
              <span className="font-semibold">1</span>
              <span>1.008</span>
            </div>
            <div className="font-sans font-bold text-sm leading-none text-center text-[#1A1917]">
              H
            </div>
            <div className="font-mono text-[6px] leading-none text-center uppercase tracking-tighter text-[#164859]">
              1s¹
            </div>
          </div>

          <div>
            <div className="flex items-baseline gap-2.5">
              <h1 className="font-serif text-base sm:text-lg font-semibold tracking-tight text-[#1A1917] leading-none">
                Tabla Periódica de los Elementos
              </h1>
              <span className="hidden lg:inline-block font-mono text-[10px] uppercase tracking-widest text-[#857F72] border-l border-[#D5CFC2] pl-2.5">
                IUPAC · Z = 1–118
              </span>
            </div>
            <p className="font-mono text-[10px] text-[#57534A] leading-tight mt-0.5">
              Lámina Tridimensional Interactiva y Formulación Estequiométrica · T = 298.15 K (25 °C)
            </p>
          </div>
        </div>

        {/* Right: Technical Title-Block Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Segmented View Switcher */}
          <div
            className="inline-flex border border-[#1A1917] bg-[#EDE9DF]"
            role="group"
            aria-label="Modo de visualización"
          >
            <button
              type="button"
              onClick={() => setViewMode('3d')}
              className={`px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider cursor-pointer transition-colors border-r border-[#1A1917] ${
                viewMode === '3d'
                  ? 'bg-[#1A1917] text-[#FCFBF7] font-semibold'
                  : 'bg-[#FCFBF7] text-[#57534A] hover:bg-[#EDE9DF] hover:text-[#1A1917]'
              }`}
              title="Espacio tridimensional con cámara orbital"
            >
              3D Orbital
            </button>

            <button
              type="button"
              onClick={() => setViewMode('flat')}
              className={`px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider cursor-pointer transition-colors border-r border-[#1A1917] ${
                viewMode === 'flat'
                  ? 'bg-[#1A1917] text-[#FCFBF7] font-semibold'
                  : 'bg-[#FCFBF7] text-[#57534A] hover:bg-[#EDE9DF] hover:text-[#1A1917]'
              }`}
              title="Vista frontal perpendicular clásica"
            >
              Frontal
            </button>

            <button
              type="button"
              onClick={() => setViewMode('2d')}
              className={`px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider cursor-pointer transition-colors ${
                viewMode === '2d'
                  ? 'bg-[#1A1917] text-[#FCFBF7] font-semibold'
                  : 'bg-[#FCFBF7] text-[#57534A] hover:bg-[#EDE9DF] hover:text-[#1A1917]'
              }`}
              title="Retícula plana HTML accesible"
            >
              Retícula 2D
            </button>
          </div>

          {/* 3D Specimens Toggle */}
          {viewMode === '3d' && (
            <button
              type="button"
              onClick={toggle3DObjects}
              className={`px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider border cursor-pointer transition-colors rounded-[2px] ${
                show3DObjects
                  ? 'bg-[#E6ECF4] text-[#1B3B6F] border-[#1B3B6F] font-semibold'
                  : 'bg-[#FCFBF7] text-[#57534A] border-[#B8B0A0] hover:border-[#1A1917]'
              }`}
              title="Alternar muestras 3D sobre cada elemento"
            >
              Muestras 3D: {show3DObjects ? 'SÍ' : 'NO'}
            </button>
          )}

          {/* Reset Camera */}
          {viewMode !== '2d' && (
            <Button
              size="sm"
              variant="secondary"
              onClick={triggerCameraReset}
              icon={<RotateCcw className="w-3 h-3" />}
              title="Restablecer encuadre de cámara"
            >
              <span className="hidden md:inline font-mono uppercase text-[10px]">Encuadrar</span>
            </Button>
          )}

          {/* Manual & Key Modal */}
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setShowHelp(true)}
            title="Clave de lectura y manual de uso"
          >
            <span className="font-mono uppercase text-[10px]">Clave / Guía</span>
          </Button>
        </div>
      </header>

      {/* Editorial Reference & Key Modal */}
      {showHelp && (
        <div className="fixed inset-0 z-50 bg-[#1A1917]/50 flex items-center justify-center p-4">
          <div className="bg-[#FCFBF7] border-2 border-[#1A1917] max-w-xl w-full overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#1A1917] bg-[#EDE9DF] px-5 py-3">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#57534A] block">
                  Nota Metodológica · Estándar IUPAC
                </span>
                <h3 className="font-serif font-semibold text-base text-[#1A1917]">
                  Clave de Lectura y Manual de Operación
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowHelp(false)}
                className="p-1.5 border border-transparent hover:border-[#1A1917] text-[#57534A] hover:text-[#1A1917] cursor-pointer"
                aria-label="Cerrar ventana"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-5 max-h-[80vh] overflow-y-auto text-xs text-[#1A1917]">
              {/* Classic Element Key Diagram */}
              <div className="border border-[#D5CFC2] bg-[#F5F2EA] p-4 flex flex-col sm:flex-row items-center gap-5">
                <div className="w-28 h-32 bg-[#DCE3E8] border-2 border-[#1A1917] p-2 flex flex-col justify-between shrink-0 relative">
                  <div className="flex justify-between items-start font-mono text-[11px] text-[#1A1917]">
                    <span className="font-bold">26</span>
                    <span className="text-[10px] text-[#57534A]">55.85</span>
                  </div>
                  <div className="text-center my-auto">
                    <div className="text-3xl font-bold tracking-tight text-[#1A1917] leading-none">
                      Fe
                    </div>
                    <div className="text-[10px] font-medium text-[#243746] mt-1">Hierro</div>
                  </div>
                  <div className="font-mono text-[9px] text-center text-[#57534A] border-t border-[#B0BEC9] pt-1">
                    [Ar] 3d⁶ 4s²
                  </div>
                </div>

                <div className="space-y-1.5 text-[11px] text-[#57534A] font-mono">
                  <div>
                    <strong className="text-[#1A1917]">26 (Sup. Izq.):</strong> Número atómico (Z, protones en el núcleo).
                  </div>
                  <div>
                    <strong className="text-[#1A1917]">55.85 (Sup. Der.):</strong> Masa atómica estándar relativa (u).
                  </div>
                  <div>
                    <strong className="text-[#1A1917]">Fe (Centro):</strong> Símbolo químico internacional IUPAC.
                  </div>
                  <div>
                    <strong className="text-[#1A1917]">Color de fondo:</strong> Serie o familia química litográfica.
                  </div>
                </div>
              </div>

              {/* Sections */}
              <div className="grid sm:grid-cols-2 gap-4 leading-relaxed">
                <div className="border-t border-[#D5CFC2] pt-2.5">
                  <h4 className="font-mono text-[10px] uppercase tracking-wider font-semibold text-[#1B3B6F] mb-1">
                    I. Exploración Espacial 3D
                  </h4>
                  <p className="text-[#57534A]">
                    Arrastra con clic izquierdo para orbitar, clic derecho para desplazar el plano y rueda para acercar. El modo <strong>Frontal</strong> elimina la perspectiva para lectura mural clásica.
                  </p>
                </div>

                <div className="border-t border-[#D5CFC2] pt-2.5">
                  <h4 className="font-mono text-[10px] uppercase tracking-wider font-semibold text-[#1B3B6F] mb-1">
                    II. Selección Múltiple y Enlace URL
                  </h4>
                  <p className="text-[#57534A]">
                    Pulsa sobre cualquier casilla para añadirla o retirarla. La barra de direcciones conserva la selección (<code>?el=H,O,Na</code>) para compartirla directamente.
                  </p>
                </div>

                <div className="border-t border-[#D5CFC2] pt-2.5">
                  <h4 className="font-mono text-[10px] uppercase tracking-wider font-semibold text-[#1B3B6F] mb-1">
                    III. Motor de Formulación Química
                  </h4>
                  <p className="text-[#57534A]">
                    Con 2 o más elementos seleccionados se calculan compuestos binarios y ternarios por neutralidad de cargas, indicando nomenclatura <strong>IUPAC</strong>, <strong>Stock</strong> y <strong>Tradicional</strong>.
                  </p>
                </div>

                <div className="border-t border-[#D5CFC2] pt-2.5">
                  <h4 className="font-mono text-[10px] uppercase tracking-wider font-semibold text-[#1B3B6F] mb-1">
                    IV. Elementos Superpesados (Z ≥ 104)
                  </h4>
                  <p className="text-[#57534A]">
                    Donde la vida media nuclear impide mediciones macroscópicas, se documenta la reacción nuclear de síntesis, laboratorio, semidesintegración y etimología oficial.
                  </p>
                </div>
              </div>
            </div>

            <div className="px-5 py-3 bg-[#EDE9DF] border-t border-[#1A1917] flex justify-end">
              <Button size="sm" variant="primary" onClick={() => setShowHelp(false)}>
                Cerrar Guía
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
