import { NextResponse } from 'next/server';
import { getAllLeads, searchLeads, isDatabaseEmpty, initDb, insertLead, insertInteraction, insertCampaign } from '@/lib/db';
import { generateDataset } from '@/lib/synthetic-data';

export async function GET(request: Request) {
  try {
    // Auto-initialize database if empty
    if (isDatabaseEmpty()) {
      console.log('Database is empty, auto-initializing...');
      initDb();
      const { leads, interactions, campaigns } = generateDataset(200);

      for (const lead of leads) {
        insertLead(lead);
      }
      for (const interaction of interactions) {
        insertInteraction(interaction);
      }
      for (const campaign of campaigns) {
        insertCampaign(campaign);
      }
      console.log('Database initialized with 200 leads');
    }

    const { searchParams } = new URL(request.url);

    const filters: any = {};

    if (searchParams.get('channel')) filters.channel = searchParams.get('channel');
    if (searchParams.get('segment')) filters.segment = searchParams.get('segment');
    if (searchParams.get('region')) filters.region = searchParams.get('region');
    if (searchParams.get('status')) filters.status = searchParams.get('status');
    if (searchParams.get('stage')) filters.stage = searchParams.get('stage');
    if (searchParams.get('minScore')) filters.minScore = parseInt(searchParams.get('minScore')!);
    if (searchParams.get('hasEV')) filters.hasEV = searchParams.get('hasEV') === 'true';

    const hasFilters = Object.keys(filters).length > 0;
    const leads = hasFilters ? searchLeads(filters) : getAllLeads();

    return NextResponse.json({ success: true, leads, count: leads.length });
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
