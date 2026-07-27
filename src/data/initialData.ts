import { GameStateData, NarrativePoolStatus, RoadmapItem, ScriptoriumCommunityPoint } from '../types';
import { INITIAL_ACTORS } from './actorsData';

export const INITIAL_NARRATIVE_POOLS: NarrativePoolStatus[] = [
  {
    id: 'distant_froissart',
    name: 'Froissartovy kroniky',
    source: 'distant_events_v1.json',
    currentCount: 10,
    targetCount: 80,
    covered: [
      'Stoletá válka - obecné bitvy',
      'Obležení Calais',
      'Rytířský turnaj v Londýně',
      'Královský sňatek',
      'Bitva u Kresčaku (vč. smrti Jana Lucemburského)'
    ],
    remaining: [
      'Skotské tažení Édouarda III',
      'Černý princ v Akvitánii',
      'Vlámská cechovní povstání',
      'Námořní bitva u Sluys'
    ]
  },
  {
    id: 'distant_datini',
    name: 'Datiniho obchodní korespondence',
    source: 'distant_events_v1.json',
    currentCount: 35,
    targetCount: 80,
    covered: [
      'Avignonská pap Papežská vlna',
      'Katalánští a barcelonští piráti',
      'Florentská morová rána',
      'Janovský obchod s kořením',
      'Londýnské vlněné clo',
      'Zbrojířská a žoldnéřská ekonomika',
      'Luxusní zboží (vyřezávané truhly, obrazy, hedvábí)',
      'Bankovní směnky a úvěry'
    ],
    remaining: [
      'Plachetnice a galéry na Středozemním moři',
      'Vztahy s fontacos v Pise a Benátkách',
      'Další epizody moru na jihu'
    ]
  },
  {
    id: 'distant_coroner',
    name: 'Coroner\'s Rolls (Anglické soudní roRole)',
    source: 'distant_events_v1.json',
    currentCount: 5,
    targetCount: 50,
    covered: [
      'Opilecké nehody v krčmě',
      'Uklouznutí na ledu u řeky',
      'Pád ze střechy stodoly',
      'Pouliční rvačka na trhu'
    ],
    remaining: [
      'Utonutí v zámeckém příkopu',
      'Požáry v dílnách',
      'Řemeslné úrazy u milíře a pily',
      'Soudní spory o náhradu škody'
    ]
  },
  {
    id: 'local_olomouc',
    name: 'Olomoucké městské & krajské knihy',
    source: 'local_events_v1.json',
    currentCount: 14,
    targetCount: 120,
    covered: [
      'Městský trh a ceny chleba',
      'Rychtářský soud',
      'Radniční spor o váhu',
      'Farní matriky usmrcení'
    ],
    remaining: [
      'Cechovní spory řezníků a pekařů',
      'Stráž u městských bran',
      'Biskupství a kapitula',
      'Městská škola a studenti'
    ]
  },
  {
    id: 'local_region',
    name: 'Moravská města a panství',
    source: 'local_events_v1.json',
    currentCount: 16,
    targetCount: 150,
    covered: [
      'Litovel (solný sklad)',
      'Prostějov (soukeníci)',
      'Přerov (přívoz)',
      'Šternberk (hradní posádka)',
      'Kroměříž (biskupský dvůr)',
      'Lipník, Fulnek, Mohelnice, Kelč, Hranice'
    ],
    remaining: [
      'Konice, Vyškov, Tovačov, Zábřeh, Šumperk',
      'Sklářská huť v Bělkovicích (připravuje se Integration!)'
    ]
  },
  {
    id: 'monastery_internal',
    name: 'Klášterní deníky & role',
    source: 'monastery_internal_v1.json',
    currentCount: 29,
    targetCount: 300,
    covered: [
      'Zápis převora: mlha, dřevo, myši v sýrárně',
      'Zápis skriptora: moucha na iniciále, světlo',
      'Zápis sklepmistra: mrznoucí pivo, víno',
      'Zápis zahradníka: levandule, mráz',
      'Zápis kuchmistra: postní ryby',
      'Zápis infirmáře: byliny a bodnutí včelou'
    ],
    remaining: [
      'Návštěva biskupa',
      'Kázeňské případy noviců',
      'Vzácné codexy a chyby v opisu',
      'Postní hostina pro panstvo'
    ]
  }
];

export const INITIAL_ROADMAP_ITEMS: RoadmapItem[] = [
  {
    id: 'road_sklar',
    title: 'Zapojení Skláře / Sklárny z Bělkovic',
    category: 'actor',
    status: 'in_progress',
    priority: 'high',
    description: 'Propojení NPC skláře (Mistr Vitus) ze hry Scriptorium do produkčního řetězce Chroniconu. Tavení vitráží pro kůr a luxusního skla pro pána.',
    impact: 'Vznik nového dodavatelského řetězce (Uhlíř -> Sklář -> Opat / Vrchnost). Nové mikro-drby z Bělkovic.',
    tags: ['Sklář', 'Scriptorium NPC', 'Vitráže', 'Ekonomika'],
    targetSeason: 'Léto 1465'
  },
  {
    id: 'road_openmeteo',
    title: 'Živé meteo rozhraní (Open-Meteo Olomouc API)',
    category: 'feature',
    status: 'backlog',
    priority: 'medium',
    description: 'Předpověď počasí a historická data z Open-Meteo pro koordináty Olomouce se sezónním posunem do roku 1465.',
    impact: 'Dynamické bouřky, záplavy a mrazy s přímým dopadem na voraře, mlynáře a úrodu.',
    tags: ['Weather', 'Open-Meteo', 'Realtime'],
    targetSeason: 'Podzim 1465'
  },
  {
    id: 'road_vinice',
    title: 'Kroměřížské biskupské vinice & Vinař',
    category: 'actor',
    status: 'backlog',
    priority: 'medium',
    description: 'Nový aktér Vinař spravující biskupské vinohrady u Kroměříže. Produkce mešního vína pro Scriptorium a klášter.',
    impact: 'Spokojenost Opata +15, mešní víno jako nová komodita.',
    tags: ['Vinař', 'Mešní víno', 'Aktér'],
    targetSeason: 'Podzim 1465'
  },
  {
    id: 'road_holubnik',
    title: 'Stavba klášterního holubníku u Porty',
    category: 'event',
    status: 'in_progress',
    priority: 'high',
    description: 'Navazuje na GM zprávu od opata Augustína o holubicích. Po dokončení stavby se zrychlí doručování dopisů.',
    impact: 'Odemčení flagu `porta_holubnik`, zkrácení cooldownu zpráv na 1 tick.',
    tags: ['Porta', 'Holubník', 'Abbot Message'],
    targetSeason: 'Léto 1465'
  },
  {
    id: 'road_cechy',
    title: 'Městská cechovní rada & Rychtář',
    category: 'location',
    status: 'backlog',
    priority: 'low',
    description: 'Rozšíření městských frakcí v Olomouci o Cech soukeníků, řezníků a městského rychtáře.',
    impact: 'Vyšší variabilita lokálních drbů a možnost řešit cechovní arbitráže v klášteře.',
    tags: ['Olomouc', 'Cechy', 'Město'],
    targetSeason: 'Zima 1465'
  }
];

export const INITIAL_SCRIPTORIUM_COMMUNITY: ScriptoriumCommunityPoint[] = [
  { date: '2026-07-22', wsum_lux: 120, wsum_umbra: 0, wsum: 3 },
  { date: '2026-07-23', wsum_lux: 180, wsum_umbra: 0, wsum: 5 },
  { date: '2026-07-24', wsum_lux: 232, wsum_umbra: 0, wsum: 4 },
  { date: '2026-07-25', wsum_lux: 906, wsum_umbra: 0, wsum: 19 },
  { date: '2026-07-26', wsum_lux: 1346, wsum_umbra: 0, wsum: 28 }
];

export const INITIAL_GAME_STATE: GameStateData = {
  time: {
    year: 1465,
    season: 1, // Léto
    day: 56,
    daysPerSeason: 90,
    totalTick: 16
  },
  weather: {
    key: 'summer_cloudy',
    name: 'Oblačno',
    icon: '⛅',
    desc: 'Příjemný letní vítr, mírná oblačnost nad Olomoucí. Cesty i řeka jsou snadno průchodné.',
    tempC: 22,
    windKmH: 12,
    rainMm: 0
  },
  virtue: {
    value: 3,
    min: -10,
    max: 10
  },
  profile: 'ricni',
  epoch: 'pozdni',
  estateName: 'Olomoucké panství',
  week: 1,
  globalTension: 22,
  les: 60,
  goldenAge: false,
  goldenAgeTicks: 0,
  rescueActionsLeft: 3,
  totalPopulation: 10000,
  totalDeaths: 12,
  totalFuneralEvents: 2,
  pendingSepulturas: [
    {
      id: 'sep_01',
      actorId: 'vrchnost',
      name: 'Pán Jan z Hrušovan',
      title: 'Vznešený dárce a rytíř',
      fee: 150,
      createdAtTick: 14
    }
  ],
  pendingHospites: [
    {
      id: 'hosp_01',
      actorId: 'uhlic',
      name: 'Kryštof Uhlíř',
      profession: 'Palič dřevěného uhlí',
      cause: 'poverty',
      wealth: 18,
      createdAtTick: 15
    }
  ],
  pendingStudovna: {
    id: 'stud_01',
    cause: 'dispute',
    createdAtTick: 12
  },
  pendingPocestny: [
    {
      id: 'poc_01',
      variant: 'poutnik',
      createdAtTick: 16
    }
  ],
  unlockedFlags: ['porta_offer'],
  actors: INITIAL_ACTORS,
  gm: {
    abbot_name: 'Bratr Augustin',
    abbot_mood: 'natěšený',
    abbot_virtue: 5,
    abbot_portrait: null,
    scrinium_open: true,
    abbot_message: 'Milost Boží buď s vámi, bratřie. Pan opat z cest svých se navrátil s novinou radostnou a skrze mne káže vám zvěstovati: Zjednalť on pro nás hejno holubic cvičených, by zprávy a psaní naše nosily. Pročež jest vůlí jeho, a já k tomu důtklivě nabádám, abyste bez meškání ke stavbě holubníku přikročili.',
    abbot_message_en: 'The Grace of the Lord be with thee, brethren. Our Lord Abbot hath returned bearing gladsome tidings...',
    feast: null,
    fast: null,
    tension_modifier: 0,
    event_inject: null
  },
  log: [
    {
      text: 'Bratr Augustin vyhlásil výzvu ke stavbě holubníku u Porty kláštera.',
      text_cs: 'Bratr Augustin vyhlásil výzvu ke stavbě holubníku u Porty kláštera.',
      type: 'G',
      icon: '📜',
      source: 'gm',
      tick: 16,
      year: 1465,
      season: 'Léto',
      day: 56
    },
    {
      text: 'Mlynář hlásí: bez kování se vodní kolo zastavilo. Kovář čeká na zásilku dřevěného uhlí od Uhlíře.',
      text_cs: 'Mlynář hlásí: bez kování se vodní kolo zastavilo. Kovář čeká na zásilku dřevěného uhlí od Uhlíře.',
      type: 'A',
      icon: '⚠️',
      source: 'supply_chain',
      tick: 15,
      year: 1465,
      season: 'Léto',
      day: 55
    },
    {
      text: 'Počasí: Letní slunce prohřálo luka u řeky Moravy. Rybníkář hlásí hojný odlov kaprů.',
      text_cs: 'Počasí: Letní slunce prohřálo luka u řeky Moravy. Rybníkář hlásí hojný odlov kaprů.',
      type: 'W',
      icon: '☀️',
      source: 'weather',
      tick: 14,
      year: 1465,
      season: 'Léto',
      day: 54
    },
    {
      text: 'Scriptorium: Hráči přispěli 1,346 bodů Lux do klášterní pokladnice.',
      text_cs: 'Scriptorium: Hráči přispěli 1,346 bodů Lux do klášterní pokladnice.',
      type: 'S',
      icon: '✨',
      source: 'scriptorium',
      tick: 13,
      year: 1465,
      season: 'Léto',
      day: 53
    }
  ],
  flags: {
    started: true,
    paused: false
  }
};
