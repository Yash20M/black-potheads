import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Mail, Phone, Search, MapPin, CheckCircle, Calendar, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { orderApi } from '@/lib/api';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const TrackOrderPage = () => {
  const [contactType, setContactType] = useState<'email' | 'phone'>('email');
  const [contact, setContact] = useState('');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const ordersRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to orders when they are loaded
  useEffect(() => {
    if (orders.length > 0 && ordersRef.current) {
      setTimeout(() => {
        ordersRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }, 100);
    }
  }, [orders]);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setOrders([]);

    if (!contact.trim()) {
      setError(`Please enter your ${contactType}`);
      toast.error(`Please enter your ${contactType}`);
      return;
    }

    // Validate input
    if (contactType === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)) {
      setError('Please enter a valid email address');
      toast.error('Please enter a valid email address');
      return;
    }

    if (contactType === 'phone' && !/^[0-9]{10}$/.test(contact)) {
      setError('Please enter a valid 10-digit phone number');
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);

    try {
      const requestBody = contactType === 'email' 
        ? { email: contact.trim() }
        : { phone: contact.trim() };

      const result: any = await orderApi.trackGuestOrdersByContact(requestBody);

      if (result.success) {
        setOrders(result.orders);
        toast.success(`Found ${result.count} order(s)!`);
      } else {
        setError(result.message);
        toast.error(result.message);
      }
    } catch (error: any) {
      console.error('Tracking failed:', error);
      const errorMessage = error.message || 'Failed to track orders. Please try again.';
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

  const OrderCard = ({ order }: { order: any }) => {
    const currentStatusIndex = orderStatuses.indexOf(order.status);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-lg p-6 mb-6"
      >
        {/* Order Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-6 border-b border-border">
          <div>
            <h3 className="font-display text-xl mb-1">Order #{order._id.slice(-8)}</h3>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Calendar size={14} />
              {new Date(order.createdAt).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
          <div
            className={cn(
              'px-4 py-2 rounded-full text-white font-semibold text-sm',
              getStatusColor(order.status)
            )}
          >
            {order.status}
          </div>
        </div>

        {/* Order Timeline */}
        <div className="mb-6">
          <h4 className="font-semibold mb-4 text-center">Order Progress</h4>
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
                      'w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mb-2 transition-all',
                      isCompleted
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                    )}
                  >
                    {isCompleted ? <CheckCircle size={20} /> : <div className="w-2 h-2 rounded-full bg-current" />}
                  </div>
                  <p
                    className={cn(
                      'text-[10px] sm:text-xs text-center font-medium max-w-[60px] sm:max-w-none',
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

        {/* Order Items */}
        <div className="mb-6">
          <h4 className="font-semibold mb-3">Items</h4>
          <div className="space-y-3">
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
                <div key={index} className="flex gap-3 sm:gap-4">
                  <img
                    src={imageUrl}
                    alt={item.product?.name || 'Product'}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.svg';
                    }}
                  />
                  <div className="flex-1">
                    <h5 className="font-medium text-sm sm:text-base">{item.product?.name || 'Product'}</h5>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Size: {item.size} | Qty: {item.quantity}
                    </p>
                    <p className="font-display text-sm sm:text-base mt-1">₹{item.price}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-secondary/20 rounded-lg p-4">
            <p className="text-xs text-muted-foreground mb-1">Total Amount</p>
            <p className="font-display text-xl">₹{order.totalAmount}</p>
          </div>
          <div className="bg-secondary/20 rounded-lg p-4">
            <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
              <CreditCard size={12} />
              Payment Method
            </p>
            <p className="font-semibold">{order.paymentMethod}</p>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="bg-secondary/20 rounded-lg p-4">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <MapPin size={16} />
            Delivery Address
          </h4>
          <div className="text-sm text-muted-foreground">
            <p>{order.guestInfo.name}</p>
            <p>{order.address.line1}</p>
            <p>
              {order.address.city}, {order.address.state} - {order.address.pincode}
            </p>
            <p>{order.address.country}</p>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen pt-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8 sm:mb-12">
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl mb-3 sm:mb-4">Track Your Orders</h1>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
            Enter your email or phone number to see all your orders
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            ✨ No Order ID needed!
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
            <form onSubmit={handleTrack} className="space-y-6">
              {/* Contact Type Selection */}
              <div>
                <Label className="mb-3 block">Track by</Label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="email"
                      checked={contactType === 'email'}
                      onChange={(e) => {
                        setContactType(e.target.value as 'email' | 'phone');
                        setContact('');
                        setError('');
                      }}
                      className="w-4 h-4"
                    />
                    <Mail size={18} className="text-muted-foreground" />
                    <span>Email</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="phone"
                      checked={contactType === 'phone'}
                      onChange={(e) => {
                        setContactType(e.target.value as 'email' | 'phone');
                        setContact('');
                        setError('');
                      }}
                      className="w-4 h-4"
                    />
                    <Phone size={18} className="text-muted-foreground" />
                    <span>Phone</span>
                  </label>
                </div>
              </div>

              {/* Input Field */}
              <div>
                <Label htmlFor="contact">
                  {contactType === 'email' ? 'Email Address' : 'Phone Number (10 digits)'}
                </Label>
                <div className="relative">
                  {contactType === 'email' ? (
                    <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  ) : (
                    <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  )}
                  <Input
                    id="contact"
                    type={contactType === 'email' ? 'email' : 'tel'}
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder={
                      contactType === 'email' ? 'Enter your email address' : 'Enter your phone number'
                    }
                    maxLength={contactType === 'phone' ? 10 : undefined}
                    className="pl-10"
                    required
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
                {loading ? 'Searching...' : 'Track Orders'}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                💡 Tip: You can track all your orders at once without remembering Order IDs
              </p>
            </form>
          </div>
        </motion.div>

        {/* Orders List */}
        {orders.length > 0 && (
          <motion.div
            ref={ordersRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <div className="mb-6">
              <h2 className="font-display text-2xl sm:text-3xl mb-2">
                Your Orders ({orders.length})
              </h2>
              <p className="text-muted-foreground text-sm">
                Showing all orders for {contactType === 'email' ? contact : `phone ending in ${contact.slice(-4)}`}
              </p>
            </div>

            {orders.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </motion.div>
        )}

        {/* No Orders Found */}
        {!loading && orders.length === 0 && contact && !error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="bg-card border border-border rounded-lg p-8">
              <Package size={48} className="mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-display text-xl mb-2">No Orders Found</h3>
              <p className="text-muted-foreground mb-4">
                We couldn't find any orders with this {contactType}
              </p>
              <p className="text-sm text-muted-foreground">
                Try using your {contactType === 'email' ? 'phone number' : 'email address'} instead
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TrackOrderPage;
