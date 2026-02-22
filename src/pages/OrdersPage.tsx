import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, User, Heart, Settings, Eye, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/store/authStore';
import { orderApi } from '@/lib/api';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/loader';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const OrdersPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setPage(1); // Reset to first page on search
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    if (!user) {
      toast.error('Please login to view orders');
      navigate('/login');
      return;
    }
    loadOrders();
  }, [user, navigate, page, debouncedSearchTerm, statusFilter, paymentMethodFilter]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data: any = await orderApi.getAllWithFilters({
        page,
        limit: 10,
        search: debouncedSearchTerm || undefined,
        status: statusFilter && statusFilter !== 'all' ? statusFilter : undefined,
        paymentMethod: paymentMethodFilter && paymentMethodFilter !== 'all' ? paymentMethodFilter : undefined,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });
      setOrders(data.orders || []);
      setTotalPages(data.totalPages || 1);
      setTotalOrders(data.totalOrders || 0);
    } catch (error: any) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const viewOrderDetails = (orderId: string) => {
    navigate(`/orders/${orderId}`);
  };

  const cancelOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;

    setCancellingOrderId(orderId);
    try {
      await orderApi.cancel(orderId);
      toast.success('Order cancelled successfully');
      loadOrders(); // Refresh the list
    } catch (error: any) {
      toast.error(error.message || 'Failed to cancel order');
    } finally {
      setCancellingOrderId(null);
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

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setPaymentMethodFilter('');
    setPage(1);
  };

  const hasActiveFilters = searchTerm || statusFilter || paymentMethodFilter;

  const statuses = ['Pending', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];

  if (!user) return null;

  return (
    <div className="min-h-screen pt-20 bg-background">
      <div className="container mx-auto px-6 py-12">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-4xl md:text-5xl mb-12"
        >
          MY ORDERS
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <Link to="/profile">
              <div className="bg-card border border-border hover:border-primary transition-colors p-4 flex items-center gap-3">
                <User size={20} />
                <span className="font-medium">Profile</span>
              </div>
            </Link>

            <Link to="/orders">
              <div className="bg-card border border-primary p-4 flex items-center gap-3">
                <Package size={20} />
                <span className="font-medium">My Orders</span>
              </div>
            </Link>

            <Link to="/wishlist">
              <div className="bg-card border border-border hover:border-primary transition-colors p-4 flex items-center gap-3">
                <Heart size={20} />
                <span className="font-medium">Wishlist</span>
              </div>
            </Link>

            <button
              onClick={logout}
              className="w-full bg-card border border-border hover:border-destructive transition-colors p-4 flex items-center gap-3 text-left"
            >
              <Settings size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </motion.div>

          {/* Orders Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            {/* Filters Section */}
            <div className="mb-6 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {totalOrders} {totalOrders === 1 ? 'order' : 'orders'} found
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter size={16} className="mr-2" />
                  {showFilters ? 'Hide Filters' : 'Show Filters'}
                </Button>
              </div>

              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-card border border-border rounded"
                >
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input
                      placeholder="Search by Order ID or Amount..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      {statuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={paymentMethodFilter} onValueChange={setPaymentMethodFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by payment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Payment Methods</SelectItem>
                      <SelectItem value="COD">Cash on Delivery</SelectItem>
                      <SelectItem value="Online">Online Payment</SelectItem>
                    </SelectContent>
                  </Select>

                  {hasActiveFilters && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearFilters}
                      className="md:col-span-3"
                    >
                      Clear Filters
                    </Button>
                  )}
                </motion.div>
              )}
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Spinner size="lg" />
                <p className="mt-4 text-muted-foreground">Loading your orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-card border border-border p-12 text-center">
                <Package size={48} className="mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-display text-2xl mb-2">No Orders Yet</h3>
                <p className="text-muted-foreground mb-6">
                  Start shopping to see your orders here
                </p>
                <Button variant="hero" asChild>
                  <Link to="/shop">Start Shopping</Link>
                </Button>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {orders.map((order) => (
                    <motion.div
                      key={order._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-card border border-border p-6"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Order #{order._id.slice(-8)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                        <span className={`font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>

                      <div className="space-y-3 mb-4">
                        {order.items?.slice(0, 2).map((item: any, index: number) => {
                          const imageUrl = item.product?.images?.[0]
                            ? typeof item.product.images[0] === 'string'
                              ? item.product.images[0]
                              : item.product.images[0]?.url
                            : 'https://via.placeholder.com/400x500?text=No+Image';
                          
                          return (
                            <div key={index} className="flex gap-4">
                              <img
                                src={imageUrl}
                                alt={item.product?.name}
                                className="w-16 h-16 object-cover bg-secondary"
                                onError={(e) => {
                                  e.currentTarget.src = 'https://via.placeholder.com/400x500?text=No+Image';
                                }}
                              />
                              <div className="flex-1">
                                <p className="font-medium">{item.product?.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  Size: {item.size} | Qty: {item.quantity}
                                </p>
                              </div>
                              <p className="font-display">₹{item.price * item.quantity}</p>
                            </div>
                          );
                        })}
                        {order.items?.length > 2 && (
                          <p className="text-sm text-muted-foreground">
                            +{order.items.length - 2} more items
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div>
                          <p className="text-sm text-muted-foreground">Total Amount</p>
                          <p className="font-display text-xl">₹{order.totalAmount}</p>
                          {order.paymentMethod === 'Online' && order.payment && (
                            <>
                              {order.payment.status === 'captured' ? (
                                <p className="text-xs text-green-500 mt-1">
                                  ✓ Paid via Razorpay
                                </p>
                              ) : (
                                <p className="text-xs text-yellow-500 mt-1">
                                  ⚠ Payment {order.payment.status}
                                </p>
                              )}
                            </>
                          )}
                          {order.paymentMethod === 'COD' && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Cash on Delivery
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => viewOrderDetails(order._id)}
                          >
                            <Eye size={16} className="mr-2" />
                            View Details
                          </Button>
                          {order.status === 'Pending' && 
                           order.paymentMethod === 'Online' && 
                           order.payment?.status !== 'captured' && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => cancelOrder(order._id)}
                              disabled={cancellingOrderId === order._id}
                            >
                              {cancellingOrderId === order._id ? 'Cancelling...' : 'Cancel Order'}
                            </Button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-6">
                    <Button
                      variant="outline"
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      Page {page} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
