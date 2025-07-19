"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Github,
  MapPin,
  Building,
  ExternalLink,
  Users,
  GitCommit,
  Star,
} from "lucide-react";
import { Card, CardContent } from "../ui/card";
import Button from "../ui/button";
import { useContributors, useRepositoryStats } from "@/hooks/useGitHubStats";
import type { ContributorStats } from "@/types/github";

interface TeamMember extends ContributorStats {
  role?: string;
  specialties?: string[];
}

/**
 * TeamShowcase Component - Core team with roles using real GitHub data
 * Displays contributors and their roles with interactive profiles
 */
const TeamShowcase: React.FC = () => {
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const { contributors, loading, error } = useContributors();
  const { stats } = useRepositoryStats();

  // Enhanced team data with roles and specialties
  const enhanceContributorData = (
    contributor: ContributorStats,
  ): TeamMember => {
    const roles: { [key: string]: { role: string; specialties: string[] } } = {
      "4darsh-Dev": {
        role: "Founder & Lead Developer",
        specialties: [
          "Full Stack Development",
          "AI Integration",
          "System Architecture",
          "Open Source Leadership",
        ],
      },
      "solve-ease": {
        role: "Organization & Product Strategy",
        specialties: [
          "Product Management",
          "Community Building",
          "Strategic Planning",
          "Open Source Advocacy",
        ],
      },
    };

    const memberData = roles[contributor.login] || {
      role: "Contributor",
      specialties: ["Development", "Open Source"],
    };

    return {
      ...contributor,
      ...memberData,
    };
  };

  const teamMembers = contributors.map(enhanceContributorData);
  const selectedTeamMember = selectedMember
    ? teamMembers.find((member) => member.login === selectedMember)
    : null;

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-96 mx-auto mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-gray-100 rounded-lg h-80"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/3 right-10 w-32 h-32 bg-secondary/10 rounded-full blur-xl"
          animate={{
            x: [0, -30, 0],
            y: [0, 20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 left-20 w-24 h-24 bg-accent/8 rounded-full blur-lg"
          animate={{
            x: [0, 40, 0],
            y: [0, -25, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3,
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
            Meet Our Team
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Passionate developers and creators building the future of AI-powered
            content optimization. Our team combines technical expertise with a
            deep understanding of content creation.
          </p>

          {/* Team Stats */}
          {stats && (
            <div className="flex justify-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>{contributors.length} Active Contributors</span>
              </div>
              <div className="flex items-center space-x-2">
                <GitCommit className="w-4 h-4" />
                <span>
                  {contributors.reduce((sum, c) => sum + c.commits, 0)} Total
                  Commits
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4" />
                <span>{stats.stars} GitHub Stars</span>
              </div>
            </div>
          )}
        </motion.div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.login}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card
                className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group"
                onClick={() => setSelectedMember(member.login)}
              >
                <CardContent className="p-6 text-center">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                    className="relative mb-4"
                  >
                    <img
                      src={member.avatar_url}
                      alt={member.name || member.login}
                      className="w-20 h-20 rounded-full mx-auto border-4 border-gray-100 group-hover:border-primary/20 transition-colors duration-300"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-primary text-white rounded-full p-1">
                      <Github className="w-4 h-4" />
                    </div>
                  </motion.div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {member.name || member.login}
                  </h3>

                  <p className="text-primary font-medium mb-2">{member.role}</p>

                  {member.bio && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {member.bio}
                    </p>
                  )}

                  <div className="flex items-center justify-center space-x-4 text-sm text-gray-500 mb-4">
                    {member.location && (
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3" />
                        <span>{member.location}</span>
                      </div>
                    )}
                    {member.company && (
                      <div className="flex items-center space-x-1">
                        <Building className="w-3 h-3" />
                        <span>{member.company}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-center space-x-4 text-sm">
                    <div className="text-center">
                      <div className="font-semibold text-primary">
                        {member.contributions}
                      </div>
                      <div className="text-gray-500">Contributions</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-secondary">
                        {member.commits}
                      </div>
                      <div className="text-gray-500">Commits</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Selected Member Modal */}
        <AnimatePresence>
          {selectedTeamMember && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
              onClick={() => setSelectedMember(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-start space-x-6 mb-6">
                  <img
                    src={selectedTeamMember.avatar_url}
                    alt={selectedTeamMember.name || selectedTeamMember.login}
                    className="w-24 h-24 rounded-full border-4 border-gray-100"
                  />
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {selectedTeamMember.name || selectedTeamMember.login}
                    </h3>
                    <p className="text-primary font-medium text-lg mb-2">
                      {selectedTeamMember.role}
                    </p>
                    {selectedTeamMember.bio && (
                      <p className="text-gray-600 mb-4">
                        {selectedTeamMember.bio}
                      </p>
                    )}

                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                      {selectedTeamMember.location && (
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{selectedTeamMember.location}</span>
                        </div>
                      )}
                      {selectedTeamMember.company && (
                        <div className="flex items-center space-x-1">
                          <Building className="w-4 h-4" />
                          <span>{selectedTeamMember.company}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {selectedTeamMember.specialties && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">
                      Specialties
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedTeamMember.specialties.map(
                        (specialty, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                          >
                            {specialty}
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {selectedTeamMember.contributions}
                    </div>
                    <div className="text-gray-500 text-sm">Contributions</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-secondary">
                      {selectedTeamMember.commits}
                    </div>
                    <div className="text-gray-500 text-sm">Commits</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-accent">
                      {Math.round(selectedTeamMember.additions / 1000)}K+
                    </div>
                    <div className="text-gray-500 text-sm">Lines Added</div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedMember(null)}
                  >
                    Close
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() =>
                      window.open(selectedTeamMember.html_url, "_blank")
                    }
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View GitHub Profile
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Join Our Team CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Card className="max-w-4xl mx-auto bg-gradient-to-r from-[var(--color-primary)]/5 to-[var(--color-secondary)]/5 border-0">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Want to Join Our Team?
              </h3>
              <p className="text-lg text-gray-700 mb-6">
                We&apos;re always looking for passionate developers, designers,
                and content creators who share our vision of ethical AI and
                open-source collaboration.
              </p>
              <div className="flex justify-center space-x-4">
                <Button variant="outline">View Open Issues</Button>
                <Button variant="primary">
                  <Github className="w-4 h-4 mr-2" />
                  Contribute on GitHub
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default TeamShowcase;
