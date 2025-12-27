import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, CheckCircle, AlertCircle } from 'lucide-react';

export default function ContactSection() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [formStatus, setFormStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setFormStatus({ type: 'error', message: 'Please fill in all required fields' });
      return;
    }
    try {
      // Mock submit
      setFormStatus({ type: 'success', message: 'Thank you! We\'ll be in touch soon.' });
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setFormStatus(null), 5000);
    } catch (err) {
      setFormStatus({ type: 'error', message: 'Error sending message. Please try again.' });
    }
  };

  return (
    <div className="py-16 md:py-24 bg-gradient-to-br from-green-50 to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Contact Container (The Can) */}
        <div 
          className="rounded-3xl p-8 md:p-12 border-4 border-solid relative overflow-hidden"
          style={{
            backgroundColor: '#ffffff',
            borderColor: '#00bf63',
            boxShadow: '0 10px 40px rgba(0,191,99,0.15)'
          }}
        >
          {/* Lid Title (The Button) */}
          <div className="absolute -top-6 left-12 z-10">
            <div 
              className="bg-white border-3 border-solid px-7 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer flex items-center gap-3"
              style={{ 
                borderColor: '#00bf63',
                boxShadow: '0 6px 15px rgba(0,191,99,0.2)'
              }}
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-lg">
                📞
              </div>
              <h2 className="text-lg md:text-xl font-bold text-gray-900">
                Get Started Today
              </h2>
            </div>
          </div>

          {/* Decorative corner accent */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-green-100 rounded-full opacity-20 blur-3xl"></div>

          <section id="contact" className="mt-8 relative z-5">
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                <span style={{ color: '#00bf63' }}>Transform Your Journey</span>
              </h1>
              <p className="text-lg text-gray-600">Ready to leverage AI for your career or business? Let's connect!</p>
            </div>
            
            <div className="mt-12 grid md:grid-cols-2 gap-12">
              {/* Contact Information */}
              <div className="space-y-8">
                <h3 className="text-2xl font-bold text-gray-900 border-b-3 border-green-300 pb-3">Contact Information</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4 p-4 rounded-lg bg-green-50 border-l-4 border-green-500">
                    <Mail className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Email</p>
                      <a href="mailto:masterprodevconsultant@outlook.com" className="text-green-700 hover:text-green-900 font-medium">
                        masterprodevconsultant@outlook.com
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-4 rounded-lg bg-blue-50 border-l-4 border-blue-500">
                    <MapPin className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Location</p>
                      <p className="text-blue-700 font-medium">Toronto, ON, Canada</p>
                    </div>
                  </div>

                  <div className="p-6 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      <strong>Response Time:</strong> We typically respond within 24-48 hours. For urgent matters, please mention in the subject line.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Contact Form */}
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-900 border-b-3 border-blue-300 pb-3">Send us a Message</h3>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                    <Input 
                      name="name"
                      placeholder="John Doe" 
                      value={formData.name}
                      onChange={handleInputChange}
                      className="border-2 border-gray-200 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
                    <Input 
                      name="email"
                      type="email" 
                      placeholder="you@example.com" 
                      value={formData.email}
                      onChange={handleInputChange}
                      className="border-2 border-gray-200 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                    <Input 
                      name="subject"
                      placeholder="How we can help..." 
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="border-2 border-gray-200 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Message *</label>
                    <Textarea 
                      name="message"
                      placeholder="Tell us about your AI transformation goals..." 
                      value={formData.message}
                      onChange={handleInputChange}
                      className="h-32 border-2 border-gray-200 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>

                  {formStatus && (
                    <div className={`p-4 rounded-lg flex items-start gap-3 ${
                      formStatus.type === 'success' 
                        ? 'bg-green-100 border-2 border-green-500' 
                        : 'bg-red-100 border-2 border-red-500'
                    }`}>
                      {formStatus.type === 'success' ? (
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      )}
                      <p className={`text-sm font-medium ${
                        formStatus.type === 'success' ? 'text-green-800' : 'text-red-800'
                      }`}>
                        {formStatus.message}
                      </p>
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full font-semibold py-3 text-white hover:shadow-lg transition-all duration-300" 
                    style={{ backgroundColor: '#00bf63' }}
                  >
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
