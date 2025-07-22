import React from "react";
import { ContentGeneratorWizard } from "../components/demo/ContentGeneratorWizard";

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div style={{ marginTop: "4rem" }} className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Try OptiBlogAI Demo
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the power of AI-driven blog generation. Create
            SEO-optimized content with our advanced algorithms and see real-time
            quality metrics.
          </p>
        </div>

        <ContentGeneratorWizard />
      </div>
    </div>
  );
}
