import { NextResponse } from 'next/server';
import { insertInteraction, getLeadById, updateLead } from '@/lib/db';
import type { Objection } from '@/types';

// Rule-based objection extraction
function extractObjections(notes: string): Objection[] {
  const objections: Objection[] = [];
  const lowerNotes = notes.toLowerCase();

  if (
    lowerNotes.includes('pris') ||
    lowerNotes.includes('dyrt') ||
    lowerNotes.includes('kostnad') ||
    lowerNotes.includes('för mycket')
  ) {
    objections.push('price');
  }

  if (
    lowerNotes.includes('osäker') ||
    lowerNotes.includes('tveksam') ||
    lowerNotes.includes('misstro') ||
    lowerNotes.includes('garantier') ||
    lowerNotes.includes('lita på')
  ) {
    objections.push('trust');
  }

  if (
    lowerNotes.includes('roi') ||
    lowerNotes.includes('lönsamt') ||
    lowerNotes.includes('återbetalningstid') ||
    lowerNotes.includes('besparing')
  ) {
    objections.push('roi_skepticism');
  }

  if (
    lowerNotes.includes('vänta') ||
    lowerNotes.includes('senare') ||
    lowerNotes.includes('inte nu') ||
    lowerNotes.includes('hösten') ||
    lowerNotes.includes('nästa år')
  ) {
    objections.push('timing');
  }

  if (
    lowerNotes.includes('komplicerat') ||
    lowerNotes.includes('krångligt') ||
    lowerNotes.includes('svårt') ||
    lowerNotes.includes('byråkrati')
  ) {
    objections.push('complexity');
  }

  return objections.length > 0 ? objections : ['none'];
}

// Rule-based summary generation
function generateSummary(notes: string, objections: Objection[]): string {
  const sentences = notes.split('.').filter((s) => s.trim().length > 0);
  const firstSentence = sentences[0]?.trim() || notes.substring(0, 100);

  if (objections.length > 0 && !objections.includes('none')) {
    return `Kontakt med kund. Invändningar identifierade: ${objections.join(', ')}. ${firstSentence}.`;
  }

  return `Kontakt med kund. ${firstSentence}.`;
}

// Rule-based follow-up message
function generateFollowUp(notes: string, objections: Objection[], leadName: string): string {
  const name = leadName || 'där';

  if (objections.includes('price')) {
    return `Hej ${name}! Tack för vårt samtal. Jag förstår att investeringen känns stor. Med vår EaaS-lösning behöver du inte lägga ut något kapital - du börjar spara direkt med en fast månadsavgift. Kan jag skicka en konkret kalkyl för just ditt hus? Vänliga hälsningar, Lystr`;
  }

  if (objections.includes('timing')) {
    return `Hej ${name}! Tack för att du tog dig tid att prata med mig. Jag förstår att timingen inte är perfekt just nu. Låt mig höra av mig om några månader när det passar bättre. I mellantiden, här är en kalkyl om du vill titta på siffrorna. Ha en bra dag! / Lystr`;
  }

  if (objections.includes('roi_skepticism')) {
    return `Hej ${name}! Tack för samtalet. Jag har sammanställt en ROI-kalkyl baserad på din faktiska elförbrukning. Med dina siffror blir återbetalningstiden ca 7 år, och du sparar uppåt 40% på elräkningen. Vill du att jag går igenom den över telefon eller mail? Mvh, Lystr`;
  }

  if (objections.includes('complexity')) {
    return `Hej ${name}! Vi förenklar hela processen - du behöver inte tänka på tillstånd, installation eller underhåll. Vi ordnar allt från A till Ö, och du får en fast kontaktperson genom hela resan. Vill du boka in ett kort möte där jag visar exakt hur det går till? / Lystr`;
  }

  // Generic follow-up
  return `Hej ${name}! Tack för vårt samtal idag. Jag har sammanställt informationen vi pratade om. Hör gärna av dig om du har några frågor! Vänliga hälsningar, Lystr`;
}

// Optional LLM-enhanced analysis (if API keys are present)
async function enhanceWithLLM(
  notes: string,
  objections: Objection[],
  leadName: string
): Promise<{
  summary: string;
  followUp: string;
}> {
  // Check for Gemini API key first
  if (process.env.GEMINI_API_KEY) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Du är en AI-assistent för ett svenskt energibolag (Lystr) som säljer solceller som en tjänst (EaaS).

Analysera följande säljanteckningar och:
1. Skapa en kort, professionell sammanfattning (max 2 meningar)
2. Skriv ett uppföljnings-SMS på svenska (max 160 tecken)

Anteckningar: "${notes}"

Identifierade invändningar: ${objections.join(', ')}
Kunds namn: ${leadName}

Svara i JSON-format:
{
  "summary": "sammanfattning här",
  "followUp": "SMS-text här"
}`,
                  },
                ],
              },
            ],
          }),
        }
      );

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (text) {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return {
            summary: parsed.summary,
            followUp: parsed.followUp,
          };
        }
      }
    } catch (error) {
      console.error('Gemini API error:', error);
    }
  }

  // Check for OpenAI API key
  if (process.env.OPENAI_API_KEY) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content:
                'Du är en AI-assistent för ett svenskt energibolag som analyserar säljanteckningar.',
            },
            {
              role: 'user',
              content: `Analysera dessa anteckningar och svara i JSON: {"summary": "kort sammanfattning", "followUp": "uppföljnings-SMS"}

Anteckningar: "${notes}"
Invändningar: ${objections.join(', ')}
Kund: ${leadName}`,
            },
          ],
          response_format: { type: 'json_object' },
        }),
      });

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;

      if (content) {
        const parsed = JSON.parse(content);
        return {
          summary: parsed.summary,
          followUp: parsed.followUp,
        };
      }
    } catch (error) {
      console.error('OpenAI API error:', error);
    }
  }

  // Fallback to rule-based
  return {
    summary: generateSummary(notes, objections),
    followUp: generateFollowUp(notes, objections, leadName),
  };
}

export async function POST(request: Request) {
  try {
    const { leadId, notes, interactionType } = await request.json();

    if (!leadId || !notes) {
      return NextResponse.json(
        { success: false, error: 'Missing leadId or notes' },
        { status: 400 }
      );
    }

    const lead = getLeadById(leadId);
    if (!lead) {
      return NextResponse.json({ success: false, error: 'Lead not found' }, { status: 404 });
    }

    // Extract objections
    const objections = extractObjections(notes);

    // Generate or enhance summary and follow-up
    const useLLM = !!(process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY);
    const { summary, followUp } = useLLM
      ? await enhanceWithLLM(notes, objections, lead.contactName || 'där')
      : {
          summary: generateSummary(notes, objections),
          followUp: generateFollowUp(notes, objections, lead.contactName || 'där'),
        };

    // Create interaction
    const interaction = {
      id: `INT-${Date.now()}`,
      leadId: lead.id,
      timestamp: new Date().toISOString(),
      type: (interactionType || 'call') as any,
      rawNotes: notes,
      aiSummary: summary,
      objections,
    };

    insertInteraction(interaction);

    // Update lead's lastTouchAt
    updateLead(leadId, {
      lastTouchAt: interaction.timestamp,
      stage: lead.stage === 'new' ? 'contacted' : lead.stage,
    });

    return NextResponse.json({
      success: true,
      analysis: {
        summary,
        objections,
        followUp,
        usedLLM: useLLM,
      },
      interaction,
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
