export interface VenueItem {
  name: string;
  description: string;
}

export interface Venue {
  id: string;
  name: string;
  category:
    | 'pizza'
    | 'restaurant'
    | 'sushi'
    | 'beach'
    | 'sport'
    | 'wellness'
    | 'bici'
    | 'boat'
    | 'bar'
    | 'hotel'
    | 'event';
  location: string;
  description: string;
  walletAddress: string;
  rating: number;
  highlight: string;
  bookingType: string;
  menuItems: VenueItem[];
}

export const PESCARA_VENUES: Venue[] = [
  // 1. PIZZERIE & PINSA
  {
    id: 'pizzeria-regina-margherita',
    name: 'Pizzeria Regina Margherita',
    category: 'pizza',
    location: 'Via Cesare Battisti 112, Pescara Centro',
    description: 'Pizzeria napoletana autentica con forno a legna, impasto lievitato 48h e mozzarella di bufala campana DOP.',
    walletAddress: '0x3685061A465FC913bb81cd090C9fF715Fa25ffA4',
    rating: 4.9,
    highlight: 'Pizza Verace DOP & Forno a Legna',
    bookingType: 'Tavolo Pizzeria',
    menuItems: [
      { name: 'Tavolo Riservato Sala Interna o Dehors', description: 'Tavolo garantito senza attesa con coperto incluso' },
      { name: 'Degustazione Pizze Gourmet', description: 'Selezione delle pizze premiate con impasto a lenta lievitazione' },
    ],
  },
  {
    id: 'pizzeria-giampiero-al-mare',
    name: 'Pizzeria Da Giampiero al Mare',
    category: 'pizza',
    location: 'Lungomare Matteotti 84, Pescara',
    description: 'Pizzeria sul lungomare con ampia terrazza panoramica fronte spiaggia, ideale per cene romantiche e in famiglia.',
    walletAddress: '0xFC1BfCB6a2191D21ab560Ed4b6040CDE9566E850',
    rating: 4.8,
    highlight: 'Terrazza Panoramica Vista Mare',
    bookingType: 'Tavolo Vista Mare',
    menuItems: [
      { name: 'Tavolo Terrazza Fronte Mare', description: 'Posto panoramico riservato vista Adriatico al tramonto' },
      { name: 'Tavolo Sala Climatizzata', description: 'Posto confortevole all\'interno del locale' },
    ],
  },
  {
    id: 'pizzeria-fermenta',
    name: 'Fermenta Pizzeria Contemporanea',
    category: 'pizza',
    location: 'Viale Marconi 240, Pescara',
    description: 'Pizzeria d\'autore premiata 3 Spicchi Gambero Rosso con impasti ad alta idratazione e topping a filiera corta.',
    walletAddress: '0xDd62095d6372F6bFEACaFbCDBf44Cf3d14A24422',
    rating: 4.9,
    highlight: '3 Spicchi Gambero Rosso',
    bookingType: 'Tavolo Gourmet',
    menuItems: [
      { name: 'Tavolo Esperienza Contemporanea', description: 'Tavolo riservato per percorso degustazione pizza contemporanea' },
    ],
  },
  {
    id: 'pizzeria-trieste',
    name: 'Pizzeria Trieste (La Storica dal 1958)',
    category: 'pizza',
    location: 'Lungomare Matteotti 10, Pescara',
    description: 'L\'iconica pizzetta tonda al padellino nata a Pescara nel 1958, fragrante e croccante.',
    walletAddress: '0xb1CbCa3d28b9a066aFf7F181fA592B0c943f47Fa',
    rating: 4.9,
    highlight: 'Storica Pizzetta al Padellino',
    bookingType: 'Tavolo Tradizione',
    menuItems: [
      { name: 'Tavolo Degustazione Padellino Tradizionale', description: 'Posto riservato per gustare le classiche pizzette pescaresi' },
    ],
  },

  // 2. RISTORANTI TIPICI, ARROSTICINI & CARNE
  {
    id: 'rostelle-abruzzo',
    name: 'Rostelle d\'Abruzzo — Braceria Tradizionale',
    category: 'restaurant',
    location: 'Via del Porto 12, Pescara',
    description: 'La vera carne di pecora abruzzese cotta sui canalini a carbone con pane casereccio all\'olio evo e Montepulciano.',
    walletAddress: '0x3e1077253022E48dcD01cC00BdEd0c3dfAeeF957',
    rating: 4.9,
    highlight: 'Arrosticini Artigianali alla Brace',
    bookingType: 'Tavolo Braceria',
    menuItems: [
      { name: 'Tavolo Braceria Tradizionale', description: 'Posto riservato con canalino per arrosticini caldi espressi' },
      { name: 'Degustazione Completa d\'Abruzzo', description: 'Antipasti della terra, bruschette e arrosticini fatti a mano' },
    ],
  },
  {
    id: 'osteria-pescarese',
    name: 'Osteria di Mare "Da Bacone"',
    category: 'restaurant',
    location: 'Lungomare Matteotti 54, Pescara',
    description: 'Trattoria marinara storica con brodetto alla pescarese, chitarrina allo scoglio e frittura mista dell\'Adriatico.',
    walletAddress: '0xe00FB97cFCB7A982D90585fdcDA66c60e14Cb598',
    rating: 4.8,
    highlight: 'Brodetto & Cucina Marinara',
    bookingType: 'Tavolo Ristorante di Pesce',
    menuItems: [
      { name: 'Tavolo Ristorante di Mare', description: 'Riserva confermata con pescato del giorno selezionato dai trabocchi' },
    ],
  },
  {
    id: 'trabocco-pescara',
    name: 'Trabocco sul Mare "Punta del Cavalluccio"',
    category: 'restaurant',
    location: 'Molo Sud Trabocchi, Pescara',
    description: 'Cena suggestiva sospesa sull\'acqua su palafitta tradizionale adriatica con il rumore delle onde e vista sul tramonto.',
    walletAddress: '0x25760B8C9d432860F2a2dA6E25Dc7b8EBDd068B6',
    rating: 4.9,
    highlight: 'Cena Esclusiva sul Mare',
    bookingType: 'Tavolo sul Trabocco',
    menuItems: [
      { name: 'Tavolo Romantico a Bordo Palafitta', description: 'Posto panoramico mozzafiato a filo d\'acqua con brezza marina' },
    ],
  },
  {
    id: 'taverna-59',
    name: 'Taverna 59 — Sapori di Pescara Vecchia',
    category: 'restaurant',
    location: 'Via delle Caserme 59, Pescara Vecchia',
    description: 'Ristorante intimo nel cuore del quartiere storico con volte a mattoni e cucina tipica pescarese rivisitata.',
    walletAddress: '0x035e13B651E6348130fc701A6F157E29304280B1',
    rating: 4.8,
    highlight: 'Atmosfera Pescara Vecchia',
    bookingType: 'Tavolo Centro Storico',
    menuItems: [
      { name: 'Tavolo Sala Storica', description: 'Tavolo intimo nelle caratteristiche sale a volta' },
    ],
  },

  // 3. SUSHI & ASIAN FUSION
  {
    id: 'kandoo-sushi',
    name: 'Kandoo Japanese Restaurant Experience',
    category: 'sushi',
    location: 'Via Trento 45, Pescara Centro',
    description: 'Cucina giapponese contemporanea con pesce freschissimo di prima scelta, sushi bar e sale tatami riservate.',
    walletAddress: '0x91E164305ebF763E3E385375DD11Cd44d0742e78',
    rating: 4.8,
    highlight: 'Sushi d\'Autore & Sala Tatami',
    bookingType: 'Tavolo Sushi / Tatami',
    menuItems: [
      { name: 'Tavolo Privato Tatami Giapponese', description: 'Esperienza tradizionale su pedana tatami con privacy per coppie o gruppi' },
      { name: 'Posto al Banco Sushi Bar', description: 'Vista diretta sulla preparazione espressa del maestro sushiman' },
    ],
  },

  // 4. LIDI BALNEARI & SERVIZI SPIAGGIA
  {
    id: 'lido-moby-dick',
    name: 'Lido Moby Dick',
    category: 'beach',
    location: 'Lungomare Matteotti 58, Pescara',
    description: 'Stabilimento balneare moderno con ampi spazi tra gli ombrelloni, lettini comfort, docce calde e bar in riva al mare.',
    walletAddress: '0x74fbAb83AebE549E6A82b541Ab62C1a960241C70',
    rating: 4.9,
    highlight: 'Postazione Spiaggia Ampia',
    bookingType: 'Ombrellone + 2 Lettini',
    menuItems: [
      { name: 'Postazione Standard: 1 Ombrellone + 2 Lettini', description: 'Posto assegnato con accesso a tutti i servizi del lido' },
      { name: 'Gazebo Privato con Tendaggi', description: 'Area vip spaziosa con 4 lettini e tavolino per il massimo relax' },
    ],
  },
  {
    id: 'lido-la-sirena',
    name: 'Lido La Sirena',
    category: 'beach',
    location: 'Viale della Riviera 110, Pescara',
    description: 'Storico lido della Riviera Nord con sabbia fine, ristorante sul mare e area giochi per bambini.',
    walletAddress: '0x17D728041Ca28b216dA14f87fF555805B12Fc480',
    rating: 4.8,
    highlight: 'Riviera Nord & Relax',
    bookingType: 'Postazione Lido',
    menuItems: [
      { name: 'Postazione Prima Fila Mare', description: 'Ombrellone in riva al mare con vista aperta sull\'orizzonte' },
    ],
  },
  {
    id: 'lido-la-prora',
    name: 'Lido La Prora — Beach Club',
    category: 'beach',
    location: 'Lungomare Nord 32, Pescara',
    description: 'Beach club raffinato con lettini king-size, servizio drink sotto l\'ombrellone e atmosfera lounge.',
    walletAddress: '0x7cc101b3acDdD383d1484B7b086428BA492a9Bd5',
    rating: 4.9,
    highlight: 'Beach Club & Servizio Drink',
    bookingType: 'Postazione Luxury Beach',
    menuItems: [
      { name: 'Lettone King-Size Fronte Mare', description: 'Postazione esclusiva con materasso ergonomico per 2 persone' },
    ],
  },

  // 5. SPORT & OUTDOOR (PADEL, TENNIS, SURF, BARCA)
  {
    id: 'pescara-padel-club',
    name: 'Pescara Padel Village',
    category: 'sport',
    location: 'Via Tirino 90, Pescara',
    description: 'Centro sportivo di riferimento con 6 campi da padel panoramici WPT di ultima generazione, spogliatoi e noleggio racchette.',
    walletAddress: '0xb01b58396cf9CfE15226D78D04256325f664105a',
    rating: 4.9,
    highlight: 'Campi Padel Panoramici WPT',
    bookingType: 'Campo Padel (90 min)',
    menuItems: [
      { name: 'Prenotazione Campo Padel (4 Giocatori)', description: 'Slot riservato di 90 minuti su campo panoramico con palline incluse' },
      { name: 'Lezione Privata con Maestro Certificato FIT', description: 'Sessione tecnica individuale o per coppia di 60 minuti' },
    ],
  },
  {
    id: 'circolo-tennis-pescara',
    name: 'Circolo Tennis Pescara',
    category: 'sport',
    location: 'Via Marilungo, Pescara Centro',
    description: 'Prestigioso circolo sportivo con campi da tennis in terra rossa battuta immersi nel verde.',
    walletAddress: '0xf15F0F1ce1B5C06c6368EC2a98fCF2aadc8AEd36',
    rating: 4.8,
    highlight: 'Campi Tennis in Terra Rossa',
    bookingType: 'Campo Tennis (60 min)',
    menuItems: [
      { name: 'Campo da Tennis in Terra Rossa', description: 'Ora di gioco su campo professionale curato quotidianamente' },
    ],
  },
  {
    id: 'pescara-sup-surf',
    name: 'Pescara WaterSports & SUP Academy',
    category: 'sport',
    location: 'Spiaggia Madonnina / Lungomare Nord, Pescara',
    description: 'Centro sport acquatici: noleggio Stand Up Paddle (SUP), kayak marini e lezioni di surf lungo la costa pescarese.',
    walletAddress: '0x1bB3c15A435EE01d841ECBEF0FEB57096852852f',
    rating: 4.9,
    highlight: 'Noleggio SUP & Kayak Marino',
    bookingType: 'Noleggio SUP / Kayak',
    menuItems: [
      { name: 'Noleggio Tavola SUP con Pagaia e Giubbotto', description: 'Tavola rigida o gonfiabile per escursione libera in mare' },
      { name: 'Tour Guidato SUP al Tramonto sul Mare', description: 'Pagaia guidata con istruttore per ammirare Pescara dal mare' },
    ],
  },
  {
    id: 'marina-charter-pescara',
    name: 'Marina di Pescara Charter & Gommoni',
    category: 'boat',
    location: 'Porto Turistico Marina di Pescara, Box 14',
    description: 'Noleggio gommoni senza patente e imbarcazioni con skipper per esplorare la Costa dei Trabocchi e il litorale adriatico.',
    walletAddress: '0x55A9275AC36530F1540a245D211Fe09D70f3ecf9',
    rating: 4.9,
    highlight: 'Gommoni & Uscite in Barca',
    bookingType: 'Noleggio Gommone / Barca',
    menuItems: [
      { name: 'Noleggio Gommone 40cv (Senza Patente Nautica)', description: 'Gommone 5.50m con tendalino, prendisole e doccetta' },
      { name: 'Uscita in Barca a Vela con Aperitivo a Bordo', description: 'Tour costiero di mezza giornata con skipper esperto' },
    ],
  },

  // 6. MOBILITÀ & BICICLETTE
  {
    id: 'pescara-bici-salotto',
    name: 'Pescara Bici & Mobilità Urbana',
    category: 'bici',
    location: 'Piazza Salotto (Piazza della Rinascita), Pescara',
    description: 'Punto noleggio nel cuore di Pescara per pedalare lungo la Ciclovia Adriatica e il Ponte del Mare.',
    walletAddress: '0x82238676857a2DB4647824CB230c7A95e9Be3596',
    rating: 4.9,
    highlight: 'City Bike & Ciclovia Adriatica',
    bookingType: 'Noleggio Bici Intera Giornata',
    menuItems: [
      { name: 'City Bike Passeggio con Cestino e Catena', description: 'Bici ergonomica e leggera ideale per il lungomare' },
      { name: 'E-Bike a Pedalata Assistita Autonomia 70km', description: 'Batteria potenziata per pedalare fino ai trabocchi senza fatica' },
    ],
  },
  {
    id: 'ciclorent-madonnina',
    name: 'CicloRent Pescara — Ponte del Mare',
    category: 'bici',
    location: 'Piazzale della Madonnina / Lungomare Nord, Pescara',
    description: 'Specialisti in tour cicloturistici e biciclette da trekking per percorrere la spettacolare Via Verde della Costa dei Trabocchi.',
    walletAddress: '0xaB922ED181cda423600B566273f9d0b0d5656439',
    rating: 4.8,
    highlight: 'Trekking & Via Verde dei Trabocchi',
    bookingType: 'Noleggio Bici Trekking',
    menuItems: [
      { name: 'Trekking Bike Allestita con Borse Laterali', description: 'Bici per lunghe percorrenze con kit assistenza forature' },
    ],
  },

  // 7. BENESSERE, SPA & CURA DELLA PERSONA
  {
    id: 'bella-vita-spa',
    name: 'Bella Vita City Spa & Benessere',
    category: 'wellness',
    location: 'Via Nicola Fabrizi 60, Pescara Centro',
    description: 'Oasi di benessere nel centro città: percorso idroterapico, sauna finlandese, bagno turco, tisaneria e massaggi rilassanti.',
    walletAddress: '0x641eDfc7C08E40dbd48470b28AbB91f97517135a',
    rating: 4.9,
    highlight: 'Percorso Spa & Massaggi di Coppia',
    bookingType: 'Percorso Spa & Relax',
    menuItems: [
      { name: 'Percorso Spa Esclusivo (90 minuti)', description: 'Idromassaggio, sauna, bagno turco e docce emozionali' },
      { name: 'Massaggio Relax di Coppia con Olii Aromatici', description: 'Trattamento distensivo di 50 minuti in cabina doppia' },
    ],
  },
  {
    id: 'barberia-salotto',
    name: 'Barberia Tradizionale Pescara Centro',
    category: 'wellness',
    location: 'Corso Umberto I 22, Pescara Centro',
    description: 'Salone maschile d\'eccellenza per cura di barba e capelli con panni caldi e prodotti artigianali.',
    walletAddress: '0xa3824e35C7F9546f31a0d29334C349A806A06DF5',
    rating: 4.8,
    highlight: 'Grooming & Barba Tradizionale',
    bookingType: 'Appuntamento Salone',
    menuItems: [
      { name: 'Taglio Capelli & Trattamento Barba Completo', description: 'Servizio su misura con rifinitura a rasoio e panno caldo' },
    ],
  },

  // 8. BAR, APERITIVI & NIGHTLIFE
  {
    id: 'sunset-lounge',
    name: 'Sunset Lounge & Cocktail Bar',
    category: 'bar',
    location: 'Lungomare Sud 104, Pescara',
    description: 'Cocktail bar sulla spiaggia con dj set al tramonto, divanetti sulla sabbia e sfiziosità tipiche abruzzesi.',
    walletAddress: '0x3685061A465FC913bb81cd090C9fF715Fa25ffA4',
    rating: 4.7,
    highlight: 'Aperitivo al Tramonto sulla Sabbia',
    bookingType: 'Tavolo Lounge Aperitivo',
    menuItems: [
      { name: 'Tavolo Riservato Lounge Fronte Mare', description: 'Salottino con divanetti per aperitivo e cocktail al tramonto' },
    ],
  },
  {
    id: 'cafe-les-paillotes',
    name: 'Café Les Paillotes — Terrazza Mare',
    category: 'bar',
    location: 'Lungomare Cristoforo Colombo 94, Pescara',
    description: 'Lounge esclusivo in riva al mare per aperitivi di classe, finger food gourmet e musica d\'atmosfera.',
    walletAddress: '0xFC1BfCB6a2191D21ab560Ed4b6040CDE9566E850',
    rating: 4.9,
    highlight: 'Lounge Esclusivo in Riviera',
    bookingType: 'Tavolo Terrazza Lounge',
    menuItems: [
      { name: 'Tavolo Terrazza Vista Mare', description: 'Postazione panoramica riservata per aperitivo o dopocena' },
    ],
  },
  {
    id: 'tortuga-beach-club',
    name: 'Tortuga Beach Club & Disco',
    category: 'event',
    location: 'Lungomare Nord 28, Pescara',
    description: 'Punto di riferimento della vita notturna pescarese con serate estive sulla sabbia e dj set internazionali.',
    walletAddress: '0xDd62095d6372F6bFEACaFbCDBf44Cf3d14A24422',
    rating: 4.8,
    highlight: 'Tavolo Club & Dj Set',
    bookingType: 'Tavolo Disco Beach',
    menuItems: [
      { name: 'Tavolo Riservato Privé Arena Spiaggia', description: 'Accesso prioritario per la serata con salotto riservato' },
    ],
  },

  // 9. HOTEL & SOGGIORNI
  {
    id: 'hotel-esplanade',
    name: 'Hotel Esplanade Pescara 4*',
    category: 'hotel',
    location: 'Piazza Primo Maggio / Lungomare, Pescara',
    description: 'Hotel storico 4 stelle fronte mare nel centro di Pescara con terrazza panoramica e spiaggia convenzionata.',
    walletAddress: '0xb1CbCa3d28b9a066aFf7F181fA592B0c943f47Fa',
    rating: 4.8,
    highlight: 'Hotel 4* Fronte Mare in Centro',
    bookingType: 'Camera Hotel Vista Mare',
    menuItems: [
      { name: 'Camera Matrimoniale Vista Mare con Colazione', description: 'Ampia camera con balcone panoramico sul mare di Pescara' },
      { name: 'Junior Suite con Terrazza Privata', description: 'Spazio esclusivo con vasca idromassaggio e vista aperta' },
    ],
  },
  {
    id: 'victoria-hotel',
    name: 'Victoria Hotel & Spa 4*',
    category: 'hotel',
    location: 'Via Piave 142, Pescara Centro',
    description: 'Boutique hotel moderno a due passi dalle boutique di Corso Umberto e dal lungomare con centro fitness e spa.',
    walletAddress: '0x3e1077253022E48dcD01cC00BdEd0c3dfAeeF957',
    rating: 4.9,
    highlight: 'Boutique Hotel & Spa in Centro',
    bookingType: 'Soggiorno Boutique Hotel',
    menuItems: [
      { name: 'Camera Deluxe con Accesso Spa Incluso', description: 'Camera di design con accesso riservato all\'area benessere' },
    ],
  },

  // 10. EVENTI BLOCKCHAIN & FESTIVAL
  {
    id: 'blockchain-beach-party',
    name: 'Sunset Beach Party — Blockchain Beach 2026',
    category: 'event',
    location: 'Spiaggia Arena Pescara Sud',
    description: 'L\'evento musicale e di networking per festeggiare la chiusura della challenge di builder su Avalanche.',
    walletAddress: '0xe00FB97cFCB7A982D90585fdcDA66c60e14Cb598',
    rating: 5.0,
    highlight: 'Pass VIP Evento Blockchain Beach',
    bookingType: 'Pass Ingresso VIP',
    menuItems: [
      { name: 'Pass VIP Ingresso Prioritario con Bracciale', description: 'Accesso rapido all\'area evento, drink point e lounge builder' },
    ],
  },
];
