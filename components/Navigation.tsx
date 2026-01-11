import Link from 'next/link';

export default function Navigation() {
  return (
    <nav className="bg-primary-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold">
              ⚡ Lystr LeadGen Scout
            </Link>
            <div className="hidden md:flex space-x-4">
              <Link
                href="/"
                className="px-3 py-2 rounded-md hover:bg-primary-700 transition"
              >
                Scouten
              </Link>
              <Link
                href="/configurator"
                className="px-3 py-2 rounded-md hover:bg-primary-700 transition"
              >
                Konfigurator
              </Link>
              <Link
                href="/sales-assistant"
                className="px-3 py-2 rounded-md hover:bg-primary-700 transition"
              >
                Säljassistent
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
