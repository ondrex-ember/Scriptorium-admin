import React from 'react';
import { GameStateData, LogEntry } from '../types';
import { AlertCircle, Thermometer, Wind, CloudRain, Users, HeartHandshake, Scroll, Activity, Sparkles, Building2, Flame, GitBranch, RefreshCw, Cpu, ExternalLink, CheckCircle2 } from 'lucide-react';
import { GITHUB_ADMIN_REPO_URL, GITHUB_SCRIPTORIUM_REPO_URL } from '../services/githubSync';

interface WorldStateOverviewProps {
  state: GameStateData;
  onNavigateTab: (tab: string) => void;
  syncMode: 'local' | 'github';
  onToggleSyncMode: (mode: 'local' | 'github') => void;
  onSyncGithub: () => void;
  isSyncingGithub: boolean;
  lastGithubSyncTime: string | null;
  syncError: string | null;
}

export const WorldStateOverview: React.FC<WorldStateOverviewProps> = ({
  state,
  onNavigateTab,
  syncMode,
  onToggleSyncMode,
  onSyncGithub,
  isSyncingGithub,
  lastGithubSyncTime,
  syncError
}) => {
  const crisisActors = state.actors.filter(a => a.status === 'krize' || a.status === 'zanikajici');
  const stableActors = state.actors.filter(a => a.status === 'stable');

  const totalPetitions = state.pendingHospites.length + state.pendingSepulturas.length + (state.pendingStudovna ? 1 : 0) + state.pendingPocestny.length;

  return (
    <div className="space-y-6">
      {/* Synchronization Mode Banner */}
      <div className={`rounded-xl p-4 border shadow-lg transition-all ${
        syncMode === 'github'
          ? 'bg-gradient-to-r from-sky-950/80 via-stone-900 to-amber-950/60 border-sky-800/80 text-sky-100'
          : 'bg-stone-900/90 border-amber-900/50 text-stone-200'
      }`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className={`p-2.5 rounded-xl border ${
              syncMode === 'github'
                ? 'bg-sky-900/50 border-sky-600/80 text-sky-300'
                : 'bg-amber-950/80 border-amber-800/80 text-amber-300'
            }`}>
              {syncMode === 'github' ? (
                <GitBranch className="w-6 h-6 animate-pulse text-sky-300" />
              ) : (
                <Cpu className="w-6 h-6 text-amber-300" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-serif font-bold text-sm tracking-wide">
                  {syncMode === 'github'
                    ? 'Živá synchronizace s herním serverem & repozitářem'
                    : 'Režim Lokální Simulace (In-App Engine)'}
                </h3>
                {syncMode === 'github' ? (
                  <span className="bg-emerald-950 text-emerald-300 border border-emerald-700/80 text-[10px] px-2 py-0.5 rounded-full font-mono flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Synchrornizováno
                  </span>
                ) : (
                  <span className="bg-amber-950 text-amber-300 border border-amber-800 text-[10px] px-2 py-0.5 rounded-full font-mono">
                    Lokální paměť browseru
                  </span>
                )}
              </div>

              <div className="text-xs text-stone-300/90 mt-1.5 space-y-1 max-w-3xl">
                {syncMode === 'github' ? (
                  <>
                    <p className="flex flex-wrap items-center gap-2">
                      <span className="text-stone-400">🖥️ Herní Server & Data:</span>
                      <a href={GITHUB_SCRIPTORIUM_REPO_URL} target="_blank" rel="noopener noreferrer" className="underline font-mono text-sky-300 hover:text-sky-200 inline-flex items-center gap-1 bg-sky-950/80 px-2 py-0.5 rounded border border-sky-800/60">
                        ondrex-ember/scriptorium (scriptorium/gamestate.json) <ExternalLink className="w-3 h-3" />
                      </a>
                    </p>
                    <p className="flex flex-wrap items-center gap-2">
                      <span className="text-stone-400">💻 Klient Admin Aplikace:</span>
                      <a href={GITHUB_ADMIN_REPO_URL} target="_blank" rel="noopener noreferrer" className="underline font-mono text-amber-300 hover:text-amber-200 inline-flex items-center gap-1 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/60">
                        ondrex-ember/Scriptorium-admin <ExternalLink className="w-3 h-3" />
                      </a>
                    </p>
                  </>
                ) : (
                  <p>
                    Běžíte v izolované lokální simulaci. Můžete libovolně generovat ticky, vytvářet nové aktéry a testovat ekonomické cykly bez přepisování serverových dat.
                  </p>
                )}
              </div>

              {syncMode === 'github' && (
                <div className="flex items-center gap-3 mt-2 text-[11px] text-sky-200/80 font-mono">
                  <span>Poslední synchro: {lastGithubSyncTime || 'Nyní při načtení'}</span>
                  {syncError && <span className="text-rose-400 font-sans font-semibold">⚠️ {syncError}</span>}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {syncMode === 'github' ? (
              <>
                <button
                  onClick={onSyncGithub}
                  disabled={isSyncingGithub}
                  className="bg-sky-900 hover:bg-sky-800 text-sky-100 border border-sky-600/80 text-xs px-3 py-1.5 rounded-lg font-medium transition-all shadow-sm flex items-center gap-1.5"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncingGithub ? 'animate-spin text-amber-300' : ''}`} />
                  <span>Obnovit ze Serveru</span>
                </button>
                <button
                  onClick={() => onToggleSyncMode('local')}
                  className="bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs px-3 py-1.5 rounded-lg transition-colors"
                >
                  Přepnout na Lokální
                </button>
              </>
            ) : (
              <button
                onClick={() => onToggleSyncMode('github')}
                className="bg-sky-950 hover:bg-sky-900 text-sky-200 border border-sky-700/80 text-xs px-3 py-1.5 rounded-lg font-medium transition-all shadow-sm flex items-center gap-1.5"
              >
                <GitBranch className="w-3.5 h-3.5 text-sky-400" />
                <span>Zapnout Server Sync (ondrex-ember/scriptorium)</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Top Banner Alert if Crisis */}
      {crisisActors.length > 0 && (
        <div className="bg-rose-950/60 border border-rose-800/80 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 text-rose-200 shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-900/60 rounded-lg text-rose-300">
              <Flame className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="font-semibold text-rose-100 text-sm">Pozor: V kraji jsou aktéři v hospodářské krizi ({crisisActors.length})</h3>
              <p className="text-xs text-rose-300/90 mt-0.5">
                Krize zasáhla: {crisisActors.map(a => a.label).join(', ')}. Hrozí zastavení jejich výroby a nepokoje.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('hotspots')}
            className="bg-rose-800 hover:bg-rose-700 text-white text-xs px-3 py-1.5 rounded-lg font-medium transition-colors shadow-sm"
          >
            Přejít na Ohniska 🔥
          </button>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* World Time & Climate */}
        <div className="bg-stone-900/90 border border-amber-900/40 rounded-xl p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-stone-400 text-xs mb-2">
            <span className="font-medium text-amber-300/90">HERNÍ ČAS A KLIMA</span>
            <span className="text-base">{state.weather.icon}</span>
          </div>
          <div className="text-xl font-serif font-bold text-stone-100">
            {['Jaro', 'Léto', 'Podzim', 'Zima'][state.time.season]} {state.time.year}
          </div>
          <div className="text-xs text-stone-300 mt-1 flex items-center gap-2">
            <span>Den {state.time.day} / 90</span>
            <span className="text-stone-600">•</span>
            <span className="text-amber-400 font-mono">Tick #{state.time.totalTick}</span>
          </div>
          <div className="mt-3 pt-3 border-t border-stone-800/80 flex items-center justify-between text-xs text-stone-400">
            <span>Počasí: <strong className="text-stone-200">{state.weather.name}</strong></span>
            {state.weather.tempC && <span className="text-amber-300 font-mono">{state.weather.tempC}°C</span>}
          </div>
        </div>

        {/* Global Tension & Stability */}
        <div className="bg-stone-900/90 border border-amber-900/40 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-stone-400 text-xs mb-2">
            <span className="font-medium text-amber-300/90">NAPĚTÍ PANSTVÍ</span>
            <Activity className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <div className="text-2xl font-mono font-bold text-stone-100">{state.globalTension}%</div>
            <span className={`text-xs font-semibold ${state.globalTension > 35 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {state.globalTension > 35 ? 'Kritické' : 'Stabilní'}
            </span>
          </div>
          <div className="w-full bg-stone-800 rounded-full h-2 mt-2 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                state.globalTension > 50 ? 'bg-rose-500' : state.globalTension > 30 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(100, state.globalTension)}%` }}
            />
          </div>
          <div className="mt-3 pt-2 text-[11px] text-stone-400 flex items-center justify-between">
            <span>Stabilní aktéři: <strong className="text-emerald-400">{stableActors.length} / {state.actors.length}</strong></span>
            <span>Les: <strong className="text-stone-300">{state.les}%</strong></span>
          </div>
        </div>

        {/* Population & Monastic Virtue */}
        <div className="bg-stone-900/90 border border-amber-900/40 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-stone-400 text-xs mb-2">
            <span className="font-medium text-amber-300/90">POPULACE & ZBOŽNOST</span>
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-stone-100">
            {state.totalPopulation.toLocaleString('cs-CZ')}
          </div>
          <div className="text-xs text-stone-400 mt-1 flex items-center justify-between">
            <span>Úmrtí: <strong className="text-stone-300">{state.totalDeaths}</strong></span>
            <span>Pohřby: <strong className="text-stone-300">{state.totalFuneralEvents}</strong></span>
          </div>
          <div className="mt-3 pt-2 border-t border-stone-800/80 flex items-center justify-between text-xs">
            <span className="text-stone-400">Virtue (Zbožnost):</span>
            <span className="font-mono font-bold text-amber-300">{state.virtue.value} / 10</span>
          </div>
        </div>

        {/* Scriptorium Integration & Petitions */}
        <div className="bg-stone-900/90 border border-amber-900/40 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-stone-400 text-xs mb-2">
            <span className="font-medium text-amber-300/90">SKRIPTORIUM PETICE</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <div className="text-2xl font-mono font-bold text-amber-300">{totalPetitions}</div>
            <span className="text-xs text-stone-400">nevyřízeno</span>
          </div>
          <p className="text-xs text-stone-400 mt-1">
            Hospites: {state.pendingHospites.length} | Sepultura: {state.pendingSepulturas.length}
          </p>
          <div className="mt-3 pt-2 border-t border-stone-800/80 flex items-center justify-between text-xs">
            <button
              onClick={() => onNavigateTab('scriptorium')}
              className="text-amber-400 hover:text-amber-300 font-medium underline flex items-center gap-1"
            >
              <span>Vyřídit v Decision Desk</span> →
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Weather & Climate + GM Message + Chronicle Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Weather & GM Message */}
        <div className="space-y-6 lg:col-span-1">
          {/* Weather Details Card */}
          <div className="bg-stone-900/90 border border-amber-900/40 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{state.weather.icon}</span>
                <div>
                  <h3 className="font-serif font-bold text-stone-100 text-base">{state.weather.name}</h3>
                  <p className="text-xs text-stone-400">Olomouc a Poodří</p>
                </div>
              </div>
              <span className="text-xs font-mono bg-stone-800 text-amber-300 px-2.5 py-1 rounded">
                1465 Olomouc
              </span>
            </div>

            <p className="text-xs text-stone-300 leading-relaxed bg-stone-950/60 p-3 rounded-lg border border-stone-800">
              "{state.weather.desc}"
            </p>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-stone-950/80 p-2.5 rounded-lg border border-stone-800">
                <Thermometer className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                <div className="text-stone-400 text-[10px]">Teplota</div>
                <div className="font-mono font-bold text-stone-200 mt-0.5">{state.weather.tempC || 20}°C</div>
              </div>
              <div className="bg-stone-950/80 p-2.5 rounded-lg border border-stone-800">
                <Wind className="w-4 h-4 text-sky-400 mx-auto mb-1" />
                <div className="text-stone-400 text-[10px]">Vítr</div>
                <div className="font-mono font-bold text-stone-200 mt-0.5">{state.weather.windKmH || 10} km/h</div>
              </div>
              <div className="bg-stone-950/80 p-2.5 rounded-lg border border-stone-800">
                <CloudRain className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                <div className="text-stone-400 text-[10px]">Srážky</div>
                <div className="font-mono font-bold text-stone-200 mt-0.5">{state.weather.rainMm || 0} mm</div>
              </div>
            </div>

            <div className="text-[11px] text-stone-400 bg-stone-950/40 p-2.5 rounded border border-stone-800/80 space-y-1">
              <div className="font-semibold text-amber-300/90 mb-1">Dopad počasí na ekonomiku:</div>
              <div>• Voraři: {state.weather.key.includes('storm') ? '🛑 Pozastaveno' : '✅ Dobré podmínky'}</div>
              <div>• Rybníkáři: {['Jaro', 'Podzim'].includes(['Jaro', 'Léto', 'Podzim', 'Zima'][state.time.season]) ? '🐟 Odlov v plném proudu' : '🎣 Standardní výnos'}</div>
              <div>• Mlynáři: {state.weather.rainMm && state.weather.rainMm > 10 ? '🌊 Vysoký průtok Moravy' : '⚙️ Běžné mletí'}</div>
            </div>
          </div>

          {/* Active GM Message Card */}
          <div className="bg-stone-900/90 border border-amber-900/40 rounded-xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-stone-800 pb-2.5">
              <div className="flex items-center gap-2">
                <Scroll className="w-4 h-4 text-amber-400" />
                <h3 className="font-serif font-bold text-stone-100 text-sm">Aktivní Zpráva Opata do Skriptoria</h3>
              </div>
              <span className="text-[10px] bg-amber-950 text-amber-300 px-2 py-0.5 rounded border border-amber-800">
                {state.gm.abbot_name}
              </span>
            </div>

            {state.gm.abbot_message ? (
              <div className="bg-stone-950/80 p-3.5 rounded-lg border border-amber-900/30 font-serif text-xs text-amber-100/90 italic leading-relaxed">
                "{state.gm.abbot_message}"
              </div>
            ) : (
              <p className="text-xs text-stone-500 italic">Žádná aktivní zpráva pro hráče Skriptoria.</p>
            )}

            <button
              onClick={() => onNavigateTab('scriptorium')}
              className="w-full text-center text-xs text-amber-400 hover:text-amber-300 font-medium py-1.5 bg-stone-950/60 rounded border border-stone-800 hover:border-amber-900 transition-colors"
            >
              Upravit nebo vyslat novou GM zprávu →
            </button>
          </div>
        </div>

        {/* Right Column: Live Chronicle Feed */}
        <div className="lg:col-span-2 bg-stone-900/90 border border-amber-900/40 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-stone-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Scroll className="w-5 h-5 text-amber-400" />
                <h3 className="font-serif font-bold text-stone-100 text-base">Kronika událostí (Chronicle Log Feed)</h3>
              </div>
              <span className="text-xs text-stone-400 font-mono">Celkem {state.log.length} záznamů</span>
            </div>

            <div className="space-y-3 max-h-[480px] overflow-y-auto pr-2 custom-scrollbar">
              {state.log.map((entry, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border text-xs transition-all ${
                    entry.type === 'G'
                      ? 'bg-amber-950/30 border-amber-800/60 text-amber-100'
                      : entry.type === 'W'
                      ? 'bg-sky-950/30 border-sky-800/60 text-sky-100'
                      : entry.type === 'S'
                      ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-100'
                      : 'bg-stone-950/60 border-stone-800 text-stone-200'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] text-stone-400 mb-1">
                    <span className="font-mono text-amber-400/90">
                      {entry.icon || '📜'} Tick #{entry.tick} • {entry.season} {entry.year}, Den {entry.day}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-stone-900 border border-stone-800">
                      {entry.source}
                    </span>
                  </div>
                  <p className="leading-relaxed text-xs">{entry.text_cs || entry.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400">
            <span>Log uchovává až 80 nejnovějších systémových a GM ticků.</span>
            <span className="font-mono text-amber-300/80">Chronicon Output Engine</span>
          </div>
        </div>
      </div>
    </div>
  );
};
