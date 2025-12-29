import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { SendEmail } from '@/integrations/Core';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      await SendEmail({
        to: 'masterprodevconsultant@outlook.com',
        subject: formData.subject || `Contact Form: ${formData.name}`,
        body: `
Name: ${formData.name}
Email: ${formData.email}
Subject: ${formData.subject}

Message:
${formData.message}
        `
      });

      setSuccess('Thank you! Your message has been sent successfully. We\'ll get back to you soon!');
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      setError('An error occurred while sending your message. Please try emailing us directly.');
      console.error(err);
    }

    setIsSubmitting(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-gray-50 to-blue-50 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Contact Container (The Can) */}
        <div 
          className="rounded-3xl p-8 md:p-12 border-4 border-solid relative overflow-hidden"
          style={{
            backgroundColor: '#ffffff',
            borderColor: '#00bf63',
            boxShadow: '0 15px 50px rgba(0,191,99,0.15)'
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
                Get in Touch
              </h2>
            </div>
          </div>

          {/* Decorative corner accent */}
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-green-100 rounded-full opacity-10 blur-3xl"></div>

          <section className="mt-8 relative z-5">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                <span style={{ color: '#00bf63' }}>Let's Connect</span>
              </h1>
              <p className="text-xl text-gray-700 max-w-2xl mx-auto">
                Ready to transform your professional journey with AI? Our team is here to help you achieve your goals.
              </p>
            </div>
            
            <div className="mt-12 grid md:grid-cols-2 gap-12">
              {/* Contact Information */}
              <div className="space-y-8">
                <h2 className="text-2xl font-bold text-gray-900 border-b-3 border-green-300 pb-3">Contact Information</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4 p-5 rounded-xl bg-green-50 border-l-4 border-green-500 hover:shadow-md transition-shadow">
                    <Mail className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-gray-900">Email Address</p>
                      <a href="mailto:masterprodevconsultant@outlook.com" className="text-green-700 hover:text-green-900 font-medium">
                        masterprodevconsultant@outlook.com
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-5 rounded-xl bg-blue-50 border-l-4 border-blue-500 hover:shadow-md transition-shadow">
                    <MapPin className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-gray-900">Location</p>
                      <p className="text-blue-700 font-medium">Toronto, ON, Canada</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-5 rounded-xl bg-purple-50 border-l-4 border-purple-500 hover:shadow-md transition-shadow">
                    <Phone className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-gray-900">Response Time</p>
                      <p className="text-purple-700 font-medium">24-48 hours typically</p>
                    </div>
                  </div>

                  <div className="p-6 rounded-xl bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300">
                    <p className="text-sm text-gray-700 leading-relaxed font-medium">
                      💡 <strong>Tip:</strong> For urgent matters, please mention "URGENT" in the subject line and we'll prioritize your inquiry.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Contact Form */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 border-b-3 border-blue-300 pb-3 mb-6">Send us a Message</h2>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                    <Input 
                      name="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="border-2 border-gray-200 focus:border-green-500 focus:ring-green-500 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
                    <Input 
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="border-2 border-gray-200 focus:border-green-500 focus:ring-green-500 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                    <Input 
                      name="subject"
                      placeholder="What's this about?"
                      value={formData.subject}
                      onChange={handleChange}
                      className="border-2 border-gray-200 focus:border-green-500 focus:ring-green-500 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Message *</label>
                    <Textarea 
                      name="message"
                      placeholder="Tell us how we can help you with AI transformation..."
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="h-40 border-2 border-gray-200 focus:border-green-500 focus:ring-green-500 rounded-lg"
                    />
                  </div>

                  {error && (
                    <div className="p-4 rounded-lg bg-red-100 border-2 border-red-500 flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm font-medium text-red-800">{error}</p>
                    </div>
                  )}

                  {success && (
                    <div className="p-4 rounded-lg bg-green-100 border-2 border-green-500 flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm font-medium text-green-800">{success}</p>
                    </div>
                  )}

                  <Button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full font-semibold py-3 text-white hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: '#00bf63' }}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
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