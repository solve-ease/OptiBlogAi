'use client';

import { Download, FileText } from 'lucide-react';

export default function PressKit() {
  const pressAssets = [
    {
      name: 'Primary Logo (PNG)',
      url: '/assets/branding/logo-primary.png',
    },
    {
      name: 'Dark Logo (SVG)',
      url: '/assets/branding/logo-dark.svg',
    },
    {
      name: 'Banner Image (JPG)',
      url: '/assets/branding/banner.jpg',
    },
    {
      name: 'Pitch Deck (PDF)',
      url: '/assets/branding/pitch-deck.pdf',
    },
  ];

  return (
    <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-5xl font-bold text-gray-900 mb-4">Press Kit & Brand Assets</h2>
        <p className="text-gray-600 mb-10 text-lg">
          Download our logos, banners, and media kit for coverage or partnerships.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6 mb-12">
          {pressAssets.map((asset, index) => (
            <a
              key={index}
              href={asset.url}
              download
              className="flex items-center justify-between p-5 border rounded-xl hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-3">
                <FileText className="text-blue-600 w-5 h-5" />
                <span className="text-gray-800 font-medium">{asset.name}</span>
              </div>
              <Download className="text-gray-500 w-5 h-5" />
            </a>
          ))}
        </div>

        <div className="text-left max-w-2xl mx-auto">
          <h3 className="text-xl font-semibold mb-2">🎨 Brand Guidelines</h3>
          <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
            <li>Use logo on light backgrounds only.</li>
            <li>Maintain 16px spacing around the logo.</li>
            <li>Primary color: <span className="font-semibold text-blue-600">#2563EB</span></li>
            <li>Font family: Inter / sans-serif</li>
            <li>Do not edit or stretch brand assets.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
