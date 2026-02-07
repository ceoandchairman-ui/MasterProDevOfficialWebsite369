import React from 'react';
import { Sparkles } from 'lucide-react';

export default function AboutSection() {
  return (
    <div className="py-10 md:py-12 bg-gray-50">
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
      `}</style>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className="rounded-[60px] p-6 md:p-8 border-3 border-solid relative"
          style={{
            backgroundColor: '#5271ff',
            borderColor: '#5271ff',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}
        >
          <div className="absolute -top-6 left-12">
            <div 
              className="lid-button bg-white border-2 border-solid px-5 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer flex items-center gap-2"
              style={{ 
                borderColor: '#5271ff',
                boxShadow: '0 4px 8px rgba(0,0,0,0.15)'
              }}
            >
              <div className="lid-icon w-7 h-7 rounded-full flex items-center justify-center text-base">
                ℹ️
              </div>
              <h2 className="text-base md:text-lg font-bold text-black">
                About Us
              </h2>
            </div>
          </div>

          <section id="about" className="mt-4">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="order-2 md:order-1">
                <p className="mt-4 text-base text-white leading-relaxed">
                  At <span style={{ color: '#ffde59' }}>Master</span><span style={{ color: '#ffffff' }}>Pro</span><span style={{ color: '#00bf63' }}>Dev</span>, we follow one simple principle: <span className="keyword-highlight font-bold" style={{ color: '#ffde59' }}>we implement, document, and hand over systems that work<Sparkles className="sparkle-icon w-3 h-3" style={{ color: '#ffde59' }} /></span>.
                </p>
                <p className="mt-3 text-base text-white leading-relaxed">
                  We are not just consultants; we are builders. Whether you are an individual needing a <span className="keyword-highlight font-bold" style={{ color: '#00bf63' }}>standout career brand</span>, a founder launching a <span className="keyword-highlight font-bold" style={{ color: '#00bf63' }}>digital product</span>, or an enterprise scaling <span className="keyword-highlight font-bold" style={{ color: '#00bf63' }}>software & infrastructure</span>, we bridge the gap between thinking and doing.
                </p>
                <p className="mt-3 text-base text-white leading-relaxed">
                  Our services cover the full spectrum of modern execution: from <span className="keyword-highlight font-bold" style={{ color: '#ffde59' }}>Software Development</span> and <span className="keyword-highlight font-bold" style={{ color: '#ffde59' }}>AI Engineering</span> to <span className="keyword-highlight font-bold" style={{ color: '#ffde59' }}>Strategic Consulting</span>. We deliver assets you own, systems you can control, and results you can measure.
                </p>
              </div>
              <div className="order-1 md:order-2">
                <div className="image-container overflow-hidden relative" style={{ boxShadow: '0 15px 35px rgba(0,0,0,0.15)' }}>
                  <img 
                    src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2832&auto=format&fit=crop" 
                    alt="About Us - AI Consulting Team" 
                    className="w-full h-56 md:h-64 object-cover"
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}