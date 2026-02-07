
import React, { useState, useEffect, useRef } from 'react';
import { Service } from '@/entities/Service';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, ArrowRight, ExternalLink, Briefcase, Zap, Bot, BrainCircuit, Search, FileText, Linkedin, BarChart, ShoppingCart, Code, Cloud, MessageSquare, PhoneCall, GraduationCap, Presentation, BookOpen, UserCheck, Coins, DollarSign, TrendingUp, Settings, Handshake, ClipboardCheck, MessageCircle, LifeBuoy, Database, Cpu, Gamepad, Layers, Globe } from 'lucide-react';

const pillarDetails = {
  "Career & Personal Brand": {
    icon: Briefcase,
    color: "#5271ff",
    tagline: "Build strong, credible professional identities",
    description: "We help individuals build strong, credible professional identities that translate skills and experience into real opportunities. We design resumes, LinkedIn profiles, portfolios, and personal websites that align with modern hiring systems.",
    emotionalHook: "Get Hired Faster & Earn More"
  },
  "Digital Product & Growth": {
    icon: TrendingUp,
    color: "#ffb400",
    tagline: "Turn ideas into measurable results",
    description: "We design, build, and optimize digital products and growth systems. This includes websites, platforms, analytics, marketing automation, and conversion systems built with real users and data in mind.",
    emotionalHook: "Turn Ideas into Revenue"
  },
  "Sales & Business-Development Enablement": {
    icon: Handshake,
    color: "#00bf63",
    tagline: "Predictable revenue generation",
    description: "We implement structured sales and business-development systems that replace guesswork with repeatable processes. Focuses on building pipelines, CRMs, automation, and qualification workflows.",
    emotionalHook: "Predictable Sales Growth"
  },
  "Strategy, Optimization & Launch": {
    icon: Presentation,
    color: "#e74c3c",
    tagline: "From thinking to doing",
    description: "We help turn ideas into executable plans. We work with individuals, founders, and leadership teams to define direction, remove inefficiencies, and support launches with real validation loops.",
    emotionalHook: "Execute With Confidence"
  },
  "AI Agents": {
    icon: Bot,
    color: "#6c5ce7",
    tagline: "Automate real workflows",
    description: "We design and deploy AI agents that perform real tasks. These agents automate defined responsibilities such as research, support, lead qualification, document handling, and operational tasks.",
    emotionalHook: "Automate Real Work"
  },
  "AI Engineering & Machine Learning": {
    icon: BrainCircuit,
    color: "#2d3436",
    tagline: "Production-ready intelligence",
    description: "We build production-ready machine learning systems, from fine-tuning existing models to training custom models from scratch. Focuses on engineering reliability, integration, and maintainability.",
    emotionalHook: "Dependable AI Systems"
  },
  "Data Engineering & Insights": {
    icon: Database,
    color: "#0984e3",
    tagline: "Trusted insights from raw data",
    description: "We design and implement reliable data pipelines that transform raw information into trusted insights. Includes ingestion, transformation, validation, storage, dashboards, and governance.",
    emotionalHook: "Decisions Backed by Data"
  },
  "Software Development & IT Consulting": {
    icon: Code,
    color: "#636e72",
    tagline: "Scalable systems built to last",
    description: "We design, build, and modernize software systems and IT foundations. Focuses on long-term value: clean architecture, documentation, and systems that teams can operate and extend.",
    emotionalHook: "Software That Scales"
  },
  "IoT & Electronics Software": {
    icon: Cpu,
    color: "#d35400",
    tagline: "Bridge hardware and cloud",
    description: "We build electronics-level software and connected device systems. Includes Arduino/Pi development, embedded firmware, sensor integration, edge computing, and secure device-to-cloud communication.",
    emotionalHook: "Connect the Physical World"
  },
  "Cloud & DevOps / MLOps": {
    icon: Cloud,
    color: "#00cec9",
    tagline: "Secure, reliable infrastructure",
    description: "We design and operate cloud infrastructure, DevOps pipelines, and MLOps systems. Focuses on automation, security, observability, and cost control to keep systems running reliably in production.",
    emotionalHook: "Infrastructure You Can Trust"
  },
  "Management Consulting": {
    icon: ClipboardCheck,
    color: "#27ae60",
    tagline: "Execution-focused leadership",
    description: "We provide execution-focused consulting that connects strategy to action. We improve decision-making, alignment, and operational effectiveness through process design and change execution.",
    emotionalHook: "Lead With Clarity"
  },
  "AR/VR & Game Development": {
    icon: Gamepad,
    color: "#e84393",
    tagline: "Immersive experiences that work",
    description: "We design and build immersive AR, VR, and game-based systems for training, simulation, and visualization. Focuses on functional deployment and scalable technology.",
    emotionalHook: "Immersive Realities"
  }
};

const serviceIcons = {
  FileText, Linkedin, UserCheck, Briefcase, BarChart, ShoppingCart,
  Bot, Code, Cloud, MessageSquare, PhoneCall, GraduationCap,
  Presentation, BookOpen, BrainCircuit
};

const getServiceIcon = (iconName) => {
  const Icon = serviceIcons[iconName] || Briefcase;
  return Icon;
};

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [hoveredPillar, setHoveredPillar] = useState(null);
  const [hoveredService, setHoveredService] = useState(null);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    async function fetchServices() {
      const data = await Service.list();
      setServices(data);
    }
    fetchServices();
  }, []);

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const pillars = Object.keys(pillarDetails);

  return (
    <div className="min-h-screen bg-gray-50 py-16 md:py-24">
      <style>{`
        @keyframes iconBounce {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-4px) rotate(3deg); }
        }
        @keyframes iconPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
        @keyframes arrowSlide {
          0% { transform: translateX(-5px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        .icon-hover:hover {
          animation: iconBounce 0.6s ease-in-out;
        }
        .service-icon-container {
          transition: all 0.3s ease;
        }
        .service-card:hover .service-icon-container {
          animation: iconPulse 0.6s ease-in-out;
        }
        .service-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }
        .service-card:hover {
          transform: translateY(-4px);
        }
        .service-card:hover .arrow-indicator {
          animation: arrowSlide 0.3s ease-out forwards;
        }
        .arrow-indicator {
          opacity: 0;
          transform: translateX(-5px);
        }
        .pillar-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .pillar-card:hover {
          transform: translateY(-4px) scale(1.01);
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className="rounded-[60px] p-8 md:p-12 border-3 border-solid relative"
          style={{
            backgroundColor: '#f0f2f5',
            borderColor: '#e5e7eb',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}
        >
          <div className="absolute -top-6 right-12">
            <div 
              className="bg-white border-2 border-solid px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer flex items-center gap-3"
              style={{ 
                borderColor: '#ffde59',
                boxShadow: '0 4px 8px rgba(0,0,0,0.15)'
              }}
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-lg">
                💼
              </div>
              <h2 className="text-lg md:text-xl font-bold text-black">
                Our Services
              </h2>
            </div>
          </div>

          <section className="mt-6">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                End-to-End System Implementation
              </h1>
              <p className="text-xl text-gray-600">Explore our services organized by our core 12 disciplines.</p>
            </div>

            <div className="mt-16 space-y-6">
              {pillars.map(pillar => {
                const pillarData = pillarDetails[pillar];
                const PillarIcon = pillarData.icon;
                const pillarServices = services.filter(s => s.category === pillar);
                const isExpanded = expandedCategories[pillar];
                const isHovered = hoveredPillar === pillar;

                return (
                  <div 
                    key={pillar}
                    className="pillar-card bg-white rounded-xl shadow-md overflow-hidden border-2"
                    style={{ 
                      borderColor: pillarData.color,
                      background: isHovered 
                        ? `linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, ${pillarData.color}30 100%)`
                        : '#ffffff',
                      boxShadow: isHovered 
                        ? `0 12px 24px ${pillarData.color}30, 0 6px 12px rgba(0,0,0,0.1)`
                        : '0 4px 6px rgba(0,0,0,0.1)'
                    }}
                    onMouseEnter={() => setHoveredPillar(pillar)}
                    onMouseLeave={() => setHoveredPillar(null)}
                  >
                    <button
                      onClick={() => toggleCategory(pillar)}
                      className="w-full px-6 py-4 flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div 
                          className="w-14 h-14 rounded-lg flex items-center justify-center flex-shrink-0 icon-hover transition-transform duration-300"
                          style={{ 
                            backgroundColor: `${pillarData.color}20`, 
                            color: pillarData.color,
                            transform: isHovered ? 'scale(1.15)' : 'scale(1)'
                          }}
                        >
                          <PillarIcon className="w-7 h-7" />
                        </div>
                        <div className="text-left flex-1">
                          <h3 className="text-xl font-bold text-black mb-1">
                            {pillar}
                          </h3>
                          {isHovered && (
                            <p className="text-sm font-medium transition-all duration-300" style={{ color: pillarData.color }}>
                              {pillarData.emotionalHook}
                            </p>
                          )}
                          <p className="text-sm text-gray-600">{pillarServices.length} Services</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {isHovered && !isExpanded && (
                          <Button 
                            size="sm" 
                            className="text-white"
                            style={{ backgroundColor: pillarData.color }}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleCategory(pillar);
                            }}
                          >
                            View Services
                          </Button>
                        )}
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="px-6 pb-6">
                        <div 
                          className="mb-6 p-4 rounded-lg"
                          style={{ backgroundColor: `${pillarData.color}15` }}
                        >
                          <h4 className="text-xl font-bold mb-2" style={{ color: pillarData.color }}>
                            {pillarData.tagline}
                          </h4>
                          <p className="text-sm text-gray-700">{pillarData.description}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {pillarServices.map(service => {
                            const ServiceIcon = getServiceIcon(service.icon);
                            const isServiceHovered = hoveredService === service.id;

                            return (
                              <div
                                key={service.id}
                                onClick={() => setSelectedService(service)}
                                onMouseEnter={() => setHoveredService(service.id)}
                                onMouseLeave={() => setHoveredService(null)}
                                className="service-card bg-white rounded-lg border-2 shadow-md hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
                                style={{ 
                                  borderColor: isServiceHovered ? pillarData.color : '#e5e7eb'
                                }}
                              >
                                <div className="p-4">
                                  <div className="flex items-start gap-3">
                                    <div 
                                      className="service-icon-container w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                                      style={{ 
                                        backgroundColor: `${pillarData.color}20`,
                                        border: `2px solid ${pillarData.color}40`
                                      }}
                                    >
                                      <ServiceIcon 
                                        className="w-6 h-6"
                                        style={{ color: pillarData.color }}
                                      />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-start justify-between gap-2">
                                        <h5 className="font-bold text-base text-black group-hover:text-current transition-colors line-clamp-2" style={{ color: isServiceHovered ? pillarData.color : '#000' }}>
                                          {service.name}
                                        </h5>
                                        <ArrowRight 
                                          className="arrow-indicator w-5 h-5 flex-shrink-0 mt-0.5" 
                                          style={{ color: pillarData.color }}
                                        />
                                      </div>
                                      <p className="text-sm text-gray-600 mt-2 line-clamp-2 leading-relaxed">
                                        {service.description}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                
                                {isServiceHovered && (
                                  <div 
                                    className="absolute bottom-0 left-0 right-0 h-1"
                                    style={{ 
                                      backgroundColor: pillarData.color,
                                      boxShadow: `0 -2px 8px ${pillarData.color}40`
                                    }}
                                  />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>

      <Dialog open={!!selectedService} onOpenChange={() => setSelectedService(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedService && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold pr-8">
                  {selectedService.name}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-700 leading-relaxed">
                    {selectedService.description}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div 
                    className="p-4 rounded-lg"
                    style={{ backgroundColor: `${selectedService.color}15` }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">💰</span>
                      <h4 className="font-bold text-lg">Investment</h4>
                    </div>
                    <p className="text-sm text-gray-700">
                      Contact us for customized pricing based on your specific needs and project scope.
                    </p>
                  </div>

                  <div 
                    className="p-4 rounded-lg"
                    style={{ backgroundColor: `${selectedService.color}15` }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">📊</span>
                      <h4 className="font-bold text-lg">Status</h4>
                    </div>
                    <Badge className="bg-green-500 text-white">
                      Currently Accepting Clients
                    </Badge>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    className="flex-1 text-white"
                    style={{ backgroundColor: selectedService.color }}
                    asChild
                  >
                    <a href="#contact" onClick={() => setSelectedService(null)}>
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Get Started
                    </a>
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setSelectedService(null)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
