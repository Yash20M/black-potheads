import { useEffect, useState } from 'react';
import { BarChart3, Download, RefreshCw, TrendingUp, Package, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { adminApi } from '@/lib/api';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const InventoryReports = () => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [stockMovement, setStockMovement] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [analyticsData, movementData] = await Promise.all([
        adminApi.inventory.getCategoryAnalytics(),
        adminApi.inventory.getStockMovementReport(startDate || undefined, endDate || undefined),
      ]);
      setAnalytics(analyticsData);
      setStockMovement(movementData);
    } catch (error: any) {
      toast.error('Failed to load reports');
      console.error('Load reports error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateFilter = () => {
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      toast.error('Start date must be before end date');
      return;
    }
    loadData();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-4xl mb-2">Inventory Reports</h1>
          <p className="text-muted-foreground">Analytics and stock movement reports</p>
        </div>
        <Button variant="hero" onClick={loadData}>
          <RefreshCw size={18} />
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading reports...</div>
      ) : (
        <div className="space-y-8">
          {/* Category Analytics */}
          <div>
            <h2 className="font-display text-3xl mb-4 flex items-center gap-2">
              <BarChart3 size={28} />
              Category Analytics
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {analytics?.analytics?.map((cat: any) => (
                <Card key={cat.category}>
                  <CardHeader>
                    <CardTitle className="text-lg">{cat.category}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Products:</span>
                      <span className="font-medium">{cat.productCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Stock:</span>
                      <span className="font-medium">{cat.totalStock}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Avg Stock:</span>
                      <span className="font-medium">{cat.averageStock}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Value:</span>
                      <span className="font-medium">₹{cat.totalValue?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Low Stock:</span>
                      <span className="font-medium text-gray-400">{cat.lowStockCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Out of Stock:</span>
                      <span className="font-medium text-gray-500">{cat.outOfStockCount}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Top Selling Categories */}
          {analytics?.topSellingCategories && analytics.topSellingCategories.length > 0 && (
            <div>
              <h2 className="font-display text-3xl mb-4 flex items-center gap-2">
                <TrendingUp size={28} />
                Top Selling Categories
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {analytics.topSellingCategories.map((cat: any, index: number) => (
                  <Card key={cat._id}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">#{index + 1} {cat._id}</CardTitle>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{cat.totalSold} units</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Revenue: ₹{cat.totalRevenue?.toLocaleString()}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Stock Movement Report */}
          <div>
            <h2 className="font-display text-3xl mb-4 flex items-center gap-2">
              <Package size={28} />
              Stock Movement Report
            </h2>

            {/* Date Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6 bg-card border border-border p-4">
              <div className="flex-1">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <div className="flex items-end">
                <Button onClick={handleDateFilter} variant="hero">
                  Apply Filter
                </Button>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Products Sold</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stockMovement?.summary?.totalProductsSold || 0}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Units Sold</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stockMovement?.summary?.totalUnitsSold || 0}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ₹{stockMovement?.summary?.totalRevenue?.toLocaleString() || 0}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Movement Table */}
            {stockMovement?.movements && stockMovement.movements.length > 0 ? (
              <div className="bg-card border border-border overflow-hidden">
                <table className="w-full">
                  <thead className="bg-secondary">
                    <tr>
                      <th className="text-left p-4 font-medium">Product</th>
                      <th className="text-left p-4 font-medium">Category</th>
                      <th className="text-left p-4 font-medium">Units Sold</th>
                      <th className="text-left p-4 font-medium">Revenue</th>
                      <th className="text-left p-4 font-medium">Current Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stockMovement.movements.map((item: any) => (
                      <tr key={item.productId} className="border-t border-border">
                        <td className="p-4 font-medium">{item.productName}</td>
                        <td className="p-4">{item.category}</td>
                        <td className="p-4">{item.quantitySold}</td>
                        <td className="p-4">₹{item.revenue?.toLocaleString()}</td>
                        <td className="p-4">
                          <span className={item.currentStock <= 5 ? 'text-gray-500 font-bold' : ''}>
                            {item.currentStock}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 bg-card border border-border">
                <Package size={48} className="mx-auto text-muted-foreground mb-4" />
                <p className="text-lg font-medium mb-2">No Stock Movement</p>
                <p className="text-muted-foreground">No sales recorded in the selected period</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryReports;
