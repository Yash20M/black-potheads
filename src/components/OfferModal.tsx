import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Tag, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { offersApi } from '@/lib/api';
import { useNavigate, useLocation } from 'react-router-dom';

const OfferModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [offers, setOffers] = useState<any[]>([]);
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  // Load offers on every page load
  useEffect(() => {
    // Don't show offer modal in admin section
    if (location.pathname.startsWith('/admin')) {
      console.log('OfferModal: Skipping - in admin section');
      return;
    }

    console.log('OfferModal: Component mounted, will load offers in 3 seconds...');
    const timer = setTimeout(() => {
      loadOffers();
    }, 3000);

    return () => clearTimeout(timer);
  }, [location.pathname]); // Re-run when route changes

  // Manual trigger for testing with Ctrl+O
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'o') {
        console.log('OfferModal: Manual trigger (Ctrl+O)');
        loadOffers();
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Listen for custom force show event
  useEffect(() => {
    const handleForceShow = () => {
      console.log('OfferModal: Force show event received');
      loadOffers();
    };

    window.addEventListener('forceShowOffers', handleForceShow as EventListener);
    
    return () => {
      window.removeEventListener('forceShowOffers', handleForceShow as EventListener);
    };
  }, []);

  const loadOffers = async () => {
    console.log('OfferModal: Loading offers from API...');
    console.log('OfferModal: API URL:', import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000');
    
    try {
      const data: any = await offersApi.getActive();
      console.log('OfferModal: API response:', data);
      
      if (data && data.success && data.offers && data.offers.length > 0) {
        console.log('OfferModal: Found', data.offers.length, 'active offers');
        
        // Get list of seen offer IDs from session storage
        const seenOffersJson = sessionStorage.getItem('seenOffers');
        const seenOffers: string[] = seenOffersJson ? JSON.parse(seenOffersJson) : [];
        console.log('OfferModal: Previously seen offers:', seenOffers);
        
        // Filter out offers that have already been seen in this session
        const unseenOffers = data.offers.filter((offer: any) => !seenOffers.includes(offer._id));
        console.log('OfferModal: Unseen offers:', unseenOffers.length);
        
        if (unseenOffers.length > 0) {
          setOffers(unseenOffers);
          setIsOpen(true);
        } else {
          console.log('OfferModal: All offers have been seen in this session');
        }
      } else {
        console.log('OfferModal: No active offers found');
        console.log('OfferModal: Response structure:', JSON.stringify(data));
      }
    } catch (error: any) {
      console.error('OfferModal: Failed to load offers:', error);
      console.error('OfferModal: Error details:', {
        message: error.message,
        status: error.status,
      });
      
      // If it's a 401 error, the backend needs to be fixed
      if (error.status === 401) {
        console.error('OfferModal: BACKEND ISSUE - The /api/v1/offers/active endpoint requires authentication but should be public!');
        console.error('OfferModal: Please update the backend to allow unauthenticated access to active offers.');
      }
    }
  };

  const markOfferAsSeen = (offerId: string) => {
    // Get current list of seen offers
    const seenOffersJson = sessionStorage.getItem('seenOffers');
    const seenOffers: string[] = seenOffersJson ? JSON.parse(seenOffersJson) : [];
    
    // Add current offer ID if not already in the list
    if (!seenOffers.includes(offerId)) {
      seenOffers.push(offerId);
      sessionStorage.setItem('seenOffers', JSON.stringify(seenOffers));
      console.log('OfferModal: Marked offer as seen:', offerId);
    }
  };

  const handleClose = () => {
    // Mark current offer as seen before closing
    if (offers[currentOfferIndex]) {
      markOfferAsSeen(offers[currentOfferIndex]._id);
    }
    setIsOpen(false);
  };

  const handleShopNow = () => {
    const currentOffer = offers[currentOfferIndex];
    // Mark offer as seen before navigating
    markOfferAsSeen(currentOffer._id);
    setIsOpen(false);
    navigate(`/shop?category=${encodeURIComponent(currentOffer.category)}`);
  };

  const calculateTimeLeft = (validUntil: string) => {
    const difference = new Date(validUntil).getTime() - new Date().getTime();
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} left`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} left`;
    return 'Ending soon';
  };

  if (offers.length === 0) return null;

  const currentOffer = offers[currentOfferIndex];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-40 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="fixed inset-0 z-40 flex items-center justify-center p-4 pt-20"
          >
            <div className="relative bg-card border-2 border-primary rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
              >
                <X size={20} />
              </button>

              {/* Offer Content */}
              <div className="relative">
                {/* Offer Image */}
                <div className="relative h-64 md:h-80 overflow-hidden">
                  <img
                    src={currentOffer.image?.url}
                    alt={currentOffer.name}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Discount Badge */}
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full font-display text-2xl shadow-lg">
                    {currentOffer.discountPercentage}% OFF
                  </div>

                  {/* Category Badge */}
                  <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                    <Tag size={14} />
                    {currentOffer.category}
                  </div>
                </div>


                {/* Offer Details */}
                <div className="p-4 md:p-6 space-y-3 md:space-y-4">
                  <div>
                    <h2 className="font-display text-xl md:text-3xl mb-2">{currentOffer.name}</h2>
                    <p className="text-muted-foreground text-sm md:text-base">{currentOffer.description}</p>
                  </div>

                  {/* Price Info */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-3 md:p-4 bg-secondary rounded-lg">
                    <div>
                      <p className="text-xs md:text-sm text-muted-foreground line-through">
                        ₹{currentOffer.originalPrice}
                      </p>
                      <p className="font-display text-2xl md:text-3xl text-primary">
                        ₹{currentOffer.discountedPrice}
                      </p>
                    </div>
                    <div className="sm:ml-auto text-left sm:text-right">
                      <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
                        <Clock size={14} className="md:w-4 md:h-4" />
                        {calculateTimeLeft(currentOffer.validUntil)}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Valid until {new Date(currentOffer.validUntil).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Terms */}
                  {currentOffer.termsAndConditions && (
                    <p className="text-xs text-muted-foreground">
                      * {currentOffer.termsAndConditions}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <Button
                      variant="hero"
                      className="flex-1 h-10 md:h-11 text-sm md:text-base font-medium"
                      onClick={handleShopNow}
                    >
                      Shop Now
                    </Button>
                    <Button
                      variant="outline"
                      className="h-10 md:h-11 text-sm md:text-base font-medium sm:min-w-[140px]"
                      onClick={handleClose}
                    >
                      Maybe Later
                    </Button>
                  </div>

                  {/* Navigation Dots */}
                  {offers.length > 1 && (
                    <div className="flex items-center justify-center gap-2 pt-2">
                      {offers.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentOfferIndex(index)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            index === currentOfferIndex
                              ? 'bg-primary w-6'
                              : 'bg-muted-foreground/30'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default OfferModal;
