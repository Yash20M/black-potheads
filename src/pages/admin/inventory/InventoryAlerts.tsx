import { useEffect, useState } from 'react';
import { AlertTriangle, Package, RefreshCw, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { adminApi } from '@/lib/api';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const InventoryAlerts = () => {
  const [alerts, setAlerts] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [threshold, setThreshold] = useState(10);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const categories = ['Shiva', 'Shrooms', 'LSD', 'Chakras', 'Dark', 'Rick n Morty'];

  useEffect(() => {
    loadAlerts();
  }, [threshold, categoryFilter]);

  const loadAlerts = async () => {
    try {
      setLoading(true);
      const data = await adminApi.inventory.getStockAlerts();
      setAlerts(data);
    } catch (error: any) {
      toast.error('Failed to load alerts');
      console.error('Load alerts error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter alerts based on category
  const filteredAlerts = alerts?.alerts?.filter((alert: any) => {
    if (categoryFilter === 'all') return true;
    return alert.category === categoryFilter;
  }) || [];

  // Separate critical and warning alerts
  const criticalAlerts = filteredAlerts.filter((alert: any) => alert.type === 'critical');
  const warningAlerts = filteredAlerts.filter((alert: any) => alert.type === 'warning');

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-4xl mb-2">Inventory Alerts</h1>
          <p className="text-muted-foreground">Monitor low stock and out of stock items</p>
        </div>
        <Button variant="hero" onClick={loadAlerts}>
          <RefreshCw size={18} />
          Refresh
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-500">{criticalAlerts.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Out of stock or critical</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Warning Alerts</CardTitle>
            <TrendingDown className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-400">{warningAlerts.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Low stock items</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredAlerts.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Products need attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Select value={categoryFilter} onValueChange={(val) => setCategoryFilter(val)}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="All Categories" />
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

        <Select
          value={threshold.toString()}
          onValueChange={(val) => setThreshold(parseInt(val))}
        >
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Alert Threshold" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">Threshold: 5</SelectItem>
            <SelectItem value="10">Threshold: 10</SelectItem>
            <SelectItem value="15">Threshold: 15</SelectItem>
            <SelectItem value="20">Threshold: 20</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading alerts...</div>
      ) : (
        <div className="space-y-6">
          {/* Critical Alerts */}
          {criticalAlerts.length > 0 && (
            <div>
              <h2 className="font-display text-2xl mb-4 flex items-center gap-2">
                <AlertTriangle className="text-gray-500" size={24} />
                Critical Alerts ({criticalAlerts.length})
              </h2>
              <div className="bg-card border border-border overflow-hidden">
                <table className="w-full">
                  <thead className="bg-secondary">
                    <tr>
                      <th className="text-left p-4 font-medium">Product</th>
                      <th className="text-left p-4 font-medium">Category</th>
                      <th className="text-left p-4 font-medium">Current Stock</th>
                      <th className="text-left p-4 font-medium">Status</th>
                      <th className="text-left p-4 font-medium">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {criticalAlerts.map((alert: any) => {
                      const product = alert.product;
                      if (!product) return null;
                      const productImage = product.image;
                      return (
                        <tr key={product._id} className="border-t border-border">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              {productImage ? (
                                <img
                                  src={productImage}
                                  alt={product.name}
                                  className="w-12 h-12 object-cover rounded"
                                  onError={(e) => {
                                    e.currentTarget.src = '/placeholder.svg';
                                  }}
                                />
                              ) : (
                                <div className="w-12 h-12 bg-secondary flex items-center justify-center text-xs rounded">
                                  No Img
                                </div>
                              )}
                              <div>
                                <span className="font-medium block">{product.name}</span>
                                <span className="text-xs text-muted-foreground">{alert.message}</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">{alert.category}</td>
                          <td className="p-4">
                            <span className="text-lg font-bold text-gray-500">{product.stock}</span>
                          </td>
                          <td className="p-4">
                            <Badge variant="destructive">Critical</Badge>
                          </td>
                          <td className="p-4">
                            <span className="text-sm text-muted-foreground">{alert.action}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Warning Alerts */}
          {warningAlerts.length > 0 && (
            <div>
              <h2 className="font-display text-2xl mb-4 flex items-center gap-2">
                <TrendingDown className="text-gray-400" size={24} />
                Warning Alerts ({warningAlerts.length})
              </h2>
              <div className="bg-card border border-border overflow-hidden">
                <table className="w-full">
                  <thead className="bg-secondary">
                    <tr>
                      <th className="text-left p-4 font-medium">Product</th>
                      <th className="text-left p-4 font-medium">Category</th>
                      <th className="text-left p-4 font-medium">Current Stock</th>
                      <th className="text-left p-4 font-medium">Status</th>
                      <th className="text-left p-4 font-medium">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {warningAlerts.map((alert: any) => {
                      const product = alert.product;
                      if (!product) return null;
                      const productImage = product.image;
                      return (
                        <tr key={product._id} className="border-t border-border">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              {productImage ? (
                                <img
                                  src={productImage}
                                  alt={product.name}
                                  className="w-12 h-12 object-cover rounded"
                                  onError={(e) => {
                                    e.currentTarget.src = '/placeholder.svg';
                                  }}
                                />
                              ) : (
                                <div className="w-12 h-12 bg-secondary flex items-center justify-center text-xs rounded">
                                  No Img
                                </div>
                              )}
                              <div>
                                <span className="font-medium block">{product.name}</span>
                                <span className="text-xs text-muted-foreground">{alert.message}</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">{alert.category}</td>
                          <td className="p-4">
                            <span className="text-lg font-bold text-gray-400">{product.stock}</span>
                          </td>
                          <td className="p-4">
                            <Badge variant="outline" className="border-gray-400 text-gray-400">
                              Warning
                            </Badge>
                          </td>
                          <td className="p-4">
                            <span className="text-sm text-muted-foreground">{alert.action}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {alerts?.totalAlerts === 0 && (
            <div className="text-center py-12 bg-card border border-border">
              <Package size={48} className="mx-auto text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">No Alerts</p>
              <p className="text-muted-foreground">All products have sufficient stock</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InventoryAlerts;
