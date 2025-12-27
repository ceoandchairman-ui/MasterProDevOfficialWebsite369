import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Bot, Rocket, AlertCircle, Building, TrendingUp, Users, Target, Briefcase, Search } from 'lucide-react';
import { createPageUrl } from '@/utils';

const highlightKeywords = (text) => {
  const keywords = {
    'Challenges': { color: '#e74c3c', emoji: '❗' },
    'growth': { color: '#00bf63', emoji: '🚀' },
    'processes': { color: '#e74c3c', emoji: '⚙️' },
    'Assessment': { color: '#f39c12', emoji: '🧐' },
    'analysis': { color: '#f39c12', emoji: '📊' },
    'Goal': { color: '#f39c12', emoji: '🎯' },
    'Solutions': { color: '#5271ff', emoji: '💡' },
    'automation': { color: '#5271ff', emoji: '🤖' },
    'optimization': { color: '#5271ff', emoji: '🔧' },
    'Acceleration': { color: '#00bf63', emoji: '⚡' },
    'productivity': { color: '#00bf63', emoji: '📈' },
    'efficiency': { color: '#00bf63', emoji: '✅' },
    'Performance': { color: '#00bf63', emoji: '🏆' },
    'leadership': { color: '#00bf63', emoji: '👑' },
    'recognition': { color: '#00bf63', emoji: '🌟' },
    'opportunities': { color: '#00bf63', emoji: '🌟' },
    'visibility': { color: '#00bf63', emoji: '👁️' },
    'workflows': { color: '#e74c3c', emoji: '📝' },
    'Strategy': { color: '#f39c12', emoji: '🗺️' },
    'Resource': { color: '#f39c12', emoji: '💰' },
    'Digital': { color: '#5271ff', emoji: '💻' },
    'System': { color: '#5271ff', emoji: '🔗' },
    'ROI': { color: '#00bf63', emoji: '💲' },
    'Market': { color: '#00bf63', emoji: '🌐' },
    'Sustainable': { color: '#00bf63', emoji: '♻️' },
    'Competitive': { color: '#00bf63', emoji: '⚔️' }
  };

  let highlightedText = text;
  Object.entries(keywords).forEach(([keyword, style]) => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
    highlightedText = highlightedText.replace(regex, `<span style="color: ${style.color}; font-weight: bold;">${style.emoji} ${keyword}</span>`);
  });
  
  return highlightedText;
};

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);
  const [visibleMilestones, setVisibleMilestones] = useState([]);
  const [hoveredMilestone, setHoveredMilestone] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const chartRef = useRef(null);

  // Actual MasterProDev services data
  const realServices = [
    // AI Powered Job Search & Professional Development
    { title: 'AI-Enhanced LinkedIn', description: 'Profile optimization', icon: '💼', color: '#0077b5' },
    { title: 'AI-Optimized Resume', description: 'ATS-friendly formats', icon: '📄', color: '#4ecdc4' },
    { title: 'Career Transition', description: 'Strategic career moves', icon: '🔄', color: '#96ceb4' },
    { title: 'Professional Portfolio', description: 'Showcase your work', icon: '👤', color: '#45b7d1' },
    { title: 'Job Market Analysis', description: 'Market insights', icon: '🌐', color: '#6c5ce7' },
    { title: 'LinkedIn Strategy', description: 'Network building', icon: '🤝', color: '#0077b5' },
    { title: 'Interview Preparation', description: 'AI-powered practice', icon: '🎯', color: '#e17055' },
    { title: 'Staffing Solutions', description: 'Talent acquisition', icon: '👥', color: '#fd79a8' },
    
    // AI Powered Business Development
    { title: 'Intelligent Shopify', description: 'E-commerce optimization', icon: '🛒', color: '#00bf63' },
    { title: 'AI-Assisted Sales', description: 'Sales automation', icon: '💰', color: '#fdcb6e' },
    { title: 'Customer Journey', description: 'Experience mapping', icon: '🗺️', color: '#a29bfe' },
    { title: 'Shopify Dashboard', description: 'Analytics & insights', icon: '📊', color: '#00cec9' },
    { title: 'Market Research', description: 'Data-driven insights', icon: '🔍', color: '#6c5ce7' },
    { title: 'Predictive Analytics', description: 'Future forecasting', icon: '🔮', color: '#e84393' },
    { title: 'Business Process', description: 'Workflow optimization', icon: '⚙️', color: '#f39c12' },
    
    // AI Agents & Automations
    { title: 'Custom AI Agents', description: 'Intelligent assistants', icon: '🤖', color: '#5271ff' },
    { title: 'n8n Workflows', description: 'Automation platform', icon: '🔗', color: '#ff6b6b' },
    { title: 'Data Processing', description: 'Automated analysis', icon: '📈', color: '#4ecdc4' },
    { title: 'API Integration', description: 'System connections', icon: '🔌', color: '#96ceb4' },
    { title: 'Email Automation', description: 'Smart messaging', icon: '📧', color: '#45b7d1' },
    { title: 'Social Media AI', description: 'Content automation', icon: '📱', color: '#fd79a8' },
    
    // AI Consulting
    { title: 'AI Strategy', description: 'Implementation roadmap', icon: '🗺️', color: '#f39c12' },
    { title: 'AI Ethics', description: 'Responsible AI practices', icon: '⚖️', color: '#e74c3c' },
    { title: 'Technology Assessment', description: 'AI readiness evaluation', icon: '🔍', color: '#9b59b6' },
    { title: 'Custom LLM', description: 'Tailored language models', icon: '🧠', color: '#5271ff' },
    { title: 'Team Training', description: 'AI skill development', icon: '🎓', color: '#00bf63' },
    { title: 'Fine-Tuned Models', description: 'Specialized AI systems', icon: '🔧', color: '#ffb400' },
    
    // AI Optimized Chatbots & Support Systems
    { title: 'Smart Customer Support', description: '24/7 AI assistance', icon: '💬', color: '#00cec9' },
    { title: 'Customer Service AI', description: 'Automated support', icon: '🛟', color: '#00b894' },
    { title: 'Knowledge Base AI', description: 'Smart documentation', icon: '📚', color: '#0984e3' },
    { title: 'Sentiment Analysis', description: 'Emotion detection', icon: '😊', color: '#e84393' },
    { title: 'Voice-Enabled AI', description: 'Speech interactions', icon: '🎤', color: '#6c5ce7' },
    { title: 'Multi-Channel Support', description: 'Unified communications', icon: '📞', color: '#fd79a8' },
    { title: 'RAG Chatbots', description: 'Knowledge-enhanced AI', icon: '🔍', color: '#a29bfe' },
    
    // Additional Products/Services to reach 35
    { title: 'AI Content Creation', description: 'Automated writing', icon: '✍️', color: '#e17055' },
    { title: 'Digital Marketing AI', description: 'Campaign optimization', icon: '📢', color: '#fdcb6e' }
  ];

  // Generate 35 feature pills for a 5x7 grid structure
  const featurePills = [];
  const numCols = 5;
  const numRows = 7;
  const pillWidth = 160;
  const pillHeight = 60;

  // Calculate cell dimensions and padding to perfectly fit pills with spacing
  const colWidth = 1200 / numCols;
  const rowHeight = 600 / numRows;
  const xPadding = (colWidth - pillWidth) / 2;
  const yPadding = (rowHeight - pillHeight) / 2;

  let idCounter = 1;
  let serviceIndex = 0; // Using serviceIndex to map to realServices and stagger animation

  for (let r = 0; r < numRows; r++) {
    for (let c = 0; c < numCols; c++) {
      const x = c * colWidth + xPadding;
      const y = r * rowHeight + yPadding;
      const service = realServices[serviceIndex % realServices.length]; 

      featurePills.push({
        id: idCounter++,
        x: x,
        y: y,
        icon: service.icon,
        title: service.title,
        description: service.description,
        color: service.color,
        animationDelay: `${serviceIndex * 0.05}s`
      });
      serviceIndex++;
    }
  }
  
  useEffect(() => {
    const currentChartRef = chartRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          
          const timings = [800, 1600, 2400, 3200, 4000];
          timings.forEach((delay, index) => {
            setTimeout(() => {
              setVisibleMilestones(prev => [...prev, index + 1]);
            }, delay);
          });
          
          observer.unobserve(currentChartRef);
        }
      },
      { threshold: 0.5 }
    );
    
    if (currentChartRef) {
      observer.observe(currentChartRef);
    }

    return () => {
      if (currentChartRef) {
        observer.unobserve(currentChartRef);
      }
    };
  }, [isVisible]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = createPageUrl('SearchResults') + '?q=' + encodeURIComponent(searchQuery);
    }
  };

  const milestones = [
    {
      id: 1,
      curveX: 200, curveY: 450,
      cardX: 140, cardY: 390,
      position: 'above',
      icon: AlertCircle,
      color: '#e74c3c',
      title: 'Current Challenges',
      bubbleTitle: 'Current Challenges',
      bubbleDescription: '• Outdated processes<br/>• Low market visibility',
      bubblePosition: 'right'
    },
    {
      id: 2,
      curveX: 400, curveY: 380,
      cardX: 340, cardY: 320,
      position: 'above',
      icon: Target,
      color: '#f39c12',
      title: 'AI Assessment',
      bubbleTitle: 'AI Assessment',
      bubbleDescription: '• Business analysis<br/>• Goal identification',
      bubblePosition: 'right'
    },
    {
      id: 3,
      curveX: 600, curveY: 320,
      cardX: 540, cardY: 260,
      position: 'above',
      icon: Bot,
      color: '#5271ff',
      title: 'AI Solutions',
      bubbleTitle: 'AI Solutions',
      bubbleDescription: '• System automation<br/>• Custom AI solutions',
      bubblePosition: 'right'
    },
    {
      id: 4,
      curveX: 800, curveY: 260,
      cardX: 740, cardY: 200,
      position: 'above',
      icon: TrendingUp,
      color: '#00bf63',
      title: 'Growth Acceleration',
      bubbleTitle: 'Growth Acceleration',
      bubbleDescription: '• Enhanced productivity<br/>• Increased efficiency',
      bubblePosition: 'left'
    },
    {
      id: 5,
      curveX: 1000, curveY: 200,
      cardX: 940, cardY: 140,
      position: 'above',
      icon: Rocket,
      color: '#00bf63',
      title: 'Peak Performance',
      bubbleTitle: 'Peak Performance',
      bubbleDescription: '• Market leadership<br/>• Sustainable growth',
      bubblePosition: 'left'
    }
  ];

  const generateCurvePath = () => {
    const points = milestones.map(m => ({ x: m.curveX, y: m.curveY }));
    let path = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      
      if (i === 1) {
        const cp1x = prev.x + (curr.x - prev.x) * 0.5;
        const cp1y = prev.y;
        const cp2x = curr.x - (curr.x - prev.x) * 0.3;
        const cp2y = curr.y;
        path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
      } else {
        const cp1x = prev.x + (curr.x - prev.x) * 0.3;
        const cp1y = prev.y;
        const cp2x = curr.x - (curr.x - prev.x) * 0.3;
        const cp2y = curr.y;
        path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
      }
    }
    
    return path;
  };

  return (
    <div className="relative bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-center mb-6">
          <div 
            className="bg-white border-3 border-solid px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            style={{ 
              borderColor: '#5271ff',
              boxShadow: '0 6px 20px rgba(82, 113, 255, 0.2)'
            }}
          >
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center justify-center gap-3">
              <span className="text-2xl">🚀</span>
              <span>Welcome to MasterProDev</span>
            </h1>
          </div>
        </div>

        <div 
          className="rounded-3xl p-8 md:p-12 border-4 border-solid"
          style={{
            backgroundColor: '#ffffff',
            borderColor: '#5271ff',
            boxShadow: '0 10px 30px rgba(82, 113, 255, 0.1)'
          }}
        >
          <section id="home" className="relative text-black overflow-hidden min-h-[90vh] flex items-center justify-center">
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
              <div className="mb-6">
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
                  <span style={{ color: '#ffb400' }}>Master</span>
                  <span style={{ color: '#5271ff' }}>Pro</span>
                  <span style={{ color: '#00bf63' }}>Dev</span>
                </h1>
                <p className="text-lg md:text-xl mb-3 text-gray-700">
                  Elite AI Consultants 👨‍💼 Transforming Careers 🚀 & Businesses 🏢 Building Success Stories 🏆
                </p>
              </div>

              <div className="mt-8 max-w-xl mx-auto">
                <form onSubmit={handleSearchSubmit} className="w-full crt-search-container rounded-full bg-gray-900 shadow-inner">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search for services or consultants..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="crt-search-input w-full pl-5 pr-12 py-3 text-green-300 placeholder-green-700 bg-transparent border-0 rounded-full focus:ring-0"
                    />
                    <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-green-500 hover:text-green-400 transition-colors">
                      <Search className="w-5 h-5" />
                    </button>
                  </div>
                </form>
              </div>
              
              <div className="mb-8" ref={chartRef}>
                <h2 className="text-xl md:text-2xl font-bold text-center text-black mb-6">
                  Enhance Your Professional Growth & Business Success with <span style={{ color: '#ffb400' }}>AI Consulting</span>
                </h2>
                <div className="max-w-7xl mx-auto p-6 md:p-8 bg-gray-50 rounded-2xl relative shadow-inner overflow-hidden">
                  <svg
                    className="w-full h-auto"
                    viewBox="0 0 1200 600"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    <defs>
                      <linearGradient id="heroClientGrowthGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#e74c3c" />
                        <stop offset="30%" stopColor="#f39c12" />
                        <stop offset="70%" stopColor="#5271ff" />
                        <stop offset="100%" stopColor="#00bf63" />
                      </linearGradient>
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="5" result="coloredBlur"/> 
                        <feMerge> 
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/> 
                        </feMerge>
                      </filter>
                      <filter id="pillGlow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                        <feMerge> 
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/> 
                        </feMerge>
                      </filter>
                    </defs>

                    <rect x="0" y="0" width="1200" height="600" fill="transparent" />

                    <g opacity="0.1">
                      <line x1="0" y1="150" x2="1200" y2="150" stroke="#000" strokeWidth="1" strokeDasharray="5,5" />
                      <line x1="0" y1="300" x2="1200" y2="300" stroke="#000" strokeWidth="1" strokeDasharray="5,5" />
                      <line x1="0" y1="450" x2="1200" y2="450" stroke="#000" strokeWidth="1" strokeDasharray="5,5" />
                    </g>

                    {featurePills.map((pill) => {
                      return (
                        <g key={pill.id}>
                          <foreignObject 
                            x={pill.x} 
                            y={pill.y} 
                            width={pillWidth} 
                            height={pillHeight} 
                            style={{ overflow: 'visible' }}
                          >
                            <div
                              className={`pill-container ${isVisible ? 'is-visible' : ''}`}
                              style={{ animationDelay: pill.animationDelay }}
                            >
                              <div 
                                className="feature-pill"
                                style={{ 
                                  backgroundColor: `${pill.color}15`,
                                  color: pill.color
                                }}
                              >
                                <div className="pill-icon" style={{ backgroundColor: `${pill.color}25` }}>
                                  <span className="text-lg">{pill.icon}</span>
                                </div>
                                <div className="pill-content">
                                  <div className="pill-title" style={{ color: pill.color }}>
                                    {pill.title}
                                  </div>
                                  <div className="pill-description">
                                    {pill.description}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </foreignObject>
                        </g>
                      );
                    })}

                    <path
                      id="growth-path-default"
                      d={generateCurvePath()}
                      stroke="url(#heroClientGrowthGradient)"
                      strokeWidth="8"
                      fill="transparent"
                      strokeLinecap="round"
                      filter="url(#glow)"
                      strokeDasharray="2000"
                      strokeDashoffset={isVisible ? 0 : 2000}
                      className={isVisible ? 'growth-path-active' : ''}
                      style={{ transition: 'stroke-dashoffset 5s ease-in-out' }}
                    />
                    
                    {isVisible && (
                      <g>
                        <circle 
                          r="8" 
                          fill="#00bf63" 
                          opacity="0.6"
                          cx="1000"
                          cy="200"
                        />
                        <circle 
                          r="4" 
                          fill="white"
                          cx="1000"
                          cy="200"
                        />
                      </g>
                    )}

                    {milestones.map((milestone) => {
                        const Icon = milestone.icon;
                        const isHovered = hoveredMilestone === milestone.id;
                          
                        return (
                          <g 
                            key={milestone.id} 
                            className={visibleMilestones.includes(milestone.id) ? 'milestone-visible' : 'milestone-hidden'}
                          >
                            <foreignObject 
                              x={milestone.cardX} 
                              y={milestone.cardY} 
                              width="120" 
                              height="120" 
                              style={{ overflow: 'visible' }}
                            >
                              <div
                                className="w-full h-full relative"
                                onMouseEnter={() => setHoveredMilestone(milestone.id)}
                                onMouseLeave={() => setHoveredMilestone(null)}
                                style={{ zIndex: isHovered ? 200 : 100 }}
                              >
                                <div 
                                  className="w-[120px] h-[120px] rounded-2xl bg-white/60 backdrop-blur-md transition-all duration-300 cursor-pointer flex flex-col items-center justify-center p-3 relative"
                                  style={{ 
                                    transform: isHovered ? 'translateY(-8px) scale(1.05)' : 'translateY(0) scale(1)',
                                    boxShadow: isHovered ? `0 20px 40px ${milestone.color}30, 0 8px 20px ${milestone.color}20` : '0 10px 25px rgba(0,0,0,0.1)',
                                    zIndex: isHovered ? 300 : 200
                                  }}
                                >
                                  {isHovered && (
                                    <div 
                                      className="absolute inset-0 rounded-xl animate-pulse"
                                      style={{
                                        background: `radial-gradient(circle at center, ${milestone.color}15 0%, ${milestone.color}08 70%, transparent 100%)`,
                                        zIndex: -1
                                      }}
                                    />
                                  )}
                                  
                                  <div 
                                    className="relative w-14 h-14 rounded-full flex items-center justify-center mb-2 transition-all duration-500 ease-out"
                                    style={{ 
                                      background: isHovered ? '#ffffff' : `${milestone.color}15`,
                                      color: milestone.color,
                                      transform: isHovered 
                                        ? 'translateY(-20px) scale(1.4) rotate(12deg)' 
                                        : 'translateY(0) scale(1) rotate(0deg)',
                                      boxShadow: isHovered 
                                        ? `0 20px 40px ${milestone.color}50, 0 10px 25px ${milestone.color}30, inset 0 0 15px rgba(255,255,255,0.8)`
                                        : 'none',
                                      zIndex: isHovered ? 400 : 300,
                                      border: 'none'
                                    }}
                                  >
                                    <Icon 
                                      className="w-7 h-7 transition-all duration-400" 
                                      style={{
                                        filter: isHovered ? `drop-shadow(0 0 8px rgba(255,255,255,0.9)) drop-shadow(0 0 15px ${milestone.color}60)` : 'none',
                                        transform: isHovered ? 'scale(1.15)' : 'scale(1)'
                                      }}
                                    />
                                    
                                    {isHovered && (
                                      <>
                                        <div 
                                          className="absolute inset-0 rounded-full border-2 animate-ping"
                                          style={{ borderColor: milestone.color, transform: 'scale(1.3)', opacity: 0.7 }}
                                        />
                                        <div 
                                          className="absolute inset-0 rounded-full border-1 animate-pulse"
                                          style={{ borderColor: `${milestone.color}60`, transform: 'scale(1.6)', opacity: 0.4 }}
                                        />
                                      </>
                                    )}
                                  </div>
                                  
                                  <h4 className="text-sm font-semibold text-gray-900 text-center leading-tight px-1">
                                    {milestone.title}
                                  </h4>
                                </div>

                                {isHovered && (
                                  <div 
                                    className={`absolute ${milestone.bubblePosition === 'left' ? 'right-full top-1/2 -translate-y-1/2 mr-6' : 'left-full top-1/2 -translate-y-1/2 ml-6'}`}
                                    style={{
                                      animation: 'chatBubbleBounceSide 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                                      zIndex: 500
                                    }}
                                  >
                                    <div 
                                      className="relative text-gray-800 text-xs rounded-xl px-4 py-3 shadow-xl border-2"
                                      style={{ 
                                        backgroundColor: '#ffffff',
                                        opacity: 1,
                                        minWidth: '200px',
                                        maxWidth: '240px',
                                        borderColor: milestone.color,
                                        boxShadow: `0 15px 35px rgba(0,0,0,0.2), 0 0 20px ${milestone.color}25`
                                      }}
                                    >
                                      <div className="text-left">
                                        <div 
                                          className="font-bold mb-2 text-sm"
                                          style={{ color: milestone.color }}
                                          dangerouslySetInnerHTML={{ __html: highlightKeywords(milestone.bubbleTitle) }}
                                        />
                                        <div 
                                          className="text-gray-600 leading-relaxed text-xs"
                                          dangerouslySetInnerHTML={{ __html: highlightKeywords(milestone.bubbleDescription) }}
                                        />
                                      </div>
                                      
                                      <div 
                                        className={`absolute top-1/2 transform -translate-y-1/2 ${milestone.bubblePosition === 'left' ? 'left-full' : 'right-full'}`}
                                        style={{
                                          width: 0, height: 0,
                                          borderTop: '10px solid transparent', borderBottom: '10px solid transparent',
                                          borderLeft: milestone.bubblePosition === 'left' ? `10px solid ${milestone.color}` : 'none',
                                          borderRight: milestone.bubblePosition === 'right' ? `10px solid ${milestone.color}` : 'none'
                                        }}
                                      />
                                      
                                      <div 
                                        className="absolute top-0 left-0 w-full h-2 rounded-t-xl"
                                        style={{ backgroundColor: milestone.color }}
                                      />
                                    </div>
                                  </div>
                                )}
                              </div>
                            </foreignObject>
                          </g>
                        );
                      })}
                  </svg>
                </div>
              </div>
              
              <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto">
                <div className="text-center">
                  <div className="text-xl font-bold" style={{ color: '#ffb400' }}>200+</div>
                  <div className="text-xs text-gray-600">Careers Transformed</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold" style={{ color: '#5271ff' }}>150+</div>
                  <div className="text-xs text-gray-600">Businesses Scaled</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold" style={{ color: '#00bf63' }}>95%</div>
                  <div className="text-xs text-gray-600">Client Success Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold" style={{ color: '#ffb400' }}>5x</div>
                  <div className="text-xs text-gray-600">Average ROI</div>
                </div>
              </div>
              
              <div className="mt-6">
                <Button size="lg" className="text-white mr-4 mb-3" style={{ backgroundColor: '#5271ff' }} asChild>
                  <a href="#services">Explore AI Services</a>
                </Button>
                <Button size="lg" variant="outline" className="text-black border-black hover:bg-black hover:text-white mb-3" asChild>
                  <a href="#contact">Get Started Today</a>
                </Button>
              </div>
            </div>
            
            <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-gray-50 to-transparent"></div>
            
            <div className="absolute bottom-0 w-full py-2 bg-black/90 backdrop-blur-sm overflow-hidden">
              <div className="whitespace-nowrap marquee-text text-sm font-semibold text-white">
                <span className="mx-4">🚀 Magnetize Attention</span>
                <span className="mx-4">🎯 Amplify Your Presence</span>
                <span className="mx-4">🌟 Elevate to Excellence</span>
                <span className="mx-4">💡 Shine Bright & Stand Out</span>
                <span className="mx-4">🔥 Command the Spotlight!</span>
              </div>
            </div>
          </section>
        </div>
      </div>
      
      <style jsx>{`
        .milestone-hidden {
          opacity: 0;
          transform: scale(0.5) translateY(30px);
        }
        .milestone-visible {
          opacity: 1;
          transform: scale(1) translateY(0);
          transition: opacity 0.4s ease-out, transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
        
        @keyframes pillAppear {
          from { opacity: 0; transform: scale(0.8) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        
        @keyframes floatEffect {
          0%, 100% { 
            transform: translateY(0px);
          }
          50% { 
            transform: translateY(-4px);
          }
        }

        .pill-container {
          opacity: 0;
          animation-name: pillAppear, floatEffect;
          animation-duration: 0.6s, 4s;
          animation-timing-function: cubic-bezier(0.68, -0.55, 0.265, 1.55), ease-in-out;
          animation-fill-mode: forwards, none;
          animation-iteration-count: 1, infinite;
          animation-play-state: paused;
        }

        .pill-container.is-visible {
          animation-play-state: running;
        }
        
        .feature-pill {
          display: flex;
          align-items: center;
          width: 100%;
          height: 100%;
          border-radius: 30px;
          backdrop-filter: blur(10px);
          padding: 8px 12px;
          gap: 8px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.05);
          transition: all 0.3s ease;
          cursor: pointer;
        }
        
        .feature-pill:hover {
          transform: translateY(-3px) scale(1.05);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
          filter: brightness(1.1);
        }
        
        .pill-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        
        .pill-content {
          flex: 1;
          text-align: left;
        }
        
        .pill-title {
          font-size: 11px;
          font-weight: 700;
          line-height: 1.2;
          margin-bottom: 2px;
        }
        
        .pill-description {
          font-size: 9px;
          opacity: 0.8;
          line-height: 1.2;
        }

        .growth-path-active {
          animation: pathSubtlePulse 3s infinite alternate ease-in-out 5s;
        }

        @keyframes pathSubtlePulse {
          0% { stroke-width: 8px; opacity: 0.9; }
          50% { stroke-width: 9px; opacity: 1; }
          100% { stroke-width: 8px; opacity: 0.9; }
        }
        
        @keyframes chatBubbleBounceSide {
          0% {
            transform: translateY(-50%) translateX(-30px) scale(0.3);
            opacity: 0;
          }
          50% {
            transform: translateY(-50%) translateX(15px) scale(1.1);
            opacity: 0.8;
          }
          70% {
            transform: translateY(-50%) translateX(-8px) scale(0.95);
            opacity: 1;
          }
          100% {
            transform: translateY(-50%) translateX(0) scale(1);
            opacity: 1;
          }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .5; }
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        .animate-ping {
          animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .marquee-text {
          animation: marquee 15s linear infinite;
        }
      `}</style>
    </div>
  );
}
