# Getting Started with Black Potheads

Welcome! This guide will help you get the Black Potheads e-commerce platform up and running.

## Prerequisites

Before you begin, ensure you have:
- Node.js (v16 or higher) installed
- npm or yarn package manager
- A code editor (VS Code recommended)
- Backend API server running (see API documentation)

## Step 1: Installation

```bash
# Navigate to project directory
cd black-potheads

# Install dependencies
npm install
```

## Step 2: Environment Setup

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and add your backend API URL:

```env
VITE_API_BASE_URL=http://localhost:3000
```

## Step 3: Start Development Server

```bash
npm run dev
```

The application will start at `http://localhost:5173`

## Step 4: Verify Installation

Open your browser and navigate to:
- `http://localhost:5173` - Main website
- `http://localhost:5173/admin/login` - Admin panel

## What's Next?

### For Users
1. **Register an Account**
   - Go to `/register`
   - Fill in your details
   - Start shopping!

2. **Browse Products**
   - Visit `/shop` to see all products
   - Filter by category
   - Add items to cart

3. **Place an Order**
   - Add items to cart
   - Proceed to checkout
   - Fill in shipping details
   - Complete order

### For Admins
1. **Login to Admin Panel**
   - Go to `/admin/login`
   - Enter admin credentials
   - Access dashboard

2. **Manage Products**
   - Create new products
   - Upload product images
   - Edit existing products
   - Manage inventory

3. **Process Orders**
   - View all orders
   - Update order status
   - Filter and search orders
   - View order details

## Key Features to Explore

### User Features
- ✅ Product browsing with categories
- ✅ Shopping cart
- ✅ Wishlist
- ✅ User authentication
- ✅ Order management
- ✅ Responsive design

### Admin Features
- ✅ Dashboard with statistics
- ✅ Product CRUD operations
- ✅ Order management
- ✅ QR code management
- ✅ Search and filters
- ✅ Pagination

## Project Structure

```
src/
├── components/         # Reusable components
├── pages/             # Page components
│   ├── admin/        # Admin panel pages
│   └── auth/         # Authentication pages
├── lib/              # Utilities and API client
├── store/            # State management
├── types/            # TypeScript types
└── assets/           # Images and static files
```

## Available Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build

# Testing
npm run test             # Run tests
npm run test:watch       # Run tests in watch mode

# Code Quality
npm run lint             # Run ESLint
```

## Common Tasks

### Adding a New Product (Admin)
1. Login to admin panel
2. Go to "Products"
3. Click "Add Product"
4. Fill in details
5. Upload images
6. Save

### Processing an Order (Admin)
1. Go to "Orders"
2. Find the order
3. Click status dropdown
4. Select new status
5. Status updates automatically

### Updating QR Code (Admin)
1. Go to "QR Code"
2. Click "Choose File"
3. Select QR image
4. Click "Upload"

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5173
npx kill-port 5173
```

### API Connection Failed
- Verify backend is running
- Check `.env` file has correct API URL
- Check CORS settings in backend

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Documentation

- **Quick Start:** [QUICK-START.md](QUICK-START.md)
- **API Integration:** [API-INTEGRATION-README.md](API-INTEGRATION-README.md)
- **Admin Guide:** [ADMIN-PANEL-GUIDE.md](ADMIN-PANEL-GUIDE.md)
- **Deployment:** [DEPLOYMENT-CHECKLIST.md](DEPLOYMENT-CHECKLIST.md)
- **Full README:** [README.md](README.md)

## Need Help?

1. Check the documentation files
2. Review the API documentation
3. Check browser console for errors
4. Verify backend is running
5. Contact the development team

## Next Steps

1. **Explore the Code**
   - Review component structure
   - Understand state management
   - Check API integration

2. **Customize**
   - Update branding
   - Modify styles
   - Add new features

3. **Deploy**
   - Follow deployment checklist
   - Set up production environment
   - Configure domain and SSL

## Tips for Success

- **Start with the basics** - Get familiar with the user flow first
- **Test thoroughly** - Try all features before deploying
- **Read the docs** - All documentation is comprehensive
- **Ask questions** - Don't hesitate to reach out for help
- **Have fun!** - Enjoy building with this platform

---

**Happy Building! 🚀**

For more detailed information, check out the other documentation files in the project root.
