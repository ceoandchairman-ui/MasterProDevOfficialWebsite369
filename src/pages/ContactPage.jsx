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
    <div className="min-h-screen bg-gray-50 py-16 md:py-24">
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
                Get in Touch
              </h2>
            </div>
          </div>

          <section className="mt-6">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
                Contact Us
              </h1>
              <p className="text-xl text-gray-700">Ready to transform your professional journey with AI? Let's connect!</p>
            </div>
            
            <div className="mt-12 grid md:grid-cols-2 gap-12">
              {/* Contact Information */}
              <div className="space-y-8">
                <h3 className="text-2xl font-semibold text-black mb-6">Get In Touch</h3>
                
                <div className="space-y-6">
                  <a href="mailto:masterprodevconsultant@outlook.com" className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-full bg-[#5271ff] flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-black">Email Us</div>
                      <div className="text-gray-600">masterprodevconsultant@outlook.com</div>
                    </div>
                  </a>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#e74c3c] flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-black">Location</div>
                      <div className="text-gray-600">Toronto, ON, Canada</div>
                    </div>
                  </div>
                </div>

                {/* Social Media Links */}
                <div className="mt-12">
                  <h4 className="text-xl font-semibold text-black mb-4">Follow Us</h4>
                  <div className="flex gap-4">
                    <a href="#" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-gradient-to-r from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] flex items-center justify-center hover:scale-110 transition-transform">
                      <Instagram className="w-6 h-6 text-white" />
                    </a>
                    <a href="#" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-[#1877f2] flex items-center justify-center hover:scale-110 transition-transform">
                      <Facebook className="w-6 h-6 text-white" />
                    </a>
                    <a href="#" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-[#0077b5] flex items-center justify-center hover:scale-110 transition-transform">
                      <Linkedin className="w-6 h-6 text-white" />
                    </a>
                  </div>
                </div>

                {/* Image */}
                <div className="mt-8 hidden md:block">
                  <img 
                    src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?q=80&w=2574&auto=format&fit=crop" 
                    alt="Contact Us" 
                    className="rounded-lg shadow-lg w-full h-64 object-cover"
                  />
                </div>
              </div>
              
              {/* Contact Form */}
              <div>
                <form onSubmit={handleSubmit} className="space-y-6 bg-gray-50 p-8 rounded-2xl">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name *
                    </label>
                    <Input 
                      id="name"
                      name="name"
                      placeholder="John Doe" 
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Your Email *
                    </label>
                    <Input 
                      id="email"
                      name="email"
                      type="email" 
                      placeholder="john@example.com" 
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Subject
                    </label>
                    <Input 
                      id="subject"
                      name="subject"
                      placeholder="How can we help?" 
                      value={formData.subject}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <Textarea 
                      id="message"
                      name="message"
                      placeholder="Tell us about your project or inquiry..." 
                      className="h-32" 
                      value={formData.message}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md flex items-center gap-3">
                      <AlertCircle className="w-5 h-5" />
                      <span>{error}</span>
                    </div>
                  )}

                  {success && (
                    <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md flex items-center gap-3">
                      <CheckCircle className="w-5 h-5" />
                      <span>{success}</span>
                    </div>
                  )}
                  
                  <Button 
                    type="submit" 
                    className="w-full text-white h-12 text-lg" 
                    style={{ backgroundColor: '#5271ff' }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      'Sending...'
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </section>
        </div>
      </div>

      <style jsx>{`
        .icon-wrapper {
          transition: filter 0.3s ease-in-out;
        }
        .icon-wrapper:hover {
          filter: brightness(1.15);
        }
      `}</style>
    </div>
  );
}