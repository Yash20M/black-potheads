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

  // Add manual trigger for testing
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'o') {
        console.log('OfferModal: Manual trigger (Ctrl+O)');
        sessionStorage.removeItem('offerModalShown');
        loadOffers();
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  useEffect(() => {
    // Check if modal was already shown in this session
    const modalShown = sessionStorage.getItem('offerModalShown');
    
    console.log('OfferModal: Checking if modal should show...', { modalShown });
    
    if (!modalShown) {
      // Show modal after 3 seconds
      console.log('OfferModal: Will load offers in 3 seconds...');
      const timer = setTimeout(() => {
        loadOffers();
      }, 3000);

      return () => clearTimeout(timer);
    } else {
      console.log('OfferModal: Already shown in this session');
    }
  }, []);

  const loadOffers = async () => {
    console.log('OfferModal: Loading offers...');
    try {
      const data: any = await offersApi.getActive();
      console.log('OfferModal: Offers response:', data);
      
      if (data.success && data.offers && data.offers.length > 0) {
        console.log('OfferModal: Found', data.offers.length, 'active offers');
        setOffers(data.offers);
        setIsOpen(true);
        sessionStorage.setItem('offerModalShown', 'true');
      } else {
        console.log('OfferModal: No active offers found');
      }
    } catch (error) {
      console.error('OfferModal: Failed to load offers:', error);
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

  const handleNext = () => {
    setCurrentOfferIndex((prev) => (prev + 1) % offers.length);
  };

  const handlePrev = () => {
    setCurrentOfferIndex((prev) => (prev - 1 + offers.length) % offers.length);
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
            className="fixed inset-0 bg-black/70 z-50 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
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
                <div className="md:p-6 p-2 space-y-4">
                  <div>
                    <h2 className="font-display text-3xl mb-2">{currentOffer.name}</h2>
                    <p className="text-muted-foreground">{currentOffer.description}</p>
                  </div>

                  {/* Price Info */}
                  <div className="flex items-center gap-4 p-4 bg-secondary rounded-lg">
                    <div>
                      <p className="text-sm text-muted-foreground line-through">
                        ₹{currentOffer.originalPrice}
                      </p>
                      <p className="font-display text-3xl text-primary">
                        ₹{currentOffer.discountedPrice}
                      </p>
                    </div>
                    <div className="ml-auto text-right">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock size={16} />
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
                  <div className="flex gap-3">
                    <Button
                      variant="hero"
                      size="lg"
                      className="flex-1 md:text-base text-sm md:h-11 h-9"
                      onClick={handleShopNow}
                    >
                      Shop Now
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="md:text-base text-sm md:h-11 h-9"
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
