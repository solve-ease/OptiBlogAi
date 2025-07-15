import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import { SITE_CONFIG } from './lib/constants';
import Script from 'next/script';

// Font configurations
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
});

// Viewport configuration
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#4f46e5' },
    { media: '(prefers-color-scheme: dark)', color: '#4f46e5' },
  ],
  colorScheme: 'light dark',
};

// SEO Metadata
export const metadata: Metadata = {
  // Basic metadata
  title: {
    template: '%s | OptiBlogAi - AI-Powered Blog Optimization',
    default: 'OptiBlogAi - AI-Powered Blog Optimization Platform',
  },
  description: 'Open-source AI platform for creating, optimizing, and scaling your content strategy. Generate SEO-optimized blog posts in seconds with advanced AI algorithms.',
  
  // Keywords for SEO
  keywords: [
    'AI blog generator',
    'SEO optimization',
    'content creation',
    'blog automation',
    'open source AI',
    'content marketing',
    'blog writing tool',
    'AI writing assistant',
    'SEO content generator',
    'blog optimization',
    'content strategy',
    'automated blogging',
  ],

  // Author and creator info
  authors: [
    {
      name: 'Adarsh Maurya',
      url: 'https://github.com/4darsh-Dev',
    },
  ],
  creator: 'Adarsh Maurya',
  publisher: 'Adarsh Maurya',

  // Robots and indexing
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Open Graph metadata for social sharing
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_CONFIG.url,
    siteName: 'OptiBlogAi',
    title: 'OptiBlogAi - AI-Powered Blog Optimization Platform',
    description: 'Open-source AI platform for creating, optimizing, and scaling your content strategy. Generate SEO-optimized blog posts in seconds.',
    images: [
      {
        url: `${SITE_CONFIG.url}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'OptiBlogAi - AI-Powered Blog Optimization Platform',
        type: 'image/png',
      },
      {
        url: `${SITE_CONFIG.url}/og-image.png`,
        width: 1200,
        height: 1200,
        alt: 'OptiBlogAi Logo',
        type: 'image/png',
      },
    ],
  },

  // Twitter Card metadata
  twitter: {
    card: 'summary_large_image',
    site: '@solve__ease',
    creator: '@solve__ease',
    title: 'OptiBlogAi - AI-Powered Blog Optimization Platform',
    description: 'Open-source AI platform for creating, optimizing, and scaling your content strategy. Generate SEO-optimized blog posts in seconds.',
    images: [`${SITE_CONFIG.url}/og-image.png`],
  },

  // Additional metadata
  applicationName: 'OptiBlogAi',
  referrer: 'origin-when-cross-origin',
  category: 'Technology',
  classification: 'AI Tools, Content Creation, SEO',

  // Verification for search engines
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
    other: {
      'msvalidate.01': 'your-bing-verification-code',
    },
  },

  // Alternate languages (if applicable)
  alternates: {
    canonical: SITE_CONFIG.url,
    languages: {
      'en-US': SITE_CONFIG.url,
      'x-default': SITE_CONFIG.url,
    },
  },

  // App-specific metadata
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'OptiBlogAi',
  },

  // Manifest for PWA
  manifest: '/manifest.json',

  // Icons
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
        color: '#4f46e5',
      },
    ],
  },

  // Additional meta tags
  other: {
    'theme-color': '#4f46e5',
    'msapplication-TileColor': '#4f46e5',
    'msapplication-config': '/browserconfig.xml',
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html 
      lang="en" 
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://api.github.com" />
        
        {/* DNS prefetch for better performance */}
        <link rel="dns-prefetch" href="//github.com" />
        <link rel="dns-prefetch" href="//raw.githubusercontent.com" />
        
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'WebSite',
                  '@id': `${SITE_CONFIG.url}/#website`,
                  url: SITE_CONFIG.url,
                  name: 'OptiBlogAi',
                  description: 'AI-Powered Blog Optimization Platform',
                  publisher: {
                    '@id': `${SITE_CONFIG.url}/#organization`,
                  },
                  potentialAction: [
                    {
                      '@type': 'SearchAction',
                      target: {
                        '@type': 'EntryPoint',
                        urlTemplate: `${SITE_CONFIG.url}/search?q={search_term_string}`,
                      },
                      'query-input': 'required name=search_term_string',
                    },
                  ],
                },
                {
                  '@type': 'Organization',
                  '@id': `${SITE_CONFIG.url}/#organization`,
                  name: 'OptiBlogAi',
                  url: SITE_CONFIG.url,
                  logo: {
                    '@type': 'ImageObject',
                    inLanguage: 'en-US',
                    '@id': `${SITE_CONFIG.url}/#/schema/logo/image/`,
                    url: `${SITE_CONFIG.url}/logo-512x512.png`,
                    contentUrl: `${SITE_CONFIG.url}/logo-512x512.png`,
                    width: 512,
                    height: 512,
                    caption: 'OptiBlogAi',
                  },
                  image: {
                    '@id': `${SITE_CONFIG.url}/#/schema/logo/image/`,
                  },
                  sameAs: [
                    SITE_CONFIG.links.github,
                    'https://x.com/solve__ease',
                    'https://linkedin.com/company/solve-ease',
                  ],
                },
                {
                  '@type': 'SoftwareApplication',
                  name: 'OptiBlogAi',
                  operatingSystem: 'Web Browser, Node.js',
                  applicationCategory: 'BusinessApplication',
                  aggregateRating: {
                    '@type': 'AggregateRating',
                    ratingValue: '4.8',
                    reviewCount: '127',
                  },
                  offers: {
                    '@type': 'Offer',
                    price: '0',
                    priceCurrency: 'USD',
                    availability: 'https://schema.org/InStock',
                  },
                },
              ],
            }),
          }}
        />

        {/* Additional SEO meta tags */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        
        {/* Security headers */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        
        {/* Performance hints */}
        <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body 
        className="font-sans antialiased bg-white text-gray-900 min-h-screen flex flex-col"
        suppressHydrationWarning
      >
        {/* Global site tag (gtag.js) - Google Analytics */}
        {/* gtag.js - Google Analytics */}
        <Script
          strategy='afterInteractive'
          src='https://www.googletagmanager.com/gtag/js?id=G-V4L0VFK5BF'
        />
        <Script id='gtag-init' strategy='afterInteractive'>
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-V4L0VFK5BF', { page_path: window.location.pathname });
          `}
        </Script>
        


        {/* Skip to main content for accessibility */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-white px-4 py-2 rounded-md z-50"
        >
          Skip to main content
        </a>

        {/* Header */}
        <Header />

        {/* Main Content */}
        <main id="main-content" className="flex-1">
          {children}
        </main>

        {/* Footer */}
        <Footer />

      </body>
    </html>
  );
}