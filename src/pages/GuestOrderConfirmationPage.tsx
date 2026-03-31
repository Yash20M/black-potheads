import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Copy, Package, MapPin, CreditCard, Calendar, ArrowRight, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { orderApi } from '@/lib/api';
import { toast } from 'sonner';
import { useCartStore } from '@/store/cartStore';

const GuestOrderConfirmationPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { clearCart } = useCartStore();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const email = localStorage.getItem('guestOrderEmail');

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId || !email) {
        toast.error('Order information not found');
        navigate('/shop');
        return;
      }

      try {
        const result: any = await orderApi.getGuestOrder(orderId, email);

        if (result.success) {
          setOrder(result.order);
          // Clear cart after successful order
          clearCart();
        } else {
          toast.error('Failed to load order details');
          navigate('/shop');
        }
      } catch (error: any) {
        console.error('Failed to fetch order:', error);
        toast.error(error.message || 'Failed to load order details');
        navigate('/shop');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, email, navigate, clearCart]);

  const copyOrderId = () => {
    if (order?._id) {
      navigator.clipboard.writeText(order._id);
      toast.success('Order ID copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-4xl mb-4">Loading...</h1>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-4xl mb-4">Order Not Found</h1>
          <Button asChild>
            <Link to="/shop">Back to Shop</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="mb-6"
          >
            <CheckCircle className="w-20 h-20 mx-auto text-green-500" />
          </motion.div>

          <h1 className="font-display text-4xl md:text-5xl mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground text-lg">Thank you for your order</p>
        </motion.div>

        {/* Easy Tracking Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-3xl mx-auto mb-8"
        >
          <div className="bg-card border-2 border-primary p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-primary/10 border border-primary flex items-center justify-center">
                <Package size={24} className="text-primary" />
              </div>
              <h3 className="font-display text-2xl">EASY ORDER TRACKING</h3>
            </div>

            <p className="text-muted-foreground mb-6">
              Track your order anytime using just your email or phone number:
            </p>

            <div className="bg-background border border-border p-6 mb-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-secondary border border-border flex items-center justify-center flex-shrink-0">
                    <Mail size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">Email</p>
                    <p className="font-medium">{order.guestInfo.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-secondary border border-border flex items-center justify-center flex-shrink-0">
                    <Phone size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">Phone</p>
                    <p className="font-medium">{order.guestInfo.phone}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-primary/5 border border-primary/20 p-4 mb-6">
              <p className="font-display text-lg mb-2">✨ NO ORDER ID NEEDED!</p>
              <p className="text-sm text-muted-foreground">
                Just enter your email or phone on the tracking page to see all your orders
              </p>
            </div>
          </div>
        </motion.div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Order Details */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card border border-border p-6 hover:border-primary transition-colors"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-secondary border border-border flex items-center justify-center">
                <CreditCard size={24} className="text-primary" />
              </div>
              <h3 className="font-display text-2xl">ORDER DETAILS</h3>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-border">
                <span className="text-sm uppercase tracking-wider text-muted-foreground">Status</span>
                <span className="font-semibold uppercase tracking-wide">{order.status}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-border">
                <span className="text-sm uppercase tracking-wider text-muted-foreground">Payment</span>
                <span className="font-semibold">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-border">
                <span className="text-sm uppercase tracking-wider text-muted-foreground">Order Date</span>
                <span>{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="font-display text-lg">TOTAL</span>
                <span className="font-display text-2xl text-primary">₹{order.totalAmount}</span>
              </div>
            </div>
          </motion.div>

          {/* Delivery Address */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-card border border-border p-6 hover:border-primary transition-colors"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-secondary border border-border flex items-center justify-center">
                <MapPin size={24} className="text-primary" />
              </div>
              <h3 className="font-display text-2xl">DELIVERY ADDRESS</h3>
            </div>

            <div className="space-y-2 text-sm">
              <p className="font-semibold text-base">{order.guestInfo.name}</p>
              <p className="text-muted-foreground">{order.address.line1}</p>
              <p className="text-muted-foreground">
                {order.address.city}, {order.address.state}
              </p>
              <p className="text-muted-foreground">{order.address.pincode}</p>
              <p className="text-muted-foreground">{order.address.country}</p>
            </div>
          </motion.div>
        </div>

        {/* Order Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="max-w-4xl mx-auto mt-6"
        >
          <div className="bg-card border border-border p-6 hover:border-primary transition-colors">
            <h3 className="font-display text-2xl mb-6">ITEMS ORDERED</h3>

            <div className="space-y-4">
              {order.items.map((item: any, index: number) => {
                // Handle different image formats from backend
                const imageUrl = item.product?.images?.[0]
                  ? typeof item.product.images[0] === 'string'
                    ? item.product.images[0]
                    : item.product.images[0]?.url
                  : item.product?.image
                  ? typeof item.product.image === 'string'
                    ? item.product.image
                    : item.product.image?.url
                  : '/placeholder.svg';

                return (
                  <div key={index} className="flex gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
                    <div className="w-24 h-24 border border-border overflow-hidden flex-shrink-0">
                      <img
                        src={imageUrl}
                        alt={item.product?.name || 'Product'}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder.svg';
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg mb-1">{item.product?.name || 'Product'}</h4>
                      <p className="text-sm text-muted-foreground uppercase tracking-wider">
                        Size: {item.size} | Qty: {item.quantity}
                      </p>
                      <p className="font-display text-primary mt-2">₹{item.price}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-display text-xl">₹{item.price * item.quantity}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="max-w-4xl mx-auto mt-8 space-y-6"
        >
          {/* Registration Prompt for Guest Users */}
          <div className="bg-card border-2 border-primary p-8 text-center">
            <h3 className="font-display text-3xl mb-3">🎉 JOIN THE MOVEMENT</h3>
            <p className="text-muted-foreground mb-6 text-lg">
              Create an account and all your orders will be automatically linked!
            </p>
            <Button variant="hero" size="lg" asChild className="mb-4">
              <Link to="/register">
                Create Account Now
              </Link>
            </Button>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              Use the same email ({order.guestInfo.email}) to link this order
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg" asChild>
              <Link to="/track-order">
                <Package className="mr-2" size={18} />
                Track Your Order
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/shop">
                Continue Shopping
                <ArrowRight className="ml-2" size={18} />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default GuestOrderConfirmationPage;
