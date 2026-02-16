import { useEffect, useState } from 'react';
import { AlertTriangle, Package, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { adminApi } from '@/lib/api';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const InventoryAlerts = () => {
  const [lowStock, setLowStock] = useState<any[]>([]);
  const [outOfStock, setOutOfStock] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      setLoading(true);
      const [lowStockData, outOfStockData]: [any, any] = await Promise.all([
        adminApi.inventory.getLowStock(10, 1, 50),
        adminApi.inventory.getOutOfStock(1, 50),
      ]);
      setLowStock(lowStockData.products || []);
      setOutOfStock(outOfStockData.products || []);
    } catch (error) {
      toast.error('Failed to load alerts');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading alerts...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-4xl mb-2">Inventory Alerts</h1>
          <p className="text-muted-foreground">Monitor low stock and out of stock products</p>
        </div>
        <Button variant="hero" onClick={loadAlerts}>
          <RefreshCw size={18} />
          Refresh
        </Button>
      </div>

      <div className="space-y-6">
        {/* Out of Stock Alert */}
        {outOfStock.length > 0 && (
          <Card className="border-red-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-500">
                <AlertTriangle size={20} />
                Critical: Out of Stock ({outOfStock.length})
              </CardTitle>
              <CardDescription>These products need immediate restocking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {outOfStock.map((product: any) => (
                  <div
                    key={product._id}
                    className="flex items-center justify-between p-3 bg-secondary rounded-md"
                  >
                    <div className="flex items-center gap-3">
                      {product.image && (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      )}
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.category}</p>
                      </div>
                    </div>
                    <StockUpdateDialog product={product} onUpdate={loadAlerts} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Low Stock Alert */}
        {lowStock.length > 0 && (
          <Card className="border-orange-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-500">
                <AlertTriangle size={20} />
                Warning: Low Stock ({lowStock.length})
              </CardTitle>
              <CardDescription>
                These products are running low and need restocking soon
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {lowStock.map((product: any) => (
                  <div
                    key={product._id}
                    className="flex items-center justify-between p-3 bg-secondary rounded-md"
                  >
                    <div className="flex items-center gap-3">
                      {product.image && (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      )}
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {product.category} • {product.stock}
                        </p>
                      </div>
                    </div>
                    <StockUpdateDialog product={product} onUpdate={loadAlerts} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {outOfStock.length === 0 && lowStock.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">All products are well stocked!</p>
              <p className="text-sm text-muted-foreground">No alerts at this time</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

// Stock Update Dialog Component
const StockUpdateDialog = ({ product, onUpdate }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [stock, setStock] = useState('');
  const [operation, setOperation] = useState<'set' | 'add' | 'subtract'>('set');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stock || parseInt(stock) < 0) {
      toast.error('Please enter a valid stock quantity');
      return;
    }

    try {
      setLoading(true);
      const result: any = await adminApi.inventory.updateStock(
        product._id,
        parseInt(stock),
        operation
      );

      if (result.success) {
        toast.success(`Stock updated to ${result.product.currentStock}`);
        setIsOpen(false);
        setStock('');
        onUpdate();
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to update stock');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <RefreshCw size={16} />
          Update Stock
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Stock - {product.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Current Stock</Label>
            <p className="text-2xl font-bold mt-1">{product.stock}</p>
          </div>

          <div>
            <Label htmlFor="operation">Operation</Label>
            <Select value={operation} onValueChange={(val: any) => setOperation(val)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="set">Set to exact value</SelectItem>
                <SelectItem value="add">Add to current stock</SelectItem>
                <SelectItem value="subtract">Subtract from current stock</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="stock">Quantity</Label>
            <Input
              id="stock"
              type="number"
              min="0"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="Enter quantity"
              required
            />
          </div>

          {stock && (
            <div className="p-3 bg-secondary rounded-md">
              <p className="text-sm text-muted-foreground">New stock will be:</p>
              <p className="text-xl font-bold">
                {operation === 'set'
                  ? parseInt(stock)
                  : operation === 'add'
                  ? product.stock + parseInt(stock)
                  : Math.max(0, product.stock - parseInt(stock))}
              </p>
            </div>
          )}

          <Button type="submit" variant="hero" className="w-full" disabled={loading}>
            {loading ? 'Updating...' : 'Update Stock'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InventoryAlerts;
