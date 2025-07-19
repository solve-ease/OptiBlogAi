'use client';

import { ShieldCheck, Users, Lightbulb, Globe2 } from 'lucide-react';
import { motion } from 'framer-motion';


const principles = [
  {
    icon: <ShieldCheck className="h-6 w-6 text-green-600" />,
    title: 'Privacy First',
    description: 'We never store your blog data. Everything runs securely in your browser or private environment.',
  },
  {
    icon: <Users className="h-6 w-6 text-blue-600" />,
    title: 'Open Collaboration',
    description: 'Join a community of developers contributing to a truly open-source AI content tool.',
  },
  {
    icon: <Lightbulb className="h-6 w-6 text-yellow-500" />,
    title: 'Transparency & Learning',
    description: 'All models, metrics, and algorithms are openly documented for transparency and learning.',
  },
  {
    icon: <Globe2 className="h-6 w-6 text-purple-600" />,
    title: 'Global Impact',
    description: 'We aim to make AI-powered content creation accessible to all, regardless of location.',
  },
];

export default function EthicalPrinciples() {
  return (
    <section className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-bold tracking-tight text-gray-900 "
        >
          Our Core Ethical Principles
        </motion.h2>
        <p className="mt-4 max-w-2xl text-lg text-gray-600 mx-auto">
          At OptiBlogAi, we believe in building AI tools that respect users and empower creators.
        </p>
      </div>

      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
        {principles.map((principle, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            viewport={{ once: true }}
            className="rounded-xl border border-gray-200 bg-white shadow-sm p-6 text-left hover:shadow-md transition-shadow"
          >
            <div className="mb-4">{principle.icon}</div>
            <h3 className="text-lg font-semibold text-gray-900">{principle.title}</h3>
            <p className="mt-2 text-sm text-gray-600">{principle.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
