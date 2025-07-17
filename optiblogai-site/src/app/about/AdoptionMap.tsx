'use client';

import { motion } from 'framer-motion';
import { Globe, MapPin } from 'lucide-react';

const adoptionData = [
  { region: 'Delhi, India', type: 'College' },
  { region: 'Bangalore, India', type: 'Startup' },
  { region: 'San Francisco, USA', type: 'Open Source Devs' },
  { region: 'Hyderabad, India', type: 'Coding Club' },
  { region: 'Chennai, India', type: 'Tech Community' },
];

export default function AdoptionMap() {
  return (
    <section className="py-20 bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-5xl font-bold text-gray-900 mb-4">Growing with Communities</h2>
        <p className="text-gray-600 text-lg mb-12">
          Our tool is being adopted by students, developers, and communities across the globe.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {adoptionData.map((entry, index) => (
            <motion.div
              key={index}
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-all"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center justify-center mb-4">
                <MapPin className="text-blue-600 w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">{entry.region}</h3>
              <p className="text-gray-500">{entry.type}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-sm text-gray-500 flex items-center justify-center gap-2">
          <Globe className="w-5 h-5 text-blue-600" />
          <span>Used in 10+ cities & communities worldwide 🌍</span>
        </div>
      </div>
    </section>
  );
}
