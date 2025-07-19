"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Globe, TrendingUp, Users, Download, Map } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useRepositoryStats } from "@/hooks/useGitHubStats";

interface UsageData {
  region: string;
  country: string;
  users: number;
  growth: number;
  coordinates: { x: number; y: number };
  color: string;
}

// Global usage data - in a real app, this would come from analytics APIs
const globalUsageData: UsageData[] = [
  { region: "North America", country: "United States", users: 1250, growth: 23, coordinates: { x: 25, y: 35 }, color: "primary" },
  { region: "North America", country: "Canada", users: 380, growth: 18, coordinates: { x: 23, y: 25 }, color: "primary" },
  { region: "Europe", country: "United Kingdom", users: 920, growth: 31, coordinates: { x: 50, y: 30 }, color: "secondary" },
  { region: "Europe", country: "Germany", users: 850, growth: 27, coordinates: { x: 52, y: 32 }, color: "secondary" },
  { region: "Europe", country: "France", users: 640, growth: 19, coordinates: { x: 51, y: 35 }, color: "secondary" },
  { region: "Asia", country: "India", users: 1850, growth: 45, coordinates: { x: 72, y: 50 }, color: "accent" },
  { region: "Asia", country: "Japan", users: 720, growth: 15, coordinates: { x: 85, y: 42 }, color: "accent" },
  { region: "Asia", country: "Singapore", users: 290, growth: 38, coordinates: { x: 78, y: 60 }, color: "accent" },
  { region: "Oceania", country: "Australia", users: 420, growth: 22, coordinates: { x: 82, y: 75 }, color: "primary" },
  { region: "South America", country: "Brazil", users: 580, growth: 35, coordinates: { x: 35, y: 70 }, color: "secondary" },
];

/**
 * AdoptionMap Component - Global usage visualization
 * Shows OptiBlogAi adoption across different regions with interactive map
 */
const AdoptionMap: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [animatedUsers, setAnimatedUsers] = useState<{ [key: string]: number }>({});
  const { stats } = useRepositoryStats();

  // Animate user counts on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      const animated: { [key: string]: number } = {};
      globalUsageData.forEach((data, index) => {
        setTimeout(() => {
          setAnimatedUsers(prev => ({
            ...prev,
            [data.country]: data.users
          }));
        }, index * 100);
      });
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const getRegionData = (region: string) => {
    return globalUsageData.filter(data => data.region === region);
  };

  const getTotalUsers = () => {
    return globalUsageData.reduce((sum, data) => sum + data.users, 0);
  };

  const getAverageGrowth = () => {
    const totalGrowth = globalUsageData.reduce((sum, data) => sum + data.growth, 0);
    return Math.round(totalGrowth / globalUsageData.length);
  };

  const regions = [...new Set(globalUsageData.map(data => data.region))];

  const getColorClasses = (color: string) => {
    switch (color) {
      case "primary":
        return "bg-primary text-white";
      case "secondary":
        return "bg-secondary text-white";
      case "accent":
        return "bg-accent text-white";
      default:
        return "bg-primary text-white";
    }
  };

  return (
    <section className="py-20 bg-gray-50 relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/4 right-1/4 w-48 h-48 bg-gradient-to-br from-primary/5 to-accent/5 rounded-full blur-3xl"
          animate={{
            x: [0, 50, -50, 0],
            y: [0, -30, 30, 0],
            scale: [1, 1.2, 0.8, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Global Adoption
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            OptiBlogAi is being used by content creators around the world to revolutionize 
            their blogging and SEO strategies. See where our community is growing.
          </p>
        </motion.div>

        {/* Global Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <Card>
              <CardContent className="p-6 text-center">
                <div className="p-3 bg-primary/10 rounded-full w-fit mx-auto mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {getTotalUsers().toLocaleString()}+
                </div>
                <div className="text-gray-600">Global Users</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Card>
              <CardContent className="p-6 text-center">
                <div className="p-3 bg-secondary/10 rounded-full w-fit mx-auto mb-4">
                  <TrendingUp className="w-6 h-6 text-secondary" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {getAverageGrowth()}%
                </div>
                <div className="text-gray-600">Avg. Growth</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <Card>
              <CardContent className="p-6 text-center">
                <div className="p-3 bg-accent/10 rounded-full w-fit mx-auto mb-4">
                  <Globe className="w-6 h-6 text-accent" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {globalUsageData.length}
                </div>
                <div className="text-gray-600">Countries</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Card>
              <CardContent className="p-6 text-center">
                <div className="p-3 bg-primary/10 rounded-full w-fit mx-auto mb-4">
                  <Download className="w-6 h-6 text-primary" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {stats?.forks || 23}
                </div>
                <div className="text-gray-600">GitHub Forks</div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Interactive World Map */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Map className="w-5 h-5" />
                  <span>Usage Heatmap</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 h-80 overflow-hidden">
                  {/* Simplified World Map Background */}
                  <div className="absolute inset-0 opacity-20">
                    <svg viewBox="0 0 100 60" className="w-full h-full">
                      {/* Simplified continent shapes */}
                      <path d="M15 20 L35 15 L40 25 L35 35 L20 40 L15 30 Z" fill="currentColor" opacity="0.3" />
                      <path d="M45 15 L65 10 L70 20 L65 30 L50 35 L45 25 Z" fill="currentColor" opacity="0.3" />
                      <path d="M70 25 L90 20 L95 30 L90 40 L75 45 L70 35 Z" fill="currentColor" opacity="0.3" />
                      <path d="M25 45 L40 40 L45 50 L40 55 L30 55 L25 50 Z" fill="currentColor" opacity="0.3" />
                      <path d="M80 50 L90 45 L95 55 L90 60 L85 60 L80 55 Z" fill="currentColor" opacity="0.3" />
                    </svg>
                  </div>

                  {/* Usage Data Points */}
                  {globalUsageData.map((data, index) => (
                    <motion.div
                      key={data.country}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className={`absolute cursor-pointer group ${getColorClasses(data.color)} rounded-full flex items-center justify-center font-bold text-xs transform -translate-x-1/2 -translate-y-1/2 hover:scale-125 transition-transform duration-200`}
                      style={{
                        left: `${data.coordinates.x}%`,
                        top: `${data.coordinates.y}%`,
                        width: `${Math.max(20, Math.min(40, data.users / 50))}px`,
                        height: `${Math.max(20, Math.min(40, data.users / 50))}px`,
                      }}
                      onClick={() => setSelectedRegion(selectedRegion === data.region ? null : data.region)}
                    >
                      {Math.round(data.users / 100)}
                      
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10">
                        <div className="font-semibold">{data.country}</div>
                        <div>{data.users.toLocaleString()} users</div>
                        <div className="text-green-300">+{data.growth}% growth</div>
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                      </div>
                    </motion.div>
                  ))}

                  {/* Animated Pulse Effects */}
                  {globalUsageData.slice(0, 3).map((data, index) => (
                    <motion.div
                      key={`pulse-${data.country}`}
                      className="absolute rounded-full border-2 border-primary"
                      style={{
                        left: `${data.coordinates.x}%`,
                        top: `${data.coordinates.y}%`,
                      }}
                      animate={{
                        scale: [1, 2, 1],
                        opacity: [1, 0, 1],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: index * 1,
                      }}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Regional Breakdown */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Regional Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {regions.map((region, index) => {
                    const regionData = getRegionData(region);
                    const totalUsers = regionData.reduce((sum, data) => sum + data.users, 0);
                    const avgGrowth = Math.round(
                      regionData.reduce((sum, data) => sum + data.growth, 0) / regionData.length
                    );
                    const isSelected = selectedRegion === region;

                    return (
                      <motion.div
                        key={region}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                          isSelected 
                            ? "border-primary bg-primary/5" 
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => setSelectedRegion(isSelected ? null : region)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-gray-900">{region}</h4>
                          <div className="text-right">
                            <div className="text-lg font-bold text-primary">
                              {totalUsers.toLocaleString()}
                            </div>
                            <div className="text-sm text-green-600">+{avgGrowth}%</div>
                          </div>
                        </div>
                        
                        {isSelected && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            transition={{ duration: 0.3 }}
                            className="mt-3 pt-3 border-t border-gray-200 space-y-2"
                          >
                            {regionData.map((country) => (
                              <div key={country.country} className="flex justify-between text-sm">
                                <span className="text-gray-700">{country.country}</span>
                                <span className="font-medium">{country.users.toLocaleString()}</span>
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AdoptionMap;