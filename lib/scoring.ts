import type { Lead, ScoringFactors, CallScript } from '@/types';

export function calculateLeadScore(lead: Lead): ScoringFactors {
  let score = 50; // Base score
  const factors: ScoringFactors['factors'] = [];

  // Monthly bill scoring (higher bill = more savings potential)
  if (lead.monthlyBillSek > 2000) {
    const impact = Math.min(20, Math.floor((lead.monthlyBillSek - 2000) / 100));
    score += impact;
    factors.push({
      name: 'Hög elräkning',
      impact,
      reason: `${lead.monthlyBillSek} kr/månad ger stor besparingspotential`,
    });
  } else if (lead.monthlyBillSek < 800) {
    score -= 10;
    factors.push({
      name: 'Låg elräkning',
      impact: -10,
      reason: 'Begränsad besparingspotential',
    });
  }

  // Roof area scoring
  if (lead.roofAreaM2 > 80) {
    const impact = 15;
    score += impact;
    factors.push({
      name: 'Stor takyta',
      impact,
      reason: `${lead.roofAreaM2} m² ger plats för optimal solcellsanläggning`,
    });
  } else if (lead.roofAreaM2 < 40) {
    score -= 10;
    factors.push({
      name: 'Liten takyta',
      impact: -10,
      reason: 'Begränsat utrymme för solceller',
    });
  }

  // EV ownership
  if (lead.hasEV) {
    const impact = 15;
    score += impact;
    factors.push({
      name: 'Elbilsägare',
      impact,
      reason: 'Ökad elbehov och högre ROI på solceller + batteri',
    });
  }

  // Heating type
  if (lead.heatingType === 'Direct Electric') {
    const impact = 12;
    score += impact;
    factors.push({
      name: 'Direktverkande el',
      impact,
      reason: 'Hög elanvändning för uppvärmning',
    });
  } else if (lead.heatingType === 'Heat Pump') {
    const impact = 8;
    score += impact;
    factors.push({
      name: 'Värmepump',
      impact,
      reason: 'Bra kompatibilitet med solceller',
    });
  }

  // Intent signals
  const strongSignals = lead.intentSignals.filter(
    (s) => s === 'visitedConfigurator' || s === 'requestedCallBack' || s === 'askedAboutGreenDeduction'
  );
  if (strongSignals.length > 0) {
    const impact = strongSignals.length * 8;
    score += impact;
    factors.push({
      name: 'Starka köpsignaler',
      impact,
      reason: `${strongSignals.length} intentionssignaler (${strongSignals.join(', ')})`,
    });
  }

  // Annual consumption
  if (lead.annualKwh > 20000) {
    const impact = 10;
    score += impact;
    factors.push({
      name: 'Hög årskonsumtion',
      impact,
      reason: `${lead.annualKwh} kWh/år är över genomsnittet`,
    });
  }

  // Segment scoring
  if (lead.segment === 'B2C Villa') {
    const impact = 5;
    score += impact;
    factors.push({
      name: 'Ideal kundsegment',
      impact,
      reason: 'Villaägare är vår kärnmålgrupp',
    });
  }

  // Channel quality
  if (lead.channel === 'Hemsol' || lead.channel === 'Referral') {
    const impact = 8;
    score += impact;
    factors.push({
      name: 'Högkvalitativ kanal',
      impact,
      reason: `${lead.channel} genererar ofta kvalificerade leads`,
    });
  }

  // Ensure score is within bounds
  score = Math.max(0, Math.min(100, score));

  return {
    baseScore: score,
    factors: factors.sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact)),
  };
}

export function generateCallScript(lead: Lead): CallScript {
  const savings = Math.floor(lead.monthlyBillSek * 0.4); // Estimated 40% savings
  const systemSize = Math.floor(lead.roofAreaM2 / 6); // Rough estimate: 6m2 per kW

  return {
    opening: `Hej ${lead.contactName || 'där'}! Jag heter [ditt namn] och ringer från Lystr. Vi såg att du varit inne och tittat på våra energilösningar. Passar det att prata i några minuter?`,
    keyPoints: [
      `Du har idag en elräkning på ca ${lead.monthlyBillSek} kr/månad. Med vår EaaS-lösning kan du spara uppåt ${savings} kr/månad.`,
      `Din takyta på ${lead.roofAreaM2} m² är perfekt för en solcellsanläggning på ca ${systemSize} kW.`,
      lead.hasEV
        ? 'Eftersom du har elbil så blir ROI:n ännu bättre - du kan ladda direkt från ditt eget tak.'
        : 'Med vårt batteri kan du lagra solel och använda den när elpriset är som högst.',
      'Det bästa är att du slipper investering - vi står för installation och underhåll, du betalar bara en fast månadsavgift.',
      'Grönt ROT-avdrag på 20% gör att lösningen blir ännu mer lönsam.',
    ],
    objectionHandling: [
      'Pris: "Jag förstår. Det smarta med EaaS är att du inte behöver ligga ute med 150-200 tkr. Du börjar spara från dag 1 utan uppoffring."',
      'ROI-tvivel: "Jag kan göra en konkret kalkyl åt dig. Med din förbrukning och takyta så brukar payback vara 6-8 år, men med EaaS så ser du besparingen direkt."',
      'Timing: "Perfekt timing faktiskt! Elpriser förväntas stiga, och ROT-avdraget är aktivt nu. Dessutom har vi lediga installationstider i [månad]."',
      'Komplexitet: "Det är därför vi har EaaS - vi sköter allt från A till Ö. Du behöver bara säga ja, sen fixar vi resten."',
    ],
    closing:
      'Vad säger du om att vi bokar in en kostnadsfri platsbesiktning? Då kan vi göra en exakt kalkyl för just ditt hus och du får se konkret vad du kan spara. Passar [förslag på datum]?',
  };
}

export function determineNextBestAction(lead: Lead): string {
  if (lead.stage === 'new') {
    if (lead.intentSignals.includes('requestedCallBack')) {
      return 'Ring inom 2 timmar - lead har begärt återkoppling';
    }
    if (lead.intentSignals.includes('visitedConfigurator')) {
      return 'Ring och följ upp konfiguratorbesök - lead är aktivt intresserad';
    }
    return 'Skicka välkomstmail med mer info och boka uppföljningssamtal';
  }

  if (lead.stage === 'contacted') {
    if (lead.leadScore > 70) {
      return 'Boka platsbesiktning omgående - högprioriterad lead';
    }
    return 'Följ upp med detaljerad kalkyl via email';
  }

  if (lead.stage === 'meeting_booked') {
    return 'Förbered platsbesiktning - kontrollera takritningar och elförbrukning';
  }

  if (lead.stage === 'site_visit') {
    return 'Skicka offert inom 24h medan intresset är varmt';
  }

  if (lead.stage === 'offer_sent') {
    const daysSinceTouch = lead.lastTouchAt
      ? Math.floor((Date.now() - new Date(lead.lastTouchAt).getTime()) / (1000 * 60 * 60 * 24))
      : 999;
    if (daysSinceTouch > 3) {
      return 'Ring och följ upp offert - har de frågor?';
    }
    return 'Vänta ytterligare 2 dagar, skicka sedan påminnelse-SMS';
  }

  if (lead.stage === 'signed') {
    return 'Boka installationsdatum och skicka bekräftelse';
  }

  if (lead.stage === 'lost') {
    return 'Lägg i nurture-kampanj, följ upp om 6 månader';
  }

  return 'Granska lead och uppdatera status';
}

export function generateLeadStatus(leadScore: number): 'cold' | 'warm' | 'hot' {
  if (leadScore >= 75) return 'hot';
  if (leadScore >= 55) return 'warm';
  return 'cold';
}
