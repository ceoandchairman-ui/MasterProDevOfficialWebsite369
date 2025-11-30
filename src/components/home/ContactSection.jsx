
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactSection() {
  return (
    <div className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Contact Container (The Can) */}
        <div 
          className="rounded-[60px] p-8 md:p-12 border-3 border-solid relative"
          style={{
            backgroundColor: '#ffffff',
            borderColor: '#00bf63',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}
        >
          {/* Lid Title (The Button) */}
          <div className="absolute -top-6 left-12">
            <div 
              className="bg-white border-2 border-solid px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer flex items-center gap-3"
              style={{ 
                borderColor: '#00bf63',
                boxShadow: '0 4px 8px rgba(0,0,0,0.15)'
              }}
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-lg">
                📞
              </div>
              <h2 className="text-lg md:text-xl font-bold text-black">
                Get Started Today
              </h2>
            </div>
          </div>

          <section id="contact" className="mt-6">
            <div className="text-center mb-8">
              <p className="mt-4 text-lg text-black">Ready to transform your professional journey with AI?</p>
            </div>
            
            <div className="mt-12 grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-xl font-semibold text-black mb-6">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail style={{ color: '#ffb400' }} className="w-5 h-5" />
                    <span className="text-gray-700">masterprodevconsultant@outlook.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin style={{ color: '#00bf63' }} className="w-5 h-5" />
                    <span className="text-gray-700">Toronto, ON, Canada</span>
                  </div>
                </div>
              </div>
              
              <div>
                <form className="space-y-4">
                  <Input placeholder="Your Name" />
                  <Input type="email" placeholder="Your Email" />
                  <Input placeholder="Subject" />
                  <Textarea placeholder="How can we help you with AI?" className="h-32" />
                  <Button className="w-full text-white" style={{ backgroundColor: '#5271ff' }}>
                    Send Message
                  </Button>
                </form>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
