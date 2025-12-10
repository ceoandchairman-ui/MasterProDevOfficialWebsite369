
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { X, Send, Mic, MicOff, ThumbsUp, ThumbsDown, Sparkles, MessageCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Service } from '@/entities/Service';
import { Consultant } from '@/entities/Consultant';


export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,

      text: "Hi there! 👋 I'm your MasterProDev AI assistant. How can I help you today?",

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

You are the AI assistant for MasterProDev - a leading AI consulting company based in Toronto, ON, Canada.

COMPANY OVERVIEW:
- Email: masterprodevconsultant@outlook.com
- Location: Toronto, ON, Canada
- Mission: Empower professionals and businesses through AI transformation


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
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

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
          showBubbleWithMessage(bubbleMessages.idle20s, 7000);
        }
      }, 20000);
    }
    


    if (!hasShown45sRef.current) {
      idleTimer45Ref.current = setTimeout(() => {
        if (!isOpen && !isHovering) {
          hasShown45sRef.current = true;
          showBubbleWithMessage(bubbleMessages.idle45s, 7000);
        }
      }, 45000);
    }
  };



  useEffect(() => {
    if (!hasShownInitialRef.current) {
      initialBubbleTimerRef.current = setTimeout(() => {
        hasShownInitialRef.current = true;
        showBubbleWithMessage(bubbleMessages.initial, 6000);
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

  // Quick action buttons
  const quickActions = [
    { label: "Services", icon: "💼" },
    { label: "Consultants", icon: "👨‍💼" },
    { label: "Pricing", icon: "💰" }
  ];

  const handleQuickAction = (action) => {
    setInputMessage(`Tell me about your ${action.toLowerCase()}`);
  };

  return (
    <>
      {/* Floating Button */}
      <div 
        className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3"
        style={{ zIndex: 9999 }}
      >
        {/* Thought Bubble */}
        {showBubble && !isOpen && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="relative bg-white rounded-2xl px-4 py-3 shadow-xl border border-gray-100 max-w-[200px]">
              <p className="text-sm font-medium text-gray-800">{bubbleMessage}</p>
              <div className="absolute -bottom-2 right-8 w-4 h-4 bg-white border-r border-b border-gray-100 transform rotate-45"></div>

            </div>
          </div>
        )}


        {/* Main Button */}

        <button
          onClick={() => setIsOpen(!isOpen)}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}

          className="group relative w-16 h-16 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-[0_8px_30px_rgba(106,17,203,0.4)]"
          style={{
            background: 'conic-gradient(from 0deg, #6A11CB, #5271ff, #00BF63, #FFD54F, #6A11CB)'
          }}
        >
          <div className="absolute inset-1 bg-white rounded-full flex items-center justify-center">
            <MessageCircle className="w-7 h-7 text-[#6A11CB] group-hover:scale-110 transition-transform" />
          </div>
          
          {/* Pulse ring */}
          <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{
            background: 'conic-gradient(from 0deg, #6A11CB, #5271ff, #00BF63, #FFD54F, #6A11CB)'
          }}></div>
        </button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          ></div>
          
          {/* Chat Container */}
          <div className="relative w-full sm:w-[400px] h-[85vh] sm:h-[600px] sm:max-h-[80vh] bg-white sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
            
            {/* Header */}
            <div className="relative overflow-hidden">
              <div 
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(135deg, #6A11CB 0%, #5271ff 50%, #00BF63 100%)'
                }}
              ></div>
              <div className="relative px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full p-[2px]" style={{
                    background: 'conic-gradient(from 0deg, #6A11CB, #5271ff, #00BF63, #FFD54F, #6A11CB)'
                  }}>
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                                                <img 
                                                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/687824d22dba5b3c55552294/939a8b78b_Screenshot2025-01-21142606.jpg" 
                                                  alt="MasterProDev Logo"
                                                  className="w-full h-full object-contain p-1"
                                                />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">MasterProDev AI</h3>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                      <span className="text-white/80 text-xs">Online</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
              {messages.map(message => (
                <div 
                  key={message.id} 
                  className={`flex ${message.isBot ? 'justify-start' : 'justify-end'} animate-in fade-in slide-in-from-bottom-2 duration-200`}
                >
                  {message.isBot && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6A11CB] to-[#00BF63] flex items-center justify-center mr-2 flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div className={`max-w-[75%] ${message.isBot ? '' : 'order-1'}`}>
                    <div 
                      className={`px-4 py-3 rounded-2xl ${
                        message.isBot 
                          ? 'bg-white shadow-md border border-gray-100 rounded-tl-md' 
                          : 'bg-gradient-to-r from-[#6A11CB] to-[#5271ff] text-white rounded-tr-md'
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                    </div>
                    <div className={`flex items-center gap-2 mt-1 px-1 ${message.isBot ? '' : 'justify-end'}`}>
                      <span className="text-[10px] text-gray-400">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {message.isBot && message.id !== 1 && !message.feedback && (
                        <div className="flex items-center gap-0.5">
                          <button 
                            onClick={() => handleFeedback(message.id, true)}
                            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                          >
                            <ThumbsUp className="w-3 h-3 text-gray-300 hover:text-green-500" />
                          </button>
                          <button 
                            onClick={() => handleFeedback(message.id, false)}
                            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                          >
                            <ThumbsDown className="w-3 h-3 text-gray-300 hover:text-red-400" />
                          </button>
                        </div>
                      )}
                      {message.feedback && (
                        <span className="text-[10px] text-gray-400">
                          {message.feedback === 'positive' ? '✓' : '✗'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start animate-in fade-in duration-200">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6A11CB] to-[#00BF63] flex items-center justify-center mr-2">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-white shadow-md border border-gray-100 rounded-2xl rounded-tl-md px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 bg-[#6A11CB] rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-[#5271ff] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-[#00BF63] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            {messages.length <= 2 && (
              <div className="px-4 pb-2 flex gap-2 overflow-x-auto">
                {quickActions.map((action) => (
                  <button
                    key={action.label}
                    onClick={() => handleQuickAction(action.label)}
                    className="flex-shrink-0 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-xs font-medium text-gray-700 transition-colors flex items-center gap-1"
                  >
                    <span>{action.icon}</span>
                    <span>{action.label}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-gray-100 bg-white">
              <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full px-4 py-3 bg-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6A11CB]/20 focus:bg-white border border-transparent focus:border-[#6A11CB]/30 transition-all pr-12"
                  />
                  <button
                    onClick={toggleVoice}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full transition-colors ${
                      isListening ? 'bg-red-100 text-red-500' : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>
                </div>
                <button 
                  onClick={handleSendMessage} 
                  disabled={!inputMessage.trim() || isLoading}
                  className="w-11 h-11 rounded-full flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
                  style={{
                    background: inputMessage.trim() ? 'linear-gradient(135deg, #6A11CB 0%, #5271ff 100%)' : '#e5e7eb'
                  }}
                >
                  <Send className={`w-5 h-5 ${inputMessage.trim() ? 'text-white' : 'text-gray-400'}`} />
                </button>

              </div>
            </div>
          </div>
        </div>
      )}

    </>
  );
}

