import React, { useState, useEffect } from 'react';
import { Consultant } from '@/entities/Consultant';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowRight } from 'lucide-react';

export default function ConsultantsSection() {
  const [consultants, setConsultants] = useState([]);
  
  useEffect(() => {
    async function fetchConsultants() {
      const data = await Consultant.list();
      setConsultants(data.slice(0, 3)); // Show only first 3 on home page
    }
    fetchConsultants();
  }, []);

  return (
    <div className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className="rounded-[60px] p-8 md:p-12 border-3 border-solid relative"
          style={{
            backgroundColor: '#00bf63',
            borderColor: '#00bf63',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}
        >
          <div className="absolute -top-6 left-12">
            <div 
              className="bg-white border-2 border-solid px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer flex items-center gap-3"
              style={{ 
                borderColor: '#00bf63',
                boxShadow: '0 4px 8px rgba(0,0,0,0.15)'
              }}
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-lg">
                👥
              </div>
              <h2 className="text-lg md:text-xl font-bold text-black">
                Our AI Experts
              </h2>
            </div>
          </div>

          <section id="consultants" className="mt-6">
            <div className="text-center mb-8">
              <p className="mt-4 text-lg text-white">Meet the specialists driving your AI transformation.</p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {consultants.map(consultant => (
                <Card key={consultant.id} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden">
                      <img 
                        src={consultant.photoUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"} 
                        alt={consultant.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardTitle className="text-black">{consultant.name}</CardTitle>
                    <CardDescription>{consultant.title}</CardDescription>
                    <p className="text-sm text-gray-600">{consultant.experience}+ years experience</p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 justify-center mb-4">
                      {consultant.servicesOffered?.slice(0, 3).map(service => (
                        <Badge key={service} variant="outline" style={{ color: consultant.color || '#00bf63', borderColor: consultant.color || '#00bf63' }}>
                          {service}
                        </Badge>
                      ))}
                    </div>
                    <Link to={createPageUrl('ConsultantDetail') + '?id=' + consultant.id}>
                      <Button variant="outline" className="w-full">
                        View Profile
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link to={createPageUrl('HireConsultant')}>
                <Button size="lg" className="bg-white text-[#00bf63] hover:bg-gray-100 font-semibold shadow-lg">
                  View All Consultants <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}