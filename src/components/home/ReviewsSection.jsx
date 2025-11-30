
import React, { useState, useEffect } from 'react';
import { Review } from '@/entities/Review';
import { Card, CardContent } from "@/components/ui/card";
import { Star } from 'lucide-react';

export default function ReviewsSection() {
  const [reviews, setReviews] = useState([]);
  
  useEffect(() => {
    async function fetchReviews() {
      const data = await Review.list();
      setReviews(data);
    }
    fetchReviews();
  }, []);

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
    ));
  };

  return (
    <div className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Reviews Container (The Can) */}
        <div 
          className="rounded-[60px] p-8 md:p-12 border-3 border-solid relative"
          style={{
            backgroundColor: '#ffffff',
            borderColor: '#ffde59',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}
        >
          {/* Lid Title (The Button) */}
          <div className="absolute -top-6 right-12">
            <div 
              className="bg-white border-2 border-solid px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer flex items-center gap-3"
              style={{ 
                borderColor: '#ffde59',
                boxShadow: '0 4px 8px rgba(0,0,0,0.15)'
              }}
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-lg">
                ⭐
              </div>
              <h2 className="text-lg md:text-xl font-bold text-black">
                Client Success Stories
              </h2>
            </div>
          </div>

          <section id="reviews" className="mt-6">
            <div className="text-center mb-8">
              <p className="mt-4 text-lg text-gray-700">See what our clients say about their AI transformation.</p>
            </div>
            
            <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {reviews.map(review => (
                <Card key={review.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex mb-4">
                      {renderStars(review.rating)}
                    </div>
                    <p className="text-gray-700 mb-4 italic">"{review.comment}"</p>
                    <p className="font-semibold text-black">- {review.reviewerName}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
