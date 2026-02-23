import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Edit2, Trash2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { reviewsApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface ProductReviewsProps {
  productId: string;
}

export const ProductReviews = ({ productId }: ProductReviewsProps) => {
  const { user } = useAuthStore();
  const [reviews, setReviews] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Review form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  // Edit state
  const [editingReview, setEditingReview] = useState<string | null>(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState('');

  useEffect(() => {
    loadReviews();
  }, [productId, page]);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const data: any = await reviewsApi.getByProduct(productId, {
        page,
        limit: 10,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });
      
      setReviews(data.reviews || []);
      
      // Parse stats to ensure averageRating is a number
      if (data.stats) {
        const parsedStats = {
          ...data.stats,
          averageRating: typeof data.stats.averageRating === 'string' 
            ? parseFloat(data.stats.averageRating) 
            : data.stats.averageRating
        };
        setStats(parsedStats);
      } else {
        setStats(null);
      }
      
      setTotalPages(data.totalPages || 1);
    } catch (error: any) {
      console.error('Failed to load reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!user) {
      toast.error('Please login to write a review');
      return;
    }

    if (!comment.trim()) {
      toast.error('Please write a comment');
      return;
    }

    setSubmitting(true);
    try {
      await reviewsApi.create({
        productId,
        rating,
        comment: comment.trim(),
      });
      
      toast.success('Review submitted successfully');
      setShowReviewForm(false);
      setRating(5);
      setComment('');
      loadReviews();
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateReview = async (reviewId: string) => {
    setSubmitting(true);
    try {
      await reviewsApi.update(reviewId, {
        rating: editRating,
        comment: editComment.trim(),
      });
      
      toast.success('Review updated successfully');
      setEditingReview(null);
      loadReviews();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    try {
      await reviewsApi.delete(reviewId);
      toast.success('Review deleted successfully');
      loadReviews();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete review');
    }
  };

  const startEdit = (review: any) => {
    setEditingReview(review._id);
    setEditRating(review.rating);
    setEditComment(review.comment);
  };

  const cancelEdit = () => {
    setEditingReview(null);
    setEditRating(5);
    setEditComment('');
  };

  const renderStars = (rating: number, interactive: boolean = false, onRate?: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => interactive && onRate && onRate(star)}
            disabled={!interactive}
            className={cn(
              'transition-colors',
              interactive && 'hover:scale-110 cursor-pointer'
            )}
          >
            <Star
              size={interactive ? 24 : 16}
              className={cn(
                star <= rating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              )}
            />
          </button>
        ))}
      </div>
    );
  };

  const userHasReviewed = reviews.some(r => r.user?._id === user?._id);

  return (
    <div className="py-12 md:py-16 bg-gradient-to-b from-white to-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="font-display text-2xl md:text-3xl lg:text-4xl mb-8 md:mb-12 text-gray-900 uppercase tracking-wider">
          Customer Reviews
        </h2>

        {/* Stats Summary */}
        {stats && (
          <div className="mb-8 md:mb-12 p-6 md:p-8 bg-white border border-gray-200 shadow-sm">
            <div className="flex flex-col md:flex-row gap-6 md:gap-8">
              <div className="text-center md:text-left md:border-r md:border-gray-200 md:pr-8 pb-6 md:pb-0 border-b md:border-b-0 border-gray-200">
                <div className="text-5xl md:text-6xl font-display mb-3 text-gray-900">
                  {typeof stats.averageRating === 'number' 
                    ? stats.averageRating.toFixed(1) 
                    : parseFloat(stats.averageRating || '0').toFixed(1)}
                </div>
                <div className="flex justify-center md:justify-start mb-3">
                  {renderStars(Math.round(parseFloat(stats.averageRating?.toString() || '0')))}
                </div>
                <div className="text-xs md:text-sm text-gray-600 uppercase tracking-wider">
                  Based on {stats.totalReviews || 0} {stats.totalReviews === 1 ? 'review' : 'reviews'}
                </div>
              </div>

              <div className="flex-1">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = stats.distribution?.[star] || 0;
                  const percentage = stats.totalReviews > 0 
                    ? (count / stats.totalReviews) * 100 
                    : 0;
                  
                  return (
                    <div key={star} className="flex items-center gap-3 md:gap-4 mb-2 md:mb-3">
                      <span className="text-xs md:text-sm font-medium w-12 md:w-16 text-gray-700 uppercase tracking-wider">
                        {star} Star
                      </span>
                      <div className="flex-1 h-2 md:h-3 bg-gray-200 overflow-hidden">
                        <div
                          className="h-full bg-yellow-400 transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-xs md:text-sm font-medium text-gray-700 w-8 md:w-12 text-right">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Write Review Button */}
        {user && !userHasReviewed && !showReviewForm && (
          <Button
            onClick={() => setShowReviewForm(true)}
            className="mb-8 bg-gray-900 text-white hover:bg-gray-800 uppercase tracking-wider h-11 md:h-12 px-6 md:px-8 text-sm md:text-base w-full md:w-auto"
            size="lg"
          >
            Write a Review
          </Button>
        )}

        {/* Review Form */}
        <AnimatePresence>
          {showReviewForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 p-6 md:p-8 bg-white border-2 border-gray-900 shadow-lg"
            >
              <h3 className="font-display text-xl md:text-2xl mb-6 uppercase tracking-wider text-gray-900">
                Write Your Review
              </h3>
              
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-3 uppercase tracking-wider text-gray-900">
                  Rating
                </label>
                {renderStars(rating, true, setRating)}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold mb-3 uppercase tracking-wider text-gray-900">
                  Your Review
                </label>
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your thoughts about this product..."
                  rows={5}
                  className="w-full bg-white text-gray-900 border-2 border-gray-300 focus:border-gray-900 focus:ring-0 placeholder:text-gray-400"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                <Button
                  onClick={handleSubmitReview}
                  disabled={submitting || !comment.trim()}
                  className="bg-gray-900 text-white hover:bg-gray-800 uppercase tracking-wider h-11 md:h-12 px-6 md:px-8 disabled:bg-gray-400 disabled:text-gray-200 text-sm md:text-base"
                  size="lg"
                >
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </Button>
                <Button
                  onClick={() => {
                    setShowReviewForm(false);
                    setRating(5);
                    setComment('');
                  }}
                  className="bg-white border-2 border-gray-900 text-gray-900 hover:bg-gray-100 uppercase tracking-wider h-11 md:h-12 px-6 md:px-8 text-sm md:text-base"
                  size="lg"
                  disabled={submitting}
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reviews List */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-base md:text-lg uppercase tracking-wider">Loading reviews...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12 md:py-16 bg-white border-2 border-gray-200">
            <p className="text-gray-900 text-lg md:text-xl mb-6 uppercase tracking-wider font-display">
              No reviews yet
            </p>
            {user && !showReviewForm && (
              <Button 
                onClick={() => setShowReviewForm(true)} 
                className="bg-gray-900 text-white hover:bg-gray-800 uppercase tracking-wider h-11 md:h-12 px-6 md:px-8 text-sm md:text-base"
                size="lg"
              >
                Be the first to review
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4 md:space-y-6">
            {reviews.map((review) => (
              <div key={review._id} className="border border-gray-200 p-4 md:p-6 bg-white hover:shadow-md transition-shadow">
                {editingReview === review._id ? (
                  // Edit Mode
                  <div className="p-4 md:p-6 bg-gray-50 border-2 border-gray-900">
                    <div className="mb-6">
                      <label className="block text-sm font-semibold mb-3 uppercase tracking-wider text-gray-900">
                        Rating
                      </label>
                      {renderStars(editRating, true, setEditRating)}
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-semibold mb-3 uppercase tracking-wider text-gray-900">
                        Your Review
                      </label>
                      <Textarea
                        value={editComment}
                        onChange={(e) => setEditComment(e.target.value)}
                        rows={5}
                        className="w-full bg-white text-gray-900 border-2 border-gray-300 focus:border-gray-900 focus:ring-0"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                      <Button
                        onClick={() => handleUpdateReview(review._id)}
                        disabled={submitting}
                        className="bg-gray-900 text-white hover:bg-gray-800 uppercase tracking-wider h-10 md:h-11 px-4 md:px-6 text-sm"
                      >
                        <Check size={16} className="mr-2" />
                        Save
                      </Button>
                      <Button
                        onClick={cancelEdit}
                        className="bg-white border-2 border-gray-900 text-gray-900 hover:bg-gray-100 uppercase tracking-wider h-10 md:h-11 px-4 md:px-6 text-sm"
                        disabled={submitting}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <>
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
                          <span className="font-display text-base md:text-lg text-gray-900 uppercase tracking-wider">
                            {review.user?.name || 'Anonymous'}
                          </span>
                          {review.isVerifiedPurchase && (
                            <span className="text-xs bg-green-50 text-green-700 border border-green-200 px-2 md:px-3 py-1 uppercase tracking-wider font-semibold inline-block w-fit">
                              Verified Purchase
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                          {renderStars(review.rating)}
                          <span className="text-xs md:text-sm text-gray-500 uppercase tracking-wider">
                            {new Date(review.createdAt).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}
                          </span>
                        </div>
                      </div>

                      {user && review.user?._id === user._id && (
                        <div className="flex gap-2 sm:ml-4">
                          <button
                            onClick={() => startEdit(review)}
                            className="p-2 md:p-2.5 border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-colors rounded"
                            title="Edit review"
                          >
                            <Edit2 size={18} className="sm:w-5 sm:h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteReview(review._id)}
                            className="p-2 md:p-2.5 border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-colors rounded"
                            title="Delete review"
                          >
                            <Trash2 size={18} className="sm:w-5 sm:h-5" />
                          </button>
                        </div>
                      )}
                    </div>

                    <p className="text-gray-700 leading-relaxed text-sm md:text-base">{review.comment}</p>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 mt-8 md:mt-12">
            <Button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="bg-gray-900 text-white hover:bg-gray-800 disabled:bg-gray-300 disabled:text-gray-500 uppercase tracking-wider h-11 md:h-12 px-6 md:px-8 text-sm md:text-base w-full sm:w-auto"
            >
              Previous
            </Button>
            <span className="text-sm md:text-base text-gray-900 font-semibold uppercase tracking-wider px-4">
              Page {page} of {totalPages}
            </span>
            <Button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="bg-gray-900 text-white hover:bg-gray-800 disabled:bg-gray-300 disabled:text-gray-500 uppercase tracking-wider h-11 md:h-12 px-6 md:px-8 text-sm md:text-base w-full sm:w-auto"
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
