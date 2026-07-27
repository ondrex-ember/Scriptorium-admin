import React, { useState } from 'react';
import { GameStateData } from '../types';
import { Scroll, Sparkles, Send, CheckCircle2, XCircle, Clock, Shield, BellRing, Heart, Award } from 'lucide-react';

interface ScriptoriumAndGMProps {
  state: GameStateData;
  onResolvePetition: (type: 'hospes' | 'sepultura' | 'studovna' | 'pocestny', id: string, choice: 'accept' | 'decline' | 'defer') => void;
  onUpdateAbbotMessage: (message: string, mood: string, virtue: number) => void;
  onToggleFeastFast: (type: 'feast' | 'fast' | 'clear') => void;
}

export const ScriptoriumAndGM: React.FC<ScriptoriumAndGMProps> = ({
  state,
  onResolvePetition,
  onUpdateAbbotMessage,
  onToggleFeastFast,
}) => {
  const [abbotMsgInput, setAbbotMsgInput] = useState(state.gm.abbot_message || '');
  const [abbotMoodInput, setAbbotMoodInput] = useState(state.gm.abbot_mood || 'natěšený');
  const [abbotVirtueInput, setAbbotVirtueInput] = useState(state.gm.abbot_virtue || 5);

  const presets = [
    {
      title: '🐦 Holubník u Porty',
      text: 'Milost Boží buď s vámi, bratřie. Pan opat z cest svých se navrátil s novinou radostnou: Zjednalť on pro nás hejno holubic cvičených. Pročež přikročit dlužno ke stavbě holubníku u Porty.'
    },
    {
      title: '🍷 Sklářská huť v Bělkovicích',
      text: 'Bratřie moje, do kláštera dorazilo poselství od Mistra Vita ze Sklárny v Bělkovicích. Nabízí tavení nových barevných vitráží pro náš chór. Žádám vás o vlídné přijetí jeho vozů.'
    },
    {
      title: '🍞 Žňové poděkování',
      text: 'Pán požehnal naší úrodě a stodoly mlynáře se plní zrnem. Kážeme všem bratřím i lidu z podhradí, aby v neděli vzdali díky při slavnostní mši.'
    }
  ];

  return (
    <div className="space-y-8">
      {/* SECTION 1: Scriptorium Decision Desk */}
      <div className="bg-stone-900/90 border border-amber-900/40 rounded-xl p-6 shadow-sm space-y-5">
        <div className="flex items-center gap-3 border-b border-stone-800 pb-3">
          <div className="p-3 bg-amber-950 rounded-lg text-amber-400 border border-amber-800">
            <Scroll className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-serif font-bold text-xl text-stone-100">Scriptorium Decision Desk (Petice & Žádosti)</h2>
            <p className="text-xs text-stone-300 mt-0.5">
              Vstupy z venkovního kláštera a od hráčů Scriptorium: Žádosti o Infirmarium, Sepulturu, Studovnu a nocleh.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Hospites Queue */}
          <div className="bg-stone-950/80 p-4 rounded-xl border border-stone-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-amber-300">
              <span>🏥 Žádosti o Infirmarium (Hospites)</span>
              <span className="font-mono bg-stone-900 px-2 py-0.5 rounded border border-stone-800">
                {state.pendingHospites.length} čeká
              </span>
            </div>

            {state.pendingHospites.length === 0 ? (
              <p className="text-xs text-stone-500 italic py-2">Žádné nevyřízené žádosti o Infirmarium.</p>
            ) : (
              state.pendingHospites.map(h => (
                <div key={h.id} className="bg-stone-900 p-3 rounded-lg border border-stone-800 text-xs space-y-2">
                  <div className="flex justify-between font-bold text-stone-200">
                    <span>{h.name}</span>
                    <span className="text-stone-400 font-normal">{h.profession}</span>
                  </div>
                  <p className="text-[11px] text-stone-400">
                    Příčina tísně: <strong className="text-amber-300">{h.cause}</strong> | Bohatství: {h.wealth}%
                  </p>
                  <div className="flex gap-1.5 pt-1">
                    <button
                      onClick={() => onResolvePetition('hospes', h.id, 'accept')}
                      className="bg-emerald-900 hover:bg-emerald-800 text-emerald-200 px-2.5 py-1 rounded text-[11px] flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3 h-3" /> Přijmout
                    </button>
                    <button
                      onClick={() => onResolvePetition('hospes', h.id, 'decline')}
                      className="bg-rose-950 hover:bg-rose-900 text-rose-300 px-2.5 py-1 rounded text-[11px] flex items-center gap-1"
                    >
                      <XCircle className="w-3 h-3" /> Odmítnout
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Sepultura Queue */}
          <div className="bg-stone-950/80 p-4 rounded-xl border border-stone-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-amber-300">
              <span>⚰️ Právo Sepultury (Pohřby šlechty)</span>
              <span className="font-mono bg-stone-900 px-2 py-0.5 rounded border border-stone-800">
                {state.pendingSepulturas.length} čeká
              </span>
            </div>

            {state.pendingSepulturas.length === 0 ? (
              <p className="text-xs text-stone-500 italic py-2">Žádné nevyřízené žádosti o pohřbení.</p>
            ) : (
              state.pendingSepulturas.map(s => (
                <div key={s.id} className="bg-stone-900 p-3 rounded-lg border border-stone-800 text-xs space-y-2">
                  <div className="flex justify-between font-bold text-stone-200">
                    <span>{s.name}</span>
                    <span className="text-amber-300">{s.fee} grošů</span>
                  </div>
                  <p className="text-[11px] text-stone-400">{s.title}</p>
                  <div className="flex gap-1.5 pt-1">
                    <button
                      onClick={() => onResolvePetition('sepultura', s.id, 'accept')}
                      className="bg-emerald-900 hover:bg-emerald-800 text-emerald-200 px-2.5 py-1 rounded text-[11px] flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3 h-3" /> Udělit sepulturu
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* SECTION 2: GM Control Panel (gm_input.json) */}
      <div className="bg-stone-900/90 border border-amber-900/40 rounded-xl p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-stone-800 pb-3">
          <div className="p-3 bg-amber-950 rounded-lg text-amber-400 border border-amber-800">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-serif font-bold text-xl text-stone-100">GM Control Center (Zprávy Opata & Vyhlášky)</h2>
            <p className="text-xs text-stone-300 mt-0.5">
              Správa `gm_input.json` — vysílání Zlatých zpráv od Opata Augustína, vyhlášení půstů a svátků.
            </p>
          </div>
        </div>

        {/* Abbot Message Form */}
        <div className="space-y-4 bg-stone-950/80 p-5 rounded-xl border border-stone-800">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-serif font-bold text-sm text-amber-300 flex items-center gap-2">
              <BellRing className="w-4 h-4 text-amber-400" />
              <span>Vyslat Zlatou zprávu od Opata do Scriptorium (abbot_message)</span>
            </h3>

            <div className="flex items-center gap-3 text-xs">
              <span className="text-stone-400">Nálada opata:</span>
              <input
                type="text"
                value={abbotMoodInput}
                onChange={e => setAbbotMoodInput(e.target.value)}
                className="bg-stone-900 border border-stone-800 rounded px-2 py-1 text-stone-200 text-xs w-24 text-center"
              />
            </div>
          </div>

          <textarea
            value={abbotMsgInput}
            onChange={e => setAbbotMsgInput(e.target.value)}
            rows={4}
            className="w-full bg-stone-900 border border-stone-800 rounded-lg p-3 text-xs text-stone-100 font-serif leading-relaxed focus:outline-none focus:border-amber-700"
            placeholder="Napište poselství od opata pro hráče Scriptorium..."
          />

          {/* Quick Presets */}
          <div className="space-y-2">
            <div className="text-[11px] text-stone-400 font-medium">Rychlé šablony poselství:</div>
            <div className="flex flex-wrap gap-2">
              {presets.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => setAbbotMsgInput(p.text)}
                  className="bg-stone-900 hover:bg-stone-800 text-stone-300 text-[11px] px-2.5 py-1 rounded border border-stone-800 hover:border-amber-800 transition-colors"
                >
                  {p.title}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => onUpdateAbbotMessage(abbotMsgInput, abbotMoodInput, abbotVirtueInput)}
              className="bg-amber-700 hover:bg-amber-600 text-amber-100 font-semibold px-5 py-2 rounded-lg text-xs flex items-center gap-2 transition-colors shadow-md"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Vyslat Zlatou Zprávu Opata (Broadcast)</span>
            </button>
          </div>
        </div>

        {/* Fasts & Feasts Toggle */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-2">
            <h4 className="font-serif font-bold text-amber-300">🎉 Celokrajský Klášterní Svátek (Feast)</h4>
            <p className="text-stone-400 text-[11px]">
              Dvojnásobná účast na mši ve Scriptoriu, výrazné zvýšení nálady lidu v Olomouci (+10).
            </p>
            <button
              onClick={() => onToggleFeastFast('feast')}
              className="w-full bg-amber-900 hover:bg-amber-800 text-amber-100 py-1.5 rounded font-medium transition-colors"
            >
              {state.gm.feast ? '✅ Svátek je aktivní (Zrušit)' : 'Vyhlásit Svátek'}
            </button>
          </div>

          <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-2">
            <h4 className="font-serif font-bold text-sky-300">🐟 Svatý Půst (Fast)</h4>
            <p className="text-stone-400 text-[11px]">
              Poptávka po rybách od Rybníkáře vzroste o +50%. Prodej masa na trhu klesne na polovinu.
            </p>
            <button
              onClick={() => onToggleFeastFast('fast')}
              className="w-full bg-sky-900 hover:bg-sky-800 text-sky-100 py-1.5 rounded font-medium transition-colors"
            >
              {state.gm.fast ? '✅ Půst je aktivní (Zrušit)' : 'Vyhlásit Půst'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
