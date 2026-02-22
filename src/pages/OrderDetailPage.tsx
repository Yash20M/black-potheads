import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Package, MapPin, CreditCard, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { orderApi } from '@/lib/api';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/loader';

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!user) {
      toast.error('Please login to view order details');
      navigate('/login');
      return;
    }
    if (orderId) {
      loadOrderDetails();
    }
  }, [user, orderId, navigate]);

  const loadOrderDetails = async () => {
    try {
      const data: any = await orderApi.getById(orderId!);
      setOrder(data.order);
    } catch (error: any) {
      toast.error('Failed to load order details');
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!confirm('Are you sure you want to cancel this order?')) return;

    setCancelling(true);
    try {
      await orderApi.cancel(orderId!);
      toast.success('Order cancelled successfully');
      loadOrderDetails(); // Refresh order details
    } catch (error: any) {
      toast.error(error.message || 'Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'Pending': 'text-yellow-500',
      'Processing': 'text-blue-500',
      'Shipped': 'text-purple-500',
      'Out for Delivery': 'text-orange-500',
      'Delivered': 'text-green-500',
      'Cancelled': 'text-red-500',
    };
    return colors[status] || 'text-muted-foreground';
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 bg-background flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-muted-foreground">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="min-h-screen pt-20 bg-background">
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <Link to="/orders" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={18} />
            <span className="text-sm uppercase tracking-wider">Back to Orders</span>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-display text-3xl md:text-4xl mb-2">Order Details</h1>
              <p className="text-muted-foreground">Order #{order._id.slice(-8)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-1">Status</p>
              <span className={`font-display text-xl ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>
          </div>

          {/* Order Info Card */}
          <div className="bg-card border border-border p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Order Date</p>
                <p className="font-medium">
                  {new Date(order.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Payment Method</p>
                <p className="font-medium">
                  {order.paymentMethod === 'COD' ? 'Cash on Delivery' : order.paymentMethod}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
                <p className="font-display text-xl">₹{order.totalAmount}</p>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          {order.payment && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card border border-border p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <CreditCard size={24} />
                <h2 className="font-display text-2xl">Payment Information</h2>
              </div>

              <div className="bg-secondary/50 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Payment Status</span>
                  <span className={`flex items-center gap-2 font-medium capitalize ${
                    order.payment.status === 'captured' 
                      ? 'text-green-500' 
                      : order.payment.status === 'failed'
                      ? 'text-red-500'
                      : 'text-yellow-500'
                  }`}>
                    {order.payment.status === 'captured' && <CheckCircle size={16} />}
                    {order.payment.status}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment ID</span>
                  <span className="font-mono text-sm">{order.payment.razorpayPaymentId}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order ID</span>
                  <span className="font-mono text-sm">{order.payment.razorpayOrderId}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount Paid</span>
                  <span className="font-display">₹{order.payment.amount} {order.payment.currency}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Date</span>
                  <span className="text-sm">
                    {new Date(order.payment.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Shipping Address */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <MapPin size={24} />
              <h2 className="font-display text-2xl">Shipping Address</h2>
            </div>
            <div className="bg-secondary/50 rounded-lg p-4">
              <p>{order.address.line1}</p>
              <p>{order.address.city}, {order.address.state}</p>
              <p>{order.address.pincode}</p>
              <p>{order.address.country}</p>
            </div>
          </motion.div>

          {/* Order Items */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card border border-border p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Package size={24} />
              <h2 className="font-display text-2xl">Order Items</h2>
            </div>

            <div className="space-y-4">
              {order.items?.map((item: any, index: number) => {
                const imageUrl = item.product?.images?.[0]
                  ? typeof item.product.images[0] === 'string'
                    ? item.product.images[0]
                    : item.product.images[0]?.url
                  : 'https://via.placeholder.com/400x500?text=No+Image';
                
                return (
                  <div key={index} className="flex gap-4 p-4 bg-secondary/50 rounded-lg">
                    <img
                      src={imageUrl}
                      alt={item.product?.name}
                      className="w-24 h-24 object-cover rounded"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/400x500?text=No+Image';
                      }}
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-lg mb-1">{item.product?.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Category: {item.category}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-muted-foreground">Size: {item.size}</span>
                        <span className="text-muted-foreground">Quantity: {item.quantity}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground mb-1">Price</p>
                      <p className="font-display text-xl">₹{item.price * item.quantity}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        ₹{item.price} × {item.quantity}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Total */}
            <div className="flex justify-between items-center pt-6 mt-6 border-t-2 border-border">
              <span className="font-display text-2xl">Total</span>
              <span className="font-display text-3xl">₹{order.totalAmount}</span>
            </div>
          </motion.div>

          {/* Actions */}
          <div className="flex gap-4">
            <Button variant="outline" asChild className="flex-1">
              <Link to="/orders">Back to Orders</Link>
            </Button>
            {order.status === 'Pending' && 
             order.paymentMethod === 'Online' && 
             order.payment?.status !== 'captured' && (
              <Button 
                variant="destructive" 
                className="flex-1"
                onClick={handleCancelOrder}
                disabled={cancelling}
              >
                {cancelling ? 'Cancelling...' : 'Cancel Order'}
              </Button>
            )}
            <Button variant="hero" asChild className="flex-1">
              <Link to="/shop">Continue Shopping</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
