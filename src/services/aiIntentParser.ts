import { ParsedIntent, ActionItem, SuggestionOption, ActionType } from '@/types';
import { PESCARA_VENUES, Venue } from '@/data/mockVenues';
import { RIVIERA_CONTRACTS, DEPOSIT_AVAX, DEPOSIT_AVAX_NUMBER } from '@/config/avalanche';

export interface AIResponse {
  text: string;
  options?: SuggestionOption[];
  actionProposal?: ParsedIntent;
}

/**
 * Universal Intent Engine for Riviera AI Concierge.
 * - Handles ANY booking & reservation intent across all sectors in Pescara.
 * - ZERO pricing clutter: focuses 100% on verifiable onchain reservations.
 * - Emits cryptographic passes verified on Avalanche.
 */
export function parseNaturalLanguageIntent(userPrompt: string): AIResponse {
  const raw = userPrompt.trim();
  const lower = raw.toLowerCase();

  // -------------------------------------------------------------------------
  // 1. EXTRACTION OF DATE, TIME, GUEST COUNT & SPECIAL REQUESTS
  // -------------------------------------------------------------------------

  // Date extraction
  let dateText = 'Oggi (19 Settembre)';
  if (lower.includes('domani')) {
    dateText = 'Domani (Domenica 20 Settembre)';
  } else if (lower.includes('stasera') || lower.includes('questa sera')) {
    dateText = 'Stasera (19 Settembre)';
  } else if (lower.includes('prossimo weekend') || lower.includes('sabato')) {
    dateText = 'Sabato prossimo';
  } else if (lower.includes('domenica')) {
    dateText = 'Domenica 20 Settembre';
  }

  // Time slot extraction
  let timeSlot = 'Ore 20:30';
  const timeRegex = /(?:per\s+le|alle\s+ore|alle|verso\s+le|ore)\s+(\d{1,2})(?:[:\.](\d{2}))?\b/i;
  const timeMatch = lower.match(timeRegex);
  if (timeMatch) {
    const hour = parseInt(timeMatch[1], 10);
    const min = timeMatch[2] ? timeMatch[2].padStart(2, '0') : '00';
    if (hour >= 0 && hour <= 24) {
      timeSlot = `Ore ${hour.toString().padStart(2, '0')}:${min}`;
    }
  } else {
    const colonMatch = lower.match(/\b(\d{1,2})[:\.](\d{2})\b/);
    if (colonMatch) {
      timeSlot = `Ore ${colonMatch[1].padStart(2, '0')}:${colonMatch[2]}`;
    } else if (lower.includes('pranzo')) {
      timeSlot = 'Ore 13:00';
    } else if (lower.includes('pomeriggio')) {
      timeSlot = 'Ore 16:00';
    } else if (lower.includes('aperitivo') || lower.includes('tramonto')) {
      timeSlot = 'Ore 19:30';
    } else if (lower.includes('mattina')) {
      timeSlot = 'Ore 10:00';
    }
  }

  // Guest count extraction
  let count = 2;
  const countRegex = /(?:per|siamo\s+in|tavolo\s+per|posti\s+per|gruppo\s+di|squadra\s+da)\s+(\d+)\s*(?:persone|ospiti|ragazzi|amici|giocatori)?/i;
  const countMatch = lower.match(countRegex);
  const itemsRegex = /\b(\d+)\s*(?:persone|posti|ospiti|amici|giocatori|bici|biciclette|lettini|ombrelloni)\b/i;
  const itemsMatch = lower.match(itemsRegex);

  if (countMatch && parseInt(countMatch[1], 10) > 0 && parseInt(countMatch[1], 10) < 100) {
    count = parseInt(countMatch[1], 10);
  } else if (itemsMatch && parseInt(itemsMatch[1], 10) > 0 && parseInt(itemsMatch[1], 10) < 100) {
    count = parseInt(itemsMatch[1], 10);
  } else if (lower.includes('da solo') || lower.includes('per me') || lower.includes('1 persona') || lower.includes('singol')) {
    count = 1;
  } else if (lower.includes('in coppia') || lower.includes('romantica') || lower.includes('per 2') || lower.includes('in due')) {
    count = 2;
  } else if (lower.includes('in 3') || lower.includes('per 3') || lower.includes('in tre')) {
    count = 3;
  } else if (lower.includes('in 4') || lower.includes('per 4') || lower.includes('quattro') || lower.includes('padel')) {
    count = 4;
  }

  // -------------------------------------------------------------------------
  // 2. NON-COMMERCIAL & NATURAL QUERIES (NO BOOKING CARD)
  // -------------------------------------------------------------------------
  if (
    lower.includes('sasso') ||
    lower.includes('sassi') ||
    lower.includes('ciottol') ||
    lower.includes('pietre') ||
    lower.includes('pietra')
  ) {
    return {
      text: `A Pescara il litorale della Riviera Nord e Sud è interamente di sabbia fine e dorata, quindi non sono presenti ciottoli naturali sull'arenile urbano.

Se stai cercando ciottoli levigati dal mare o scogliere naturali all'aria aperta:
1. **Costa dei Trabocchi (verso sud)**: La spiaggia di ciottoli di Punta Acquabella (Ortona), Ripari di Giobbe o San Vito Chietino sono suggestive e ricche di ciottoli.
2. **Fiume Aterno-Pescara**: Lungo gli argini naturali dell'alveo fluviale a monte.

Questa è un'attività naturalistica libera e completamente gratuita. Se invece desideri prenotare una bicicletta, un campo sportivo, un tavolo al ristorante o un lido attrezzato, dimmi pure!`,
    };
  }

  if (
    lower.includes('conchigli') ||
    lower.includes('camminata gratis') ||
    lower.includes('passeggiata gratis') ||
    lower.includes('vedere le onde') ||
    lower.includes('spiaggia libera')
  ) {
    return {
      text: `A Pescara l'accesso al mare e al panorama costiero è libero lungo le spiagge libere comunali:
- **Spiaggia Libera della Madonnina** (porto canale e Ponte del Mare)
- **Spiaggia Libera Pescara Sud** (zona Pineta)
- **Ponte del Mare**: La passerella ciclopedonale panoramica sospesa a 50 metri sull'acqua è sempre aperta 24h/24 con accesso gratuito.

Non serve alcuna prenotazione per queste attività all'aria aperta. Se invece desideri prenotare un'esperienza, un tavolo in un locale, una postazione lido o un campo sportivo, posso confermartela subito su Avalanche!`,
    };
  }

  // -------------------------------------------------------------------------
  // 3. BROAD OVERVIEW / HELP / GREETING (ALL CATEGORIES DISPLAYED)
  // -------------------------------------------------------------------------
  const isGreetingOrGibberish =
    lower.length <= 3 ||
    lower === 'ciao' ||
    lower === 'salve' ||
    lower === 'buongiorno' ||
    lower === 'buonasera' ||
    lower === 'help' ||
    lower === 'aiuto' ||
    lower.includes('chi sei') ||
    lower.includes('cosa fai') ||
    lower.includes('cosa sai fare') ||
    lower.includes('ambiti') ||
    lower.includes('come funziona');

  if (isGreetingOrGibberish) {
    return {
      text: `Benvenuto al Desk Riviera per Pescara. Ti permettiamo di effettuare prenotazioni in tempo reale registrando il pass digitale garantito su blockchain Avalanche:

• **Ristoranti & Osterie Tipiche**: Tavolo riservato per cucina marinara, pesce dell'Adriatico o arrosticini.
• **Pizzerie**: Tavoli riservati da Regina Margherita, Da Giampiero al Mare, Fermenta o Pizzeria Trieste.
• **Sushi Bar & Asiatica**: Tavoli tatami o banco sushi.
• **Lidi Balneari & Spiaggia**: Ombrelloni, lettini, gazebi e cabine private (Lido Moby Dick, La Sirena, La Prora).
• **Sport & Outdoor**: Campi da Padel (Pescara Padel Village), tennis, noleggio SUP e surf.
• **Nautica & Gommoni**: Noleggio imbarcazioni al Porto Turistico Marina di Pescara.
• **Mobilità Urbana**: City bike ed E-bike per la Ciclovia Adriatica e la Via Verde dei Trabocchi.
• **Spa & Cura della Persona**: Percorsi benessere, idromassaggio e massaggi.
• **Aperitivi & Lounge**: Salottini sulla sabbia al tramonto e serate estive.

Indica cosa desideri prenotare: ad esempio *"Tavolo per 2 stasera alla Pizzeria Da Giampiero"*, *"Campo da padel per 4 alle 19"*, oppure *"Ombrellone al lido per domani"*.`,
    };
  }

  // -------------------------------------------------------------------------
  // 3.5 VAGUE OR UNDERSPECIFIED BOOKING INTENTS (NO FAKE BOOKINGS!)
  // -------------------------------------------------------------------------
  const isVagueBooking =
    lower === 'vorrei prenotare' ||
    lower === 'voglio prenotare' ||
    lower === 'prenota' ||
    lower === 'prenotare' ||
    lower === 'prenotami' ||
    lower === 'prenotazione' ||
    lower === 'prenotazioni' ||
    lower === 'vorrei fare una prenotazione' ||
    lower === 'posso prenotare' ||
    lower === 'come posso prenotare' ||
    lower === 'vorrei prenotare qualcosa' ||
    lower === 'voglio prenotare qualcosa' ||
    lower === 'prenotami qualcosa' ||
    lower === 'vorrei riservare' ||
    lower === 'vorrei un posto' ||
    lower === 'cosa posso prenotare' ||
    lower === 'cosa posso fare' ||
    lower === 'cosa mi consigli' ||
    lower === 'consigliami' ||
    lower === 'consigliami qualcosa' ||
    lower === 'vorrei uscire' ||
    lower === "cosa c'è a pescara" ||
    lower === 'cosa fare a pescara' ||
    lower === 'cosa si può fare stasera' ||
    lower === 'ho fame' ||
    lower === 'dove posso mangiare' ||
    lower === 'dove mangiare' ||
    lower === 'vorrei mangiare' ||
    lower === 'vorrei cenare' ||
    lower === 'vorrei pranzare';

  if (isVagueBooking) {
    return {
      text: `Con **Riviera** puoi confermare in tempo reale qualsiasi prenotazione a Pescara con pass verificabile su Avalanche:

• **Pizzerie**: Regina Margherita, Da Giampiero al Mare, Fermenta, Pizzeria Trieste
• **Ristoranti Marinari**: Osteria Da Bacone, Trabocco Punta del Cavalluccio, Taverna 59, Kandoo Sushi
• **Bracerie & Tipici**: Rostelle d'Abruzzo, Osterie Tipiche
• **Lidi Balneari**: Lido Moby Dick, La Sirena, La Prora
• **Campi Padel & Tennis**: Pescara Padel Village, Circolo Tennis Pescara
• **Noleggio Bici & E-Bike**: Pescara Bici City, CicloRent per la Via Verde
• **Nautica & Charter**: Marina Charter al Porto Turistico di Pescara
• **Spa & Benessere**: Bella Vita Luxury Spa, Barberia del Salotto
• **Aperitivi & Lounge**: Sunset Lounge Bar, Café Les Paillotes, Tortuga

Cosa desideri prenotare, per quante persone e per quando?`,
    };
  }

  // -------------------------------------------------------------------------
  // 4. CHECK IF A SPECIFIC VENUE IS DIRECTLY REQUESTED
  // -------------------------------------------------------------------------
  let targetVenue: Venue | undefined;
  for (const v of PESCARA_VENUES) {
    if (lower.includes(v.name.toLowerCase()) || lower.includes(v.id)) {
      targetVenue = v;
      break;
    }
  }

  if (!targetVenue) {
    if (lower.includes('regina margherita')) targetVenue = PESCARA_VENUES.find(v => v.id === 'pizzeria-regina-margherita');
    else if (lower.includes('giampiero')) targetVenue = PESCARA_VENUES.find(v => v.id === 'pizzeria-giampiero-al-mare');
    else if (lower.includes('fermenta')) targetVenue = PESCARA_VENUES.find(v => v.id === 'pizzeria-fermenta');
    else if (lower.includes('pizzeria trieste') || (lower.includes('trieste') && lower.includes('pizza')) || lower.includes('padellino')) targetVenue = PESCARA_VENUES.find(v => v.id === 'pizzeria-trieste');
    else if (lower.includes('rostelle')) targetVenue = PESCARA_VENUES.find(v => v.id === 'rostelle-abruzzo');
    else if (lower.includes('bacone') || lower.includes('osteria di mare')) targetVenue = PESCARA_VENUES.find(v => v.id === 'osteria-pescarese');
    else if (lower.includes('punta del cavalluccio') || (lower.includes('trabocco') && (lower.includes('cavalluccio') || lower.includes('prenota')))) targetVenue = PESCARA_VENUES.find(v => v.id === 'trabocco-pescara');
    else if (lower.includes('taverna 59')) targetVenue = PESCARA_VENUES.find(v => v.id === 'taverna-59');
    else if (lower.includes('kandoo')) targetVenue = PESCARA_VENUES.find(v => v.id === 'kandoo-sushi');
    else if (lower.includes('moby dick')) targetVenue = PESCARA_VENUES.find(v => v.id === 'lido-moby-dick');
    else if (lower.includes('sirena') || lower.includes('la sirena')) targetVenue = PESCARA_VENUES.find(v => v.id === 'lido-la-sirena');
    else if (lower.includes('prora') || lower.includes('la prora')) targetVenue = PESCARA_VENUES.find(v => v.id === 'lido-la-prora');
    else if (lower.includes('padel village') || lower.includes('pescara padel')) targetVenue = PESCARA_VENUES.find(v => v.id === 'pescara-padel-club');
    else if (lower.includes('circolo tennis')) targetVenue = PESCARA_VENUES.find(v => v.id === 'circolo-tennis-pescara');
    else if (lower.includes('pescara sup') || lower.includes('surf center')) targetVenue = PESCARA_VENUES.find(v => v.id === 'pescara-sup-surf');
    else if (lower.includes('marina charter') || (lower.includes('porto turistico') && (lower.includes('charter') || lower.includes('noleggio')))) targetVenue = PESCARA_VENUES.find(v => v.id === 'marina-charter-pescara');
    else if (lower.includes('pescara bici') || (lower.includes('salotto') && lower.includes('bici'))) targetVenue = PESCARA_VENUES.find(v => v.id === 'pescara-bici-salotto');
    else if (lower.includes('ciclorent')) targetVenue = PESCARA_VENUES.find(v => v.id === 'ciclorent-madonnina');
    else if (lower.includes('bella vita') || lower.includes('luxury spa')) targetVenue = PESCARA_VENUES.find(v => v.id === 'bella-vita-spa');
    else if (lower.includes('barberia del salotto') || (lower.includes('barberia') && lower.includes('salotto'))) targetVenue = PESCARA_VENUES.find(v => v.id === 'barberia-salotto');
    else if (lower.includes('sunset lounge')) targetVenue = PESCARA_VENUES.find(v => v.id === 'sunset-lounge');
    else if (lower.includes('paillotes') || lower.includes('les paillotes')) targetVenue = PESCARA_VENUES.find(v => v.id === 'cafe-les-paillotes');
    else if (lower.includes('tortuga')) targetVenue = PESCARA_VENUES.find(v => v.id === 'tortuga-beach-club');
    else if (lower.includes('hotel esplanade') || (lower.includes('esplanade') && !lower.includes('ristorante'))) targetVenue = PESCARA_VENUES.find(v => v.id === 'hotel-esplanade');
    else if (lower.includes('hotel victoria') || lower.includes('victoria hotel')) targetVenue = PESCARA_VENUES.find(v => v.id === 'victoria-hotel');
    else if (lower.includes('blockchain beach')) targetVenue = PESCARA_VENUES.find(v => v.id === 'blockchain-beach-party');
  }

  // -------------------------------------------------------------------------
  // 5. EXPLORATION & CATEGORY REQUESTS (NO SPECIFIC VENUE = SHOW CHOICES)
  // -------------------------------------------------------------------------
  if (!targetVenue) {
    // EXPLORATION: CENA ROMANTICA
    if (lower.includes('cena romantica') || (lower.includes('romantica') && (lower.includes('cena') || lower.includes('ristorante')))) {
    const romanticOptions: SuggestionOption[] = [
      {
        id: 'giampiero-romantico',
        title: 'Pizzeria Da Giampiero al Mare (Tavolo Vista Mare)',
        venueName: 'Pizzeria Da Giampiero al Mare',
        location: 'Lungomare Matteotti 84, Pescara',
        merchantAddress: '0x3685061A465FC913bb81cd090C9fF715Fa25ffA4',
        description: 'Tavolo riservato sulla terrazza panoramica fronte mare: atmosfera intima, brezza adriatica e vista sul tramonto.',
        badge: 'Vista Mare Romantica',
        bookingType: 'Tavolo Terrazza Fronte Mare',
        items: [{ name: `Tavolo Romantico Vista Mare per ${count} persone`, quantity: count }],
        actionPrompt: `Prenotami il tavolo romantico da Pizzeria Da Giampiero al Mare per ${count} persone`,
      },
      {
        id: 'trabocco-romantico',
        title: 'Trabocco Punta del Cavalluccio (A filo d\'acqua)',
        venueName: 'Trabocco Punta del Cavalluccio',
        location: 'Molo Sud Trabocchi, Pescara',
        merchantAddress: '0xFC1BfCB6a2191D21ab560Ed4b6040CDE9566E850',
        description: 'Esperienza unica su palafitta storica adriatica sospesa sul mare con il rumore delle onde.',
        badge: 'Esperienza sul Trabocco',
        bookingType: 'Tavolo sul Trabocco',
        items: [{ name: `Tavolo a Bordo Palafitta per ${count} persone`, quantity: count }],
        actionPrompt: `Prenotami il tavolo romantico da Trabocco Punta del Cavalluccio per ${count} persone`,
      },
      {
        id: 'margherita-romantica',
        title: 'Pizzeria Regina Margherita (Centro Storico)',
        venueName: 'Pizzeria Regina Margherita',
        location: 'Via Cesare Battisti 112, Pescara Centro',
        merchantAddress: '0xDd62095d6372F6bFEACaFbCDBf44Cf3d14A24422',
        description: 'Tavolo intimo nel salotto pedonale del centro, con luce soffusa e servizio impeccabile.',
        badge: 'Atmosfera Centro Pedonale',
        bookingType: 'Tavolo Riservato Sala Interna',
        items: [{ name: `Tavolo Romantico Centro per ${count} persone`, quantity: count }],
        actionPrompt: `Prenotami un tavolo da Pizzeria Regina Margherita per ${count} persone`,
      },
    ];

    return {
      text: `Ecco le migliori proposte verificate a Pescara per una cena romantica per **${count} persone**. Seleziona il locale che preferisci per riservare subito il tavolo:`,
      options: romanticOptions,
    };
  }

  // EXPLORATION: SPORT & PADEL
  if (lower.includes('padel') || lower.includes('tennis') || lower.includes('campi')) {
    const sportOptions: SuggestionOption[] = [
      {
        id: 'padel-res',
        title: 'Pescara Padel Village (Campo Panoramico WPT)',
        venueName: 'Pescara Padel Village',
        location: 'Via Tirino 90, Pescara',
        merchantAddress: '0xb1CbCa3d28b9a066aFf7F181fA592B0c943f47Fa',
        description: 'Campo panoramico WPT di ultima generazione con spogliatoi dedicati e palline incluse.',
        badge: 'Campi Ufficiali WPT',
        bookingType: 'Campo Padel (90 minuti)',
        items: [{ name: `Campo Padel Riservato (${count} giocatori)`, quantity: count }],
        actionPrompt: `Prenotami il campo da padel al Pescara Padel Village per ${count} persone`,
      },
      {
        id: 'tennis-res',
        title: 'Circolo Tennis Pescara (Terra Rossa)',
        venueName: 'Circolo Tennis Pescara',
        location: 'Via Marilungo, Pescara',
        merchantAddress: '0x3e1077253022E48dcD01cC00BdEd0c3dfAeeF957',
        description: 'Campo in terra battuta tradizionale curato quotidianamente nel cuore verde della città.',
        badge: 'Terra Battuta Tradizionale',
        bookingType: 'Campo Tennis (60 minuti)',
        items: [{ name: `Campo Tennis Riservato (${count} persone)`, quantity: count }],
        actionPrompt: `Prenotami il campo da tennis al Circolo Tennis Pescara per ${count} persone`,
      },
    ];

    return {
      text: `Ecco i centri sportivi autorizzati a Pescara con disponibilità per campi da Padel e Tennis. Seleziona dove giocare:`,
      options: sportOptions,
    };
  }

  // EXPLORATION: PIZZERIE
  if (lower.includes('pizza') || lower.includes('pizzeri')) {
    const pizzerie = PESCARA_VENUES.filter(v => v.category === 'pizza');
    const options: SuggestionOption[] = pizzerie.map(p => ({
      id: p.id,
      title: p.name,
      venueName: p.name,
      location: p.location,
      merchantAddress: p.walletAddress,
      description: p.description,
      badge: p.highlight,
      bookingType: p.bookingType,
      items: [{ name: `${p.bookingType} per ${count} persone`, quantity: count }],
      actionPrompt: `Prenotami un tavolo da ${p.name} per ${count} persone`,
    }));

    return {
      text: `Ecco le migliori pizzerie verificate a Pescara con disponibilità per ${count} persone. Clicca su quella che preferisci per riservare il posto:`,
      options,
    };
  }

  // EXPLORATION: RISTORANTI, CUCINA DI MARE & ARROSTICINI
  if (
    lower.includes('arrosticin') ||
    lower.includes('pesce') ||
    lower.includes('ristorant') ||
    lower.includes('trattori') ||
    lower.includes('osteri') ||
    lower.includes('carne') ||
    lower.includes('sushi') ||
    lower.includes('mangiare') ||
    lower.includes('cenare') ||
    lower.includes('pranzare')
  ) {
    const restaurants = PESCARA_VENUES.filter(v => v.category === 'restaurant' || v.category === 'sushi');
    const options: SuggestionOption[] = restaurants.map(r => ({
      id: r.id,
      title: r.name,
      venueName: r.name,
      location: r.location,
      merchantAddress: r.walletAddress,
      description: r.description,
      badge: r.highlight,
      bookingType: r.bookingType,
      items: [{ name: `${r.bookingType} per ${count} persone`, quantity: count }],
      actionPrompt: `Prenotami un tavolo da ${r.name} per ${count} persone`,
    }));

    return {
      text: `Ecco i ristoranti e le osterie tipiche selezionate a Pescara per cucina marinara dell'Adriatico, trabocchi, arrosticini alla brace e sushi:`,
      options,
    };
  }

  // EXPLORATION: LIDI BALNEARI & SPIAGGE
  if (lower.includes('lido') || lower.includes('spiaggia') || lower.includes('ombrellon') || lower.includes('lettin') || lower.includes('balneare')) {
    const lidi = PESCARA_VENUES.filter(v => v.category === 'beach');
    const options: SuggestionOption[] = lidi.map(l => ({
      id: l.id,
      title: l.name,
      venueName: l.name,
      location: l.location,
      merchantAddress: l.walletAddress,
      description: l.description,
      badge: l.highlight,
      bookingType: l.bookingType,
      items: [{ name: `${l.bookingType} per ${count} persone`, quantity: count }],
      actionPrompt: `Prenotami la postazione spiaggia da ${l.name} per ${count} persone`,
    }));

    return {
      text: `Ecco gli stabilimenti balneari convenzionati a Pescara per riservare la tua postazione al mare:`,
      options,
    };
  }

  // EXPLORATION: SPA & BENESSERE
  if (lower.includes('spa') || lower.includes('massagg') || lower.includes('benessere') || lower.includes('barbier') || lower.includes('relax')) {
    const wellness = PESCARA_VENUES.filter(v => v.category === 'wellness');
    const options: SuggestionOption[] = wellness.map(w => ({
      id: w.id,
      title: w.name,
      venueName: w.name,
      location: w.location,
      merchantAddress: w.walletAddress,
      description: w.description,
      badge: w.highlight,
      bookingType: w.bookingType,
      items: [{ name: `${w.bookingType} per ${count} persone`, quantity: count }],
      actionPrompt: `Prenotami da ${w.name} per ${count} persone`,
    }));

    return {
      text: `Ecco i centri benessere e saloni verificati per percorsi spa, trattamenti relax o cura personale:`,
      options,
    };
  }

  // EXPLORATION: BICI & MOBILITÀ
  if (lower.includes('bici') || lower.includes('e-bike') || lower.includes('biciclett') || lower.includes('via verde') || lower.includes('ciclabile')) {
    const mobility = PESCARA_VENUES.filter(v => v.category === 'bici');
    const options: SuggestionOption[] = mobility.map(m => ({
      id: m.id,
      title: m.name,
      venueName: m.name,
      location: m.location,
      merchantAddress: m.walletAddress,
      description: m.description,
      badge: m.highlight,
      bookingType: m.bookingType,
      items: [{ name: `${m.bookingType} (${count} persona/e)`, quantity: count }],
      actionPrompt: `Prenotami da ${m.name} per ${count} persone`,
    }));

    return {
      text: `Ecco i punti autorizzati per noleggio biciclette ed e-bike a Pescara e per la Ciclovia dei Trabocchi:`,
      options,
    };
  }

  // EXPLORATION: BARCHE & GOMMONI
  if (lower.includes('barca') || lower.includes('gommon') || lower.includes('charter') || lower.includes('porto turistico')) {
    const boats = PESCARA_VENUES.filter(v => v.category === 'boat');
    const options: SuggestionOption[] = boats.map(b => ({
      id: b.id,
      title: b.name,
      venueName: b.name,
      location: b.location,
      merchantAddress: b.walletAddress,
      description: b.description,
      badge: b.highlight,
      bookingType: b.bookingType,
      items: [{ name: `${b.bookingType} (${count} persona/e)`, quantity: count }],
      actionPrompt: `Prenotami da ${b.name} per ${count} persone`,
    }));

    return {
      text: `Ecco i servizi nautici al Porto Turistico Marina di Pescara per uscite in gommone e charter privato:`,
      options,
    };
  }

  // EXPLORATION: APERITIVI & NIGHTLIFE
  if (lower.includes('aperitivo') || lower.includes('cocktail') || lower.includes('discoteca') || lower.includes('serata') || lower.includes('drink') || lower.includes('lounge')) {
    const nightlife = PESCARA_VENUES.filter(v => v.category === 'bar' || v.category === 'event');
    const options: SuggestionOption[] = nightlife.map(n => ({
      id: n.id,
      title: n.name,
      venueName: n.name,
      location: n.location,
      merchantAddress: n.walletAddress,
      description: n.description,
      badge: n.highlight,
      bookingType: n.bookingType,
      items: [{ name: `${n.bookingType} per ${count} persone`, quantity: count }],
      actionPrompt: `Prenotami da ${n.name} per ${count} persone`,
    }));

    return {
      text: `Ecco i migliori lounge bar e club fronte mare a Pescara per aperitivi al tramonto e serate con musica:`,
      options,
    };
  }

  // EXPLORATION: HOTEL & SOGGIORNI
  if (lower.includes('hotel') || lower.includes('albergo') || lower.includes('camera') || lower.includes('camere') || lower.includes('dormire') || lower.includes('soggiorno')) {
    const hotels = PESCARA_VENUES.filter(v => v.category === 'hotel');
    const options: SuggestionOption[] = hotels.map(h => ({
      id: h.id,
      title: h.name,
      venueName: h.name,
      location: h.location,
      merchantAddress: h.walletAddress,
      description: h.description,
      badge: h.highlight,
      bookingType: h.bookingType,
      items: [{ name: `${h.bookingType} (${count} persona/e)`, quantity: count }],
      actionPrompt: `Prenotami da ${h.name} per ${count} persone`,
    }));

    return {
      text: `Ecco gli hotel e le strutture convenzionate per soggiornare a Pescara con pass verificabile:`,
      options,
    };
  }

  // If no category matched and no specific venue was requested:
  return {
    text: `Nessuna struttura specifica individuata per la richiesta. Con Riviera puoi prenotare con pass garantito su Avalanche:

• **Pizzerie**: Regina Margherita, Da Giampiero al Mare, Fermenta, Pizzeria Trieste
• **Ristoranti Marinari**: Osteria Da Bacone, Trabocco Punta del Cavalluccio, Taverna 59
• **Lidi Balneari**: Lido Moby Dick, La Sirena, La Prora
• **Campi Padel & Tennis**: Pescara Padel Village, Circolo Tennis Pescara
• **Noleggio Bici & E-Bike**: Pescara Bici, CicloRent per la Via Verde
• **Nautica & Charter**: Marina Charter al Porto Turistico
• **Spa & Benessere**: Bella Vita Luxury Spa

Indica cosa desideri prenotare, per quante persone e l'orario desiderato.`,
  };
}

  // -------------------------------------------------------------------------
  // 6. DIRECT CONCRETE BOOKING ACTION (ONLY RUNS WHEN targetVenue IS DEFINED)
  // -------------------------------------------------------------------------
  let actionType: ActionType = 'dining_reservation';
  const venueName = targetVenue.name;
  const venueLocation = targetVenue.location;
  const merchantAddress = targetVenue.walletAddress;
  const bookingTypeLabel = targetVenue.bookingType;

  if (targetVenue.category === 'beach') actionType = 'beach_booking';
  else if (targetVenue.category === 'sport') actionType = 'sport_booking';
  else if (targetVenue.category === 'wellness') actionType = 'wellness_booking';
  else if (targetVenue.category === 'bici') actionType = 'mobility_rental';
  else if (targetVenue.category === 'boat') actionType = 'boat_charter';
  else if (targetVenue.category === 'hotel') actionType = 'hotel_booking';
  else if (targetVenue.category === 'event') actionType = 'event_pass';

  const isOutdoor = ['beach_booking', 'sport_booking', 'mobility_rental', 'boat_charter'].includes(actionType);
  const groupId = count >= 3 ? `GRP-${Date.now().toString(36).toUpperCase()}` : undefined;

  const proposal: ParsedIntent = {
    id: `booking-${Date.now()}`,
    type: actionType,
    title: `Proposta: ${venueName}`,
    venueName,
    venueLocation,
    merchantAddress,
    date: dateText,
    timeSlot,
    guestCount: count,
    bookingType: bookingTypeLabel,
    items: [
      {
        name: `${bookingTypeLabel} per ${count} persona/e`,
        quantity: 1,
      },
    ],
    totalEur: 0,
    totalAvax: DEPOSIT_AVAX_NUMBER,
    depositAvax: DEPOSIT_AVAX_NUMBER,
    onchainMethod: 'registraPrenotazione()',
    calldataPreview: '0x...',
    contractTarget: RIVIERA_CONTRACTS.bookingEscrow,
    loyaltyCashbackAvax: 0,
    explanation: `Disponibilità verificata per **${venueName}**:`,
    isOutdoor,
    groupId,
  };

  return {
    text: proposal.explanation,
    actionProposal: proposal,
  };
}
