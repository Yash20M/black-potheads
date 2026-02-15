# API Integration Guide

## Overview

This frontend application is now fully integrated with the backend API. All API endpoints from the documentation have been implemented.

## Setup

1. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your backend URL:
   ```
   VITE_API_BASE_URL=http://localhost:3000
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

## Features Implemented

### User Features
- ✅ User Registration & Login
- ✅ User Profile Management
- ✅ Product Browsing (by category, featured)
- ✅ Shopping Cart (add, update, remove, clear)
- ✅ Wishlist Management
- ✅ Order Creation & Management
- ✅ QR Code Payment Display

### Admin Panel
- ✅ Admin Login (separate from user login)
- ✅ Dashboard with Order Statistics
- ✅ Product Management (CRUD operations)
- ✅ Order Management (view, filter, update status, delete)
- ✅ QR Code Upload & Management

## Routes

### Public Routes
- `/` - Home page
- `/shop` - Shop page
- `/collections` - Collections page
- `/product/:id` - Product detail page
- `/about` - About page
- `/contact` - Contact page
- `/login` - User login
- `/register` - User registration

### Admin Routes
- `/admin/login` - Admin login
- `/admin/dashboard` - Admin dashboard
- `/admin/products` - Product management
- `/admin/orders` - Order management
- `/admin/qr` - QR code management

## API Integration

### Authentication
The app uses JWT tokens stored in localStorage:
- User token: `token`
- Admin token: `admin_token`

### API Client (`src/lib/api.ts`)
All API calls are centralized in this file with the following structure:

```typescript
// User APIs
authApi.login(data)
authApi.register(data)
userApi.getProfile()
userApi.updateProfile(data)

// Product APIs
productApi.getByCategory(category, page, limit)
productApi.getFeatured(limit)
productApi.getById(id)

// Cart APIs
cartApi.add(data)
cartApi.get()
cartApi.update(data)
cartApi.remove(productId)
cartApi.clear()

// Wishlist APIs
wishlistApi.add(productId)
wishlistApi.get(category?)
wishlistApi.remove(productId)

// Order APIs
orderApi.create(data)
orderApi.getAll(page, limit)
orderApi.getById(id)
orderApi.update(id, data)
orderApi.delete(id)

// Admin APIs
adminApi.login(data)
adminApi.products.create(formData)
adminApi.products.getAll(page, limit)
adminApi.products.update(id, formData)
adminApi.products.delete(id)
adminApi.orders.getAll(params)
adminApi.orders.getById(id)
adminApi.orders.updateStatus(id, status)
adminApi.orders.delete(id)
adminApi.orders.getStatistics()
adminApi.qr.upload(formData)
```

### State Management

#### Auth Store (`src/store/authStore.ts`)
Manages user authentication state:
- User information
- JWT tokens
- Login/logout functionality
- Admin authentication

#### Cart Store (`src/store/cartStore.ts`)
Manages shopping cart state (local storage):
- Cart items
- Add/remove/update items
- Cart drawer visibility
- Total calculations

## Admin Panel Usage

### Login
1. Navigate to `/admin/login`
2. Enter admin credentials
3. Access admin dashboard

### Product Management
- View all products with pagination
- Search products by name
- Create new products with images
- Edit existing products
- Delete products
- Categories: Shiva, Shrooms, LSD, Chakras, Dark, Rick n Morty
- Sizes: S, M, L, XL

### Order Management
- View all orders with pagination
- Filter by status (Pending, Processing, Shipped, etc.)
- Filter by category
- Search by customer name/email
- Update order status
- View detailed order information
- Delete orders

### QR Code Management
- Upload payment QR code
- View current QR code
- QR code is displayed to customers during checkout

## API Categories

Valid product categories (case-sensitive):
- Shiva
- Shrooms
- LSD
- Chakras
- Dark
- Rick n Morty

## Order Statuses

Valid order statuses:
- Pending
- Processing
- Shipped
- Out for Delivery
- Delivered
- Cancelled

## Error Handling

All API calls include error handling with toast notifications:
- Success messages for successful operations
- Error messages for failed operations
- Loading states during API calls

## Security

- JWT tokens are stored in localStorage
- Admin routes are protected with authentication checks
- Separate token management for users and admins
- API errors are properly handled and displayed

## Testing

To test the integration:

1. **Start Backend Server**
   ```bash
   # In your backend directory
   npm start
   ```

2. **Start Frontend**
   ```bash
   npm run dev
   ```

3. **Test User Flow**
   - Register a new user
   - Login
   - Browse products
   - Add items to cart
   - Create an order

4. **Test Admin Flow**
   - Login as admin at `/admin/login`
   - Create products
   - Manage orders
   - Upload QR code

## Notes

- The frontend currently uses mock product data from `src/data/products.ts`
- To use real API data, update components to fetch from the API instead
- Image uploads use FormData for multipart/form-data requests
- All API responses follow the format: `{ success: boolean, message: string, data: any }`

## Next Steps

1. Replace mock product data with API calls
2. Implement real-time order updates
3. Add user profile page
4. Implement wishlist UI
5. Add order history page for users
6. Implement payment gateway integration
7. Add email notifications
8. Implement search functionality

## Support

For API documentation, refer to:
- `API-DOCUMENTATION.md` - Complete API reference
- `API-CURL-QUICK-REFERENCE.md` - Quick cURL examples
- `POSTMAN-COLLECTION-GUIDE.md` - Postman setup guide
