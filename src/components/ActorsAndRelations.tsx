import React, { useState } from 'react';
import { GameStateData, Actor } from '../types';
import { Users, Search, Edit3, Heart, Sliders, Shield, AlertTriangle, ArrowUpDown, ChevronDown } from 'lucide-react';

interface ActorsAndRelationsProps {
  state: GameStateData;
  onUpdateActor: (updatedActor: Actor) => void;
  onUpdateRelation: (actorId1: string, actorId2: string, newValue: number) => void;
}

export const ActorsAndRelations: React.FC<ActorsAndRelationsProps> = ({
  state,
  onUpdateActor,
  onUpdateRelation,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedActorId, setSelectedActorId] = useState<string | null>(null);
  const [editingCell, setEditingCell] = useState<{ id1: string; id2: string; val: number } | null>(null);

  const filteredActors = state.actors.filter(
    a =>
      a.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.profession.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedActor = state.actors.find(a => a.id === selectedActorId) || state.actors[0];

  const getRelationColor = (val: number) => {
    if (val >= 40) return 'bg-emerald-950/80 text-emerald-300 border-emerald-800/80 font-bold';
    if (val >= 15) return 'bg-emerald-950/40 text-emerald-400 border-emerald-900/40';
    if (val <= -40) return 'bg-rose-950/90 text-rose-300 border-rose-800/80 font-bold';
    if (val <= -20) return 'bg-rose-950/50 text-rose-400 border-rose-900/50';
    return 'bg-stone-900 text-stone-400 border-stone-800';
  };

  return (
    <div className="space-y-8">
      {/* Search & Filter Header */}
      <div className="bg-stone-900/90 border border-amber-900/40 rounded-xl p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-950 rounded-lg text-amber-400 border border-amber-800">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-serif font-bold text-xl text-stone-100">Adresář aktérů a Matice vztahů</h2>
            <p className="text-xs text-stone-300 mt-0.5">
              Celkem {state.actors.length} sledovaných aktérů Olomouckého panství. Kliknutím na buňku matice upravíte vzájemný vztah.
            </p>
          </div>
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Hledat aktéra nebo povolání..."
            className="w-full bg-stone-950 border border-stone-800 text-stone-200 text-xs rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:border-amber-700"
          />
        </div>
      </div>

      {/* Actors Directory Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredActors.map(actor => {
          const isCrisis = actor.status === 'krize' || actor.status === 'zanikajici';

          return (
            <div
              key={actor.id}
              onClick={() => setSelectedActorId(actor.id)}
              className={`bg-stone-900/90 border rounded-xl p-4 shadow-sm transition-all cursor-pointer hover:border-amber-700 ${
                selectedActorId === actor.id ? 'ring-2 ring-amber-600 border-amber-600' : 'border-amber-900/40'
              } ${isCrisis ? 'bg-rose-950/20 border-rose-800/60' : ''}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl p-2 bg-stone-950 rounded-lg border border-stone-800">{actor.icon || '👤'}</span>
                  <div>
                    <h3 className="font-serif font-bold text-stone-100 text-base">{actor.label}</h3>
                    <p className="text-xs text-stone-400">{actor.profession}</p>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                    isCrisis
                      ? 'bg-rose-950 text-rose-300 border-rose-800'
                      : 'bg-emerald-950 text-emerald-300 border-emerald-800'
                  }`}
                >
                  {actor.status.toUpperCase()}
                </span>
              </div>

              {actor.notes && (
                <p className="text-[11px] text-stone-300/90 mt-2.5 line-clamp-2 italic">
                  "{actor.notes}"
                </p>
              )}

              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-stone-800 text-center text-xs font-mono">
                <div>
                  <div className="text-[10px] text-stone-400">Bohatství</div>
                  <div className="font-bold text-amber-300">{actor.wealth}%</div>
                </div>
                <div>
                  <div className="text-[10px] text-stone-400">Nálada</div>
                  <div className={`font-bold ${actor.mood < 40 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {actor.mood}%
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-stone-400">Zásoby</div>
                  <div className="font-bold text-sky-300">
                    {actor.stores} / {actor.storesMax}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Relationship Matrix Grid */}
      <div className="bg-stone-900/90 border border-amber-900/40 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-800 pb-3">
          <div>
            <h3 className="font-serif font-bold text-lg text-stone-100">Matice bilaterálních vztahů (RICNI_RELATIONS)</h3>
            <p className="text-xs text-stone-400">
              Hodnota v řádku udává postoj řádkového aktéra vůči sloupcovému (-100 do +100).
            </p>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-mono">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-emerald-900 rounded border border-emerald-600 inline-block"></span> Aliance (&ge; +40)</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-stone-800 rounded border border-stone-600 inline-block"></span> Neutrální</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-rose-900 rounded border border-rose-600 inline-block"></span> Nepřátelství (&le; -30)</span>
          </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-xs text-center border-collapse">
            <thead>
              <tr className="border-b border-stone-800 bg-stone-950/80">
                <th className="py-2 px-3 text-left font-serif font-bold text-amber-300 border-r border-stone-800">
                  Od \ Proti
                </th>
                {state.actors.map(a => (
                  <th key={a.id} className="py-2 px-2 font-mono text-stone-300 min-w-[70px] text-[11px]" title={a.label}>
                    {a.icon} {a.label.substring(0, 7)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60 font-mono">
              {state.actors.map(rowActor => (
                <tr key={rowActor.id} className="hover:bg-stone-800/30">
                  <td className="py-2 px-3 text-left font-semibold text-stone-200 border-r border-stone-800 whitespace-nowrap bg-stone-950/40">
                    <span className="mr-1.5">{rowActor.icon}</span>
                    <span>{rowActor.label}</span>
                  </td>

                  {state.actors.map(colActor => {
                    if (rowActor.id === colActor.id) {
                      return (
                        <td key={colActor.id} className="bg-stone-950 text-stone-600 py-2">
                          —
                        </td>
                      );
                    }

                    const val = rowActor.relations[colActor.id] || 0;
                    const colorClass = getRelationColor(val);

                    return (
                      <td
                        key={colActor.id}
                        onClick={() => setEditingCell({ id1: rowActor.id, id2: colActor.id, val })}
                        className={`py-2 px-1 cursor-pointer transition-transform hover:scale-105 border ${colorClass}`}
                        title={`Klikněte pro úpravu vztahu: ${rowActor.label} -> ${colActor.label}: ${val}`}
                      >
                        {val > 0 ? `+${val}` : val}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Relationship Adjustment */}
      {editingCell && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-amber-800/80 rounded-xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="font-serif font-bold text-stone-100 text-lg border-b border-stone-800 pb-2">
              Úprava vztahu aktérů
            </h3>

            <p className="text-xs text-stone-300">
              Postoj aktéra <strong className="text-amber-300">{state.actors.find(a => a.id === editingCell.id1)?.label}</strong> vůči{' '}
              <strong className="text-amber-300">{state.actors.find(a => a.id === editingCell.id2)?.label}</strong>:
            </p>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono text-stone-400">
                <span>Nepřátelství (-100)</span>
                <span className="font-bold text-amber-300 text-sm">{editingCell.val}</span>
                <span>Spojenectví (+100)</span>
              </div>
              <input
                type="range"
                min="-100"
                max="100"
                value={editingCell.val}
                onChange={e => setEditingCell({ ...editingCell, val: parseInt(e.target.value, 10) })}
                className="w-full accent-amber-600 cursor-pointer"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setEditingCell(null)}
                className="px-3 py-1.5 text-xs text-stone-400 hover:text-stone-200"
              >
                Zrušit
              </button>
              <button
                onClick={() => {
                  onUpdateRelation(editingCell.id1, editingCell.id2, editingCell.val);
                  setEditingCell(null);
                }}
                className="px-4 py-1.5 text-xs bg-amber-700 hover:bg-amber-600 text-amber-100 font-semibold rounded-lg"
              >
                Uložit vztah
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
