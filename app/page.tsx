'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import DemoModeBanner from '@/components/DemoModeBanner';
import type { Lead } from '@/types';

export default function Dashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    stage: '',
    channel: '',
    minScore: '',
  });
  const [showCallList, setShowCallList] = useState(false);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.status) params.set('status', filters.status);
      if (filters.stage) params.set('stage', filters.stage);
      if (filters.channel) params.set('channel', filters.channel);
      if (filters.minScore) params.set('minScore', filters.minScore);

      const res = await fetch(`/api/leads?${params}`);
      const data = await res.json();

      if (data.success) {
        setLeads(data.leads);
      } else {
        console.error('Failed to fetch leads');
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
    setLoading(false);
  };

  const applyFilters = () => {
    fetchLeads();
  };

  const resetFilters = () => {
    setFilters({ status: '', stage: '', channel: '', minScore: '' });
    setTimeout(fetchLeads, 100);
  };

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

  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-danger-600 font-bold';
    if (score >= 60) return 'text-warning-600 font-semibold';
    return 'text-gray-600';
  };

  const topLeads = leads.slice(0, 20);

  return (
    <div className="min-h-screen bg-gray-50">
      <DemoModeBanner />
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Prospekteringsscouten</h1>
          <p className="text-gray-600">
            Hitta och prioritera dina bästa leads baserat på AI-driven scoring
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600">Totalt Leads</div>
            <div className="text-3xl font-bold text-gray-900">{leads.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600">Heta Leads</div>
            <div className="text-3xl font-bold text-danger-600">
              {leads.filter((l) => l.status === 'hot').length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600">Genomsnittlig Score</div>
            <div className="text-3xl font-bold text-gray-900">
              {leads.length > 0 ? Math.round(leads.reduce((sum, l) => sum + l.leadScore, 0) / leads.length) : 0}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600">Kontaktade</div>
            <div className="text-3xl font-bold text-success-600">
              {leads.filter((l) => l.stage !== 'new' && l.stage !== 'lost').length}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Filtrera Leads</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              >
                <option value="">Alla</option>
                <option value="hot">Het</option>
                <option value="warm">Varm</option>
                <option value="cold">Kall</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Stage</label>
              <select
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                value={filters.stage}
                onChange={(e) => setFilters({ ...filters, stage: e.target.value })}
              >
                <option value="">Alla</option>
                <option value="new">Ny</option>
                <option value="contacted">Kontaktad</option>
                <option value="meeting_booked">Möte bokat</option>
                <option value="offer_sent">Offert skickad</option>
                <option value="signed">Signerad</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kanal</label>
              <select
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                value={filters.channel}
                onChange={(e) => setFilters({ ...filters, channel: e.target.value })}
              >
                <option value="">Alla</option>
                <option value="Hemsol">Hemsol</option>
                <option value="Organic">Organic</option>
                <option value="Google Ads">Google Ads</option>
                <option value="Referral">Referral</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Min Score</label>
              <input
                type="number"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                value={filters.minScore}
                onChange={(e) => setFilters({ ...filters, minScore: e.target.value })}
                placeholder="0-100"
              />
            </div>
          </div>
          <div className="flex gap-4 mt-4">
            <button
              onClick={applyFilters}
              className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition"
            >
              Tillämpa Filter
            </button>
            <button
              onClick={resetFilters}
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300 transition"
            >
              Rensa
            </button>
            <button
              onClick={() => setShowCallList(!showCallList)}
              className="bg-success-600 text-white px-6 py-2 rounded-md hover:bg-success-700 transition ml-auto"
            >
              📞 Generera Ringningslista
            </button>
          </div>
        </div>

        {/* Call List */}
        {showCallList && (
          <div className="bg-green-50 border-2 border-success-600 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-success-900 mb-4">
              📋 Dagens Ringningslista (Top 20)
            </h2>
            <p className="text-sm text-gray-700 mb-4">
              Prioriterade leads för idag. Börja från toppen för bästa resultat.
            </p>
            <div className="space-y-2">
              {topLeads.map((lead, idx) => (
                <div key={lead.id} className="bg-white p-3 rounded border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-lg text-gray-500">#{idx + 1}</span>
                      <div>
                        <div className="font-semibold">{lead.contactName}</div>
                        <div className="text-sm text-gray-600">
                          {lead.contactPhone} · {lead.syntheticLocation}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-2xl font-bold ${getScoreColor(lead.leadScore)}`}>
                        {lead.leadScore}
                      </span>
                      <Link
                        href={`/leads/${lead.id}`}
                        className="bg-primary-600 text-white px-4 py-2 rounded text-sm hover:bg-primary-700"
                      >
                        Se Detaljer →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Leads Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Alla Leads ({leads.length})</h2>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-500">Laddar leads...</div>
          ) : leads.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Inga leads hittades. Besök <a href="/api/init" className="text-primary-600 underline">/api/init</a> för att initialisera databasen.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lead
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stage
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kanal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nästa Steg
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Åtgärd
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{lead.contactName}</div>
                        <div className="text-sm text-gray-500">{lead.syntheticLocation}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-2xl font-bold ${getScoreColor(lead.leadScore)}`}>
                          {lead.leadScore}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(lead.status)}`}
                        >
                          {lead.status === 'hot' ? '🔥 Het' : lead.status === 'warm' ? '🌡️ Varm' : '❄️ Kall'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {lead.stage}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {lead.channel}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 max-w-xs">
                        {lead.nextBestAction}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Link
                          href={`/leads/${lead.id}`}
                          className="text-primary-600 hover:text-primary-900 font-medium"
                        >
                          Se Detaljer →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
