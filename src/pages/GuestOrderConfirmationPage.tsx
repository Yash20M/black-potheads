import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Copy, Package, MapPin, CreditCard, Calendar, ArrowRight } from 'lucide-react';
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

        {/* Important: Save Order ID */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-2xl mx-auto mb-8"
        >
          <div className="bg-yellow-50 border-2 border-yellow-500 rounded-lg p-6">
            <h3 className="font-display text-xl mb-3 flex items-center gap-2 text-gray-900">
              ⚠️ IMPORTANT: Save This Information
            </h3>
            <p className="text-sm text-gray-700 mb-4">
              You'll need this to track your order:
            </p>

            <div className="bg-white border border-gray-300 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-900">Order ID:</span>
                <Button variant="outline" size="sm" onClick={copyOrderId} className="bg-white text-gray-900 border-gray-300 hover:bg-gray-100">
                  <Copy size={14} className="mr-2" />
                  Copy
                </Button>
              </div>
              <p className="font-mono text-lg break-all text-gray-900 bg-gray-50 p-2 rounded">{order._id}</p>
            </div>

            <div className="space-y-2 text-sm text-gray-900">
              <p>
                <strong className="text-gray-900">Email:</strong> {order.guestInfo.email}
              </p>
              <p>
                <strong className="text-gray-900">Phone:</strong> {order.guestInfo.phone}
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
            className="bg-card border border-border rounded-lg p-6"
          >
            <h3 className="font-display text-2xl mb-4 flex items-center gap-2">
              <Package size={24} />
              Order Details
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <span className="font-semibold">{order.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment:</span>
                <span className="font-semibold">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order Date:</span>
                <span>{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-border">
                <span className="text-muted-foreground">Total Amount:</span>
                <span className="font-display text-xl">₹{order.totalAmount}</span>
              </div>
            </div>
          </motion.div>

          {/* Delivery Address */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-card border border-border rounded-lg p-6"
          >
            <h3 className="font-display text-2xl mb-4 flex items-center gap-2">
              <MapPin size={24} />
              Delivery Address
            </h3>

            <div className="text-sm space-y-1">
              <p className="font-semibold">{order.guestInfo.name}</p>
              <p>{order.address.line1}</p>
              <p>
                {order.address.city}, {order.address.state}
              </p>
              <p>{order.address.pincode}</p>
              <p>{order.address.country}</p>
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
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="font-display text-2xl mb-6">Items Ordered</h3>

            <div className="space-y-4">
              {order.items.map((item: any, index: number) => {
                // Handle different image formats from backend
                const getImageUrl = () => {
                  if (item.product?.images && Array.isArray(item.product.images) && item.product.images.length > 0) {
                    return item.product.images[0];
                  }
                  if (item.product?.image) {
                    return item.product.image;
                  }
                  return '/placeholder.svg';
                };

                return (
                  <div key={index} className="flex gap-4 pb-4 border-b border-border last:border-0">
                    <img
                      src={getImageUrl()}
                      alt={item.product?.name || 'Product'}
                      className="w-20 h-20 object-cover rounded"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold">{item.product?.name || 'Product'}</h4>
                      <p className="text-sm text-muted-foreground">
                        Size: {item.size} | Quantity: {item.quantity}
                      </p>
                      <p className="font-display mt-1">₹{item.price}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-display">₹{item.price * item.quantity}</p>
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
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-blue-300 dark:border-blue-700 rounded-lg p-6 text-center">
            <h3 className="font-display text-2xl mb-2">🎉 Want to track your orders easily?</h3>
            <p className="text-muted-foreground mb-4">
              Create an account and all your orders will be automatically linked!
            </p>
            <Button variant="hero" size="lg" asChild className="mb-3">
              <Link to="/register">
                Create Account Now
              </Link>
            </Button>
            <p className="text-xs text-muted-foreground">
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
