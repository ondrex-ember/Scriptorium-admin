import React from 'react';
import { Play, FastForward, RotateCcw, Download, Sparkles, AlertTriangle, ShieldCheck, Compass, Layers, RefreshCw, GitBranch, Cpu } from 'lucide-react';
import { GameStateData } from '../types';

interface NavbarProps {
  state: GameStateData;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onRunTick: () => void;
  onRunWeek: () => void;
  onResetState: () => void;
  onOpenExportModal: () => void;
  syncMode: 'local' | 'github';
  onToggleSyncMode: (mode: 'local' | 'github') => void;
  onSyncGithub: () => void;
  isSyncingGithub: boolean;
  lastGithubSyncTime: string | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  state,
  activeTab,
  setActiveTab,
  onRunTick,
  onRunWeek,
  onResetState,
  onOpenExportModal,
  syncMode,
  onToggleSyncMode,
  onSyncGithub,
  isSyncingGithub,
  lastGithubSyncTime,
}) => {
  const seasonNames = ['Jaro', 'Léto', 'Podzim', 'Zima'];
  const seasonIcons = ['🌱', '☀️', '🍂', '❄️'];

  const tabs = [
    { id: 'overview', label: '1. Stav světa', sub: 'Overview', icon: '🏰' },
    { id: 'influences', label: '2. Co jej ovlivňuje', sub: 'Řetězce & Počasí', icon: '🔗' },
    { id: 'actors', label: '3. Aktéři & Vztahy', sub: 'Matice & Role', icon: '👥' },
    { id: 'glassworks', label: '4. Sklárna & Nový Aktér', sub: 'Scriptorium Propojení', icon: '🧪' },
    { id: 'hotspots', label: '5. Co hoří 🔥', sub: 'Krize & Ohniska', icon: '🔥' },
    { id: 'scriptorium', label: '6. Skriptorium & GM', sub: 'Petice & Zprávy', icon: '📜' },
    { id: 'trends', label: '7. Trend & Rozvoj', sub: 'Co by bylo hezké', icon: '📈' },
  ];

  const hasGlassmaker = state.actors.some(a => a.id === 'sklar');

  return (
    <header id="admin-navbar" className="bg-stone-900 text-stone-100 border-b border-amber-900/40 sticky top-0 z-40 shadow-xl">
      {/* Top utility bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 border-b border-stone-800 text-xs">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-950 border border-amber-700/60 flex items-center justify-center text-amber-400 font-serif font-bold text-lg shadow-inner">
            ⚡
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-amber-200 tracking-wider text-sm">CHRONICON</span>
              <span className="bg-amber-900/80 text-amber-300 px-2 py-0.5 rounded text-[10px] font-mono border border-amber-700/50">
                ADMIN v2.5
              </span>
            </div>
            <p className="text-stone-400 text-[11px] hidden sm:block">Generativní engine světa Scriptorium (1465 Olomouc)</p>
          </div>
        </div>

        {/* Sync Mode Switcher Pill */}
        <div className="flex items-center bg-stone-950 p-1 rounded-xl border border-stone-800">
          <button
            onClick={() => onToggleSyncMode('local')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              syncMode === 'local'
                ? 'bg-amber-900 text-amber-100 border border-amber-700 shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
            title="Lokální simulace v aplikaci"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Lokální Simulace</span>
          </button>

          <button
            onClick={() => onToggleSyncMode('github')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              syncMode === 'github'
                ? 'bg-sky-950 text-sky-200 border border-sky-700/80 shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
            title="Živá synchronizace s GitHub repozitářem ondrex-ember/chronicon"
          >
            <GitBranch className="w-3.5 h-3.5 text-sky-400" />
            <span>GitHub Sync</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-0.5"></span>
          </button>

          {syncMode === 'github' && (
            <button
              onClick={onSyncGithub}
              disabled={isSyncingGithub}
              className="ml-1 p-1 bg-stone-800 hover:bg-stone-700 text-sky-300 rounded-lg border border-stone-700 transition-colors"
              title="Obnovit data z GitHub repozitáře"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncingGithub ? 'animate-spin text-amber-400' : ''}`} />
            </button>
          )}
        </div>

        {/* Live world time badge */}
        <div className="flex items-center gap-3 bg-stone-950/80 px-3 py-1.5 rounded-lg border border-stone-800 text-stone-300 font-mono text-[11px]">
          <span className="text-base">{seasonIcons[state.time.season]}</span>
          <span className="font-semibold text-amber-300">
            {seasonNames[state.time.season]} {state.time.year}
          </span>
          <span className="text-stone-500">•</span>
          <span>Den {state.time.day}/90</span>
          <span className="text-stone-500">•</span>
          <span className="text-amber-400/90">Tick #{state.time.totalTick}</span>
          <span className="text-stone-500">•</span>
          <span className="text-sky-300">{state.weather.icon} {state.weather.name}</span>
        </div>

        {/* Global Tension pill */}
        <div className="flex items-center gap-2">
          <div className={`px-2.5 py-1 rounded-full border text-[11px] font-semibold flex items-center gap-1.5 ${
            state.globalTension > 40 
              ? 'bg-rose-950/80 border-rose-700/80 text-rose-300 animate-pulse' 
              : 'bg-amber-950/60 border-amber-800/60 text-amber-300'
          }`}>
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Napětí: {state.globalTension}%</span>
          </div>

          {hasGlassmaker ? (
            <div className="bg-emerald-950/80 border border-emerald-700/80 text-emerald-300 px-2.5 py-1 rounded-full text-[10px] font-medium flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              <span>Sklárna aktivní</span>
            </div>
          ) : (
            <button 
              onClick={() => setActiveTab('glassworks')}
              className="bg-amber-800 hover:bg-amber-700 text-amber-100 px-2.5 py-1 rounded-full text-[10px] font-medium flex items-center gap-1 transition-all shadow-sm"
            >
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>+ Připojit Sklárnu</span>
            </button>
          )}
        </div>

        {/* Simulation Control Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            id="btn-run-tick"
            onClick={onRunTick}
            className="bg-amber-700 hover:bg-amber-600 text-stone-100 px-3 py-1 rounded text-xs font-medium flex items-center gap-1.5 transition-colors shadow-sm"
            title="Spustit 1 tick (6 hodin)"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span className="hidden md:inline">+1 Tick (6h)</span>
          </button>
          <button
            id="btn-run-week"
            onClick={onRunWeek}
            className="bg-amber-900/80 hover:bg-amber-800 text-amber-200 border border-amber-700/60 px-3 py-1 rounded text-xs font-medium flex items-center gap-1.5 transition-colors"
            title="Spustit 1 celý týden (28 ticků)"
          >
            <FastForward className="w-3.5 h-3.5" />
            <span className="hidden md:inline">+1 Týden</span>
          </button>
          <button
            onClick={onOpenExportModal}
            className="bg-stone-800 hover:bg-stone-700 text-stone-300 px-2.5 py-1 rounded text-xs flex items-center gap-1 transition-colors"
            title="Export / Import JSON state"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">JSON</span>
          </button>
          <button
            onClick={onResetState}
            className="bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-stone-200 p-1 rounded transition-colors"
            title="Reset do výchozího stavu"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 overflow-x-auto no-scrollbar">
        <nav className="flex space-x-1 py-1.5" aria-label="Tabs">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-amber-950/90 text-amber-200 border border-amber-700/80 shadow-md'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
                }`}
              >
                <span className="text-sm">{tab.icon}</span>
                <div className="text-left">
                  <div className="leading-tight">{tab.label}</div>
                  <div className={`text-[10px] font-normal ${isActive ? 'text-amber-400/80' : 'text-stone-500'}`}>
                    {tab.sub}
                  </div>
                </div>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

