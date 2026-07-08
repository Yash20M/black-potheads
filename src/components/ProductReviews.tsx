import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Edit2, Trash2, Check, X, Upload, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { reviewsApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface ProductReviewsProps {
  productId: string;
  productName?: string;
}

// ─── Multi-step Review Modal ─────────────────────────────────────────────────

interface ReviewModalProps {
  productId: string;
  productName?: string;
  onClose: () => void;
  onSuccess: () => void;
}

const TOTAL_STEPS = 5;

const stepVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? '60%' : '-60%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? '-60%' : '60%', opacity: 0 }),
};

const ReviewModal = ({ productId, productName, onClose, onSuccess }: ReviewModalProps) => {
  const { user } = useAuthStore();
  const [step, setStep] = useState(1);
  const [dir, setDir] = useState(1);

  // Step 1
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  // Step 2
  const [comment, setComment] = useState('');

  // Step 3
  const [displayName, setDisplayName] = useState(user?.name || '');
  const [anonymous, setAnonymous] = useState(false);

  // Step 4
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [submitting, setSubmitting] = useState(false);

  const go = (next: number) => {
    setDir(next > step ? 1 : -1);
    setStep(next);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!comment.trim()) {
      toast.error('Please write a comment');
      return;
    }
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    setSubmitting(true);
    try {
      await reviewsApi.create({
        productId,
        rating,
        comment: comment.trim(),
        displayName: anonymous ? 'Anonymous' : (displayName.trim() || 'Anonymous'),
      });
      go(5);
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const starLabel = (s: number) => {
    const labels: Record<number, string> = {
      1: 'Poor', 2: 'Fair', 3: 'Good', 4: 'Very Good', 5: 'Great',
    };
    return labels[s] || '';
  };

  const canNext = (): boolean => {
    if (step === 1) return rating > 0;
    if (step === 2) return comment.trim().length > 0;
    if (step === 3) return anonymous || displayName.trim().length > 0;
    return true;
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-end md:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal box */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.25 }}
        className="relative z-10 w-full md:max-w-lg bg-[#0d0d0d] border border-zinc-800 shadow-2xl
                   rounded-t-2xl md:rounded-2xl overflow-hidden
                   h-[90vh] md:h-auto md:max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-zinc-800 shrink-0">
          <div className="flex gap-1">
            {Array.from({ length: TOTAL_STEPS - 1 }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  'h-1 w-8 rounded-full transition-colors',
                  i + 1 <= step ? 'bg-white' : 'bg-zinc-700'
                )}
              />
            ))}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Step content */}
        <div className="flex-1 overflow-hidden relative">
          <AnimatePresence custom={dir} mode="wait">
            <motion.div
              key={step}
              custom={dir}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.22, ease: 'easeInOut' }}
              className="absolute inset-0 overflow-y-auto px-6 py-6"
            >

              {/* ── Step 1: Rate ── */}
              {step === 1 && (
                <div className="flex flex-col items-center text-center gap-6">
                  <div>
                    <h2 className="font-display text-2xl text-white uppercase tracking-wider mb-2">
                      How would you rate this product?
                    </h2>
                    <p className="text-zinc-400 text-sm">
                      We would love it if you would share a bit about your experience.
                    </p>
                  </div>

                  <div className="flex flex-col items-center gap-3">
                    <div className="flex gap-3">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setRating(s)}
                          onMouseEnter={() => setHoverRating(s)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="transition-transform hover:scale-110 active:scale-95"
                          aria-label={`Rate ${s} stars`}
                        >
                          <Star
                            size={44}
                            className={cn(
                              'transition-colors',
                              s <= (hoverRating || rating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-zinc-600'
                            )}
                          />
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-[44px] text-xs text-zinc-400 uppercase tracking-wider mt-1">
                      <span>Poor</span>
                      <span className="ml-auto">Great</span>
                    </div>
                    {rating > 0 && (
                      <p className="text-yellow-400 text-sm font-semibold uppercase tracking-wider mt-1">
                        {starLabel(rating)}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* ── Step 2: Write Review ── */}
              {step === 2 && (
                <div className="flex flex-col gap-5">
                  {productName && (
                    <p className="text-zinc-400 text-sm uppercase tracking-wider truncate">
                      {productName}
                    </p>
                  )}
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={28}
                        className={cn(
                          s <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-zinc-600'
                        )}
                      />
                    ))}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold uppercase tracking-wider text-white mb-2">
                      Review content <span className="text-red-400">(Required)</span>
                    </label>
                    <Textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Start writing here..."
                      rows={6}
                      className="w-full bg-zinc-900 text-white border border-zinc-700 focus:border-white focus:ring-0 placeholder:text-zinc-500 resize-none"
                    />
                  </div>
                </div>
              )}

              {/* ── Step 3: About You ── */}
              {step === 3 && (
                <div className="flex flex-col gap-6">
                  <div>
                    <h2 className="font-display text-2xl text-white uppercase tracking-wider mb-2">
                      About you
                    </h2>
                    <p className="text-zinc-400 text-sm">
                      Please tell us more about you.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold uppercase tracking-wider text-white mb-2">
                      Display name <span className="text-red-400">(Required)</span>
                    </label>
                    <Input
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Your name"
                      disabled={anonymous}
                      className={cn(
                        'bg-zinc-900 text-white border border-zinc-700 focus:border-white focus:ring-0 placeholder:text-zinc-500',
                        anonymous && 'opacity-40 cursor-not-allowed'
                      )}
                    />
                  </div>

                  <label className="flex items-center gap-3 cursor-pointer select-none group">
                    <div
                      onClick={() => setAnonymous(!anonymous)}
                      className={cn(
                        'w-5 h-5 border-2 flex items-center justify-center transition-colors shrink-0',
                        anonymous ? 'bg-white border-white' : 'border-zinc-600 group-hover:border-white'
                      )}
                    >
                      {anonymous && <Check size={12} className="text-black" />}
                    </div>
                    <span className="text-sm text-zinc-300">Post review as anonymous</span>
                  </label>

                  {anonymous && (
                    <p className="text-xs text-zinc-500">
                      Your review will appear under <span className="text-white font-semibold">Anonymous</span>.
                    </p>
                  )}
                </div>
              )}

              {/* ── Step 4: Share a Picture ── */}
              {step === 4 && (
                <div className="flex flex-col gap-6">
                  <div>
                    <h2 className="font-display text-2xl text-white uppercase tracking-wider mb-2">
                      Share a picture
                    </h2>
                    <p className="text-zinc-400 text-sm">
                      Upload a photo to support your review. (Optional)
                    </p>
                  </div>

                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    className="border-2 border-dashed border-zinc-700 hover:border-zinc-400 transition-colors rounded-lg p-8 flex flex-col items-center gap-3 cursor-pointer"
                  >
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="max-h-48 object-contain rounded"
                      />
                    ) : (
                      <>
                        <Upload size={36} className="text-zinc-500" />
                        <p className="text-sm text-zinc-400 text-center">
                          Click to upload or drag and drop
                        </p>
                      </>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                  {imageFile && (
                    <button
                      type="button"
                      onClick={() => { setImageFile(null); setImagePreview(null); }}
                      className="text-xs text-zinc-500 hover:text-white transition-colors self-start"
                    >
                      Remove image
                    </button>
                  )}
                </div>
              )}

              {/* ── Step 5: Success ── */}
              {step === 5 && (
                <div className="flex flex-col items-center text-center gap-6 py-4">
                  <div className="w-16 h-16 rounded-full bg-green-900/30 border border-green-700 flex items-center justify-center">
                    <Check size={32} className="text-green-400" />
                  </div>
                  <div>
                    <h2 className="font-display text-2xl text-white uppercase tracking-wider mb-2">
                      Thanks for your review!
                    </h2>
                    <p className="text-zinc-400 text-sm">
                      Your review has been submitted and will appear on the store soon.
                    </p>
                  </div>
                  <Button
                    onClick={onClose}
                    className="bg-white text-black hover:bg-gray-200 border-2 border-white uppercase tracking-wider h-11 px-8 text-sm"
                  >
                    Close
                  </Button>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer nav */}
        {step < 5 && (
          <div className="flex items-center justify-between px-6 py-5 border-t border-zinc-800 shrink-0 gap-3">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => go(step - 1)}
                className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors uppercase tracking-wider"
              >
                <ArrowLeft size={16} />
                Back
              </button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <Button
                onClick={() => go(step + 1)}
                disabled={!canNext()}
                className="bg-white text-black hover:bg-gray-200 border-2 border-white uppercase tracking-wider h-11 px-8 text-sm disabled:bg-zinc-700 disabled:text-zinc-400 disabled:border-zinc-700"
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-white text-black hover:bg-gray-200 border-2 border-white uppercase tracking-wider h-11 px-8 text-sm disabled:bg-zinc-700 disabled:text-zinc-400 disabled:border-zinc-700"
              >
                {submitting ? 'Submitting...' : 'Submit'}
              </Button>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

// ─── Main ProductReviews Component ──────────────────────────────────────────

export const ProductReviews = ({ productId, productName }: ProductReviewsProps) => {
  const { user } = useAuthStore();
  const [reviews, setReviews] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [showModal, setShowModal] = useState(false);

  // Edit state
  const [editingReview, setEditingReview] = useState<string | null>(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

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

      if (data.stats) {
        const parsedStats = {
          ...data.stats,
          averageRating:
            typeof data.stats.averageRating === 'string'
              ? parseFloat(data.stats.averageRating)
              : data.stats.averageRating,
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

  const renderStars = (
    rating: number,
    interactive: boolean = false,
    onRate?: (rating: number) => void
  ) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => interactive && onRate && onRate(star)}
          disabled={!interactive}
          className={cn('transition-colors', interactive && 'hover:scale-110 cursor-pointer')}
        >
          <Star
            size={interactive ? 24 : 16}
            className={cn(
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            )}
          />
        </button>
      ))}
    </div>
  );

  const userHasReviewed = reviews.some((r) => r.user?._id === user?._id);

  const openModal = () => {
    setShowModal(true);
  };

  return (
    <div className="py-12 md:py-16 bg-background border-t border-border">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="font-display text-2xl md:text-3xl lg:text-4xl mb-8 md:mb-12 text-white uppercase tracking-wider">
          Customer Reviews
        </h2>

        {/* Stats Summary */}
        {stats && (
          <div className="mb-8 md:mb-12 p-6 md:p-8 bg-card border border-border shadow-sm">
            <div className="flex flex-col md:flex-row gap-6 md:gap-8">
              <div className="text-center md:text-left md:border-r md:border-border md:pr-8 pb-6 md:pb-0 border-b md:border-b-0 border-border">
                <div className="text-5xl md:text-6xl font-display mb-3 text-white">
                  {typeof stats.averageRating === 'number'
                    ? stats.averageRating.toFixed(1)
                    : parseFloat(stats.averageRating || '0').toFixed(1)}
                </div>
                <div className="flex justify-center md:justify-start mb-3">
                  {renderStars(Math.round(parseFloat(stats.averageRating?.toString() || '0')))}
                </div>
                <div className="text-xs md:text-sm text-muted-foreground uppercase tracking-wider">
                  Based on {stats.totalReviews || 0}{' '}
                  {stats.totalReviews === 1 ? 'review' : 'reviews'}
                </div>
              </div>

              <div className="flex-1">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = stats.distribution?.[star] || 0;
                  const percentage =
                    stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
                  return (
                    <div key={star} className="flex items-center gap-3 md:gap-4 mb-2 md:mb-3">
                      <span className="text-xs md:text-sm font-medium w-12 md:w-16 text-foreground uppercase tracking-wider">
                        {star} Star
                      </span>
                      <div className="flex-1 h-2 md:h-3 bg-secondary overflow-hidden">
                        <div
                          className="h-full bg-yellow-400 transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-xs md:text-sm font-medium text-foreground w-8 md:w-12 text-right">
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
        {!userHasReviewed && (
          <Button
            onClick={openModal}
            className="mb-8 bg-white text-black hover:bg-gray-200 border-2 border-white uppercase tracking-wider h-11 md:h-12 px-6 md:px-8 text-sm md:text-base w-full md:w-auto"
            size="lg"
          >
            Write a Review
          </Button>
        )}

        {/* Reviews List */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-base md:text-lg uppercase tracking-wider">
              Loading reviews...
            </p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12 md:py-16 bg-card border-2 border-border">
            <p className="text-white text-lg md:text-xl mb-6 uppercase tracking-wider font-display">
              No reviews yet
            </p>
            {!userHasReviewed && (
              <Button
                onClick={openModal}
                className="bg-white text-black hover:bg-gray-200 border-2 border-white uppercase tracking-wider h-11 md:h-12 px-6 md:px-8 text-sm md:text-base"
                size="lg"
              >
                Be the first to review
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4 md:space-y-6">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="border border-border p-4 md:p-6 bg-card hover:shadow-md transition-shadow"
              >
                {editingReview === review._id ? (
                  <div className="p-4 md:p-6 bg-secondary border-2 border-primary">
                    <div className="mb-6">
                      <label className="block text-sm font-semibold mb-3 uppercase tracking-wider text-white">
                        Rating
                      </label>
                      {renderStars(editRating, true, setEditRating)}
                    </div>
                    <div className="mb-6">
                      <label className="block text-sm font-semibold mb-3 uppercase tracking-wider text-white">
                        Your Review
                      </label>
                      <Textarea
                        value={editComment}
                        onChange={(e) => setEditComment(e.target.value)}
                        rows={5}
                        className="w-full bg-background text-foreground border-2 border-border focus:border-primary focus:ring-0"
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                      <Button
                        onClick={() => handleUpdateReview(review._id)}
                        disabled={submitting}
                        className="bg-white text-black hover:bg-gray-200 border-2 border-white uppercase tracking-wider h-10 md:h-11 px-4 md:px-6 text-sm"
                      >
                        <Check size={16} className="mr-2" />
                        Save
                      </Button>
                      <Button
                        onClick={cancelEdit}
                        className="bg-background border-2 border-white text-white hover:bg-secondary uppercase tracking-wider h-10 md:h-11 px-4 md:px-6 text-sm"
                        disabled={submitting}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
                          <span className="font-display text-base md:text-lg text-white uppercase tracking-wider">
                            {review.user?.name || review.guestName || 'Anonymous'}
                          </span>
                          {review.isVerifiedPurchase && (
                            <span className="text-xs bg-green-900/30 text-green-400 border border-green-700 px-2 md:px-3 py-1 uppercase tracking-wider font-semibold inline-block w-fit">
                              Verified Purchase
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                          {renderStars(review.rating)}
                          <span className="text-xs md:text-sm text-muted-foreground uppercase tracking-wider">
                            {new Date(review.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                      </div>
                      {user && review.user?._id === user._id && (
                        <div className="flex gap-2 sm:ml-4">
                          <button
                            onClick={() => startEdit(review)}
                            className="p-2 md:p-2.5 lg:p-2 border-2 border-white text-white hover:bg-white hover:text-black transition-colors"
                            title="Edit review"
                          >
                            <Edit2 size={18} className="sm:w-5 sm:h-5 lg:w-4 lg:h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteReview(review._id)}
                            className="p-2 md:p-2.5 lg:p-2 border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-colors"
                            title="Delete review"
                          >
                            <Trash2 size={18} className="sm:w-5 sm:h-5 lg:w-4 lg:h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                    <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                      {review.comment}
                    </p>
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
              className="bg-white text-black hover:bg-gray-200 border-2 border-white disabled:bg-muted disabled:text-muted-foreground uppercase tracking-wider h-11 md:h-12 px-6 md:px-8 text-sm md:text-base w-full sm:w-auto"
            >
              Previous
            </Button>
            <span className="text-sm md:text-base text-white font-semibold uppercase tracking-wider px-4">
              Page {page} of {totalPages}
            </span>
            <Button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="bg-white text-black hover:bg-gray-200 border-2 border-white disabled:bg-muted disabled:text-muted-foreground uppercase tracking-wider h-11 md:h-12 px-6 md:px-8 text-sm md:text-base w-full sm:w-auto"
            >
              Next
            </Button>
          </div>
        )}
      </div>

      {/* Review Modal */}
      <AnimatePresence>
        {showModal && (
          <ReviewModal
            productId={productId}
            productName={productName}
            onClose={() => setShowModal(false)}
            onSuccess={() => { loadReviews(); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
