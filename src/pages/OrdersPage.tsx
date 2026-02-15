import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, User, Heart, Settings, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { orderApi } from '@/lib/api';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const OrdersPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!user) {
      toast.error('Please login to view orders');
      navigate('/login');
      return;
    }
    loadOrders();
  }, [user, navigate, page]);

  const loadOrders = async () => {
    try {
      const data: any = await orderApi.getAll(page, 10);
      setOrders(data.orders || []);
      setTotalPages(data.totalPages || 1);
    } catch (error: any) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const viewOrderDetails = async (orderId: string) => {
    try {
      const data: any = await orderApi.getById(orderId);
      setSelectedOrder(data.order);
      setIsDialogOpen(true);
    } catch (error: any) {
      toast.error('Failed to load order details');
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
            {loading ? (
              <div className="text-center py-12">Loading orders...</div>
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
                              <p className="font-display">${item.price * item.quantity}</p>
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
                          <p className="font-display text-xl">${order.totalAmount}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => viewOrderDetails(order._id)}
                        >
                          <Eye size={16} className="mr-2" />
                          View Details
                        </Button>
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

      {/* Order Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Order ID</p>
                <p className="font-mono">{selectedOrder._id}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Order Date</p>
                <p>
                  {new Date(selectedOrder.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className={`font-medium ${getStatusColor(selectedOrder.status)}`}>
                  {selectedOrder.status}
                </p>
              </div>

              <div>
                <h3 className="font-medium mb-2">Shipping Address</h3>
                <p>{selectedOrder.address?.line1}</p>
                <p>{selectedOrder.address?.city}, {selectedOrder.address?.state}</p>
                <p>{selectedOrder.address?.pincode}, {selectedOrder.address?.country}</p>
              </div>

              <div>
                <h3 className="font-medium mb-2">Order Items</h3>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item: any, index: number) => {
                    const imageUrl = item.product?.images?.[0]
                      ? typeof item.product.images[0] === 'string'
                        ? item.product.images[0]
                        : item.product.images[0]?.url
                      : 'https://via.placeholder.com/400x500?text=No+Image';
                    
                    return (
                      <div key={index} className="flex gap-4 border-b pb-3">
                        <img
                          src={imageUrl}
                          alt={item.product?.name}
                          className="w-20 h-20 object-cover bg-secondary"
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/400x500?text=No+Image';
                          }}
                        />
                        <div className="flex-1">
                          <p className="font-medium">{item.product?.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Category: {item.category}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Size: {item.size} | Quantity: {item.quantity}
                          </p>
                          <p className="text-sm font-medium mt-1">
                            ${item.price} × {item.quantity} = ${item.price * item.quantity}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-between font-display text-xl pt-4 border-t">
                <span>Total</span>
                <span>${selectedOrder.totalAmount}</span>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Payment Method: {selectedOrder.paymentMethod}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrdersPage;
