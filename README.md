# Lystr LeadGen Scout ⚡

> AI-driven lead generation and qualification demo app for Lystr's Energy-as-a-Service (EaaS) offering

**DEMO MODE**: All data is synthetic. No real persons, addresses, or contact information is used.

## 🎯 What is This?

Lystr LeadGen Scout is a proof-of-concept application that showcases an intelligent lead generation and qualification system for an energy company selling solar panels and energy systems as a service.

The app demonstrates how AI can:
- **Score and prioritize leads** based on multiple factors (energy usage, property characteristics, intent signals)
- **Generate personalized call scripts** for sales reps
- **Qualify leads automatically** through an interactive configurator
- **Analyze sales notes** and extract objections with follow-up suggestions

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Initialize the database with 200+ synthetic leads
# Visit http://localhost:3000/api/init after starting the server
# OR run the setup script (which will guide you to visit /api/init)
npm run setup

# Start the development server
npm run dev
```

The app will be available at **http://localhost:3000**

### First Time Setup

1. Start the dev server: `npm run dev`
2. Visit: http://localhost:3000/api/init (this generates 200+ synthetic leads)
3. Go back to: http://localhost:3000 to see the dashboard

## 📋 5-Minute Demo Script

### Demo Flow Overview
This demo showcases the complete lead generation → qualification → follow-up workflow.

---

### **PART 1: Prospecting Dashboard (2 min)**

**Navigate to:** http://localhost:3000

**What to show:**
1. **Stats Overview**: Point out the 4 key metrics at the top:
   - Total leads (~200)
   - Hot leads (high-priority prospects)
   - Average score
   - Contacted leads

2. **Lead Scoring**: Scroll through the leads table
   - **Explain**: Each lead has a score (0-100) based on:
     - Monthly electricity bill (higher = more savings potential)
     - Roof area (larger = better for solar)
     - Heating type (direct electric = high consumption)
     - EV ownership (increased electricity needs)
     - Intent signals (configurator visits, callbacks)

3. **Status System**: Show the color-coded statuses:
   - 🔥 **Hot** (75+ score): Priority contacts
   - 🌡️ **Warm** (55-74): Good prospects
   - ❄️ **Cold** (<55): Lower priority

4. **Generate Call List**: Click the "📞 Generera Ringningslista" button
   - **Explain**: This creates a prioritized list of today's top 20 leads
   - Sales reps start from #1 for maximum efficiency
   - Each lead shows score, contact info, and quick access button

5. **Open a Top Lead**: Click "Se Detaljer" on one of the highest-scoring leads

---

### **PART 2: Lead Detail & Call Script (1.5 min)**

**You're now on:** `/leads/LEAD-XXXX`

**What to show:**

1. **Lead Score Breakdown**:
   - Show the big score number
   - **Explain**: "Varför denna score?" section shows the TOP 3 reasons
   - Example: "Hög elräkning: 2500 kr/månad ger stor besparingspotential"
   - **Key point**: This is explainable AI, not a black box

2. **Next Best Action**: Point to the blue box
   - **Explain**: AI suggests the optimal next step based on lead stage
   - Examples:
     - "Ring inom 2 timmar - lead har begärt återkoppling"
     - "Boka platsbesiktning omgående - högprioriterad lead"

3. **Call Script** (the wow factor 🎯):
   - Scroll to the "Samtalsscript" section
   - **Explain**: AI-generated personalized script using lead's actual data
   - Show the structure:
     - **Öppning**: Personalized greeting
     - **Nyckelpoäng**: Key talking points with specific numbers (savings, system size)
     - **Invändningshantering**: Pre-prepared responses to common objections
     - **Avslutning**: Closing with concrete next step

   **Script**: "This isn't generic copy. Look - it mentions their specific monthly bill of 2,500 kr, calculates potential savings of ~1,000 kr/month, and even adjusts the pitch because they own an EV."

4. **Property Data** (right sidebar):
   - Show roof area, annual consumption, heating type
   - **Explain**: This data drives the scoring and recommendations

---

### **PART 3: Configurator (Lead Magnet) (1 min)**

**Navigate to:** http://localhost:3000/configurator

**What to show:**

1. **The Flow**:
   - Fill out the form (takes 30 seconds):
     - Select: Villa
     - Monthly bill: 2000-3000 kr/månad
     - Roof size: Medelstor (60-100 m²)
     - Check: "Jag har elbil"
     - Check: "Intresserad av batterilösning"
     - Fill in contact info (name, phone, email, kommun)

2. **Click**: "Få Min Rekommendation"

3. **Results Page**:
   - Show the personalized recommendation:
     - System size (kW)
     - Annual production (kWh)
     - Monthly savings (~40% of current bill)
     - ROI timeline

   **Explain**: "This creates a NEW lead in the system with a high score because of the strong intent signals."

4. **Click**: "Se din lead-profil" → this takes you to the newly created lead's detail page
   - Show that it has:
     - High lead score
     - Intent signals: "visitedConfigurator", "askedAboutGreenDeduction"
     - Status: Warm or Hot
     - Stage: New

---

### **PART 4: Sales Assistant (AI Note Analysis) (0.5 min)**

**Navigate to:** http://localhost:3000/sales-assistant

**What to show:**

1. **Select** any lead from the dropdown
2. **Click** "📝 Använd exempel" to load example notes
3. **Click** "✨ Analysera"

4. **Results** (right side):
   - **Sammanfattning**: Clean, CRM-ready summary
   - **Invändningar**: AI detected objections (e.g., "price", "timing")
   - **Uppföljnings-SMS**: Personalized follow-up text in Swedish
     - **Key**: The SMS addresses the specific objections mentioned in the notes
   - **Click** "📋 Kopiera" to copy the SMS text

**Explain**:
- "The AI reads messy sales notes and extracts structure."
- "It identifies objections automatically - no manual tagging needed."
- "The follow-up message is contextual: if price was an objection, it emphasizes EaaS with no upfront cost."
- "This works with rule-based AI by default. Add GEMINI_API_KEY or OPENAI_API_KEY for LLM enhancement."

---

### **Demo Wrap-Up**

**Key Takeaways** (30 seconds):

1. **Intelligent Prioritization**: Not all leads are equal - the system surfaces the best ones
2. **Actionable Intelligence**: Every lead has a clear "next best action" and personalized script
3. **Automated Qualification**: The configurator qualifies leads while capturing intent signals
4. **Sales Productivity**: AI assistant turns messy notes into structured data + follow-ups

**Real-World Integration Points**:
- Sync with Monday.com or HubSpot CRM
- Connect email inbox for automatic interaction logging
- Integrate with chat widget for live lead capture
- Connect to Hemsol API for real lead flow

---

## 🏗️ Architecture

```
Lystr LeadGen Scout
│
├── Frontend (Next.js + React)
│   ├── Dashboard (Scouten)          - Lead list with filters, scoring, call list generation
│   ├── Lead Detail                  - Deep dive into individual lead with call scripts
│   ├── Configurator                 - Lead magnet for qualification
│   └── Sales Assistant              - AI note analysis and follow-up generation
│
├── Backend (Next.js API Routes)
│   ├── /api/init                    - Initialize database with synthetic data
│   ├── /api/leads                   - Get leads with filtering
│   ├── /api/leads/[id]              - Get individual lead + interactions + call script
│   ├── /api/configurator            - Create new lead from configurator
│   └── /api/analyze-notes           - Analyze sales notes (rule-based + optional LLM)
│
├── Database (SQLite)
│   ├── leads                        - Core lead data with scoring
│   ├── interactions                 - Call logs, emails, meetings
│   └── campaigns                    - Channel performance metrics
│
└── AI/Scoring Logic
    ├── Rule-based scoring           - Weighted factors (bill, roof, EV, etc.)
    ├── Call script generation       - Personalized scripts using lead data
    ├── Objection detection          - Keyword + pattern matching
    └── Optional LLM enhancement     - Gemini or OpenAI for better summaries
```

## 📊 Data Model

### Lead
- **Identity**: id, createdAt, contactName, contactPhone, contactEmail
- **Source**: channel (Hemsol, Organic, Google Ads, etc.), segment (B2C Villa, B2B SME, BRF)
- **Property**: region, syntheticLocation, roofAreaM2, annualKwh, monthlyBillSek, heatingType, hasEV
- **Intent**: intentSignals[] (visitedConfigurator, requestedCallBack, etc.)
- **Scoring**: leadScore (0-100), scoreExplanation[], status (hot/warm/cold), stage (new → signed)
- **Actions**: nextBestAction, lastTouchAt, nextTouchAt

### Interaction
- **Core**: id, leadId, timestamp, type (call, email, chat, meeting, configurator)
- **Content**: rawNotes, aiSummary, objections[]

### Campaign
- **Metrics**: channel, monthlySpendSek, costPerLeadSek, leadsGenerated

## 🧠 AI Features

### 1. Lead Scoring (Rule-Based)
The scoring system uses weighted factors:

| Factor | Impact | Logic |
|--------|--------|-------|
| High monthly bill (>2000 kr) | +5 to +20 | More savings potential |
| Large roof area (>80 m²) | +15 | Space for optimal system |
| EV ownership | +15 | Increased electricity needs |
| Direct electric heating | +12 | High consumption |
| Strong intent signals | +8 per signal | visitedConfigurator, requestedCallBack |
| High annual consumption (>20k kWh) | +10 | Above average usage |
| Hemsol/Referral channel | +8 | High-quality lead sources |

**Result**: Explainable score with top 3 reasons shown to sales reps.

### 2. Call Script Generation
Personalized scripts include:
- Lead's name, location, and specific numbers (bill, roof size, savings)
- Tailored talking points (EV charging, battery storage, ROT deduction)
- Pre-prepared objection handling based on common patterns
- Concrete next step (schedule site visit)

### 3. Objection Detection
Keyword-based detection for:
- **Price**: "pris", "dyrt", "kostnad"
- **Trust**: "osäker", "tveksam", "garantier"
- **ROI**: "lönsamt", "återbetalningstid"
- **Timing**: "vänta", "senare", "inte nu"
- **Complexity**: "komplicerat", "krångligt"

### 4. LLM Enhancement (Optional)
Add API keys for better results:
```bash
# .env file
GEMINI_API_KEY=your_key_here
# OR
OPENAI_API_KEY=your_key_here
```

With LLM:
- More natural summaries
- Better objection detection (understands context)
- More persuasive follow-up messages

**Important**: The app works fully without API keys using rule-based AI.

## 🎨 UI Features

### Swedish Language
All UI text, labels, and copy are in Swedish to match the Swedish sales organization.

### Status Colors
- 🔥 **Red (Hot)**: Score ≥75, immediate action required
- 🌡️ **Orange (Warm)**: Score 55-74, good prospects
- ❄️ **Gray (Cold)**: Score <55, lower priority

### Demo Mode Banner
Yellow banner at the top reminds users that all data is synthetic.

## 🔄 Real-World Integration Points

While this is a demo with synthetic data, here's how it would connect to real systems:

### CRM Integration (Monday.com)
```typescript
// Pseudo-code
async function syncToMonday(lead: Lead) {
  await monday.api(`
    mutation {
      create_item (
        board_id: 123456,
        item_name: "${lead.contactName}",
        column_values: "{
          \"score\": ${lead.leadScore},
          \"status\": \"${lead.stage}\",
          \"phone\": \"${lead.contactPhone}\",
          \"next_action\": \"${lead.nextBestAction}\"
        }"
      ) { id }
    }
  `);
}
```

### Email Integration
- Parse incoming emails from leads
- Auto-create interactions
- Detect objections in email threads
- Suggest reply templates

### Hemsol API
- Real-time lead ingestion
- Webhook for new leads
- Cost-per-lead tracking
- Quality scoring

### Chat Widget
- Embed configurator as chatbot
- Instant lead creation
- Score leads in real-time
- Hand off to sales when hot

## 📁 Project Structure

```
lystr-leadgen/
├── app/                              # Next.js App Router
│   ├── api/                          # API Routes
│   │   ├── init/route.ts            # DB initialization
│   │   ├── leads/route.ts           # Lead list API
│   │   ├── leads/[id]/route.ts      # Lead detail API
│   │   ├── configurator/route.ts    # Configurator submission
│   │   └── analyze-notes/route.ts   # Sales note analysis
│   ├── leads/[id]/page.tsx          # Lead detail page
│   ├── configurator/page.tsx        # Configurator page
│   ├── sales-assistant/page.tsx     # Sales assistant page
│   ├── page.tsx                     # Dashboard (home)
│   ├── layout.tsx                   # Root layout
│   └── globals.css                  # Global styles
├── components/                       # React components
│   ├── Navigation.tsx               # Top nav bar
│   └── DemoModeBanner.tsx           # Demo warning banner
├── lib/                              # Core logic
│   ├── db.ts                        # SQLite database functions
│   ├── synthetic-data.ts            # Synthetic data generator
│   └── scoring.ts                   # Lead scoring algorithms
├── types/                            # TypeScript types
│   └── index.ts                     # All type definitions
├── scripts/                          # Utility scripts
│   └── setup-db.js                  # Database setup helper
├── data/                             # SQLite database (created on first run)
│   └── leadgen.db
├── public/                           # Static assets
├── package.json                      # Dependencies
├── tsconfig.json                     # TypeScript config
├── tailwind.config.ts               # Tailwind CSS config
├── next.config.js                   # Next.js config
└── README.md                        # This file
```

## 🧪 Testing the App

### Manual Test Checklist

- [ ] **Dashboard loads** with ~200 leads
- [ ] **Filtering works** (status, stage, channel, min score)
- [ ] **Call list generates** top 20 leads
- [ ] **Lead detail page** shows score breakdown, call script, interactions
- [ ] **Configurator** creates new lead with high score
- [ ] **Sales assistant** analyzes notes and generates follow-up
- [ ] **Navigation** between all pages works
- [ ] **Responsive design** works on mobile/tablet

### Test Scenarios

**Scenario 1: High-Priority Lead**
1. Go to Dashboard
2. Filter by status="hot" and minScore=80
3. Open top lead
4. Verify score explanation makes sense
5. Check call script mentions specific data (bill amount, roof size)

**Scenario 2: New Lead from Configurator**
1. Go to Configurator
2. Fill form: Villa, high bill, large roof, has EV, wants battery
3. Submit
4. Verify high score (should be 75+)
5. Check intent signals include "visitedConfigurator"

**Scenario 3: Sales Note Analysis**
1. Go to Sales Assistant
2. Select any lead
3. Paste: "Kund tyckte priset var för högt men gillar konceptet"
4. Click Analyze
5. Verify objection "price" is detected
6. Check follow-up SMS mentions EaaS with no upfront cost

## 🚧 Known Limitations (It's a Demo!)

1. **Synthetic Data Only**: No real people, no real addresses
2. **No Authentication**: Anyone can access everything
3. **No Real CRM Integration**: Standalone app
4. **Simplified Scoring**: Real system would use ML models
5. **No Real-Time Updates**: No WebSockets/polling
6. **Single Database**: No multi-tenant support
7. **No Analytics Dashboard**: No charts/graphs for campaign performance

## 🔮 Production Roadmap

To make this production-ready:

### Phase 1: Core Infrastructure
- [ ] Add authentication (Next-Auth)
- [ ] Multi-tenant support (org-level data isolation)
- [ ] PostgreSQL instead of SQLite
- [ ] Redis for caching and rate limiting
- [ ] Proper error handling and logging (Sentry)

### Phase 2: Real Data Integration
- [ ] Hemsol API integration
- [ ] Monday.com CRM sync
- [ ] Email inbox integration (Gmail/Outlook)
- [ ] Phone system integration (call logging)
- [ ] Chat widget embed code

### Phase 3: Advanced AI
- [ ] Train ML model on historical conversion data
- [ ] A/B test rule-based vs ML scoring
- [ ] NLP for deeper objection analysis
- [ ] Predictive analytics (churn risk, upsell opportunities)
- [ ] Voice-to-text for call transcription

### Phase 4: Sales Tools
- [ ] Automated email sequences
- [ ] SMS campaigns
- [ ] Meeting scheduler integration (Calendly)
- [ ] Document generation (contracts, quotes)
- [ ] Mobile app for field sales

### Phase 5: Analytics & Optimization
- [ ] Executive dashboard with KPIs
- [ ] Channel performance analytics
- [ ] Sales rep leaderboards
- [ ] Conversion funnel visualization
- [ ] Cohort analysis

## 🤝 Contributing

This is a demo project, but suggestions are welcome! To contribute:

1. Fork the repo
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

MIT License - feel free to use this as a template for your own projects.

## 🙏 Credits

Built for Lystr as a proof-of-concept for AI-driven lead generation in the Swedish renewable energy market.

**Tech Stack:**
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- SQLite (better-sqlite3)
- Optional: Google Gemini or OpenAI for LLM enhancement

---

**Questions?** Open an issue or reach out to the development team.

**Ready to deploy?** Check out deployment options on Vercel, Railway, or any Node.js host. Remember to:
1. Set environment variables for API keys
2. Ensure data directory is writable
3. Initialize database on first deployment (visit /api/init)

🚀 **Happy lead generating!**
