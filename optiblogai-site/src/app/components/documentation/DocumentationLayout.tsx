"use client";

import React, { useState, useEffect } from "react";
import { ChevronRight, Menu, X, Search, BookOpen, Code, Zap, Server, Settings, Users } from "lucide-react";
import DocNavigation from "./DocNavigation";
import OverviewSection from "./sections/OverviewSection";
import ArchitectureSection from "./sections/ArchitectureSection";
import FrontendSection from "./sections/FrontendSection";
import BackendSection from "./sections/BackendSection";
import AgentSystemSection from "./sections/AgentSystemSection";
import APIReferenceSection from "./sections/APIReferenceSection";
import DeploymentSection from "./sections/DeploymentSection";

interface Section {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  component: React.ComponentType<any>;
}

const sections: Section[] = [
  { id: "overview", title: "Overview", icon: BookOpen, component: OverviewSection },
  { id: "architecture", title: "Architecture", icon: Zap, component: ArchitectureSection },
  { id: "frontend", title: "Frontend Guide", icon: Code, component: FrontendSection },
  { id: "backend", title: "Backend Guide", icon: Settings, component: BackendSection },
  { id: "agent-system", title: "Agent System", icon: Zap, component: AgentSystemSection },
  { id: "api", title: "API Reference", icon: Server, component: APIReferenceSection },
  { id: "deployment", title: "Deployment", icon: Settings, component: DeploymentSection },
];

const DocumentationLayout: React.FC = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Get the active section component
  const ActiveComponent = sections.find(s => s.id === activeSection)?.component || OverviewSection;

  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId);
    setIsSidebarOpen(false); // Close sidebar on mobile after selection
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side */}
            <div className="flex items-center space-x-4">
              {/* Mobile menu button */}
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              >
                {isSidebarOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>

              {/* Title */}
              <div className="flex items-center space-x-2">
                <BookOpen className="h-6 w-6 text-indigo-600" />
                <h1 className="text-xl font-semibold text-gray-900">OptiBlogAi Docs</h1>
              </div>

              {/* Breadcrumbs */}
              <nav className="hidden md:flex items-center space-x-2 text-sm text-gray-500">
                <span>Documentation</span>
                <ChevronRight className="h-4 w-4" />
                <span className="text-gray-900 font-medium">
                  {sections.find(s => s.id === activeSection)?.title}
                </span>
              </nav>
            </div>

            {/* Search bar */}
            <div className="flex-1 max-w-md mx-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search documentation..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Right side actions */}
            <div className="flex items-center space-x-3">
              <a
                href="https://github.com/solve-ease/OptiBlogAi"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-900 transition-colors"
              >
                <Users className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-30 w-80 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out`}
        >
          <div className="h-full overflow-y-auto pt-4">
            <DocNavigation
              sections={sections}
              activeSection={activeSection}
              onSectionChange={handleSectionChange}
              searchQuery={searchQuery}
            />
          </div>
        </aside>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-25 z-20 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <main className="flex-1 min-w-0">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <ActiveComponent />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DocumentationLayout;