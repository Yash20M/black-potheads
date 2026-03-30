import { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Mail, Phone, Search, MapPin, Calendar, CreditCard, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { orderApi } from '@/lib/api';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const TrackOrderPage = () => {
  const [formData, setFormData] = useState({
    orderId: '',
    email: '',
    phone: '',
  });
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError('');
  };

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setOrder(null);

    if (!formData.orderId.trim()) {
      setError('Order ID is required');
      toast.error('Order ID is required');
      return;
    }

    const hasEmail = formData.email && formData.email.trim().length > 0;
    const hasPhone = formData.phone && formData.phone.trim().length > 0;

    if (!hasEmail && !hasPhone) {
      setError('Please provide either email or phone number');
      toast.error('Please provide either email or phone number');
      return;
    }

    // Validate phone format if provided
    if (hasPhone && !/^[0-9]{10}$/.test(formData.phone.trim())) {
      setError('Phone number must be exactly 10 digits');
      toast.error('Phone number must be exactly 10 digits');
      return;
    }

    // Validate email format if provided
    if (hasEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      setError('Please provide a valid email address');
      toast.error('Please provide a valid email address');
      return;
    }

    setLoading(true);

    try {
      const trackData: any = {
        orderId: formData.orderId.trim(),
      };
      
      // Only add email or phone if they have values
      if (hasEmail) {
        trackData.email = formData.email.trim();
      }
      if (hasPhone) {
        trackData.phone = formData.phone.trim();
      }

      console.log('Tracking with data:', trackData); // Debug log

      const result: any = await orderApi.trackGuestOrder(trackData);

      if (result.success) {
        setOrder(result.order);
        toast.success('Order found!');
      } else {
        setError(result.message);
        toast.error(result.message);
      }
    } catch (error: any) {
      console.error('Tracking failed:', error);
      const errorMessage = error.message || 'Failed to track order. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      Pending: 'bg-yellow-500',
      Processing: 'bg-blue-500',
      Shipped: 'bg-purple-500',
      'Out for Delivery': 'bg-orange-500',
      Delivered: 'bg-green-500',
      Cancelled: 'bg-red-500',
      Refunded: 'bg-gray-500',
    };
    return colors[status] || 'bg-gray-500';
  };

  const orderStatuses = ['Pending', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];
  const currentStatusIndex = order ? orderStatuses.indexOf(order.status) : -1;

  return (
    <div className="min-h-screen pt-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="font-display text-4xl md:text-5xl mb-4">Track Your Order</h1>
          <p className="text-muted-foreground text-lg">
            Enter your order details to track your shipment
          </p>
        </motion.div>

        {/* Tracking Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-2xl mx-auto mb-12"
        >
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                <strong>Note:</strong> You need your Order ID and either your email OR phone number to track your order.
              </p>
            </div>
            
            <form onSubmit={handleTrack} className="space-y-4">
              <div>
                <Label htmlFor="orderId">Order ID *</Label>
                <div className="relative">
                  <Package size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="orderId"
                    name="orderId"
                    value={formData.orderId}
                    onChange={handleChange}
                    placeholder="Enter your order ID"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email (Optional if phone provided)</Label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="text-center text-sm text-muted-foreground">OR</div>

              <div>
                <Label htmlFor="phone">Phone - 10 digits (Optional if email provided)</Label>
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
                    className="pl-10"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                  <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                </div>
              )}

              <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
                <Search className="mr-2" size={18} />
                {loading ? 'Tracking...' : 'Track Order'}
              </Button>
            </form>
          </div>
        </motion.div>

        {/* Order Details */}
        {order && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto space-y-6"
          >
            {/* Status Badge */}
            <div className="text-center">
              <div
                className={cn(
                  'inline-block px-6 py-3 rounded-full text-white font-semibold text-lg',
                  getStatusColor(order.status)
                )}
              >
                {order.status}
              </div>
            </div>

            {/* Order Timeline */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-display text-2xl mb-6 text-center">Order Progress</h3>
              <div className="flex justify-between items-center relative">
                {/* Progress Line */}
                <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 -z-10">
                  <div
                    className="h-full bg-primary transition-all duration-500"
                    style={{
                      width: `${currentStatusIndex >= 0 ? (currentStatusIndex / (orderStatuses.length - 1)) * 100 : 0}%`,
                    }}
                  />
                </div>

                {orderStatuses.map((status, index) => {
                  const isCompleted = index <= currentStatusIndex;
                  const isActive = index === currentStatusIndex;

                  return (
                    <div key={status} className="flex flex-col items-center flex-1">
                      <div
                        className={cn(
                          'w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all',
                          isCompleted
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                        )}
                      >
                        {isCompleted ? <CheckCircle size={24} /> : <div className="w-3 h-3 rounded-full bg-current" />}
                      </div>
                      <p
                        className={cn(
                          'text-xs text-center font-medium',
                          isActive ? 'text-foreground' : 'text-muted-foreground'
                        )}
                      >
                        {status}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Order Information */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="font-display text-xl mb-4 flex items-center gap-2">
                  <Package size={20} />
                  Order Information
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Order ID:</span>
                    <span className="font-mono text-xs">{order._id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Order Date:</span>
                    <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Amount:</span>
                    <span className="font-display">₹{order.totalAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment Method:</span>
                    <span>{order.paymentMethod}</span>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="font-display text-xl mb-4">Customer Information</h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Name:</strong> {order.guestInfo.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {order.guestInfo.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {order.guestInfo.phone}
                  </p>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-display text-xl mb-4 flex items-center gap-2">
                <MapPin size={20} />
                Delivery Address
              </h3>
              <div className="text-sm">
                <p>{order.address.line1}</p>
                <p>
                  {order.address.city}, {order.address.state}
                </p>
                <p>{order.address.pincode}</p>
                <p>{order.address.country}</p>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-display text-xl mb-4">Items</h3>
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
                          Size: {item.size} | Qty: {item.quantity}
                        </p>
                        <p className="font-display mt-1">₹{item.price}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TrackOrderPage;
