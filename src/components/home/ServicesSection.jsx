
import React, { useState, useEffect } from 'react';
import { Service } from '@/entities/Service';
import { ChevronDown, ChevronUp, X, ExternalLink, Briefcase, Coins, DollarSign, TrendingUp, Bot, Settings, Handshake, ClipboardCheck, MessageCircle, LifeBuoy, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const pillarDetails = {
  "AI Powered Job Search & Professional Development": {
    color: "#5271ff",
    tagline: "Transform your career trajectory",
    description: "AI-enhanced career tools and professional development",
    icons: [Briefcase],
    emotionalHook: "Get Hired Faster with AI"
  },
  "AI Powered Business Development": {
    color: "#ffb400",
    tagline: "Accelerate business growth",
    description: "Strategic AI solutions for market expansion",
    icons: [Coins, DollarSign, TrendingUp],
    emotionalHook: "Win More Clients, Close More Deals"
  },
  "AI Agents & Automations": {
    color: "#00bf63",
    tagline: "Streamline operations with AI",
    description: "Custom intelligent automation solutions",
    icons: [Bot, Settings],
    emotionalHook: "Let AI Work for You 24/7"
  },
  "AI Consulting": {
    color: "#6A11CB",
    tagline: "Strategic AI guidance",
    description: "Expert consulting for AI transformation",
    icons: [Handshake, ClipboardCheck],
    emotionalHook: "Transform Your Business with Intelligence"
  },
  "AI Optimized Chatbots & Support Systems": {
    color: "#5271ff",
    tagline: "Enhance customer experience 24/7",
    description: "Intelligent support and engagement systems",
    icons: [MessageCircle, LifeBuoy],
    emotionalHook: "Delight Customers Automatically"
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

            <div className="space-y-3">
              {pillars.map(pillar => {
                const pillarData = pillarDetails[pillar];
                const pillarServices = filteredServices.filter(s => s.category === pillar);
                const isExpanded = expandedCategories[pillar];
                const isHovered = hoveredPillar === pillar;

                if (pillarServices.length === 0 && searchQuery) return null;

                return (
                  <div 
                    key={pillar}
                    className="pillar-card bg-white rounded-xl shadow-md overflow-hidden border-2 transition-all duration-300"
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
                      className="w-full px-4 py-3 flex items-center justify-between hover:bg-opacity-50 transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="flex items-center gap-2">
                          {pillarData.icons.map((Icon, idx) => (
                            <Icon 
                              key={idx}
                              className="w-6 h-6 icon-hover transition-transform duration-300"
                              style={{ 
                                color: pillarData.color,
                                transform: isHovered ? 'scale(1.15)' : 'scale(1)'
                              }}
                            />
                          ))}
                        </div>
                        <div className="text-left flex-1">
                          <h3 className="text-lg font-bold text-black">
                            {pillar}
                          </h3>
                          {isHovered && (
                            <p className="text-sm font-medium mt-1 transition-all duration-300" style={{ color: pillarData.color }}>
                              {pillarData.emotionalHook}
                            </p>
                          )}
                          <p className="text-sm text-gray-600">{pillarServices.length} Services</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isHovered && (
                          <Link to={createPageUrl('ServicesPage')}>
                            <Button 
                              size="sm" 
                              className="text-white"
                              style={{ backgroundColor: pillarData.color }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              Explore Services
                            </Button>
                          </Link>
                        )}
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="px-4 pb-4">
                        <div 
                          className="mb-4 p-4 rounded-lg"
                          style={{ backgroundColor: `${pillarData.color}15` }}
                        >
                          <h4 className="text-xl font-bold mb-1" style={{ color: pillarData.color }}>
                            {pillarData.tagline}
                          </h4>
                          <p className="text-sm text-gray-700">{pillarData.description}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {pillarServices.map(service => (
                            <div
                              key={service.id}
                              onClick={() => setSelectedService(service)}
                              onMouseEnter={() => setHoveredService(service.id)}
                              onMouseLeave={() => setHoveredService(null)}
                              className="service-card bg-white rounded-lg border-2 shadow-md hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
                              style={{ 
                                borderColor: hoveredService === service.id ? pillarData.color : '#e5e7eb'
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
                                    <span className="text-2xl">
                                      {service.icon === 'FileText' && '📄'}
                                      {service.icon === 'Linkedin' && '💼'}
                                      {service.icon === 'UserCheck' && '✅'}
                                      {service.icon === 'Briefcase' && '💼'}
                                      {service.icon === 'BarChart' && '📊'}
                                      {service.icon === 'ShoppingCart' && '🛒'}
                                      {service.icon === 'Bot' && '🤖'}
                                      {service.icon === 'Code' && '💻'}
                                      {service.icon === 'Cloud' && '☁️'}
                                      {service.icon === 'MessageSquare' && '💬'}
                                      {service.icon === 'PhoneCall' && '📞'}
                                      {service.icon === 'GraduationCap' && '🎓'}
                                      {service.icon === 'Presentation' && '📊'}
                                      {service.icon === 'BookOpen' && '📖'}
                                      {service.icon === 'BrainCircuit' && '🧠'}
                                    </span>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                      <h5 className="font-bold text-base text-black group-hover:text-current transition-colors line-clamp-2" style={{ color: hoveredService === service.id ? pillarData.color : '#000' }}>
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
                              
                              {hoveredService === service.id && (
                                <div 
                                  className="absolute bottom-0 left-0 right-0 h-1"
                                  style={{ 
                                    backgroundColor: pillarData.color,
                                    boxShadow: `0 -2px 8px ${pillarData.color}40`
                                  }}
                                />
                              )}
                            </div>
                          ))}
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
