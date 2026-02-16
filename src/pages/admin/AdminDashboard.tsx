import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Package, ShoppingCart, TrendingUp, Users, Warehouse, AlertTriangle } from 'lucide-react';
import { adminApi } from '@/lib/api';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AdminDashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [inventoryStats, setInventoryStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      const [orderData, inventoryData] = await Promise.all([
        adminApi.orders.getStatistics(),
        adminApi.inventory.getStats().catch(() => null) // Don't fail if inventory API is not available
      ]);
      setStats(orderData);
      setInventoryStats(inventoryData);
    } catch (error: any) {
      toast.error('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Orders',
      value: stats?.totalOrders || 0,
      icon: ShoppingCart,
      color: 'text-gray-300',
    },
    {
      title: 'Pending',
      value: stats?.statusCounts?.find((s: any) => s._id === 'Pending')?.count || 0,
      icon: Package,
      color: 'text-gray-400',
    },
    {
      title: 'Delivered',
      value: stats?.statusCounts?.find((s: any) => s._id === 'Delivered')?.count || 0,
      icon: TrendingUp,
      color: 'text-gray-200',
    },
    {
      title: 'Processing',
      value: stats?.statusCounts?.find((s: any) => s._id === 'Processing')?.count || 0,
      icon: Users,
      color: 'text-gray-500',
    },
  ];

  const inventoryCards = inventoryStats?.stats ? [
    {
      title: 'Total Products',
      value: inventoryStats.stats.totalProducts || 0,
      icon: Warehouse,
      color: 'text-blue-500',
    },
    {
      title: 'In Stock',
      value: inventoryStats.stats.inStockProducts || 0,
      icon: Package,
      color: 'text-green-500',
    },
    {
      title: 'Low Stock',
      value: inventoryStats.stats.lowStockProducts || 0,
      icon: AlertTriangle,
      color: 'text-orange-500',
    },
    {
      title: 'Out of Stock',
      value: inventoryStats.stats.outOfStockProducts || 0,
      icon: AlertTriangle,
      color: 'text-red-500',
    },
  ] : [];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-4xl mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your store</p>
      </div>

      {/* Orders Section */}
      <div className="mb-8">
        <h2 className="font-display text-2xl mb-4">Orders Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card border border-border p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
              <p className="text-3xl font-display mb-1">{stat.value}</p>
              <p className="text-sm text-muted-foreground uppercase tracking-wider">
                {stat.title}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Inventory Section */}
      {inventoryCards.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-2xl">Inventory Overview</h2>
            <Link to="/admin/inventory">
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {inventoryCards.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.4 }}
                className="bg-card border border-border p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
                <p className="text-3xl font-display mb-1">{stat.value}</p>
                <p className="text-sm text-muted-foreground uppercase tracking-wider">
                  {stat.title}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Low Stock Alert */}
      {inventoryStats?.stats && (inventoryStats.stats.lowStockProducts > 0 || inventoryStats.stats.outOfStockProducts > 0) && (
        <Card className="mb-8 border-orange-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-500">
              <AlertTriangle size={20} />
              Inventory Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {inventoryStats.stats.outOfStockProducts > 0 && (
                <p className="text-red-500">
                  {inventoryStats.stats.outOfStockProducts} product(s) are out of stock
                </p>
              )}
              {inventoryStats.stats.lowStockProducts > 0 && (
                <p className="text-orange-500">
                  {inventoryStats.stats.lowStockProducts} product(s) are running low
                </p>
              )}
              <Link to="/admin/inventory">
                <Button variant="outline" size="sm" className="mt-2">
                  Manage Inventory
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="bg-card border border-border p-6">
        <h2 className="font-display text-2xl mb-4">Order Status Breakdown</h2>
        <div className="space-y-3">
          {stats?.statusCounts?.map((status: any) => (
            <div key={status._id} className="flex items-center justify-between">
              <span className="text-muted-foreground">{status._id}</span>
              <span className="font-display text-xl">{status.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
