'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Navigation from '@/components/Navigation';
import DemoModeBanner from '@/components/DemoModeBanner';
import type { Lead, Interaction, CallScript } from '@/types';

export default function LeadDetail() {
  const params = useParams();
  const [lead, setLead] = useState<Lead | null>(null);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [callScript, setCallScript] = useState<CallScript | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLead();
  }, [params.id]);

  const fetchLead = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/leads/${params.id}`);
      const data = await res.json();

      if (data.success) {
        setLead(data.lead);
        setInteractions(data.interactions);
        setCallScript(data.callScript);
      }
    } catch (error) {
      console.error('Error fetching lead:', error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DemoModeBanner />
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">Laddar lead...</div>
        </div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DemoModeBanner />
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">Lead hittades inte</div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'hot':
        return 'bg-danger-500 text-white';
      case 'warm':
        return 'bg-warning-500 text-white';
      case 'cold':
        return 'bg-gray-400 text-white';
      default:
        return 'bg-gray-300 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DemoModeBanner />
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-gray-900">{lead.contactName}</h1>
            <span
              className={`px-4 py-2 inline-flex text-sm font-semibold rounded-full ${getStatusColor(lead.status)}`}
            >
              {lead.status === 'hot' ? '🔥 Het Lead' : lead.status === 'warm' ? '🌡️ Varm Lead' : '❄️ Kall Lead'}
            </span>
          </div>
          <p className="text-gray-600">
            {lead.syntheticLocation} · {lead.channel} · {lead.segment}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Lead Score */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Lead Score</h2>
                <div className="text-5xl font-bold text-primary-600">{lead.leadScore}</div>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium text-gray-700">Varför denna score?</h3>
                {lead.scoreExplanation.map((reason, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm">
                    <span className="text-success-600 mt-0.5">✓</span>
                    <span className="text-gray-700">{reason}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Best Action */}
            <div className="bg-primary-50 border-2 border-primary-600 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-primary-900 mb-2">
                🎯 Nästa Steg
              </h2>
              <p className="text-gray-800">{lead.nextBestAction}</p>
            </div>

            {/* Call Script */}
            {callScript && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">📞 Samtalsscript</h2>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Öppning:</h3>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded">{callScript.opening}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Nyckelpoäng:</h3>
                    <ul className="space-y-2">
                      {callScript.keyPoints.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-gray-700">
                          <span className="text-primary-600 mt-1">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Invändningshantering:</h3>
                    <div className="space-y-2">
                      {callScript.objectionHandling.map((obj, idx) => (
                        <div key={idx} className="text-sm text-gray-700 bg-yellow-50 p-2 rounded">
                          {obj}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Avslutning:</h3>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded">{callScript.closing}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Interactions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">
                Historik ({interactions.length} interaktioner)
              </h2>

              {interactions.length === 0 ? (
                <p className="text-gray-500">Inga interaktioner ännu</p>
              ) : (
                <div className="space-y-4">
                  {interactions.map((interaction) => (
                    <div key={interaction.id} className="border-l-4 border-primary-600 pl-4 py-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-gray-900 capitalize">
                          {interaction.type}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(interaction.timestamp).toLocaleDateString('sv-SE')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{interaction.aiSummary}</p>
                      {interaction.objections.length > 0 &&
                        !interaction.objections.includes('none') && (
                          <div className="flex gap-2 flex-wrap">
                            {interaction.objections.map((obj) => (
                              <span
                                key={obj}
                                className="text-xs bg-warning-100 text-warning-800 px-2 py-1 rounded"
                              >
                                {obj}
                              </span>
                            ))}
                          </div>
                        )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Lead Details */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Kontaktinfo</h2>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="text-gray-600">Telefon</div>
                  <div className="font-medium">{lead.contactPhone}</div>
                </div>
                <div>
                  <div className="text-gray-600">E-post</div>
                  <div className="font-medium">{lead.contactEmail}</div>
                </div>
                <div>
                  <div className="text-gray-600">Plats</div>
                  <div className="font-medium">{lead.syntheticLocation}</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Fastighetsdata</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Takyta</span>
                  <span className="font-medium">{lead.roofAreaM2} m²</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Årsförbrukning</span>
                  <span className="font-medium">{lead.annualKwh.toLocaleString('sv-SE')} kWh</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Månadskostnad</span>
                  <span className="font-medium">{lead.monthlyBillSek} kr</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Uppvärmning</span>
                  <span className="font-medium">{lead.heatingType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Elbil</span>
                  <span className="font-medium">{lead.hasEV ? '✅ Ja' : '❌ Nej'}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Intentionssignaler</h2>
              {lead.intentSignals.length === 0 ? (
                <p className="text-sm text-gray-500">Inga signaler ännu</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {lead.intentSignals.map((signal) => (
                    <span
                      key={signal}
                      className="text-xs bg-success-100 text-success-800 px-3 py-1 rounded-full"
                    >
                      {signal}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Status</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Stage</span>
                  <span className="font-medium capitalize">{lead.stage}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Skapad</span>
                  <span className="font-medium">
                    {new Date(lead.createdAt).toLocaleDateString('sv-SE')}
                  </span>
                </div>
                {lead.lastTouchAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Senaste kontakt</span>
                    <span className="font-medium">
                      {new Date(lead.lastTouchAt).toLocaleDateString('sv-SE')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
