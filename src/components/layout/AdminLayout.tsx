import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Package, ShoppingCart, LogOut, Warehouse, ChevronDown, ChevronRight, Menu, X, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { useAdminNotificationStore } from '@/store/adminNotificationStore';
import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/api';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin, logoutAdmin } = useAuthStore();
  const { pendingOrdersCount, setPendingOrdersCount, markOrdersAsViewed } = useAdminNotificationStore();
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin/login');
    }
  }, [isAdmin, navigate]);

  useEffect(() => {
    // Auto-open inventory submenu if on any inventory page
    if (location.pathname.startsWith('/admin/inventory')) {
      setInventoryOpen(true);
    }
    // Close mobile menu on route change
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Fetch pending orders count
  useEffect(() => {
    if (isAdmin) {
      fetchPendingOrdersCount();
      // Poll every 30 seconds for new orders
      const interval = setInterval(fetchPendingOrdersCount, 30000);
      return () => clearInterval(interval);
    }
  }, [isAdmin]);

  const fetchPendingOrdersCount = async () => {
    try {
      const response: any = await adminApi.orders.getAll({ filter: 'Pending' });
      setPendingOrdersCount(response.totalOrders || 0);
    } catch (error) {
      console.error('Failed to fetch pending orders count:', error);
    }
  };

  const handleOrdersClick = () => {
    // Mark orders as viewed when clicking on Orders menu
    markOrdersAsViewed();
  };

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin/login');
  };

  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/products', label: 'Products', icon: Package },
    { path: '/admin/orders', label: 'Orders', icon: ShoppingCart },
    { path: '/admin/offers', label: 'Offers', icon: Tag },
  ];

  const inventoryItems = [
    { path: '/admin/inventory/overview', label: 'Overview' },
    { path: '/admin/inventory/alerts', label: 'Alerts' },
    { path: '/admin/inventory/reports', label: 'Reports' },
  ];

  if (!isAdmin) return null;

  const SidebarContent = () => (
    <>
      <div className="p-6">
        <Link to="/admin/dashboard">
          <h1 className="font-display text-2xl">ADMIN PANEL</h1>
        </Link>
      </div>

      <nav className="px-4 space-y-2 flex-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          const isOrdersPage = item.path === '/admin/orders';
          
          return (
            <Link 
              key={item.path} 
              to={item.path}
              onClick={isOrdersPage ? handleOrdersClick : undefined}
            >
              <motion.div
                whileHover={{ x: 4 }}
                className={`flex items-center justify-between px-4 py-3 rounded transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-secondary'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </div>
                {isOrdersPage && pendingOrdersCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="bg-red-500 text-white text-xs font-bold rounded-full min-w-[24px] h-6 px-2 flex items-center justify-center"
                  >
                    {pendingOrdersCount > 99 ? '99+' : pendingOrdersCount}
                  </motion.span>
                )}
              </motion.div>
            </Link>
          );
        })}

        {/* Inventory Submenu */}
        <div>
          <motion.div
            whileHover={{ x: 4 }}
            className={`flex items-center justify-between px-4 py-3 rounded transition-colors cursor-pointer ${
              location.pathname.startsWith('/admin/inventory')
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-secondary'
            }`}
            onClick={() => setInventoryOpen(!inventoryOpen)}
          >
            <div className="flex items-center gap-3">
              <Warehouse size={20} />
              <span className="font-medium">Inventory</span>
            </div>
            {inventoryOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </motion.div>

          {inventoryOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="ml-8 mt-1 space-y-1"
            >
              {inventoryItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link key={item.path} to={item.path}>
                    <motion.div
                      whileHover={{ x: 4 }}
                      className={`px-4 py-2 rounded text-sm transition-colors ${
                        isActive
                          ? 'bg-primary/20 text-primary font-medium'
                          : 'hover:bg-secondary'
                      }`}
                    >
                      {item.label}
                    </motion.div>
                  </Link>
                );
              })}
            </motion.div>
          )}
        </div>
      </nav>

      <div className="p-4">
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={handleLogout}
        >
          <LogOut size={20} className="mr-3" />
          Logout
        </Button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-card border-b border-border z-40 flex items-center justify-between px-4">
        <Link to="/admin/dashboard">
          <h1 className="font-display text-xl">ADMIN</h1>
        </Link>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
              onClick={() => setMobileMenuOpen(false)}
            />
            
            {/* Sidebar */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-64 bg-card border-r border-border z-50 flex flex-col"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-64 bg-card border-r border-border flex-col">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0 p-4 md:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
