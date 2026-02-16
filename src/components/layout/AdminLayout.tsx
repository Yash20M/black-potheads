import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Package, ShoppingCart, LogOut, QrCode, Warehouse, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { useEffect, useState } from 'react';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin, logoutAdmin } = useAuthStore();
  const [inventoryOpen, setInventoryOpen] = useState(false);

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
  }, [location.pathname]);

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin/login');
  };

  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/products', label: 'Products', icon: Package },
    { path: '/admin/orders', label: 'Orders', icon: ShoppingCart },
    { path: '/admin/qr', label: 'QR Code', icon: QrCode },
  ];

  const inventoryItems = [
    { path: '/admin/inventory/overview', label: 'Overview' },
    { path: '/admin/inventory/alerts', label: 'Alerts' },
    { path: '/admin/inventory/reports', label: 'Reports' },
  ];

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border">
        <div className="p-6">
          <Link to="/admin/dashboard">
            <h1 className="font-display text-2xl">ADMIN PANEL</h1>
          </Link>
        </div>

        <nav className="px-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link key={item.path} to={item.path}>
                <motion.div
                  whileHover={{ x: 4 }}
                  className={`flex items-center gap-3 px-4 py-3 rounded transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-secondary'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
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

        <div className="absolute bottom-6 left-4 right-4">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleLogout}
          >
            <LogOut size={20} className="mr-3" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
