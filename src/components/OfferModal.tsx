import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Tag, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { offersApi } from '@/lib/api';
import { useNavigate } from 'react-router-dom';

const OfferModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [offers, setOffers] = useState<any[]>([]);
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0);
  const navigate = useNavigate();

  // Load offers on every page load (no session storage check)
  useEffect(() => {
    console.log('OfferModal: Component mounted, will load offers in 3 seconds...');
    const timer = setTimeout(() => {
      loadOffers();
    }, 3000);

    return () => clearTimeout(timer);
  }, []); // Empty dependency array = runs once on mount

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
    
    try {
      const data: any = await offersApi.getActive();
      console.log('OfferModal: API response:', data);
      if (data && data.success && data.offers && data.offers.length > 0) {
        console.log('OfferModal: Found', data.offers.length, 'active offers');
        setOffers(data.offers);
        setIsOpen(true);
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
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleShopNow = () => {
    const currentOffer = offers[currentOfferIndex];
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
