'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import DemoModeBanner from '@/components/DemoModeBanner';
import type { Lead } from '@/types';

export default function SalesAssistant() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLeadId, setSelectedLeadId] = useState('');
  const [notes, setNotes] = useState('');
  const [interactionType, setInteractionType] = useState('call');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await fetch('/api/leads');
      const data = await res.json();
      if (data.success) {
        // Only show leads that are active (not lost or installed)
        const activeLeads = data.leads.filter(
          (l: Lead) => l.stage !== 'lost' && l.stage !== 'installed'
        );
        setLeads(activeLeads);
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedLeadId || !notes.trim()) {
      alert('Välj ett lead och skriv anteckningar först.');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/analyze-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: selectedLeadId,
          notes: notes.trim(),
          interactionType,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setResult(data.analysis);
      } else {
        alert('Ett fel uppstod. Försök igen.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Ett fel uppstod. Försök igen.');
    }

    setLoading(false);
  };

  const handleReset = () => {
    setNotes('');
    setResult(null);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Kopierat till urklipp!');
  };

  const exampleNotes = `Ringde kund. Hon var mycket intresserad men tyckte att priset var lite högt. Jag förklarade EaaS-konceptet och att det inte krävs någon stor investering. Hon nämnde att grannen nyligen installerat solceller och är nöjd. Vill prata med sin man först och höra av sig nästa vecka. Verkar som ett starkt lead men behöver lite tid att tänka.`;

  return (
    <div className="min-h-screen bg-gray-50">
      <DemoModeBanner />
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🤖 AI Säljassistent
            </h1>
            <p className="text-xl text-gray-600">
              Klistra in dina samtalsanteckningar - få automatisk sammanfattning, invändningsanalys och uppföljningstext
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Input */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">Samtalsanteckningar</h2>

              {/* Lead Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Välj Lead
                </label>
                <select
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-primary-600 focus:outline-none"
                  value={selectedLeadId}
                  onChange={(e) => setSelectedLeadId(e.target.value)}
                >
                  <option value="">-- Välj ett lead --</option>
                  {leads.map((lead) => (
                    <option key={lead.id} value={lead.id}>
                      {lead.contactName} ({lead.id}) - Score: {lead.leadScore}
                    </option>
                  ))}
                </select>
              </div>

              {/* Interaction Type */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Typ av interaktion
                </label>
                <select
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-primary-600 focus:outline-none"
                  value={interactionType}
                  onChange={(e) => setInteractionType(e.target.value)}
                >
                  <option value="call">📞 Telefonsamtal</option>
                  <option value="email">📧 E-post</option>
                  <option value="meeting">🤝 Möte</option>
                  <option value="chat">💬 Chatt</option>
                </select>
              </div>

              {/* Notes */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dina anteckningar
                </label>
                <textarea
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-primary-600 focus:outline-none h-64 resize-none"
                  placeholder="Skriv eller klistra in dina samtalsanteckningar här..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
                <button
                  onClick={() => setNotes(exampleNotes)}
                  className="text-sm text-primary-600 hover:text-primary-700 mt-2"
                >
                  📝 Använd exempel
                </button>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <button
                  onClick={handleAnalyze}
                  disabled={loading || !selectedLeadId || !notes.trim()}
                  className="flex-1 bg-primary-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Analyserar...' : '✨ Analysera'}
                </button>
                <button
                  onClick={handleReset}
                  className="bg-gray-200 text-gray-700 font-semibold px-6 py-3 rounded-lg hover:bg-gray-300 transition"
                >
                  Rensa
                </button>
              </div>

              {result?.usedLLM !== undefined && (
                <div className="mt-4 text-sm text-gray-600 bg-gray-50 p-3 rounded">
                  {result.usedLLM ? (
                    <span className="text-success-600">
                      ✅ LLM-förbättrad analys (API-nyckel hittades)
                    </span>
                  ) : (
                    <span className="text-gray-600">
                      🔧 Regelbaserad analys (ingen API-nyckel)
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Right: Results */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">AI Analys</h2>

              {!result ? (
                <div className="flex items-center justify-center h-96 text-gray-400">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🤖</div>
                    <p>Analysresultat visas här...</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Summary */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      📝 Sammanfattning
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4 text-gray-800">
                      {result.summary}
                    </div>
                  </div>

                  {/* Objections */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      ⚠️ Identifierade Invändningar
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {result.objections.length === 0 || result.objections.includes('none') ? (
                        <span className="text-sm bg-success-100 text-success-800 px-3 py-1 rounded-full">
                          Inga invändningar
                        </span>
                      ) : (
                        result.objections.map((obj: string) => (
                          <span
                            key={obj}
                            className="text-sm bg-warning-100 text-warning-800 px-3 py-2 rounded-lg font-medium"
                          >
                            {obj === 'price'
                              ? '💰 Pris'
                              : obj === 'trust'
                              ? '🤔 Förtroende'
                              : obj === 'roi_skepticism'
                              ? '📊 ROI-tvivel'
                              : obj === 'timing'
                              ? '⏰ Timing'
                              : obj === 'complexity'
                              ? '🔧 Komplexitet'
                              : obj}
                          </span>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Follow-up */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        📱 Uppföljnings-SMS
                      </h3>
                      <button
                        onClick={() => copyToClipboard(result.followUp)}
                        className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                      >
                        📋 Kopiera
                      </button>
                    </div>
                    <div className="bg-primary-50 border-2 border-primary-600 rounded-lg p-4 text-gray-800">
                      {result.followUp}
                    </div>
                    <div className="text-xs text-gray-500 mt-2 text-right">
                      {result.followUp.length} tecken
                    </div>
                  </div>

                  {/* Success Message */}
                  <div className="bg-success-50 border-2 border-success-600 rounded-lg p-4">
                    <p className="text-success-900 font-medium">
                      ✅ Interaktion sparad! Leadet har uppdaterats automatiskt.
                    </p>
                  </div>

                  {/* Tips */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">💡 Nästa steg:</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Skicka uppföljnings-SMS:et till kunden</li>
                      <li>• Boka in påminnelse för nästa kontakt</li>
                      <li>• Uppdatera CRM med senaste status</li>
                      <li>• Förbereda eventuell offert om intresset är högt</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Info Section */}
          <div className="mt-8 bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-3">ℹ️ Hur fungerar AI Säljassistenten?</h3>
            <div className="text-sm text-blue-800 space-y-2">
              <p>
                <strong>1. Invändningsdetektering:</strong> AI:n analyserar dina anteckningar och identifierar vanliga invändningar som pris, timing, förtroende, ROI-tvivel och komplexitet.
              </p>
              <p>
                <strong>2. Automatisk sammanfattning:</strong> Får en kortfattad professionell sammanfattning av samtalet som du kan använda i ditt CRM.
              </p>
              <p>
                <strong>3. Personlig uppföljning:</strong> Genererar ett skräddarsytt uppföljnings-SMS baserat på invändningarna och leadets profil.
              </p>
              <p>
                <strong>4. LLM-förbättring (valfritt):</strong> Om du lägger till GEMINI_API_KEY eller OPENAI_API_KEY i .env används LLM för ännu bättre resultat. Annars används regelbaserad AI.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
