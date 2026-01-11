'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import DemoModeBanner from '@/components/DemoModeBanner';

export default function Configurator() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    homeType: 'villa',
    monthlyBillRange: 'medium',
    roofSizeRange: 'medium',
    interestedInBattery: false,
    hasEV: false,
    name: '',
    phone: '',
    email: '',
    kommun: '',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/configurator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        setResult(data);
      } else {
        alert('Ett fel uppstod. Försök igen.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Ett fel uppstod. Försök igen.');
    }

    setLoading(false);
  };

  const goToLead = () => {
    if (result?.lead?.id) {
      router.push(`/leads/${result.lead.id}`);
    }
  };

  if (result) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DemoModeBanner />
        <Navigation />

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">✅</div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Tack för ditt intresse!
                </h1>
                <p className="text-gray-600">
                  Vi har tagit emot dina uppgifter och kommer kontakta dig inom kort.
                </p>
              </div>

              <div className="bg-primary-50 border-2 border-primary-600 rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold text-primary-900 mb-4">
                  Din Rekommendation
                </h2>
                <p className="text-gray-800 mb-4">{result.recommendation.message}</p>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">Systemstorlek</div>
                    <div className="text-2xl font-bold text-primary-600">
                      {result.recommendation.systemSizeKw} kW
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Årsproduktion</div>
                    <div className="text-2xl font-bold text-primary-600">
                      {result.recommendation.annualProductionKwh.toLocaleString('sv-SE')} kWh
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Månadsbesparing</div>
                    <div className="text-2xl font-bold text-success-600">
                      ~{result.recommendation.monthlySavingsSek} kr
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">ROI</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {result.recommendation.roiYears} år
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Vad händer nu?</h3>
                <ol className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-primary-600">1.</span>
                    <span>En av våra energirådgivare kontaktar dig inom 24h</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-primary-600">2.</span>
                    <span>Vi gör en kostnadsfri platsbesiktning</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-primary-600">3.</span>
                    <span>Du får en skräddarsydd offert med exakta besparingar</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-primary-600">4.</span>
                    <span>Vi installerar och aktiverar din energilösning</span>
                  </li>
                </ol>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={goToLead}
                  className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition font-medium"
                >
                  Se din lead-profil
                </button>
                <button
                  onClick={() => setResult(null)}
                  className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition font-medium"
                >
                  Ny konfiguration
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DemoModeBanner />
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              ☀️ Solcellskonfigurator
            </h1>
            <p className="text-xl text-gray-600">
              Få en skräddarsydd rekommendation för din fastighet på 2 minuter
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
            {/* Home Type */}
            <div className="mb-6">
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                Typ av boende
              </label>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { value: 'villa', label: '🏠 Villa', emoji: '🏠' },
                  { value: 'townhouse', label: '🏘️ Radhus', emoji: '🏘️' },
                  { value: 'apartment', label: '🏢 Lägenhet', emoji: '🏢' },
                ].map((option) => (
                  <label
                    key={option.value}
                    className={`cursor-pointer border-2 rounded-lg p-4 text-center transition ${
                      formData.homeType === option.value
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="homeType"
                      value={option.value}
                      checked={formData.homeType === option.value}
                      onChange={(e) =>
                        setFormData({ ...formData, homeType: e.target.value as any })
                      }
                      className="sr-only"
                    />
                    <div className="text-3xl mb-2">{option.emoji}</div>
                    <div className="font-medium">{option.label.replace(/^..\s/, '')}</div>
                  </label>
                ))}
              </div>
            </div>

            {/* Monthly Bill */}
            <div className="mb-6">
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                Månadskostnad för el
              </label>
              <select
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-lg focus:border-primary-600 focus:outline-none"
                value={formData.monthlyBillRange}
                onChange={(e) =>
                  setFormData({ ...formData, monthlyBillRange: e.target.value as any })
                }
              >
                <option value="low">Under 1000 kr/månad</option>
                <option value="medium">1000-2000 kr/månad</option>
                <option value="high">2000-3000 kr/månad</option>
                <option value="very_high">Över 3000 kr/månad</option>
              </select>
            </div>

            {/* Roof Size */}
            <div className="mb-6">
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                Ungefärlig takyta
              </label>
              <select
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-lg focus:border-primary-600 focus:outline-none"
                value={formData.roofSizeRange}
                onChange={(e) =>
                  setFormData({ ...formData, roofSizeRange: e.target.value as any })
                }
              >
                <option value="small">Liten (30-60 m²)</option>
                <option value="medium">Medelstor (60-100 m²)</option>
                <option value="large">Stor (100+ m²)</option>
              </select>
            </div>

            {/* Checkboxes */}
            <div className="mb-6 space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.interestedInBattery}
                  onChange={(e) =>
                    setFormData({ ...formData, interestedInBattery: e.target.checked })
                  }
                  className="w-5 h-5 text-primary-600"
                />
                <span className="text-lg">
                  🔋 Jag är intresserad av batterilösning (lagra solel)
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.hasEV}
                  onChange={(e) => setFormData({ ...formData, hasEV: e.target.checked })}
                  className="w-5 h-5 text-primary-600"
                />
                <span className="text-lg">🚗 Jag har eller planerar att köpa elbil</span>
              </label>
            </div>

            <div className="border-t-2 border-gray-200 pt-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Kontaktuppgifter (valfritt men rekommenderat)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Namn"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-primary-600 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Kommun (t.ex. Solna)"
                  value={formData.kommun}
                  onChange={(e) => setFormData({ ...formData, kommun: e.target.value })}
                  className="border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-primary-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="tel"
                  placeholder="Telefon"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-primary-600 focus:outline-none"
                />
                <input
                  type="email"
                  placeholder="E-post"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-primary-600 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 text-white text-xl font-bold px-8 py-4 rounded-lg hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Beräknar...' : 'Få Min Rekommendation →'}
            </button>

            <p className="text-center text-sm text-gray-500 mt-4">
              Ingen kostnad. Ingen förpliktelse. Resultat på 2 sekunder.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
