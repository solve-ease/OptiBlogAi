"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, MessageCircle, GitBranch, Shield, User, CheckCircle, Clock, Edit3 } from "lucide-react";

const TeamCollaborationPreview: React.FC = () => {
  const [activeUsers, setActiveUsers] = useState<string[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [currentActivity, setCurrentActivity] = useState(0);

  const teamMembers = [
    { id: 1, name: "Sarah Chen", role: "Editor", avatar: "SC", color: "bg-purple-500", status: "online" },
    { id: 2, name: "Mike Johnson", role: "Writer", avatar: "MJ", color: "bg-pink-500", status: "editing" },
    { id: 3, name: "Emma Wilson", role: "Designer", avatar: "EW", color: "bg-purple-400", status: "reviewing" },
    { id: 4, name: "David Kim", role: "Manager", avatar: "DK", color: "bg-pink-400", status: "online" },
  ];

  const activities = [
    { user: "Sarah Chen", action: "commented on", target: "paragraph 3", time: "2 min ago", icon: MessageCircle },
    { user: "Mike Johnson", action: "edited", target: "introduction", time: "5 min ago", icon: Edit3 },
    { user: "Emma Wilson", action: "approved", target: "design review", time: "8 min ago", icon: CheckCircle },
    { user: "David Kim", action: "created branch", target: "feature/seo-update", time: "12 min ago", icon: GitBranch },
  ];

  const permissions = [
    { role: "Editor", permissions: ["Read", "Write", "Comment", "Approve"], color: "bg-purple-500" },
    { role: "Writer", permissions: ["Read", "Write", "Comment"], color: "bg-pink-500" },
    { role: "Reviewer", permissions: ["Read", "Comment"], color: "bg-purple-400" },
    { role: "Manager", permissions: ["Read", "Write", "Comment", "Approve", "Admin"], color: "bg-pink-400" },
  ];

  useEffect(() => {
    // Simulate users coming online
    const timer1 = setTimeout(() => {
      setActiveUsers(["Sarah Chen", "Mike Johnson"]);
    }, 1000);

    const timer2 = setTimeout(() => {
      setActiveUsers(prev => [...prev, "Emma Wilson"]);
    }, 2000);

    const timer3 = setTimeout(() => {
      setActiveUsers(prev => [...prev, "David Kim"]);
    }, 3000);

    // Simulate comments appearing
    const timer4 = setTimeout(() => {
      setComments([
        { id: 1, user: "Sarah Chen", text: "Great work on the intro!", time: "now", avatar: "SC" },
        { id: 2, user: "Mike Johnson", text: "Should we add more examples?", time: "2m", avatar: "MJ" },
      ]);
    }, 2500);

    // Cycle through activities
    const activityTimer = setInterval(() => {
      setCurrentActivity(prev => (prev + 1) % activities.length);
    }, 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearInterval(activityTimer);
    };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-green-500";
      case "editing": return "bg-blue-500";
      case "reviewing": return "bg-yellow-500";
      default: return "bg-gray-400";
    }
  };

  return (
    <div className="relative w-full h-[400px] bg-gradient-to-br from-purple-50 to-white border border-gray-200 rounded-2xl overflow-hidden shadow-lg">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-pink-400/20 to-purple-400/20 rounded-full blur-xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>

      {/* Header */}
      <div className="relative z-10 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <motion.div
              className="w-3 h-3 bg-red-500 rounded-full"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <div className="w-3 h-3 bg-yellow-500 rounded-full" />
            <div className="w-3 h-3 bg-green-500 rounded-full" />
          </div>
          <motion.div
            className="flex items-center space-x-2 text-xs font-medium text-gray-600"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Users className="w-4 h-4 text-purple-500" />
            <span>Team Workspace</span>
          </motion.div>
        </div>

        {/* Active Users */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-gray-100 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-800">Active Now</h3>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-green-600 font-medium">{activeUsers.length} online</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.id}
                className="relative"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ 
                  opacity: activeUsers.includes(member.name) ? 1 : 0.3,
                  scale: activeUsers.includes(member.name) ? 1 : 0.8
                }}
                transition={{ delay: index * 0.3 }}
              >
                <div className={`w-8 h-8 ${member.color} rounded-full flex items-center justify-center text-white text-xs font-bold`}>
                  {member.avatar}
                </div>
                <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(member.status)} rounded-full border-2 border-white`} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Real-time Activity */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-gray-100 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-800">Recent Activity</h3>
            <Clock className="w-4 h-4 text-gray-400" />
          </div>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentActivity}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex items-center space-x-3 p-2 rounded-lg bg-purple-50 border border-purple-100"
            >
             {(() => {
                const IconComponent = activities[currentActivity].icon;
                return <IconComponent className="w-4 h-4 text-purple-600" />;
              })()}
              <div className="flex-1 min-w-0">
                <div className="text-sm text-gray-800">
                  <span className="font-medium">{activities[currentActivity].user}</span>
                  <span className="text-gray-600"> {activities[currentActivity].action} </span>
                  <span className="font-medium">{activities[currentActivity].target}</span>
                </div>
                <div className="text-xs text-gray-500">{activities[currentActivity].time}</div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Comments & Version Control */}
        <div className="grid grid-cols-2 gap-3">
          {/* Comments */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-2 mb-2">
              <MessageCircle className="w-4 h-4 text-purple-500" />
              <span className="text-xs font-semibold text-gray-800">Comments</span>
            </div>
            <div className="space-y-2">
              {comments.map((comment, index) => (
                <motion.div
                  key={comment.id}
                  className="flex items-start space-x-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                >
                  <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {comment.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-gray-800">{comment.text}</div>
                    <div className="text-xs text-gray-500">{comment.time}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Version Control */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-2 mb-2">
              <GitBranch className="w-4 h-4 text-pink-500" />
              <span className="text-xs font-semibold text-gray-800">Versions</span>
            </div>
            <div className="space-y-1">
              <motion.div
                className="flex items-center justify-between p-2 rounded bg-pink-50 border border-pink-100"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 }}
              >
                <span className="text-xs text-pink-700 font-medium">v2.1</span>
                <span className="text-xs text-gray-500">current</span>
              </motion.div>
              <motion.div
                className="flex items-center justify-between p-2 rounded bg-gray-50"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.1 }}
              >
                <span className="text-xs text-gray-600">v2.0</span>
                <span className="text-xs text-gray-500">1h ago</span>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Collaboration Indicator */}
      <AnimatePresence>
        {activeUsers.length > 0 && (
          <motion.div
            className="absolute top-4 right-4"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ delay: 2, type: "spring" }}
          >
            <motion.div
              className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.3 }}
            >
              <Users className="w-4 h-4 text-white" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TeamCollaborationPreview;