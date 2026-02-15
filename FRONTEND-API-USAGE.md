# Frontend API Usage Guide

## Quick Reference for Using Backend APIs

### Import Required Modules
```typescript
import { productApi } from '@/lib/api';
import { Product, normalizeProduct, ApiProduct } from '@/types/product';
import { toast } from 'sonner';
```

### Fetch Featured Products
```typescript
const loadFeaturedProducts = async () => {
  try {
    const data: any = await productApi.getFeatured(10); // limit
    const products = data.products.map((p: ApiProduct) => normalizeProduct(p));
    setProducts(products);
  } catch (error: any) {
    toast.error('Failed to load products');
    console.error(error);
  }
};
```

### Fetch Products by Category
```typescript
const loadCategoryProducts = async (category: string) => {
  try {
    const data: any = await productApi.getByCategory(category, 1, 20); // page, limit
    const products = data.products.map((p: ApiProduct) => normalizeProduct(p));
    setProducts(products);
  } catch (error: any) {
    toast.error('Failed to load products');
    console.error(error);
  }
};
```

### Fetch Single Product
```typescript
const loadProduct = async (id: string) => {
  try {
    const data: any = await productApi.getById(id);
    const product = normalizeProduct(data.product);
    setProduct(product);
  } catch (error: any) {
    toast.error('Product not found');
    console.error(error);
  }
};
```

### Valid Categories
```typescript
const categories = [
  'Shiva',
  'Shrooms',
  'LSD',
  'Chakras',
  'Dark',
  'Rick n Morty'
];
```

### Product Type Structure

#### API Response (from backend)
```typescript
{
  _id: "product_id",
  name: "Product Name",
  price: 799,
  category: "Shiva",
  images: ["url1", "url2"] or [{url: "url1"}, {url: "url2"}],
  sizes: ["S", "M", "L", "XL"],
  description: "Product description",
  stock: 50,
  isFeatured: true
}
```

#### Frontend Product (after normalization)
```typescript
{
  id: "product_id",
  name: "Product Name",
  price: 799,
  category: "Shiva",
  image: "url1", // First image
  images: ["url1", "url2"], // All images
  sizes: ["S", "M", "L", "XL"],
  description: "Product description",
  isNew: true, // Mapped from isFeatured
}
```

### Image Handling
```typescript
// Display primary image
<img src={product.image} alt={product.name} />

// Display all images (gallery)
{product.images.map((img, idx) => (
  <img key={idx} src={img} alt={`${product.name} ${idx + 1}`} />
))}
```

### Loading States Pattern
```typescript
const [products, setProducts] = useState<Product[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  loadProducts();
}, []);

const loadProducts = async () => {
  setLoading(true);
  try {
    // API call here
  } catch (error) {
    // Error handling
  } finally {
    setLoading(false);
  }
};

// In JSX
{loading ? (
  <div>Loading...</div>
) : products.length === 0 ? (
  <div>No products found</div>
) : (
  products.map(product => <ProductCard key={product.id} product={product} />)
)}
```

### Error Handling Pattern
```typescript
try {
  const data = await productApi.getFeatured(10);
  // Success handling
} catch (error: any) {
  toast.error(error.message || 'Failed to load products');
  console.error('API Error:', error);
}
```

### Complete Example Component
```typescript
import { useState, useEffect } from 'react';
import { productApi } from '@/lib/api';
import { Product, normalizeProduct, ApiProduct } from '@/types/product';
import { toast } from 'sonner';
import { ProductCard } from '@/components/products/ProductCard';

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data: any = await productApi.getFeatured(10);
      const normalized = data.products.map((p: ApiProduct) => normalizeProduct(p));
      setProducts(normalized);
    } catch (error: any) {
      toast.error('Failed to load products');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading ? (
        <div>Loading products...</div>
      ) : products.length === 0 ? (
        <div>No products available</div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
```

## Other Available APIs

### User APIs
```typescript
import { userApi } from '@/lib/api';

// Get profile
const profile = await userApi.getProfile();

// Update profile
await userApi.updateProfile({ name: "New Name", email: "new@email.com" });
```

### Cart APIs
```typescript
import { cartApi } from '@/lib/api';

// Add to cart
await cartApi.add({ productId: "id", quantity: 2, size: "L" });

// Get cart
const cart = await cartApi.get();

// Update quantity
await cartApi.update({ productId: "id", quantity: 3 });

// Remove item
await cartApi.remove("productId");

// Clear cart
await cartApi.clear();
```

### Order APIs
```typescript
import { orderApi } from '@/lib/api';

// Create order
await orderApi.create({
  totalAmount: 1598,
  address: { line1: "123 St", city: "Mumbai", state: "MH", pincode: "400001", country: "India" },
  paymentMethod: "COD"
});

// Get orders
const orders = await orderApi.getAll(1, 10); // page, limit

// Get order by ID
const order = await orderApi.getById("orderId");
```

### Wishlist APIs
```typescript
import { wishlistApi } from '@/lib/api';

// Add to wishlist (toggle)
await wishlistApi.add("productId");

// Get wishlist
const wishlist = await wishlistApi.get();

// Get wishlist by category
const categoryWishlist = await wishlistApi.get("Shiva");

// Remove from wishlist
await wishlistApi.remove("productId");
```

## Authentication Required
Most APIs require authentication. The token is automatically included from localStorage by the `apiFetch` wrapper in `src/lib/api.ts`.

## Error Responses
All API errors are thrown as `ApiError` with:
- `status`: HTTP status code
- `message`: Error message from backend

Handle them in try-catch blocks and show user-friendly messages with toast notifications.
