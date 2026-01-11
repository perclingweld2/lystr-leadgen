// Core data models for Lystr LeadGen Scout

export type Channel = 'Hemsol' | 'Organic' | 'Google Ads' | 'Kilowattbutiken' | 'Referral' | 'Partner';
export type Segment = 'B2C Villa' | 'B2B SME' | 'BRF';
export type Region = 'SE1' | 'SE2' | 'SE3' | 'SE4';
export type HeatingType = 'Heat Pump' | 'Direct Electric' | 'District Heating' | 'Oil' | 'Pellets';
export type LeadStatus = 'cold' | 'warm' | 'hot';
export type LeadStage =
  | 'new'
  | 'contacted'
  | 'meeting_booked'
  | 'site_visit'
  | 'offer_sent'
  | 'signed'
  | 'installed'
  | 'lost';

export type IntentSignal =
  | 'visitedConfigurator'
  | 'askedAboutGreenDeduction'
  | 'requestedCallBack'
  | 'downloadedBrochure'
  | 'watchedVideo'
  | 'returnedToSite'
  | 'sharedWithFamily';

export type InteractionType = 'call' | 'email' | 'chat' | 'configurator' | 'meeting';
export type Objection = 'price' | 'trust' | 'roi_skepticism' | 'timing' | 'complexity' | 'none';

export interface Lead {
  id: string;
  createdAt: string;
  channel: Channel;
  segment: Segment;
  region: Region;
  syntheticLocation: string;
  roofAreaM2: number;
  annualKwh: number;
  monthlyBillSek: number;
  heatingType: HeatingType;
  hasEV: boolean;
  intentSignals: IntentSignal[];
  status: LeadStatus;
  stage: LeadStage;
  leadScore: number;
  scoreExplanation: string[];
  nextBestAction: string;
  lastTouchAt: string | null;
  nextTouchAt: string | null;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
}

export interface Interaction {
  id: string;
  leadId: string;
  timestamp: string;
  type: InteractionType;
  rawNotes: string;
  aiSummary: string;
  objections: Objection[];
}

export interface Campaign {
  id: string;
  channel: Channel;
  monthlySpendSek: number;
  costPerLeadSek: number;
  leadsGenerated: number;
}

export interface LeadFilters {
  channel?: Channel;
  segment?: Segment;
  region?: Region;
  status?: LeadStatus;
  stage?: LeadStage;
  minScore?: number;
  hasEV?: boolean;
}

export interface ConfiguratorInput {
  homeType: 'villa' | 'townhouse' | 'apartment';
  monthlyBillRange: 'low' | 'medium' | 'high' | 'very_high';
  roofSizeRange: 'small' | 'medium' | 'large';
  interestedInBattery: boolean;
  hasEV: boolean;
  name?: string;
  phone?: string;
  email?: string;
  kommun?: string;
}

export interface ScoringFactors {
  baseScore: number;
  factors: {
    name: string;
    impact: number;
    reason: string;
  }[];
}

export interface CallScript {
  opening: string;
  keyPoints: string[];
  objectionHandling: string[];
  closing: string;
}
