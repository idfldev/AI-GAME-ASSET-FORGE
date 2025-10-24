
import React, { useState } from 'react';
import { CardGenerator } from './components/CardGenerator';
import { MapGenerator } from './components/MapGenerator';
import { LayoutGrid, Map } from 'lucide-react';

type GeneratorMode = 'card' | 'map';

const App: React.FC = () => {
  const [mode, setMode] = useState<GeneratorMode>('card');

  const NavButton = ({ active, onClick, children }: { active: boolean, onClick: () => void, children: React.ReactNode }) => (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
        active
          ? 'bg-cyan-600 text-white'
          : 'text-gray-400 hover:bg-gray-700 hover:text-white'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col">
      <header className="bg-gray-800 shadow-lg z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-wider font-scifi">
            <span className="text-cyan-400">AI</span> Game Asset Forge
          </h1>
          <nav className="flex items-center gap-2 bg-gray-900 p-1 rounded-lg">
            <NavButton active={mode === 'card'} onClick={() => setMode('card')}>
              <LayoutGrid size={16} /> Card Generator
            </NavButton>
            <NavButton active={mode === 'map'} onClick={() => setMode('map')}>
              <Map size={16} /> Map Generator
            </NavButton>
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 md:p-8">
        {mode === 'card' ? <CardGenerator /> : <MapGenerator />}
      </main>

      <footer className="text-center py-4 text-xs text-gray-500">
        Powered by Google Gemini API.
      </footer>
    </div>
  );
};

export default App;
