import React, { useState, useMemo, useEffect } from 'react';
import { INITIAL_GAME_STATE } from './data/initialData';
import { ChroniconEngine } from './engine/chroniconEngine';
import { GameStateData, Actor, ProductionRule } from './types';
import { Navbar } from './components/Navbar';
import { WorldStateOverview } from './components/WorldStateOverview';
import { InfluencesAndSupply } from './components/InfluencesAndSupply';
import { ActorsAndRelations } from './components/ActorsAndRelations';
import { GlassworksAndActorCreator } from './components/GlassworksAndActorCreator';
import { HotspotsAndCrises } from './components/HotspotsAndCrises';
import { ScriptoriumAndGM } from './components/ScriptoriumAndGM';
import { TrendsAndRoadmap } from './components/TrendsAndRoadmap';
import { ExportImportModal } from './components/ExportImportModal';
import { fetchGithubState } from './services/githubSync';

export default function App() {
  const [gameState, setGameState] = useState<GameStateData>(INITIAL_GAME_STATE);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  // Synchronization Mode State: 'local' | 'github'
  const [syncMode, setSyncMode] = useState<'local' | 'github'>('github');
  const [isSyncingGithub, setIsSyncingGithub] = useState<boolean>(false);
  const [lastGithubSyncTime, setLastGithubSyncTime] = useState<string | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);

  // Chronicon Engine instance initialized with current state
  const engine = useMemo(() => new ChroniconEngine(gameState), [gameState]);

  // Detected Crises / Hotspots
  const hotspots = useMemo(() => engine.detectHotspots(), [gameState, engine]);

  // Sync with GitHub repository handler
  const handleSyncGithub = async () => {
    setIsSyncingGithub(true);
    setSyncError(null);
    const result = await fetchGithubState(gameState);
    setIsSyncingGithub(false);
    
    if (result.newState) {
      setGameState(result.newState as GameStateData);
      const nowStr = new Date().toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLastGithubSyncTime(nowStr);
      engine.addLog(
        `🔄 Načten novostav z GitHub repozitáře ondrex-ember/chronicon (${result.commitInfo?.sha || 'main'}) v ${nowStr}`,
        'G',
        '🔄',
        'github_sync'
      );
    } else {
      setSyncError(result.error || 'Soubor gamestate.json zatím v repozitáři chybí. Používám vnitro-aplikační data.');
    }
  };

  const handleToggleSyncMode = (mode: 'local' | 'github') => {
    setSyncMode(mode);
    if (mode === 'github') {
      handleSyncGithub();
    }
  };

  // Initial Sync attempt on app mount if in GitHub mode
  useEffect(() => {
    if (syncMode === 'github' && !lastGithubSyncTime) {
      handleSyncGithub();
    }
  }, []);

  // Simulation Triggers
  const handleRunTick = () => {
    const nextState = engine.runTick();
    setGameState({ ...nextState });
  };

  const handleRunWeek = () => {
    const nextState = engine.runWeek();
    setGameState({ ...nextState });
  };

  const handleResetState = () => {
    if (confirm('Opravdu chcete resetovat stav věcí na výchozí data z gamestate.json?')) {
      setGameState(JSON.parse(JSON.stringify(INITIAL_GAME_STATE)));
    }
  };

  // Glassworks & Actor Creator
  const handleBindGlassworks = () => {
    const result = engine.bindGlassworks();
    setGameState({ ...engine.state });
  };

  const handleCreateCustomActor = (
    actorObj: Omit<Actor, 'ticksActive' | 'ticksInCrisis' | 'status'>,
    prodRule: ProductionRule,
    seasonMods: [number, number][]
  ) => {
    engine.createCustomActor(actorObj, prodRule, seasonMods);
    setGameState({ ...engine.state });
  };

  // Actor & Relation Updates
  const handleUpdateActor = (updatedActor: Actor) => {
    const idx = gameState.actors.findIndex(a => a.id === updatedActor.id);
    if (idx !== -1) {
      const nextActors = [...gameState.actors];
      nextActors[idx] = updatedActor;
      setGameState({ ...gameState, actors: nextActors });
    }
  };

  const handleUpdateRelation = (actorId1: string, actorId2: string, newValue: number) => {
    const nextActors = gameState.actors.map(actor => {
      if (actor.id === actorId1) {
        return {
          ...actor,
          relations: {
            ...actor.relations,
            [actorId2]: newValue
          }
        };
      }
      return actor;
    });
    setGameState({ ...gameState, actors: nextActors });
    engine.addLog(
      `GM úprava vztahu: ${actorId1} -> ${actorId2} opraveno na ${newValue > 0 ? '+' + newValue : newValue}`,
      'G',
      '🤝',
      'gm_editor'
    );
  };

  // Hotspots Intervention Actions
  const handleRescueActor = (actorId: string) => {
    if (gameState.rescueActionsLeft <= 0) {
      alert('Nemáte žádné zbývající GM Záchranné akce.');
      return;
    }

    const nextActors = gameState.actors.map(a => {
      if (a.id === actorId) {
        return {
          ...a,
          stores: Math.min(a.storesMax, a.stores + 35),
          mood: Math.min(100, a.mood + 30),
          wealth: Math.min(100, a.wealth + 20),
          status: 'stable' as const,
          ticksInCrisis: 0
        };
      }
      return a;
    });

    const targetActor = gameState.actors.find(a => a.id === actorId);

    setGameState({
      ...gameState,
      actors: nextActors,
      rescueActionsLeft: gameState.rescueActionsLeft - 1,
      globalTension: Math.max(0, gameState.globalTension - 5)
    });

    engine.addLog(
      `✨ GM Záchranný balíček uplatněn pro ${targetActor?.label || actorId}! Zásoby +35, Nálada +30%.`,
      'G',
      '✨',
      'gm_rescue'
    );
  };

  const handlePeaceDecree = () => {
    const nextTension = Math.max(10, gameState.globalTension - 15);
    setGameState({
      ...gameState,
      globalTension: nextTension
    });
    engine.addLog(
      '📜 Opat Augustin vyhlásil Mírový dekret v Olomouci! Celkové napětí v kraji kleslo o -15%.',
      'G',
      '📜',
      'gm_peace'
    );
  };

  const handleSupplyInfusion = () => {
    const keySuppliers = ['uhlic', 'kovar', 'sklar'];
    const nextActors = gameState.actors.map(a => {
      if (keySuppliers.includes(a.id)) {
        return {
          ...a,
          stores: Math.min(a.storesMax, a.stores + 30)
        };
      }
      return a;
    });

    setGameState({
      ...gameState,
      actors: nextActors
    });

    engine.addLog(
      '📦 Nouzový přísun surovin: Uhlíři, Kováři a Skláři doručeno +30 jednotek zásob.',
      'G',
      '📦',
      'gm_supply'
    );
  };

  // Scriptorium & GM
  const handleResolvePetition = (
    type: 'hospes' | 'sepultura' | 'studovna' | 'pocestny' | 'material' | 'farni',
    id: string,
    choice: 'accept' | 'decline' | 'defer'
  ) => {
    engine.resolvePetition(type, id, choice);
    setGameState({ ...engine.state });
  };

  const handleUpdateAbbotMessage = (message: string, mood: string, virtue: number) => {
    engine.updateAbbotMessage(message, mood, virtue);
    setGameState({ ...engine.state });
  };

  const handleToggleFeastFast = (type: 'feast' | 'fast' | 'clear') => {
    if (type === 'feast') {
      const isFeast = !!gameState.gm.feast;
      setGameState({
        ...gameState,
        gm: {
          ...gameState.gm,
          feast: isFeast ? null : { active: true, name_cs: 'Slavnost Žní a Sv. Václava', name_en: 'Harvest Feast' }
        }
      });
      engine.addLog(
        isFeast ? 'GM zrušil kampaň svátku.' : '🎉 Vyhlášen Celokrajský Klášterní Svátek v Olomouci!',
        'G',
        '🎉',
        'gm_editor'
      );
    } else if (type === 'fast') {
      const isFast = !!gameState.gm.fast;
      setGameState({
        ...gameState,
        gm: {
          ...gameState.gm,
          fast: isFast ? null : { active: true, name_cs: 'Svatý Půst', name_en: 'Holy Fast' }
        }
      });
      engine.addLog(
        isFast ? 'GM ukončil kampaň půstu.' : '🐟 Vyhlášen Svatý Půst! Poptávka po rybách klesne / stoupne.',
        'G',
        '🐟',
        'gm_editor'
      );
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 font-sans antialiased selection:bg-amber-800 selection:text-amber-100 pb-16">
      {/* Top Navbar */}
      <Navbar
        state={gameState}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onRunTick={handleRunTick}
        onRunWeek={handleRunWeek}
        onResetState={handleResetState}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        syncMode={syncMode}
        onToggleSyncMode={handleToggleSyncMode}
        onSyncGithub={handleSyncGithub}
        isSyncingGithub={isSyncingGithub}
        lastGithubSyncTime={lastGithubSyncTime}
      />

      {/* Main Content Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        {activeTab === 'overview' && (
          <WorldStateOverview
            state={gameState}
            onNavigateTab={setActiveTab}
            syncMode={syncMode}
            onToggleSyncMode={handleToggleSyncMode}
            onSyncGithub={handleSyncGithub}
            isSyncingGithub={isSyncingGithub}
            lastGithubSyncTime={lastGithubSyncTime}
            syncError={syncError}
          />
        )}

        {activeTab === 'influences' && (
          <InfluencesAndSupply state={gameState} onNavigateTab={setActiveTab} />
        )}

        {activeTab === 'actors' && (
          <ActorsAndRelations
            state={gameState}
            onUpdateActor={handleUpdateActor}
            onUpdateRelation={handleUpdateRelation}
          />
        )}

        {activeTab === 'glassworks' && (
          <GlassworksAndActorCreator
            state={gameState}
            onBindGlassworks={handleBindGlassworks}
            onCreateCustomActor={handleCreateCustomActor}
          />
        )}

        {activeTab === 'hotspots' && (
          <HotspotsAndCrises
            state={gameState}
            hotspots={hotspots}
            onRescueActor={handleRescueActor}
            onPeaceDecree={handlePeaceDecree}
            onSupplyInfusion={handleSupplyInfusion}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'scriptorium' && (
          <ScriptoriumAndGM
            state={gameState}
            onResolvePetition={handleResolvePetition}
            onUpdateAbbotMessage={handleUpdateAbbotMessage}
            onToggleFeastFast={handleToggleFeastFast}
          />
        )}

        {activeTab === 'trends' && <TrendsAndRoadmap state={gameState} />}
      </main>

      {/* JSON Export/Import Modal */}
      {isExportModalOpen && (
        <ExportImportModal
          state={gameState}
          onClose={() => setIsExportModalOpen(false)}
          onImportState={newState => setGameState(newState)}
        />
      )}
    </div>
  );
}
