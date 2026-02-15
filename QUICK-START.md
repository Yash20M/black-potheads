# Quick Start Guide

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running (see API documentation)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd black-potheads
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env`:
   ```
   VITE_API_BASE_URL=http://localhost:3000
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open browser**
   ```
   http://localhost:5173
   ```

## Quick Test

### Test User Flow

1. **Register a new user**
   - Navigate to `/register`
   - Fill in name, email, password
   - Click "Register"

2. **Browse products**
   - Go to `/shop`
   - View products by category
   - Click on a product for details

3. **Add to cart**
   - Select size
   - Click "Add to Cart"
   - View cart in drawer

4. **Create order**
   - Fill in shipping address
   - Select payment method
   - Submit order

### Test Admin Flow

1. **Login as admin**
   - Navigate to `/admin/login`
   - Enter admin credentials
   - Access dashboard

2. **Create a product**
   - Go to "Products"
   - Click "Add Product"
   - Fill in details
   - Upload images
   - Save

3. **Manage orders**
   - Go to "Orders"
   - View order list
   - Update order status
   - View order details

4. **Upload QR code**
   - Go to "QR Code"
   - Upload payment QR image
   - Verify display

## Available Scripts

```bash
# Development
npm run dev          # Start dev server

# Build
npm run build        # Production build
npm run build:dev    # Development build

# Preview
npm run preview      # Preview production build

# Testing
npm run test         # Run tests once
npm run test:watch   # Run tests in watch mode

# Linting
npm run lint         # Run ESLint
```

## Project Structure

```
black-potheads/
├── src/
│   ├── components/      # React components
│   │   ├── cart/       # Cart components
│   │   ├── layout/     # Layout components
│   │   ├── products/   # Product components
│   │   ├── sections/   # Page sections
│   │   └── ui/         # UI components (shadcn)
│   ├── pages/          # Page components
│   │   ├── admin/      # Admin panel pages
│   │   └── auth/       # Auth pages
│   ├── lib/            # Utilities
│   │   ├── api.ts      # API client
│   │   └── utils.ts    # Helper functions
│   ├── store/          # State management
│   │   ├── authStore.ts
│   │   └── cartStore.ts
│   ├── types/          # TypeScript types
│   ├── data/           # Mock data
│   └── assets/         # Images, fonts, etc.
├── public/             # Static files
└── ...config files
```

## Key Features

### User Features
- ✅ Product browsing
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

## Common Issues

### Port Already in Use
```bash
# Kill process on port 5173
npx kill-port 5173

# Or use different port
npm run dev -- --port 3000
```

### API Connection Failed
- Verify backend is running
- Check `VITE_API_BASE_URL` in `.env`
- Check CORS settings in backend
- Verify network connectivity

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf .vite
```

### Images Not Loading
- Check image paths
- Verify images exist in `src/assets/`
- Check import statements
- Clear browser cache

## Environment Variables

```bash
# Required
VITE_API_BASE_URL=http://localhost:3000

# Optional (for production)
VITE_API_BASE_URL=https://api.yoursite.com
```

## Deployment

### Build for Production
```bash
npm run build
```

Output: `dist/` directory

### Preview Production Build
```bash
npm run preview
```

### Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Deploy to Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

## API Documentation

- **Full API Docs:** `API-DOCUMENTATION.md`
- **cURL Examples:** `API-CURL-QUICK-REFERENCE.md`
- **Postman Guide:** `POSTMAN-COLLECTION-GUIDE.md`
- **Integration Guide:** `API-INTEGRATION-README.md`
- **Admin Guide:** `ADMIN-PANEL-GUIDE.md`

## Tech Stack

- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Animations:** Framer Motion
- **State Management:** Zustand
- **Routing:** React Router v6
- **HTTP Client:** Fetch API
- **Form Handling:** React Hook Form
- **Validation:** Zod

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- Lazy loading for routes
- Image optimization
- Code splitting
- Tree shaking
- Minification

## Security

- JWT authentication
- Secure token storage
- HTTPS in production
- Input validation
- XSS protection

## Next Steps

1. **Customize Design**
   - Update colors in `tailwind.config.ts`
   - Modify components in `src/components/`
   - Add custom fonts

2. **Add Features**
   - Payment gateway integration
   - Email notifications
   - Real-time updates
   - Advanced search

3. **Optimize**
   - Image optimization
   - Code splitting
   - Caching strategies
   - Performance monitoring

4. **Deploy**
   - Set up CI/CD
   - Configure domain
   - Enable HTTPS
   - Set up monitoring

## Support

- **Documentation:** Check all `.md` files
- **Issues:** Create GitHub issue
- **Questions:** Contact development team

## License

[Your License Here]

---

**Happy Coding! 🚀**
