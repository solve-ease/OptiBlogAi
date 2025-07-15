'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/app/components/ui/card';
import { TrendingUp, Users, FileText, GitBranch, Star, Download } from 'lucide-react';
import { formatNumber } from '@/app/lib/utils';

interface Stat {
  icon: React.ReactNode;
  label: string;
  value: number;
  change: number;
  color: string;
  prefix?: string;
  suffix?: string;
}

const LiveStatsPanel: React.FC = () => {
  const [stats, setStats] = useState<Stat[]>([
    {
      icon: <Star className="w-6 h-6" />,
      label: 'GitHub Stars',
      value: 2847,
      change: 12.5,
      color: 'text-primary bg-primary/10',
      suffix: '',
    },
    {
      icon: <Download className="w-6 h-6" />,
      label: 'Monthly Downloads',
      value: 18542,
      change: 23.8,
      color: 'text-secondary bg-secondary/10',
      suffix: '',
    },
    {
      icon: <Users className="w-6 h-6" />,
      label: 'Active Users',
      value: 5623,
      change: 8.3,
      color: 'text-accent bg-accent/10',
      suffix: '',
    },
    {
      icon: <FileText className="w-6 h-6" />,
      label: 'Content Generated',
      value: 125847,
      change: 45.2,
      color: 'text-green-600 bg-green-100',
      suffix: ' articles',
    },
    {
      icon: <GitBranch className="w-6 h-6" />,
      label: 'Contributors',
      value: 89,
      change: 18.7,
      color: 'text-purple-600 bg-purple-100',
      suffix: '',
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      label: 'Performance Boost',
      value: 340,
      change: 15.4,
      color: 'text-pink-600 bg-pink-100',
      prefix: '+',
      suffix: '%',
    },
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prevStats => 
        prevStats.map(stat => ({
          ...stat,
          value: stat.value + Math.floor(Math.random() * 5) - 2,
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Real-Time <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Impact</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See how OptiBlogAi is transforming content creation across the globe
          </p>
          <div className="mt-4 flex items-center justify-center">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Live data • Updates every 5 seconds</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <Card
              key={index}
              hover
              className="group animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                    {stat.icon}
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-green-600">
                    <TrendingUp className="w-4 h-4" />
                    <span>+{stat.change}%</span>
                  </div>
                </div>

                <div className="mb-2">
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {stat.prefix}{formatNumber(stat.value)}{stat.suffix}
                  </div>
                  <p className="text-gray-600 text-sm">
                    {stat.label}
                  </p>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min(stat.change * 2, 100)}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="text-2xl font-bold text-primary mb-2">99.9%</div>
              <p className="text-gray-600">Uptime Guarantee</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="text-2xl font-bold text-secondary mb-2">&lt;2s</div>
              <p className="text-gray-600">Average Response Time</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="text-2xl font-bold text-accent mb-2">24/7</div>
              <p className="text-gray-600">Community Support</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveStatsPanel