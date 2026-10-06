import React, { useEffect } from 'react';
import { usePeriodicStore } from './store/usePeriodicStore';
import { useUrlSelection } from './hooks/useUrlSelection';
import { useWebGLSupport } from './hooks/useWebGLSupport';
import { useMediaQuery } from './hooks/useMediaQuery';
import { Header } from './components/ui/Header';
import { FilterBar } from './components/panels/FilterBar';
import { PeriodicScene } from './components/scene/PeriodicScene';
import { PeriodicTable2D } from './components/scene/PeriodicTable2D';
import { ElementInfoPanel } from './components/panels/ElementInfoPanel';
import { CompoundsPanel } from './components/panels/CompoundsPanel';
import { SelectionBar } from './components/panels/SelectionBar';
import { PeriodicLegend } from './components/panels/PeriodicLegend';
import { HoverHUD } from './components/scene/HoverHUD';

export const App: React.FC = () => {
  // Synchronize selection with ?el=... URL query parameter
  useUrlSelection();

  const isWebGLAvailable = useWebGLSupport();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const viewMode = usePeriodicStore((s) => s.viewMode);
  const setViewMode = usePeriodicStore((s) => s.setViewMode);
  const activePanel = usePeriodicStore((s) => s.activePanel);
  const setActivePanel = usePeriodicStore((s) => s.setActivePanel);

  // Fallback to 2D if WebGL is unavailable
  useEffect(() => {
    if (!isWebGLAvailable && viewMode !== '2d') {
      setViewMode('2d');
    }
  }, [isWebGLAvailable, viewMode, setViewMode]);

  // Global keyboard shortcuts (Escape to close panels)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActivePanel('none');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setActivePanel]);

  return (
    <div className="flex flex-col w-screen h-screen overflow-hidden bg-[#FAFAFA] text-[#18181B]">
      {/* App Header */}
      <Header />

      {/* Filter and View Controls Bar */}
      <FilterBar />

      {/* Main Workspace Area */}
      <div className="flex-1 relative flex overflow-hidden">
        {/* Periodic Table View Area */}
        <main className="flex-1 relative h-full w-full overflow-hidden">
          {viewMode === '2d' || !isWebGLAvailable ? (
            <PeriodicTable2D />
          ) : (
            <PeriodicScene />
          )}

          {/* Interactive Overlays */}
          <PeriodicLegend />
          <HoverHUD />
        </main>

        {/* Desktop Side Panel */}
        {!isMobile && activePanel !== 'none' && (
          <aside className="h-full shrink-0 z-20">
            {activePanel === 'info' && <ElementInfoPanel />}
            {activePanel === 'compounds' && <CompoundsPanel />}
          </aside>
        )}

        {/* Mobile Bottom Sheet Overlay */}
        {isMobile && activePanel !== 'none' && (
          <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-2xs flex flex-col justify-end">
            <div
              className="w-full max-h-[85vh] bg-white rounded-t-xl overflow-hidden shadow-2xl flex flex-col animate-in slide-in-from-bottom duration-200"
            >
              {activePanel === 'info' && <ElementInfoPanel />}
              {activePanel === 'compounds' && <CompoundsPanel />}
            </div>
          </div>
        )}

        {/* Floating Selection Bar */}
        <SelectionBar />
      </div>
    </div>
  );
};

export default App;
