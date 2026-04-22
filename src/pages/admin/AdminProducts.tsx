import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Search, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { adminApi } from '@/lib/api';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TableSkeleton } from '@/components/ui/loader';
import { Pagination } from '@/components/ui/pagination';

// Collab options - use 'no-collab' as placeholder for empty string
const COLLAB_OPTIONS = [
  { value: 'no-collab', label: 'No Collaboration' },
  { value: 'rakt-pipasu-records', label: 'Rakt Pipasu Records' },
];

const CATEGORIES = ['Shiva', 'Shrooms', 'ACID', 'Chakras', 'Dark', 'Rick n Morty'];
const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

// ─── Product Form ────────────────────────────────────────────────────────────

const ProductForm = ({ product, onSubmit }: { product: any; onSubmit: (fd: FormData) => Promise<void> }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>(product?.category || '');
  // Use 'no-collab' as placeholder for empty/null collab
  const [selectedCollab, setSelectedCollab] = useState<string>(() => {
    if (!product) return 'no-collab';
    return product.collab && product.collab !== '' ? product.collab : 'no-collab';
  });

  // Update state when product changes (for edit mode)
  useEffect(() => {
    if (product) {
      setSelectedCategory(product.category || '');
      const collabValue = product.collab && product.collab !== '' ? product.collab : 'no-collab';
      setSelectedCollab(collabValue);
    } else {
      // Reset to defaults when creating new product
      setSelectedCategory('');
      setSelectedCollab('no-collab');
    }
  }, [product]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData(e.currentTarget);

      // Inject controlled Select values (shadcn Select doesn't write to FormData natively)
      formData.set('category', selectedCategory);
      // Convert 'no-collab' to empty string for API
      const collabValue = selectedCollab === 'no-collab' ? '' : selectedCollab;
      formData.set('collab', collabValue);

      // Normalise isFeatured checkbox
      const isFeatured = formData.get('isFeatured');
      formData.set('isFeatured', isFeatured === 'on' ? 'true' : 'false');

      // Debug logging
      console.log('📤 [FRONTEND] Submitting product form');
      console.log('📤 [FRONTEND] Selected collab:', selectedCollab);
      console.log('📤 [FRONTEND] Collab value being sent:', collabValue);
      console.log('📤 [FRONTEND] FormData contents:');
      for (let [key, value] of formData.entries()) {
        if (key === 'images') {
          console.log(`  ${key}:`, value instanceof File ? `File: ${value.name}` : value);
        } else {
          console.log(`  ${key}:`, value);
        }
      }

      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name */}
      <div>
        <Label htmlFor="name">Product Name</Label>
        <Input id="name" name="name" defaultValue={product?.name} required />
      </div>

      {/* Description */}
      <div>
        <Label htmlFor="description">Description</Label>
        <Input id="description" name="description" defaultValue={product?.description} required />
      </div>

      {/* Price + Stock */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price">Price</Label>
          <Input id="price" name="price" type="number" defaultValue={product?.price} required />
        </div>
        <div>
          <Label htmlFor="stock">Stock</Label>
          <Input id="stock" name="stock" type="number" defaultValue={product?.stock} required />
        </div>
      </div>

      {/* Category */}
      <div>
        <Label>Category</Label>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Collab */}
      <div>
        <Label>Collab (optional)</Label>
        <Select value={selectedCollab} onValueChange={setSelectedCollab}>
          <SelectTrigger>
            <SelectValue placeholder="Select collab" />
          </SelectTrigger>
          <SelectContent>
            {COLLAB_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground mt-1">
          Assign this product to a collab collection
          <span className="ml-2 text-blue-500">Current: {COLLAB_OPTIONS.find(opt => opt.value === selectedCollab)?.label}</span>
        </p>
      </div>

      {/* Sizes */}
      <div>
        <Label>Sizes</Label>
        <div className="flex gap-3 mt-2 flex-wrap">
          {SIZES.map((size) => (
            <label key={size} className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                name="sizes"
                value={size}
                defaultChecked={product?.sizes?.includes(size) ?? true}
              />
              {size}
            </label>
          ))}
        </div>
      </div>

      {/* Images */}
      <div>
        <Label htmlFor="images">Images</Label>
        {product?.images && product.images.length > 0 && (
          <div className="mb-3">
            <p className="text-sm text-muted-foreground mb-2">Current Images:</p>
            <div className="grid grid-cols-3 gap-2">
              {product.images.map((image: any, index: number) => {
                const url = typeof image === 'string' ? image : image?.url;
                return url ? (
                  <img key={index} src={url} alt={`Product ${index + 1}`}
                    className="w-full h-24 object-cover border border-border rounded"
                    onError={(e) => { e.currentTarget.src = '/placeholder.svg'; }} />
                ) : null;
              })}
            </div>
          </div>
        )}
        <Input id="images" name="images" type="file" multiple accept="image/*" />
        <p className="text-xs text-muted-foreground mt-1">
          {product ? 'Upload new images to replace existing ones' : 'Select one or more images'}
        </p>
      </div>

      {/* Featured */}
      <div className="flex items-center gap-2">
        <input type="checkbox" id="isFeatured" name="isFeatured" defaultChecked={product?.isFeatured} />
        <Label htmlFor="isFeatured">Featured Product</Label>
      </div>

      <Button type="submit" variant="hero" className="w-full" disabled={isSubmitting}>
        {isSubmitting
          ? (product ? 'Updating...' : 'Creating...')
          : (product ? 'Update Product' : 'Create Product')}
      </Button>
    </form>
  );
};

// ─── Admin Products Page ─────────────────────────────────────────────────────

const AdminProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    currentPage: 1, totalPages: 1, totalProducts: 0,
    limit: 10, hasNextPage: false, hasPrevPage: false,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [collabFilter, setCollabFilter] = useState('all'); // Collab filter - default to 'all'
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [viewingProduct, setViewingProduct] = useState<any>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<any>(null);
  const [isDeleteErrorDialogOpen, setIsDeleteErrorDialogOpen] = useState(false);
  const [formKey, setFormKey] = useState(0); // Form key for forcing remount

  useEffect(() => { loadProducts(); }, [page, collabFilter]); // Add collabFilter dependency

  const loadProducts = async () => {
    try {
      // Convert 'all' to empty string for API call
      const collabParam = collabFilter === 'all' ? '' : collabFilter;
      const data: any = await adminApi.products.getAll(page, 10, collabParam);
      setProducts(data.products || []);
      if (data.pagination) {
        setPagination(data.pagination);
      } else {
        setPagination({
          currentPage: data.currentPage || page,
          totalPages: data.totalPages || 1,
          totalProducts: data.totalProducts || 0,
          limit: data.limit || 10,
          hasNextPage: data.hasNextPage || false,
          hasPrevPage: data.hasPrevPage || false,
        });
      }
    } catch (error: any) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await adminApi.products.delete(id);
      toast.success('Product deleted');
      loadProducts();
    } catch (error: any) {
      if (error.activeOrders && error.activeOrders.length > 0) {
        setDeleteError(error);
        setIsDeleteErrorDialogOpen(true);
      } else {
        toast.error(error.message || 'Failed to delete product');
      }
    }
  };

  const handleSubmit = async (formData: FormData) => {
    try {
      if (editingProduct) {
        await adminApi.products.update(editingProduct._id, formData);
        toast.success('Product updated');
      } else {
        await adminApi.products.create(formData);
        toast.success('Product created');
      }
      setIsDialogOpen(false);
      setEditingProduct(null);
      loadProducts();
    } catch (error: any) {
      toast.error(error.message || 'Operation failed');
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="font-display text-3xl md:text-4xl mb-2">Products</h1>
          <p className="text-muted-foreground text-sm md:text-base">Manage your product catalog</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setTimeout(() => setEditingProduct(null), 100);
          }
        }}>
          <DialogTrigger asChild>
            <Button variant="hero" onClick={() => {
              setEditingProduct(null);
              setFormKey(prev => prev + 1);
              setIsDialogOpen(true);
            }} className="w-full sm:w-auto">
              <Plus size={18} /> Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
            <DialogHeader>
              <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
            </DialogHeader>
            <ProductForm 
              key={formKey} 
              product={editingProduct} 
              onSubmit={handleSubmit} 
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input placeholder="Search products..." value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
        </div>
      </div>

      {loading ? (
        <TableSkeleton rows={10} cols={7} />
      ) : (
        <>
          <div className="bg-card border border-border overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="bg-secondary">
                <tr>
                  <th className="text-left p-4 font-medium">Image</th>
                  <th className="text-left p-4 font-medium">Name</th>
                  <th className="text-left p-4 font-medium">Category</th>
                  <th className="text-left p-4 font-medium">Collab</th>
                  <th className="text-left p-4 font-medium">Price</th>
                  <th className="text-left p-4 font-medium">Stock</th>
                  <th className="text-right p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => {
                  let imageUrl: string | null = null;
                  if (product.images?.length > 0) {
                    const first = product.images[0];
                    imageUrl = typeof first === 'string' ? first : first?.url ?? null;
                  }
                  return (
                    <tr key={product._id} className="border-t border-border">
                      <td className="p-4">
                        {imageUrl ? (
                          <img src={imageUrl} alt={product.name} className="w-16 h-16 object-cover"
                            onError={(e) => { e.currentTarget.src = '/placeholder.svg'; }} />
                        ) : (
                          <div className="w-16 h-16 bg-secondary flex items-center justify-center text-xs text-muted-foreground">No Image</div>
                        )}
                      </td>
                      <td className="p-4">{product.name}</td>
                      <td className="p-4">{product.category}</td>
                      <td className="p-4">
                        {product.collab
                          ? <span className="text-xs bg-white/10 border border-white/20 px-2 py-1 rounded">{product.collab}</span>
                          : <span className="text-muted-foreground text-xs">—</span>}
                      </td>
                      <td className="p-4">₹{product.price}</td>
                      <td className="p-4">{product.stock}</td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => { setViewingProduct(product); setIsViewDialogOpen(true); }} className="h-9 w-9 p-0 lg:h-7 lg:w-7">
                            <Eye size={16} className="lg:w-3.5 lg:h-3.5" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => { setEditingProduct(product); setIsDialogOpen(true); }} className="h-9 w-9 p-0 lg:h-7 lg:w-7">
                            <Edit size={16} className="lg:w-3.5 lg:h-3.5" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDelete(product._id)} className="h-9 w-9 p-0 lg:h-7 lg:w-7">
                            <Trash2 size={16} className="lg:w-3.5 lg:h-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={pagination.currentPage} totalPages={pagination.totalPages}
            onPageChange={setPage} hasNextPage={pagination.hasNextPage}
            hasPrevPage={pagination.hasPrevPage} totalItems={pagination.totalProducts}
            itemsPerPage={pagination.limit}
          />
        </>
      )}

      {/* Delete Error Dialog */}
      <Dialog open={isDeleteErrorDialogOpen} onOpenChange={setIsDeleteErrorDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
          <DialogHeader>
            <DialogTitle className="text-destructive">Cannot Delete Product</DialogTitle>
          </DialogHeader>
          {deleteError && (
            <div className="space-y-4">
              <div className="bg-destructive/10 border border-destructive/20 p-4 rounded">
                <p className="text-sm font-medium mb-2">{deleteError.message}</p>
                {deleteError.hint && <p className="text-xs text-muted-foreground">{deleteError.hint}</p>}
              </div>
              <div>
                <h3 className="font-medium mb-3">Active Orders ({deleteError.activeOrders?.length})</h3>
                <div className="space-y-3">
                  {deleteError.activeOrders?.map((order: any, index: number) => (
                    <div key={order.orderId} className="bg-card border border-border p-4 rounded space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Order #{index + 1}</p>
                          <p className="text-xs font-mono text-muted-foreground">ID: {order.orderId}</p>
                        </div>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                          order.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                          : order.status === 'Processing' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                          : order.status === 'Shipped' ? 'bg-purple-500/10 text-purple-500 border-purple-500/20'
                          : order.status === 'Out for Delivery' ? 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20'
                          : 'bg-gray-500/10 text-gray-500 border-gray-500/20'}`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">Created: {new Date(order.createdAt).toLocaleString()}</div>
                      <Button variant="outline" size="sm" className="w-full mt-2"
                        onClick={() => { setIsDeleteErrorDialogOpen(false); window.open(`/admin/orders/${order.orderId}`, '_blank'); }}>
                        View Order Details
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsDeleteErrorDialogOpen(false)} className="flex-1">Close</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* View Product Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto mx-4">
          <DialogHeader>
            <DialogTitle>Product Details</DialogTitle>
          </DialogHeader>
          {viewingProduct && (
            <div className="space-y-6">
              {viewingProduct.images?.length > 0 && (
                <div>
                  <h3 className="font-medium mb-3">Product Images</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {viewingProduct.images.map((image: any, index: number) => {
                      const url = typeof image === 'string' ? image : image?.url;
                      return url ? (
                        <img key={index} src={url} alt={`${viewingProduct.name} - ${index + 1}`}
                          className="w-full h-48 object-cover border border-border"
                          onError={(e) => { e.currentTarget.src = '/placeholder.svg'; }} />
                      ) : null;
                    })}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-sm text-muted-foreground">Product Name</p><p className="font-medium">{viewingProduct.name}</p></div>
                <div><p className="text-sm text-muted-foreground">Category</p><p className="font-medium">{viewingProduct.category}</p></div>
                <div><p className="text-sm text-muted-foreground">Price</p><p className="font-display text-xl">₹{viewingProduct.price}</p></div>
                <div><p className="text-sm text-muted-foreground">Stock</p><p className="font-medium">{viewingProduct.stock} units</p></div>
                <div>
                  <p className="text-sm text-muted-foreground">Available Sizes</p>
                  <div className="flex gap-2 mt-1 flex-wrap">
                    {viewingProduct.sizes?.map((size: string) => (
                      <span key={size} className="px-3 py-1 border border-border text-sm">{size}</span>
                    ))}
                  </div>
                </div>
                <div><p className="text-sm text-muted-foreground">Featured</p><p className="font-medium">{viewingProduct.isFeatured ? 'Yes' : 'No'}</p></div>
                <div><p className="text-sm text-muted-foreground">Collab</p><p className="font-medium">{viewingProduct.collab || '—'}</p></div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Description</p>
                <p className="text-sm leading-relaxed">{viewingProduct.description || 'No description available'}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Product ID</p>
                <p className="font-mono text-sm">{viewingProduct._id}</p>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => { setIsViewDialogOpen(false); setEditingProduct(viewingProduct); setIsDialogOpen(true); }}>
                  <Edit size={16} className="mr-2" /> Edit Product
                </Button>
                <Button variant="outline" className="text-destructive hover:text-destructive"
                  onClick={() => { setIsViewDialogOpen(false); handleDelete(viewingProduct._id); }}>
                  <Trash2 size={16} className="mr-2" /> Delete Product
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProducts;
