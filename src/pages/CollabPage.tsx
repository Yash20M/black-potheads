import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { collabApi } from '@/lib/api';

const CollabPage = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    instagram: '',
    vision: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      toast.error('Please enter your name');
      return;
    }
    
    // Validate mobile number (10 digits)
    const mobileRegex = /^[0-9]{10}$/;
    if (!formData.mobile.trim()) {
      toast.error('Please enter your mobile number');
      return;
    }
    if (!mobileRegex.test(formData.mobile.trim())) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }
    
    // Validate email if provided
    if (formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        toast.error('Please enter a valid email address');
        return;
      }
    }
    
    if (!formData.instagram.trim()) {
      toast.error('Please enter your Instagram account');
      return;
    }
    
    if (!formData.vision.trim()) {
      toast.error('Please share your vision');
      return;
    }
    
    const wordCount = formData.vision.trim().split(/\s+/).filter(word => word.length > 0).length;
    if (wordCount > 100) {
      toast.error('Vision must be maximum 100 words');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await collabApi.submit({
        name: formData.name.trim(),
        mobile: formData.mobile.trim(),
        email: formData.email.trim() || undefined,
        instagram: formData.instagram.trim(),
        vision: formData.vision.trim()
      });
      
      // Check if response has success property
      if (response && (response as any).success) {
        toast.success((response as any).message || 'Thank you! We will get back to you soon.');
        setShowForm(false);
        setFormData({
          name: '',
          mobile: '',
          email: '',
          instagram: '',
          vision: ''
        });
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    } catch (error: any) {
      console.error('Collab submission error:', error);
      
      // Handle specific error messages
      if (error.message) {
        toast.error(error.message);
      } else if (error.status === 400) {
        toast.error('Please check your information and try again');
      } else if (error.status === 500) {
        toast.error('Server error. Please try again later');
      } else {
        toast.error('Failed to submit. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-black">
      {/* Collaboration Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto"
          >
            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-12"
            >
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl mb-4 text-white">
                COLLABS X BLACK POTHEADS
              </h1>
              <p className="text-base md:text-lg text-white/70">
                Artist Collaboration Platform
              </p>
            </motion.div>

            {/* Shiva Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="relative max-w-3xl mx-auto mb-12"
            >
              <div className="relative aspect-square overflow-hidden rounded-2xl border border-white/10">
                <img
                  src="/shiva.jpeg"
                  alt="Rakt Pipasu Records"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Overlay Text */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <h2 className="font-display text-xl md:text-2xl lg:text-3xl text-white mb-3">
                    RAKT PIPASU RECORDS
                  </h2>
                  <p className="text-white/90 text-sm md:text-base leading-relaxed mb-4">
                    Divine designs inspired by cosmic consciousness and spiritual awakening.
                  </p>
                  
                  {/* Shop Button */}
                  <Button
                    onClick={() => navigate('/shop?collection=Shiva')}
                    className="bg-white text-black hover:bg-gray-200 font-bold uppercase tracking-wider px-6 py-4 text-sm md:text-base"
                  >
                    Shop Collection
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Info Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-center space-y-6"
            >
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 md:p-8">
                <h3 className="font-display text-xl md:text-2xl text-white mb-3">
                  JOIN THE MOVEMENT
                </h3>
                <p className="text-white/80 text-sm md:text-base leading-relaxed mb-4">
                  We're building a platform where underground artists and creators can collaborate 
                  with us to turn their visions into wearable art. If you've got the vision, 
                  we've got the platform.
                </p>
                <div className="grid md:grid-cols-2 gap-4 mt-6 mb-6">
                  <div className="text-left">
                    <h4 className="font-display text-base md:text-lg text-white mb-2">What We Offer</h4>
                    <ul className="space-y-1 text-sm text-white/70">
                      <li>• Fair revenue sharing</li>
                      <li>• Full creative control</li>
                      <li>• Marketing support</li>
                      <li>• Quality production</li>
                    </ul>
                  </div>
                  <div className="text-left">
                    <h4 className="font-display text-base md:text-lg text-white mb-2">What We Look For</h4>
                    <ul className="space-y-1 text-sm text-white/70">
                      <li>• Unique artistic vision</li>
                      <li>• Consistent style</li>
                      <li>• Passion for streetwear</li>
                      <li>• Collaborative mindset</li>
                    </ul>
                  </div>
                </div>

                {/* Join Button */}
                <Button
                  onClick={() => setShowForm(true)}
                  className="bg-white text-black hover:bg-gray-200 font-bold uppercase tracking-wider px-8 py-4 text-sm md:text-base"
                >
                  Join the Movement
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Form Popup */}
      <AnimatePresence>
        {showForm && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
              onClick={() => setShowForm(false)}
            />

            {/* Form Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4"
            >
              <div className="bg-black border-2 border-white w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-black border-b-2 border-white p-4 sm:p-6 flex items-center justify-between z-10">
                  <h2 className="font-display text-lg sm:text-xl md:text-2xl text-white">
                    JOIN THE MOVEMENT
                  </h2>
                  <button
                    onClick={() => setShowForm(false)}
                    className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center hover:bg-white/10 transition-colors flex-shrink-0"
                  >
                    <X size={20} className="text-white sm:w-6 sm:h-6" />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
                  {/* Name */}
                  <div>
                    <label className="block text-white font-bold uppercase tracking-wider text-xs sm:text-sm mb-2">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full bg-black border-2 border-white text-white px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base focus:outline-none focus:border-gray-400 transition-colors"
                      placeholder="Enter your name"
                      required
                    />
                  </div>

                  {/* Mobile */}
                  <div>
                    <label className="block text-white font-bold uppercase tracking-wider text-xs sm:text-sm mb-2">
                      Mobile No <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      className="w-full bg-black border-2 border-white text-white px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base focus:outline-none focus:border-gray-400 transition-colors"
                      placeholder="10-digit mobile number"
                      pattern="[0-9]{10}"
                      maxLength={10}
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-white font-bold uppercase tracking-wider text-xs sm:text-sm mb-2">
                      Email <span className="text-gray-400">(Optional)</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-black border-2 border-white text-white px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base focus:outline-none focus:border-gray-400 transition-colors"
                      placeholder="Enter your email"
                    />
                  </div>

                  {/* Instagram */}
                  <div>
                    <label className="block text-white font-bold uppercase tracking-wider text-xs sm:text-sm mb-2">
                      Instagram Account <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="instagram"
                      value={formData.instagram}
                      onChange={handleInputChange}
                      className="w-full bg-black border-2 border-white text-white px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base focus:outline-none focus:border-gray-400 transition-colors"
                      placeholder="@yourusername"
                      required
                    />
                  </div>

                  {/* Vision */}
                  <div>
                    <label className="block text-white font-bold uppercase tracking-wider text-xs sm:text-sm mb-2">
                      Your Vision <span className="text-red-500">*</span>
                      <span className="text-gray-400 text-xs ml-2">(Max 100 words)</span>
                    </label>
                    <textarea
                      name="vision"
                      value={formData.vision}
                      onChange={handleInputChange}
                      rows={5}
                      className="w-full bg-black border-2 border-white text-white px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base focus:outline-none focus:border-gray-400 transition-colors resize-none"
                      placeholder="Tell us about your artistic vision and what you'd like to create..."
                      required
                    />
                    <p className="text-gray-400 text-xs mt-1">
                      {formData.vision.trim().split(/\s+/).filter(word => word.length > 0).length} / 100 words
                    </p>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-white text-black hover:bg-gray-200 font-bold uppercase tracking-wider py-4 sm:py-6 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                  </Button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CollabPage;
