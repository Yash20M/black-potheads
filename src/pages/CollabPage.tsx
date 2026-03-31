import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Send, Instagram, User, FileText, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const CollabPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    instagram: '',
    portfolio: null as File | null,
    vision: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }
      setFormData({ ...formData, portfolio: file });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.instagram || !formData.vision) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Application submitted successfully! We\'ll be in touch soon.');
      setFormData({
        name: '',
        instagram: '',
        portfolio: null,
        vision: '',
      });
      
      // Reset file input
      const fileInput = document.getElementById('portfolio') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
    } catch (error) {
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-background">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-b from-accent/10 to-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="mb-6"
            >
              <Sparkles className="w-16 h-16 mx-auto text-primary" />
            </motion.div>
            
            <h1 className="font-display text-5xl md:text-7xl mb-6">
              <span className="text-gradient">JOIN THE</span>
              <br />
              <span className="text-accent-gradient">MOVEMENT</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-4">
              We're looking for underground artists and creators who dare to be different.
            </p>
            <p className="text-lg text-foreground">
              Your art deserves to be seen. Let's make it wearable.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-card border border-border rounded-lg p-8 md:p-12">
              <h2 className="font-display text-3xl mb-2">Artist Application</h2>
              <p className="text-muted-foreground mb-8">
                Tell us about yourself and your creative vision
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User size={16} />
                    Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="h-12"
                  />
                </div>

                {/* Instagram */}
                <div className="space-y-2">
                  <Label htmlFor="instagram" className="flex items-center gap-2">
                    <Instagram size={16} />
                    Instagram Handle <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="instagram"
                    type="text"
                    placeholder="@yourhandle"
                    value={formData.instagram}
                    onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                    required
                    className="h-12"
                  />
                </div>

                {/* Portfolio Upload */}
                <div className="space-y-2">
                  <Label htmlFor="portfolio" className="flex items-center gap-2">
                    <Upload size={16} />
                    Portfolio / Sample Work
                  </Label>
                  <div className="relative">
                    <Input
                      id="portfolio"
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileChange}
                      className="h-12 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                    />
                    {formData.portfolio && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Selected: {formData.portfolio.name}
                      </p>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Upload images or PDF (Max 10MB)
                  </p>
                </div>

                {/* Vision */}
                <div className="space-y-2">
                  <Label htmlFor="vision" className="flex items-center gap-2">
                    <FileText size={16} />
                    Describe Your Vision <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="vision"
                    placeholder="Tell us about your art style, what inspires you, and what kind of designs you'd like to create..."
                    value={formData.vision}
                    onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
                    required
                    rows={6}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    Minimum 50 characters
                  </p>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="hero"
                  size="lg"
                  className="w-full text-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    'Submitting...'
                  ) : (
                    <>
                      Submit Application
                      <Send className="ml-2" size={18} />
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Info Cards */}
            <div className="grid md:grid-cols-2 gap-6 mt-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-card border border-border rounded-lg p-6"
              >
                <h3 className="font-display text-xl mb-3">What We Offer</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Fair revenue sharing</li>
                  <li>• Full creative control</li>
                  <li>• Marketing support</li>
                  <li>• Quality production</li>
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-card border border-border rounded-lg p-6"
              >
                <h3 className="font-display text-xl mb-3">What We Look For</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Unique artistic vision</li>
                  <li>• Consistent style</li>
                  <li>• Passion for streetwear</li>
                  <li>• Collaborative mindset</li>
                </ul>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default CollabPage;
