

import React, { useState, useEffect } from 'react';
import { User } from '@/entities/User';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from './utils';
import FloatingChatbot from './components/shared/FloatingChatbot';
import { 
  Menu, X, Search, Building, Phone, Mail, Rocket, MapPin, Facebook, Twitter, Linkedin, Instagram, LogOut, User as UserIcon
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Layout({ children, currentPageName }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true); // New state to track user loading
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchExpanded, setSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setIsLoadingUser(true); // Set loading to true when starting the fetch
    User.me()
      .then(currentUser => {
        setUser(currentUser);
        setIsLoadingUser(false); // Set loading to false on success
      })
      .catch(() => {
        setUser(null);
        setIsLoadingUser(false); // Set loading to false on error
      });
  }, []);

  const handleLogout = async () => {
    await User.logout();
    setUser(null);
    setMobileMenuOpen(false);
  };
  
  const handleLogin = () => {
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const handleSignup = () => {
    navigate('/signup');
    setMobileMenuOpen(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = createPageUrl('SearchResults') + '?q=' + encodeURIComponent(searchQuery);
    }
  };

  const navLinks = [
    { name: 'Home', href: createPageUrl('Home') },
    { name: 'About', href: createPageUrl('AboutPage') },
    { name: 'Services', href: createPageUrl('ServicesPage') },
    { name: 'Hire a Consultant', href: createPageUrl('HireConsultant') },
    { name: 'Contact Us', href: createPageUrl('ContactPage') },
  ];

  return (
    <div className="bg-white text-gray-800 font-sans">
      <FloatingChatbot />
      
      <style>{`
        .brand-gold { color: #FBBC05; }
        .brand-blue { color: #4285F4; }
        .brand-green { color: #34A853; }

        .crt-search-container {
          transition: box-shadow 0.3s ease-in-out;
        }

        .crt-search-container:focus-within, .crt-search-container:hover {
          box-shadow: 0 0 12px 2px #34A853;
        }

        .crt-search-input {
          background-image: linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px);
          background-size: 100% 3px;
          animation: scanline-flicker 20s linear infinite;
        }

        @keyframes scanline-flicker {
          0% { background-position: 0 0; }
          10% { background-position: 0 2px; }
          20% { background-position: 0 1px; }
          100% { background-position: 0 0; }
        }

        .social-link .underline-spark {
          position: absolute;
          bottom: -4px;
          left: 0;
          height: 2px;
          width: 0;
          transition: width 0.4s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .social-link:hover .underline-spark {
          width: 100%;
        }

        @keyframes text-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        .social-link:hover .insta-text-hover {
          color: transparent;
          background-clip: text;
          -webkit-background-clip: text;
          background-image: linear-gradient(90deg, #6228d7, #ee2a7b, #f9ce34, #ee2a7b, #6228d7);
          background-size: 200% auto;
          animation: text-shimmer 2s linear infinite;
        }
        
        .social-link .insta-text-hover {
           -webkit-background-clip: initial;
           background-clip: initial;
        }

        /* New styles for skeleton loader */
        .auth-skeleton {
          display: inline-block;
          width: 100px; /* Adjust width as needed */
          height: 36px; /* Adjust height to match button/avatar */
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 9999px; /* For rounded shape */
        }
        .auth-skeleton-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
        }

        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
      
      <header className="bg-white shadow-md sticky top-0 z-50">
        {/* Top Row */}
        <div className="border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="flex items-center justify-between h-16">
              
              {/* Left Side: Logo & Company Name */}

                                  <Link to={createPageUrl('Home')} className="flex items-center space-x-3 flex-shrink-0 hover:opacity-80 transition-opacity">
                                                                            <div className="w-10 h-10 flex-shrink-0">
                                                                              <img 
                                                                                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/687824d22dba5b3c55552294/939a8b78b_Screenshot2025-01-21142606.jpg" 
                                                                                alt="MasterProDev Logo"
                                                                                className="w-full h-full object-contain"
                                                                              />
                                                                            </div>
                                    <div className="hidden md:block">
                                      <span className="font-bold text-xl">
                                        <span style={{ color: '#ffb400' }}>Master</span>
                                        <span style={{ color: '#5271ff' }}>Pro</span>
                                        <span style={{ color: '#00bf63' }}>Dev</span>
                                      </span>
                                    </div>
                                  </Link>


              {/* Center: CRT Search Bar (Desktop) */}
              <div className="hidden lg:flex flex-1 justify-center px-8">
                <form onSubmit={handleSearchSubmit} className="w-full max-w-md crt-search-container rounded-full bg-gray-900 shadow-inner">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search…"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="crt-search-input w-full pl-5 pr-12 py-2.5 text-green-300 placeholder-green-700 bg-transparent border-0 rounded-full focus:ring-0"
                    />
                    <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-green-500 hover:text-green-400 transition-colors">
                      <Search className="w-5 h-5" />
                    </button>
                  </div>
                </form>
              </div>

              {/* Right Side: Auth Buttons & Mobile Icons */}
              <div className="flex items-center gap-2">
                <div className="hidden md:flex items-center space-x-4">
                  {isLoadingUser ? ( // Render skeleton if user data is still loading
                    <div className="auth-skeleton auth-skeleton-avatar"></div>
                  ) : user ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-2 text-sm font-medium rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                           <Avatar className="w-9 h-9">
                              <AvatarImage src={user.avatar_url} alt={user.full_name} />
                              <AvatarFallback>{user.full_name?.charAt(0).toUpperCase()}</AvatarFallback>
                           </Avatar>
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>
                          <div className="font-semibold">{user.full_name}</div>
                          <div className="text-xs text-gray-500">{user.email}</div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-500 focus:text-red-600 focus:bg-red-50">
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Logout</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <>
                      <button onClick={handleLogin} className="font-semibold text-gray-600 hover:text-blue-500 transition-colors">
                        Login
                      </button>
                      <button onClick={handleLogin} className="px-5 py-2 bg-[#4285F4] text-white font-semibold rounded-full shadow-sm hover:bg-blue-600 transition-all transform hover:scale-105">
                        Sign Up
                      </button>
                    </>
                  )}
                </div>

                <div className="lg:hidden">
                  <button onClick={() => setSearchExpanded(!isSearchExpanded)} className="p-2 text-gray-600 hover:text-blue-500">
                    <Search className="w-6 h-6" />
                  </button>
                </div>
                <div className="md:hidden">
                  <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-gray-600 hover:text-blue-500">
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                  </button>
                </div>
              </div>
            </div>
            
            {/* Mobile Expanded Search Bar */}
            {isSearchExpanded && (
              <div className="lg:hidden py-3 border-t">
                <form onSubmit={handleSearchSubmit} className="crt-search-container rounded-full bg-gray-900 shadow-inner">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search…"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="crt-search-input w-full pl-5 pr-12 py-2.5 text-green-300 placeholder-green-700 bg-transparent border-0 rounded-full focus:ring-0"
                      autoFocus
                    />
                    <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-green-500 hover:text-green-400 transition-colors">
                      <Search className="w-5 h-5" />
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Second Row: Navigation Menu (Desktop) */}
        <nav className="hidden md:flex bg-white border-b border-gray-200 justify-center items-center h-14">
          <div className="flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link key={link.name} to={link.href} className="font-medium text-gray-600 hover:text-blue-500 transition-colors">
                {link.name}
              </Link>
            ))}
            <Link to={createPageUrl('TellYourIdeaPage')} className="px-5 py-2 bg-green-500 text-white font-semibold rounded-full shadow-sm hover:bg-green-600 transition-all transform hover:scale-105">
              Tell Your Idea
            </Link>
          </div>
        </nav>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <nav className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map((link) => (
                <Link key={link.name} to={link.href} onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-white hover:bg-blue-500">
                  {link.name}
                </Link>
              ))}
              <Link to={createPageUrl('TellYourIdeaPage')} onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-white bg-green-500 hover:bg-green-600">
                Tell Your Idea
              </Link>
            </nav>
            <div className="px-2 pt-4 pb-3 border-t border-gray-200 space-y-2">
              {isLoadingUser ? ( // Render skeleton if user data is still loading
                <div className="px-3 py-2">
                  <div className="auth-skeleton w-32 h-6 rounded"></div> {/* Smaller skeleton for mobile text */}
                  <div className="auth-skeleton w-48 h-4 mt-1 rounded"></div> {/* For email */}
                </div>
              ) : user ? (
                 <>
                   <div className="px-3 py-2">
                     <div className="font-medium text-base text-gray-800">{user.full_name}</div>
                     <div className="font-medium text-sm text-gray-500">{user.email}</div>
                   </div>
                   <button onClick={handleLogout} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-500 hover:text-white hover:bg-red-500">
                     Logout
                   </button>
                 </>
              ) : (
                <>
                  <button onClick={handleLogin} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-white hover:bg-gray-500">
                    Login
                  </button>
                  <button onClick={handleLogin} className="block w-full text-center px-3 py-2 rounded-md text-base font-medium text-white bg-[#4285F4] hover:bg-blue-600">
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-black text-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Building className="brand-gold" /> 
                <span className="brand-gold">Master</span>
                <span className="brand-blue">Pro</span>
                <span className="brand-green">Dev</span>
              </h3>
              <p className="text-gray-300 flex items-center gap-2">
                <Rocket className="brand-gold" /> Elevating Your Professional Journey
              </p>
            </div>
            
            <div className="space-y-6">
              <h3 className="text-lg font-semibold flex items-center gap-2 brand-blue">
                Contact Us
              </h3>

              <a href="mailto:ceo_and_chairman@masterprodev.com" className="flex items-center gap-4 group social-link">

                <div className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:brightness-125" style={{ backgroundColor: '#5271ff' }}>
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <span className="relative font-medium text-[#DDDDDD] transition-colors duration-300 group-hover:text-[#5271ff]">
                  Email
                  <span className="underline-spark" style={{ backgroundColor: '#5271ff', boxShadow: '0 1px 8px #5271ff' }}></span>
                </span>
              </a>
              <div className="flex items-center gap-4 group social-link">
                <div className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:brightness-125" style={{ backgroundColor: '#e74c3c' }}>
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <span className="relative font-medium text-[#DDDDDD] transition-colors duration-300 group-hover:text-[#e74c3c]">
                  Toronto, ON
                  <span className="underline-spark" style={{ backgroundColor: '#e74c3c', boxShadow: '0 1px 8px #e74c3c' }}></span>
                </span>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-semibold brand-green">Follow Us</h3>
              <div className="grid grid-cols-3 gap-x-6 gap-y-4">

                <a href="https://www.instagram.com/masterprodev/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group social-link">
                                        <div className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:brightness-125" style={{ background: 'linear-gradient(45deg, #f9ce34, #ee2a7b, #6228d7)' }}>
                                          <Instagram className="w-5 h-5 text-white" />
                                        </div>
                                        <span className="relative font-medium text-[#DDDDDD] transition-colors duration-300 insta-text-hover">
                                          Instagram
                                        </span>
                                      </a>
                                      <a href="https://www.facebook.com/profile.php?id=61584563307854" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group social-link">
                                                                    <div className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:brightness-125" style={{ backgroundColor: '#1877f2' }}>
                                                                      <Facebook className="w-5 h-5 text-white" />
                                                                    </div>
                                                                    <span className="relative font-medium text-[#DDDDDD] transition-colors duration-300 group-hover:text-[#1877f2]">
                                                                      Facebook
                                                                      <span className="underline-spark" style={{ backgroundColor: '#1877f2', boxShadow: '0 1px 8px #1877f2' }}></span>
                                                                    </span>
                                                                  </a>
                                      <a href="#" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group social-link">
                                                                    <div className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:brightness-125" style={{ backgroundColor: '#0077b5' }}>
                                                                      <Linkedin className="w-5 h-5 text-white" />
                                                                    </div>
                                                                    <span className="relative font-medium text-[#DDDDDD] transition-colors duration-300 group-hover:text-[#0077b5]">
                                                                      LinkedIn
                                                                      <span className="underline-spark" style={{ backgroundColor: '#0077b5', boxShadow: '0 1px 8px #0077b5' }}></span>
                                                                    </span>
                                                                  </a>
                                                                  <a href="#" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group social-link">
                                                                    <div className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:brightness-125" style={{ backgroundColor: '#FF4500' }}>
                                                                      <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/></svg>
                                                                    </div>
                                                                    <span className="relative font-medium text-[#DDDDDD] transition-colors duration-300 group-hover:text-[#FF4500]">
                                                                      Reddit
                                                                      <span className="underline-spark" style={{ backgroundColor: '#FF4500', boxShadow: '0 1px 8px #FF4500' }}></span>
                                                                    </span>
                                                                  </a>
                                                                  <a href="#" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group social-link">
                                                                    <div className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:brightness-125" style={{ backgroundColor: '#B92B27' }}>
                                                                      <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12.804 12.996c.097-.068.187-.139.272-.214.852-.747 1.057-1.878.457-2.527-.6-.649-1.733-.534-2.585.213-.853.747-1.058 1.878-.458 2.527.303.328.744.476 1.197.433.344-.033.67-.159.956-.342l.161-.09zm-1.862 1.647c.335-.293.787-.461 1.262-.461.475 0 .927.168 1.262.461l.161.141c.097.085.2.164.307.236.853.577 1.938.614 2.423.082.485-.532.236-1.448-.556-2.044-.167-.126-.35-.234-.543-.323l-.17-.078c-.389-.18-.813-.274-1.247-.274-.882 0-1.704.355-2.292.987l-.124.133c-.588.632-.882 1.454-.82 2.292.062.838.482 1.599 1.171 2.118l.148.111c.689.52 1.548.766 2.396.688.848-.078 1.627-.455 2.172-1.052l.117-.128c.545-.597.82-1.38.766-2.184-.054-.804-.423-1.545-1.026-2.064l-.13-.112c-.603-.519-1.37-.808-2.138-.808-.344 0-.68.052-1 .152z"/><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm6.066 14.963c.074.907-.23 1.803-.853 2.5-.623.697-1.497 1.131-2.44 1.213-.943.082-1.876-.168-2.607-.699l-.148-.108c-.487-.354-.856-.851-1.058-1.425-.202.574-.571 1.071-1.058 1.425l-.148.108c-.731.531-1.664.781-2.607.699-.943-.082-1.817-.516-2.44-1.213-.623-.697-.927-1.593-.853-2.5.074-.907.48-1.748 1.134-2.347l.14-.128c.654-.599 1.508-.929 2.385-.923.394.003.782.07 1.151.198-.024-.452.072-.904.285-1.31.213-.406.532-.75.924-1.001l.168-.107c.793-.508 1.78-.608 2.759-.28.979.328 1.752 1.052 2.16 2.023l.087.208c.166.397.258.824.27 1.257.34-.099.695-.151 1.054-.154.877-.006 1.731.324 2.385.923l.14.128c.654.599 1.06 1.44 1.134 2.347z"/></svg>
                                                                    </div>
                                                                    <span className="relative font-medium text-[#DDDDDD] transition-colors duration-300 group-hover:text-[#B92B27]">
                                                                      Quora
                                                                      <span className="underline-spark" style={{ backgroundColor: '#B92B27', boxShadow: '0 1px 8px #B92B27' }}></span>
                                                                    </span>
                                                                  </a>
                                                                  <a href="#" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group social-link">
                                                                    <div className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:brightness-125" style={{ backgroundColor: '#000000' }}>
                                                                      <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
                                                                    </div>
                                                                    <span className="relative font-medium text-[#DDDDDD] transition-colors duration-300 group-hover:text-white">
                                                                      TikTok
                                                                      <span className="underline-spark" style={{ backgroundColor: '#69C9D0', boxShadow: '0 1px 8px #69C9D0' }}></span>
                                                                    </span>
                                                                  </a>
                                                                  <a href="#" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group social-link">
                                                                    <div className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:brightness-125" style={{ backgroundColor: '#10a37f' }}>
                                                                      <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.8956zm16.0993 3.8558L12.6 8.3829l2.02-1.1638a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z"/></svg>
                                                                    </div>
                                                                    <span className="relative font-medium text-[#DDDDDD] transition-colors duration-300 group-hover:text-[#10a37f]">
                                                                      ChatGPT
                                                                      <span className="underline-spark" style={{ backgroundColor: '#10a37f', boxShadow: '0 1px 8px #10a37f' }}></span>
                                                                    </span>
                                                                  </a>
                                                          </div>

            </div>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} <span className="brand-gold">Master</span><span className="brand-blue">Pro</span><span className="brand-green">Dev</span>. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );

}

