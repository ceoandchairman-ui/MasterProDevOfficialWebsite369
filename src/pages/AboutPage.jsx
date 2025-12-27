import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Rocket, Building, Award, DollarSign, Lightbulb, Handshake, Target, UserCheck, TrendingUp, CheckCircle, Coins, Sparkles, Clock, Zap, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function AboutPage() {
  const [statsVisible, setStatsVisible] = useState(false);
  const [animatedStats, setAnimatedStats] = useState({
    interviews: 0,
    leads: 0,
    timeSaved: 0,
    shortlists: 0,
    efficiency: 0,
    growth: 0
  });
  const statsRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !statsVisible) {
          setStatsVisible(true);
          animateStats();
        }
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, [statsVisible]);

  const animateStats = () => {
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;

    const targets = {
      interviews: 5,
      leads: 400,
      timeSaved: 15,
      shortlists: 4,
      efficiency: 95,
      growth: 70
    };

    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setAnimatedStats({
        interviews: Math.floor(targets.interviews * progress),
        leads: Math.floor(targets.leads * progress),
        timeSaved: Math.floor(targets.timeSaved * progress),
        shortlists: Math.floor(targets.shortlists * progress),
        efficiency: Math.floor(targets.efficiency * progress),
        growth: Math.floor(targets.growth * progress)
      });

      if (currentStep >= steps) {
        clearInterval(interval);
        setAnimatedStats(targets);
      }
    }, stepDuration);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        @keyframes imageReveal {
          from {
            opacity: 0;
            transform: scale(0.98) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes lidIconPop {
          0%, 100% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.2) rotate(10deg); }
        }

        @keyframes lidGlow {
          0%, 100% { box-shadow: 0 4px 8px rgba(0,0,0,0.15); }
          50% { box-shadow: 0 4px 16px rgba(82, 113, 255, 0.4), 0 0 20px rgba(82, 113, 255, 0.2); }
        }

        @keyframes rocketLaunch {
          0% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(-5deg); }
          100% { transform: translateY(0) rotate(0deg); }
        }

        @keyframes buildingGrow {
          0% { transform: scaleY(1); }
          50% { transform: scaleY(1.15); }
          100% { transform: scaleY(1); }
        }

        @keyframes checkPop {
          0% { transform: scale(1); }
          30% { transform: scale(1.3); }
          50% { transform: scale(0.9); }
          100% { transform: scale(1); }
        }

        @keyframes dollarSpin {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(360deg); }
        }

        @keyframes lightbulbFlicker {
          0%, 100% { opacity: 1; filter: brightness(1); }
          25% { opacity: 0.7; filter: brightness(0.8); }
          50% { opacity: 1; filter: brightness(1.3); }
          75% { opacity: 0.9; filter: brightness(1.1); }
        }

        @keyframes handshakeShake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-3px); }
          75% { transform: translateX(3px); }
        }

        @keyframes targetPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }

        @keyframes bullseyeRipple {
          0% {
            transform: scale(0.8);
            opacity: 1;
          }
          100% {
            transform: scale(1.8);
            opacity: 0;
          }
        }

        @keyframes shimmerBackground {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes buttonBurst {
          0% {
            box-shadow: 0 0 0 0 rgba(82, 113, 255, 0.7);
          }
          70% {
            box-shadow: 0 0 0 15px rgba(82, 113, 255, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(82, 113, 255, 0);
          }
        }

        @keyframes textShimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        @keyframes patternScroll {
          0% { background-position: 0 0; }
          100% { background-position: 40px 40px; }
        }

        @keyframes sparkleFloat {
          0% { 
            opacity: 0;
            transform: translateY(0) scale(0);
          }
          50% {
            opacity: 1;
            transform: translateY(-10px) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-20px) scale(0);
          }
        }

        @keyframes radialPulse {
          0% {
            box-shadow: 0 0 0 0 rgba(255, 222, 89, 0.7);
          }
          70% {
            box-shadow: 0 0 0 15px rgba(255, 222, 89, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(255, 222, 89, 0);
          }
        }

        .lid-button:hover .lid-icon {
          animation: lidIconPop 0.5s ease-in-out;
        }

        .lid-button:hover {
          animation: lidGlow 0.5s ease-in-out;
        }

        .image-container {
          animation: imageReveal 0.8s ease-out;
          clip-path: polygon(0 0, 100% 0, 100% 85%, 85% 100%, 0 100%);
          transition: all 0.3s ease;
        }

        .image-container:hover {
          transform: scale(1.02);
          box-shadow: 0 20px 40px rgba(0,0,0,0.2);
        }

        .keyword-highlight {
          position: relative;
          transition: all 0.3s ease;
          cursor: default;
          display: inline-block;
        }

        .keyword-highlight:hover {
          text-shadow: 0 0 8px currentColor;
        }

        .keyword-highlight:hover .sparkle-icon {
          animation: sparkleFloat 0.6s ease-out;
        }

        .sparkle-icon {
          position: absolute;
          top: -5px;
          right: -15px;
          opacity: 0;
          pointer-events: none;
        }

        .stat-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .stat-card::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }

        .stat-card:hover::before {
          width: 300px;
          height: 300px;
        }

        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 28px rgba(0,0,0,0.25);
        }

        .stat-card:hover .stat-icon-rocket {
          animation: rocketLaunch 0.6s ease-in-out;
        }

        .stat-card:hover .stat-icon-building {
          animation: buildingGrow 0.6s ease-in-out;
          transform-origin: bottom;
        }

        .stat-card:hover .stat-icon-check {
          animation: checkPop 0.5s ease-in-out;
        }

        .stat-card:hover .stat-icon-dollar {
          animation: dollarSpin 0.6s ease-in-out;
        }

        .stat-card:hover .stat-icon-clock {
          animation: targetPulse 0.5s ease-in-out;
        }

        .stat-card:hover .stat-icon-zap {
          animation: checkPop 0.5s ease-in-out;
        }

        .value-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        }

        .value-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 16px 35px rgba(0,0,0,0.3);
        }

        .value-card-innovation:hover {
          border-color: #ffde59;
          box-shadow: 0 16px 35px rgba(255, 222, 89, 0.3);
        }

        .value-card-client:hover {
          border-color: #00bf63;
          box-shadow: 0 16px 35px rgba(0, 191, 99, 0.3);
        }

        .value-card-results:hover {
          border-color: #5271ff;
          box-shadow: 0 16px 35px rgba(82, 113, 255, 0.3);
        }

        .value-card-innovation:hover .value-icon-lightbulb {
          animation: lightbulbFlicker 0.8s ease-in-out;
        }

        .value-card-client:hover .value-icon-handshake {
          animation: handshakeShake 0.6s ease-in-out;
        }

        .value-card-results:hover .value-icon-target {
          animation: targetPulse 0.6s ease-in-out;
        }

        .value-card-results:hover .bullseye-ripple {
          animation: bullseyeRipple 1s ease-out;
        }

        .cta-section {
          background-image: 
            linear-gradient(rgba(82, 113, 255, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(82, 113, 255, 0.05) 1px, transparent 1px);
          background-size: 20px 20px;
          animation: patternScroll 20s linear infinite;
        }

        .cta-button-primary {
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .cta-button-primary:hover {
          transform: scale(1.05);
          animation: buttonBurst 0.6s ease-out;
        }

        .cta-button-primary:hover .button-text {
          background: linear-gradient(90deg, #ffffff 0%, #ffde59 50%, #ffffff 100%);
          background-size: 200% auto;
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: textShimmer 1s linear infinite;
        }

        .cta-button-secondary {
          transition: all 0.3s ease;
        }

        .cta-button-secondary:hover {
          transform: scale(1.05);
          box-shadow: 0 8px 20px rgba(0, 191, 99, 0.4);
          border-width: 3px;
        }

        @media (max-width: 768px) {
          .image-container {
            clip-path: polygon(0 0, 100% 0, 100% 90%, 90% 100%, 0 100%);
          }
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {/* About Container (The Can) */}
        <div 
          className="rounded-[60px] p-8 md:p-12 border-3 border-solid relative"
          style={{
            backgroundColor: '#5271ff',
            borderColor: '#5271ff',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}
        >
          {/* Lid Title (The Button) - Interactive */}
          <div className="absolute -top-6 left-12">
            <div 
              className="lid-button bg-white border-2 border-solid px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer flex items-center gap-3"
              style={{ 
                borderColor: '#5271ff',
                boxShadow: '0 4px 8px rgba(0,0,0,0.15)'
              }}
            >
              <div className="lid-icon w-8 h-8 rounded-full flex items-center justify-center text-lg">
                ℹ️
              </div>
              <h2 className="text-lg md:text-xl font-bold text-black">
                About Us
              </h2>
            </div>
          </div>

          <section className="mt-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Future-Proof Your Career and Business
                </h1>
                <p className="text-lg text-white/90 italic mb-6">
                  Turn the disruptive wave of AI into your biggest advantage.
                </p>
                <p className="mt-4 text-lg text-white leading-relaxed">
                  At <span style={{ color: '#ffde59' }}>Master</span><span style={{ color: '#ffffff' }}>Pro</span><span style={{ color: '#00bf63' }}>Dev</span>, our mission is to <span className="keyword-highlight font-bold" style={{ color: '#ffde59' }}>future-proof your career and business<Sparkles className="sparkle-icon w-3 h-3" style={{ color: '#ffde59' }} /></span> by turning the disruptive wave of AI into your biggest advantage.
                </p>
                <p className="mt-4 text-lg text-white leading-relaxed">
                  We help professionals and organizations <span className="keyword-highlight font-bold" style={{ color: '#00bf63' }}>stand out, scale up, and succeed<Sparkles className="sparkle-icon w-3 h-3" style={{ color: '#00bf63' }} /></span> using intelligent, customized <span className="keyword-highlight font-bold" style={{ color: '#ffde59' }}>AI-powered strategies<Sparkles className="sparkle-icon w-3 h-3" style={{ color: '#ffde59' }} /></span> — from standout resumes and automated workflows to business acceleration and AI agents.
                </p>
                <p className="mt-4 text-lg text-white leading-relaxed">
                  In a world flooded with AI hype, <span className="keyword-highlight font-bold" style={{ color: '#ffde59' }}>we provide clarity, execution, and real ROI<Sparkles className="sparkle-icon w-3 h-3" style={{ color: '#ffde59' }} /></span>. Whether you're seeking your next opportunity or scaling your business, MasterProDev is your AI-powered partner in unlocking exponential growth.
                </p>
              </div>
              <div className="order-1 md:order-2">
                <div className="image-container overflow-hidden relative" style={{ boxShadow: '0 15px 35px rgba(0,0,0,0.15)' }}>
                  <img 
                    src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2832&auto=format&fit=crop" 
                    alt="About Us - AI Consulting Team" 
                    className="w-full h-64 md:h-96 object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Impact Stats - Interactive Icons - Updated with Real Figures */}
            <div ref={statsRef} className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-6">
              <div 
                className="stat-card bg-white/10 backdrop-blur-sm p-6 rounded-xl border-2"
                style={{ 
                  borderColor: '#ffde59',
                  backgroundColor: 'rgba(255, 222, 89, 0.1)',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.15)'
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Rocket className="stat-icon-rocket w-6 h-6" style={{ color: '#ffde59' }} />
                  <div className="text-3xl font-bold text-[#ffde59]">{animatedStats.interviews}x</div>
                </div>
                <div className="text-sm text-white">Faster Interview Landing</div>
              </div>
              <div 
                className="stat-card bg-white/10 backdrop-blur-sm p-6 rounded-xl border-2"
                style={{ 
                  borderColor: '#5271ff',
                  backgroundColor: 'rgba(82, 113, 255, 0.1)',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.15)'
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="stat-icon-building w-6 h-6" style={{ color: '#ffde59' }} />
                  <div className="text-3xl font-bold text-[#ffde59]">{animatedStats.leads}%</div>
                </div>
                <div className="text-sm text-white">More Leads Generated</div>
              </div>
              <div 
                className="stat-card bg-white/10 backdrop-blur-sm p-6 rounded-xl border-2"
                style={{ 
                  borderColor: '#00bf63',
                  backgroundColor: 'rgba(0, 191, 99, 0.1)',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.15)'
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="stat-icon-clock w-6 h-6" style={{ color: '#00bf63' }} />
                  <div className="text-3xl font-bold text-[#00bf63]">{animatedStats.timeSaved}+</div>
                </div>
                <div className="text-sm text-white">Hours Saved Weekly</div>
              </div>
              <div 
                className="stat-card bg-white/10 backdrop-blur-sm p-6 rounded-xl border-2"
                style={{ 
                  borderColor: '#ffde59',
                  backgroundColor: 'rgba(255, 222, 89, 0.1)',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.15)'
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Award className="stat-icon-dollar w-6 h-6" style={{ color: '#ffde59' }} />
                  <div className="text-3xl font-bold text-[#ffde59]">{animatedStats.shortlists}x</div>
                </div>
                <div className="text-sm text-white">More Job Shortlists</div>
              </div>
              <div 
                className="stat-card bg-white/10 backdrop-blur-sm p-6 rounded-xl border-2"
                style={{ 
                  borderColor: '#5271ff',
                  backgroundColor: 'rgba(82, 113, 255, 0.1)',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.15)'
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="stat-icon-check w-6 h-6" style={{ color: '#00bf63' }} />
                  <div className="text-3xl font-bold text-[#00bf63]">{animatedStats.efficiency}%</div>
                </div>
                <div className="text-sm text-white">Efficiency Boost</div>
              </div>
              <div 
                className="stat-card bg-white/10 backdrop-blur-sm p-6 rounded-xl border-2"
                style={{ 
                  borderColor: '#00bf63',
                  backgroundColor: 'rgba(0, 191, 99, 0.1)',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.15)'
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="stat-icon-zap w-6 h-6" style={{ color: '#ffde59' }} />
                  <div className="text-3xl font-bold text-[#ffde59]">{animatedStats.growth}%+</div>
                </div>
                <div className="text-sm text-white">Startups See Growth in 90 Days</div>
              </div>
            </div>

            {/* Our Values - Enhanced Interactive Cards */}
            <div className="mt-16 grid md:grid-cols-3 gap-8">
              <div className="value-card value-card-innovation bg-white/10 backdrop-blur-sm p-8 rounded-xl border-2 border-transparent" style={{ boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}>
                <div className="flex flex-col items-center mb-4">
                  <div 
                    className="w-20 h-20 rounded-full flex items-center justify-center mb-4 relative"
                    style={{ backgroundColor: 'rgba(255, 222, 89, 0.2)' }}
                  >
                    <Lightbulb className="value-icon-lightbulb w-10 h-10" style={{ color: '#ffde59' }} />
                  </div>
                  <h3 className="text-xl font-bold text-white text-center">Innovation First</h3>
                </div>
                <p className="text-white/90 text-center">We stay ahead of AI trends to bring you cutting-edge solutions that give you a competitive edge.</p>
              </div>
              <div className="value-card value-card-client bg-white/10 backdrop-blur-sm p-8 rounded-xl border-2 border-transparent" style={{ boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}>
                <div className="flex flex-col items-center mb-4">
                  <div 
                    className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
                    style={{ backgroundColor: 'rgba(0, 191, 99, 0.2)' }}
                  >
                    <Handshake className="value-icon-handshake w-10 h-10" style={{ color: '#00bf63' }} />
                  </div>
                  <h3 className="text-xl font-bold text-white text-center">Client-Centric</h3>
                </div>
                <p className="text-white/90 text-center">Your success is our success. We tailor every solution to meet your unique goals and challenges.</p>
              </div>
              <div className="value-card value-card-results bg-white/10 backdrop-blur-sm p-8 rounded-xl border-2 border-transparent" style={{ boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}>
                <div className="flex flex-col items-center mb-4">
                  <div 
                    className="w-20 h-20 rounded-full flex items-center justify-center mb-4 relative"
                    style={{ backgroundColor: 'rgba(82, 113, 255, 0.2)' }}
                  >
                    <Target className="value-icon-target w-10 h-10" style={{ color: '#5271ff' }} />
                    <div className="bullseye-ripple absolute inset-0 rounded-full border-4" style={{ borderColor: '#5271ff', opacity: 0 }}></div>
                  </div>
                  <h3 className="text-xl font-bold text-white text-center">Results-Driven</h3>
                </div>
                <p className="text-white/90 text-center">We focus on delivering measurable outcomes that transform careers and accelerate business growth.</p>
              </div>
            </div>

            {/* Call to Action Section - Animated Background */}
            <div className="mt-16 text-center cta-section bg-white/10 backdrop-blur-sm p-8 md:p-12 rounded-2xl">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Ready to Transform Your Future with AI?
              </h3>
              <p className="text-lg text-white/90 mb-6">
                Discover how our AI-powered solutions can help you achieve your goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link to={createPageUrl('ServicesPage')}>
                  <Button 
                    size="lg" 
                    className="cta-button-primary text-white font-semibold w-full sm:w-auto px-8"
                    style={{ backgroundColor: '#5271ff' }}
                  >
                    <span className="button-text">Explore Our AI Services</span>
                  </Button>
                </Link>
                <Link to={createPageUrl('TellYourIdeaPage')}>
                  <Button 
                    size="lg" 
                    className="cta-button-secondary text-white border-2 border-white hover:bg-white/20 font-semibold w-full sm:w-auto px-8"
                    style={{ backgroundColor: 'transparent' }}
                  >
                    Tell Us Your Idea
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}