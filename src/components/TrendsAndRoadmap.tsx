import React, { useState } from 'react';
import { GameStateData, NarrativePoolStatus, RoadmapItem } from '../types';
import { INITIAL_NARRATIVE_POOLS, INITIAL_ROADMAP_ITEMS, INITIAL_SCRIPTORIUM_COMMUNITY } from '../data/initialData';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar, Legend, CartesianGrid } from 'recharts';
import { TrendingUp, Compass, Plus, CheckCircle, Clock, Tag, Sparkles, Layers } from 'lucide-react';

interface TrendsAndRoadmapProps {
  state: GameStateData;
}

export const TrendsAndRoadmap: React.FC<TrendsAndRoadmapProps> = ({ state }) => {
  const [roadmapItems, setRoadmapItems] = useState<RoadmapItem[]>(INITIAL_ROADMAP_ITEMS);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCat, setNewCat] = useState<'actor' | 'location' | 'event' | 'feature' | 'scriptorium'>('actor');
  const [newPriority, setNewPriority] = useState<'high' | 'medium' | 'low'>('medium');

  // Chart data preparation
  const actorStatsChartData = state.actors.map(a => ({
    name: a.label,
    wealth: a.wealth,
    mood: a.mood,
    stores: a.stores
  }));

  const handleAddRoadmapItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const newItem: RoadmapItem = {
      id: `road_${Date.now()}`,
      title: newTitle,
      category: newCat,
      status: 'backlog',
      priority: newPriority,
      description: newDesc || 'Návrh dalšího rozšíření pro správu světa.',
      impact: 'Vytvoří nové příběhové linky a interakce ve Scriptoriu.',
      tags: [newCat, 'GM Wishlist'],
      targetSeason: 'Podzim 1465'
    };

    setRoadmapItems([newItem, ...roadmapItems]);
    setNewTitle('');
    setNewDesc('');
  };

  const handleStatusChange = (id: string, newStatus: 'backlog' | 'in_progress' | 'completed') => {
    setRoadmapItems(roadmapItems.map(item => item.id === id ? { ...item, status: newStatus } : item));
  };

  return (
    <div className="space-y-8">
      {/* SECTION 1: Interactive Trend Charts */}
      <div className="bg-stone-900/90 border border-amber-900/40 rounded-xl p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-stone-800 pb-3">
          <div className="p-3 bg-amber-950 rounded-lg text-amber-400 border border-amber-800">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-serif font-bold text-xl text-stone-100">Ekonomické a Scriptorium Trendy</h2>
            <p className="text-xs text-stone-300 mt-0.5">
              Porovnání bohatství, nálady a zásob aktérů + aktivita hráčů Scriptorium (Lux body).
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Actor Wealth & Mood Comparison Bar Chart */}
          <div className="bg-stone-950/80 p-4 rounded-xl border border-stone-800 space-y-2">
            <h3 className="font-serif font-bold text-xs text-amber-300">Bohatství vs. Nálada aktérů</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={actorStatsChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="name" stroke="#a1a1aa" fontSize={10} tickLine={false} />
                  <YAxis stroke="#a1a1aa" fontSize={10} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', fontSize: '11px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Bar dataKey="wealth" name="Bohatství (%)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="mood" name="Nálada (%)" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Scriptorium Lux Trend Line Chart */}
          <div className="bg-stone-950/80 p-4 rounded-xl border border-stone-800 space-y-2">
            <h3 className="font-serif font-bold text-xs text-amber-300">Aktivita hráček a hráčů Scriptorium (Lux body)</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={INITIAL_SCRIPTORIUM_COMMUNITY}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="date" stroke="#a1a1aa" fontSize={10} tickLine={false} />
                  <YAxis stroke="#a1a1aa" fontSize={10} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', fontSize: '11px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Line type="monotone" dataKey="wsum_lux" name="Lux body" stroke="#38bdf8" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="wsum" name="Počet akcí" stroke="#fbbf24" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Narrative Pools Status (from PROGRESS.md) */}
      <div className="bg-stone-900/90 border border-amber-900/40 rounded-xl p-6 shadow-sm space-y-5">
        <div className="flex items-center gap-3 border-b border-stone-800 pb-3">
          <div className="p-3 bg-amber-950 rounded-lg text-amber-400 border border-amber-800">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-serif font-bold text-xl text-stone-100">Stav narativních bazénů (Narrative Pools Progress)</h2>
            <p className="text-xs text-stone-300 mt-0.5">
              Sledování vytěžení pramenů z `narrative/PROGRESS.md` pro NotebookLM a generátor kroniky (Cíl: 300+ na pool).
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {INITIAL_NARRATIVE_POOLS.map(pool => {
            const pct = Math.round((pool.currentCount / pool.targetCount) * 100);

            return (
              <div key={pool.id} className="bg-stone-950/80 p-4 rounded-xl border border-stone-800 space-y-3 text-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-serif font-bold text-stone-100 text-sm">{pool.name}</h3>
                    <p className="text-[10px] text-stone-400 font-mono">{pool.source}</p>
                  </div>
                  <span className="font-mono text-amber-400 font-bold bg-stone-900 px-2 py-0.5 rounded border border-stone-800">
                    {pool.currentCount} / {pool.targetCount} ({pct}%)
                  </span>
                </div>

                <div className="w-full bg-stone-800 rounded-full h-2 overflow-hidden">
                  <div className="bg-amber-600 h-full transition-all duration-500" style={{ width: `${pct}%` }} />
                </div>

                <div className="space-y-1 text-[11px] text-stone-400">
                  <div className="font-semibold text-stone-300">Pokryto:</div>
                  <p className="line-clamp-2 text-stone-400 italic">{pool.covered.join(', ')}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 3: GM Development Roadmap & Wishlist ("Co by bylo hezké") */}
      <div className="bg-stone-900/90 border border-amber-900/40 rounded-xl p-6 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-950 rounded-lg text-amber-400 border border-amber-800">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-xl text-stone-100">Plánování rozvoje světa ("Co by bylo hezké")</h2>
              <p className="text-xs text-stone-300 mt-0.5">
                Plánování nových lokací, aktérů, cechů a propojení pro další fáze vývoje světa.
              </p>
            </div>
          </div>
        </div>

        {/* Add new Roadmap Item Form */}
        <form onSubmit={handleAddRoadmapItem} className="bg-stone-950/80 p-4 rounded-xl border border-stone-800 space-y-3 text-xs">
          <h3 className="font-serif font-bold text-amber-300 text-sm">Přidat nový nápad do plánovače rozvoje</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              placeholder="Název rozvoje (např. Biskupské vinice v Kroměříži)..."
              className="w-full bg-stone-900 border border-stone-800 rounded-lg px-3 py-2 text-stone-100 focus:outline-none focus:border-amber-700"
              required
            />
            <select
              value={newCat}
              onChange={e => setNewCat(e.target.value as any)}
              className="bg-stone-900 border border-stone-800 rounded-lg px-3 py-2 text-stone-200"
            >
              <option value="actor">Aktér / Povolání</option>
              <option value="location">Lokace / Město</option>
              <option value="event">Příběh / Event</option>
              <option value="feature">Systémová funkce</option>
              <option value="scriptorium">Scriptorium NPC</option>
            </select>
            <button
              type="submit"
              className="bg-amber-700 hover:bg-amber-600 text-amber-100 font-semibold px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Přidat do plánu</span>
            </button>
          </div>
        </form>

        {/* Roadmap Items List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {roadmapItems.map(item => (
            <div key={item.id} className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-2 text-xs">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-serif font-bold text-stone-100 text-sm">{item.title}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-mono bg-stone-900 text-amber-400 px-2 py-0.5 rounded border border-stone-800">
                      {item.category.toUpperCase()}
                    </span>
                    <span className="text-[10px] text-stone-400 font-mono">{item.targetSeason}</span>
                  </div>
                </div>

                <select
                  value={item.status}
                  onChange={e => handleStatusChange(item.id, e.target.value as any)}
                  className={`text-[10px] font-mono px-2 py-1 rounded border font-bold cursor-pointer ${
                    item.status === 'completed'
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                      : item.status === 'in_progress'
                      ? 'bg-amber-950 text-amber-300 border-amber-800'
                      : 'bg-stone-900 text-stone-400 border-stone-800'
                  }`}
                >
                  <option value="backlog">NÁVRH / BACKLOG</option>
                  <option value="in_progress">PROBÍHÁ ROZVOJ</option>
                  <option value="completed">DOKONČENO</option>
                </select>
              </div>

              <p className="text-stone-300 leading-relaxed text-[11px]">{item.description}</p>
              <p className="text-[10px] text-emerald-400/90 font-medium">Dopad: {item.impact}</p>

              <div className="flex flex-wrap gap-1 pt-1">
                {item.tags.map((tag, tIdx) => (
                  <span key={tIdx} className="text-[9px] bg-stone-900 text-stone-400 px-2 py-0.5 rounded border border-stone-800">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
