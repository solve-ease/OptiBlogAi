'use client';

import React from 'react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Zap, Search, Users, Shield, Code, TrendingUp } from 'lucide-react';

interface ValueProp {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  color: string;
}

const ValuePropositionGrid: React.FC = () => {
  const valueProps: ValueProp[] = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Lightning Fast Generation',
      description: 'Create optimized blog content in seconds with our advanced AI algorithms',
      features: ['Real-time generation', 'Multiple formats', 'Instant previews'],
      color: 'text-primary bg-primary/10',
    },
    {
      icon: <Search className="w-8 h-8" />,
      title: 'SEO Optimization',
      description: 'Built-in SEO analysis and optimization for better search rankings',
      features: ['Keyword analysis', 'Meta optimization', 'Content scoring'],
      color: 'text-secondary bg-secondary/10',
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Open Source Community',
      description: 'Join a thriving community of developers and content creators',
      features: ['Active development', 'Community support', 'Regular updates'],
      color: 'text-accent bg-accent/10',
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Privacy First',
      description: 'Your data stays secure with local processing and ethical AI practices',
      features: ['Local processing', 'No data collection', 'Transparent algorithms'],
      color: 'text-green-600 bg-green-100',
    },
    {
      icon: <Code className="w-8 h-8" />,
      title: 'Developer Friendly',
      description: 'Easy integration with your existing workflow and tools',
      features: ['API access', 'Plugin system', 'Custom integrations'],
      color: 'text-purple-600 bg-purple-100',
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Analytics & Insights',
      description: 'Track performance and optimize your content strategy',
      features: ['Performance metrics', 'A/B testing', 'Growth insights'],
      color: 'text-pink-600 bg-pink-100',
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Why Choose <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">OptiBlogAi</span>?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the powerful features that make OptiBlogAi the perfect choice for modern content creators
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {valueProps.map((prop, index) => (
            <Card
              key={index}
              hover
              className="group animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-8">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 ${prop.color} group-hover:scale-110 transition-transform duration-300`}>
                  {prop.icon}
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {prop.title}
                </h3>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {prop.description}
                </p>

                <ul className="space-y-2">
                  {prop.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-gray-500">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Ready to Transform Your Content Strategy?
            </h3>
            <p className="text-lg mb-6 opacity-90">
              Join thousands of content creators who trust OptiBlogAi for their optimization needs
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200">
                Start Free Trial
              </button>
              <button className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors duration-200">
                View Documentation
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValuePropositionGrid;