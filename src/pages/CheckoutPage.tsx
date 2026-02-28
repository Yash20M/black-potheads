import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CreditCard, Truck, CheckCircle, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { orderApi } from '@/lib/api';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// Declare Razorpay on window object
declare global {
  interface Window {
    Razorpay: any;
  }
}

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart, syncWithBackend } = useCartStore();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);

  const [formData, setFormData] = useState({
    line1: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    paymentMethod: 'COD',
  });

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

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
  }, [user, items, navigate, orderPlaced]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (!formData.line1 || !formData.city || !formData.state || !formData.pincode) {
      toast.error('Please fill in all address fields');
      return false;
    }
    return true;
  };

  const handleCODPayment = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Sync cart with backend
      await syncWithBackend();
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
        paymentMethod: 'COD',
      };

      const response: any = await orderApi.create(orderData);
      
      setOrderPlaced(true);
      setOrderDetails(response.order);
      await clearCart();
      toast.success('Order confirmed successfully!');
      setShowSuccessModal(true);
      navigate("/orders")
    } catch (error: any) {
      toast.error(error.message || 'Failed to place order');
      console.error('Order creation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOnlinePayment = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Sync cart with backend
      await syncWithBackend();
      await new Promise(resolve => setTimeout(resolve, 500));

      // Step 1: Create Razorpay order
      const response: any = await orderApi.createRazorpayOrder({
        totalAmount: getTotalPrice(),
        address: {
          line1: formData.line1,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          country: formData.country,
        },
      });

      if (!response.success) {
        throw new Error(response.message || 'Failed to create payment order');
      }

      // Step 2: Initialize Razorpay checkout
      const options = {
        key: response.key,
        amount: response.razorpayOrder.amount,
        currency: response.razorpayOrder.currency,
        name: 'Black Potheads',
        description: 'T-Shirt Purchase',
        order_id: response.razorpayOrder.id,
        handler: async function (razorpayResponse: any) {
          try {
            // Step 3: Verify payment
            const verifyResponse: any = await orderApi.verifyPayment({
              razorpayOrderId: razorpayResponse.razorpay_order_id,
              razorpayPaymentId: razorpayResponse.razorpay_payment_id,
              razorpaySignature: razorpayResponse.razorpay_signature,
              orderId: response.orderId,
            });

            if (verifyResponse.success) {
              setOrderPlaced(true);
              setOrderDetails(verifyResponse.order);
              await clearCart();
              toast.success('Payment successful! Order confirmed.');
              setShowSuccessModal(true);
              navigate("/orders")
            } else {
              toast.error('Payment verification failed');
            }
          } catch (error: any) {
            toast.error(error.message || 'Payment verification failed');
            console.error('Payment verification error:', error);
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: (user as any)?.phone || '',
        },
        theme: {
          color: '#000000',
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
            toast.info('Payment cancelled');
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
      setLoading(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to initiate payment');
      console.error('Payment initiation error:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.paymentMethod === 'COD') {
      await handleCODPayment();
    } else {
      await handleOnlinePayment();
    }
  };

  const totalPrice = getTotalPrice();

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    // Redirect to specific order details page if order ID exists
    if (orderDetails?._id) {
      navigate(`/orders/${orderDetails._id}`);
    } else {
      navigate('/orders');
    }
  };

  // Auto-redirect to orders page after 5 seconds
  useEffect(() => {
    if (showSuccessModal) {
      const timer = setTimeout(() => {
        handleCloseSuccessModal();
      }, 8000); // 8 seconds

      return () => clearTimeout(timer);
    }
  }, [showSuccessModal]);

  return (
    <div className="min-h-screen pt-20 bg-background">
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <Link to="/shop" className="inline-flex items-center gap-1.5 sm:gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={16} className="sm:w-[18px] sm:h-[18px]" />
            <span className="text-xs sm:text-sm uppercase tracking-wider">Back to Shop</span>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-3xl sm:text-4xl md:text-5xl mb-8 sm:mb-12"
        >
          CHECKOUT
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          {/* Checkout Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="bg-card border border-border p-4 sm:p-6">
                <h2 className="font-display text-xl sm:text-2xl mb-4 sm:mb-6 flex items-center gap-2">
                  <Truck size={20} className="sm:w-6 sm:h-6" />
                  <span className="text-base sm:text-2xl">Shipping Address</span>
                </h2>

                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <Label htmlFor="line1" className="text-sm">Address Line</Label>
                    <Input
                      id="line1"
                      name="line1"
                      value={formData.line1}
                      onChange={handleChange}
                      required
                      placeholder="123 Main Street"
                      className="text-sm sm:text-base"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <Label htmlFor="city" className="text-sm">City</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        placeholder="Mumbai"
                        className="text-sm sm:text-base"
                      />
                    </div>

                    <div>
                      <Label htmlFor="state" className="text-sm">State</Label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        required
                        placeholder="Maharashtra"
                        className="text-sm sm:text-base"
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
                      value="Online"
                      checked={formData.paymentMethod === 'Online'}
                      onChange={handleChange}
                      className="w-4 h-4"
                    />
                    <div>
                      <p className="font-medium">Online Payment</p>
                      <p className="text-sm text-muted-foreground">Pay securely via Razorpay (UPI, Cards, Net Banking)</p>
                    </div>
                  </label>
                </div>
              </div>

              <Button
                type="submit"
                variant="hero"
                size="lg"
                className="w-full"
                disabled={loading}
              >
                {loading 
                  ? 'Processing...' 
                  : formData.paymentMethod === 'COD'
                    ? `Place Order - ₹${totalPrice}`
                    : `Pay Now - ₹${totalPrice}`
                }
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

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="sr-only">Order Confirmed</DialogTitle>
          </DialogHeader>
          <AnimatePresence>
            {showSuccessModal && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center py-6"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="mb-6"
                >
                  <CheckCircle className="w-20 h-20 mx-auto text-green-500" />
                </motion.div>

                <h2 className="font-display text-3xl mb-2">Order Confirmed!</h2>
                <p className="text-muted-foreground mb-2">
                  Thank you for your purchase
                </p>
                <p className="text-xs text-muted-foreground mb-6">
                  Redirecting to your orders in a few seconds...
                </p>

                {orderDetails && (
                  <div className="bg-secondary/50 rounded-lg p-4 mb-6 text-left space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Order ID:</span>
                      <span className="font-mono text-xs">#{orderDetails._id?.slice(-8)}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Amount:</span>
                      <span className="font-display">₹{orderDetails.totalAmount}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Payment Method:</span>
                      <span className="font-medium">
                        {orderDetails.paymentMethod === 'COD' ? 'Cash on Delivery' : orderDetails.paymentMethod}
                      </span>
                    </div>

                    {orderDetails.payment && (
                      <>
                        <div className="border-t border-border pt-3 mt-3">
                          <p className="text-xs text-muted-foreground mb-2">Payment Details</p>
                        </div>
                        
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Payment ID:</span>
                          <span className="font-mono text-xs">
                            {orderDetails.payment.razorpayPaymentId?.slice(-10)}
                          </span>
                        </div>

                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Status:</span>
                          <span className="text-green-500 font-medium capitalize">
                            {orderDetails.payment.status}
                          </span>
                        </div>

                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Amount Paid:</span>
                          <span className="font-display">
                            ₹{orderDetails.payment.amount}
                          </span>
                        </div>
                      </>
                    )}

                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Status:</span>
                      <span className="font-medium">{orderDetails.status}</span>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <Button
                    variant="hero"
                    className="w-full"
                    onClick={handleCloseSuccessModal}
                  >
                    <Package className="mr-2" size={18} />
                    View Order Details Now
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CheckoutPage;
