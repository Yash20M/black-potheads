import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Truck, User, Mail, Phone, CheckCircle, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCartStore } from '@/store/cartStore';
import { orderApi } from '@/lib/api';
import { toast } from 'sonner';

// Declare Razorpay on window object
declare global {
  interface Window {
    Razorpay: any;
  }
}

const GuestCheckoutPage = () => {
  const navigate = useNavigate();
  const { items, getTotalPrice } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'Online'>('COD');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    addressLine1: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      navigate('/shop');
    }
  }, [items, navigate]);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone: string) => {
    return /^[0-9]{10}$/.test(phone);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Phone must be 10 digits';
    }
    if (!formData.addressLine1.trim()) newErrors.addressLine1 = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  // Handle COD Order
  const handleCODOrder = async () => {
    const orderData = {
      guestInfo: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      },
      items: items.map((item) => ({
        product: item.id,
        category: item.category || 'T-Shirt',
        size: item.selectedSize,
        quantity: item.quantity,
      })),
      address: {
        line1: formData.addressLine1,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        country: formData.country,
      },
      totalAmount: getTotalPrice(),
      paymentMethod: 'COD',
    };

    try {
      const result: any = await orderApi.createGuestOrder(orderData);

      if (result.success) {
        // Save order info to localStorage
        localStorage.setItem('guestOrderId', result.order._id);
        localStorage.setItem('guestOrderEmail', formData.email);

        toast.success('Order placed successfully!');

        // Redirect to confirmation page
        navigate(`/guest-order-confirmation/${result.order._id}`);
      } else {
        toast.error(result.message || 'Failed to create order');
      }
    } catch (error: any) {
      console.error('Order creation failed:', error);
      toast.error(error.message || 'Failed to create order. Please try again.');
    }
  };

  // Handle Online Payment
  const handleOnlinePayment = async () => {
    const orderData = {
      guestInfo: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      },
      items: items.map((item) => ({
        product: item.id,
        category: item.category || 'T-Shirt',
        size: item.selectedSize,
        quantity: item.quantity,
      })),
      address: {
        line1: formData.addressLine1,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        country: formData.country,
      },
      totalAmount: getTotalPrice(),
    };

    try {
      // Step 1: Create Razorpay Order
      const result: any = await orderApi.createGuestRazorpayOrder(orderData);

      if (!result.success) {
        toast.error(result.message || 'Failed to create payment order');
        return;
      }

      // Step 2: Open Razorpay Payment Gateway
      const options = {
        key: result.key,
        amount: result.razorpayOrder.amount,
        currency: result.razorpayOrder.currency,
        name: 'Black Potheads',
        description: 'Guest Order Payment',
        order_id: result.razorpayOrder.id,
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: '#000000',
        },
        handler: async function (razorpayResponse: any) {
          // Step 3: Verify Payment
          await verifyPayment(razorpayResponse, result.orderId);
        },
        modal: {
          ondismiss: function () {
            toast.info('Payment cancelled');
            setLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      console.error('Online payment failed:', error);
      toast.error(error.message || 'Failed to initiate payment. Please try again.');
    }
  };

  // Verify Payment
  const verifyPayment = async (razorpayResponse: any, orderId: string) => {
    try {
      const result: any = await orderApi.verifyGuestPayment({
        razorpayOrderId: razorpayResponse.razorpay_order_id,
        razorpayPaymentId: razorpayResponse.razorpay_payment_id,
        razorpaySignature: razorpayResponse.razorpay_signature,
        orderId: orderId,
        guestInfo: {
          email: formData.email,
        },
      });

      if (result.success) {
        // Save order info to localStorage
        localStorage.setItem('guestOrderId', result.order._id);
        localStorage.setItem('guestOrderEmail', formData.email);

        toast.success('Payment successful! Order confirmed.');

        // Redirect to confirmation page
        navigate(`/guest-order-confirmation/${result.order._id}`);
      } else {
        toast.error('Payment verification failed: ' + result.message);
      }
    } catch (error: any) {
      console.error('Payment verification failed:', error);
      toast.error(error.message || 'Payment verification failed. Please contact support.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    if (paymentMethod === 'COD') {
      await handleCODOrder();
    } else {
      await handleOnlinePayment();
    }

    setLoading(false);
  };

  const totalPrice = getTotalPrice();

  return (
    <div className="min-h-screen pt-20 bg-background">
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 sm:gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={16} className="sm:w-[18px] sm:h-[18px]" />
            <span className="text-xs sm:text-sm uppercase tracking-wider">Back to Shop</span>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-3xl sm:text-4xl md:text-5xl mb-4"
        >
          GUEST CHECKOUT
        </motion.h1>
        <p className="text-muted-foreground mb-8">
          No account needed. Order with Cash on Delivery.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          {/* Checkout Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Guest Information */}
              <div className="bg-card border border-border p-4 sm:p-6">
                <h2 className="font-display text-xl sm:text-2xl mb-4 sm:mb-6 flex items-center gap-2">
                  <User size={20} className="sm:w-6 sm:h-6" />
                  <span className="text-base sm:text-2xl">Your Information</span>
                </h2>

                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-sm">
                      Name *
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="text-sm sm:text-base"
                    />
                    {errors.name && <span className="text-red-500 text-xs mt-1">{errors.name}</span>}
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-sm">
                      Email *
                    </Label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className="text-sm sm:text-base pl-10"
                      />
                    </div>
                    {errors.email && <span className="text-red-500 text-xs mt-1">{errors.email}</span>}
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-sm">
                      Phone (10 digits) *
                    </Label>
                    <div className="relative">
                      <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="9876543210"
                        maxLength={10}
                        className="text-sm sm:text-base pl-10"
                      />
                    </div>
                    {errors.phone && <span className="text-red-500 text-xs mt-1">{errors.phone}</span>}
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="bg-card border border-border p-4 sm:p-6">
                <h2 className="font-display text-xl sm:text-2xl mb-4 sm:mb-6 flex items-center gap-2">
                  <Truck size={20} className="sm:w-6 sm:h-6" />
                  <span className="text-base sm:text-2xl">Delivery Address</span>
                </h2>

                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <Label htmlFor="addressLine1" className="text-sm">
                      Address *
                    </Label>
                    <Input
                      id="addressLine1"
                      name="addressLine1"
                      value={formData.addressLine1}
                      onChange={handleChange}
                      placeholder="123 Main Street, Apartment 4B"
                      className="text-sm sm:text-base"
                    />
                    {errors.addressLine1 && (
                      <span className="text-red-500 text-xs mt-1">{errors.addressLine1}</span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <Label htmlFor="city" className="text-sm">
                        City *
                      </Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="Mumbai"
                        className="text-sm sm:text-base"
                      />
                      {errors.city && <span className="text-red-500 text-xs mt-1">{errors.city}</span>}
                    </div>

                    <div>
                      <Label htmlFor="state" className="text-sm">
                        State *
                      </Label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        placeholder="Maharashtra"
                        className="text-sm sm:text-base"
                      />
                      {errors.state && <span className="text-red-500 text-xs mt-1">{errors.state}</span>}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="pincode" className="text-sm">
                        Pincode *
                      </Label>
                      <Input
                        id="pincode"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        placeholder="400001"
                        maxLength={6}
                        className="text-sm sm:text-base"
                      />
                      {errors.pincode && <span className="text-red-500 text-xs mt-1">{errors.pincode}</span>}
                    </div>

                    <div>
                      <Label htmlFor="country" className="text-sm">
                        Country
                      </Label>
                      <Input
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        placeholder="India"
                        className="text-sm sm:text-base"
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="bg-card border border-border p-4 sm:p-6">
                <h2 className="font-display text-xl sm:text-2xl mb-4 sm:mb-6 flex items-center gap-2">
                  <CreditCard size={20} className="sm:w-6 sm:h-6" />
                  <span className="text-base sm:text-2xl">Payment Method</span>
                </h2>

                <div className="space-y-3 sm:space-y-4">
                  <label className="flex items-center gap-3 p-3 sm:p-4 border-2 border-border rounded-lg cursor-pointer hover:border-primary transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={paymentMethod === 'COD'}
                      onChange={(e) => setPaymentMethod(e.target.value as 'COD' | 'Online')}
                      className="w-4 h-4"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-sm sm:text-base">💵 Cash on Delivery (COD)</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">Pay when you receive your order</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 sm:p-4 border-2 border-border rounded-lg cursor-pointer hover:border-primary transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Online"
                      checked={paymentMethod === 'Online'}
                      onChange={(e) => setPaymentMethod(e.target.value as 'COD' | 'Online')}
                      className="w-4 h-4"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-sm sm:text-base">💳 Pay Online (Razorpay)</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Pay securely via UPI, Cards, Net Banking
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
                {loading
                  ? 'Processing...'
                  : paymentMethod === 'COD'
                  ? `Place Order - ₹${totalPrice}`
                  : `Proceed to Payment - ₹${totalPrice}`}
              </Button>

              {/* Registration Tip */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4 text-center">
                <p className="text-sm text-blue-900 dark:text-blue-100">
                  💡 <strong>Tip:</strong> Register after placing your order to track all your orders in one place!
                </p>
              </div>

              <p className="text-xs text-center text-muted-foreground">
                By placing this order, you agree to our terms and conditions
              </p>
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
                    <img src={item.image} alt={item.name} className="w-20 h-20 object-cover" />
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Size: {item.selectedSize} | Qty: {item.quantity}
                      </p>
                      <p className="font-display">₹{item.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{totalPrice}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between font-display text-xl pt-2 border-t border-border">
                  <span>Total</span>
                  <span>₹{totalPrice}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default GuestCheckoutPage;
