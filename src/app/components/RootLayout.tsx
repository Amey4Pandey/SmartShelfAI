import { Outlet, Link, useLocation } from 'react-router';
import { LayoutDashboard, Camera, Bell, ShoppingCart, BarChart3, Menu, MoonStar, SunMedium } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Switch } from './ui/switch';
import { useTheme } from 'next-themes';

export function RootLayout() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? theme === 'dark' : true;

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/shelves', label: 'Live Monitoring', icon: Camera },
    { path: '/alerts', label: 'Alerts', icon: Bell },
    { path: '/orders', label: 'Orders', icon: ShoppingCart },
    { path: '/reports', label: 'Reports', icon: BarChart3 },
  ];

  const NavLinks = () => (
    <>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-foreground/80 hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            <Icon className="size-5" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </>
  );

  const ThemeToggle = () => (
    <div className="flex items-center gap-3 rounded-full border border-border bg-background/80 px-3 py-2 text-sm text-foreground shadow-sm backdrop-blur">
      <SunMedium className="size-4 text-muted-foreground" />
      <Switch
        checked={isDark}
        disabled={!mounted}
        onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
      />
      <MoonStar className="size-4 text-muted-foreground" />
    </div>
  );

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-card border-r border-border flex-col">
        <div className="p-6 border-b border-border">
          <h1 className="text-xl font-semibold">Smart Shelf AI</h1>
          <p className="text-sm text-muted-foreground mt-1">Monitoring System</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <NavLinks />
        </nav>
        <div className="p-4 border-t border-border text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="size-2 bg-green-500 rounded-full animate-pulse" />
            <span>All Systems Active</span>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-background border-b border-border px-4 py-3 flex items-center gap-3 z-10">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 bg-card border-border p-0">
            <div className="p-6 border-b border-border">
              <h1 className="text-xl font-semibold">Smart Shelf AI</h1>
              <p className="text-sm text-muted-foreground mt-1">Monitoring System</p>
            </div>
            <nav className="p-4 space-y-2">
              <NavLinks />
            </nav>
          </SheetContent>
        </Sheet>
        <h1 className="text-lg font-semibold">Smart Shelf AI</h1>
      </div>

      <div className="fixed bottom-4 right-4 z-20">
        <ThemeToggle />
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-auto md:pt-0 pt-16">
        <Outlet />
      </main>
    </div>
  );
}
