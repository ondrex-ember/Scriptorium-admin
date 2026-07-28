export type SeasonId = 0 | 1 | 2 | 3; // 0=Jaro, 1=Léto, 2=Podzim, 3=Zima
export type ActorStatus = 'stable' | 'krize' | 'zanikajici' | 'mrtvy';

export interface Actor {
  id: string;
  label: string;
  label_en: string;
  profession: string;
  profession_en: string;
  core: boolean;
  wealth: number;     // 0-100
  mood: number;       // 0-100
  stores: number;     // Current commodity stock
  storesMax: number;  // Max store capacity
  status: ActorStatus;
  ticksActive: number;
  ticksInCrisis: number;
  relations: Record<string, number>; // id -> relation score (-100 to 100)
  icon?: string;
  notes?: string;
}

export interface ProductionRule {
  base: number;
  deps: string[];       // Dependencies on other actor IDs
  produces: string;    // Commodity name
  label_cs?: string;
}

export interface SeasonMod {
  actorId: string;
  mods: [number, number][]; // [prodMod, moodDelta] for [Jaro, Léto, Podzim, Zima]
}

export interface GameTime {
  year: number;
  season: SeasonId;
  day: number;
  daysPerSeason: number;
  totalTick: number;
}

export interface WeatherInfo {
  key: string;
  name: string;
  icon: string;
  desc: string;
  tempC?: number;
  windKmH?: number;
  rainMm?: number;
}

export interface VirtueState {
  value: number;
  min: number;
  max: number;
}

export interface GMState {
  abbot_name: string;
  abbot_mood: string;
  abbot_virtue: number;
  abbot_portrait: string | null;
  scrinium_open: boolean;
  abbot_message: string | null;
  abbot_message_en: string | null;
  feast: { active: boolean; name_cs: string; name_en: string } | null;
  fast: { active: boolean; name_cs: string; name_en: string } | null;
  tension_modifier: number;
  event_inject: string | null;
}

export interface LogEntry {
  text: string;
  text_cs: string;
  text_en?: string | null;
  type?: 'A' | 'W' | 'E' | 'G' | 'S'; // Action, Weather, Event, GM, Scriptorium
  icon?: string | null;
  source?: string;
  tick: number;
  year: number;
  season: string;
  day: number;
}

export interface PendingHospes {
  id: string;
  actorId?: string;
  name: string;
  profession: string;
  cause: 'plague' | 'war' | 'poverty';
  wealth: number;
  createdAtTick: number;
}

export interface PendingSepultura {
  id: string;
  actorId: string;
  name: string;
  title: string;
  fee: number;
  createdAtTick: number;
}

export interface PendingStudovna {
  id: string;
  cause: 'dispute' | 'lineage' | 'testament';
  createdAtTick: number;
}

export interface PendingPocestny {
  id: string;
  variant: 'poutnik' | 'kramar' | 'zebravy_mnich';
  createdAtTick: number;
}

// Q2 port (27.7.2026) — mirror reálných polí z chronicon/core/engine.js,
// ne admin dashboardu vlastní konvence (fee/wealth apod.), aby import
// skutečného snapshotu/state JSONu seděl beze změn.
export interface PendingMaterialRequest {
  id: string;
  actorId: string;
  itemId: string;
  qty: number;
  deadlineDays: number;
  rewardGrose: number;
}

export interface PendingFarniEvent {
  id: string;
  week: number;
  farniType: 'baptism' | 'wedding' | 'funeral';
}

export interface ScriptoriumCommunityPoint {
  date: string;
  wsum_lux: number;
  wsum_umbra: number;
  wsum: number;
}

export interface GameStateData {
  time: GameTime;
  weather: WeatherInfo;
  virtue: VirtueState;
  profile: string;
  epoch: string;
  estateName: string;
  week: number;
  globalTension: number;
  les: number;
  goldenAge: boolean;
  goldenAgeTicks: number;
  rescueActionsLeft: number;
  totalPopulation: number;
  totalDeaths: number;
  totalFuneralEvents: number;
  pendingSepulturas: PendingSepultura[];
  pendingHospites: PendingHospes[];
  pendingStudovna: PendingStudovna | null;
  pendingPocestny: PendingPocestny[];
  pendingMaterialRequest: PendingMaterialRequest | null;
  pendingFarniEvents: PendingFarniEvent[];
  unlockedFlags: string[];
  actors: Actor[];
  gm: GMState;
  log: LogEntry[];
  flags: {
    started: boolean;
    paused: boolean;
  };
}

export interface NarrativePoolStatus {
  id: string;
  name: string;
  source: string;
  currentCount: number;
  targetCount: number;
  covered: string[];
  remaining: string[];
}

export interface RoadmapItem {
  id: string;
  title: string;
  category: 'actor' | 'location' | 'event' | 'feature' | 'scriptorium';
  status: 'backlog' | 'in_progress' | 'completed';
  priority: 'high' | 'medium' | 'low';
  description: string;
  impact: string;
  tags: string[];
  targetSeason?: string;
}

export interface FireHotspot {
  id: string;
  title: string;
  type: 'supply' | 'crisis' | 'feud' | 'tension' | 'petition';
  severity: 'critical' | 'warning' | 'info';
  actorId?: string;
  description: string;
  impactText: string;
  suggestedAction: string;
}
