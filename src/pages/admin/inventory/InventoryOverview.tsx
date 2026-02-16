import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Package, AlertTriangle, DollarSign, Search, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { adminApi } from '@/lib/api';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

const InventoryOverview = () => {
  const [overview, setOverview] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [lowStockThreshold, setLowStockThreshold] = useState(10);

  const categories = ['Shiva', 'Shrooms', 'LSD', 'Chakras', 'Dark', 'Rick n Morty'];

  useEffect(() => {
    loadData();
  }, [categoryFilter, lowStockThreshold]);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await adminApi.inventory.getOverview(
        lowStockThreshold,
        categoryFilter === 'all' ? undefined : categoryFilter
      );
      setOverview(data);
    } catch (error: any) {
      toast.error('Failed to load inventory data');
      console.error('Load inventory error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = overview?.products?.filter((p: any) =>
    p.name?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-4xl mb-2">Inventory Overview</h1>
          <p className="text-muted-foreground">Track and manage your product stock</p>
        </div>
        <Button variant="hero" onClick={loadData}>
          <RefreshCw size={18} />
          Refresh
        </Button>
      </div>

      {/* Summary Cards */}
      {overview?.summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overview.summary.totalProducts}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">
                {overview.summary.lowStockCount}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">
                {overview.summary.outOfStockCount}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹{overview.summary.totalStockValue?.toLocaleString() || 0}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

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
          value={lowStockThreshold.toString()}
          onValueChange={(val) => setLowStockThreshold(parseInt(val))}
        >
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Low Stock Threshold" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">Threshold: 5</SelectItem>
            <SelectItem value="10">Threshold: 10</SelectItem>
            <SelectItem value="15">Threshold: 15</SelectItem>
            <SelectItem value="20">Threshold: 20</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Products Table */}
      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <div className="bg-card border border-border overflow-hidden">
          <table className="w-full">
            <thead className="bg-secondary">
              <tr>
                <th className="text-left p-4 font-medium">Image</th>
                <th className="text-left p-4 font-medium">Product</th>
                <th className="text-left p-4 font-medium">Category</th>
                <th className="text-left p-4 font-medium">Stock</th>
                <th className="text-left p-4 font-medium">Status</th>
                <th className="text-right p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product: any) => (
                <tr key={product._id} className="border-t border-border">
                  <td className="p-4">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-16 object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder.svg';
                        }}
                      />
                    ) : (
                      <div className="w-16 h-16 bg-secondary flex items-center justify-center text-xs text-muted-foreground">
                        No Image
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {product.sizes?.join(', ')}
                      </p>
                    </div>
                  </td>
                  <td className="p-4">{product.category}</td>
                  <td className="p-4">
                    <span className="font-medium">{product.stock}</span>
                  </td>
                  <td className="p-4">{product.stockStatus}</td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <StockUpdateDialog product={product} onUpdate={loadData} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
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

export default InventoryOverview;
