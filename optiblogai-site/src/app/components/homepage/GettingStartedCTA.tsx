"use client";

import React from "react";
import { Card, CardContent } from "@/app/components/ui/card";
import { ArrowRight, Download, Code, Rocket, CheckCircle } from "lucide-react";
import Button from "../ui/button";
import { SITE_CONFIG } from "@/app/lib/constants";
import Link from "next/link";

interface Step {
  icon: React.ReactNode;
  title: string;
  description: string;
  code?: string;
  action: string;
  actionHref: string;
}

const GettingStartedCTA: React.FC = () => {
  const steps: Step[] = [
    {
      icon: <Download className="w-8 h-8" />,
      title: "Install OptiBlogAi",
      description:
        "Get started with our easy installation process using npm or yarn",
      code: "npm install optiblogai-cli",
      action: "View Installation Guide",
      actionHref: "/docs/installation",
    },
    {
      icon: <Code className="w-8 h-8" />,
      title: "Configure Your Setup",
      description:
        "Set up your configuration file and API keys in just a few minutes",
      code: "optiblogai init --config",
      action: "Configuration Docs",
      actionHref: "/docs/configuration",
    },
    {
      icon: <Rocket className="w-8 h-8" />,
      title: "Generate Your First Blog",
      description:
        "Create your first optimized blog post with our powerful AI engine",
      code: 'optiblogai generate "Your Blog Topic"',
      action: "Try Live Demo",
      actionHref: "/demo",
    },
  ];

  const benefits = [
    "Free and open source forever",
    "No credit card required",
    "Active community support",
    "Regular updates and improvements",
    "Enterprise-ready features",
    "Comprehensive documentation",
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Get Started in{" "}
            <span className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] bg-clip-text text-transparent">
              3 Simple Steps
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of developers and content creators who are already
            using OptiBlogAi to optimize their content strategy
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {steps.map((step, index) => (
            <Card
              key={index}
              hover
              className="group relative animate-slide-up"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <CardContent className="p-8">
                {/* Step Number */}
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className="text-primary mb-6 group-hover:scale-110 transition-transform duration-300">
                  {step.icon}
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 mb-6">{step.description}</p>

                {/* Code Block */}
                {step.code && (
                  <div className="bg-gray-900 rounded-lg p-4 mb-6 font-mono text-sm text-green-400 overflow-x-auto">
                    <span className="text-gray-500">$ </span>
                    {step.code}
                  </div>
                )}

                {/* Action Button */}
                <a
                  href={step.actionHref}
                  className="inline-flex items-center text-primary hover:text-primary/80 font-medium transition-colors duration-200"
                >
                  {step.action}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </a>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Benefits Grid */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 lg:p-12 mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Why Developers Love OptiBlogAi
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-secondary mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-xl text-white p-8 text-center">
              <div className="text-4xl text-white font-bold  mb-2">100%</div>
              <div className="text-lg font-semibold text-white mb-2">
                Free & Open Source
              </div>
              <p className="text-gray-white mb-6">
                No hidden costs, no vendor lock-in. Use OptiBlogAi however you
                want, whenever you want.
              </p>
              <a
                href={SITE_CONFIG.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-white font-medium"
              >
                Star us on GitHub
                <ArrowRight className="w-4 h-4 ml-2" />
              </a>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] rounded-2xl p-8 lg:p-12 text-white">
            <h3 className="text-3xl font-bold mb-4">
              Ready to Optimize Your Content?
            </h3>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join our growing community and start creating better content
              today. It takes less than 5 minutes to get up and running.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                variant="secondary"
                size="lg"
                className="bg-white text-primary hover:bg-gray-100"
              >
                <Download className="w-5 h-5 mr-2" />
                Get Started Now
              </Button>
              <Link href="/docs" passHref>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white/10"
                >
                  View Documentation
                </Button>
              </Link>
            </div>
            <div className="mt-6 text-sm opacity-75">
              No signup required • Works offline • MIT Licensed
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GettingStartedCTA;
