import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { adminApi } from '@/lib/api';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const AdminOfferForm = () => {
  const { offerId } = useParams();
  const navigate = useNavigate();
  const isEdit = !!offerId;
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Shiva',
    originalPrice: '',
    discountPercentage: '',
    validFrom: '',
    validUntil: '',
    termsAndConditions: '',
    isActive: true,
  });

  useEffect(() => {
    if (isEdit) {
      loadOffer();
    }
  }, [offerId]);

  const loadOffer = async () => {
    try {
      const response: any = await adminApi.offers.getAll({ page: 1, limit: 100 });
      const offer = response.offers.find((o: any) => o._id === offerId);
      
      if (offer) {
        setFormData({
          name: offer.name,
          description: offer.description,
          category: offer.category,
          originalPrice: offer.originalPrice.toString(),
          discountPercentage: offer.discountPercentage.toString(),
          validFrom: new Date(offer.validFrom).toISOString().slice(0, 16),
          validUntil: new Date(offer.validUntil).toISOString().slice(0, 16),
          termsAndConditions: offer.termsAndConditions || '',
          isActive: offer.isActive,
        });
        setImagePreview(offer.image?.url);
      }
    } catch (error: any) {
      toast.error('Failed to load offer');
      navigate('/admin/offers');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value.toString());
      });

      if (imageFile) {
        formDataToSend.append('image', imageFile);
      } else if (!isEdit) {
        toast.error('Please upload an image');
        setLoading(false);
        return;
      }

      if (isEdit) {
        await adminApi.offers.update(offerId!, formDataToSend);
        toast.success('Offer updated successfully');
      } else {
        await adminApi.offers.create(formDataToSend);
        toast.success('Offer created successfully');
      }

      navigate('/admin/offers');
    } catch (error: any) {
      toast.error(error.message || `Failed to ${isEdit ? 'update' : 'create'} offer`);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['Shiva', 'Shrooms', 'LSD', 'Chakras', 'Dark', 'Rick n Morty'];

  const calculateDiscountedPrice = () => {
    const price = parseFloat(formData.originalPrice);
    const discount = parseFloat(formData.discountPercentage);
    if (price && discount) {
      return Math.round(price - (price * discount) / 100);
    }
    return 0;
  };

  return (
    <div>
      <div className="mb-6">
        <Link
          to="/admin/offers"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft size={18} />
          <span className="text-sm uppercase tracking-wider">Back to Offers</span>
        </Link>
        <h1 className="font-display text-3xl md:text-4xl">
          {isEdit ? 'Edit Offer' : 'Create New Offer'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="space-y-6">
          {/* Image Upload */}
          <div className="bg-card border border-border p-6">
            <Label>Offer Image/Poster</Label>
            <div className="mt-2">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setImagePreview(null);
                      setImageFile(null);
                    }}
                  >
                    <X size={16} />
                  </Button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-border rounded cursor-pointer hover:border-primary transition-colors">
                  <Upload size={48} className="text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground">Click to upload image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Basic Info */}
          <div className="bg-card border border-border p-6 space-y-4">
            <div>
              <Label htmlFor="name">Offer Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="e.g., Summer Sale 2024"
              />
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                placeholder="Describe the offer..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-card border border-border p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="originalPrice">Original Price (₹) *</Label>
                <Input
                  id="originalPrice"
                  type="number"
                  value={formData.originalPrice}
                  onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                  required
                  min="0"
                  placeholder="799"
                />
              </div>

              <div>
                <Label htmlFor="discountPercentage">Discount (%) *</Label>
                <Input
                  id="discountPercentage"
                  type="number"
                  value={formData.discountPercentage}
                  onChange={(e) =>
                    setFormData({ ...formData, discountPercentage: e.target.value })
                  }
                  required
                  min="0"
                  max="100"
                  placeholder="30"
                />
              </div>
            </div>

            {formData.originalPrice && formData.discountPercentage && (
              <div className="p-4 bg-secondary rounded">
                <p className="text-sm text-muted-foreground">Discounted Price</p>
                <p className="font-display text-2xl">₹{calculateDiscountedPrice()}</p>
              </div>
            )}
          </div>

          {/* Validity Period */}
          <div className="bg-card border border-border p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="validFrom">Valid From *</Label>
                <Input
                  id="validFrom"
                  type="datetime-local"
                  value={formData.validFrom}
                  onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="validUntil">Valid Until *</Label>
                <Input
                  id="validUntil"
                  type="datetime-local"
                  value={formData.validUntil}
                  onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          {/* Terms */}
          <div className="bg-card border border-border p-6 space-y-4">
            <div>
              <Label htmlFor="terms">Terms and Conditions</Label>
              <Textarea
                id="terms"
                value={formData.termsAndConditions}
                onChange={(e) =>
                  setFormData({ ...formData, termsAndConditions: e.target.value })
                }
                placeholder="Optional terms and conditions..."
                rows={3}
              />
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isActive: checked as boolean })
                }
              />
              <Label htmlFor="isActive" className="cursor-pointer">
                Active (visible to users)
              </Label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <Button type="submit" variant="hero" disabled={loading} className="flex-1">
              {loading ? 'Saving...' : isEdit ? 'Update Offer' : 'Create Offer'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/offers')}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminOfferForm;
