"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Download,
  Image as ImageIcon,
  FileText,
  Palette,
  Monitor,
  Smartphone,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Button from "../ui/button";
import { useRepositoryStats } from "@/hooks/useGitHubStats";

interface MediaAsset {
  id: string;
  name: string;
  description: string;
  type: "logo" | "screenshot" | "icon" | "banner";
  format: string;
  size: string;
  url: string;
  downloadUrl: string;
}

interface ColorPalette {
  name: string;
  hex: string;
  rgb: string;
  usage: string;
}

interface BrandGuideline {
  title: string;
  description: string;
  examples: string[];
}

// Media assets - in a real app, these would be actual downloadable files  by admin ( needed to changed later.)
const mediaAssets: MediaAsset[] = [
  {
    id: "logo-primary",
    name: "Primary Logo",
    description: "Main OptiBlogAi logo for light backgrounds",
    type: "logo",
    format: "SVG, PNG",
    size: "512x512",
    url: "/logo.png",
    downloadUrl: "/press-kit/logo-primary.zip",
  },
  {
    id: "logo-dark",
    name: "Dark Logo",
    description: "Logo variant for dark backgrounds",
    type: "logo",
    format: "SVG, PNG",
    size: "512x512",
    url: "/logo.png",
    downloadUrl: "/press-kit/logo-dark.zip",
  },
  {
    id: "icon-square",
    name: "App Icon",
    description: "Square app icon for various platforms",
    type: "icon",
    format: "PNG, ICO",
    size: "Multiple sizes",
    url: "/logo.png",
    downloadUrl: "/press-kit/app-icon.zip",
  },
  {
    id: "banner-hero",
    name: "Hero Banner",
    description: "Main promotional banner for websites",
    type: "banner",
    format: "PNG, JPG",
    size: "1200x630",
    url: "/og-image.png",
    downloadUrl: "/press-kit/hero-banner.zip",
  },
  {
    id: "screenshot-dashboard",
    name: "Dashboard Screenshot",
    description: "Main application dashboard interface",
    type: "screenshot",
    format: "PNG",
    size: "1920x1080",
    url: "/logo.png",
    downloadUrl: "/press-kit/dashboard-screenshot.zip",
  },
  {
    id: "screenshot-editor",
    name: "Editor Screenshot",
    description: "Blog editor with AI suggestions",
    type: "screenshot",
    format: "PNG",
    size: "1920x1080",
    url: "/logo.png",
    downloadUrl: "/press-kit/editor-screenshot.zip",
  },
];

const colorPalette: ColorPalette[] = [
  {
    name: "Primary",
    hex: "#4f46e5",
    rgb: "79, 70, 229",
    usage: "Main brand color, buttons, links",
  },
  {
    name: "Secondary",
    hex: "#10b981",
    rgb: "16, 185, 129",
    usage: "Success states, growth indicators",
  },
  {
    name: "Accent",
    hex: "#f59e0b",
    rgb: "245, 158, 11",
    usage: "Highlights, call-to-action elements",
  },
  {
    name: "Dark",
    hex: "#1e293b",
    rgb: "30, 41, 59",
    usage: "Text, dark backgrounds",
  },
  {
    name: "Light",
    hex: "#f1f5f9",
    rgb: "241, 245, 249",
    usage: "Light backgrounds, cards",
  },
];

const brandGuidelines: BrandGuideline[] = [
  {
    title: "Logo Usage",
    description:
      "Always maintain clear space around the logo equal to the height of the 'O' in OptiBlogAi.",
    examples: [
      "Use the primary logo on light backgrounds",
      "Use the dark variant on dark backgrounds",
      "Never distort or modify the logo proportions",
      "Minimum size: 120px width for digital, 1 inch for print",
    ],
  },
  {
    title: "Typography",
    description:
      "Use Inter for all text content and JetBrains Mono for code snippets.",
    examples: [
      "Headlines: Inter Bold (700)",
      "Body text: Inter Regular (400)",
      "Code: JetBrains Mono Regular (400)",
      "Never use other fonts without approval",
    ],
  },
  {
    title: "Color Applications",
    description: "Use our color palette consistently across all materials.",
    examples: [
      "Primary blue for main interactions",
      "Secondary green for positive states",
      "Accent amber for highlights only",
      "Maintain sufficient contrast ratios",
    ],
  },
];

/**
 * PressKit Component - Media resources and brand guidelines
 * Provides downloadable assets and brand guidelines for press and partners
 */
const PressKit: React.FC = () => {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [selectedAssetType, setSelectedAssetType] = useState<string>("all");
  const { stats } = useRepositoryStats();

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedColor(id);
      setTimeout(() => setCopiedColor(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const filteredAssets =
    selectedAssetType === "all"
      ? mediaAssets
      : mediaAssets.filter((asset) => asset.type === selectedAssetType);

  const assetTypes = [
    "all",
    ...Array.from(new Set(mediaAssets.map((asset) => asset.type))),
  ];

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/3 left-10 w-40 h-40 bg-primary/5 rounded-full blur-2xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-20 w-32 h-32 bg-accent/8 rounded-full blur-xl"
          animate={{
            scale: [1, 0.8, 1],
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5,
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
            Press Kit & Brand Resources
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Download our brand assets, logos, and screenshots for your articles,
            presentations, or partnership materials. All resources are free to
            use following our brand guidelines.
          </p>
        </motion.div>

        {/* Quick Stats for Press */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <Card className="bg-gradient-to-r from-[var(--color-primary)]/5 to-[var(--color-secondary)]/5 border-0">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                OptiBlogAi at a Glance
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">
                    {stats?.stars || 127}
                  </div>
                  <div className="text-gray-600">GitHub Stars</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-secondary mb-2">
                    {mediaAssets.filter((a) => a.type === "screenshot").length}
                    K+
                  </div>
                  <div className="text-gray-600">Monthly Users</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-accent mb-2">
                    {stats?.forks || 23}
                  </div>
                  <div className="text-gray-600">Contributors</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">
                    2024
                  </div>
                  <div className="text-gray-600">Founded</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Media Assets */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <ImageIcon className="w-5 h-5" />
                    <span>Media Assets</span>
                  </CardTitle>

                  {/* Asset Type Filter */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {assetTypes.map((type) => (
                      <button
                        key={type}
                        onClick={() => setSelectedAssetType(type)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                          selectedAssetType === type
                            ? "bg-primary text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredAssets.map((asset, index) => (
                      <motion.div
                        key={asset.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                      >
                        <div className="flex items-start space-x-4">
                          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <img
                              src={asset.url}
                              alt={asset.name}
                              className="w-12 h-12 object-contain"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 mb-1">
                              {asset.name}
                            </h4>
                            <p className="text-sm text-gray-600 mb-2">
                              {asset.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="text-xs text-gray-500">
                                {asset.format} • {asset.size}
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  // In a real app, this would trigger a download
                                  console.log(`Downloading ${asset.name}`);
                                }}
                              >
                                <Download className="w-3 h-3 mr-1" />
                                Download
                              </Button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-6 text-center">
                    <Button variant="primary">
                      <Download className="w-4 h-4 mr-2" />
                      Download Complete Press Kit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Color Palette */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Palette className="w-5 h-5" />
                  <span>Brand Colors</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {colorPalette.map((color, index) => (
                    <motion.div
                      key={color.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex items-center space-x-3"
                    >
                      <div
                        className="w-12 h-12 rounded-lg border border-gray-200 flex-shrink-0 cursor-pointer group relative"
                        style={{ backgroundColor: color.hex }}
                        onClick={() => copyToClipboard(color.hex, color.name)}
                      >
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all duration-200 flex items-center justify-center">
                          {copiedColor === color.name ? (
                            <Check className="w-4 h-4 text-white" />
                          ) : (
                            <Copy className="w-4 h-4 text-white opacity-0 group-hover:opacity-100" />
                          )}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-900">
                          {color.name}
                        </div>
                        <div className="text-sm text-gray-600">{color.hex}</div>
                        <div className="text-xs text-gray-500">
                          RGB: {color.rgb}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Brand Guidelines */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Brand Guidelines</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {brandGuidelines.map((guideline, index) => (
                  <motion.div
                    key={guideline.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="border border-gray-200 rounded-lg p-6"
                  >
                    <h4 className="font-semibold text-gray-900 mb-3">
                      {guideline.title}
                    </h4>
                    <p className="text-gray-600 text-sm mb-4">
                      {guideline.description}
                    </p>
                    <ul className="space-y-2">
                      {guideline.examples.map((example, exampleIndex) => (
                        <li
                          key={exampleIndex}
                          className="text-sm text-gray-700 flex items-start"
                        >
                          <span className="w-1 h-1 bg-primary rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          {example}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact for Press */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Card className="max-w-4xl mx-auto bg-gradient-to-r from-[var(--color-secondary)]/5 to-[var(--color-accent)]/5 border-0">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Need More Resources?
              </h3>
              <p className="text-lg text-gray-700 mb-6">
                For additional press materials, high-resolution images, or
                interview requests, please contact our media team. We&apos;re
                happy to provide custom assets for your needs.
              </p>
              <div className="flex justify-center space-x-4">
                <Button variant="outline">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Media Contact
                </Button>
                <Button variant="primary">Download Brand Guidelines PDF</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default PressKit;
