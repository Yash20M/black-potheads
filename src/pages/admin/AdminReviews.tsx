import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Trash2, Filter, X, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { adminApi } from '@/lib/api';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const AdminReviews = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalReviews, setTotalReviews] = useState(0);
  
  // Filters
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    rating: '',
    productId: '',
    isVerifiedPurchase: '',
  });

  useEffect(() => {
    loadReviews();
  }, [page, filters]);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const params: any = {
        page,
        limit: 20,
      };

      if (filters.rating) params.rating = parseInt(filters.rating);
      if (filters.productId) params.productId = filters.productId;
      if (filters.isVerifiedPurchase) {
        params.isVerifiedPurchase = filters.isVerifiedPurchase === 'true';
      }

      const data: any = await adminApi.reviews.getAll(params);
      
      setReviews(data.reviews || []);
      setTotalPages(data.totalPages || 1);
      setTotalReviews(data.totalReviews || 0);
    } catch (error: any) {
      console.error('Load reviews error:', error);
      toast.error('Failed to load reviews: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    try {
      await adminApi.reviews.delete(reviewId);
      toast.success('Review deleted successfully');
      loadReviews();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete review');
    }
  };

  const clearFilters = () => {
    setFilters({
      rating: '',
      productId: '',
      isVerifiedPurchase: '',
    });
    setPage(1);
  };

  const hasActiveFilters = filters.rating || filters.productId || filters.isVerifiedPurchase;

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={cn(
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            )}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-display mb-2">Reviews Management</h1>
        <p className="text-muted-foreground">
          Manage and moderate customer reviews ({totalReviews} total)
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="mb-4"
        >
          <Filter size={16} className="mr-2" />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </Button>

        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-card border rounded-lg p-4 mb-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Rating</label>
                <select
                  value={filters.rating}
                  onChange={(e) => {
                    setFilters({ ...filters, rating: e.target.value });
                    setPage(1);
                  }}
                  className="w-full h-10 px-3 border border-input bg-background rounded-md"
                >
                  <option value="">All Ratings</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Product ID</label>
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search by product ID..."
                    value={filters.productId}
                    onChange={(e) => {
                      setFilters({ ...filters, productId: e.target.value });
                      setPage(1);
                    }}
                    className="pl-9"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Purchase Status</label>
                <select
                  value={filters.isVerifiedPurchase}
                  onChange={(e) => {
                    setFilters({ ...filters, isVerifiedPurchase: e.target.value });
                    setPage(1);
                  }}
                  className="w-full h-10 px-3 border border-input bg-background rounded-md"
                >
                  <option value="">All Reviews</option>
                  <option value="true">Verified Purchase</option>
                  <option value="false">Not Verified</option>
                </select>
              </div>
            </div>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                onClick={clearFilters}
                className="mt-4"
                size="sm"
              >
                <X size={16} className="mr-2" />
                Clear Filters
              </Button>
            )}
          </motion.div>
        )}
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading reviews...</p>
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12 bg-card border rounded-lg">
          <p className="text-muted-foreground">No reviews found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <motion.div
              key={review._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4 mb-4">
                {/* Product Image */}
                {typeof review.product === 'object' && review.product?.images?.[0]?.url && (
                  <div className="flex-shrink-0">
                    <img
                      src={review.product.images[0].url}
                      alt={review.product.name}
                      className="w-16 h-16 object-cover rounded border"
                    />
                  </div>
                )}

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-semibold text-lg">
                      {review.user?.name || 'Anonymous'}
                    </span>
                    {review.isVerifiedPurchase && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                        Verified Purchase
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
                    {renderStars(review.rating)}
                    <span>•</span>
                    <span>
                      {new Date(review.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground mb-1">
                    <span className="font-medium">Product:</span>{' '}
                    {typeof review.product === 'object' 
                      ? review.product?.name || 'Unknown Product'
                      : review.product}
                  </div>
                  {typeof review.product === 'object' && review.product?.category && (
                    <div className="text-sm text-muted-foreground mb-1">
                      <span className="font-medium">Category:</span> {review.product.category}
                    </div>
                  )}
                  <div className="text-sm text-muted-foreground mb-1">
                    <span className="font-medium">Product ID:</span>{' '}
                    {typeof review.product === 'object' ? review.product?._id : review.product}
                  </div>
                  {review.user?.email && (
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium">Email:</span> {review.user.email}
                    </div>
                  )}
                </div>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteReview(review._id)}
                  className="flex-shrink-0"
                >
                  <Trash2 size={16} className="mr-2" />
                  Delete
                </Button>
              </div>

              <p className="text-foreground leading-relaxed">{review.comment}</p>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default AdminReviews;
