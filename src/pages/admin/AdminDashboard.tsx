import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Package, ShoppingCart, TrendingUp, Users } from 'lucide-react';
import { adminApi } from '@/lib/api';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      const data = await adminApi.orders.getStatistics();
      setStats(data);
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
      color: 'text-blue-500',
    },
    {
      title: 'Pending',
      value: stats?.statusCounts?.find((s: any) => s._id === 'Pending')?.count || 0,
      icon: Package,
      color: 'text-yellow-500',
    },
    {
      title: 'Delivered',
      value: stats?.statusCounts?.find((s: any) => s._id === 'Delivered')?.count || 0,
      icon: TrendingUp,
      color: 'text-green-500',
    },
    {
      title: 'Processing',
      value: stats?.statusCounts?.find((s: any) => s._id === 'Processing')?.count || 0,
      icon: Users,
      color: 'text-purple-500',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-4xl mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your store</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
