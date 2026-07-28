import { GameStateData, Actor, ProductionRule, LogEntry, FireHotspot } from '../types';
import { INITIAL_PROD_TABLE, INITIAL_SEASON_MODS, SKLAR_PRESET_ACTOR, SKLAR_PRESET_PROD, SKLAR_PRESET_SEASON_MODS } from '../data/actorsData';

const WEATHER_POOL = [
  { key: 'summer_clear', name: 'Jasno a horko', icon: '☀️', desc: 'Slunce praží na střechy Olomouce. Žně pokročily.' },
  { key: 'summer_cloudy', name: 'Oblačno', icon: '⛅', desc: 'Příjemný letní vítr, mírná oblačnost nad krajem.' },
  { key: 'summer_rain', name: 'Letní deštík', icon: '🌧️', desc: 'Mírný déšť svlažil polnosti a zvedl hladinu Moravy.' },
  { key: 'summer_storm', name: 'Blesky a hrom', icon: '🌩️', desc: 'Prudká letní bouře. Voraři museli přirazit ke břehu.' },
  { key: 'summer_fog', name: 'Ranní mlhy', icon: '🌫️', desc: 'Hustá mlha nad lužními lesy u řeky.' }
];

export class ChroniconEngine {
  public state: GameStateData;
  public prodTable: Record<string, ProductionRule>;
  public seasonMods: Record<string, [number, number][]>;

  constructor(initialState: GameStateData) {
    this.state = JSON.parse(JSON.stringify(initialState));
    this.prodTable = JSON.parse(JSON.stringify(INITIAL_PROD_TABLE));
    this.seasonMods = JSON.parse(JSON.stringify(INITIAL_SEASON_MODS));

    // Check if glassmaker (sklar) is already in state
    if (this.state.actors.some(a => a.id === 'sklar')) {
      this.prodTable['sklar'] = SKLAR_PRESET_PROD;
      this.seasonMods['sklar'] = SKLAR_PRESET_SEASON_MODS;
    }
  }

  // Bind Sklář / Sklárna NPC from Scriptorium into live Chronicon state
  public bindGlassworks(): { success: boolean; message: string } {
    if (this.state.actors.some(a => a.id === 'sklar')) {
      return { success: false, message: 'Sklář (Mistr Vitus) už je do světa Chroniconu zapojen.' };
    }

    // Add actor
    const glassmaker: Actor = JSON.parse(JSON.stringify(SKLAR_PRESET_ACTOR));
    this.state.actors.push(glassmaker);

    // Add production rule and season mods
    this.prodTable['sklar'] = SKLAR_PRESET_PROD;
    this.seasonMods['sklar'] = SKLAR_PRESET_SEASON_MODS;

    // Add reciprocal relations for all existing actors with glassmaker
    this.state.actors.forEach(actor => {
      if (actor.id !== 'sklar') {
        const initRel = SKLAR_PRESET_ACTOR.relations[actor.id] || 0;
        actor.relations['sklar'] = Math.round(initRel * 0.8); // Reciprocal initial affinity
      }
    });

    // Add unlock flag
    if (!this.state.unlockedFlags.includes('sklo_povoleni')) {
      this.state.unlockedFlags.push('sklo_povoleni');
    }

    // Log event
    this.addLog(
      '📜 Sklárna v Bělkovicích (Mistr Vitus ze Skriptoria) byla oficiálně připojena k Olomouckému panství! Vznikl nový řetězec: Uhlíř -> Sklář -> Opat / Vrchnost.',
      'G',
      '🔮',
      'admin_action'
    );

    return { success: true, message: 'Sklář (Mistr Vitus) byl úspěšně propojen se světem Chroniconu!' };
  }

  // Create a completely new custom actor
  public createCustomActor(
    actorData: Omit<Actor, 'ticksActive' | 'ticksInCrisis' | 'status'>,
    prodRule: ProductionRule,
    seasonModList: [number, number][]
  ): { success: boolean; message: string } {
    if (this.state.actors.some(a => a.id === actorData.id)) {
      return { success: false, message: `Aktér s ID "${actorData.id}" již existuje.` };
    }

    const newActor: Actor = {
      ...actorData,
      status: 'stable',
      ticksActive: 0,
      ticksInCrisis: 0,
      relations: { ...actorData.relations }
    };

    this.state.actors.push(newActor);
    this.prodTable[newActor.id] = prodRule;
    this.seasonMods[newActor.id] = seasonModList;

    // Reciprocal relations
    this.state.actors.forEach(existing => {
      if (existing.id !== newActor.id) {
        const relValue = actorData.relations[existing.id] || 0;
        existing.relations[newActor.id] = relValue;
      }
    });

    this.addLog(
      `Založen nový aktér "${newActor.label}" (${newActor.profession}). Produkce: ${prodRule.label_cs || prodRule.produces}.`,
      'G',
      newActor.icon || '👤',
      'admin_actor_creator'
    );

    return { success: true, message: `Aktér ${newActor.label} byl úspěšně založen a zapojen do ekonomiky!` };
  }

  // Run a single 6-hour tick
  public runTick(): GameStateData {
    const t = this.state.time;
    t.totalTick++;

    // Day advance every 4 ticks
    if (t.totalTick % 4 === 0) {
      t.day++;
      if (t.day > t.daysPerSeason) {
        t.day = 1;
        t.season = ((t.season + 1) % 4) as 0 | 1 | 2 | 3;
      }
    }

    // Weather transition (chance on new day or tick 1)
    if (t.totalTick % 4 === 1) {
      const w = WEATHER_POOL[Math.floor(Math.random() * WEATHER_POOL.length)];
      this.state.weather = {
        ...w,
        tempC: Math.round(18 + Math.random() * 8),
        windKmH: Math.round(5 + Math.random() * 15),
        rainMm: w.key.includes('rain') ? 8 : w.key.includes('storm') ? 22 : 0
      };
      this.addLog(`Změna počasí: ${w.name}. ${w.desc}`, 'W', w.icon, 'weather');
    }

    // Weekly economic cycle every 28 ticks (7 days)
    if (t.totalTick % 28 === 0) {
      this.runWeeklyEconomy();
    }

    // Update tension
    const crisisActorsCount = this.state.actors.filter(a => a.status === 'krize' || a.status === 'zanikajici').length;
    this.state.globalTension = Math.max(0, Math.min(100, 15 + crisisActorsCount * 8 + this.state.gm.tension_modifier));

    return this.state;
  }

  // Run 1 whole week (28 ticks)
  public runWeek(): GameStateData {
    for (let i = 0; i < 28; i++) {
      this.runTick();
    }
    return this.state;
  }

  // Weekly economic computation
  private runWeeklyEconomy() {
    this.state.week++;
    const seasonIdx = this.state.time.season;

    this.state.actors.forEach(actor => {
      if (actor.status === 'mrtvy') return;
      actor.ticksActive++;

      const prodInfo = this.prodTable[actor.id] || { base: 2.5, deps: [], produces: 'zbozi' };
      const seasonConfig = this.seasonMods[actor.id] || this.seasonMods['default'];
      const [prodMod, moodDelta] = seasonConfig[seasonIdx] || [1.0, 0];

      // Check supply dependencies
      let blocked = false;
      let blockingActorLabel = '';

      for (const depId of prodInfo.deps) {
        const depActor = this.state.actors.find(a => a.id === depId);
        if (depActor && (depActor.status === 'mrtvy' || depActor.stores < 5)) {
          blocked = true;
          blockingActorLabel = depActor.label;
          break;
        }
      }

      if (blocked) {
        actor.mood = Math.max(10, actor.mood - 8);
        this.addLog(
          `⚠️ ${actor.label} nemůže vyrábět: chybí suroviny od ${blockingActorLabel}. Výroba stojí.`,
          'A',
          '⚠️',
          'supply_block'
        );
      } else {
        // Successful production
        const producedQty = Math.round(prodInfo.base * prodMod * 10) / 10;
        actor.stores = Math.min(actor.storesMax, Math.round(actor.stores + producedQty));
        actor.mood = Math.max(10, Math.min(100, actor.mood + moodDelta));

        // Consume stores slightly
        actor.stores = Math.max(0, actor.stores - Math.round(producedQty * 0.4));
      }

      // Wealth evolution based on stores and mood
      if (actor.stores > 40 && actor.mood > 50) {
        actor.wealth = Math.min(100, actor.wealth + 2);
      } else if (actor.stores < 10 || actor.mood < 30) {
        actor.wealth = Math.max(10, actor.wealth - 2);
      }

      // Update status
      if (actor.wealth < 20 || actor.mood < 25) {
        actor.status = 'krize';
        actor.ticksInCrisis++;
      } else {
        actor.status = 'stable';
        actor.ticksInCrisis = 0;
      }
    });

    this.addLog(`Týden ${this.state.week}: Týdenní hospodářský cyklus proběhl úspěšně.`, 'A', '📈', 'economy');
  }

  // Handle Scriptorium Petition Actions
  public resolvePetition(type: 'hospes' | 'sepultura' | 'studovna' | 'pocestny' | 'material' | 'farni', id: string, choice: 'accept' | 'decline' | 'defer') {
    if (type === 'hospes') {
      const idx = this.state.pendingHospites.findIndex(h => h.id === id);
      if (idx !== -1) {
        const item = this.state.pendingHospites[idx];
        this.state.pendingHospites.splice(idx, 1);
        if (choice === 'accept') {
          this.state.virtue.value = Math.min(10, this.state.virtue.value + 1);
          this.addLog(`Klášter přijal nemocného/potřebného ${item.name} (${item.profession}) do Infirmaria. Zbožnost kláštera vzrostla.`, 'S', '🏥', 'scriptorium');
        } else if (choice === 'decline') {
          this.addLog(`Klášter odmítl žádost ${item.name}.`, 'S', '❌', 'scriptorium');
        }
      }
    } else if (type === 'sepultura') {
      const idx = this.state.pendingSepulturas.findIndex(s => s.id === id);
      if (idx !== -1) {
        const item = this.state.pendingSepulturas[idx];
        this.state.pendingSepulturas.splice(idx, 1);
        if (choice === 'accept') {
          this.state.totalFuneralEvents++;
          this.addLog(`Klášter udělil právo sepultury pro ${item.name}. Poplatek ${item.fee} grošů byl připsán.`, 'S', '⚰️', 'scriptorium');
        }
      }
    } else if (type === 'studovna') {
      if (this.state.pendingStudovna && this.state.pendingStudovna.id === id) {
        this.state.pendingStudovna = null;
        if (choice === 'accept') {
          const vrchnost = this.state.actors.find(a => a.id === 'vrchnost');
          if (vrchnost) vrchnost.relations['klaster'] = Math.min(100, (vrchnost.relations['klaster'] || 0) + 15);
          this.addLog('Klášter otevřel Studovnu pro Vrchnost. Vztahy s Pánem panství se zlepšily (+15).', 'S', '📜', 'scriptorium');
        }
      }
    } else if (type === 'pocestny') {
      const idx = this.state.pendingPocestny.findIndex(p => p.id === id);
      if (idx !== -1) {
        this.state.pendingPocestny.splice(idx, 1);
        if (choice === 'accept') {
          this.addLog('Vrátný přijal pocestného u brány na nocleh.', 'S', '🥾', 'scriptorium');
        }
      }
    } else if (type === 'material') {
      // Q2 port — max 1 aktivní najednou (mirror studovna), ne fronta.
      if (this.state.pendingMaterialRequest && this.state.pendingMaterialRequest.id === id) {
        const item = this.state.pendingMaterialRequest;
        this.state.pendingMaterialRequest = null;
        if (choice === 'accept') {
          this.addLog(`Klášter dodal materiál ${item.itemId} (${item.qty} ks) aktérovi ${item.actorId}. Odměna ${item.rewardGrose} grošů.`, 'S', '📦', 'scriptorium');
        } else if (choice === 'decline') {
          this.addLog(`Klášter žádost o materiál ${item.itemId} pro ${item.actorId} odmítl.`, 'S', '❌', 'scriptorium');
        }
      }
    } else if (type === 'farni') {
      const idx = this.state.pendingFarniEvents.findIndex(f => f.id === id);
      if (idx !== -1) {
        const item = this.state.pendingFarniEvents[idx];
        this.state.pendingFarniEvents.splice(idx, 1);
        if (choice === 'accept') {
          this.addLog(`Klášter vykonal farní obřad (${item.farniType}).`, 'S', '✝️', 'scriptorium');
        } else if (choice === 'decline') {
          this.addLog(`Klášter farní žádost (${item.farniType}) odmítl.`, 'S', '❌', 'scriptorium');
        }
      }
    }
  }

  // Detect Active Crises & "Co hoří"
  public detectHotspots(): FireHotspot[] {
    const hotspots: FireHotspot[] = [];

    // 1. Supply Chain Bottlenecks
    this.state.actors.forEach(actor => {
      const prodRule = this.prodTable[actor.id];
      if (prodRule && prodRule.deps.length > 0) {
        prodRule.deps.forEach(depId => {
          const supplier = this.state.actors.find(a => a.id === depId);
          if (supplier && (supplier.stores < 10 || supplier.status === 'krize')) {
            hotspots.push({
              id: `supply_${actor.id}_${depId}`,
              title: `Prerušená dodávka: ${actor.label} <- ${supplier.label}`,
              type: 'supply',
              severity: supplier.stores < 5 ? 'critical' : 'warning',
              actorId: actor.id,
              description: `${actor.label} nemůže vyrábět (${prodRule.produces}), protože ${supplier.label} má kriticky nízké zásoby (${supplier.stores}/${supplier.storesMax}).`,
              impactText: `Hrozí kolaps výroby u ${actor.label} a pokles jeho nálady.`,
              suggestedAction: `Dodat zásoby nebo provést rescue akci pro ${supplier.label}.`
            });
          }
        });
      }
    });

    // 2. Depressed or Broke Actors
    this.state.actors.forEach(actor => {
      if (actor.status === 'krize' || actor.wealth < 25 || actor.mood < 30) {
        hotspots.push({
          id: `crisis_${actor.id}`,
          title: `Krize aktéra: ${actor.label}`,
          type: 'crisis',
          severity: actor.wealth < 20 ? 'critical' : 'warning',
          actorId: actor.id,
          description: `${actor.label} je v těžké tísni. Bohatství: ${actor.wealth}%, Nálada: ${actor.mood}%. Status: ${actor.status}.`,
          impactText: 'Pokud krize přetrvá 3 týdny, aktér může zkrachovat.',
          suggestedAction: 'GM Zásah / Přidělení štědré dotace z kláštera nebo odpustku.'
        });
      }
    });

    // 3. Feuds & Hostilities (Relations <= -30)
    for (let i = 0; i < this.state.actors.length; i++) {
      for (let j = i + 1; j < this.state.actors.length; j++) {
        const a1 = this.state.actors[i];
        const a2 = this.state.actors[j];
        const score1 = a1.relations[a2.id] || 0;
        const score2 = a2.relations[a1.id] || 0;
        if (score1 <= -30 || score2 <= -30) {
          hotspots.push({
            id: `feud_${a1.id}_${a2.id}`,
            title: `Otevřený spor: ${a1.label} ⚔️ ${a2.label}`,
            type: 'feud',
            severity: (score1 <= -40 || score2 <= -40) ? 'critical' : 'warning',
            description: `Mezi ${a1.label} (vztah: ${score1}) a ${a2.label} (vztah: ${score2}) panuje nepřátelství.`,
            impactText: 'Riziko sabotáže na řece či trhu a zvyšování celkového napětí.',
            suggestedAction: 'Vyhlásit GM mír, smírčí soud v klášteře nebo svátek.'
          });
        }
      }
    }

    // 4. High Global Tension
    if (this.state.globalTension > 40) {
      hotspots.push({
        id: 'tension_high',
        title: `Vysoké napětí v kraji (${this.state.globalTension}%)`,
        type: 'tension',
        severity: this.state.globalTension > 60 ? 'critical' : 'warning',
        description: 'Celkové napětí v Olomouckém panství nebezpečně stoupá.',
        impactText: 'Zvyšuje pravděpodobnost nahodilých nepokojů, opileckých rvaček a požárů.',
        suggestedAction: 'Vyhlásit klášterní svátek nebo vyslat uklidňující poselství od Opata.'
      });
    }

    // 5. Backlogged Scriptorium Petitions
    const totalPetitions = this.state.pendingHospites.length + this.state.pendingSepulturas.length + (this.state.pendingStudovna ? 1 : 0);
    if (totalPetitions >= 2) {
      hotspots.push({
        id: 'petitions_backlog',
        title: `Nevyřízené žádosti ze Skriptoria (${totalPetitions})`,
        type: 'petition',
        severity: 'info',
        description: 'U brány a v kanceláři čekají nevyřízené petice od hráčů / z venkovního kláštera.',
        impactText: 'Zdržení rozhodnutí o Infirmariu, Sepultuře či Studovně.',
        suggestedAction: 'Přejít do Scriptorium Decision Desk a schválit/odmítnout žádosti.'
      });
    }

    return hotspots;
  }

  // Inject GM Abbot Message
  public updateAbbotMessage(message: string, mood: string, virtue: number) {
    this.state.gm.abbot_message = message;
    this.state.gm.abbot_mood = mood;
    this.state.gm.abbot_virtue = virtue;

    this.addLog(
      `Opat Augustin posílá novou Zlatou zprávu do Skriptoria: "${message.substring(0, 70)}..."`,
      'G',
      '📜',
      'gm_editor'
    );
  }

  // Add Log Entry
  public addLog(text: string, type: 'A' | 'W' | 'E' | 'G' | 'S' = 'A', icon: string = '📜', source: string = 'dashboard') {
    const entry: LogEntry = {
      text,
      text_cs: text,
      type,
      icon,
      source,
      tick: this.state.time.totalTick,
      year: this.state.time.year,
      season: ['Jaro', 'Léto', 'Podzim', 'Zima'][this.state.time.season],
      day: this.state.time.day
    };

    this.state.log.unshift(entry);
    if (this.state.log.length > 80) {
      this.state.log.pop();
    }
  }
}
