"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

interface NavigationItem {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  subsections?: {
    id: string;
    title: string;
  }[];
}

interface DocNavigationProps {
  sections: NavigationItem[];
  activeSection: string;
  onSectionChange: (sectionId: string) => void;
  searchQuery: string;
}

const DocNavigation: React.FC<DocNavigationProps> = ({
  sections,
  activeSection,
  onSectionChange,
  searchQuery,
}) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["overview"]));

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  // Filter sections based on search query
  const filteredSections = sections.filter((section) =>
    searchQuery === "" ||
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.subsections?.some(sub => 
      sub.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <nav className="px-4 pb-6">
      <div className="space-y-1">
        {filteredSections.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;
          const isExpanded = expandedSections.has(section.id);

          return (
            <div key={section.id}>
              <button
                onClick={() => {
                  onSectionChange(section.id);
                  if (section.subsections) {
                    toggleSection(section.id);
                  }
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700 border-r-2 border-indigo-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`h-4 w-4 ${isActive ? "text-indigo-700" : "text-gray-400"}`} />
                  <span>{section.title}</span>
                </div>
                
                {section.subsections && (
                  <div className="ml-2">
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                )}
              </button>

              {/* Subsections */}
              {section.subsections && isExpanded && (
                <div className="mt-1 ml-6 space-y-1">
                  {section.subsections
                    .filter(sub => 
                      searchQuery === "" || 
                      sub.title.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((subsection) => (
                      <button
                        key={subsection.id}
                        onClick={() => onSectionChange(subsection.id)}
                        className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                          activeSection === subsection.id
                            ? "bg-indigo-50 text-indigo-700"
                            : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                        }`}
                      >
                        {subsection.title}
                      </button>
                    ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick Links */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Quick Links
        </h3>
        <div className="space-y-2">
          <a
            href="https://github.com/solve-ease/OptiBlogAi"
            target="_blank"
            rel="noopener noreferrer"
            className="block px-3 py-2 text-sm text-gray-600 hover:text-indigo-600 transition-colors"
          >
            GitHub Repository
          </a>
          <a
            href="/demo"
            className="block px-3 py-2 text-sm text-gray-600 hover:text-indigo-600 transition-colors"
          >
            Live Demo
          </a>
          <a
            href="/community"
            className="block px-3 py-2 text-sm text-gray-600 hover:text-indigo-600 transition-colors"
          >
            Community
          </a>
        </div>
      </div>

      {/* Version Info */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="px-3 py-2">
          <div className="text-xs text-gray-500 mb-1">Version</div>
          <div className="text-sm font-medium text-gray-900">v1.0.0</div>
        </div>
      </div>
    </nav>
  );
};

export default DocNavigation;