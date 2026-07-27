import { Actor, ProductionRule, SeasonMod } from '../types';

export const INITIAL_ACTORS: Actor[] = [
  {
    id: 'vrchnost',
    label: 'Vrchnost',
    label_en: 'The Lordship',
    profession: 'Pán panství',
    profession_en: 'Lord of the Manor',
    core: true,
    wealth: 70,
    mood: 65,
    stores: 50,
    storesMax: 100,
    status: 'stable',
    ticksActive: 16,
    ticksInCrisis: 0,
    icon: '🏰',
    notes: 'Pán Olomouckého panství. Vyžaduje legitimitu, luxusní zboží a desátky.',
    relations: {
      mlynar: 30, kovar: 20, uhlic: 10, vorar: 10, rybnikar: 20,
      prevoznik: 40, valach: 15, klaster: -10, vcelar: 10
    }
  },
  {
    id: 'mlynar',
    label: 'Mlynář',
    label_en: 'The Miller',
    profession: 'Mlynář',
    profession_en: 'Miller',
    core: true,
    wealth: 55,
    mood: 60,
    stores: 45,
    storesMax: 90,
    status: 'stable',
    ticksActive: 16,
    ticksInCrisis: 0,
    icon: '⚙️',
    notes: 'Mele obilí pro město i klášter. Závislý na kování od Kováře pro opravu vodního kola.',
    relations: {
      vrchnost: 30, kovar: 40, uhlic: 5, vorar: 20, rybnikar: -25,
      prevoznik: 10, valach: 0, klaster: 10, vcelar: 0
    }
  },
  {
    id: 'kovar',
    label: 'Kovář',
    label_en: 'The Blacksmith',
    profession: 'Kovář',
    profession_en: 'Blacksmith',
    core: true,
    wealth: 50,
    mood: 65,
    stores: 40,
    storesMax: 80,
    status: 'stable',
    ticksActive: 16,
    ticksInCrisis: 0,
    icon: '🔨',
    notes: 'Kuje nástroje a nářadí. Potřebuje neustálý přísun dřevěného uhlí od Uhlíře.',
    relations: {
      vrchnost: 20, mlynar: 40, uhlic: 50, vorar: 0, rybnikar: 0,
      prevoznik: 0, valach: 20, klaster: 0, vcelar: 15
    }
  },
  {
    id: 'uhlic',
    label: 'Uhlíř',
    label_en: 'The Charcoal Burner',
    profession: 'Uhlíř',
    profession_en: 'Charcoal Burner',
    core: true,
    wealth: 30,
    mood: 50,
    stores: 30,
    storesMax: 70,
    status: 'stable',
    ticksActive: 16,
    ticksInCrisis: 0,
    icon: '🪵',
    notes: 'Pálí dřevěné uhlí v hlubokých lesích. Klíčový dodavatel pro kováře i skláře.',
    relations: {
      vrchnost: 10, mlynar: 5, kovar: 50, vorar: 0, rybnikar: 0,
      prevoznik: 0, valach: 5, klaster: 0, vcelar: 0
    }
  },
  {
    id: 'vorar',
    label: 'Vorař',
    label_en: 'The Raftsman',
    profession: 'Vorař',
    profession_en: 'Raftsman',
    core: true,
    wealth: 45,
    mood: 60,
    stores: 20,
    storesMax: 50,
    status: 'stable',
    ticksActive: 16,
    ticksInCrisis: 0,
    icon: '🪵',
    notes: 'Plaví dřevo po řece Moravě. Má vleklé spory s Rybníkářem kvůli stavbě jezů.',
    relations: {
      vrchnost: 10, mlynar: 20, kovar: 0, uhlic: 0, rybnikar: -30,
      prevoznik: 15, valach: 0, klaster: 0, vcelar: 0
    }
  },
  {
    id: 'rybnikar',
    label: 'Rybníkář',
    label_en: 'The Pondkeeper',
    profession: 'Rybníkář',
    profession_en: 'Pondkeeper',
    core: true,
    wealth: 40,
    mood: 55,
    stores: 30,
    storesMax: 70,
    status: 'stable',
    ticksActive: 16,
    ticksInCrisis: 0,
    icon: '🐟',
    notes: 'Spravuje klášterní i městské rybníky. Dodává čerstvé ryby pro postní období.',
    relations: {
      vrchnost: 20, mlynar: -25, kovar: 0, uhlic: 0, vorar: -30,
      prevoznik: 0, valach: 0, klaster: 45, vcelar: 0
    }
  },
  {
    id: 'prevoznik',
    label: 'Převozník',
    label_en: 'The Ferryman',
    profession: 'Mýtný',
    profession_en: 'Toll Collector',
    core: true,
    wealth: 50,
    mood: 55,
    stores: 25,
    storesMax: 60,
    status: 'stable',
    ticksActive: 16,
    ticksInCrisis: 0,
    icon: '🛶',
    notes: 'Provozuje přívoz a vybírá mýto u říčního přechodu. Blízký spojenec Vrchnosti.',
    relations: {
      vrchnost: 40, mlynar: 10, kovar: 0, uhlic: 0, vorar: 15,
      rybnikar: 0, valach: 0, klaster: 0, vcelar: 0
    }
  },
  {
    id: 'valach',
    label: 'Valach',
    label_en: 'The Shepherd',
    profession: 'Valach',
    profession_en: 'Shepherd',
    core: true,
    wealth: 35,
    mood: 55,
    stores: 35,
    storesMax: 70,
    status: 'stable',
    ticksActive: 16,
    ticksInCrisis: 0,
    icon: '🐑',
    notes: 'Chová ovce na kopcích kolem Bělkovic a Šternberka. Dodává vlnu a ovčí sýry.',
    relations: {
      vrchnost: 15, mlynar: 0, kovar: 20, uhlic: 5, vorar: 0,
      rybnikar: 0, prevoznik: 0, klaster: 20, vcelar: 0
    }
  },
  {
    id: 'klaster',
    label: 'Opat',
    label_en: 'The Abbot',
    profession: 'Opat ve městě',
    profession_en: 'Abbot in the City',
    core: true,
    wealth: 65,
    mood: 50,
    stores: 60,
    storesMax: 100,
    status: 'stable',
    ticksActive: 16,
    ticksInCrisis: 0,
    icon: '⛪',
    notes: 'Hlava městského kláštera a Scriptorium. Udržuje duchovní autoritu a legitimitu.',
    relations: {
      vrchnost: -10, mlynar: 10, kovar: 0, uhlic: 0, vorar: 0,
      rybnikar: 45, prevoznik: 0, valach: 20, vcelar: 35
    }
  },
  {
    id: 'vcelar',
    label: 'Včelař',
    label_en: 'The Beekeeper',
    profession: 'Včelař',
    profession_en: 'Beekeeper',
    core: true,
    wealth: 35,
    mood: 60,
    stores: 40,
    storesMax: 80,
    status: 'stable',
    ticksActive: 16,
    ticksInCrisis: 0,
    icon: '🐝',
    notes: 'Stáčí med a svíčkový vosk pro skriptorium a oltáře. Blízký klášteru.',
    relations: {
      vrchnost: 10, mlynar: 0, kovar: 15, uhlic: 0, vorar: 0,
      rybnikar: 0, prevoznik: 0, valach: 0, klaster: 35
    }
  }
];

export const INITIAL_PROD_TABLE: Record<string, ProductionRule> = {
  vrchnost:  { base: 0,   deps: [],        produces: 'legitimacy', label_cs: 'Legitimita & Správa' },
  mlynar:    { base: 3.5, deps: ['kovar'], produces: 'mouka',      label_cs: 'Mouka' },
  kovar:     { base: 3.0, deps: ['uhlic'], produces: 'kovani',     label_cs: 'Kování & Nářadí' },
  uhlic:     { base: 2.5, deps: [],        produces: 'uhli',       label_cs: 'Dřevěné uhlí' },
  vorar:     { base: 2.5, deps: [],        produces: 'doprava',    label_cs: 'Dřevo & Doprava' },
  rybnikar:  { base: 2.5, deps: [],        produces: 'ryby',       label_cs: 'Čerstvé ryby' },
  prevoznik: { base: 3.0, deps: [],        produces: 'myto',       label_cs: 'Mýtné & Přechod' },
  valach:    { base: 2.5, deps: [],        produces: 'vlna',       label_cs: 'Vlna & Sýry' },
  klaster:   { base: 2.5, deps: [],        produces: 'legitimita', label_cs: 'Duchovní milost' },
  vcelar:    { base: 2.2, deps: [],        produces: 'med',        label_cs: 'Med & Vosk' },
};

export const INITIAL_SEASON_MODS: Record<string, [number, number][]> = {
  vrchnost:  [[1.0, 0], [1.0, 0], [1.0, 5], [1.0, -5]],
  mlynar:    [[0.7, -10], [1.2, 5], [1.5, 15], [0.6, -5]],
  kovar:     [[1.1, 5], [1.0, -5], [1.2, 5], [1.1, 5]],
  uhlic:     [[0.8, -5], [1.3, 5], [1.2, 0], [0.4, -15]],
  vorar:     [[0.5, -15], [1.3, 10], [1.2, 5], [0.1, -20]],
  rybnikar:  [[1.3, 10], [0.8, -10], [1.5, 15], [0.6, -5]],
  prevoznik: [[0.6, -10], [1.4, 15], [1.3, 10], [0.3, -20]],
  klaster:   [[1.1, 10], [0.9, -5], [1.1, 5], [1.2, 10]],
  valach:    [[1.2, 10], [1.3, 10], [1.0, 0], [0.5, -15]],
  vcelar:    [[0.5, -5], [1.5, 15], [1.3, 10], [0.0, -20]],
  default:   [[1.0, 0], [1.0, 0], [1.0, 0], [0.9, -5]],
};

export const COMMODITY_VALUE: Record<string, number> = {
  uhli: 1.0,
  mouka: 1.5,
  kovani: 2.0,
  vlna: 2.0,
  med: 3.0,
  ryby: 1.5,
  doprava: 1.5,
  myto: 1.5,
  legitimita: 2.0,
  sklo: 3.5,
  vitraze: 4.0,
};

// Preset definition for Sklář / Sklárna v Bělkovicích (for 1-click binding with Scriptorium NPC)
export const SKLAR_PRESET_ACTOR: Actor = {
  id: 'sklar',
  label: 'Mistr Vitus',
  label_en: 'Master Vitus (Glassmaker)',
  profession: 'Sklář v Bělkovicích',
  profession_en: 'Glassmaker in Bělkovice',
  core: false,
  wealth: 52,
  mood: 68,
  stores: 35,
  storesMax: 75,
  status: 'stable',
  ticksActive: 0,
  ticksInCrisis: 0,
  icon: '🧪',
  notes: 'Sklářská huť u Bělkovic. Propojený NPC kontakt ze hry Scriptorium. Taví vitráže pro klášterní okna a sklenice pro Vrchnost.',
  relations: {
    vrchnost: 35,  // Pán kupuje luxusní sklenice
    klaster: 45,   // Opat potřebuje vitráže do refektáře a skriptoria
    uhlic: 40,     // Závislý na velkém množství uhlí do pecí
    kovar: 20,     // Potřebuje železné rošty a píšťaly
    vcelar: 15,    // Voskové formy
    mlynar: 10,    // Drcení křemene
    vorar: 15,     // Doprava písku a křemene
    rybnikar: 0,
    prevoznik: 10,
    valach: 5
  }
};

export const SKLAR_PRESET_PROD: ProductionRule = {
  base: 2.8,
  deps: ['uhlic'], // Potřebuje uhlí pro tavení v peci
  produces: 'vitraze',
  label_cs: 'Vitráže & Sklo'
};

export const SKLAR_PRESET_SEASON_MODS: [number, number][] = [
  [0.8, 0],   // Jaro: příprava pece
  [1.4, 15],  // Léto: plný žár, nejlepší tavení
  [1.2, 5],   // Podzim: dodávky pro chrámy
  [0.2, -15]  // Zima: pec zamrzá, vysoká spotřeba dreva
];
