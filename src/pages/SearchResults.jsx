import React, { useState, useEffect } from 'react';
import { Service } from '@/entities/Service';
import { Consultant } from '@/entities/Consultant';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Briefcase, Users, Sparkles, ArrowRight, Mail } from 'lucide-react';

export default function SearchResults() {
  const [query, setQuery] = useState('');
  const [services, setServices] = useState([]);
  const [consultants, setConsultants] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [filteredConsultants, setFilteredConsultants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Get search query from URL on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('q') || '';
    setQuery(searchQuery);
  }, []);

  // Fetch all data
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const [servicesData, consultantsData] = await Promise.all([
          Service.list(),
          Consultant.list()
        ]);
        setServices(servicesData);
        setConsultants(consultantsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      setIsLoading(false);
    }
    fetchData();
  }, []);

  // Filter results based on query
  useEffect(() => {
    if (!query.trim()) {
      setFilteredServices([]);
      setFilteredConsultants([]);
      return;
    }

    const searchTerm = query.toLowerCase();

    // Search services
    const matchedServices = services.filter(service =>
      service.name.toLowerCase().includes(searchTerm) ||
      service.description.toLowerCase().includes(searchTerm) ||
      service.category.toLowerCase().includes(searchTerm)
    );

    // Search consultants
    const matchedConsultants = consultants.filter(consultant =>
      consultant.name.toLowerCase().includes(searchTerm) ||
      consultant.tagline?.toLowerCase().includes(searchTerm) ||
      consultant.title?.toLowerCase().includes(searchTerm) ||
      consultant.location?.toLowerCase().includes(searchTerm) ||
      consultant.bio?.toLowerCase().includes(searchTerm) ||
      consultant.servicesOffered?.some(s => s.toLowerCase().includes(searchTerm))
    );

    setFilteredServices(matchedServices);
    setFilteredConsultants(matchedConsultants);
  }, [query, services, consultants]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      window.history.pushState({}, '', `${window.location.pathname}?q=${encodeURIComponent(query)}`);
    }
  };

  const totalResults = filteredServices.length + filteredConsultants.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-[#FBBC05]">Search</span>{' '}
            <span className="text-[#4285F4]">Results</span>
          </h1>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search services, consultants, expertise..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-12 h-12 text-lg"
                autoFocus
              />
            </div>
            <Button type="submit" className="bg-[#4285F4] hover:bg-[#34A853] text-white px-8">
              Search
            </Button>
          </form>
        </div>

        {isLoading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#4285F4]"></div>
            <p className="mt-4 text-gray-600">Searching...</p>
          </div>
        ) : !query.trim() ? (
          <div className="text-center py-16">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">Start Your Search</h2>
            <p className="text-gray-500">Enter keywords to find services, consultants, or expertise</p>
          </div>
        ) : totalResults === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Results Found</h2>
            <p className="text-gray-500 mb-6">We couldn't find anything matching "{query}"</p>
            <Button variant="outline" onClick={() => setQuery('')}>
              Clear Search
            </Button>
          </div>
        ) : (
          <>
            {/* Results Summary */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800">
                Found {totalResults} result{totalResults !== 1 ? 's' : ''} for "{query}"
              </h2>
              <p className="text-gray-600 mt-2">
                {filteredServices.length} service{filteredServices.length !== 1 ? 's' : ''} · {filteredConsultants.length} consultant{filteredConsultants.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Services Results */}
            {filteredServices.length > 0 && (
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <Briefcase className="w-6 h-6 text-[#4285F4]" />
                  <h3 className="text-2xl font-bold text-gray-800">
                    Services ({filteredServices.length})
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredServices.map(service => {
                    const Icon = Sparkles;
                    return (
                      <Card key={service.id} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2">
                        <CardHeader>
                          <div className="flex items-start gap-3 mb-3">
                            <div 
                              className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: `${service.color}20`, color: service.color }}
                            >
                              <Icon className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                              <CardTitle className="text-lg">{service.name}</CardTitle>
                              <Badge variant="secondary" className="mt-2 text-xs">
                                {service.category}
                              </Badge>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <CardDescription className="text-sm line-clamp-3">
                            {service.description}
                          </CardDescription>
                        </CardContent>
                        <CardFooter>
                          <a href="#services" className="w-full">
                            <Button variant="outline" className="w-full">
                              Learn More <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          </a>
                        </CardFooter>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Consultants Results */}
            {filteredConsultants.length > 0 && (
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <Users className="w-6 h-6 text-[#34A853]" />
                  <h3 className="text-2xl font-bold text-gray-800">
                    Consultants ({filteredConsultants.length})
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredConsultants.map(consultant => (
                    <Card key={consultant.id} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2">
                      <CardHeader>
                        <div className="flex items-start gap-3">
                          <img 
                            src={consultant.photoUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"} 
                            alt={consultant.name}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <CardTitle className="text-lg">{consultant.name}</CardTitle>
                            <CardDescription className="text-sm">{consultant.title}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm text-gray-600 line-clamp-2">{consultant.tagline}</p>
                        <div className="flex flex-wrap gap-2">
                          {consultant.servicesOffered?.slice(0, 2).map(service => (
                            <Badge key={service} variant="secondary" className="text-xs">
                              {service}
                            </Badge>
                          ))}
                          {consultant.servicesOffered?.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{consultant.servicesOffered.length - 2}
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="flex gap-2">
                        <Link to={createPageUrl('ConsultantDetail') + '?id=' + consultant.id} className="flex-1">
                          <Button variant="outline" className="w-full">
                            View Profile
                          </Button>
                        </Link>
                        <Button className="flex-1 bg-[#34A853] hover:bg-[#4285F4] text-white">
                          <Mail className="w-4 h-4 mr-2" />
                          Contact
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-[#4285F4] to-[#34A853] rounded-2xl p-8 text-center text-white mt-12">
              <h3 className="text-2xl font-bold mb-3">Didn't find what you're looking for?</h3>
              <p className="text-lg mb-6">Let's chat about your specific needs</p>
              <Button 
                size="lg" 
                className="bg-white text-[#4285F4] hover:bg-gray-100"
                onClick={() => window.dispatchEvent(new CustomEvent('openChatbot'))}
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Talk to Our AI Assistant
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}