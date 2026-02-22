import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Package, MapPin, CreditCard, User, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { adminApi } from '@/lib/api';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/loader';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const AdminOrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      loadOrderDetails();
    }
  }, [orderId]);

  const loadOrderDetails = async () => {
    try {
      const data: any = await adminApi.orders.getById(orderId!);
      setOrder(data.order);
    } catch (error: any) {
      toast.error('Failed to load order details');
      navigate('/admin/orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      await adminApi.orders.updateStatus(orderId!, newStatus);
      toast.success('Order status updated');
      setOrder({ ...order, status: newStatus });
    } catch (error: any) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this order?')) return;

    try {
      await adminApi.orders.delete(orderId!);
      toast.success('Order deleted');
      navigate('/admin/orders');
    } catch (error: any) {
      toast.error('Failed to delete order');
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

  const statuses = ['Pending', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-muted-foreground">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link
            to="/admin/orders"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft size={18} />
            <span className="text-sm uppercase tracking-wider">Back to Orders</span>
          </Link>
          <h1 className="font-display text-3xl md:text-4xl">Order Details</h1>
          <p className="text-muted-foreground">Order #{order._id.slice(-8)}</p>
          {order.status === 'Pending' && (
            <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-yellow-500/20 border border-yellow-500/50 rounded text-yellow-500 text-sm font-medium">
              ⚠️ Pending Order - Requires Action
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Select value={order.status} onValueChange={handleStatusUpdate}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="destructive" onClick={handleDelete}>
            Delete Order
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Order Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`bg-card border p-6 ${
            order.status === 'Pending' ? 'border-yellow-500/50 bg-yellow-500/5' : 'border-border'
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              <p className="text-sm text-muted-foreground mb-1">Status</p>
              <p className={`font-medium ${getStatusColor(order.status)}`}>
                {order.status}
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
        </motion.div>

        {/* Customer Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <User size={24} />
            <h2 className="font-display text-2xl">Customer Information</h2>
          </div>
          <div className="bg-secondary/50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Name</p>
              <p className="font-medium">{order.user?.name || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Email</p>
              <p className="font-medium">{order.user?.email || 'N/A'}</p>
            </div>
            {order.user?.phone && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Phone</p>
                <p className="font-medium">{order.user.phone}</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Payment Information */}
        {order.payment && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
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

              {order.payment.razorpaySignature && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Signature</span>
                  <span className="font-mono text-xs truncate max-w-xs">
                    {order.payment.razorpaySignature}
                  </span>
                </div>
              )}

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
          transition={{ delay: 0.3 }}
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
          transition={{ delay: 0.4 }}
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
            <span className="font-display text-2xl">Total Amount</span>
            <span className="font-display text-3xl text-primary">₹{order.totalAmount}</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminOrderDetail;
