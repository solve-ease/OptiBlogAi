"use client";

import React, { useEffect, useRef } from "react";
import mermaid from "mermaid";

interface MermaidDiagramProps {
  chart: string;
  id: string;
  className?: string;
}

const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ chart, id, className = "" }) => {
  const mermaidRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: "default",
      securityLevel: "loose",
      themeVariables: {
        primaryColor: "#4f46e5",
        primaryTextColor: "#ffffff",
        primaryBorderColor: "#4f46e5",
        lineColor: "#6b7280",
        secondaryColor: "#10b981",
        tertiaryColor: "#f59e0b",
        background: "#ffffff",
        mainBkg: "#f8fafc",
        secondBkg: "#e5e7eb",
        tertiaryBkg: "#f3f4f6",
      },
    });

    if (mermaidRef.current) {
      mermaidRef.current.innerHTML = chart;
      mermaid.contentLoaded();
    }
  }, [chart]);

  return (
    <div className={`mermaid-container bg-gray-50 rounded-lg p-4 overflow-x-auto ${className}`}>
      <div
        ref={mermaidRef}
        id={id}
        className="mermaid"
        style={{ textAlign: "center" }}
      >
        {chart}
      </div>
    </div>
  );
};

export default MermaidDiagram;