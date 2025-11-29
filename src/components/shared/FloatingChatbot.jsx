import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { X, Send, Mic, MicOff, ThumbsUp, ThumbsDown } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Service } from '@/entities/Service';
import { Consultant } from '@/entities/Consultant';

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi there! I'm your MasterProDev AI assistant. I can help you learn about our AI services, connect you with our expert consultants, or answer questions about career development and business growth. How can I assist you today? 🤖",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [contextData, setContextData] = useState(null);
  const [isListening, setIsListening] = useState(false);
  
  // Data integration state
  const [services, setServices] = useState([]);
  const [consultants, setConsultants] = useState([]);
  
  // Page context tracking
  const [currentPage, setCurrentPage] = useState('');
  const [pageTimeSpent, setPageTimeSpent] = useState(0);
  const pageTimerRef = useRef(null);
  
  // Proactive assistance state
  const [hasOfferedProactiveHelp, setHasOfferedProactiveHelp] = useState(false);
  
  // State for thought bubble
  const [showBubble, setShowBubble] = useState(false);
  const [bubbleMessage, setBubbleMessage] = useState('');
  const [isHovering, setIsHovering] = useState(false);
  
  const idleTimer20Ref = useRef(null);
  const idleTimer45Ref = useRef(null);
  const bubbleHideTimerRef = useRef(null);
  const initialBubbleTimerRef = useRef(null);
  const lastActivityRef = useRef(Date.now());
  const hasShownInitialRef = useRef(false);
  const hasShown20sRef = useRef(false);
  const hasShown45sRef = useRef(false);

  // Bubble messages based on timing
  const bubbleMessages = {
    initial: "Hi there 👋 Need help navigating or choosing a service?",
    idle20s: "Looks like you're exploring — need help optimizing your journey?",
    idle45s: "Ask me anything — I'm here to assist you 📌"
  };

  // Fetch services and consultants data on mount
  useEffect(() => {
    async function fetchData() {
      try {
        const [servicesData, consultantsData] = await Promise.all([
          Service.list(),
          Consultant.list()
        ]);
        setServices(servicesData);
        setConsultants(consultantsData);
      } catch (err) {
        console.error('Failed to fetch chatbot data:', err);
      }
    }
    fetchData();
  }, []);

  // Track current page and time spent
  useEffect(() => {
    const updateCurrentPage = () => {
      const path = window.location.pathname;
      const pageName = path.split('/').pop() || 'Home';
      setCurrentPage(pageName);
      setPageTimeSpent(0);
      setHasOfferedProactiveHelp(false);
    };

    updateCurrentPage();
    window.addEventListener('popstate', updateCurrentPage);

    // Track time spent on page
    pageTimerRef.current = setInterval(() => {
      setPageTimeSpent(prev => prev + 1);
    }, 1000);

    return () => {
      window.removeEventListener('popstate', updateCurrentPage);
      if (pageTimerRef.current) clearInterval(pageTimerRef.current);
    };
  }, []);

  // Proactive assistance based on page and time
  useEffect(() => {
    if (hasOfferedProactiveHelp || isOpen) return;

    const proactiveMessages = {
      'HireConsultant': { time: 30, message: "Looking for the right consultant? I can help you find the perfect match for your needs! 🎯" },
      'ServicesPage': { time: 25, message: "Exploring our services? Let me help you find the best solution for your goals! 💡" },
      'ContactPage': { time: 20, message: "Have questions before reaching out? I'm here to help! 📬" },
      'TellYourIdeaPage': { time: 15, message: "Need help articulating your idea? I can guide you through it! ✨" }
    };

    const pageConfig = proactiveMessages[currentPage];
    if (pageConfig && pageTimeSpent >= pageConfig.time) {
      setHasOfferedProactiveHelp(true);
      showBubbleWithMessage(pageConfig.message, 8000);
    }
  }, [pageTimeSpent, currentPage, hasOfferedProactiveHelp, isOpen]);

  // Build dynamic context with real data
  const buildDynamicContext = () => {
    const servicesList = services.map(s => `- ${s.name} (${s.category}): ${s.description}`).join('\n');
    const consultantsList = consultants.map(c => 
      `- ${c.name} (${c.title}): ${c.servicesOffered?.join(', ')} | Rate: $${c.hourlyRate}/hr | Location: ${c.location}`
    ).join('\n');

    return `
You are the AI assistant for MasterProDev - a leading AI consulting company based in Toronto, ON, Canada.

COMPANY OVERVIEW:
- Email: masterprodevconsultant@outlook.com
- Location: Toronto, ON, Canada
- Mission: Empower professionals and businesses through AI transformation
- Tagline: "Elevating Your Professional Journey"

OUR SERVICES (REAL-TIME DATA):
${servicesList || 'No services available at the moment.'}

OUR CONSULTANTS (REAL-TIME DATA):
${consultantsList || 'No consultants available at the moment.'}

USER CONTEXT:
- Currently viewing: ${currentPage} page
- Time on page: ${pageTimeSpent} seconds

YOUR ROLE AS THE CHATBOT:
- Answer questions about MasterProDev's services and offerings using the REAL data above
- Recommend specific consultants based on user needs
- Guide users to the right service or consultant for their needs
- Help users navigate the website and find relevant information
- Qualify leads and direct them to contact forms or consultation bookings
- Always be professional, helpful, and sales-oriented (but not pushy)
- When recommending consultants, mention their name, expertise, and hourly rate
`;
  };

  // Handle feedback
  const handleFeedback = (messageId, isPositive) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, feedback: isPositive ? 'positive' : 'negative' } : msg
    ));
  };

  useEffect(() => {
    const handleChatbotOpen = (event) => {
      setIsOpen(true);
      
      if (event.detail) {
        const { formData, uploadedFiles, metadata } = event.detail;
        setContextData({ formData, uploadedFiles, metadata });
        
        let contextMessage = `Great! I received your submission`;
        
        if (formData.ideaTitle) {
          contextMessage += ` about "${formData.ideaTitle}"`;
        }
        
        if (uploadedFiles && uploadedFiles.length > 0) {
          const fileTypes = uploadedFiles.map(f => f.isRecording ? 'voice note' : 'file').join(', ');
          contextMessage += `. I see you've shared ${uploadedFiles.length} ${uploadedFiles.length === 1 ? 'item' : 'items'} (${fileTypes})`;
        }
        
        if (formData.externalLink) {
          contextMessage += `, plus an external link`;
        }
        
        contextMessage += `. Let me help you develop this further. What specific aspect would you like to explore first?`;
        
        setMessages(prev => [...prev, {
          id: Date.now(),
          text: contextMessage,
          isBot: true,
          timestamp: new Date()
        }]);
      }
    };

    window.addEventListener('openChatbotWithContext', handleChatbotOpen);
    window.addEventListener('openChatbot', handleChatbotOpen);
    return () => {
      window.removeEventListener('openChatbotWithContext', handleChatbotOpen);
      window.removeEventListener('openChatbot', handleChatbotOpen);
    };
  }, []);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const siteContext = buildDynamicContext();
      let prompt = '';
      
      // Build conversation history for context
      const recentMessages = messages.slice(-6).map(m => 
        `${m.isBot ? 'Assistant' : 'User'}: ${m.text}`
      ).join('\n');
      
      if (contextData) {
        const { formData, uploadedFiles } = contextData;
        
        prompt = `${siteContext}

CONTEXT FROM USER'S FORM SUBMISSION:
- Idea Title: ${formData?.ideaTitle || 'None'}
- External Link: ${formData?.externalLink || 'None'}
- Files Uploaded: ${uploadedFiles?.length || 0} files
- Contact Info: ${formData?.email || 'Not provided'}, ${formData?.phone || 'Not provided'}

RECENT CONVERSATION:
${recentMessages}

USER'S CURRENT MESSAGE: ${inputMessage}

Respond as MasterProDev's AI assistant. Reference their submitted information and guide them toward our services or consultants that can help. Use the real consultant and service data provided.`;
      } else {
        prompt = `${siteContext}

RECENT CONVERSATION:
${recentMessages}

USER'S CURRENT MESSAGE: ${inputMessage}

Respond as MasterProDev's AI assistant. Provide helpful information about our services and guide the user toward solutions we offer. Use the real consultant and service data provided when relevant.`;
      }

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: prompt,
        add_context_from_internet: false
      });

      const botMessage = {
        id: Date.now() + 1,
        text: response,
        isBot: true,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        text: "I apologize, but I'm experiencing technical difficulties. Please try again or contact us directly at masterprodevconsultant@outlook.com",
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleVoice = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputMessage(transcript);
    };

    recognition.start();
  };

  // Show bubble with auto-hide timer
  const showBubbleWithMessage = (message, duration = 6000) => {
    setBubbleMessage(message);
    setShowBubble(true);
    
    if (bubbleHideTimerRef.current) {
      clearTimeout(bubbleHideTimerRef.current);
    }
    
    bubbleHideTimerRef.current = setTimeout(() => {
      if (!isHovering && !isOpen) {
        setShowBubble(false);
      }
    }, duration);
  };

  // Handle mouse enter
  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  // Handle mouse leave
  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  // Reset idle timers on user activity
  const resetIdleTimers = () => {
    lastActivityRef.current = Date.now();
    
    // Clear existing timers
    if (idleTimer20Ref.current) {
      clearTimeout(idleTimer20Ref.current);
    }
    if (idleTimer45Ref.current) {
      clearTimeout(idleTimer45Ref.current);
    }
    
    // Set 20s idle timer (only if not shown yet)
    if (!hasShown20sRef.current) {
      idleTimer20Ref.current = setTimeout(() => {
        if (!isOpen && !isHovering) {
          hasShown20sRef.current = true;
          showBubbleWithMessage(bubbleMessages.idle20s, 7000);
        }
      }, 20000);
    }
    
    // Set 45s idle timer (only if not shown yet)
    if (!hasShown45sRef.current) {
      idleTimer45Ref.current = setTimeout(() => {
        if (!isOpen && !isHovering) {
          hasShown45sRef.current = true;
          showBubbleWithMessage(bubbleMessages.idle45s, 7000);
        }
      }, 45000);
    }
  };

  // Initial greeting bubble (2s after mount)
  useEffect(() => {
    if (!hasShownInitialRef.current) {
      initialBubbleTimerRef.current = setTimeout(() => {
        hasShownInitialRef.current = true;
        showBubbleWithMessage(bubbleMessages.initial, 6000);
      }, 2000);
    }

    return () => {
      if (initialBubbleTimerRef.current) {
        clearTimeout(initialBubbleTimerRef.current);
      }
    };
  }, []);

  // Track user activity for idle detection
  useEffect(() => {
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    activityEvents.forEach(event => {
      window.addEventListener(event, resetIdleTimers);
    });

    // Initial timer setup
    resetIdleTimers();

    return () => {
      activityEvents.forEach(event => {
        window.removeEventListener(event, resetIdleTimers);
      });
      if (idleTimer20Ref.current) {
        clearTimeout(idleTimer20Ref.current);
      }
      if (idleTimer45Ref.current) {
        clearTimeout(idleTimer45Ref.current);
      }
      if (bubbleHideTimerRef.current) {
        clearTimeout(bubbleHideTimerRef.current);
      }
    };
  }, [isOpen, isHovering]);

  return (
    <>
      {/* Floating Button - Bottom Right with NATO-Style 4-Point Star */}
      <div 
        className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4"
        style={{ zIndex: 9999 }}
      >
        {/* Thought Bubble - Now appears ABOVE the button */}
        {showBubble && !isOpen && (
          <div className="thought-bubble-container-top">
            <div className="thought-bubble-top">
              <p className="thought-bubble-text">{bubbleMessage}</p>
              {/* Thought bubble circles pointing DOWN to button */}
              <div className="thought-circle-down thought-circle-1"></div>
              <div className="thought-circle-down thought-circle-2"></div>
              <div className="thought-circle-down thought-circle-3"></div>
            </div>
          </div>
        )}

        {/* Main Button with 4-Color Gradient */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="floating-assistant-button"
          title="Chat with AI Assistant"
          aria-label="Open AI Assistant Chat"
        >
          {/* SVG NATO-Style 4-Pointed Star with Enhanced Gradient */}
          <svg className="nato-star-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            {/* Outer glow effect with gradient colors */}
            <circle cx="50" cy="50" r="48" fill="url(#outerGlowEnhanced)" opacity="0.5" className="glow-pulse"/>
            
            {/* Main circular base with enhanced 4-color conic gradient */}
            <circle cx="50" cy="50" r="45" fill="url(#mainGradientEnhanced)" className="base-circle"/>
            
            {/* Animated rotating gradient ring */}
            <circle cx="50" cy="50" r="45" fill="none" stroke="url(#ringGradientEnhanced)" strokeWidth="2" className="border-ring-animated" opacity="0.8"/>
            
            {/* 4-Pointed NATO Star - Sharp and Symmetrical */}
            <path 
              d="M 50 15 L 55 45 L 85 50 L 55 55 L 50 85 L 45 55 L 15 50 L 45 45 Z" 
              fill="white" 
              className="star-shape"
              filter="url(#starShadowEnhanced)"
            />
            
            {/* Inner star highlight for depth */}
            <path 
              d="M 50 20 L 53 45 L 80 50 L 53 55 L 50 80 L 47 55 L 20 50 L 47 45 Z" 
              fill="url(#starHighlightEnhanced)" 
              opacity="0.5"
              className="star-highlight"
            />
            
            {/* Center dot with gradient */}
            <circle cx="50" cy="50" r="6" fill="url(#centerDotGradient)" className="center-dot" filter="url(#dotGlowEnhanced)"/>
            
            {/* Enhanced Gradients and Filters */}
            <defs>
              {/* Enhanced 4-Color Conic-Style Radial Gradient: Purple → Blue → Green → Yellow */}
              <radialGradient id="mainGradientEnhanced" cx="50%" cy="50%">
                <stop offset="0%" stopColor="#7D3CFF" />
                <stop offset="33%" stopColor="#355CFF" />
                <stop offset="66%" stopColor="#00BF63" />
                <stop offset="100%" stopColor="#FFD54F" />
              </radialGradient>
              
              {/* Outer glow gradient with all 4 colors */}
              <radialGradient id="outerGlowEnhanced" cx="50%" cy="50%">
                <stop offset="0%" stopColor="#7D3CFF" stopOpacity="0.6" />
                <stop offset="33%" stopColor="#355CFF" stopOpacity="0.4" />
                <stop offset="66%" stopColor="#00BF63" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#FFD54F" stopOpacity="0.2" />
              </radialGradient>
              
              {/* Animated ring gradient cycling through all colors */}
              <linearGradient id="ringGradientEnhanced" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7D3CFF">
                  <animate attributeName="stop-color" values="#7D3CFF; #355CFF; #00BF63; #FFD54F; #7D3CFF" dur="4s" repeatCount="indefinite" />
                </stop>
                <stop offset="50%" stopColor="#355CFF">
                  <animate attributeName="stop-color" values="#355CFF; #00BF63; #FFD54F; #7D3CFF; #355CFF" dur="4s" repeatCount="indefinite" />
                </stop>
                <stop offset="100%" stopColor="#00BF63">
                  <animate attributeName="stop-color" values="#00BF63; #FFD54F; #7D3CFF; #355CFF; #00BF63" dur="4s" repeatCount="indefinite" />
                </stop>
              </linearGradient>
              
              {/* Star highlight with gradient blend */}
              <radialGradient id="starHighlightEnhanced" cx="50%" cy="30%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#FFD54F" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#7D3CFF" stopOpacity="0.2" />
              </radialGradient>
              
              {/* Center dot gradient */}
              <linearGradient id="centerDotGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="100%" stopColor="#FFD54F" />
              </linearGradient>
              
              {/* Enhanced star shadow filter */}
              <filter id="starShadowEnhanced">
                <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#7D3CFF" floodOpacity="0.4"/>
              </filter>
              
              {/* Enhanced dot glow filter */}
              <filter id="dotGlowEnhanced">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
          </svg>
        </button>
      </div>

      {/* Chat Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="chat-container-gradient rounded-2xl shadow-2xl w-full max-w-md h-[600px] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/20 bg-white/10 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <svg width="24" height="24" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <path d="M 50 15 L 55 45 L 85 50 L 55 55 L 50 85 L 45 55 L 15 50 L 45 45 Z" fill="white"/>
                    <circle cx="50" cy="50" r="6" fill="white"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-white">MasterProDev AI</h3>
                  <p className="text-sm text-white/80">Your AI Guide 🤖</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 messages-gradient-bg">
              {messages.map(message => (
                <div key={message.id} className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}>
                  <div 
                    className={`max-w-xs p-3 rounded-2xl backdrop-blur-sm ${
                      message.isBot 
                        ? 'bg-white/90 text-gray-800 shadow-lg' 
                        : 'bg-gradient-to-r from-[#7D3CFF] to-[#00BF63] text-white shadow-lg'
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                    <div className={`flex items-center justify-between mt-1 ${message.isBot ? 'text-gray-500' : 'text-white/70'}`}>
                      <p className="text-xs">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      {/* Feedback buttons for bot messages */}
                      {message.isBot && message.id !== 1 && (
                        <div className="flex items-center gap-1 ml-2">
                          {message.feedback ? (
                            <span className="text-xs text-gray-400">
                              {message.feedback === 'positive' ? '👍 Thanks!' : '👎 Noted'}
                            </span>
                          ) : (
                            <>
                              <button 
                                onClick={() => handleFeedback(message.id, true)}
                                className="p-1 hover:bg-green-100 rounded-full transition-colors"
                                title="Helpful"
                              >
                                <ThumbsUp className="w-3 h-3 text-gray-400 hover:text-green-500" />
                              </button>
                              <button 
                                onClick={() => handleFeedback(message.id, false)}
                                className="p-1 hover:bg-red-100 rounded-full transition-colors"
                                title="Not helpful"
                              >
                                <ThumbsDown className="w-3 h-3 text-gray-400 hover:text-red-500" />
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/90 text-gray-800 max-w-xs p-3 rounded-2xl backdrop-blur-sm shadow-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-[#7D3CFF] rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-[#00BF63] rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-[#FFD54F] rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                    <span className="text-sm text-gray-500">Thinking...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/20 bg-white/10 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <Textarea
                    placeholder="Ask about our AI services..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="resize-none h-10 pr-12 rounded-full border-2 border-white/30 focus:border-white/60 bg-white/90 backdrop-blur-sm"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleVoice}
                    className={`absolute right-2 top-1/2 transform -translate-y-1/2 ${isListening ? 'text-red-500' : 'text-gray-400'}`}
                    title={isListening ? 'Stop listening' : 'Voice input'}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </Button>
                </div>
                <Button 
                  onClick={handleSendMessage} 
                  disabled={!inputMessage.trim() || isLoading}
                  className="rounded-full w-10 h-10 p-0 bg-gradient-to-r from-[#7D3CFF] to-[#00BF63] hover:from-[#6B2DDD] hover:to-[#00AF53] shadow-lg"
                >
                  <Send className="w-4 h-4 text-white" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        /* Chat Container with Single Smooth Gradient Background */
        .chat-container-gradient {
          background: linear-gradient(135deg, #7D3CFF 0%, #355CFF 50%, #00BF63 100%);
          position: relative;
          box-shadow: 0 25px 50px rgba(53, 92, 255, 0.4);
        }

        /* Messages Area with Subtle Tint */
        .messages-gradient-bg {
          background: rgba(255, 255, 255, 0.08);
          position: relative;
        }

        /* Floating Assistant Button */
        .floating-assistant-button {
          width: 80px;
          height: 80px;
          border: none;
          background: transparent;
          cursor: pointer;
          transition: transform 0.3s ease;
          position: relative;
          animation: buttonFloat 3s ease-in-out infinite;
        }

        .floating-assistant-button:hover {
          transform: scale(1.15);
          animation: buttonFloatHover 1.5s ease-in-out infinite;
        }

        .nato-star-svg {
          width: 100%;
          height: 100%;
          filter: drop-shadow(0 4px 20px rgba(125, 60, 255, 0.5)) 
                  drop-shadow(0 0 15px rgba(53, 92, 255, 0.3));
        }

        .floating-assistant-button:hover .nato-star-svg {
          filter: drop-shadow(0 8px 35px rgba(125, 60, 255, 0.8)) 
                  drop-shadow(0 0 25px rgba(0, 191, 99, 0.6))
                  drop-shadow(0 0 20px rgba(255, 213, 79, 0.4));
        }

        .base-circle {
          transition: all 0.3s ease;
          animation: rotateGradient 8s linear infinite;
        }

        @keyframes rotateGradient {
          0% {
            filter: hue-rotate(0deg) brightness(1);
          }
          50% {
            filter: hue-rotate(20deg) brightness(1.1);
          }
          100% {
            filter: hue-rotate(0deg) brightness(1);
          }
        }

        .floating-assistant-button:hover .base-circle {
          animation: rotateGradientFast 4s linear infinite;
        }

        @keyframes rotateGradientFast {
          0% {
            filter: hue-rotate(0deg) brightness(1.1);
          }
          100% {
            filter: hue-rotate(360deg) brightness(1.2);
          }
        }

        .star-shape {
          transition: all 0.3s ease;
          transform-origin: center;
          animation: starRotate 6s linear infinite;
        }

        .floating-assistant-button:hover .star-shape {
          animation: starRotate 3s linear infinite;
        }

        .star-highlight {
          transform-origin: center;
          animation: starRotate 6s linear infinite;
        }

        .floating-assistant-button:hover .star-highlight {
          animation: starRotate 3s linear infinite;
        }

        .border-ring-animated {
          animation: ringPulseEnhanced 3s ease-in-out infinite;
          stroke-dasharray: 283;
          stroke-dashoffset: 0;
        }

        .floating-assistant-button:hover .border-ring-animated {
          animation: ringRotate 2s linear infinite, ringPulseEnhanced 3s ease-in-out infinite;
        }

        @keyframes ringPulseEnhanced {
          0%, 100% {
            stroke-width: 2;
            opacity: 0.6;
          }
          50% {
            stroke-width: 3.5;
            opacity: 1;
          }
        }

        @keyframes ringRotate {
          0% {
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dashoffset: 283;
          }
        }

        .glow-pulse {
          animation: glowPulseEnhanced 3s ease-in-out infinite;
        }

        @keyframes glowPulseEnhanced {
          0%, 100% {
            opacity: 0.4;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.08);
          }
        }

        .center-dot {
          animation: dotPulseEnhanced 2s ease-in-out infinite;
        }

        @keyframes dotPulseEnhanced {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.4);
            opacity: 0.8;
          }
        }

        /* Thought Bubble Container - POSITIONED ABOVE */
        .thought-bubble-container-top {
          position: relative;
          animation: bubbleAppearFromTop 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          margin-bottom: 8px;
          margin-right: -10px;
        }

        .thought-bubble-top {
          position: relative;
          background: #ffffff;
          padding: 16px 20px;
          border-radius: 20px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
          max-width: 280px;
          min-width: 200px;
          border: 2px solid rgba(53, 92, 255, 0.3);
        }

        .thought-bubble-text {
          margin: 0;
          font-size: 14px;
          font-weight: 600;
          color: #1a202c;
          line-height: 1.5;
        }

        /* Thought Bubble Circles (pointing DOWN to button) */
        .thought-circle-down {
          position: absolute;
          background: #ffffff;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          border: 1px solid rgba(53, 92, 255, 0.2);
        }

        .thought-circle-down.thought-circle-1 {
          width: 12px;
          height: 12px;
          bottom: -20px;
          right: 35px;
          animation: thoughtFloatDown 2s ease-in-out infinite;
        }

        .thought-circle-down.thought-circle-2 {
          width: 8px;
          height: 8px;
          bottom: -28px;
          right: 38px;
          animation: thoughtFloatDown 2s ease-in-out infinite 0.2s;
        }

        .thought-circle-down.thought-circle-3 {
          width: 5px;
          height: 5px;
          bottom: -34px;
          right: 40px;
          animation: thoughtFloatDown 2s ease-in-out infinite 0.4s;
        }

        /* Animations */
        @keyframes buttonFloat {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes buttonFloatHover {
          0%, 100% {
            transform: translateY(0) scale(1.15);
          }
          50% {
            transform: translateY(-8px) scale(1.2);
          }
        }

        @keyframes starRotate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes bubbleAppearFromTop {
          0% {
            opacity: 0;
            transform: scale(0.6) translateY(20px);
          }
          70% {
            transform: scale(1.05) translateY(-5px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes thoughtFloatDown {
          0%, 100% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          50% {
            transform: translateY(3px) scale(1.1);
            opacity: 0.7;
          }
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .floating-assistant-button {
            width: 70px;
            height: 70px;
          }

          .thought-bubble-top {
            max-width: 220px;
            font-size: 13px;
            padding: 12px 16px;
          }
        }
      `}</style>
    </>
  );
}