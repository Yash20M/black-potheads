import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Layout } from "@/components/layout/Layout";
import { ScrollToTop } from "@/components/ScrollToTop";
import { PageLoader } from "@/components/ui/loader";
import { LoadingBar } from "@/components/ui/loading-bar";

// Eager load critical pages (checkout is critical for conversions)
import CheckoutPage from "./pages/CheckoutPage";

// Lazy load other pages for better performance
const Index = lazy(() => import("./pages/Index"));
const ShopPage = lazy(() => import("./pages/ShopPage"));
const CollectionsPage = lazy(() => import("./pages/CollectionsPage"));
const ProductDetailPage = lazy(() => import("./pages/ProductDetailPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const OrdersPage = lazy(() => import("./pages/OrdersPage"));
const WishlistPage = lazy(() => import("./pages/WishlistPage"));

// Admin pages
const AdminLayout = lazy(() => import("@/components/layout/AdminLayout"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminProducts = lazy(() => import("./pages/admin/AdminProducts"));
const AdminOrders = lazy(() => import("./pages/admin/AdminOrders"));
const AdminQR = lazy(() => import("./pages/admin/AdminQR"));
const InventoryOverview = lazy(() => import("./pages/admin/inventory/InventoryOverview"));
const InventoryAlerts = lazy(() => import("./pages/admin/inventory/InventoryAlerts"));
const InventoryReports = lazy(() => import("./pages/admin/inventory/InventoryReports"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <LoadingBar />
        <ScrollToTop />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Index />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/collections" element={<CollectionsPage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
            </Route>
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="inventory/overview" element={<InventoryOverview />} />
              <Route path="inventory/alerts" element={<InventoryAlerts />} />
              <Route path="inventory/reports" element={<InventoryReports />} />
              <Route path="qr" element={<AdminQR />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
