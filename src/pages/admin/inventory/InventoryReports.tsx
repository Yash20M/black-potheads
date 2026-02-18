import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Package, DollarSign, RefreshCw, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { adminApi } from '@/lib/api';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const InventoryReports = () => {
  const [trends, setTrends] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30');

  useEffect(() => {
    loadData();
  }, [period]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [trendsData, statsData] = await Promise.all([
        adminApi.inventory.getInventoryTrends(parseInt(period)),
        adminApi.inventory.getInventoryStats(),
      ]);
      setTrends(trendsData);
      setStats(statsData);
    } catch (error: any) {
      toast.error('Failed to load reports');
      console.error('Load reports error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Loading reports...</p>
      </div>
    );
  }

  const topProducts = trends?.trends?.topSellingProducts || [];
  const categorySales = trends?.trends?.categorySales || [];
  const stockByCategory = stats?.stats?.stockByCategory || [];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-4xl mb-2">Inventory Reports</h1>
          <p className="text-muted-foreground">Analytics and insights for your inventory</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 Days</SelectItem>
              <SelectItem value="30">Last 30 Days</SelectItem>
              <SelectItem value="60">Last 60 Days</SelectItem>
              <SelectItem value="90">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="hero" onClick={loadData}>
            <RefreshCw size={18} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.stats?.totalProducts || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats?.stats?.inStockProducts || 0} in stock
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{stats?.stats?.totalInventoryValue?.toLocaleString() || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Total stock value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Daily Orders</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-300">
              {trends?.trends?.avgDailyOrders?.toFixed(1) || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Last {period} days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Period</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{period}</div>
            <p className="text-xs text-muted-foreground mt-1">Days analyzed</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Top Selling Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp size={20} />
              Top Selling Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topProducts.length > 0 ? (
              <div className="space-y-4">
                {topProducts.map((product: any, index: number) => (
                  <motion.div
                    key={product.productId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-secondary rounded"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-300">{product.unitsSold} sold</p>
                      <p className="text-sm text-muted-foreground">
                        Stock: {product.currentStock}
                      </p>
                      {product.needsRestock && (
                        <p className="text-xs text-gray-500 mt-1">
                          ⚠ Restock in ~{product.estimatedDaysUntilStockout} days
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">No sales data available</p>
            )}
          </CardContent>
        </Card>

        {/* Category Sales */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package size={20} />
              Sales by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            {categorySales.length > 0 ? (
              <div className="space-y-4">
                {categorySales.map((cat: any, index: number) => (
                  <motion.div
                    key={cat.category}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-secondary rounded"
                  >
                    <div>
                      <p className="font-medium">{cat.category}</p>
                      <p className="text-sm text-muted-foreground">
                        {cat.unitsSold} units sold
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-300">₹{cat.revenue?.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Revenue</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">No category data available</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Stock by Category */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package size={20} />
            Current Stock by Category
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stockByCategory.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stockByCategory.map((cat: any, index: number) => (
                <motion.div
                  key={cat._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-secondary rounded border border-border"
                >
                  <h3 className="font-display text-xl mb-2">{cat._id}</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Stock:</span>
                      <span className="font-medium">{cat.totalStock}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Products:</span>
                      <span className="font-medium">{cat.productCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Avg Stock:</span>
                      <span className="font-medium">{cat.avgStock?.toFixed(1)}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">No stock data available</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryReports;
