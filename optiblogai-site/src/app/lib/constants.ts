export const SITE_CONFIG = {
  name: 'OptiBlogAi',
  description: 'Open-source AI-powered blog optimization platform',
  url: 'https://optiblogai.vercel.app',
  ogImage: '/og-image.jpg',
  links: {
    github: 'https://github.com/solve-ease/OptiBlogAi',
    docs: '/docs',
    demo: '/demo',
    community: '/community',
  },
} as const;

export const NAVIGATION_ITEMS = [
  { name: 'Home', href: '/' },
  { name: 'Documentation', href: '/docs' },
  { name: 'Demo', href: '/demo' },
  { name: 'Community', href: '/community' },
  { name: 'About', href: '/about' },
] as const;

export const COLORS = {
  primary: '#4f46e5',
  secondary: '#10b981',
  accent: '#f59e0b',
  neutral: {
    800: '#1e293b',
    50: '#f1f5f9',
  },
} as const;

export const FEATURES = [
  {
    icon: 'Zap',
    title: 'Lightning Fast',
    description: 'Generate optimized blog content in seconds with AI-powered algorithms',
  },
  {
    icon: 'Search',
    title: 'SEO Optimized',
    description: 'Built-in SEO analysis and optimization for better search rankings',
  },
  {
    icon: 'Users',
    title: 'Open Source',
    description: 'Community-driven development with transparent, collaborative approach',
  },
  {
    icon: 'Shield',
    title: 'Privacy First',
    description: 'Your data stays secure with local processing and ethical AI practices',
  },
] as const;

export const TECH_STACK = [
  { name: 'React', color: '#61DAFB' },
  { name: 'TypeScript', color: '#3178C6' },
  { name: 'Next.js', color: '#000000' },
  { name: 'Tailwind CSS', color: '#06B6D4' },
  { name: 'Node.js', color: '#339933' },
  { name: 'Python', color: '#3776AB' },
] as const;