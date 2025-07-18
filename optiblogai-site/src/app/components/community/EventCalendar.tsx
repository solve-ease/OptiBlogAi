"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Users, ExternalLink, ChevronLeft, ChevronRight, Trophy, Code, Coffee, Zap } from "lucide-react";
import { useEvents } from "@/hooks/useGitHubStats";
import { CommunityEvent } from "@/types/github";

const EventCard: React.FC<{ event: CommunityEvent; index: number }> = ({ event, index }) => {
  const getEventIcon = () => {
    switch (event.type) {
      case "hackathon":
        return <Trophy className="w-6 h-6" />;
      case "workshop":
        return <Code className="w-6 h-6" />;
      case "meetup":
        return <Coffee className="w-6 h-6" />;
      case "webinar":
        return <Zap className="w-6 h-6" />;
      case "conference":
        return <Users className="w-6 h-6" />;
    }
  };

  const getEventColor = () => {
    switch (event.type) {
      case "hackathon":
        return "from-purple-500 to-pink-500";
      case "workshop":
        return "from-blue-500 to-cyan-500";
      case "meetup":
        return "from-green-500 to-emerald-500";
      case "webinar":
        return "from-orange-500 to-red-500";
      case "conference":
        return "from-indigo-500 to-purple-500";
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isUpcoming = new Date(event.date) > new Date();
  const isPast = new Date(event.date) < new Date();

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 ${
        event.featured ? "ring-2 ring-primary/20" : ""
      } ${isPast ? "opacity-75" : ""}`}
    >
      {/* Featured Badge */}
      {event.featured && (
        <div className="absolute -top-3 -right-3">
          <div className="bg-gradient-to-r from-primary to-secondary text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
            <Trophy className="w-3 h-3" />
            Featured
          </div>
        </div>
      )}

      {/* Event Type Badge */}
      <div className="flex items-center justify-between mb-4">
        <div className={`inline-flex items-center gap-2 bg-gradient-to-r ${getEventColor()} text-white px-3 py-1 rounded-full text-sm font-medium`}>
          {getEventIcon()}
          <span className="capitalize">{event.type}</span>
        </div>
        {isPast && (
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            Past Event
          </span>
        )}
      </div>

      {/* Event Title */}
      <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
        {event.title}
      </h3>

      {/* Event Description */}
      <p className="text-gray-600 mb-4 line-clamp-3">
        {event.description}
      </p>

      {/* Event Details */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4 text-primary" />
          <span>{formatDate(event.date)}</span>
          <Clock className="w-4 h-4 text-primary ml-2" />
          <span>{event.time} UTC</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4 text-primary" />
          <span className="capitalize">{event.location}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Users className="w-4 h-4 text-primary" />
          <span>
            {event.attendees} 
            {event.maxAttendees && ` / ${event.maxAttendees}`} attendees
          </span>
          {event.maxAttendees && (
            <div className="flex-1 max-w-24">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(event.attendees / event.maxAttendees) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="text-sm text-gray-600">
          <span className="font-medium">Organizer:</span> {event.organizer}
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-6">
        {event.tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Action Button */}
      {isUpcoming && event.registrationUrl && (
        <a
          href={event.registrationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors duration-200"
        >
          Register Now
        </a>
      )}

      {isPast && (
        <div className="text-center py-3 text-gray-500 font-medium">
          Event Completed
        </div>
      )}

      {isUpcoming && !event.registrationUrl && (
        <div className="text-center py-3 bg-gray-100 rounded-lg text-gray-600 font-medium">
          Registration Opening Soon
        </div>
      )}
    </motion.div>
  );
};

const EventCalendar: React.FC = () => {
  const { events, loading, error } = useEvents();
  const [filter, setFilter] = useState<string>("all");
  const [timeFilter, setTimeFilter] = useState<string>("upcoming");

  const filteredEvents = events.filter((event) => {
    const typeMatch = filter === "all" || event.type === filter;
    const isUpcoming = new Date(event.date) > new Date();
    const isPast = new Date(event.date) < new Date();
    
    let timeMatch = true;
    if (timeFilter === "upcoming") {
      timeMatch = isUpcoming;
    } else if (timeFilter === "past") {
      timeMatch = isPast;
    }
    
    return typeMatch && timeMatch;
  }).sort((a, b) => {
    if (timeFilter === "past") {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  const upcomingEvents = events.filter(event => new Date(event.date) > new Date()).length;
  const pastEvents = events.filter(event => new Date(event.date) < new Date()).length;

  const FilterButton: React.FC<{
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
  }> = ({ active, onClick, children }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
        active
          ? "bg-primary text-white shadow-lg"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      }`}
    >
      {children}
    </button>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="animate-pulse">
              <div className="flex items-center justify-between mb-4">
                <div className="h-8 bg-gray-300 rounded-full w-32"></div>
                <div className="h-6 bg-gray-300 rounded-full w-20"></div>
              </div>
              <div className="space-y-3">
                <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-full"></div>
                <div className="h-4 bg-gray-300 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Failed to load events</p>
        <p className="text-gray-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="grid grid-cols-2 gap-4"
      >
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 text-center">
          <h3 className="text-2xl font-bold text-primary">{upcomingEvents}</h3>
          <p className="text-primary text-sm">Upcoming Events</p>
        </div>
        <div className="bg-gray-100 border border-gray-200 rounded-xl p-4 text-center">
          <h3 className="text-2xl font-bold text-gray-700">{pastEvents}</h3>
          <p className="text-gray-600 text-sm">Past Events</p>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="space-y-4"
      >
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Event Type</h3>
          <div className="flex flex-wrap gap-2">
            <FilterButton
              active={filter === "all"}
              onClick={() => setFilter("all")}
            >
              All
            </FilterButton>
            <FilterButton
              active={filter === "hackathon"}
              onClick={() => setFilter("hackathon")}
            >
              <Trophy className="w-4 h-4 mr-1" />
              Hackathons
            </FilterButton>
            <FilterButton
              active={filter === "workshop"}
              onClick={() => setFilter("workshop")}
            >
              <Code className="w-4 h-4 mr-1" />
              Workshops
            </FilterButton>
            <FilterButton
              active={filter === "meetup"}
              onClick={() => setFilter("meetup")}
            >
              <Coffee className="w-4 h-4 mr-1" />
              Meetups
            </FilterButton>
            <FilterButton
              active={filter === "webinar"}
              onClick={() => setFilter("webinar")}
            >
              <Zap className="w-4 h-4 mr-1" />
              Webinars
            </FilterButton>
            <FilterButton
              active={filter === "conference"}
              onClick={() => setFilter("conference")}
            >
              <Users className="w-4 h-4 mr-1" />
              Conferences
            </FilterButton>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Timeline</h3>
          <div className="flex gap-2">
            <FilterButton
              active={timeFilter === "upcoming"}
              onClick={() => setTimeFilter("upcoming")}
            >
              Upcoming
            </FilterButton>
            <FilterButton
              active={timeFilter === "past"}
              onClick={() => setTimeFilter("past")}
            >
              Past
            </FilterButton>
            <FilterButton
              active={timeFilter === "all"}
              onClick={() => setTimeFilter("all")}
            >
              All Time
            </FilterButton>
          </div>
        </div>
      </motion.div>

      {/* Events Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 gap-6"
      >
        {filteredEvents.map((event, index) => (
          <EventCard key={event.id} event={event} index={index} />
        ))}
      </motion.div>

      {filteredEvents.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No events match the current filters</p>
        </motion.div>
      )}

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="text-center pt-8 border-t border-gray-200"
      >
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Want to organize an event?
        </h3>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Help grow the OptiBlogAi community by organizing workshops, meetups, or hackathons. 
          We&apos;ll provide support and resources to make your event successful!
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="https://github.com/solve-ease/OptiBlogAi/issues/new?assignees=&labels=event&template=event_proposal.md&title=Event%3A+%5BEvent+Name%5D"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-primary/90 transition-all duration-300 transform hover:scale-105"
          >
            <Calendar className="w-5 h-5" />
            Propose an Event
          </a>
          <a
            href="https://github.com/solve-ease/OptiBlogAi/discussions/categories/events"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-primary border-2 border-primary px-6 py-3 rounded-full font-semibold hover:bg-primary hover:text-white transition-all duration-300 transform hover:scale-105"
          >
            <ExternalLink className="w-5 h-5" />
            Event Discussions
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default EventCalendar;