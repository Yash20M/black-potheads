# Wishlist Quick Reference

## Import Wishlist Store

```typescript
import { useWishlistStore } from '@/store/wishlistStore';
```

## Store Methods

```typescript
const {
  wishlistIds,           // Set<string> - All wishlist product IDs
  addToWishlist,         // (productId: string) => void
  removeFromWishlist,    // (productId: string) => void
  isInWishlist,          // (productId: string) => boolean
  clearWishlist,         // () => void
} = useWishlistStore();
```

## Common Patterns

### Check if Product is in Wishlist
```typescript
const { isInWishlist } = useWishlistStore();
const inWishlist = isInWishlist(product.id);
```

### Get Wishlist Count
```typescript
const { wishlistIds } = useWishlistStore();
const count = wishlistIds.size;
```

### Toggle Wishlist with API
```typescript
import { wishlistApi } from '@/lib/api';
import { useWishlistStore } from '@/store/wishlistStore';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';

const { user } = useAuthStore();
const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlistStore();
const inWishlist = isInWishlist(product.id);

const handleToggleWishlist = async () => {
  if (!user) {
    toast.error('Please login to add items to wishlist');
    return;
  }

  try {
    await wishlistApi.add(product.id); // Toggle on backend
    
    if (inWishlist) {
      removeFromWishlist(product.id);
      toast.success('Removed from wishlist');
    } else {
      addToWishlist(product.id);
      toast.success('Added to wishlist');
    }
  } catch (error: any) {
    toast.error(error.message || 'Failed to update wishlist');
  }
};
```

### Load Wishlist from API
```typescript
import { wishlistApi } from '@/lib/api';
import { Product, normalizeProduct, ApiProduct } from '@/types/product';

const [products, setProducts] = useState<Product[]>([]);
const [loading, setLoading] = useState(true);

const loadWishlist = async () => {
  setLoading(true);
  try {
    const data: any = await wishlistApi.get(); // All categories
    // OR
    const data: any = await wishlistApi.get('Shiva'); // Specific category
    
    const normalized = data.products.map((p: ApiProduct) => normalizeProduct(p));
    setProducts(normalized);
  } catch (error: any) {
    toast.error('Failed to load wishlist');
  } finally {
    setLoading(false);
  }
};
```

### Remove from Wishlist
```typescript
const handleRemove = async (productId: string) => {
  try {
    await wishlistApi.remove(productId);
    removeFromWishlist(productId);
    toast.success('Removed from wishlist');
  } catch (error: any) {
    toast.error('Failed to remove from wishlist');
  }
};
```

## Wishlist Heart Button Component

```typescript
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

<motion.button
  whileHover={{ scale: 1.1 }}
  whileTap={{ scale: 0.9 }}
  onClick={handleToggleWishlist}
  disabled={isTogglingWishlist}
  className={cn(
    'w-12 h-12 border-2 flex items-center justify-center transition-colors',
    inWishlist
      ? 'bg-primary border-primary text-primary-foreground'
      : 'border-foreground bg-transparent hover:bg-foreground hover:text-background'
  )}
  aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
>
  <Heart size={18} className={inWishlist ? 'fill-current' : ''} />
</motion.button>
```

## Wishlist Badge in Navbar

```typescript
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWishlistStore } from '@/store/wishlistStore';

const { wishlistIds } = useWishlistStore();
const wishlistCount = wishlistIds.size;

<Link to="/wishlist">
  <motion.button
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    className="p-2 hover:text-primary transition-colors relative"
    aria-label="Wishlist"
  >
    <Heart size={20} />
    {wishlistCount > 0 && (
      <motion.span
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold"
      >
        {wishlistCount}
      </motion.span>
    )}
  </motion.button>
</Link>
```

## API Endpoints

### Add/Remove (Toggle)
```typescript
// POST /api/v1/wishlist/add
await wishlistApi.add(productId);
```

### Get All Wishlist Items
```typescript
// GET /api/v1/wishlist/get
await wishlistApi.get();
```

### Get Wishlist by Category
```typescript
// GET /api/v1/wishlist/get?category=Shiva
await wishlistApi.get('Shiva');
```

### Remove from Wishlist
```typescript
// DELETE /api/v1/wishlist/remove/:productId
await wishlistApi.remove(productId);
```

## Protected Route Pattern

```typescript
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

const WishlistPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return (
    // Page content
  );
};
```

## Empty State Component

```typescript
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();

<div className="text-center py-20">
  <Heart size={64} className="mx-auto text-muted-foreground mb-6" />
  <h2 className="font-display text-3xl mb-4">Your Wishlist is Empty</h2>
  <p className="text-muted-foreground mb-8 max-w-md mx-auto">
    Start adding products you love to your wishlist.
  </p>
  <Button variant="hero" size="lg" onClick={() => navigate('/shop')}>
    Start Shopping
  </Button>
</div>
```

## Loading State

```typescript
{loading ? (
  <div className="text-center py-20">
    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    <p className="text-muted-foreground mt-4">Loading your wishlist...</p>
  </div>
) : (
  // Content
)}
```

## Category Filter

```typescript
const categories = ['all', 'Shiva', 'Shrooms', 'LSD', 'Chakras', 'Dark', 'Rick n Morty'];
const [activeCategory, setActiveCategory] = useState('all');

<div className="flex flex-wrap gap-3">
  {categories.map((category) => (
    <button
      key={category}
      onClick={() => setActiveCategory(category)}
      className={cn(
        'px-6 py-3 text-sm uppercase tracking-wider border',
        activeCategory === category
          ? 'bg-foreground text-background border-foreground'
          : 'bg-transparent border-border hover:border-foreground'
      )}
    >
      {category}
    </button>
  ))}
</div>
```

## Bulk Actions

```typescript
import { useCartStore } from '@/store/cartStore';

const { addItem, openCart } = useCartStore();

const handleAddAllToCart = () => {
  products.forEach(product => {
    addItem(product, product.sizes[0]);
  });
  openCart();
  toast.success(`Added ${products.length} items to cart`);
};

<Button onClick={handleAddAllToCart}>
  Add All to Cart
</Button>
```

## TypeScript Types

```typescript
// Wishlist Store State
interface WishlistState {
  wishlistIds: Set<string>;
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

// API Response
interface WishlistResponse {
  _id: string;
  userId: string;
  products: ApiProduct[];
  cartCount: number;
}
```

## Common Issues & Solutions

### Issue: Wishlist not persisting
**Solution**: Check localStorage is enabled and not full

### Issue: Badge not updating
**Solution**: Ensure you're using the store methods (addToWishlist/removeFromWishlist)

### Issue: 401 Unauthorized
**Solution**: User must be logged in, check token in localStorage

### Issue: Heart not filling
**Solution**: Check `isInWishlist(product.id)` is being called correctly

### Issue: Duplicate items
**Solution**: API handles duplicates, but check you're using product.id consistently

## Best Practices

1. Always check authentication before wishlist operations
2. Show loading states during API calls
3. Provide user feedback with toast notifications
4. Use optimistic UI updates for better UX
5. Handle errors gracefully
6. Keep wishlist synced with backend
7. Clear wishlist on logout if needed
8. Use consistent product IDs across app
9. Debounce rapid wishlist toggles
10. Test with empty, small, and large wishlists

## Performance Tips

1. Use Set for O(1) lookups
2. Memoize expensive computations
3. Lazy load wishlist page
4. Paginate large wishlists
5. Cache API responses
6. Optimize images
7. Use virtual scrolling for large lists
8. Debounce API calls
9. Batch operations when possible
10. Use React.memo for product cards
