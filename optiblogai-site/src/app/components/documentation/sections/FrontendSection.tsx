"use client";

import React from "react";
import { Code, Globe, Settings, Palette, Smartphone, Zap } from "lucide-react";
import MermaidDiagram from "../MermaidDiagram";

const FrontendSection: React.FC = () => {
  const frontendArchitecture = `
    graph TB
        subgraph "Pages (App Router)"
            Home[/ - Homepage]
            Docs[/docs - Documentation]
            Demo[/demo - Live Demo]
            Community[/community - Community]
            About[/about - About]
        end
        
        subgraph "Shared Components"
            Header[Header & Navigation]
            Footer[Footer]
            Layout[Layout Components]
        end
        
        subgraph "Feature Components"
            Hero[Hero Section]
            Stats[GitHub Stats]
            DocNav[Documentation Navigation]
            DemoUI[Demo Interface]
        end
        
        subgraph "UI Components"
            Button[Button]
            Card[Card]
            Badge[Badge]
        end
        
        subgraph "Hooks & Utils"
            useGitHub[useGitHubStats]
            useTheme[useTheme]
            Utils[Utility Functions]
        end
        
        Home --> Hero
        Home --> Stats
        Docs --> DocNav
        Demo --> DemoUI
        
        Hero --> Button
        Stats --> Card
        DocNav --> Button
        
        Header --> useGitHub
        Stats --> useGitHub
        
        style Home fill:#4f46e5,stroke:#312e81,stroke-width:2px,color:#ffffff
        style Docs fill:#10b981,stroke:#047857,stroke-width:2px,color:#ffffff
        style Demo fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#ffffff
        style Button fill:#8b5cf6,stroke:#7c3aed,stroke-width:2px,color:#ffffff
  `;

  const componentStructure = `
    graph LR
        subgraph "Component Hierarchy"
            App[App Layout]
            Page[Page Component]
            Section[Section Components]
            UI[UI Components]
            
            App --> Page
            Page --> Section
            Section --> UI
        end
        
        subgraph "State Management"
            LocalState[Local State]
            Hooks[Custom Hooks]
            Context[React Context]
        end
        
        Section --> Hooks
        Hooks --> LocalState
        UI --> Context
        
        style App fill:#4f46e5,stroke:#312e81,stroke-width:2px,color:#ffffff
        style Hooks fill:#10b981,stroke:#047857,stroke-width:2px,color:#ffffff
        style UI fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#ffffff
  `;

  return (
    <div className="prose prose-indigo max-w-none">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">Frontend Guide</h1>
      
      <p className="text-lg text-gray-700 mb-8">
        The OptiBlogAi frontend is built with Next.js 15, TypeScript, and Tailwind CSS, 
        providing a modern, responsive, and accessible user interface for interacting with the AI-powered content generation system.
      </p>

      {/* Technology Stack */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Technology Stack</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-indigo-50 rounded-lg p-6">
            <div className="flex items-center mb-3">
              <Code className="h-6 w-6 text-indigo-600 mr-2" />
              <h3 className="text-lg font-semibold text-indigo-900">Core Framework</h3>
            </div>
            <ul className="space-y-2 text-sm text-indigo-800">
              <li>• <strong>Next.js 15</strong> - App Router with React Server Components</li>
              <li>• <strong>TypeScript</strong> - Type-safe development</li>
              <li>• <strong>React 19</strong> - Latest React features</li>
            </ul>
          </div>

          <div className="bg-emerald-50 rounded-lg p-6">
            <div className="flex items-center mb-3">
              <Palette className="h-6 w-6 text-emerald-600 mr-2" />
              <h3 className="text-lg font-semibold text-emerald-900">Styling & UI</h3>
            </div>
            <ul className="space-y-2 text-sm text-emerald-800">
              <li>• <strong>Tailwind CSS</strong> - Utility-first styling</li>
              <li>• <strong>Framer Motion</strong> - Smooth animations</li>
              <li>• <strong>Lucide React</strong> - Modern icon library</li>
            </ul>
          </div>

          <div className="bg-amber-50 rounded-lg p-6">
            <div className="flex items-center mb-3">
              <Settings className="h-6 w-6 text-amber-600 mr-2" />
              <h3 className="text-lg font-semibold text-amber-900">Build & Dev</h3>
            </div>
            <ul className="space-y-2 text-sm text-amber-800">
              <li>• <strong>ESLint</strong> - Code linting</li>
              <li>• <strong>Prettier</strong> - Code formatting</li>
              <li>• <strong>PostCSS</strong> - CSS processing</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Frontend Architecture */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Frontend Architecture</h2>
        <p className="text-gray-700 mb-6">
          The frontend follows Next.js App Router conventions with a clear separation between 
          pages, components, and utilities. The architecture emphasizes reusability, maintainability, and performance.
        </p>
        
        <MermaidDiagram 
          chart={frontendArchitecture}
          id="frontend-architecture"
          className="mb-8"
        />

        {/* Directory Structure */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Directory Structure</h3>
          <div className="bg-white rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm text-gray-800">
{`src/
├── app/                          # Next.js App Router
│   ├── components/              # Component library
│   │   ├── ui/                 # Base UI components
│   │   ├── layout/             # Layout components
│   │   ├── homepage/           # Homepage sections
│   │   ├── documentation/      # Documentation components
│   │   ├── demo/               # Demo interface
│   │   └── community/          # Community features
│   ├── lib/                    # Utility functions
│   ├── hooks/                  # Custom React hooks
│   ├── types/                  # TypeScript definitions
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Homepage
│   ├── globals.css             # Global styles
│   ├── docs/                   # Documentation pages
│   ├── demo/                   # Demo pages
│   └── api/                    # API routes
├── public/                     # Static assets
└── tailwind.config.js          # Tailwind configuration`}
            </pre>
          </div>
        </div>
      </section>

      {/* Component Architecture */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Component Architecture</h2>
        <p className="text-gray-700 mb-6">
          Components are organized hierarchically with clear separation of concerns. 
          Each component is self-contained, typed, and follows React best practices.
        </p>

        <MermaidDiagram 
          chart={componentStructure}
          id="component-structure"
          className="mb-8"
        />

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Code className="h-5 w-5 mr-2 text-indigo-600" />
              Component Categories
            </h3>
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-medium text-indigo-900">UI Components</h4>
                <p className="text-gray-600">Reusable base components (Button, Card, Badge, etc.)</p>
              </div>
              <div>
                <h4 className="font-medium text-emerald-900">Layout Components</h4>
                <p className="text-gray-600">Header, Footer, Navigation, and page structure</p>
              </div>
              <div>
                <h4 className="font-medium text-amber-900">Feature Components</h4>
                <p className="text-gray-600">Page-specific components with business logic</p>
              </div>
              <div>
                <h4 className="font-medium text-purple-900">Composite Components</h4>
                <p className="text-gray-600">Complex components combining multiple features</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Settings className="h-5 w-5 mr-2 text-emerald-600" />
              Design Patterns
            </h3>
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-medium text-indigo-900">Composition over Inheritance</h4>
                <p className="text-gray-600">Components compose smaller parts rather than extend classes</p>
              </div>
              <div>
                <h4 className="font-medium text-emerald-900">Props-driven Configuration</h4>
                <p className="text-gray-600">Components configured through TypeScript props</p>
              </div>
              <div>
                <h4 className="font-medium text-amber-900">Custom Hooks</h4>
                <p className="text-gray-600">Logic extraction into reusable custom hooks</p>
              </div>
              <div>
                <h4 className="font-medium text-purple-900">Conditional Rendering</h4>
                <p className="text-gray-600">Smart components with state-based UI updates</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Key Frontend Features</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-indigo-50 rounded-lg p-6">
              <div className="flex items-center mb-3">
                <Smartphone className="h-6 w-6 text-indigo-600 mr-2" />
                <h3 className="text-lg font-semibold text-indigo-900">Responsive Design</h3>
              </div>
              <p className="text-indigo-800 text-sm mb-4">
                Fully responsive design that works seamlessly across desktop, tablet, and mobile devices.
              </p>
              <div className="space-y-2 text-sm text-indigo-700">
                <div>• Mobile-first Tailwind CSS approach</div>
                <div>• Flexible grid and flexbox layouts</div>
                <div>• Touch-friendly interactive elements</div>
                <div>• Optimized for various screen sizes</div>
              </div>
            </div>

            <div className="bg-emerald-50 rounded-lg p-6">
              <div className="flex items-center mb-3">
                <Zap className="h-6 w-6 text-emerald-600 mr-2" />
                <h3 className="text-lg font-semibold text-emerald-900">Performance Optimized</h3>
              </div>
              <p className="text-emerald-800 text-sm mb-4">
                Built for speed with Next.js optimization features and best practices.
              </p>
              <div className="space-y-2 text-sm text-emerald-700">
                <div>• Server-side rendering (SSR) and static generation</div>
                <div>• Image optimization with next/image</div>
                <div>• Code splitting and lazy loading</div>
                <div>• Efficient bundle size management</div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-amber-50 rounded-lg p-6">
              <div className="flex items-center mb-3">
                <Globe className="h-6 w-6 text-amber-600 mr-2" />
                <h3 className="text-lg font-semibold text-amber-900">SEO Optimized</h3>
              </div>
              <p className="text-amber-800 text-sm mb-4">
                Built with SEO best practices for maximum search engine visibility.
              </p>
              <div className="space-y-2 text-sm text-amber-700">
                <div>• Semantic HTML structure</div>
                <div>• Meta tags and Open Graph support</div>
                <div>• Structured data implementation</div>
                <div>• Fast loading and Core Web Vitals optimization</div>
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-6">
              <div className="flex items-center mb-3">
                <Settings className="h-6 w-6 text-purple-600 mr-2" />
                <h3 className="text-lg font-semibold text-purple-900">Developer Experience</h3>
              </div>
              <p className="text-purple-800 text-sm mb-4">
                Optimized development workflow with modern tooling and practices.
              </p>
              <div className="space-y-2 text-sm text-purple-700">
                <div>• TypeScript for type safety</div>
                <div>• ESLint and Prettier for code quality</div>
                <div>• Hot reloading with Next.js dev server</div>
                <div>• Component documentation and examples</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Setup and Development */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Setup and Development</h2>
        
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Start</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">1. Clone the Repository</h4>
              <div className="bg-white rounded border p-3 font-mono text-sm text-gray-800 overflow-x-auto">
                git clone https://github.com/solve-ease/OptiBlogAi.git<br/>
                cd OptiBlogAi/optiblogai-site
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">2. Install Dependencies</h4>
              <div className="bg-white rounded border p-3 font-mono text-sm text-gray-800 overflow-x-auto">
                npm install
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">3. Start Development Server</h4>
              <div className="bg-white rounded border p-3 font-mono text-sm text-gray-800 overflow-x-auto">
                npm run dev
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">4. Build for Production</h4>
              <div className="bg-white rounded border p-3 font-mono text-sm text-gray-800 overflow-x-auto">
                npm run build<br/>
                npm start
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Scripts</h3>
            <div className="space-y-3 text-sm">
              <div>
                <code className="bg-gray-100 px-2 py-1 rounded text-indigo-600">npm run dev</code>
                <p className="text-gray-600 mt-1">Start development server with hot reload</p>
              </div>
              <div>
                <code className="bg-gray-100 px-2 py-1 rounded text-emerald-600">npm run build</code>
                <p className="text-gray-600 mt-1">Build optimized production bundle</p>
              </div>
              <div>
                <code className="bg-gray-100 px-2 py-1 rounded text-amber-600">npm start</code>
                <p className="text-gray-600 mt-1">Start production server</p>
              </div>
              <div>
                <code className="bg-gray-100 px-2 py-1 rounded text-purple-600">npm run lint</code>
                <p className="text-gray-600 mt-1">Run ESLint for code quality checks</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Environment Setup</h3>
            <div className="space-y-3 text-sm">
              <div>
                <h4 className="font-medium text-gray-900">Node.js Version</h4>
                <p className="text-gray-600">Node.js 18+ recommended for optimal performance</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Package Manager</h4>
                <p className="text-gray-600">npm, yarn, or pnpm - all are supported</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Development Tools</h4>
                <p className="text-gray-600">VS Code with TypeScript and Tailwind extensions</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customization Guide */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Customization Guide</h2>
        
        <div className="space-y-6">
          <div className="bg-indigo-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-indigo-900 mb-3">Color Palette Customization</h3>
            <p className="text-indigo-800 text-sm mb-4">
              The design system uses a consistent color palette that can be customized in the Tailwind configuration.
            </p>
            <div className="bg-white rounded border p-4 font-mono text-sm text-gray-800 overflow-x-auto">
{`// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#4f46e5',    // Indigo
        secondary: '#10b981',  // Emerald  
        accent: '#f59e0b',     // Amber
      }
    }
  }
}`}
            </div>
          </div>

          <div className="bg-emerald-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-emerald-900 mb-3">Adding New Components</h3>
            <p className="text-emerald-800 text-sm mb-4">
              Create new components following the established patterns and conventions.
            </p>
            <div className="bg-white rounded border p-4 font-mono text-sm text-gray-800 overflow-x-auto">
{`// components/ui/NewComponent.tsx
interface NewComponentProps {
  title: string;
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

const NewComponent: React.FC<NewComponentProps> = ({ 
  title, 
  variant = 'primary', 
  children 
}) => {
  return (
    <div className="p-4 rounded-lg">
      <h3 className="text-lg font-semibold">{title}</h3>
      {children}
    </div>
  );
};`}
            </div>
          </div>

          <div className="bg-amber-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-amber-900 mb-3">Custom Hooks</h3>
            <p className="text-amber-800 text-sm mb-4">
              Extract component logic into reusable custom hooks for better maintainability.
            </p>
            <div className="bg-white rounded border p-4 font-mono text-sm text-gray-800 overflow-x-auto">
{`// hooks/useLocalStorage.ts
export const useLocalStorage = <T>(
  key: string, 
  initialValue: T
) => {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function 
        ? value(storedValue) 
        : value;
      setStoredValue(valueToStore);
      localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };
  
  return [storedValue, setValue] as const;
};`}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FrontendSection;