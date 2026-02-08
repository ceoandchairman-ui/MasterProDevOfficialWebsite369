import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Mic, MicOff, ThumbsUp, ThumbsDown, Sparkles, Minimize2, MessageSquare, Bot, User, Paperclip } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Service } from '@/entities/Service';
import { Consultant } from '@/entities/Consultant';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState('chat'); // 'chat' | 'avatar'
  const [avatarState, setAvatarState] = useState('idle'); // 'idle' | 'listening' | 'thinking' | 'speaking'

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
    if (!inputMessage.trim() && !contextData) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    if (mode === 'avatar') setAvatarState('thinking');

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

      if (mode === 'avatar') {
        setAvatarState('speaking');
        // Simulate speaking duration roughly based on text length (50ms per char, max 5s)
        setTimeout(() => setAvatarState('idle'), Math.min(5000, response.length * 50));
      }

    } catch (error) {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: "Sorry, I'm having trouble right now. Please try again or email masterprodevconsultant@outlook.com",
        isBot: true,
        timestamp: new Date()
      }]);
      if (mode === 'avatar') setAvatarState('idle');
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
      if (mode === 'avatar') setAvatarState('idle');
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
        setIsListening(true);
        if (mode === 'avatar') setAvatarState('listening');
    };
    recognition.onend = () => {
        setIsListening(false);
        // If we are in avatar mode, we might move to thinking state if we got a result
        if (mode === 'avatar' && !isLoading) setAvatarState('idle');
    };
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        if (mode === 'avatar') {
             // In a perfect world we would wait for state update, but for now just wait a tick
             setTimeout(() => {
                 // handleSendMessage reads current 'inputMessage' state which won't be updated yet inside this closure context easily without a ref or useEffect wrapper.
                 // So we rely on the user to press send or we need to refactor handleSendMessage to accept a param.
                 // Let's rely on manual send to be safe for now in this iteration.
             }, 100);
        }
    };
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
  
  // AVATAR STATUS TEXT MAPPING
  const getAvatarStatusText = () => {
     switch (avatarState) {
         case 'listening': return 'Listening...';
         case 'thinking': return 'Thinking...';
         case 'speaking': return 'Speaking...';
         default: return 'Tap to speak';
     }
  };

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

      <style>{`
        @keyframes listeningPulse {
            0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.7); }
            70% { transform: scale(1.1); box-shadow: 0 0 0 20px rgba(37, 99, 235, 0); }
            100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(37, 99, 235, 0); }
        }
        @keyframes speakingBounce {
            from { transform: scale(1); }
            to { transform: scale(1.05); }
        }
        @keyframes thinkingSpin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .avatar-listening { animation: listeningPulse 1.5s infinite; }
        .avatar-speaking { animation: speakingBounce 0.5s infinite alternate; }
        .avatar-thinking { animation: thinkingSpin 2s infinite linear; background: linear-gradient(135deg, #FFB800 0%, #FF8A00 100%) !important; }
      `}</style>

      {/* OPEN STATE: SMARTPHONE CHASSIS */}
      {isOpen && (
      <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
        
        {/* Chassis Container with Gradient Border */}
        <div className="relative h-[650px] w-[380px] rounded-[2.5rem] p-[2px] shadow-2xl transition-all">
          
          {/* Animated Gradient Border */}
          <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-blue-500 via-yellow-400 to-green-500 animate-gradient-xy -z-10" />
          
          {/* Main Body */}
          <div className="h-full w-full bg-[#f0f2f5] rounded-[calc(2.5rem-2px)] flex flex-col relative overflow-hidden">
             
            {/* Background Gradient similar to user spec */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-600/5 via-yellow-400/5 to-green-500/5 pointer-events-none" />

            {/* Header Island */}
            <div className="flex-shrink-0 p-4 pb-2 z-20">
              <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-3 flex flex-col gap-3">
                 {/* Top Row */}
                 <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2">
                       <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-green-500 flex items-center justify-center shadow-md">
                          <Bot className="w-5 h-5 text-white" />
                       </div>
                       <div>
                         <span className="text-base font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-green-500 block">Armosa</span>
                       </div>
                     </div>
                     <button 
                       onClick={() => setIsOpen(false)}
                       className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                     >
                       <X className="w-5 h-5" />
                     </button>
                 </div>
                 
                 {/* Bottom Row - Tabs */}
                 <div className="flex bg-gray-100 p-1 rounded-xl">
                    <button 
                        onClick={() => setMode('chat')}
                        className={cn(
                            "flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all",
                            mode === 'chat' ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:bg-gray-200/50"
                        )}
                    >
                        <MessageSquare className="w-3.5 h-3.5" /> Chat
                    </button>
                    <button 
                        onClick={() => setMode('avatar')}
                        className={cn(
                            "flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all",
                            mode === 'avatar' ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:bg-gray-200/50"
                        )}
                    >
                        <User className="w-3.5 h-3.5" /> Avatar
                    </button>
                 </div>
              </div>
            </div>

            {/* CONTENT AREA */}
            <div className="flex-1 relative overflow-hidden">
                
                {/* CHAT MODE VIEW */}
                <div className={cn(
                    "absolute inset-0 flex flex-col transition-all duration-300 transform",
                    mode === 'chat' ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0 pointer-events-none"
                )}>
                    <div className="flex-1 overflow-y-auto px-4 py-2 custom-scrollbar">
                      {messages.map((msg, index) => (
                        <div
                          key={msg.id || index}
                          className={cn(
                            "mb-4 flex gap-3 w-full animate-in slide-in-from-bottom-2 duration-300",
                            msg.isBot ? "justify-start" : "justify-end"
                          )}
                        >
                          {msg.isBot && (
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-green-500 flex flex-shrink-0 items-center justify-center mt-1 shadow-sm">
                              <Bot className="w-4 h-4 text-white" />
                            </div>
                          )}

                          <div className={cn(
                            "flex flex-col max-w-[80%]",
                            msg.isBot ? "items-start" : "items-end"
                          )}>
                            <div
                              className={cn(
                                "px-4 py-3 text-sm leading-relaxed shadow-sm",
                                msg.isBot 
                                  ? "bg-white text-gray-800 border border-gray-100 rounded-2xl rounded-tl-sm"
                                  : "bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl rounded-tr-sm"
                              )}
                            >
                              {msg.text}
                            </div>
                            <span className="text-[10px] text-gray-400 mt-1 px-1">
                                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      ))}
                      
                      {isLoading && (
                        <div className="flex items-start gap-3 mb-4">
                           <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-green-500 flex flex-shrink-0 items-center justify-center mt-1">
                              <Bot className="w-4 h-4 text-white" />
                           </div>
                           <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                           </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* AVATAR MODE VIEW */}
                <div className={cn(
                    "absolute inset-0 flex flex-col items-center justify-center transition-all duration-300 transform",
                    mode === 'avatar' ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"
                )}>
                    {/* Animated Waves */}
                    <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
                         <div className={cn("absolute w-[160px] h-[160px] border-2 border-blue-500/10 rounded-full", avatarState === 'listening' && "animate-ping [animation-duration:3s]")} />
                         <div className={cn("absolute w-[220px] h-[220px] border-2 border-blue-500/10 rounded-full", avatarState === 'listening' && "animate-ping [animation-duration:3s] [animation-delay:0.5s]")} />
                         <div className={cn("absolute w-[280px] h-[280px] border-2 border-blue-500/10 rounded-full", avatarState === 'listening' && "animate-ping [animation-duration:3s] [animation-delay:1s]")} />
                    </div>

                    {/* Main Avatar Circle */}
                    <button 
                        onClick={toggleVoice}
                        className={cn(
                            "relative w-32 h-32 rounded-full bg-gradient-to-br from-blue-600 via-blue-500 to-green-400 shadow-2xl flex items-center justify-center z-10 transition-all duration-300",
                            avatarState === 'listening' && "avatar-listening",
                            avatarState === 'speaking' && "avatar-speaking",
                            avatarState === 'thinking' && "avatar-thinking"
                        )}
                    >
                        {avatarState === 'listening' ? (
                             <Mic className="w-14 h-14 text-white" />
                        ) : avatarState === 'thinking' ? (
                             <Sparkles className="w-14 h-14 text-white" />
                        ) : (
                             <Bot className="w-16 h-16 text-white" />
                        )}
                    </button>
                    
                    <p className="mt-8 text-sm font-bold text-gray-500 tracking-wide animate-pulse">
                        {getAvatarStatusText()}
                    </p>
                </div>

            </div>

            {/* Input Island - Hidden in Avatar Mode for cleaner look, or kept if needed. Spec says hidden/modified. */}
            <div className={cn(
                "p-4 pt-2 transition-all duration-300 transform",
                mode === 'avatar' ? "translate-y-20 opacity-0 pointer-events-none hidden" : "translate-y-0 opacity-100"
            )}>
               <div className="bg-white border border-yellow-400/20 rounded-[1.5rem] p-2 shadow-lg flex items-center gap-2">
                  <button className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 transition-colors">
                     <Paperclip className="w-5 h-5" />
                  </button>
                  <button 
                     onClick={toggleVoice}
                     className={cn(
                        "p-2 rounded-xl transition-colors",
                         isListening ? "text-red-500 bg-red-50" : "text-gray-400 hover:bg-gray-100"
                     )}
                  >
                     <Mic className="w-5 h-5" />
                  </button>
                  
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Message Armosa..."
                    className="flex-1 bg-transparent border-none text-gray-800 text-sm px-2 focus:ring-0 placeholder:text-gray-400 h-10 outline-none"
                  />
                  
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() && !isLoading}
                    className="p-2.5 rounded-xl bg-gradient-to-br from-green-400 to-blue-600 text-white shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-95"
                  >
                    <Send className="w-4 h-4" />
                  </button>
               </div>
            </div>
            
          </div>
        </div>
      </div>
      )}
    </>
  );
}
