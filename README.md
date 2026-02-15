# Black Potheads - Premium Streetwear E-commerce

A modern, high-performance e-commerce platform built with React, TypeScript, and Tailwind CSS. Features a complete admin panel and full API integration.

![Black Potheads](https://img.shields.io/badge/version-1.0.0-blue)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 🚀 Quick Links

- [Quick Start Guide](QUICK-START.md) - Get up and running in 5 minutes
- [API Integration Guide](API-INTEGRATION-README.md) - Complete API documentation
- [Admin Panel Guide](ADMIN-PANEL-GUIDE.md) - Admin panel usage
- [Deployment Checklist](DEPLOYMENT-CHECKLIST.md) - Production deployment guide
- [Implementation Summary](IMPLEMENTATION-SUMMARY.md) - What was built

## ✨ Features

### User Features
- 🛍️ Product browsing with categories
- 🛒 Shopping cart with real-time updates
- ❤️ Wishlist functionality
- 👤 User authentication (register/login)
- 📦 Order management
- 💳 QR code payment integration
- 📱 Fully responsive design
- ⚡ Lightning-fast performance

### Admin Panel
- 📊 Dashboard with statistics
- 📦 Product CRUD operations
- 🖼️ Image upload for products
- 📋 Order management with filters
- 🔍 Search and pagination
- 📱 QR code management
- 🔐 Secure authentication
- 📈 Real-time order statistics

## 🛠️ Tech Stack

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

## 📦 Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd black-potheads

# Install dependencies
npm install

# Configure environment
cp .env.example .env

# Start development server
npm run dev
```

## 🔧 Configuration

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:3000
```

## 📝 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run test         # Run tests
npm run lint         # Run ESLint
```

## 🗂️ Project Structure

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

## 🔐 Authentication

### User Authentication
- Register at `/register`
- Login at `/login`
- JWT token stored in localStorage

### Admin Authentication
- Login at `/admin/login`
- Separate admin token
- Protected admin routes

## 🎨 Admin Panel

Access the admin panel at `/admin/login`

**Features:**
- Dashboard with order statistics
- Product management (create, edit, delete)
- Order management with filters
- QR code upload for payments
- Search and pagination

See [Admin Panel Guide](ADMIN-PANEL-GUIDE.md) for detailed usage.

## 🌐 API Integration

All API endpoints are integrated and ready to use:

- User authentication
- Product management
- Cart operations
- Wishlist management
- Order processing
- Admin operations

See [API Integration Guide](API-INTEGRATION-README.md) for complete documentation.

## 📱 Routes

### Public Routes
- `/` - Home page
- `/shop` - Shop page
- `/collections` - Collections page
- `/product/:id` - Product detail
- `/about` - About page
- `/contact` - Contact page
- `/login` - User login
- `/register` - User registration

### Admin Routes (Protected)
- `/admin/login` - Admin login
- `/admin/dashboard` - Dashboard
- `/admin/products` - Product management
- `/admin/orders` - Order management
- `/admin/qr` - QR code management

## 🚀 Deployment

### Quick Deploy to Vercel

```bash
npm i -g vercel
vercel --prod
```

### Quick Deploy to Netlify

```bash
npm i -g netlify-cli
netlify deploy --prod
```

See [Deployment Checklist](DEPLOYMENT-CHECKLIST.md) for detailed instructions.

## 🧪 Testing

```bash
# Run tests
npm run test

# Run tests in watch mode
npm run test:watch
```

## 📚 Documentation

- **API Documentation:** [API-DOCUMENTATION.md](API-DOCUMENTATION.md)
- **cURL Examples:** [API-CURL-QUICK-REFERENCE.md](API-CURL-QUICK-REFERENCE.md)
- **Postman Guide:** [POSTMAN-COLLECTION-GUIDE.md](POSTMAN-COLLECTION-GUIDE.md)
- **Integration Guide:** [API-INTEGRATION-README.md](API-INTEGRATION-README.md)
- **Admin Guide:** [ADMIN-PANEL-GUIDE.md](ADMIN-PANEL-GUIDE.md)
- **Quick Start:** [QUICK-START.md](QUICK-START.md)
- **Deployment:** [DEPLOYMENT-CHECKLIST.md](DEPLOYMENT-CHECKLIST.md)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with [Lovable](https://lovable.dev)
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Icons from [Lucide](https://lucide.dev)

## 📞 Support

For support, email support@blackpotheads.com or open an issue.

## 🔗 Links

- **Live Demo:** [Coming Soon]
- **API Docs:** [API-DOCUMENTATION.md](API-DOCUMENTATION.md)
- **Admin Panel:** `/admin/login`

---

**Built with ❤️ by the Black Potheads team**
