import type {
  Lead,
  Interaction,
  Campaign,
  Channel,
  Segment,
  Region,
  HeatingType,
  IntentSignal,
  LeadStage,
  InteractionType,
  Objection,
} from '@/types';
import { calculateLeadScore, generateLeadStatus, determineNextBestAction } from './scoring';

// Swedish kommun names (synthetic)
const KOMMUNER = [
  'Solna',
  'Danderyd',
  'Täby',
  'Nacka',
  'Lidingö',
  'Värmdö',
  'Huddinge',
  'Sollentuna',
  'Upplands Väsby',
  'Järfälla',
  'Sundbyberg',
  'Ekerö',
  'Vaxholm',
  'Norrtälje',
  'Sigtuna',
  'Uppsala',
  'Enköping',
  'Håbo',
  'Västerås',
  'Eskilstuna',
  'Linköping',
  'Norrköping',
  'Malmö',
  'Lund',
  'Helsingborg',
  'Göteborg',
  'Mölndal',
  'Partille',
];

const OMRÅDEN = [
  'Centrum',
  'Villaområdet',
  'Norra Delen',
  'Södra Delen',
  'Östra Kvarteret',
  'Västra Sidan',
  'Industriområdet',
  'Strandvägen',
];

// Synthetic Swedish names
const FIRST_NAMES = [
  'Erik',
  'Anna',
  'Lars',
  'Maria',
  'Johan',
  'Emma',
  'Anders',
  'Sofia',
  'Peter',
  'Karin',
  'Mikael',
  'Linda',
  'Karl',
  'Sara',
  'Magnus',
  'Eva',
  'Gustav',
  'Helena',
  'Oskar',
  'Ingrid',
];

const LAST_NAMES = [
  'Andersson',
  'Johansson',
  'Karlsson',
  'Nilsson',
  'Eriksson',
  'Larsson',
  'Olsson',
  'Persson',
  'Svensson',
  'Gustafsson',
  'Pettersson',
  'Jonsson',
  'Jansson',
  'Hansson',
  'Bengtsson',
];

function randomChoice<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomBool(probability = 0.5): boolean {
  return Math.random() < probability;
}

function randomDate(startDays: number, endDays: number): string {
  const now = Date.now();
  const start = now - startDays * 24 * 60 * 60 * 1000;
  const end = now - endDays * 24 * 60 * 60 * 1000;
  return new Date(start + Math.random() * (end - start)).toISOString();
}

function generateSyntheticPhone(): string {
  return `07${randomInt(0, 9)}-${randomInt(100, 999)} ${randomInt(10, 99)} ${randomInt(10, 99)}`;
}

function generateSyntheticEmail(name: string): string {
  const domains = ['example.se', 'test.se', 'demo.se', 'synthetic.se'];
  return `${name.toLowerCase().replace(' ', '.')}@${randomChoice(domains)}`;
}

function generateIntentSignals(): IntentSignal[] {
  const allSignals: IntentSignal[] = [
    'visitedConfigurator',
    'askedAboutGreenDeduction',
    'requestedCallBack',
    'downloadedBrochure',
    'watchedVideo',
    'returnedToSite',
    'sharedWithFamily',
  ];

  const signals: IntentSignal[] = [];
  const count = randomInt(0, 4);

  for (let i = 0; i < count; i++) {
    const signal = randomChoice(allSignals);
    if (!signals.includes(signal)) {
      signals.push(signal);
    }
  }

  return signals;
}

function generateLeadStage(score: number): LeadStage {
  // Higher scores are more likely to be further in the funnel
  if (score > 85 && randomBool(0.2)) return 'signed';
  if (score > 80 && randomBool(0.15)) return 'offer_sent';
  if (score > 75 && randomBool(0.2)) return 'site_visit';
  if (score > 70 && randomBool(0.25)) return 'meeting_booked';
  if (score > 60 && randomBool(0.3)) return 'contacted';
  if (score < 40 && randomBool(0.15)) return 'lost';
  return 'new';
}

export function generateSyntheticLead(id: number): Lead {
  const channel: Channel = randomChoice<Channel>([
    'Hemsol',
    'Hemsol',
    'Hemsol', // Weight Hemsol higher
    'Organic',
    'Organic',
    'Google Ads',
    'Kilowattbutiken',
    'Referral',
    'Partner',
  ]);

  const segment: Segment = randomChoice<Segment>([
    'B2C Villa',
    'B2C Villa',
    'B2C Villa',
    'B2C Villa', // Most leads are B2C Villa
    'B2B SME',
    'BRF',
  ]);

  const region: Region = randomChoice<Region>(['SE1', 'SE2', 'SE3', 'SE4']);
  const kommun = randomChoice(KOMMUNER);
  const område = randomChoice(OMRÅDEN);
  const syntheticLocation = `${kommun}, ${område}`;

  const roofAreaM2 = randomInt(30, 150);
  const annualKwh = randomInt(8000, 35000);
  const monthlyBillSek = randomInt(600, 4000);
  const heatingType = randomChoice<HeatingType>([
    'Heat Pump',
    'Heat Pump',
    'Direct Electric',
    'District Heating',
    'Oil',
    'Pellets',
  ]);
  const hasEV = randomBool(0.3); // 30% have EVs

  const intentSignals = generateIntentSignals();
  const firstName = randomChoice(FIRST_NAMES);
  const lastName = randomChoice(LAST_NAMES);
  const contactName = `${firstName} ${lastName}`;

  const createdAt = randomDate(90, 0); // Within last 90 days

  // Calculate score first
  const tempLead: Lead = {
    id: `LEAD-${id.toString().padStart(4, '0')}`,
    createdAt,
    channel,
    segment,
    region,
    syntheticLocation,
    roofAreaM2,
    annualKwh,
    monthlyBillSek,
    heatingType,
    hasEV,
    intentSignals,
    status: 'warm', // Temporary
    stage: 'new', // Temporary
    leadScore: 50, // Temporary
    scoreExplanation: [],
    nextBestAction: '',
    lastTouchAt: null,
    nextTouchAt: null,
    contactName,
    contactPhone: generateSyntheticPhone(),
    contactEmail: generateSyntheticEmail(contactName),
  };

  const scoringResult = calculateLeadScore(tempLead);
  const leadScore = scoringResult.baseScore;
  const status = generateLeadStatus(leadScore);
  const stage = generateLeadStage(leadScore);

  const lastTouchAt =
    stage !== 'new' && randomBool(0.7) ? randomDate(randomInt(1, 30), 0) : null;
  const nextTouchAt =
    stage !== 'signed' && stage !== 'lost' && randomBool(0.5)
      ? new Date(Date.now() + randomInt(1, 7) * 24 * 60 * 60 * 1000).toISOString()
      : null;

  return {
    ...tempLead,
    leadScore,
    status,
    stage,
    scoreExplanation: scoringResult.factors.slice(0, 3).map((f) => `${f.name}: ${f.reason}`),
    nextBestAction: determineNextBestAction({ ...tempLead, stage }),
    lastTouchAt,
    nextTouchAt,
  };
}

export function generateSyntheticInteraction(leadId: string, index: number): Interaction {
  const type = randomChoice<InteractionType>(['call', 'email', 'chat', 'configurator', 'meeting']);

  const rawNotesTemplates = {
    call: [
      'Ringde kund. Intresserad men vill vänta till hösten. Nämde att grannen nyligen installerat solceller. Undrade om ROT-avdrag. Ska prata med partner.',
      'Uppföljning efter offert. Kunden tycker priset är lite högt, men gillar EaaS-konceptet. Vill ha mer info om batterilösning och garantier.',
      'Initial kontakt. Mycket positiv, har redan gjort research. Frågade om installation under vintern och om vi kan hjälpa med el-certifikat.',
      'Kund tveksam till långt avtal. Förklarade flexibilitet i EaaS. Nämnde att elkostnader fortsätter öka. Ska återkomma nästa vecka.',
    ],
    email: [
      'Skickade detaljerad offert med ROI-kalkyl. Inkluderade case från liknande villaägare i området. Föreslog platsbesiktning.',
      'Följde upp konfiguratorbesök. Svarade på frågor om installation, garantier och vad som ingår i serviceavtalet.',
      'Kund mailade frågor om grönt ROT-avdrag och hur det fungerar med EaaS. Skickade utförligt svar med länkar till Skatteverket.',
    ],
    chat: [
      'Chattade via hemsidan. Kund frågade om priser och installationstid. Bokade in telefonsamtal för djupare diskussion.',
      'Livechatt - kund ville veta skillnad mellan köp och EaaS. Förklarade fördelarna. Kund verkade övertygad, bad om offert.',
    ],
    configurator: [
      'Kund använde konfigurator. Valde villa, hög elräkning, stor takyta, intresserad av batteri och har elbil. Lämnade kontaktinfo.',
      'Konfiguratorbesök. Medium takyta, medelhög räkning, ingen elbil ännu men planerar köp. Ville ha återkoppling.',
    ],
    meeting: [
      'Platsbesiktning genomförd. Tak i utmärkt skick, optimal vinkel mot söder. Kund mycket positiv, vill gå vidare med offert.',
      'Möte på kontoret. Gick igenom offert i detalj. Kund nöjd med prissättning, vill diskutera med ekonomisk rådgivare först.',
    ],
  };

  const rawNotes = randomChoice(rawNotesTemplates[type]);

  const objectionsList: Objection[] = ['price', 'trust', 'roi_skepticism', 'timing', 'complexity'];
  const objections: Objection[] = [];
  if (randomBool(0.4)) {
    objections.push(randomChoice(objectionsList));
  }
  if (randomBool(0.2)) {
    const secondObjection = randomChoice(objectionsList);
    if (!objections.includes(secondObjection)) {
      objections.push(secondObjection);
    }
  }

  const aiSummary = `${type === 'call' ? 'Samtal' : type === 'email' ? 'E-post' : type === 'chat' ? 'Chatt' : type === 'meeting' ? 'Möte' : 'Konfiguratorbesök'} med kund. ${objections.length > 0 ? `Invändningar: ${objections.join(', ')}. ` : ''}${rawNotes.split('.')[0]}.`;

  return {
    id: `INT-${leadId}-${index}-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    leadId,
    timestamp: randomDate(30, 0),
    type,
    rawNotes,
    aiSummary,
    objections: objections.length > 0 ? objections : ['none'],
  };
}

export function generateSyntheticCampaigns(): Campaign[] {
  return [
    {
      id: 'CAMP-001',
      channel: 'Hemsol',
      monthlySpendSek: 50000,
      costPerLeadSek: 450,
      leadsGenerated: 111,
    },
    {
      id: 'CAMP-002',
      channel: 'Google Ads',
      monthlySpendSek: 30000,
      costPerLeadSek: 380,
      leadsGenerated: 79,
    },
    {
      id: 'CAMP-003',
      channel: 'Kilowattbutiken',
      monthlySpendSek: 20000,
      costPerLeadSek: 520,
      leadsGenerated: 38,
    },
    {
      id: 'CAMP-004',
      channel: 'Organic',
      monthlySpendSek: 0,
      costPerLeadSek: 0,
      leadsGenerated: 45,
    },
    {
      id: 'CAMP-005',
      channel: 'Referral',
      monthlySpendSek: 0,
      costPerLeadSek: 0,
      leadsGenerated: 28,
    },
  ];
}

export function generateDataset(leadCount = 200) {
  const leads: Lead[] = [];
  const interactions: Interaction[] = [];

  for (let i = 1; i <= leadCount; i++) {
    const lead = generateSyntheticLead(i);
    leads.push(lead);

    // Generate 0-3 interactions per lead
    const interactionCount = randomInt(0, 3);
    for (let j = 0; j < interactionCount; j++) {
      interactions.push(generateSyntheticInteraction(lead.id, j));
    }
  }

  const campaigns = generateSyntheticCampaigns();

  return { leads, interactions, campaigns };
}
