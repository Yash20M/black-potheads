# Admin Panel Guide

## Overview

The Black Potheads admin panel provides a comprehensive interface for managing products, orders, and payment QR codes.

## Access

**URL:** `/admin/login`

**Default Credentials:** (Set these up in your backend)
```
Email: admin@example.com
Password: admin123
```

## Features

### 1. Dashboard (`/admin/dashboard`)

The dashboard provides an overview of your store's performance:

- **Total Orders** - Total number of orders placed
- **Pending Orders** - Orders awaiting processing
- **Delivered Orders** - Successfully delivered orders
- **Processing Orders** - Orders currently being processed

**Order Status Breakdown:**
- Visual breakdown of all order statuses
- Real-time statistics
- Quick insights into order flow

### 2. Product Management (`/admin/products`)

#### View Products
- Paginated product list (10 per page)
- Search functionality by product name
- Product details: Image, Name, Category, Price, Stock
- Quick actions: Edit, Delete

#### Add New Product
Click "Add Product" button to open the form:

**Required Fields:**
- **Name** - Product name
- **Description** - Product description
- **Price** - Product price (number)
- **Stock** - Available quantity (number)
- **Category** - Select from dropdown:
  - Shiva
  - Shrooms
  - LSD
  - Chakras
  - Dark
  - Rick n Morty
- **Sizes** - Check applicable sizes (S, M, L, XL)
- **Images** - Upload product images (multiple files)

**Optional:**
- **Featured Product** - Mark as featured (checkbox)

#### Edit Product
- Click edit icon on any product
- Modify any field
- Upload new images (optional)
- Save changes

#### Delete Product
- Click delete icon
- Confirm deletion
- Product is permanently removed

### 3. Order Management (`/admin/orders`)

#### View Orders
- Paginated order list (10 per page)
- Order details: ID, Customer, Items, Total, Status, Date
- Quick actions: View Details, Update Status, Delete

#### Filter Orders

**By Status:**
- All Statuses
- Pending
- Processing
- Shipped
- Out for Delivery
- Delivered
- Cancelled

**By Category:**
- All Categories
- Shiva
- Shrooms
- LSD
- Chakras
- Dark
- Rick n Morty

**By Search:**
- Search by customer name or email
- Real-time filtering

#### Update Order Status
- Click status dropdown on any order
- Select new status
- Status updates immediately
- Customer can see updated status

#### View Order Details
Click "View" icon to see:
- Customer information (name, email)
- Shipping address
- Order items with quantities and sizes
- Total amount
- Payment method
- Current status

#### Delete Order
- Click delete button
- Confirm deletion
- Order is permanently removed

### 4. QR Code Management (`/admin/qr`)

#### Upload QR Code
1. Click "Choose File"
2. Select QR code image
3. Click "Upload QR Code"
4. QR code is saved and displayed to customers

#### View Current QR Code
- See the currently active QR code
- This is shown to customers during checkout
- Update anytime by uploading a new image

**Supported Formats:**
- PNG
- JPG/JPEG
- WebP

## Navigation

The admin panel uses a fixed sidebar with the following sections:

- **Dashboard** - Overview and statistics
- **Products** - Product management
- **Orders** - Order management
- **QR Code** - Payment QR management
- **Logout** - Sign out of admin panel

## Keyboard Shortcuts

- `Esc` - Close dialogs/modals
- `Enter` - Submit forms
- `Tab` - Navigate form fields

## Best Practices

### Product Management
1. **High-Quality Images** - Upload clear, high-resolution product images
2. **Accurate Descriptions** - Write detailed, accurate product descriptions
3. **Stock Management** - Keep stock levels updated
4. **Pricing** - Use consistent pricing format (no currency symbols)
5. **Categories** - Use exact category names (case-sensitive)

### Order Management
1. **Timely Updates** - Update order status promptly
2. **Status Flow** - Follow logical status progression:
   - Pending → Processing → Shipped → Out for Delivery → Delivered
3. **Customer Communication** - Update status to keep customers informed
4. **Order Review** - Check order details before updating status

### QR Code Management
1. **Clear Image** - Upload a clear, scannable QR code
2. **Test Before Upload** - Verify QR code works before uploading
3. **Regular Updates** - Update if payment details change
4. **Backup** - Keep a backup of your QR code image

## Troubleshooting

### Cannot Login
- Verify admin credentials
- Check backend server is running
- Clear browser cache and cookies
- Check console for errors

### Products Not Loading
- Check API connection
- Verify backend is running on correct port
- Check network tab for API errors
- Ensure admin token is valid

### Image Upload Fails
- Check file size (max 10MB recommended)
- Verify file format (PNG, JPG, WebP)
- Check backend storage configuration
- Ensure Cloudinary credentials are set

### Orders Not Updating
- Verify admin authentication
- Check order ID is correct
- Ensure status value is valid
- Check backend logs for errors

### QR Code Not Displaying
- Verify QR code was uploaded successfully
- Check image URL is accessible
- Clear browser cache
- Re-upload QR code

## Security

### Authentication
- Admin panel requires separate authentication
- Admin token stored securely in localStorage
- Automatic redirect to login if not authenticated
- Session persists until logout

### Authorization
- All admin API calls include admin token
- Backend validates admin privileges
- Unauthorized access is blocked
- Tokens expire after set duration

### Best Practices
1. **Strong Password** - Use a strong admin password
2. **Regular Logout** - Logout when finished
3. **Secure Connection** - Use HTTPS in production
4. **Limited Access** - Only share credentials with trusted admins
5. **Regular Updates** - Keep admin credentials updated

## API Integration

The admin panel integrates with the following API endpoints:

### Authentication
- `POST /api/admin/login` - Admin login

### Products
- `POST /api/admin/add-product` - Create product
- `GET /api/admin/get-all-products` - List products
- `PUT /api/admin/update-product/:id` - Update product
- `DELETE /api/admin/delete-product/:id` - Delete product

### Orders
- `GET /api/admin/get-all-orders` - List orders (with filters)
- `GET /api/admin/get-order/:id` - Get order details
- `PUT /api/admin/update-order/:id` - Update order status
- `DELETE /api/admin/delete-order/:id` - Delete order
- `GET /api/admin/order-statistics` - Get statistics

### QR Code
- `POST /api/admin/add-qr` - Upload QR code
- `GET /api/v1/get-qr` - Get current QR code

## Performance Tips

1. **Pagination** - Use pagination for large datasets
2. **Filters** - Apply filters to reduce data load
3. **Search** - Use search for specific items
4. **Image Optimization** - Compress images before upload
5. **Regular Cleanup** - Archive old orders periodically

## Mobile Responsiveness

The admin panel is optimized for desktop use. For mobile management:
- Use landscape orientation
- Zoom in for detailed views
- Use native browser features
- Consider desktop access for complex tasks

## Support

For technical support:
1. Check API documentation
2. Review backend logs
3. Check browser console
4. Verify API endpoints
5. Contact development team

## Updates

The admin panel is regularly updated with:
- New features
- Bug fixes
- Performance improvements
- Security enhancements

Check the changelog for recent updates.

## Changelog

### Version 1.0.0
- Initial release
- Product management
- Order management
- QR code management
- Dashboard with statistics
- Search and filter functionality
- Responsive design
- Authentication and authorization

---

**Last Updated:** February 2026
**Version:** 1.0.0
