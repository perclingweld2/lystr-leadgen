import { NextResponse } from 'next/server';
import { insertLead, insertInteraction } from '@/lib/db';
import { calculateLeadScore, generateLeadStatus, determineNextBestAction } from '@/lib/scoring';
import type { Lead, ConfiguratorInput, IntentSignal } from '@/types';

function mapConfiguratorToLead(input: ConfiguratorInput): Partial<Lead> {
  // Map ranges to actual values
  const monthlyBillMap = {
    low: 800,
    medium: 1500,
    high: 2500,
    very_high: 3500,
  };

  const roofAreaMap = {
    small: 50,
    medium: 80,
    large: 120,
  };

  const annualKwhMap = {
    low: 10000,
    medium: 18000,
    high: 28000,
    very_high: 35000,
  };

  const segment = input.homeType === 'villa' ? 'B2C Villa' : input.homeType === 'townhouse' ? 'B2C Villa' : 'BRF';

  const intentSignals: IntentSignal[] = ['visitedConfigurator'];
  if (input.interestedInBattery) intentSignals.push('askedAboutGreenDeduction');

  return {
    channel: 'Organic',
    segment: segment as any,
    region: 'SE1', // Default
    syntheticLocation: input.kommun ? `${input.kommun}, Centrum` : 'Stockholm, Centrum',
    roofAreaM2: roofAreaMap[input.roofSizeRange],
    annualKwh: annualKwhMap[input.monthlyBillRange],
    monthlyBillSek: monthlyBillMap[input.monthlyBillRange],
    heatingType: 'Heat Pump',
    hasEV: input.hasEV,
    intentSignals,
    contactName: input.name?.trim() || 'Anonym Besökare',
    contactPhone: input.phone?.trim() || '070-000 00 00',
    contactEmail: input.email?.trim() || 'anonymous@example.com',
  };
}

export async function POST(request: Request) {
  try {
    const input: ConfiguratorInput = await request.json();

    const leadId = `LEAD-CFG-${Date.now()}`;
    const createdAt = new Date().toISOString();

    const partialLead = mapConfiguratorToLead(input);
    const tempLead: Lead = {
      id: leadId,
      createdAt,
      status: 'warm',
      stage: 'new',
      leadScore: 50,
      scoreExplanation: [],
      nextBestAction: '',
      lastTouchAt: null,
      nextTouchAt: null,
      ...partialLead,
    } as Lead;

    const scoringResult = calculateLeadScore(tempLead);
    const leadScore = scoringResult.baseScore;
    const status = generateLeadStatus(leadScore);

    const lead: Lead = {
      ...tempLead,
      leadScore,
      status,
      stage: 'new',
      scoreExplanation: scoringResult.factors.slice(0, 3).map((f) => `${f.name}: ${f.reason}`),
      nextBestAction: determineNextBestAction(tempLead),
    };

    insertLead(lead);

    // Create configurator interaction
    const interaction = {
      id: `INT-CFG-${Date.now()}`,
      leadId: lead.id,
      timestamp: createdAt,
      type: 'configurator' as const,
      rawNotes: `Konfiguratorbesök: ${input.homeType}, ${input.monthlyBillRange} elräkning, ${input.roofSizeRange} tak, ${input.interestedInBattery ? 'intresserad av batteri' : 'ej batteri'}, ${input.hasEV ? 'har elbil' : 'ingen elbil'}.`,
      aiSummary: `Ny lead via konfigurator. ${input.hasEV ? 'Har elbil.' : ''} ${input.interestedInBattery ? 'Intresserad av batterilösning.' : ''} Score: ${leadScore}.`,
      objections: ['none' as const],
    };

    insertInteraction(interaction);

    // Calculate savings and system size for recommendation
    const savings = Math.floor(lead.monthlyBillSek * 0.4);
    const systemSize = Math.floor(lead.roofAreaM2 / 6);
    const annualProduction = systemSize * 950; // kWh per kW in Sweden

    return NextResponse.json({
      success: true,
      lead,
      recommendation: {
        systemSizeKw: systemSize,
        annualProductionKwh: annualProduction,
        monthlySavingsSek: savings,
        roiYears: input.interestedInBattery ? 7 : 8,
        message: `Baserat på dina uppgifter rekommenderar vi en ${systemSize} kW solcellsanläggning${input.interestedInBattery ? ' med batterilösning' : ''}. Du kan spara uppåt ${savings} kr/månad på din elräkning!`,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
