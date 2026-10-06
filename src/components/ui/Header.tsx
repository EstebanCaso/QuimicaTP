import React, { useState } from 'react';
import { HelpCircle, Atom, X } from 'lucide-react';
import { Button } from './Button';

export const Header: React.FC = () => {
  const [showHelp, setShowHelp] = useState<boolean>(false);

  return (
    <>
      <header className="w-full h-12 bg-white border-b border-neutral-200 px-4 flex items-center justify-between z-30 select-none">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded bg-blue-600 text-white flex items-center justify-center">
            <Atom className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-neutral-900 leading-tight">
              Tabla Periódica 3D
            </h1>
            <p className="text-[10px] text-neutral-500 leading-none">
              Proyecto de Química · IUPAC 118 Elementos
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowHelp(true)}
            icon={<HelpCircle className="w-3.5 h-3.5 text-neutral-600" />}
            title="Guía de uso y controles"
          >
            <span className="hidden sm:inline">Guía</span>
          </Button>
        </div>
      </header>

      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-neutral-300 shadow-xl max-w-lg w-full p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <div className="flex items-center gap-2">
                <Atom className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-sm text-neutral-900">
                  Guía de Navegación y Funciones
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowHelp(false)}
                className="p-1 rounded text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-neutral-700 space-y-3 leading-relaxed">
              <div>
                <strong className="text-neutral-900 block mb-1">🎮 Controles 3D:</strong>
                <ul className="list-disc list-inside space-y-0.5 text-neutral-600">
                  <li><strong>Rotar:</strong> Clic izquierdo y arrastrar con el mouse.</li>
                  <li><strong>Desplazar (pan):</strong> Clic derecho o rueda presionada.</li>
                  <li><strong>Zoom:</strong> Rueda del mouse o gesto de pellizco en pantalla táctil.</li>
                  <li><strong>Vista Frontal:</strong> Alinea la cámara perpendicular para lectura clásica.</li>
                </ul>
              </div>

              <div>
                <strong className="text-neutral-900 block mb-1">⚛️ Selección Múltiple y URL:</strong>
                <p className="text-neutral-600">
                  Haz clic sobre cualquier elemento para seleccionarlo. Puedes seleccionar un número ilimitado de elementos. El estado se sincroniza automáticamente con la barra de direcciones (<code>?el=H,O,Na</code>) para compartir y guardar.
                </p>
              </div>

              <div>
                <strong className="text-neutral-900 block mb-1">🧪 Generador de Compuestos:</strong>
                <p className="text-neutral-600">
                  Al seleccionar 2 o más elementos, el motor químico calcula fórmulas balanceadas por estados de oxidación conocidos y genera la triple nomenclatura oficial: <strong>Sistemática (IUPAC)</strong>, <strong>Stock</strong> y <strong>Tradicional</strong>.
                </p>
              </div>

              <div>
                <strong className="text-neutral-900 block mb-1">🔬 Átomos y Elementos Superpesados:</strong>
                <p className="text-neutral-600">
                  Visualiza el modelo atómico de capas reales de Bohr o conmuta a la nube cuántica de probabilidad. Para elementos superpesados (Z ≥ 104) donde no existen mediciones físicas macroscópicas, se despliega la historia verídica de su síntesis nuclear.
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-neutral-200 flex justify-end">
              <Button size="sm" variant="primary" onClick={() => setShowHelp(false)}>
                Entendido
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
