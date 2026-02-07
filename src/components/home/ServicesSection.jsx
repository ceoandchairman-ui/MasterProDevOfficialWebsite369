
import React, { useState, useEffect } from 'react';
import { Service } from '@/entities/Service';
import { ChevronDown, ChevronUp, X, ExternalLink, Briefcase, Coins, DollarSign, TrendingUp, Bot, Settings, Handshake, ClipboardCheck, MessageCircle, LifeBuoy, ArrowRight, Presentation, BrainCircuit, BarChart, Code, Cpu, Cloud, Gamepad, Database } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const pillarDetails = {
  "Career & Personal Brand": {
    color: "#5271ff",
    tagline: "Build strong professional identities",
    description: "We help individuals build strong, credible professional identities that translate skills into opportunities. Includes resumes, LinkedIn profiles, and personal websites.",
    icons: [Briefcase],
    emotionalHook: "Get Hired Faster & Earn More"
  },
  "Digital Product & Growth": {
    color: "#ffb400",
    tagline: "Turn ideas into measurable results",
    description: "We design, build, and optimize digital products and growth systems. Websites, platforms, and conversion systems built with data in mind.",
    icons: [TrendingUp],
    emotionalHook: "Turn Ideas into Revenue"
  },
  "Sales & Business-Development Enablement": {
    color: "#00bf63",
    tagline: "Predictable revenue generation",
    description: "Structured sales systems that replace guesswork with repeatable processes. CRM, automation, and pipeline qualification.",
    icons: [Handshake, Coins],
    emotionalHook: "Predictable Sales Growth"
  },
  "Strategy, Optimization & Launch": {
    color: "#e74c3c",
    tagline: "From thinking to doing",
    description: "We help turn ideas into executable plans. We define direction, remove inefficiencies, and support launches with validation loops.",
    icons: [Presentation],
    emotionalHook: "Execute With Confidence"
  },
  "AI Agents": {
    color: "#6c5ce7",
    tagline: "Automate real workflows",
    description: "We design and deploy AI agents that perform real task like research, lead qualification, and document handling.",
    icons: [Bot, Settings],
    emotionalHook: "Automate Real Work"
  },
  "AI Engineering & Machine Learning": {
    color: "#2d3436",
    tagline: "Production-ready intelligence",
    description: "We build production-ready ML systems, from fine-tuning to custom models. Focused on reliability and integration.",
    icons: [BrainCircuit],
    emotionalHook: "Dependable AI Systems"
  },
  "Data Engineering & Insights": {
    color: "#0984e3",
    tagline: "Trusted insights from raw data",
    description: "Reliable data pipelines that transform raw information into insights. Ingestion, storage, dashboards, and governance.",
    icons: [BarChart, Database],
    emotionalHook: "Decisions Backed by Data"
  },
  "Software Development & IT Consulting": {
    color: "#636e72",
    tagline: "Scalable systems built to last",
    description: "Modern software systems and IT foundations. Clean architecture, documentation, and systems teams can operate.",
    icons: [Code],
    emotionalHook: "Software That Scales"
  },
  "IoT & Electronics Software": {
    color: "#d35400",
    tagline: "Bridge hardware and cloud",
    description: "Electronics-level software and connected devices. Arduino/Pi, firmware, sensor integration, and secure device-to-cloud.",
    icons: [Cpu, Settings],
    emotionalHook: "Connect the Physical World"
  },
  "Cloud & DevOps / MLOps": {
    color: "#00cec9",
    tagline: "Secure, reliable infrastructure",
    description: "Cloud infrastructure, DevOps pipelines, and MLOps systems. Automation, security, and cost control for production.",
    icons: [Cloud],
    emotionalHook: "Infrastructure You Can Trust"
  },
  "Management Consulting": {
    color: "#27ae60",
    tagline: "Execution-focused leadership",
    description: "Execution-focused consulting connecting strategy to action. Improvements in decision-making and operational effectiveness.",
    icons: [ClipboardCheck],
    emotionalHook: "Lead With Clarity"
  },
  "AR/VR & Game Development": {
    color: "#e84393",
    tagline: "Immersive experiences that work",
    description: "Immersive AR, VR, and game-based systems for training and simulation. Functional deployment and scalable technology.",
    icons: [Gamepad],
    emotionalHook: "Immersive Realities"
  }
};

export default function ServicesSection() {
  const [services, setServices] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [hoveredPillar, setHoveredPillar] = useState(null);
  const [hoveredService, setHoveredService] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredServices = services.filter(service => 
    service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pillars = Object.keys(pillarDetails);

  return (
    <div className="py-6 bg-white">
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
          className="rounded-[60px] p-6 md:p-8 border-3 border-solid relative"
          style={{
            backgroundColor: '#ffde59',
            borderColor: '#ffde59',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}
        >
          <div className="absolute -top-6 right-12">
            <div 
              className="bg-white border-2 border-solid px-5 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer flex items-center gap-2"
              style={{ 
                borderColor: '#ffde59',
                boxShadow: '0 4px 8px rgba(0,0,0,0.15)'
              }}
            >
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-base">
                💼
              </div>
              <h2 className="text-base md:text-lg font-bold text-black">
                Our Services
              </h2>
            </div>
          </div>

          <section id="services" className="mt-4">
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search within services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pillars.map(pillar => {
                const pillarData = pillarDetails[pillar];
                const isHovered = hoveredPillar === pillar;

                // Simple search filter based on pillar name or description
                if (searchQuery && 
                    !pillar.toLowerCase().includes(searchQuery.toLowerCase()) && 
                    !pillarData.description.toLowerCase().includes(searchQuery.toLowerCase())) {
                  return null;
                }

                return (
                  <div 
                    key={pillar}
                    className="pillar-card bg-white rounded-xl shadow-md overflow-hidden border-2 transition-all duration-300 flex flex-col h-full cursor-pointer group"
                    style={{ 
                      borderColor: pillarData.color,
                      background: isHovered 
                        ? `linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, ${pillarData.color}15 100%)`
                        : '#ffffff',
                      boxShadow: isHovered 
                        ? `0 12px 24px ${pillarData.color}20, 0 6px 12px rgba(0,0,0,0.1)`
                        : '0 4px 6px rgba(0,0,0,0.1)',
                      transform: isHovered ? 'translateY(-6px)' : 'none'
                    }}
                    onMouseEnter={() => setHoveredPillar(pillar)}
                    onMouseLeave={() => setHoveredPillar(null)}
                    onClick={() => setSelectedService({
                      name: pillar,
                      description: pillarData.description,
                      color: pillarData.color,
                      icon: pillarData.icons[0]
                    })}
                  >
                    <div className="p-6 flex flex-col h-full">
                      <div className="flex items-start justify-between mb-4">
                        <div 
                          className="w-12 h-12 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                          style={{ 
                            backgroundColor: `${pillarData.color}20`, 
                            color: pillarData.color
                          }}
                        >
                          {(() => {
                            const Icon = pillarData.icons[0] || Briefcase;
                            return <Icon className="w-6 h-6" />;
                          })()}
                        </div>
                        <ArrowRight 
                          className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-2 group-hover:translate-x-0"
                          style={{ color: pillarData.color }} 
                        />
                      </div>

                      <h3 className="text-xl font-bold text-black mb-2 group-hover:text-current transition-colors" style={{ color: isHovered ? pillarData.color : '#000' }}>
                        {pillar}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-3">
                        {pillarData.description}
                      </p>

                      <div 
                        className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between"
                      >
                        <span className="text-xs font-bold uppercase tracking-wider" style={{ color: pillarData.color }}>
                          {pillarData.tagline}
                        </span>
                      </div>
                    </div>
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
