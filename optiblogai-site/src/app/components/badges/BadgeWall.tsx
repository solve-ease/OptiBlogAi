'use client';
import React from 'react';
import Badge from '../ui/bdge';
import { Shield, Star, Download, Users, Code, Zap } from 'lucide-react';

interface BadgeData {
  icon: React.ReactNode;
  label: string;
  value: string;
  variant: 'primary' | 'secondary' | 'accent' | 'success';
  href?: string;
}

const BadgeWall: React.FC = () => {
  const badges: BadgeData[] = [
    {
      icon: <Star className="w-3 h-3" />,
      label: 'GitHub Stars',
      value: '2.4K',
      variant: 'primary',
      href: 'https://github.com/optiblogai/optiblogai',
    },
    {
      icon: <Download className="w-3 h-3" />,
      label: 'Downloads',
      value: '12.8K',
      variant: 'secondary',
    },
    {
      icon: <Users className="w-3 h-3" />,
      label: 'Contributors',
      value: '47',
      variant: 'accent',
    },
    {
      icon: <Code className="w-3 h-3" />,
      label: 'MIT License',
      value: 'Open Source',
      variant: 'success',
    },
    {
      icon: <Zap className="w-3 h-3" />,
      label: 'Build Status',
      value: 'Passing',
      variant: 'success',
    },
    {
      icon: <Shield className="w-3 h-3" />,
      label: 'Security',
      value: 'A+',
      variant: 'primary',
    },
  ];

  return (
    <div className="flex flex-wrap gap-3 justify-center items-center">
      {badges.map((badge, index) => (
        <div
          key={index}
          className="animate-fade-in"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          {badge.href ? (
            <a
              href={badge.href}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-transform duration-200 hover:scale-105"
            >
              <Badge
                variant={badge.variant}
                size="md"
                className="flex items-center gap-1.5 cursor-pointer hover:shadow-md"
              >
                {badge.icon}
                <span className="font-medium">{badge.label}:</span>
                <span>{badge.value}</span>
              </Badge>
            </a>
          ) : (
            <Badge
              variant={badge.variant}
              size="md"
              className="flex items-center gap-1.5"
            >
              {badge.icon}
              <span className="font-medium">{badge.label}:</span>
              <span>{badge.value}</span>
            </Badge>
          )}
        </div>
      ))}
    </div>
  );
};

export default BadgeWall;