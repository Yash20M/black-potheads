import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
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

const AdminProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [viewingProduct, setViewingProduct] = useState<any>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  useEffect(() => {
    loadProducts();
  }, [page]);

  const loadProducts = async () => {
    try {
      const data: any = await adminApi.products.getAll(page, 10);
      console.log('Products API Response:', data); // Debug log
      console.log('First product images:', data.products?.[0]?.images); // Debug log
      setProducts(data.products || []);
      setTotalPages(data.totalPages || 1);
    } catch (error: any) {
      toast.error('Failed to load products');
      console.error('Load products error:', error);
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
      toast.error('Failed to delete product');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // Convert checkbox value to boolean
    const isFeaturedValue = formData.get('isFeatured');
    if (isFeaturedValue === 'on') {
      formData.set('isFeatured', 'true');
    } else if (!isFeaturedValue) {
      formData.set('isFeatured', 'false');
    }

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

  const viewProductDetails = (product: any) => {
    setViewingProduct(product);
    setIsViewDialogOpen(true);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="font-display text-3xl md:text-4xl mb-2">Products</h1>
          <p className="text-muted-foreground text-sm md:text-base">Manage your product catalog</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="hero" onClick={() => setEditingProduct(null)} className="w-full sm:w-auto">
              <Plus size={18} />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </DialogTitle>
            </DialogHeader>
            <ProductForm
              product={editingProduct}
              onSubmit={handleSubmit}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {loading ? (
        <TableSkeleton rows={10} cols={6} />
      ) : (
        <>
          <div className="bg-card border border-border overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-secondary">
                <tr>
                  <th className="text-left p-4 font-medium">Image</th>
                  <th className="text-left p-4 font-medium">Name</th>
                  <th className="text-left p-4 font-medium">Category</th>
                  <th className="text-left p-4 font-medium">Price</th>
                  <th className="text-left p-4 font-medium">Stock</th>
                  <th className="text-right p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product._id} className="border-t border-border">
                    <td className="p-4">
                      {(() => {
                        // Handle different image formats
                        let imageUrl = null;
                        
                        if (product.images && product.images.length > 0) {
                          const firstImage = product.images[0];
                          // Check if it's a string URL
                          if (typeof firstImage === 'string') {
                            imageUrl = firstImage;
                          }
                          // Check if it's an object with url property
                          else if (firstImage && typeof firstImage === 'object' && firstImage.url) {
                            imageUrl = firstImage.url;
                          }
                        }

                        console.log('Product:', product.name, 'Image URL:', imageUrl); // Debug

                        return imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={product.name}
                            className="w-16 h-16 object-cover"
                            onError={(e) => {
                              console.error('Image load error for:', imageUrl);
                              e.currentTarget.src = '/placeholder.svg';
                            }}
                          />
                        ) : (
                          <div className="w-16 h-16 bg-secondary flex items-center justify-center text-xs text-muted-foreground">
                            No Image
                          </div>
                        );
                      })()}
                    </td>
                    <td className="p-4">{product.name}</td>
                    <td className="p-4">{product.category}</td>
                    <td className="p-4">₹{product.price}</td>
                    <td className="p-4">{product.stock}</td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => viewProductDetails(product)}
                        >
                          <Eye size={16} />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingProduct(product);
                            setIsDialogOpen(true);
                          }}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(product._id)}
                        >
                          <Trash2 size={16} />
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

      {/* View Product Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto mx-4">
          <DialogHeader>
            <DialogTitle>Product Details</DialogTitle>
          </DialogHeader>
          {viewingProduct && (
            <div className="space-y-6">
              {/* Product Images */}
              {viewingProduct.images && viewingProduct.images.length > 0 && (
                <div>
                  <h3 className="font-medium mb-3">Product Images</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {viewingProduct.images.map((image: any, index: number) => {
                      // Handle both string URLs and objects with url property
                      const imageUrl = typeof image === 'string' ? image : image?.url;
                      
                      return imageUrl ? (
                        <img
                          key={index}
                          src={imageUrl}
                          alt={`${viewingProduct.name} - ${index + 1}`}
                          className="w-full h-48 object-cover border border-border"
                          onError={(e) => {
                            console.error('Image load error:', imageUrl);
                            e.currentTarget.src = '/placeholder.svg';
                          }}
                        />
                      ) : null;
                    })}
                  </div>
                </div>
              )}

              {/* Product Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Product Name</p>
                  <p className="font-medium">{viewingProduct.name}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-medium">{viewingProduct.category}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="font-display text-xl">₹{viewingProduct.price}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Stock</p>
                  <p className="font-medium">{viewingProduct.stock} units</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Available Sizes</p>
                  <div className="flex gap-2 mt-1">
                    {viewingProduct.sizes?.map((size: string) => (
                      <span
                        key={size}
                        className="px-3 py-1 border border-border text-sm"
                      >
                        {size}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Featured</p>
                  <p className="font-medium">
                    {viewingProduct.isFeatured ? 'Yes' : 'No'}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div>
                <p className="text-sm text-muted-foreground mb-2">Description</p>
                <p className="text-sm leading-relaxed">
                  {viewingProduct.description || 'No description available'}
                </p>
              </div>

              {/* Product ID */}
              <div>
                <p className="text-sm text-muted-foreground">Product ID</p>
                <p className="font-mono text-sm">{viewingProduct._id}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsViewDialogOpen(false);
                    setEditingProduct(viewingProduct);
                    setIsDialogOpen(true);
                  }}
                >
                  <Edit size={16} className="mr-2" />
                  Edit Product
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsViewDialogOpen(false);
                    handleDelete(viewingProduct._id);
                  }}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 size={16} className="mr-2" />
                  Delete Product
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const ProductForm = ({ product, onSubmit }: any) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const categories = ['Shiva', 'Shrooms', 'LSD', 'Chakras', 'Dark', 'Rick n Morty'];
  const sizes = ['S', 'M', 'L', 'XL'];

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Product Name</Label>
        <Input
          id="name"
          name="name"
          defaultValue={product?.name}
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          name="description"
          defaultValue={product?.description}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            name="price"
            type="number"
            defaultValue={product?.price}
            required
          />
        </div>

        <div>
          <Label htmlFor="stock">Stock</Label>
          <Input
            id="stock"
            name="stock"
            type="number"
            defaultValue={product?.stock}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="category">Category</Label>
        <Select name="category" defaultValue={product?.category}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Sizes</Label>
        <div className="flex gap-2 mt-2">
          {sizes.map((size) => (
            <label key={size} className="flex items-center gap-2">
              <input
                type="checkbox"
                name="sizes"
                value={size}
                defaultChecked={product?.sizes?.includes(size)}
              />
              {size}
            </label>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="images">Images</Label>
        
        {/* Show existing images when editing */}
        {product?.images && product.images.length > 0 && (
          <div className="mb-3">
            <p className="text-sm text-muted-foreground mb-2">Current Images:</p>
            <div className="grid grid-cols-3 gap-2">
              {product.images.map((image: any, index: number) => {
                const imageUrl = typeof image === 'string' ? image : image?.url;
                return imageUrl ? (
                  <img
                    key={index}
                    src={imageUrl}
                    alt={`Product ${index + 1}`}
                    className="w-full h-24 object-cover border border-border rounded"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.svg';
                    }}
                  />
                ) : null;
              })}
            </div>
          </div>
        )}
        
        <Input
          id="images"
          name="images"
          type="file"
          multiple
          accept="image/*"
        />
        <p className="text-xs text-muted-foreground mt-1">
          {product ? 'Upload new images to replace existing ones' : 'Select one or more images'}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isFeatured"
          name="isFeatured"
          defaultChecked={product?.isFeatured}
        />
        <Label htmlFor="isFeatured">Featured Product</Label>
      </div>

      <Button type="submit" variant="hero" className="w-full" disabled={isSubmitting}>
        {isSubmitting 
          ? (product ? 'Updating...' : 'Creating...') 
          : (product ? 'Update Product' : 'Create Product')
        }
      </Button>
    </form>
  );
};

export default AdminProducts;
