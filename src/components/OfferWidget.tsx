import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export const OfferWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    // TODO: connect to backend
    setSubmitted(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-4 z-[999]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-2 w-72 max-w-[calc(100vw-2rem)] bg-white text-black shadow-2xl rounded-sm border border-gray-200"
          >
            {/* Header */}
            <div className="flex items-start justify-between p-4 pb-2">
              <div>
                <h3 className="font-bold text-base leading-tight">10% off entire order</h3>
                <p className="text-gray-500 text-xs mt-1">Join our Community and avail the extra offer.</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-black ml-2 mt-0.5 flex-shrink-0"
              >
                <X size={16} />
              </button>
            </div>

            {/* Form */}
            {!submitted ? (
              <form onSubmit={handleJoin} className="px-4 pb-4 space-y-3">
                <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-black placeholder:text-gray-400"
                />
                {/* Phone field — flag + input stay inside the box */}
                <div className="flex items-stretch border border-gray-300 rounded-sm overflow-hidden">
                  <div className="flex items-center gap-1 px-2 bg-gray-50 border-r border-gray-300 flex-shrink-0">
                    <span className="text-base leading-none">🇮🇳</span>
                    <span className="text-gray-500 text-xs">+91</span>
                  </div>
                  <input
                    type="tel"
                    placeholder="Phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="flex-1 min-w-0 px-3 py-2 text-sm focus:outline-none placeholder:text-gray-400 bg-white"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-black text-white py-2.5 text-sm font-semibold hover:bg-gray-800 transition-colors rounded-sm"
                >
                  Join
                </button>
                <p className="text-gray-400 text-[10px] leading-relaxed">
                  By signing up, you agree to receive promotional text messages. View our{' '}
                  <span className="underline cursor-pointer">privacy policy</span> and{' '}
                  <span className="underline cursor-pointer">terms of service</span> for more info.
                </p>
              </form>
            ) : (
              <div className="px-4 pb-4 pt-2 text-center">
                <p className="text-green-600 font-semibold text-sm">🎉 You're in!</p>
                <p className="text-gray-500 text-xs mt-1">Your 10% off coupon will be shared soon.</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger Button */}
      <motion.button
        onClick={() => setIsOpen((prev) => !prev)}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="flex items-center gap-2 bg-white text-black border border-gray-300 shadow-lg px-4 py-2.5 text-sm font-semibold rounded-sm hover:bg-gray-50 transition-colors"
      >
        <span>10% off</span>
        <button
          onClick={(e) => { e.stopPropagation(); handleClose(); }}
          className="text-gray-400 hover:text-black transition-colors"
        >
          <X size={13} />
        </button>
      </motion.button>
    </div>
  );
};
