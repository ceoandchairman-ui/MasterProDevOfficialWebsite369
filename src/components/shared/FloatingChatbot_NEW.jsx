import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Mic, MicOff, ThumbsUp, ThumbsDown, Sparkles, Minimize2, MessageSquare, Bot, User } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Service } from '@/entities/Service';
import { Consultant } from '@/entities/Consultant';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi there! 👋 I'm Armosa, your MasterProDev guide. Need help with Business Optimization, Sales, or Tech Implementation?",
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
  
  const messagesEndRef = useRef(null);
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
    initial: "Hi there 👋 Need help?",
    idle20s: "Exploring? I can help! 🧭",
    idle45s: "Ask me anything 📌"
  };

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
      'HireConsultant': { time: 30, message: "Need help finding a consultant? 🎯" },
      'ServicesPage': { time: 25, message: "Questions about our services? 💡" },
      'ContactPage': { time: 20, message: "I can answer questions first! 📬" },
      'TellYourIdeaPage': { time: 15, message: "Let me help with your idea! ✨" }
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
You are Armosa, the AI assistant for MasterProDev - a leading System Implementation, Business Optimization & Sales company.

COMPANY OVERVIEW:
- Email: masterprodevconsultant@outlook.com
- Location: Toronto, ON, Canada
- Mission: Empower professionals and businesses through AI transformation & System Implementation.

OUR SERVICES (REAL-TIME DATA):
${servicesList || 'No services available at the moment.'}

OUR CONSULTANTS (REAL-TIME DATA):
${consultantsList || 'No consultants available at the moment.'}

USER CONTEXT:
- Currently viewing: ${currentPage} page

YOUR ROLE:
- Be concise and helpful
- Recommend specific consultants when relevant
- Guide users to the right service
- Keep responses brief but informative
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
        
        let contextMessage = `Got your submission`;
        if (formData.ideaTitle) contextMessage += ` about "${formData.ideaTitle}"`;
        contextMessage += `. What would you like to explore?`;
        
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
      const recentMessages = messages.slice(-6).map(m => 
        `${m.isBot ? 'Assistant' : 'User'}: ${m.text}`
      ).join('\n');
      
      let prompt = `${siteContext}

RECENT CONVERSATION:
${recentMessages}

USER'S MESSAGE: ${inputMessage}

Respond helpfully and concisely.`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: prompt,
        add_context_from_internet: false
      });

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: response,
        isBot: true,
        timestamp: new Date()
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: "Sorry, I'm having trouble right now. Please try again or email masterprodevconsultant@outlook.com",
        isBot: true,
        timestamp: new Date()
      }]);
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
      alert('Speech recognition not supported');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event) => setInputMessage(event.results[0][0].transcript);
    recognition.start();
  };

  const showBubbleWithMessage = (message, duration = 6000) => {
    setBubbleMessage(message);
    setShowBubble(true);
    
    if (bubbleHideTimerRef.current) clearTimeout(bubbleHideTimerRef.current);
    
    bubbleHideTimerRef.current = setTimeout(() => {
      if (!isHovering && !isOpen) setShowBubble(false);
    }, duration);
  };

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);

  const resetIdleTimers = () => {
    lastActivityRef.current = Date.now();
    
    if (idleTimer20Ref.current) clearTimeout(idleTimer20Ref.current);
    if (idleTimer45Ref.current) clearTimeout(idleTimer45Ref.current);
    
    if (!hasShown20sRef.current) {
      idleTimer20Ref.current = setTimeout(() => {
        if (!isOpen && !isHovering) {
          hasShown20sRef.current = true;
          showBubbleWithMessage(bubbleMessages.idle20s);
        }
      }, 20000);
    }
    
    if (!hasShown45sRef.current) {
      idleTimer45Ref.current = setTimeout(() => {
        if (!isOpen && !isHovering) {
          hasShown45sRef.current = true;
          showBubbleWithMessage(bubbleMessages.idle45s);
        }
      }, 45000);
    }
  };

  useEffect(() => {
    if (!hasShownInitialRef.current) {
      initialBubbleTimerRef.current = setTimeout(() => {
        hasShownInitialRef.current = true;
        showBubbleWithMessage(bubbleMessages.initial);
      }, 2000);
    }

    return () => {
      if (initialBubbleTimerRef.current) clearTimeout(initialBubbleTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    activityEvents.forEach(event => window.addEventListener(event, resetIdleTimers));
    resetIdleTimers();

    return () => {
      activityEvents.forEach(event => window.removeEventListener(event, resetIdleTimers));
      if (idleTimer20Ref.current) clearTimeout(idleTimer20Ref.current);
      if (idleTimer45Ref.current) clearTimeout(idleTimer45Ref.current);
      if (bubbleHideTimerRef.current) clearTimeout(bubbleHideTimerRef.current);
    };
  }, [isOpen, isHovering]);

  return (
    <>
      {/* Floating Toggle Button (App Style) */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2"
             style={{ zIndex: 9999 }}>
          
          {/* Thought Bubble */}
          <div className={cn(
            "bg-white rounded-2xl p-4 shadow-xl border border-gray-100 max-w-[200px] transform transition-all duration-300 origin-bottom-right mb-2 text-start",
            showBubble ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4 pointer-events-none"
          )}>
             <p className="text-gray-800 text-sm font-medium leading-relaxed">
               {bubbleMessage}
             </p>
             <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white transform rotate-45 border-b border-r border-gray-100"></div>
          </div>

          <Button
            onClick={() => { setIsOpen(true); setShowBubble(false); }}
            className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 group flex items-center justify-center p-0"
          >
            <div className="relative">
               <MessageSquare className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
               <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-indigo-600 rounded-full"></span>
            </div>
          </Button>
        </div>
      )}

      {/* OPEN STATE: SMARTPHONE CHASSIS */}
      {isOpen && (
      <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
        
        {/* Chassis Container with Gradient Border */}
        <div className="relative h-[650px] w-[380px] rounded-[2.5rem] p-[2px] shadow-2xl transition-all">
          
          {/* Animated Gradient Border */}
          <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-blue-500 via-yellow-400 to-green-500 animate-gradient-xy -z-10" />
          
          {/* Main Black Body */}
          <div className="h-full w-full bg-[#0a0a0a] rounded-[calc(2.5rem-2px)] flex flex-col relative overflow-hidden">
            
            {/* Header Island */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 w-[85%]">
              <div className="bg-[#1e1e1e]/80 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 flex items-center justify-between shadow-lg">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                   </div>
                   <div className="flex flex-col">
                     <span className="text-white text-xs font-bold tracking-wide">ARMOSA</span>
                     <div className="flex items-center gap-1">
                       <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                       <span className="text-[10px] text-gray-400">Online</span>
                     </div>
                   </div>
                 </div>
                 
                 <button 
                   onClick={() => setIsOpen(false)}
                   className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                 >
                   <Minimize2 className="w-4 h-4 text-gray-400" />
                 </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-5 pt-24 pb-28 scrollbar-hide">
              {messages.map((msg, index) => (
                <div
                  key={msg.id || index}
                  className={cn(
                    "mb-4 flex flex-col max-w-[85%]",
                    msg.isBot ? "self-start items-start" : "self-end items-end ml-auto"
                  )}
                >
                  <div
                    className={cn(
                      "px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm",
                      msg.isBot 
                        ? "bg-[#1e1e1e] text-gray-100 border border-white/5 rounded-tl-sm"
                        : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-sm"
                    )}
                  >
                    {msg.text}
                  </div>
                  
                  {/* Feedback for Bot */}
                  {msg.isBot && index === messages.length - 1 && (
                     <div className="mt-1 flex gap-2 opacity-50 hover:opacity-100 transition-opacity">
                        <button onClick={() => handleFeedback(msg.id, true)} className="hover:text-green-400 p-1">
                          <ThumbsUp className="w-3 h-3 text-gray-500" />
                        </button>
                        <button onClick={() => handleFeedback(msg.id, false)} className="hover:text-red-400 p-1">
                          <ThumbsDown className="w-3 h-3 text-gray-500" />
                        </button>
                     </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex items-start gap-2 mb-4">
                   <div className="bg-[#1e1e1e] px-4 py-3 rounded-2xl rounded-tl-sm border border-white/5 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                      <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></span>
                   </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Island */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] z-20">
               <div className="bg-[#1e1e1e]/90 backdrop-blur-xl border border-white/10 rounded-[2rem] p-1.5 shadow-2xl flex items-center gap-2 pr-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask Armosa..."
                    className="flex-1 bg-transparent border-none text-white text-sm px-4 focus:ring-0 placeholder:text-gray-500 h-10"
                  />
                  
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={toggleVoice}
                      className={cn(
                        "p-2 rounded-full transition-all",
                        isListening ? "bg-red-500/20 text-red-400 animate-pulse" : "hover:bg-white/10 text-gray-400"
                      )}
                    >
                      {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </button>
                    
                    <button
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim() && !isLoading}
                      className="p-2.5 rounded-full bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
               </div>
            </div>
            
          </div>
        </div>
      </div>
      )}
    </>
  );
}
