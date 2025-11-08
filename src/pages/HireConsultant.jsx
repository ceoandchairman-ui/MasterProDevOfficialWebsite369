import React, { useState, useEffect } from 'react';
import { Consultant } from '@/entities/Consultant';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, DollarSign, Languages, Star, Mail, ArrowRight } from 'lucide-react';

export default function HireConsultant() {
  const [consultants, setConsultants] = useState([]);
  const [filteredConsultants, setFilteredConsultants] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [rateFilter, setRateFilter] = useState('all');
  const [languageFilter, setLanguageFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    async function fetchConsultants() {
      const data = await Consultant.list('-created_date');
      setConsultants(data);
      setFilteredConsultants(data);
    }
    fetchConsultants();
  }, []);

  useEffect(() => {
    let results = [...consultants];

    // Search filter
    if (searchQuery) {
      results = results.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.servicesOffered?.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Service filter
    if (serviceFilter !== 'all') {
      results = results.filter(c => c.servicesOffered?.includes(serviceFilter));
    }

    // Rate filter
    if (rateFilter !== 'all') {
      if (rateFilter === 'under50') results = results.filter(c => c.hourlyRate < 50);
      else if (rateFilter === '50-100') results = results.filter(c => c.hourlyRate >= 50 && c.hourlyRate <= 100);
      else if (rateFilter === 'over100') results = results.filter(c => c.hourlyRate > 100);
    }

    // Language filter
    if (languageFilter !== 'all') {
      results = results.filter(c => c.languages?.includes(languageFilter));
    }

    // Sorting
    if (sortBy === 'price-low') results.sort((a, b) => a.hourlyRate - b.hourlyRate);
    else if (sortBy === 'price-high') results.sort((a, b) => b.hourlyRate - a.hourlyRate);
    else if (sortBy === 'rating') results.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
    else if (sortBy === 'newest') results.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));

    setFilteredConsultants(results);
  }, [searchQuery, serviceFilter, rateFilter, languageFilter, sortBy, consultants]);

  // Get unique services and languages for filters
  const allServices = [...new Set(consultants.flatMap(c => c.servicesOffered || []))];
  const allLanguages = [...new Set(consultants.flatMap(c => c.languages || []))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-[#FBBC05]">Hire</span>{' '}
            <span className="text-[#4285F4]">a</span>{' '}
            <span className="text-[#34A853]">Consultant</span>
          </h1>
          <p className="text-xl text-gray-600">Find the perfect AI expert for your project</p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search by name, service, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 text-lg"
              />
            </div>
          </div>
        </div>

        {/* Filters and Sort */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Service Category</label>
              <Select value={serviceFilter} onValueChange={setServiceFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Services" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Services</SelectItem>
                  {allServices.map(service => (
                    <SelectItem key={service} value={service}>{service}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hourly Rate</label>
              <Select value={rateFilter} onValueChange={setRateFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Any Rate" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Rate</SelectItem>
                  <SelectItem value="under50">Under $50/hr</SelectItem>
                  <SelectItem value="50-100">$50 - $100/hr</SelectItem>
                  <SelectItem value="over100">Over $100/hr</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Languages</label>
              <Select value={languageFilter} onValueChange={setLanguageFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Any Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Language</SelectItem>
                  {allLanguages.map(lang => (
                    <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600 font-medium">
            Showing {filteredConsultants.length} {filteredConsultants.length === 1 ? 'consultant' : 'consultants'}
          </p>
        </div>

        {/* Consultant Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredConsultants.map(consultant => (
            <Card key={consultant.id} className="hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-transparent hover:border-blue-300">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <img 
                    src={consultant.photoUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"} 
                    alt={consultant.name}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-1">{consultant.name}</CardTitle>
                    <CardDescription className="text-sm">{consultant.title}</CardDescription>
                    {consultant.averageRating && (
                      <div className="flex items-center gap-1 mt-2">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-semibold">{consultant.averageRating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 line-clamp-2">{consultant.tagline}</p>
                
                <div className="flex flex-wrap gap-2">
                  {consultant.servicesOffered?.slice(0, 3).map(service => (
                    <Badge key={service} variant="secondary" className="text-xs">
                      {service}
                    </Badge>
                  ))}
                  {consultant.servicesOffered?.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{consultant.servicesOffered.length - 3} more
                    </Badge>
                  )}
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{consultant.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Languages className="w-4 h-4 text-gray-400" />
                    <span>{consultant.languages?.join(', ')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="font-semibold text-green-600">
                      ${consultant.hourlyRate}/hr | Min: ${consultant.minBudget}
                    </span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex gap-2">
                <Link to={createPageUrl('ConsultantDetail') + '?id=' + consultant.id} className="flex-1">
                  <Button variant="outline" className="w-full">
                    View Profile
                  </Button>
                </Link>
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                  <Mail className="w-4 h-4 mr-2" />
                  Contact
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredConsultants.length === 0 && (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600">No consultants found matching your criteria.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                setSearchQuery('');
                setServiceFilter('all');
                setRateFilter('all');
                setLanguageFilter('all');
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}