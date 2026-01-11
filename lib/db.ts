import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import type { Lead, Interaction, Campaign } from '@/types';

const dbPath = path.join(process.cwd(), 'data', 'leadgen.db');

export function getDb() {
  // Ensure data directory exists
  const dataDir = path.dirname(dbPath);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  return db;
}

export function isDatabaseEmpty(): boolean {
  try {
    const db = getDb();
    const result = db.prepare('SELECT COUNT(*) as count FROM leads').get() as { count: number };
    db.close();
    return result.count === 0;
  } catch (error) {
    // If table doesn't exist, DB is empty
    return true;
  }
}

export function initDb() {
  const db = getDb();

  // Create leads table
  db.exec(`
    CREATE TABLE IF NOT EXISTS leads (
      id TEXT PRIMARY KEY,
      createdAt TEXT NOT NULL,
      channel TEXT NOT NULL,
      segment TEXT NOT NULL,
      region TEXT NOT NULL,
      syntheticLocation TEXT NOT NULL,
      roofAreaM2 INTEGER NOT NULL,
      annualKwh INTEGER NOT NULL,
      monthlyBillSek INTEGER NOT NULL,
      heatingType TEXT NOT NULL,
      hasEV INTEGER NOT NULL,
      intentSignals TEXT NOT NULL,
      status TEXT NOT NULL,
      stage TEXT NOT NULL,
      leadScore INTEGER NOT NULL,
      scoreExplanation TEXT NOT NULL,
      nextBestAction TEXT NOT NULL,
      lastTouchAt TEXT,
      nextTouchAt TEXT,
      contactName TEXT,
      contactPhone TEXT,
      contactEmail TEXT
    )
  `);

  // Create interactions table
  db.exec(`
    CREATE TABLE IF NOT EXISTS interactions (
      id TEXT PRIMARY KEY,
      leadId TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      type TEXT NOT NULL,
      rawNotes TEXT NOT NULL,
      aiSummary TEXT NOT NULL,
      objections TEXT NOT NULL,
      FOREIGN KEY (leadId) REFERENCES leads(id)
    )
  `);

  // Create campaigns table
  db.exec(`
    CREATE TABLE IF NOT EXISTS campaigns (
      id TEXT PRIMARY KEY,
      channel TEXT NOT NULL,
      monthlySpendSek INTEGER NOT NULL,
      costPerLeadSek INTEGER NOT NULL,
      leadsGenerated INTEGER NOT NULL
    )
  `);

  // Create indexes
  db.exec(`CREATE INDEX IF NOT EXISTS idx_leads_score ON leads(leadScore DESC)`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_leads_stage ON leads(stage)`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status)`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_interactions_leadId ON interactions(leadId)`);

  db.close();
}

export function insertLead(lead: Lead) {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO leads VALUES (
      @id, @createdAt, @channel, @segment, @region, @syntheticLocation,
      @roofAreaM2, @annualKwh, @monthlyBillSek, @heatingType, @hasEV,
      @intentSignals, @status, @stage, @leadScore, @scoreExplanation,
      @nextBestAction, @lastTouchAt, @nextTouchAt, @contactName,
      @contactPhone, @contactEmail
    )
  `);

  stmt.run({
    ...lead,
    hasEV: lead.hasEV ? 1 : 0,
    intentSignals: JSON.stringify(lead.intentSignals),
    scoreExplanation: JSON.stringify(lead.scoreExplanation),
  });

  db.close();
}

export function insertInteraction(interaction: Interaction) {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO interactions VALUES (@id, @leadId, @timestamp, @type, @rawNotes, @aiSummary, @objections)
  `);

  stmt.run({
    ...interaction,
    objections: JSON.stringify(interaction.objections),
  });

  db.close();
}

export function insertCampaign(campaign: Campaign) {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO campaigns VALUES (@id, @channel, @monthlySpendSek, @costPerLeadSek, @leadsGenerated)
  `);

  stmt.run(campaign);
  db.close();
}

export function getAllLeads(): Lead[] {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM leads ORDER BY leadScore DESC').all();
  db.close();

  return rows.map((row: any) => ({
    ...row,
    hasEV: Boolean(row.hasEV),
    intentSignals: JSON.parse(row.intentSignals),
    scoreExplanation: JSON.parse(row.scoreExplanation),
  }));
}

export function getLeadById(id: string): Lead | null {
  const db = getDb();
  const row = db.prepare('SELECT * FROM leads WHERE id = ?').get(id) as any;
  db.close();

  if (!row) return null;

  return {
    ...row,
    hasEV: Boolean(row.hasEV),
    intentSignals: JSON.parse(row.intentSignals),
    scoreExplanation: JSON.parse(row.scoreExplanation),
  };
}

export function updateLead(id: string, updates: Partial<Lead>) {
  const db = getDb();
  const fields = Object.keys(updates)
    .map((key) => `${key} = @${key}`)
    .join(', ');

  const stmt = db.prepare(`UPDATE leads SET ${fields} WHERE id = @id`);

  const params: any = { id };
  for (const [key, value] of Object.entries(updates)) {
    if (key === 'hasEV') {
      params[key] = value ? 1 : 0;
    } else if (key === 'intentSignals' || key === 'scoreExplanation') {
      params[key] = JSON.stringify(value);
    } else {
      params[key] = value;
    }
  }

  stmt.run(params);
  db.close();
}

export function getInteractionsByLeadId(leadId: string): Interaction[] {
  const db = getDb();
  const rows = db
    .prepare('SELECT * FROM interactions WHERE leadId = ? ORDER BY timestamp DESC')
    .all(leadId);
  db.close();

  return rows.map((row: any) => ({
    ...row,
    objections: JSON.parse(row.objections),
  }));
}

export function getAllCampaigns(): Campaign[] {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM campaigns').all();
  db.close();
  return rows as Campaign[];
}

export function searchLeads(filters: {
  channel?: string;
  segment?: string;
  region?: string;
  status?: string;
  stage?: string;
  minScore?: number;
  hasEV?: boolean;
}): Lead[] {
  const db = getDb();
  let query = 'SELECT * FROM leads WHERE 1=1';
  const params: any = {};

  if (filters.channel) {
    query += ' AND channel = @channel';
    params.channel = filters.channel;
  }
  if (filters.segment) {
    query += ' AND segment = @segment';
    params.segment = filters.segment;
  }
  if (filters.region) {
    query += ' AND region = @region';
    params.region = filters.region;
  }
  if (filters.status) {
    query += ' AND status = @status';
    params.status = filters.status;
  }
  if (filters.stage) {
    query += ' AND stage = @stage';
    params.stage = filters.stage;
  }
  if (filters.minScore !== undefined) {
    query += ' AND leadScore >= @minScore';
    params.minScore = filters.minScore;
  }
  if (filters.hasEV !== undefined) {
    query += ' AND hasEV = @hasEV';
    params.hasEV = filters.hasEV ? 1 : 0;
  }

  query += ' ORDER BY leadScore DESC';

  const rows = db.prepare(query).all(params);
  db.close();

  return rows.map((row: any) => ({
    ...row,
    hasEV: Boolean(row.hasEV),
    intentSignals: JSON.parse(row.intentSignals),
    scoreExplanation: JSON.parse(row.scoreExplanation),
  }));
}
