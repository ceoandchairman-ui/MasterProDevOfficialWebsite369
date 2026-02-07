import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, Briefcase, Star, Award } from 'lucide-react';

export default function BecomeConsultantSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    title: '',
    experience: '',
    expertise: '',
    why: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!formData.name.trim() || !formData.email.trim() || !formData.expertise.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      await base44.integrations.Core.SendEmail({
        to: 'masterprodevconsultant@outlook.com',
        subject: `New Consultant Application - ${formData.name}`,
        body: `
New Consultant Application:

Name: ${formData.name}
Email: ${formData.email}
Title: ${formData.title}
Years of Experience: ${formData.experience}

Areas of Expertise:
${formData.expertise}

Why Join Us:
${formData.why}
        `
      });

      setSuccess(true);
      setFormData({ name: '', email: '', title: '', experience: '', expertise: '', why: '' });
      
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError('An error occurred. Please try again or contact us directly.');
      console.error(err);
    }

    setIsSubmitting(false);
  };

  return (
    <section id="become-consultant" className="py-16 md:py-24 bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className="rounded-[60px] p-8 md:p-12 border-3 border-solid relative"
          style={{
            background: 'linear-gradient(135deg, #6A11CB 0%, #5271ff 50%, #00bf63 100%)',
            borderColor: '#6A11CB',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}
        >
          {/* Lid Title */}
          <div className="absolute -top-6 left-12">
            <div 
              className="bg-white border-2 border-solid px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer flex items-center gap-3"
              style={{ 
                borderColor: '#6A11CB',
                boxShadow: '0 4px 8px rgba(0,0,0,0.15)'
              }}
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-lg">
                💼
              </div>
              <h2 className="text-lg md:text-xl font-bold text-black">
                Join Our Team
              </h2>
            </div>
          </div>

          <div className="mt-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Become a System Builder
              </h2>
              <p className="text-xl text-white/90 mb-6">
                Are you an experienced builder? Join our network of elite experts to document, build, and scale systems.
              </p>
              
              {/* Benefits */}
              <div className="flex flex-wrap justify-center gap-4 mt-8">
                <Badge className="bg-white/20 text-white px-4 py-2 text-sm backdrop-blur-sm border border-white/30">
                  <Star className="w-4 h-4 mr-2 inline" />
                  High-Value Projects
                </Badge>
                <Badge className="bg-white/20 text-white px-4 py-2 text-sm backdrop-blur-sm border border-white/30">
                  <Briefcase className="w-4 h-4 mr-2 inline" />
                  Flexible Schedule
                </Badge>
                <Badge className="bg-white/20 text-white px-4 py-2 text-sm backdrop-blur-sm border border-white/30">
                  <Award className="w-4 h-4 mr-2 inline" />
                  Premium Compensation
                </Badge>
              </div>
            </div>

            {/* Application Form */}
            <div className="max-w-3xl mx-auto">
              <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border-2 border-white/20 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                      Full Name *
                    </label>
                    <Input 
                      id="name"
                      name="name"
                      placeholder="John Doe" 
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="bg-white/90"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                      Email Address *
                    </label>
                    <Input 
                      id="email"
                      name="email"
                      type="email" 
                      placeholder="john@example.com" 
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="bg-white/90"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-white mb-2">
                      Professional Title
                    </label>
                    <Input 
                      id="title"
                      name="title"
                      placeholder="Solutions Architect / Lead Developer" 
                      value={formData.title}
                      onChange={handleChange}
                      className="bg-white/90"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="experience" className="block text-sm font-medium text-white mb-2">
                      Years of Experience
                    </label>
                    <Input 
                      id="experience"
                      name="experience"
                      type="number"
                      placeholder="5" 
                      value={formData.experience}
                      onChange={handleChange}
                      className="bg-white/90"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="expertise" className="block text-sm font-medium text-white mb-2">
                    Areas of Expertise *
                  </label>
                  <Textarea 
                    id="expertise"
                    name="expertise"
                    placeholder="Software Development, Data Engineering, IoT, Strategy, Mobile Apps, etc." 
                    className="h-24 bg-white/90" 
                    value={formData.expertise}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="why" className="block text-sm font-medium text-white mb-2">
                    Why do you want to join our consultant network?
                  </label>
                  <Textarea 
                    id="why"
                    name="why"
                    placeholder="Share your motivation and what you can bring to our clients..." 
                    className="h-32 bg-white/90" 
                    value={formData.why}
                    onChange={handleChange}
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
                    <span>Thank you for applying! We'll review your application and get back to you soon.</span>
                  </div>
                )}
                
                <Button 
                  type="submit" 
                  className="w-full text-white h-12 text-lg font-semibold" 
                  style={{ backgroundColor: '#6A11CB' }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}