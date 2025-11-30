
import React, { useState, useEffect } from 'react';
import { User } from '@/entities/User';
import { Link } from 'react-router-dom';
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
    User.login();
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
                <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex-shrink-0"></div>
                <div className="hidden md:block">
                  <span className="font-bold text-xl">MasterProDev</span>
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
              <a href="mailto:masterprodevconsultant@outlook.com" className="flex items-center gap-4 group social-link">
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
              <div className="space-y-6">
                <a href="#" className="flex items-center gap-4 group social-link">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:brightness-125" style={{ background: 'linear-gradient(45deg, #f9ce34, #ee2a7b, #6228d7)' }}>
                    <Instagram className="w-5 h-5 text-white" />
                  </div>
                  <span className="relative font-medium text-[#DDDDDD] transition-colors duration-300 insta-text-hover">
                    Instagram
                  </span>
                </a>
                <a href="#" className="flex items-center gap-4 group social-link">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:brightness-125" style={{ backgroundColor: '#1877f2' }}>
                    <Facebook className="w-5 h-5 text-white" />
                  </div>
                  <span className="relative font-medium text-[#DDDDDD] transition-colors duration-300 group-hover:text-[#1877f2]">
                    Facebook
                    <span className="underline-spark" style={{ backgroundColor: '#1877f2', boxShadow: '0 1px 8px #1877f2' }}></span>
                  </span>
                </a>
                <a href="#" className="flex items-center gap-4 group social-link">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:brightness-125" style={{ backgroundColor: '#0077b5' }}>
                    <Linkedin className="w-5 h-5 text-white" />
                  </div>
                  <span className="relative font-medium text-[#DDDDDD] transition-colors duration-300 group-hover:text-[#0077b5]">
                    LinkedIn
                    <span className="underline-spark" style={{ backgroundColor: '#0077b5', boxShadow: '0 1px 8px #0077b5' }}></span>
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
