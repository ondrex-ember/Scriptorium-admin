import React from 'react';
import { GameStateData, FireHotspot } from '../types';
import { Flame, AlertTriangle, ShieldAlert, Sparkles, HeartPulse, RefreshCw, Zap, CheckCircle2 } from 'lucide-react';

interface HotspotsAndCrisesProps {
  state: GameStateData;
  hotspots: FireHotspot[];
  onRescueActor: (actorId: string) => void;
  onPeaceDecree: () => void;
  onSupplyInfusion: () => void;
  onNavigateTab: (tab: string) => void;
}

export const HotspotsAndCrises: React.FC<HotspotsAndCrisesProps> = ({
  state,
  hotspots,
  onRescueActor,
  onPeaceDecree,
  onSupplyInfusion,
  onNavigateTab,
}) => {
  const criticals = hotspots.filter(h => h.severity === 'critical');
  const warnings = hotspots.filter(h => h.severity === 'warning');
  const infos = hotspots.filter(h => h.severity === 'info');

  return (
    <div className="space-y-8">
      {/* Overview Banner */}
      <div className="bg-stone-900/90 border border-amber-900/40 rounded-xl p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-rose-950 rounded-lg text-rose-400 border border-rose-800">
            <Flame className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="font-serif font-bold text-xl text-stone-100">Co v kraji hoří? (Krize & Ohniska)</h2>
            <p className="text-xs text-stone-300 mt-0.5">
              Automatická detekce blokovaných řetězců, ožebračených aktérů, sporných aliancí a nevyřízených petic.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="bg-rose-950 border border-rose-800 text-rose-300 px-3 py-1 rounded-full font-bold">
            🔥 {criticals.length} Kritické
          </span>
          <span className="bg-amber-950 border border-amber-800 text-amber-300 px-3 py-1 rounded-full font-bold">
            ⚠️ {warnings.length} Varování
          </span>
          <span className="bg-stone-800 border border-stone-700 text-stone-300 px-3 py-1 rounded-full font-bold">
            ℹ️ {infos.length} Informace
          </span>
        </div>
      </div>

      {/* GM Intervention Quick Bar */}
      <div className="bg-gradient-to-r from-amber-950/60 via-stone-900 to-amber-950/60 border border-amber-800/60 rounded-xl p-5 shadow-md space-y-3">
        <div className="flex items-center justify-between border-b border-amber-900/40 pb-2">
          <h3 className="font-serif font-bold text-sm text-amber-200 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Nástroje okamžitého zásahu správce (GM Interventions)</span>
          </h3>
          <span className="text-xs font-mono text-stone-400">
            Zbývající záchrany: <strong className="text-amber-300">{state.rescueActionsLeft} / 3</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <button
            onClick={onPeaceDecree}
            className="bg-stone-950 hover:bg-stone-800 text-amber-200 border border-amber-800/80 p-3 rounded-lg text-left transition-all hover:border-amber-600 space-y-1"
          >
            <div className="font-bold flex items-center gap-1.5 text-amber-300">
              <Sparkles className="w-4 h-4" />
              <span>Mírový dekret Opata</span>
            </div>
            <p className="text-[11px] text-stone-400">Uklidní napětí v kraji (-15%) a udobří sporné aktéry.</p>
          </button>

          <button
            onClick={onSupplyInfusion}
            className="bg-stone-950 hover:bg-stone-800 text-emerald-200 border border-emerald-800/80 p-3 rounded-lg text-left transition-all hover:border-emerald-600 space-y-1"
          >
            <div className="font-bold flex items-center gap-1.5 text-emerald-300">
              <RefreshCw className="w-4 h-4" />
              <span>Nouzový přísun surovin</span>
            </div>
            <p className="text-[11px] text-stone-400">Doplní +30 zásob všem klíčovým dodavatelům (Uhlíř, Kovář, Sklář).</p>
          </button>

          <button
            onClick={() => onNavigateTab('scriptorium')}
            className="bg-stone-950 hover:bg-stone-800 text-sky-200 border border-sky-800/80 p-3 rounded-lg text-left transition-all hover:border-sky-600 space-y-1"
          >
            <div className="font-bold flex items-center gap-1.5 text-sky-300">
              <HeartPulse className="w-4 h-4" />
              <span>Svatý půst / Svátek</span>
            </div>
            <p className="text-[11px] text-stone-400">Vyhlásit celokrajský půst či svátek pro zvýšení zbožnosti.</p>
          </button>
        </div>
      </div>

      {/* Hotspots List */}
      <div className="space-y-4">
        {hotspots.length === 0 ? (
          <div className="bg-stone-900/90 border border-amber-900/40 rounded-xl p-8 text-center text-stone-400 space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h3 className="font-serif font-bold text-stone-200 text-lg">Žádná kritická ohniska nebyla zjištěna!</h3>
            <p className="text-xs">Olomoucké panství funguje v mírném a harmonickém stavu.</p>
          </div>
        ) : (
          hotspots.map(spot => {
            const isCrit = spot.severity === 'critical';
            const isWarn = spot.severity === 'warning';

            return (
              <div
                key={spot.id}
                className={`border rounded-xl p-5 shadow-sm space-y-3 transition-all ${
                  isCrit
                    ? 'bg-rose-950/30 border-rose-800/80 text-rose-100'
                    : isWarn
                    ? 'bg-amber-950/30 border-amber-800/80 text-amber-100'
                    : 'bg-stone-900/90 border-stone-800 text-stone-200'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-800/80 pb-2">
                  <div className="flex items-center gap-2">
                    {isCrit ? (
                      <Flame className="w-5 h-5 text-rose-400 animate-pulse" />
                    ) : isWarn ? (
                      <AlertTriangle className="w-5 h-5 text-amber-400" />
                    ) : (
                      <ShieldAlert className="w-5 h-5 text-sky-400" />
                    )}
                    <h3 className="font-serif font-bold text-base">{spot.title}</h3>
                  </div>

                  <span
                    className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded uppercase border ${
                      isCrit
                        ? 'bg-rose-950 text-rose-300 border-rose-800'
                        : isWarn
                        ? 'bg-amber-950 text-amber-300 border-amber-800'
                        : 'bg-stone-800 text-stone-300 border-stone-700'
                    }`}
                  >
                    {spot.severity}
                  </span>
                </div>

                <p className="text-xs text-stone-300 leading-relaxed">{spot.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-stone-950/60 p-3 rounded-lg border border-stone-800/80">
                  <div>
                    <span className="text-stone-400 font-medium">Hrozící dopad: </span>
                    <span className="text-amber-300">{spot.impactText}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 font-medium">Doporučený zásah GM: </span>
                    <span className="text-emerald-300">{spot.suggestedAction}</span>
                  </div>
                </div>

                {/* Quick Action Button for Actor Rescue if actorId present */}
                {spot.actorId && (
                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => onRescueActor(spot.actorId!)}
                      disabled={state.rescueActionsLeft <= 0}
                      className="bg-amber-800 hover:bg-amber-700 disabled:opacity-50 text-amber-100 text-xs px-3.5 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-colors shadow-sm"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Provést záchranný balíček pro aktéra</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
