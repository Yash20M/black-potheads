import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { adminApi } from '@/lib/api';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { TableSkeleton } from '@/components/ui/loader';

const AdminOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setPage(1); // Reset to first page on search
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    loadOrders();
  }, [page, statusFilter, categoryFilter, debouncedSearchTerm]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data: any = await adminApi.orders.getAll({
        page,
        limit: 10,
        filter: statusFilter && statusFilter !== 'all' ? statusFilter : undefined,
        category: categoryFilter && categoryFilter !== 'all' ? categoryFilter : undefined,
        search: debouncedSearchTerm || undefined,
      });
      setOrders(data.orders || []);
      setTotalPages(data.totalPages || 1);
    } catch (error: any) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await adminApi.orders.updateStatus(orderId, newStatus);
      toast.success('Order status updated');
      loadOrders();
    } catch (error: any) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (orderId: string) => {
    if (!confirm('Are you sure you want to delete this order?')) return;

    try {
      await adminApi.orders.delete(orderId);
      toast.success('Order deleted');
      loadOrders();
    } catch (error: any) {
      toast.error('Failed to delete order');
    }
  };

  const viewOrderDetails = async (orderId: string) => {
    try {
      const data: any = await adminApi.orders.getById(orderId);
      setSelectedOrder(data.order);
      setIsDialogOpen(true);
    } catch (error: any) {
      toast.error('Failed to load order details');
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'Pending': 'bg-gray-500/10 text-gray-400 border-gray-500/20',
      'Processing': 'bg-gray-600/10 text-gray-300 border-gray-600/20',
      'Shipped': 'bg-gray-700/10 text-gray-200 border-gray-700/20',
      'Out for Delivery': 'bg-gray-500/10 text-gray-400 border-gray-500/20',
      'Delivered': 'bg-gray-600/10 text-gray-300 border-gray-600/20',
      'Cancelled': 'bg-gray-700/10 text-gray-500 border-gray-700/20',
    };
    return colors[status] || 'bg-gray-500/10 text-gray-500 border-gray-500/20';
  };

  const statuses = ['Pending', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];
  const categories = ['Shiva', 'Shrooms', 'LSD', 'Chakras', 'Dark', 'Rick n Morty'];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-4xl mb-2">Orders</h1>
        <p className="text-muted-foreground">Manage customer orders</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          {searchTerm && searchTerm !== debouncedSearchTerm && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
              Searching...
            </span>
          )}
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {statuses.map((status) => (
              <SelectItem key={status} value={status.toLowerCase()}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <TableSkeleton rows={10} cols={7} />
      ) : (
        <>
          <div className="bg-card border border-border overflow-hidden">
            <table className="w-full">
              <thead className="bg-secondary">
                <tr>
                  <th className="text-left p-4 font-medium">Order ID</th>
                  <th className="text-left p-4 font-medium">Customer</th>
                  <th className="text-left p-4 font-medium">Items</th>
                  <th className="text-left p-4 font-medium">Total</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Date</th>
                  <th className="text-right p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-t border-border">
                    <td className="p-4 font-mono text-sm">
                      {order._id.slice(-8)}
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="font-medium">{order.user?.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.user?.email}
                        </p>
                      </div>
                    </td>
                    <td className="p-4">{order.items?.length || 0}</td>
                    <td className="p-4">${order.totalAmount}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => viewOrderDetails(order._id)}
                        >
                          <Eye size={16} className="mr-1" />
                          View
                        </Button>
                        <Select
                          value={order.status}
                          onValueChange={(value) => handleStatusUpdate(order._id, value)}
                        >
                          <SelectTrigger className="w-[140px] h-9">
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
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(order._id)}
                          className="text-destructive hover:text-destructive"
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-secondary rounded">
                <div>
                  <p className="text-sm text-muted-foreground">Order ID</p>
                  <p className="font-mono">{selectedOrder._id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p>{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-medium">{selectedOrder.status}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Payment Method</p>
                  <p>{selectedOrder.paymentMethod}</p>
                </div>
              </div>

              {/* Customer Information */}
              <div>
                <h3 className="font-medium mb-3 text-lg">Customer Information</h3>
                <div className="space-y-2 p-4 bg-secondary rounded">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{selectedOrder.user?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p>{selectedOrder.user?.email || 'N/A'}</p>
                  </div>
                  {selectedOrder.user?.phone && (
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p>{selectedOrder.user.phone}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h3 className="font-medium mb-3 text-lg">Shipping Address</h3>
                <div className="p-4 bg-secondary rounded">
                  {selectedOrder.address ? (
                    <div className="space-y-1">
                      <p>{selectedOrder.address.line1}</p>
                      <p>
                        {selectedOrder.address.city}
                        {selectedOrder.address.state && `, ${selectedOrder.address.state}`}
                      </p>
                      <p>
                        {selectedOrder.address.pincode}
                        {selectedOrder.address.country && `, ${selectedOrder.address.country}`}
                      </p>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No address provided</p>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-medium mb-3 text-lg">Order Items</h3>
                <div className="space-y-3">
                  {selectedOrder.items && selectedOrder.items.length > 0 ? (
                    selectedOrder.items.map((item: any, index: number) => (
                      <div key={index} className="flex gap-4 p-4 bg-secondary rounded">
                        {/* Product Image */}
                        {item.product?.images?.[0] && (
                          <div className="w-20 h-20 bg-background rounded overflow-hidden flex-shrink-0">
                            <img
                              src={typeof item.product.images[0] === 'string' 
                                ? item.product.images[0] 
                                : item.product.images[0].url}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        
                        {/* Product Details */}
                        <div className="flex-1">
                          <p className="font-medium">{item.product?.name || 'Product'}</p>
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
                    ))
                  ) : (
                    <p className="text-muted-foreground p-4 bg-secondary rounded">No items</p>
                  )}
                </div>
              </div>

              {/* Order Total */}
              <div className="flex justify-between items-center font-display text-2xl pt-4 border-t-2 border-border">
                <span>Total Amount</span>
                <span className="text-primary">${selectedOrder.totalAmount}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminOrders;
