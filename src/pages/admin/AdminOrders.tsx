import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { adminApi } from '@/lib/api';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TableSkeleton } from '@/components/ui/loader';

const AdminOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [cleaningUp, setCleaningUp] = useState(false);

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

  const handleCleanupAbandoned = async () => {
    if (!confirm('This will cancel all pending online payment orders that failed or were abandoned. Continue?')) return;

    setCleaningUp(true);
    try {
      const response: any = await adminApi.orders.cleanupAbandoned();
      toast.success(`Cleaned up ${response.cleanedCount} abandoned orders`);
      loadOrders(); // Refresh the list
    } catch (error: any) {
      toast.error('Failed to cleanup abandoned orders');
    } finally {
      setCleaningUp(false);
    }
  };

  const viewOrderDetails = (orderId: string) => {
    navigate(`/admin/orders/${orderId}`);
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
      <div className="mb-6 md:mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="font-display text-3xl md:text-4xl mb-2">Orders</h1>
            <p className="text-muted-foreground text-sm md:text-base">Manage customer orders</p>
          </div>
          <Button
            variant="outline"
            onClick={handleCleanupAbandoned}
            disabled={cleaningUp}
          >
            {cleaningUp ? 'Cleaning...' : 'Cleanup Abandoned Orders'}
          </Button>
        </div>
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
          <div className="bg-card border border-border overflow-x-auto">
            <table className="w-full min-w-[900px]">
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
                  <tr key={order._id} className={`border-t border-border ${
                    order.status === 'Pending' ? 'bg-yellow-500/10' : ''
                  }`}>
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
                    <td className="p-4">₹{order.totalAmount}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                        {order.status === 'Pending' && (
                          <span className="text-xs text-yellow-500 font-medium">⚠️ Needs Attention</span>
                        )}
                      </div>
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
    </div>
  );
};

export default AdminOrders;
