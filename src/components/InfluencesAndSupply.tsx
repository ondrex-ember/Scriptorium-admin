import React from 'react';
import { GameStateData } from '../types';
import { INITIAL_PROD_TABLE, INITIAL_SEASON_MODS, COMMODITY_VALUE } from '../data/actorsData';
import { GitFork, ArrowRight, Layers, Sun, ShieldAlert, Package, Flame, AlertCircle } from 'lucide-react';

interface InfluencesAndSupplyProps {
  state: GameStateData;
  onNavigateTab: (tab: string) => void;
}

export const InfluencesAndSupply: React.FC<InfluencesAndSupplyProps> = ({ state, onNavigateTab }) => {
  const seasons = ['Jaro 🌱', 'Léto ☀️', 'Podzim 🍂', 'Zima ❄️'];
  const currentSeasonIdx = state.time.season;

  const hasGlassmaker = state.actors.some(a => a.id === 'sklar');

  return (
    <div className="space-y-8">
      {/* Intro Header */}
      <div className="bg-stone-900/90 border border-amber-900/40 rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-950 rounded-lg text-amber-400 border border-amber-800">
            <GitFork className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-serif font-bold text-xl text-stone-100">Co ovlivňuje svět Chroniconu?</h2>
            <p className="text-xs text-stone-300 mt-1 max-w-3xl">
              Chod Olomouckého panství řídí propojený dodavatelský řetězec, roční období, rozmary počasí a zásahy ze hry Scriptorium.
              Pokud některý ze článků selže, dominový efekt paralyzuje navazující aktéry.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Visual Supply Chain Flow */}
      <div className="bg-stone-900/90 border border-amber-900/40 rounded-xl p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <div>
            <h3 className="font-serif font-bold text-base text-stone-100">Dodavatelské řetězce a závislosti aktérů</h3>
            <p className="text-xs text-stone-400">Šipka označuje přísun surovin. Červená varuje před blokací.</p>
          </div>
          {!hasGlassmaker && (
            <button
              onClick={() => onNavigateTab('glassworks')}
              className="bg-amber-800 hover:bg-amber-700 text-amber-100 text-xs px-3 py-1.5 rounded-lg font-medium transition-colors"
            >
              + Propojit Sklárnu (Sklář)
            </button>
          )}
        </div>

        {/* Chain 1: Uhlíř -> Kovář -> Mlynář */}
        <div className="bg-stone-950/80 p-4 rounded-xl border border-stone-800 space-y-3">
          <div className="text-xs font-semibold text-amber-400 flex items-center gap-2">
            <span>ŘETĚZEC 1: Zpracování kovů a mletí obilí</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
            {/* Uhlíř */}
            <div className="bg-stone-900 p-3 rounded-lg border border-stone-800 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-200">🪵 Uhlíř</span>
                <span className="text-[10px] text-stone-400">Pálí uhlí</span>
              </div>
              <p className="text-[11px] text-stone-400">Vyrábí: <strong className="text-amber-300">Dřevěné uhlí</strong></p>
              <div className="text-[10px] text-emerald-400">Bez závislostí (základ)</div>
            </div>

            <div className="hidden md:flex justify-center text-amber-500">
              <ArrowRight className="w-5 h-5 animate-pulse" />
            </div>

            {/* Kovář */}
            <div className="bg-stone-900 p-3 rounded-lg border border-stone-800 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-200">🔨 Kovář</span>
                <span className="text-[10px] text-stone-400">Kuje kování</span>
              </div>
              <p className="text-[11px] text-stone-400">Vyrábí: <strong className="text-amber-300">Kování & Nářadí</strong></p>
              <div className="text-[10px] text-amber-400">Závisí na: <strong>Uhlíř</strong></div>
            </div>

            <div className="hidden md:flex justify-center text-amber-500">
              <ArrowRight className="w-5 h-5 animate-pulse" />
            </div>

            {/* Mlynář */}
            <div className="bg-stone-900 p-3 rounded-lg border border-stone-800 text-xs space-y-1 md:col-start-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-200">⚙️ Mlynář</span>
                <span className="text-[10px] text-stone-400">Mele mouku</span>
              </div>
              <p className="text-[11px] text-stone-400">Vyrábí: <strong className="text-amber-300">Mouka</strong></p>
              <div className="text-[10px] text-amber-400">Závisí na: <strong>Kovář</strong></div>
            </div>
          </div>
        </div>

        {/* Chain 2: Uhlíř -> Sklář -> Opat / Vrchnost */}
        <div className={`p-4 rounded-xl border transition-all ${
          hasGlassmaker ? 'bg-stone-950/80 border-emerald-900/50' : 'bg-stone-950/40 border-stone-800/80'
        }`}>
          <div className="text-xs font-semibold text-emerald-400 flex items-center justify-between">
            <span>ŘETĚZEC 2: Sklářská huť v Bělkovicích (Vitráže & Sklenice)</span>
            {!hasGlassmaker && <span className="text-[10px] bg-amber-950 text-amber-300 px-2 py-0.5 rounded">Příprava k propojení</span>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center mt-3">
            {/* Uhlíř */}
            <div className="bg-stone-900 p-3 rounded-lg border border-stone-800 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-200">🪵 Uhlíř</span>
                <span className="text-[10px] text-stone-400">Zásobuje pec</span>
              </div>
              <p className="text-[11px] text-stone-400">Dodává: <strong>Palivo do sklářské pece</strong></p>
            </div>

            <div className="hidden md:flex justify-center text-emerald-500">
              <ArrowRight className="w-5 h-5" />
            </div>

            {/* Sklář */}
            <div className={`p-3 rounded-lg border text-xs space-y-1 ${
              hasGlassmaker ? 'bg-emerald-950/40 border-emerald-700/80 text-emerald-100' : 'bg-stone-900/60 border-stone-800 text-stone-400'
            }`}>
              <div className="flex items-center justify-between">
                <span className="font-bold">🧪 Sklář (Mistr Vitus)</span>
                <span className="text-[10px]">Bělkovice</span>
              </div>
              <p className="text-[11px]">Vyrábí: <strong className="text-amber-300">Vitráže & Luxusní sklo</strong></p>
              <div className="text-[10px]">Závisí na: <strong>Uhlíř</strong></div>
            </div>

            <div className="hidden md:flex justify-center text-emerald-500">
              <ArrowRight className="w-5 h-5" />
            </div>

            {/* Klášter & Vrchnost */}
            <div className="bg-stone-900 p-3 rounded-lg border border-stone-800 text-xs space-y-1 md:col-start-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-200">⛪ Opat & 🏰 Vrchnost</span>
                <span className="text-[10px] text-stone-400">Odběratelé</span>
              </div>
              <p className="text-[11px] text-stone-400">Poptávka: Vitráže pro kůr, číše na panský stůl</p>
            </div>
          </div>
        </div>
      </div>

      {/* Seasonal Productivity & Mood Modifiers Table */}
      <div className="bg-stone-900/90 border border-amber-900/40 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <div>
            <h3 className="font-serif font-bold text-base text-stone-100">Sezónní modifikátory (SEASON_MODS)</h3>
            <p className="text-xs text-stone-400">Násobitel produkce / změna nálady pro [Jaro, Léto, Podzim, Zima].</p>
          </div>
          <span className="text-xs font-mono bg-amber-950 text-amber-300 px-3 py-1 rounded border border-amber-800">
            Aktivní období: {seasons[currentSeasonIdx]}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-800 bg-stone-950/80 text-amber-300 font-mono">
                <th className="py-2.5 px-3">Aktér / Povolání</th>
                <th className="py-2.5 px-3">Komodita</th>
                <th className={`py-2.5 px-3 ${currentSeasonIdx === 0 ? 'bg-amber-900/60 text-amber-200 font-bold' : ''}`}>Jaro 🌱</th>
                <th className={`py-2.5 px-3 ${currentSeasonIdx === 1 ? 'bg-amber-900/60 text-amber-200 font-bold' : ''}`}>Léto ☀️</th>
                <th className={`py-2.5 px-3 ${currentSeasonIdx === 2 ? 'bg-amber-900/60 text-amber-200 font-bold' : ''}`}>Podzim 🍂</th>
                <th className={`py-2.5 px-3 ${currentSeasonIdx === 3 ? 'bg-amber-900/60 text-amber-200 font-bold' : ''}`}>Zima ❄️</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60 text-stone-300 font-mono">
              {state.actors.map((actor) => {
                const prodRule = INITIAL_PROD_TABLE[actor.id] || { base: 2.5, produces: 'zbozi' };
                const mods = INITIAL_SEASON_MODS[actor.id] || INITIAL_SEASON_MODS['default'];

                return (
                  <tr key={actor.id} className="hover:bg-stone-800/40 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-stone-200 flex items-center gap-2">
                      <span>{actor.icon || '👤'}</span>
                      <span>{actor.label}</span>
                    </td>
                    <td className="py-2.5 px-3 text-stone-400">{prodRule.produces}</td>
                    {mods.map(([prodMod, moodDelta], sIdx) => {
                      const isCurrent = currentSeasonIdx === sIdx;
                      return (
                        <td
                          key={sIdx}
                          className={`py-2.5 px-3 ${
                            isCurrent ? 'bg-amber-950/40 text-amber-200 font-bold border-x border-amber-900/60' : ''
                          }`}
                        >
                          <div>{prodMod.toFixed(1)}× prod</div>
                          <div className={`text-[10px] ${moodDelta >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {moodDelta >= 0 ? `+${moodDelta}` : moodDelta} nálada
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Commodity Values & Demands */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-stone-900/90 border border-amber-900/40 rounded-xl p-5 shadow-sm space-y-3">
          <h3 className="font-serif font-bold text-stone-100 text-sm flex items-center gap-2">
            <Package className="w-4 h-4 text-amber-400" />
            <span>Tržní hodnota komodit (COMMODITY_VALUE)</span>
          </h3>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            {Object.entries(COMMODITY_VALUE).map(([item, val]) => (
              <div key={item} className="bg-stone-950/60 p-2 rounded border border-stone-800 flex justify-between items-center">
                <span className="text-stone-300 capitalize">{item}:</span>
                <span className="text-amber-300 font-bold">{val.toFixed(1)} grošů</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-stone-900/90 border border-amber-900/40 rounded-xl p-5 shadow-sm space-y-3">
          <h3 className="font-serif font-bold text-stone-100 text-sm flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>Pravidla kolapsu a záchrany (Fénix mechanismus)</span>
          </h3>
          <p className="text-xs text-stone-300 leading-relaxed">
            World engine Chronicon uplatňuje pravidlo <strong>"nikdy nekolabuje trvale"</strong>. Pokud se aktér dostane do hluboké krize,
            je mu automaticky přidělena podpora nebo zakročí GM skrze rezervační fond (Rescue Actions).
          </p>
          <div className="bg-stone-950/80 p-3 rounded border border-stone-800 text-xs text-stone-400 space-y-1">
            <div>• Zbývající GM záchranné akce: <strong className="text-amber-300">{state.rescueActionsLeft} / 3</strong></div>
            <div>• Zásah okamžitě obnoví zásoby aktéra na +25 a náladu na 50%.</div>
          </div>
        </div>
      </div>
    </div>
  );
};
