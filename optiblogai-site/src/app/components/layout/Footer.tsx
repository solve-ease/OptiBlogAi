"use client";

import React from "react";
import { Github, Twitter, Linkedin, Mail, Heart } from "lucide-react";
import { SITE_CONFIG, NAVIGATION_ITEMS } from "@/app/lib/constants";
import Image from "next/image";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: "GitHub",
      href: SITE_CONFIG.links.github,
      icon: <Github className="w-5 h-5" />,
    },
    {
      name: "Twitter",
      href: "https://x.com/solve__ease",
      icon: <Twitter className="w-5 h-5" />,
    },
    {
      name: "LinkedIn",
      href: "https://linkedin.com/company/solve-ease",
      icon: <Linkedin className="w-5 h-5" />,
    },
    {
      name: "Email",
      href: "mailto:adarsh@solveease.tech",
      icon: <Mail className="w-5 h-5" />,
    },
  ];

  const footerSections = [
    {
      title: "Product",
      links: [
        { name: "Features", href: "/#features" },
        { name: "Documentation", href: "/docs" },
        { name: "Demo", href: "/demo" },
        { name: "Pricing", href: "/pricing" },
      ],
    },
    {
      title: "Community",
      links: [
        { name: "GitHub", href: SITE_CONFIG.links.github },
        { name: "Discussions", href: `${SITE_CONFIG.links.github}/discussions` },
        { name: "Contributing", href: `${SITE_CONFIG.links.github}/blob/main/CONTRIBUTING.md` },
        { name: "Code of Conduct", href: `${SITE_CONFIG.links.github}/blob/main/CODE_OF_CONDUCT.md` },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Blog", href: "#", comingSoon: true },
        { name: "Changelog", href: "#", comingSoon: true },
        { name: "Roadmap", href: "#", comingSoon: true },
        { name: "API Reference", href: "#", comingSoon: true },
      ],
    },
    {
      title: "Support",
      links: [
        { name: "Help Center", href: "#", comingSoon: true },
        { name: "Contact", href: "#", comingSoon: true },
        { name: "Status", href: "#", comingSoon: true },
        { name: "Security", href: "#", comingSoon: true },
      ],
    },
  ];

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            {/* Brand Section */}
            <div className="col-span-1 md:col-span-2 lg:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <a href="/" className="flex items-center ">
                  <Image alt="logo" width={40} height={40} src="/logo.png" />
                  <span className="text-xl font-bold text-gray-900">
                    {SITE_CONFIG.name}
                  </span>
                </a>
              </div>
              <p className="text-gray-600 mb-6 max-w-md">
                Open-source AI-powered blog optimization platform that helps you
                create better content faster.
              </p>
              <div className="flex space-x-4">
                {socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-primary transition-colors duration-200"
                    aria-label={link.name}
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Footer Links */}
            {footerSections.map((section) => (
              <div key={section.title} className="col-span-1">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.name} className="relative group">
                      <a
                        href={link.href}
                        className="text-gray-600 hover:text-primary transition-colors duration-200"
                      >
                        {link.name}
                      </a>
                      {link.comingSoon && (
                        <span className="absolute left-1/2 -translate-x-1/2 mt-1 top-full opacity-0 group-hover:opacity-100 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap transition-opacity duration-200">
                          Coming Soon
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="py-6 border-t border-gray-200">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-1 text-sm text-gray-600 mb-4 md:mb-0">
              <span>
                © {currentYear} {SITE_CONFIG.name}. Made with
              </span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>
                by the{" "}
                <a
                  className="font-bold hover:text-[var(--color-primary)] hover:underline"
                  href="https://solveease.tech"
                >
                  solve-ease
                </a>
                .
              </span>
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <a
               href="/privacy" 
               className="hover:text-primary transition-colors duration-200"
               >
                Privacy Policy
              </a>
              <a 
                href="/terms"
                className="hover:text-primary transition-colors duration-200"
              >
                Terms of Service
              </a>
              <a
               href="/license"
               className="hover:text-primary transition-colors duration-200"
              >
                MIT License
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
