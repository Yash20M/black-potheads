import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { orderApi, qrApi } from '@/lib/api';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart, syncWithBackend } = useCartStore();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [showQR, setShowQR] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const [formData, setFormData] = useState({
    line1: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    paymentMethod: 'COD',
  });

  useEffect(() => {
    // Don't redirect if order was just placed
    if (orderPlaced) return;

    if (!user) {
      toast.error('Please login to checkout');
      navigate('/login');
      return;
    }

    if (items.length === 0) {
      toast.error('Your cart is empty');
      navigate('/shop');
      return;
    }

    loadQR();
  }, [user, items, navigate, orderPlaced]);

  const loadQR = async () => {
    try {
      const data: any = await qrApi.get();
      if (data.qrImage?.url) {
        setQrImage(data.qrImage.url);
      }
    } catch (error) {
      // QR might not be available
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // First, sync cart with backend to ensure backend has all items
      await syncWithBackend();
      
      // Small delay to ensure sync completes
      await new Promise(resolve => setTimeout(resolve, 500));

      const orderData = {
        totalAmount: getTotalPrice(),
        address: {
          line1: formData.line1,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          country: formData.country,
        },
        paymentMethod: formData.paymentMethod,
      };

      const response: any = await orderApi.create(orderData);
      
      // Set flag to prevent "cart is empty" message
      setOrderPlaced(true);
      
      // Clear cart and show success message
      await clearCart();
      toast.success('Order placed successfully!');
      
      // Navigate to orders page
      navigate(`/orders`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to place order');
      console.error('Order creation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = getTotalPrice();

  return (
    <div className="min-h-screen pt-20 bg-background">
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <Link to="/shop" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={18} />
            <span className="text-sm uppercase tracking-wider">Back to Shop</span>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-4xl md:text-5xl mb-12"
        >
          CHECKOUT
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Checkout Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-card border border-border p-6">
                <h2 className="font-display text-2xl mb-6 flex items-center gap-2">
                  <Truck size={24} />
                  Shipping Address
                </h2>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="line1">Address Line</Label>
                    <Input
                      id="line1"
                      name="line1"
                      value={formData.line1}
                      onChange={handleChange}
                      required
                      placeholder="123 Main Street"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        placeholder="Mumbai"
                      />
                    </div>

                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        required
                        placeholder="Maharashtra"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="pincode">Pincode</Label>
                      <Input
                        id="pincode"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        required
                        placeholder="400001"
                      />
                    </div>

                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        required
                        placeholder="India"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border p-6">
                <h2 className="font-display text-2xl mb-6 flex items-center gap-2">
                  <CreditCard size={24} />
                  Payment Method
                </h2>

                <div className="space-y-4">
                  <label className="flex items-center gap-3 p-4 border border-border cursor-pointer hover:border-primary transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={formData.paymentMethod === 'COD'}
                      onChange={handleChange}
                      className="w-4 h-4"
                    />
                    <div>
                      <p className="font-medium">Cash on Delivery</p>
                      <p className="text-sm text-muted-foreground">Pay when you receive</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 border border-border cursor-pointer hover:border-primary transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="UPI"
                      checked={formData.paymentMethod === 'UPI'}
                      onChange={handleChange}
                      className="w-4 h-4"
                    />
                    <div>
                      <p className="font-medium">UPI Payment</p>
                      <p className="text-sm text-muted-foreground">Pay via UPI QR code</p>
                    </div>
                  </label>

                  {formData.paymentMethod === 'UPI' && qrImage && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="p-4 border border-border"
                    >
                      <p className="text-sm text-muted-foreground mb-4">
                        Scan this QR code to complete payment
                      </p>
                      <img
                        src={qrImage}
                        alt="Payment QR Code"
                        className="w-64 h-64 mx-auto"
                      />
                    </motion.div>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                variant="hero"
                size="lg"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Placing Order...' : `Place Order - $${totalPrice}`}
              </Button>
            </form>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-card border border-border p-6 sticky top-24">
              <h2 className="font-display text-2xl mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={`${item.id}-${item.selectedSize}`} className="flex gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Size: {item.selectedSize} | Qty: {item.quantity}
                      </p>
                      <p className="font-display">${item.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${totalPrice}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between font-display text-xl pt-2 border-t border-border">
                  <span>Total</span>
                  <span>${totalPrice}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
