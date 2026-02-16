import { useState } from 'react';
import { Download, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { adminApi } from '@/lib/api';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const InventoryReports = () => {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const generateReport = async () => {
    try {
      setLoading(true);
      const data = await adminApi.inventory.getStockMovement(
        startDate || undefined,
        endDate || undefined
      );
      setReport(data);
      toast.success('Report generated successfully');
    } catch (error) {
      toast.error('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-4xl mb-2">Inventory Reports</h1>
        <p className="text-muted-foreground">Generate detailed stock movement and sales reports</p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 size={20} />
              Stock Movement Report
            </CardTitle>
            <CardDescription>
              Generate detailed reports on stock movement and sales
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
            <Button onClick={generateReport} disabled={loading} variant="hero">
              <Download size={16} className="mr-2" />
              {loading ? 'Generating...' : 'Generate Report'}
            </Button>
          </CardContent>
        </Card>

        {report && report.stockMovement && (
          <Card>
            <CardHeader>
              <CardTitle>Report Results</CardTitle>
              {report.dateRange && (
                <CardDescription>
                  {new Date(report.dateRange.startDate).toLocaleDateString()} -{' '}
                  {new Date(report.dateRange.endDate).toLocaleDateString()}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-secondary">
                    <tr>
                      <th className="text-left p-3 font-medium">Product</th>
                      <th className="text-left p-3 font-medium">Category</th>
                      <th className="text-right p-3 font-medium">Current Stock</th>
                      <th className="text-right p-3 font-medium">Qty Sold</th>
                      <th className="text-right p-3 font-medium">Revenue</th>
                      <th className="text-right p-3 font-medium">Orders</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.stockMovement.map((item: any) => (
                      <tr key={item.productId} className="border-t border-border">
                        <td className="p-3">{item.productName}</td>
                        <td className="p-3">{item.category}</td>
                        <td className="p-3 text-right">{item.currentStock}</td>
                        <td className="p-3 text-right">{item.totalQuantitySold}</td>
                        <td className="p-3 text-right">₹{item.totalRevenue.toLocaleString()}</td>
                        <td className="p-3 text-right">{item.orderCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default InventoryReports;
