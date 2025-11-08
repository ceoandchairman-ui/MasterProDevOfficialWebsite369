import React, { useState, useEffect } from 'react';
import { Consultant } from '@/entities/Consultant';
import { Review } from '@/entities/Review';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { 
  MapPin, DollarSign, Languages, Star, Mail, ExternalLink, 
  Briefcase, Award, Calendar, CheckCircle 
} from 'lucide-react';

export default function ConsultantDetail() {
  const [consultant, setConsultant] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ reviewerName: '', comment: '', rating: 5 });
  const [showContactForm, setShowContactForm] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const consultantId = urlParams.get('id');

    if (consultantId) {
      Consultant.list().then(data => {
        const found = data.find(c => c.id === consultantId);
        setConsultant(found);
      });

      Review.filter({ consultantId }).then(setReviews);
    }
  }, []);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!consultant) return;

    await Review.create({
      ...newReview,
      consultantId: consultant.id
    });

    // Refresh reviews
    const updatedReviews = await Review.filter({ consultantId: consultant.id });
    setReviews(updatedReviews);

    // Calculate and update average rating
    const avgRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length;
    await Consultant.update(consultant.id, { averageRating: avgRating });

    setNewReview({ reviewerName: '', comment: '', rating: 5 });
  };

  if (!consultant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading consultant profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Card */}
        <Card className="mb-8 border-2 border-blue-200">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-8">
              <img 
                src={consultant.photoUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face"} 
                alt={consultant.name}
                className="w-40 h-40 rounded-full object-cover shadow-lg"
              />
              
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-4xl font-bold mb-2">{consultant.name}</h1>
                    <p className="text-xl text-gray-600 mb-2">{consultant.title}</p>
                    {consultant.averageRating && (
                      <div className="flex items-center gap-2">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-5 h-5 ${i < consultant.averageRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                        <span className="text-lg font-semibold ml-2">
                          {consultant.averageRating.toFixed(1)} ({reviews.length} reviews)
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-lg mb-6 text-gray-700">{consultant.tagline}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <span>{consultant.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Languages className="w-5 h-5 text-green-600" />
                    <span>{consultant.languages?.join(', ')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Briefcase className="w-5 h-5 text-purple-600" />
                    <span>{consultant.experience}+ years experience</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <span className="font-semibold">${consultant.hourlyRate}/hr | Min: ${consultant.minBudget}</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button 
                    size="lg" 
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => setShowContactForm(!showContactForm)}
                  >
                    <Mail className="w-5 h-5 mr-2" />
                    Hire Now
                  </Button>
                  <Button size="lg" variant="outline">
                    <Mail className="w-5 h-5 mr-2" />
                    Contact
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Form (Conditional) */}
        {showContactForm && (
          <Card className="mb-8 border-2 border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle>Contact {consultant.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <Input placeholder="Your Name" />
                <Input type="email" placeholder="Your Email" />
                <Input placeholder="Project Budget" />
                <Textarea placeholder="Tell us about your project..." className="h-32" />
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-6 h-6 text-blue-600" />
                  About
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {consultant.bio || 'No biography available.'}
                </p>
              </CardContent>
            </Card>

            {/* Services Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  Services Offered
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {consultant.servicesOffered?.map(service => (
                    <Badge key={service} className="text-sm py-2 px-4" style={{ backgroundColor: consultant.color || '#4285F4' }}>
                      {service}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Portfolio Section */}
            {consultant.portfolioLinks && consultant.portfolioLinks.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ExternalLink className="w-6 h-6 text-purple-600" />
                    Portfolio & Links
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {consultant.portfolioLinks.map((link, index) => (
                      <a 
                        key={index} 
                        href={link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        <ExternalLink className="w-4 h-4" />
                        {link}
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Reviews Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-6 h-6 text-yellow-500" />
                  Client Reviews ({reviews.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {reviews.map(review => (
                  <div key={review.id} className="border-b pb-4 last:border-b-0">
                    <div className="flex items-center gap-2 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <p className="text-gray-700 mb-2">"{review.comment}"</p>
                    <p className="text-sm text-gray-500">- {review.reviewerName}</p>
                  </div>
                ))}

                {reviews.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No reviews yet. Be the first to leave a review!</p>
                )}
              </CardContent>
            </Card>

            {/* Add Review Form */}
            <Card className="border-2 border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle>Leave a Review</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <Input 
                    placeholder="Your Name" 
                    value={newReview.reviewerName}
                    onChange={(e) => setNewReview({...newReview, reviewerName: e.target.value})}
                    required
                  />
                  <Textarea 
                    placeholder="Share your experience..." 
                    className="h-24"
                    value={newReview.comment}
                    onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                    required
                  />
                  <div>
                    <label className="block text-sm font-medium mb-2">Your Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map(rating => (
                        <Star
                          key={rating}
                          className={`w-8 h-8 cursor-pointer transition-all ${
                            rating <= newReview.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                          }`}
                          onClick={() => setNewReview({...newReview, rating})}
                        />
                      ))}
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Submit Review
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            <Card className="sticky top-24 bg-gradient-to-br from-blue-600 to-green-600 text-white">
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold mb-4">Quick Contact</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    <span className="break-all">{consultant.contactEmail}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    <span>${consultant.hourlyRate}/hour</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    <span>Min Budget: ${consultant.minBudget}</span>
                  </div>
                </div>
                <Button className="w-full bg-white text-blue-600 hover:bg-gray-100 font-semibold">
                  Start a Project
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}