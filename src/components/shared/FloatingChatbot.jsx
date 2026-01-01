
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
      
      const fullPrompt = `${siteContext}

RECENT CONVERSATION:
${recentMessages}

USER'S MESSAGE: ${inputMessage}

Respond helpfully and concisely.`;

      // Call your new FastAPI backend endpoint
      const response = await fetch('http://localhost:5000/api/v1/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: fullPrompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'An error occurred with the API.');
      }

      // Assuming the AI agent's response is in a format like { "response": "..." }
      // You may need to adjust this based on the actual response structure of your AI Agent
      const data = await response.json();
      const botResponseText = data.response || "Sorry, I couldn't get a valid response.";


      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: botResponseText,
        isBot: true,
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error("Chat API Error:", error);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: `Sorry, I'm having trouble connecting to my brain right now. Please try again later. \nError: ${error.message}`,
        isBot: true,
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
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

          className="group relative w-14 h-14 rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl bg-gradient-to-br from-purple-600 to-blue-600"
        >
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
          <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white group-hover:rotate-12 transition-transform" />
          </div>
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
          
          {/* Chat Container - Copilot Style */}
          <div className="relative w-full sm:w-[420px] h-[90vh] sm:h-[680px] sm:max-h-[85vh] bg-[#1e1e1e] sm:rounded-xl shadow-2xl flex flex-col overflow-hidden border border-gray-800">
            
            {/* Header - VS Code Style */}
            <div className="relative bg-gradient-to-r from-[#2d2d2d] to-[#1e1e1e] border-b border-gray-800">
              <div className="px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-white text-sm">MasterProDev Copilot</h3>
                      <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-[10px] font-medium rounded border border-purple-500/30">AI</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-gray-400 text-[11px] font-mono">Ready to assist</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center transition-colors group"
                >
                  <X className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                </button>
              </div>
            </div>

            {/* Messages - Copilot Chat Style */}
            <div ref={messagesEndRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#1e1e1e] scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
              {messages.map(message => (
                <div 
                  key={message.id} 
                  className={`flex gap-3 ${message.isBot ? '' : 'flex-row-reverse'} group animate-in fade-in slide-in-from-bottom-2 duration-200`}
                >
                  {/* Avatar */}
                  <div className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center ${
                    message.isBot 
                      ? 'bg-gradient-to-br from-purple-500 to-blue-500' 
                      : 'bg-gradient-to-br from-blue-600 to-cyan-600'
                  }`}>
                    {message.isBot ? (
                      <Sparkles className="w-4 h-4 text-white" />
                    ) : (
                      <span className="text-white text-xs font-bold">You</span>
                    )}
                  </div>
                  
                  {/* Message Content */}
                  <div className="flex-1 min-w-0">
                    <div className={`${message.isBot ? 'text-left' : 'text-right'}`}>
                      <span className="text-[11px] font-mono text-gray-500 px-1">
                        {message.isBot ? 'Copilot' : 'You'} • {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className={`mt-1 px-3 py-2.5 rounded-lg text-sm leading-relaxed ${
                      message.isBot 
                        ? 'bg-[#2d2d2d] text-gray-200 border border-gray-800' 
                        : 'bg-gradient-to-r from-blue-600 to-blue-500 text-white'
                    }`}>
                      <p className="whitespace-pre-wrap font-mono text-[13px]">{message.text}</p>
                    </div>
                    
                    {/* Feedback buttons for bot messages */}
                    {message.isBot && message.id !== 1 && (
                      <div className="flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!message.feedback ? (
                          <>
                            <button 
                              onClick={() => handleFeedback(message.id, true)}
                              className="p-1.5 hover:bg-gray-800 rounded-md transition-colors"
                              title="Helpful"
                            >
                              <ThumbsUp className="w-3.5 h-3.5 text-gray-500 hover:text-green-400" />
                            </button>
                            <button 
                              onClick={() => handleFeedback(message.id, false)}
                              className="p-1.5 hover:bg-gray-800 rounded-md transition-colors"
                              title="Not helpful"
                            >
                              <ThumbsDown className="w-3.5 h-3.5 text-gray-500 hover:text-red-400" />
                            </button>
                          </>
                        ) : (
                          <span className="text-[10px] text-gray-500 px-2">
                            {message.feedback === 'positive' ? '✓ Marked as helpful' : '✗ Marked as not helpful'}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {/* Loading State */}
              {isLoading && (
                <div className="flex items-center gap-2 p-4">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-75"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-150"></div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            {messages.length <= 2 && !isLoading && (
              <div className="px-4 py-2 flex gap-2 overflow-x-auto border-t border-gray-800">
                {quickActions.map((action) => (
                  <button
                    key={action.label}
                    onClick={() => handleQuickAction(action.label)}
                    className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-full whitespace-nowrap transition-colors"
                  >
                    {action.icon} {action.label}
                  </button>
                ))}
              </div>
            )}

            {/* Input Area */}
            <div className="p-3 border-t border-gray-800 bg-[#2d2d2d]">
              <div className="flex items-end gap-2">
                <div className="flex-1 relative">
                  <textarea
                    placeholder="Ask Copilot anything..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    rows={1}
                    className="w-full px-3 py-2.5 bg-[#1e1e1e] border border-gray-700 rounded-lg text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-all resize-none pr-10 font-mono"
                    style={{ minHeight: '40px', maxHeight: '120px' }}
                  />
                  <button
                    onClick={toggleVoice}
                    className={`absolute right-2 bottom-2 p-1.5 rounded-md transition-all ${
                      isListening 
                        ? 'bg-red-500/20 text-red-400' 
                        : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800'
                    }`}
                    title={isListening ? 'Stop voice input' : 'Voice input'}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>
                </div>
                <button 
                  onClick={handleSendMessage} 
                  disabled={!inputMessage.trim() || isLoading}
                  className="p-2.5 rounded-lg flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:from-gray-700 disabled:to-gray-700"
                  title="Send message (Enter)"
                >
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>
              <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-gray-600">
                <span>Press Enter to send, Shift+Enter for new line</span>
                <span className="text-purple-500">Powered by AI</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </>
  );
}

