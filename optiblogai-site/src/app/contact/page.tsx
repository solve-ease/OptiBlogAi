"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import Button from "../components/ui/button";
import { Mail, MessageCircle, Github, Twitter, MapPin, Clock, Linkedin, Search } from "lucide-react";
import Header from "../components/layout/Header";
import { SITE_CONFIG } from "../lib/constants";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
    // In a real app, you'd send this to your backend
  };

  const contactMethods = [
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email Support",
      description: "Get help with technical questions",
      action: "support@optiblogai.com",
      href: "mailto:support@optiblogai.com",
    },
    {
      icon: <Linkedin className="h-6 w-6" />,
      title: "LinkedIn",
      description: "Join our developer community",
      action: "Join Us on LinkedIn",
      href: "https://linkedin.com/company/solve-ease",
    },
    {
      icon: <Twitter className="h-6 w-6" />,
      title: "Twitter",
      description: "Follow us for updates",
      action: "@OptiBlogAi",
      href: "https://x.com/solve__ease",
    },
  ];

  const officeInfo = [
    {
      icon: <MapPin className="h-5 w-5" />,
      label: "Address",
      value: "Remote-First Company\nServing Globally",
    },
    {
      icon: <Clock className="h-5 w-5" />,
      label: "Business Hours",
      value: "24/7 Community Support\nMon-Fri: Priority Response",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Get in{" "}
              <span className="bg-gradient-to-r from-[#5A54EF] via-[#3D8ED7] to-[#15B89F] bg-clip-text text-transparent">
                Touch
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Have questions about OptiBlogAi? We're here to help you optimize your content creation journey.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Left Column - Contact Form & Company Info */}
            <div className="flex flex-col space-y-6">
              {/* Contact Form */}
              <div className="rounded-lg border border-gray-200 bg-white shadow-sm flex-1 flex flex-col dark:border-gray-800 dark:bg-gray-900">
                {/* Header */}
                <div className="flex flex-col space-y-1.5 p-6 border-b border-gray-200 dark:border-gray-800">
                  <h3 className="font-semibold tracking-tight text-2xl text-gray-900 dark:text-gray-100">
                    Send us a Message
                  </h3>
                </div>

                {/* Content */}
                <div className="p-6 pt-0 pb-6 flex-1 flex flex-col">
                  <form onSubmit={handleSubmit} className="space-y-6 flex-1 flex flex-col">
                    {/* Name and Email Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label
                          htmlFor="name"
                          className="text-[15px] font-medium leading-none text-gray-900 dark:text-gray-100 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Name
                        </label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          placeholder="Your name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus:ring-blue-400"
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="email"
                          className="text-[15px] font-medium leading-none text-gray-900 dark:text-gray-100 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Email
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus:ring-blue-400"
                        />
                      </div>
                    </div>

                    {/* Subject */}
                    <div className="space-y-2">
                      <label
                        htmlFor="subject"
                        className="text-[15px] font-medium leading-none text-gray-900 dark:text-gray-100 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Subject
                      </label>
                      <input
                        id="subject"
                        name="subject"
                        type="text"
                        placeholder="What's this about?"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus:ring-blue-400"
                      />
                    </div>

                    {/* Message */}
                    <div className="space-y-2 flex-1 flex flex-col">
                      <label
                        htmlFor="message"
                        className="text-[15px] font-medium leading-none text-gray-900 dark:text-gray-100 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Message
                      </label>
                      <textarea
                      id="message"
                      name="message"
                      placeholder="Tell us more about your question or feedback..."
                      value={formData.message}
                      onChange={handleInputChange}
                      required className="h-[118px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 resize-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus:ring-blue-400"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed bg-[#5A54EF] text-white hover:bg-[#4A45D3] focus:ring-blue-500 shadow-lg hover:shadow-xl text-lg px-6 py-3 rounded-lg w-full dark:bg-blue-500 dark:hover:bg-blue-600"
                    >
                      Send Message
                    </button>

                  </form>
                </div>
              </div>

              {/* Company Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Company Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {officeInfo.map((info, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="text-primary mt-0.5">
                        {info.icon}
                      </div>
                      <div>
                        <div className="font-medium">{info.label}</div>
                        <div className="text-sm text-muted-foreground whitespace-pre-line">
                          {info.value}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Contact Methods & FAQ */}
            <div className="space-y-6">
              {/* Contact Methods */}
              <div>
                <h2 className="text-2xl font-bold mb-6">Other Ways to Reach Us</h2>
                <div className="grid gap-4">
                  {contactMethods.map((method, index) => (
                    <Card key={index} className="group hover:shadow-md transition-all duration-300">
                      <CardContent className="p-1">
                        <div className="flex items-start gap-4">
                          <div className="inline-flex p-2 rounded-lg bg-primary/10 text-primary">
                            {method.icon}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold mb-1">{method.title}</h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              {method.description}
                            </p>
                            {/* <Button variant="link" className="p-0 h-auto"> */}
                            <Button variant="ghost" className="p-0 h-auto text-primary hover:underline">
                              <a href={method.href} target="_blank" rel="noopener noreferrer">
                                {method.action}
                              </a>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
              

              {/* FAQ Link */}
              <Card className="bg-gradient-to-br from-primary/5 to-blue-50 dark:from-primary/10 dark:to-blue-950/20">
                <CardContent className="p-6 text-center">
                  <h3 className="text-2xl font-semibold mb-6">
                    Looking for Quick Answers?
                  </h3>
                  <p className="text-lg-muted-foreground mb-4">
                    Check out our documentation and FAQ section for instant help.
                  </p>
                  <Button variant="outline">
                    <a href="/docs">Browse Documentation</a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Community Section */}
          <div className="mt-16 text-center">
            <Card className="max-w-2xl mx-auto">
              <CardContent className="p-2">
                <h2 className="text-2xl font-bold mb-4">
                  Join Our Growing Community
                </h2>
                <p className="text-muted-foreground mb-6">
                  Connect with other developers, share ideas, and get help from our active community.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button className="h-13 w-50 px-4 py-2 text-sm">
                    <a href="https://github.com/solve-ease/OptiBlogAi" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center justify-center text-base">
                      <Github className="mr-2 h-5 w-5" />
                      Star on GitHub
                    </a>
                  </Button>
                  <Button variant="outline" className="h-13 w-50 px-4 py-2 text-sm">
                    <a href="/"  rel="noopener noreferrer" className="flex items-center justify-center text-base">
                      <Search className="mr-2 h-5 w-5" />
                      Start Exploring
                      </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}