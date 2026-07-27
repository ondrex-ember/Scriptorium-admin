import React, { useState } from 'react';
import { GameStateData, Actor, ProductionRule } from '../types';
import { SKLAR_PRESET_ACTOR } from '../data/actorsData';
import { Sparkles, UserPlus, CheckCircle, ShieldCheck, Flame, GitCommit, Layers, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface GlassworksAndActorCreatorProps {
  state: GameStateData;
  onBindGlassworks: () => void;
  onCreateCustomActor: (
    actor: Omit<Actor, 'ticksActive' | 'ticksInCrisis' | 'status'>,
    prodRule: ProductionRule,
    seasonMods: [number, number][]
  ) => void;
}

export const GlassworksAndActorCreator: React.FC<GlassworksAndActorCreatorProps> = ({
  state,
  onBindGlassworks,
  onCreateCustomActor,
}) => {
  const hasGlassmaker = state.actors.some(a => a.id === 'sklar');

  // Custom Actor Form State
  const [newId, setNewId] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [newLabelEn, setNewLabelEn] = useState('');
  const [newProfession, setNewProfession] = useState('');
  const [newProfessionEn, setNewProfessionEn] = useState('');
  const [newIcon, setNewIcon] = useState('🧪');
  const [newWealth, setNewWealth] = useState(50);
  const [newMood, setNewMood] = useState(60);
  const [newStoresMax, setNewStoresMax] = useState(80);
  const [newProduces, setNewProduces] = useState('');
  const [newBaseProd, setNewBaseProd] = useState(3.0);
  const [newDeps, setNewDeps] = useState<string[]>([]);
  const [newNotes, setNewNotes] = useState('');
  const [newRelations, setNewRelations] = useState<Record<string, number>>({});

  const handleBindGlassworksClick = () => {
    onBindGlassworks();
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // fallback
    }
  };

  const handleToggleDep = (actorId: string) => {
    if (newDeps.includes(actorId)) {
      setNewDeps(newDeps.filter(id => id !== actorId));
    } else {
      setNewDeps([...newDeps, actorId]);
    }
  };

  const handleCustomActorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newId || !newLabel || !newProfession || !newProduces) {
      alert('Prosím vyplňte ID, Název, Povolání a Vyráběnou komoditu.');
      return;
    }

    const cleanId = newId.toLowerCase().replace(/[^a-z0-0_]/g, '_');

    const actorObj: Omit<Actor, 'ticksActive' | 'ticksInCrisis' | 'status'> = {
      id: cleanId,
      label: newLabel,
      label_en: newLabelEn || newLabel,
      profession: newProfession,
      profession_en: newProfessionEn || newProfession,
      core: false,
      wealth: newWealth,
      mood: newMood,
      stores: Math.round(newStoresMax * 0.4),
      storesMax: newStoresMax,
      icon: newIcon || '👤',
      notes: newNotes,
      relations: { ...newRelations }
    };

    const prodRule: ProductionRule = {
      base: newBaseProd,
      deps: newDeps,
      produces: newProduces,
      label_cs: newProduces
    };

    const seasonMods: [number, number][] = [
      [1.0, 0],
      [1.2, 5],
      [1.0, 0],
      [0.6, -10]
    ];

    onCreateCustomActor(actorObj, prodRule, seasonMods);

    // Reset Form
    setNewId('');
    setNewLabel('');
    setNewProfession('');
    setNewProduces('');
    setNewNotes('');
  };

  return (
    <div className="space-y-8">
      {/* SECTION 1: Dedicated Scriptorium Glassmaker Link */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-900 to-emerald-950 border border-emerald-800/60 rounded-xl p-6 shadow-lg space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3.5 bg-emerald-950 rounded-xl text-emerald-400 border border-emerald-700/80 shadow-inner">
              <Sparkles className="w-7 h-7 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif font-bold text-xl text-stone-100">
                  Propojení NPC Skláře ze hry Scriptorium
                </h2>
                <span className="bg-amber-950 text-amber-300 text-[10px] font-mono px-2 py-0.5 rounded border border-amber-800">
                  Scriptorium Contact
                </span>
              </div>
              <p className="text-xs text-stone-300 mt-1 max-w-2xl">
                Ve hře Scriptorium už NPC kontakt <strong>Mistr Vitus - Sklář z Bělkovic</strong> existuje. Zde jej jediným kliknutím oficiálně provážeme s generativním enginem Chronicon!
              </p>
            </div>
          </div>

          {hasGlassmaker ? (
            <div className="bg-emerald-950 border border-emerald-700 text-emerald-300 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Sklář (Mistr Vitus) je AKTIVNÍ ve světě</span>
            </div>
          ) : (
            <button
              id="btn-bind-glassworks"
              onClick={handleBindGlassworksClick}
              className="bg-emerald-700 hover:bg-emerald-600 text-white font-semibold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all shadow-md hover:shadow-emerald-900/50"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Propojit Skláře s Chroniconem (1 Click)</span>
            </button>
          )}
        </div>

        {/* Breakdown of how Glassworks connects */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-stone-950/70 p-3.5 rounded-lg border border-stone-800 space-y-1">
            <div className="font-bold text-amber-300 flex items-center gap-1.5">
              <span>🪵 Dodavatel: Uhlíř</span>
            </div>
            <p className="text-stone-300 text-[11px]">
              Sklářská huť potřebuje pro tavení skla a vitráží neustálý žár. Vyžaduje dřevěné uhlí od <strong>Uhlíře</strong>.
            </p>
          </div>

          <div className="bg-stone-950/70 p-3.5 rounded-lg border border-stone-800 space-y-1">
            <div className="font-bold text-emerald-300 flex items-center gap-1.5">
              <span>🧪 Produkce: Vitráže & Sklo</span>
            </div>
            <p className="text-stone-300 text-[11px]">
              Taví barevné vitráže pro klášterní refektář a chrámy v Olomouci a luxusní sklenice pro panský dvůr Vrchnosti.
            </p>
          </div>

          <div className="bg-stone-950/70 p-3.5 rounded-lg border border-stone-800 space-y-1">
            <div className="font-bold text-sky-300 flex items-center gap-1.5">
              <span>⛪ Vztah: Opat & Vrchnost</span>
            </div>
            <p className="text-stone-300 text-[11px]">
              Vysoká počáteční afinita s Klášterem (+45) a Vrchností (+35). Otevírá nové drby z Bělkovic a Šternberka.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 2: Universal Custom Actor Creator */}
      <div className="bg-stone-900/90 border border-amber-900/40 rounded-xl p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-stone-800 pb-4">
          <div className="p-3 bg-amber-950 rounded-lg text-amber-400 border border-amber-800">
            <UserPlus className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-serif font-bold text-lg text-stone-100">Zakládání nových aktérů & Definování vazeb</h2>
            <p className="text-xs text-stone-400">
              Přidejte libovolnou novou postavu či frakci (např. Vinař, Hrnčíř, Zbrojíř, Pekař, Rychtář) a okamžitě ji zapojte do ekonomiky sveta.
            </p>
          </div>
        </div>

        <form onSubmit={handleCustomActorSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block text-stone-300 font-medium mb-1">Unikátní ID (např. vinar)</label>
              <input
                type="text"
                value={newId}
                onChange={e => setNewId(e.target.value)}
                placeholder="vinar"
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-stone-200 font-mono focus:outline-none focus:border-amber-700"
                required
              />
            </div>

            <div>
              <label className="block text-stone-300 font-medium mb-1">Jméno / Label (např. Vinař)</label>
              <input
                type="text"
                value={newLabel}
                onChange={e => setNewLabel(e.target.value)}
                placeholder="Vinař"
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-stone-200 focus:outline-none focus:border-amber-700"
                required
              />
            </div>

            <div>
              <label className="block text-stone-300 font-medium mb-1">Povolání (např. Vinohradník)</label>
              <input
                type="text"
                value={newProfession}
                onChange={e => setNewProfession(e.target.value)}
                placeholder="Správce biskupských vinic"
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-stone-200 focus:outline-none focus:border-amber-700"
                required
              />
            </div>

            <div>
              <label className="block text-stone-300 font-medium mb-1">Ikona (Emoji)</label>
              <input
                type="text"
                value={newIcon}
                onChange={e => setNewIcon(e.target.value)}
                placeholder="🍇"
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-stone-200 text-center text-base focus:outline-none focus:border-amber-700"
              />
            </div>
          </div>

          {/* Commodity & Dependencies */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-stone-300 font-medium mb-1">Vyráběná komodita (např. vino)</label>
              <input
                type="text"
                value={newProduces}
                onChange={e => setNewProduces(e.target.value)}
                placeholder="mešní víno"
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-stone-200 focus:outline-none focus:border-amber-700"
                required
              />
            </div>

            <div>
              <label className="block text-stone-300 font-medium mb-1">Základní týdenní produkce</label>
              <input
                type="number"
                step="0.1"
                value={newBaseProd}
                onChange={e => setNewBaseProd(parseFloat(e.target.value))}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-stone-200 font-mono focus:outline-none focus:border-amber-700"
              />
            </div>

            <div>
              <label className="block text-stone-300 font-medium mb-1">Dodavatelské závislosti (deps)</label>
              <div className="bg-stone-950 border border-stone-800 rounded-lg p-2 max-h-28 overflow-y-auto space-y-1">
                {state.actors.map(actor => (
                  <label key={actor.id} className="flex items-center gap-2 text-[11px] text-stone-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newDeps.includes(actor.id)}
                      onChange={() => handleToggleDep(actor.id)}
                      className="accent-amber-600 rounded"
                    />
                    <span>{actor.icon} {actor.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Stats Sliders */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-stone-300 font-medium mb-1">Počáteční Bohatství: {newWealth}%</label>
              <input
                type="range"
                min="10"
                max="100"
                value={newWealth}
                onChange={e => setNewWealth(parseInt(e.target.value, 10))}
                className="w-full accent-amber-600 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-stone-300 font-medium mb-1">Počáteční Nálada: {newMood}%</label>
              <input
                type="range"
                min="10"
                max="100"
                value={newMood}
                onChange={e => setNewMood(parseInt(e.target.value, 10))}
                className="w-full accent-amber-600 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-stone-300 font-medium mb-1">Kapacita skladu: {newStoresMax}</label>
              <input
                type="range"
                min="30"
                max="150"
                value={newStoresMax}
                onChange={e => setNewStoresMax(parseInt(e.target.value, 10))}
                className="w-full accent-amber-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-stone-300 text-xs font-medium mb-1">Popis / Příběhová poznámka</label>
            <textarea
              value={newNotes}
              onChange={e => setNewNotes(e.target.value)}
              rows={2}
              placeholder="Poznámka o původu aktéra a jeho roli v Olomouckém kraji..."
              className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-xs text-stone-200 focus:outline-none focus:border-amber-700"
            />
          </div>

          {/* Initial Relations sliders */}
          <div className="space-y-3 pt-2 border-t border-stone-800">
            <h4 className="font-serif font-bold text-sm text-stone-200">Počáteční vztahy k ostatním aktérům</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs font-mono">
              {state.actors.map(actor => {
                const currentRel = newRelations[actor.id] || 0;
                return (
                  <div key={actor.id} className="bg-stone-950 p-2.5 rounded border border-stone-800 space-y-1">
                    <div className="flex justify-between text-stone-300 text-[11px]">
                      <span>{actor.icon} {actor.label}</span>
                      <span className="font-bold text-amber-300">{currentRel > 0 ? `+${currentRel}` : currentRel}</span>
                    </div>
                    <input
                      type="range"
                      min="-100"
                      max="100"
                      value={currentRel}
                      onChange={e => setNewRelations({ ...newRelations, [actor.id]: parseInt(e.target.value, 10) })}
                      className="w-full accent-amber-600 cursor-pointer"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-3">
            <button
              type="submit"
              className="bg-amber-700 hover:bg-amber-600 text-amber-100 font-semibold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-colors shadow-md"
            >
              <UserPlus className="w-4 h-4" />
              <span>Založit nového aktéra v Chroniconu</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
