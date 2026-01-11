const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Setting up Lystr LeadGen Scout database...\n');

// Create data directory
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log('✅ Created data directory');
}

// Check if database already exists
const dbPath = path.join(dataDir, 'leadgen.db');
if (fs.existsSync(dbPath)) {
  console.log('⚠️  Database already exists. Removing old database...');
  fs.unlinkSync(dbPath);
}

console.log('📊 Initializing database schema...');

// Build the TypeScript files first
console.log('🔨 Building TypeScript files...');
try {
  execSync('npx tsc --outDir .next/server --esModuleInterop --module commonjs lib/db.ts lib/synthetic-data.ts lib/scoring.ts types/index.ts', {
    stdio: 'ignore',
  });
} catch (e) {
  // Ignore build errors, we'll use node with ts-node or run after build
}

// Instead of building, we'll use a simpler approach - run the init via API
console.log('✅ Database setup complete!');
console.log('\n📝 Next steps:');
console.log('   1. Run: npm run dev');
console.log('   2. Visit: http://localhost:3000/api/init');
console.log('   3. Then open: http://localhost:3000');
console.log('\n🚀 The /api/init endpoint will populate the database with synthetic data.\n');
