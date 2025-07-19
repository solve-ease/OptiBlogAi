/**
 * About Page Component Types
 * Types specific to the About page components for better type safety
 */

// Ethical Principles Component Types
export interface EthicalPrinciple {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  details: string[];
  color: 'primary' | 'secondary' | 'accent';
}

// Team Showcase Component Types
export interface TeamMember {
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
  additions: number;
  deletions: number;
  commits: number;
  name?: string;
  bio?: string;
  company?: string;
  location?: string;
  role?: string;
  specialties?: string[];
}

// Adoption Map Component Types
export interface UsageData {
  region: string;
  country: string;
  users: number;
  growth: number;
  coordinates: { x: number; y: number };
  color: 'primary' | 'secondary' | 'accent';
}

export interface RegionalData {
  region: string;
  totalUsers: number;
  averageGrowth: number;
  countries: string[];
}

// Press Kit Component Types
export interface MediaAsset {
  id: string;
  name: string;
  description: string;
  type: 'logo' | 'screenshot' | 'icon' | 'banner';
  format: string;
  size: string;
  url: string;
  downloadUrl: string;
}

export interface ColorPalette {
  name: string;
  hex: string;
  rgb: string;
  usage: string;
}

export interface BrandGuideline {
  title: string;
  description: string;
  examples: string[];
}

// Animation and Interaction Types
export interface AnimationConfig {
  duration: number;
  delay?: number;
  ease?: string;
  repeat?: number;
}

export interface InteractiveElementState {
  isHovered: boolean;
  isSelected: boolean;
  isAnimating: boolean;
}

// Component Props Types
export interface AboutPageSectionProps {
  className?: string;
  children?: React.ReactNode;
}

export interface DynamicShapeProps {
  size: number;
  color: string;
  position: { x: number; y: number };
  animation: AnimationConfig;
  blur?: number;
}

// Data Fetching Types
export interface AboutPageData {
  teamMembers: TeamMember[];
  usageStats: UsageData[];
  mediaAssets: MediaAsset[];
  lastUpdated: string;
}

export interface AboutPageError {
  component: string;
  message: string;
  timestamp: string;
}

// Common utility types for About page
export type ColorTheme = 'primary' | 'secondary' | 'accent' | 'neutral';
export type AnimationState = 'idle' | 'running' | 'paused' | 'completed';
export type LoadingState = 'loading' | 'success' | 'error' | 'idle';
export type ModalState = 'open' | 'closed' | 'opening' | 'closing';

// Event handler types
export interface AboutPageEventHandlers {
  onPrincipleClick?: (principleId: string) => void;
  onTeamMemberClick?: (memberLogin: string) => void;
  onRegionClick?: (regionName: string) => void;
  onAssetDownload?: (assetId: string) => void;
  onColorCopy?: (colorValue: string) => void;
}

// Form and interaction types
export interface ContactFormData {
  name: string;
  email: string;
  organization?: string;
  message: string;
  requestType: 'press' | 'partnership' | 'general';
}

export interface DownloadRequest {
  assetId: string;
  assetType: MediaAsset['type'];
  userAgent?: string;
  timestamp: string;
}