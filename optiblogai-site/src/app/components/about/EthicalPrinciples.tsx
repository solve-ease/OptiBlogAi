"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Eye, Heart, Users, CheckCircle, ChevronRight } from "lucide-react";
import { Card, CardContent } from "../ui/card";

interface EthicalPrinciple {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  details: string[];
  color: string;
}

const principles: EthicalPrinciple[] = [
  {
    id: "privacy",
    icon: Shield,
    title: "Privacy First",
    description: "Your data belongs to you. We process content locally and never store personal information.",
    details: [
      "Local content processing with no cloud storage",
      "Zero tracking of user behavior or content",
      "GDPR and CCPA compliant by design",
      "Open-source transparency for full auditing"
    ],
    color: "primary"
  },
  {
    id: "transparency",
    icon: Eye,
    title: "Radical Transparency",
    description: "Every algorithm, decision, and process is open for inspection and improvement.",
    details: [
      "Fully open-source codebase on GitHub",
      "Documented AI training processes and datasets",
      "Public roadmap with community input",
      "Regular transparency reports and updates"
    ],
    color: "secondary"
  },
  {
    id: "human-centric",
    icon: Heart,
    title: "Human-Centric AI",
    description: "AI should enhance human creativity, not replace it. We build tools that empower writers.",
    details: [
      "AI suggestions that inspire, don't dictate",
      "Preserve author voice and style",
      "Educational feedback to improve writing skills",
      "Always maintain human control and oversight"
    ],
    color: "accent"
  },
  {
    id: "community",
    icon: Users,
    title: "Community Driven",
    description: "Built by creators, for creators. Every feature emerges from real user needs.",
    details: [
      "Open community discussions and feature requests",
      "Regular contributor meetups and hackathons",
      "Democratic voting on major feature decisions",
      "Mentorship programs for new contributors"
    ],
    color: "primary"
  }
];

/**
 * EthicalPrinciples Component - Interactive guidelines viewer
 * Showcases OptiBlogAi's commitment to ethical AI development
 */
const EthicalPrinciples: React.FC = () => {
  const [selectedPrinciple, setSelectedPrinciple] = useState<string | null>(null);

  const getColorClasses = (color: string) => {
    switch (color) {
      case "primary":
        return "text-primary border-primary bg-primary/5";
      case "secondary":
        return "text-secondary border-secondary bg-secondary/5";
      case "accent":
        return "text-accent border-accent bg-accent/5";
      default:
        return "text-primary border-primary bg-primary/5";
    }
  };

  return (
    <section className="py-20 bg-gray-50 relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
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
            Our Ethical Principles
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We believe AI should serve humanity with transparency, respect, and responsibility. 
            These principles guide every decision we make.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {principles.map((principle, index) => {
            const Icon = principle.icon;
            const isSelected = selectedPrinciple === principle.id;
            
            return (
              <motion.div
                key={principle.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card
                  className={`cursor-pointer transition-all duration-300 hover:shadow-lg border-2 ${
                    isSelected 
                      ? getColorClasses(principle.color)
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedPrinciple(
                    isSelected ? null : principle.id
                  )}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-xl ${
                        isSelected 
                          ? `bg-${principle.color} text-white`
                          : "bg-gray-100 text-gray-600"
                      } transition-colors duration-300`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">
                            {principle.title}
                          </h3>
                          <motion.div
                            animate={{ rotate: isSelected ? 90 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                          </motion.div>
                        </div>
                        
                        <p className="text-gray-600 mb-4">
                          {principle.description}
                        </p>

                        <AnimatePresence>
                          {isSelected && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="space-y-3"
                            >
                              {principle.details.map((detail, detailIndex) => (
                                <motion.div
                                  key={detailIndex}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ 
                                    duration: 0.3, 
                                    delay: detailIndex * 0.1 
                                  }}
                                  className="flex items-start space-x-3"
                                >
                                  <CheckCircle className={`w-5 h-5 mt-0.5 text-${principle.color} flex-shrink-0`} />
                                  <span className="text-gray-700">{detail}</span>
                                </motion.div>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Ethics Commitment Statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Card className="max-w-4xl mx-auto bg-gradient-to-r from-primary/5 to-secondary/5 border-0">
            <CardContent className="p-8">
              <div className="flex items-center justify-center mb-6">
                <div className="p-4 bg-primary/10 rounded-full">
                  <Heart className="w-8 h-8 text-primary" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Our Commitment to You
              </h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                These aren&apos;t just words on a page—they&apos;re the foundation of everything we build. 
                Every line of code, every feature, and every decision is measured against these principles. 
                We&apos;re not perfect, but we&apos;re committed to continuous improvement and accountability.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default EthicalPrinciples;