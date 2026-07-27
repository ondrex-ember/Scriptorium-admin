import React, { useState } from 'react';
import { GameStateData } from '../types';
import { X, Copy, Download, Check, FileJson } from 'lucide-react';

interface ExportImportModalProps {
  state: GameStateData;
  onClose: () => void;
  onImportState: (newState: GameStateData) => void;
}

export const ExportImportModal: React.FC<ExportImportModalProps> = ({
  state,
  onClose,
  onImportState,
}) => {
  const [activeTab, setActiveTab] = useState<'gamestate' | 'snapshot' | 'gm_input' | 'import'>('gamestate');
  const [copied, setCopied] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [importError, setImportError] = useState<string | null>(null);

  const getGamestateJson = () => JSON.stringify(state, null, 2);

  const getSnapshotJson = () => {
    const snapshot = {
      timestamp: new Date().toISOString(),
      world: {
        year: state.time.year,
        season: state.time.season,
        day: state.time.day,
        totalTick: state.time.totalTick,
        weather: state.weather,
        tension: state.globalTension
      },
      actors: state.actors.map(a => ({
        id: a.id,
        label: a.label,
        profession: a.profession,
        wealth: a.wealth,
        mood: a.mood,
        stores: a.stores,
        status: a.status
      })),
      gm_message: state.gm.abbot_message,
      unlocked_flags: state.unlockedFlags,
      recent_chronicle: state.log.slice(0, 10)
    };
    return JSON.stringify(snapshot, null, 2);
  };

  const getGmInputJson = () => JSON.stringify(state.gm, null, 2);

  const getCurrentText = () => {
    if (activeTab === 'gamestate') return getGamestateJson();
    if (activeTab === 'snapshot') return getSnapshotJson();
    if (activeTab === 'gm_input') return getGmInputJson();
    return '';
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getCurrentText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const text = getCurrentText();
    const filename = `${activeTab}_${Date.now()}.json`;
    const blob = new Blob([text], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportSubmit = () => {
    try {
      setImportError(null);
      const parsed = JSON.parse(importJsonText);
      if (!parsed.time || !parsed.actors) {
        throw new Error('Neplatná struktura GameState JSON. Chybí políčka time nebo actors.');
      }
      onImportState(parsed);
      onClose();
    } catch (e: any) {
      setImportError(e.message || 'Chyba při čtení JSONu.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-stone-900 border border-amber-800/80 rounded-xl p-6 max-w-3xl w-full shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <div className="flex items-center gap-2">
            <FileJson className="w-5 h-5 text-amber-400" />
            <h3 className="font-serif font-bold text-stone-100 text-lg">Export & Import Stavů a Snapshotů</h3>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation */}
        <div className="flex space-x-2 border-b border-stone-800 pb-2 text-xs font-medium">
          <button
            onClick={() => setActiveTab('gamestate')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'gamestate' ? 'bg-amber-950 text-amber-200 border border-amber-800' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            gamestate.json
          </button>
          <button
            onClick={() => setActiveTab('snapshot')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'snapshot' ? 'bg-amber-950 text-amber-200 border border-amber-800' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            chronicon_snapshot.json
          </button>
          <button
            onClick={() => setActiveTab('gm_input')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'gm_input' ? 'bg-amber-950 text-amber-200 border border-amber-800' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            gm_input.json
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'import' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Nahrát (Import)
          </button>
        </div>

        {activeTab !== 'import' ? (
          <div className="flex-1 overflow-hidden flex flex-col space-y-3">
            <textarea
              readOnly
              value={getCurrentText()}
              className="w-full flex-1 bg-stone-950 border border-stone-800 rounded-lg p-3 text-xs text-amber-200 font-mono focus:outline-none resize-none"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={handleCopy}
                className="bg-stone-800 hover:bg-stone-700 text-stone-200 px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Kopírováno!' : 'Kopírovat do schránky'}</span>
              </button>
              <button
                onClick={handleDownload}
                className="bg-amber-700 hover:bg-amber-600 text-amber-100 px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Stáhnout {activeTab}.json</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-hidden flex flex-col space-y-3">
            <p className="text-xs text-stone-300">
              Vložte kompletní obsah `gamestate.json` pro přepsání živého stavu v administraci:
            </p>
            <textarea
              value={importJsonText}
              onChange={e => setImportJsonText(e.target.value)}
              placeholder="Vložte sem JSON..."
              className="w-full flex-1 bg-stone-950 border border-stone-800 rounded-lg p-3 text-xs text-stone-200 font-mono focus:outline-none resize-none"
            />
            {importError && <p className="text-xs text-rose-400 font-medium">{importError}</p>}
            <div className="flex justify-end gap-2">
              <button
                onClick={handleImportSubmit}
                className="bg-emerald-700 hover:bg-emerald-600 text-white px-5 py-2 rounded-lg text-xs font-semibold"
              >
                Aplikovat nahrávaný stav
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
