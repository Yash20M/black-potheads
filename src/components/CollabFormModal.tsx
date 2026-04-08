import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { collabApi } from '@/lib/api';

interface CollabFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CollabFormModal = ({ isOpen, onClose }: CollabFormModalProps) => {
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
      console.log('Submitting collab form...', {
        name: formData.name.trim(),
        mobile: formData.mobile.trim(),
        email: formData.email.trim() || undefined,
        instagram: formData.instagram.trim(),
        vision: formData.vision.trim()
      });

      const response = await collabApi.submit({
        name: formData.name.trim(),
        mobile: formData.mobile.trim(),
        email: formData.email.trim() || undefined,
        instagram: formData.instagram.trim(),
        vision: formData.vision.trim()
      });
      
      console.log('Collab submission response:', response);
      
      // Check if response has success property
      if (response && (response as any).success) {
        toast.success((response as any).message || 'Thank you! We will get back to you soon.');
        onClose();
        setFormData({
          name: '',
          mobile: '',
          email: '',
          instagram: '',
          vision: ''
        });
      } else {
        console.error('Unexpected response format:', response);
        toast.error('Something went wrong. Please try again.');
      }
    } catch (error: any) {
      console.error('Collab submission error:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.status,
        stack: error.stack
      });
      
      // Handle specific error messages
      if (error.message) {
        toast.error(error.message);
      } else if (error.status === 400) {
        toast.error('Please check your information and try again');
      } else if (error.status === 401 || error.status === 403) {
        toast.error('This form is public and does not require login. Please try again.');
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
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            onClick={onClose}
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
                  onClick={onClose}
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
  );
};
