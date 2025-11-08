
import React, { useState } from 'react';
import { Review } from '@/entities/Review';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Star, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PostYourRatingSection() {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (rating === 0) {
      setError('Please select a star rating.');
      return;
    }
    if (!comment.trim()) {
      setError('Please leave a comment.');
      return;
    }
    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }

    try {
      await Review.create({
        reviewerName: name,
        comment: comment,
        rating: rating,
      });

      setSuccess('Thank you for your feedback! It has been submitted successfully.');
      setName('');
      setComment('');
      setRating(0);
      setHoverRating(0);

      setTimeout(() => setSuccess(''), 5000);
    } catch (e) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Post Your Rating Container (The Can) */}
        <div 
          className="rounded-[60px] p-8 md:p-12 border-3 border-solid relative"
          style={{
            backgroundColor: '#ffde59',
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
                🌟
              </div>
              <h2 className="text-lg md:text-xl font-bold text-black">
                Post Your Rating
              </h2>
            </div>
          </div>

          <section id="post-rating" className="mt-6">
            <div className="max-w-2xl mx-auto bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-lg">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="text-center">
                  <label className="block text-lg font-medium text-gray-800 mb-3">Your Rating</label>
                  <div className="flex justify-center items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="w-8 h-8 cursor-pointer transition-all duration-200"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        style={{
                          fill: (hoverRating || rating) >= star ? '#ffb400' : 'none',
                          color: (hoverRating || rating) >= star ? '#ffb400' : '#d1d5db',
                          transform: (hoverRating || rating) >= star ? 'scale(1.2)' : 'scale(1)',
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Jane Doe"
                    className="mt-1"
                  />
                </div>

                <div>
                  <label htmlFor="comment" className="block text-sm font-medium text-gray-700">Comment</label>
                  <Textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your experience with us..."
                    className="mt-1 h-32"
                  />
                </div>
                
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md flex items-center gap-3"
                    >
                      <AlertCircle className="w-5 h-5"/>
                      <span>{error}</span>
                    </motion.div>
                  )}
                  {success && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md flex items-center gap-3"
                    >
                      <CheckCircle className="w-5 h-5"/>
                      <span>{success}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div>
                  <Button type="submit" className="w-full text-white text-lg py-6" style={{ backgroundColor: '#00bf63' }}>
                    Submit Feedback
                  </Button>
                </div>
              </form>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
