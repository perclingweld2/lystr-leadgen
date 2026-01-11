import { NextResponse } from 'next/server';
import { initDb, insertLead, insertInteraction, insertCampaign } from '@/lib/db';
import { generateDataset } from '@/lib/synthetic-data';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Ensure data directory exists
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Initialize database schema
    initDb();

    // Generate synthetic data
    const { leads, interactions, campaigns } = generateDataset(200);

    // Insert data
    for (const lead of leads) {
      insertLead(lead);
    }

    for (const interaction of interactions) {
      insertInteraction(interaction);
    }

    for (const campaign of campaigns) {
      insertCampaign(campaign);
    }

    return NextResponse.json({
      success: true,
      message: 'Database initialized successfully',
      stats: {
        leads: leads.length,
        interactions: interactions.length,
        campaigns: campaigns.length,
      },
    });
  } catch (error: any) {
    console.error('Database initialization error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
