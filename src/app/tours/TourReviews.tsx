'use client';

import { useState, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Pen, Send, LogIn } from 'lucide-react';
import Link from 'next/link';
import { submitReview, Review } from '@/actions/tours';

interface TourReviewsProps {
  tourId: string;
  initialReviews: Review[];
  currentUserId: string | null;
  userExistingReview: Review | null;
}

function StarRow({ rating, onRate, interactive = false }: { rating: number; onRate?: (r: number) => void; interactive?: boolean }) {
  const [hovered, setHovered] = useState(0);
  const active = hovered || rating;

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type={interactive ? 'button' : undefined}
          onClick={() => interactive && onRate?.(s)}
          onMouseEnter={() => interactive && setHovered(s)}
          onMouseLeave={() => interactive && setHovered(0)}
          className={interactive ? 'cursor-pointer transition-transform hover:scale-110' : 'cursor-default'}
        >
          <Star
            size={interactive ? 24 : 14}
            className={s <= active ? 'text-[#B8860B] fill-[#B8860B]' : 'text-white/20 fill-transparent'}
          />
        </button>
      ))}
    </div>
  );
}

function averageRating(reviews: Review[]) {
  if (!reviews.length) return 0;
  return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
}

export default function TourReviews({ tourId, initialReviews, currentUserId, userExistingReview }: TourReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [rating, setRating] = useState(userExistingReview?.rating || 0);
  const [body, setBody] = useState(userExistingReview?.body || '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const avg = averageRating(reviews);
  const isEditing = !!userExistingReview;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) { setError('Please select a star rating.'); return; }
    if (body.trim().length < 10) { setError('Review must be at least 10 characters.'); return; }
    setError('');

    startTransition(async () => {
      const result = await submitReview(tourId, rating, body.trim());
      if (result.error) {
        setError(result.error);
        return;
      }
      setSuccess(true);
      // Optimistically update the list
      setReviews(prev => {
        const filtered = prev.filter(r => r.user_id !== currentUserId);
        return [{ id: Date.now().toString(), user_id: currentUserId, reviewer_name: 'You', rating, body: body.trim(), created_at: new Date().toISOString() }, ...filtered];
      });
    });
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-24 border-t border-white/5">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
        <div>
          <span className="block text-[#B8860B] tracking-[0.3em] font-bold uppercase text-[10px] mb-3">Traveler Voices</span>
          <h2 className="text-3xl md:text-4xl font-serif text-[#FAFAF8] leading-tight">Reviews</h2>
        </div>
        {reviews.length > 0 && (
          <div className="flex items-center gap-4 bg-[#1A241B] border border-white/10 rounded-2xl px-6 py-4">
            <span className="text-4xl font-serif text-[#E8D3A2]">{avg.toFixed(1)}</span>
            <div>
              <StarRow rating={Math.round(avg)} />
              <span className="text-white/40 text-[10px] uppercase tracking-widest font-bold mt-1 block">
                {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 items-start">

        {/* Review Cards */}
        <div className="flex flex-col gap-4">
          {reviews.length === 0 ? (
            <div className="py-16 text-center border border-dashed border-white/10 rounded-2xl">
              <Star size={32} className="text-white/20 mx-auto mb-3" />
              <p className="text-white/40 text-sm">No reviews yet. Be the first to share your experience.</p>
            </div>
          ) : (
            <AnimatePresence>
              {reviews.map((review, i) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="bg-[#1A241B] border border-white/5 rounded-2xl p-6 md:p-8"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#B8860B]/20 border border-[#B8860B]/30 flex items-center justify-center shrink-0">
                        <span className="text-[#E8D3A2] font-bold text-sm">
                          {review.reviewer_name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <span className="text-white font-bold text-sm">{review.reviewer_name}</span>
                        <span className="block text-white/30 text-[10px] uppercase tracking-widest mt-0.5">
                          {new Date(review.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                    <StarRow rating={review.rating} />
                  </div>
                  <p className="text-white/60 text-sm leading-relaxed">{review.body}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Write Review Panel */}
        <div className="sticky top-32">
          {!currentUserId ? (
            <div className="bg-[#1A241B] border border-white/10 rounded-2xl p-8 flex flex-col items-center text-center gap-4">
              <div className="w-14 h-14 rounded-full bg-[#B8860B]/10 flex items-center justify-center">
                <LogIn size={24} className="text-[#B8860B]" />
              </div>
              <h3 className="text-xl font-serif text-white">Share Your Experience</h3>
              <p className="text-white/50 text-sm leading-relaxed">Log in to leave a review for this journey.</p>
              <Link
                href="/login"
                className="mt-2 bg-[#E8D3A2] text-[#131A14] px-8 py-3.5 rounded-full font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-white transition-colors"
              >
                Log In to Review
              </Link>
            </div>
          ) : success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#1A241B] border border-[#B8860B]/30 rounded-2xl p-8 flex flex-col items-center text-center gap-4"
            >
              <div className="w-14 h-14 rounded-full bg-[#B8860B]/20 flex items-center justify-center">
                <Star size={24} className="text-[#B8860B] fill-[#B8860B]" />
              </div>
              <h3 className="text-xl font-serif text-white">Thank you!</h3>
              <p className="text-white/50 text-sm">Your review has been published.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-[#1A241B] border border-white/10 rounded-2xl p-8 flex flex-col gap-6">
              <div className="flex items-center gap-3 mb-2">
                <Pen size={16} className="text-[#B8860B]" />
                <h3 className="text-lg font-serif text-white">{isEditing ? 'Update Your Review' : 'Write a Review'}</h3>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-bold">Your Rating</label>
                <StarRow rating={rating} onRate={setRating} interactive />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-bold">Your Experience</label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={5}
                  placeholder="Describe your journey..."
                  className="w-full bg-[#131A14] border border-white/10 rounded-xl px-5 py-4 text-white text-sm focus:outline-none focus:border-[#B8860B] transition-colors resize-none leading-relaxed placeholder:text-white/20"
                />
              </div>

              {error && <p className="text-red-400 text-xs">{error}</p>}

              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-[#E8D3A2] text-[#131A14] py-4 rounded-xl font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-white transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
              >
                {isPending ? 'Submitting...' : isEditing ? 'Update Review' : 'Publish Review'}
                {!isPending && <Send size={13} />}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
