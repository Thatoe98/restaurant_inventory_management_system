'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  BarChart3, 
  UtensilsCrossed, 
  Package, 
  FileText, 
  Upload,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/sales', label: 'Sales Analytics', icon: BarChart3 },
  { href: '/menu', label: 'Menu', icon: UtensilsCrossed },
  { href: '/ingredients', label: 'Ingredients', icon: Package },
  { href: '/reports', label: 'Reports', icon: FileText },
  { href: '/import', label: 'Import Data', icon: Upload },
];

export function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-1 bg-white border-b px-4 py-2">
        <div className="flex items-center gap-2 mr-6">
          <UtensilsCrossed className="h-6 w-6 text-orange-600" />
          <span className="font-bold text-lg">RestaurantOS</span>
        </div>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-orange-100 text-orange-700'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden bg-white border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="h-6 w-6 text-orange-600" />
            <span className="font-bold text-lg">RestaurantOS</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
        
        {mobileMenuOpen && (
          <div className="mt-3 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-orange-100 text-orange-700'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        )}
      </nav>
    </>
  );
}

export function Footer() {
  return (
    <footer className="bg-white border-t py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-600">
            <UtensilsCrossed className="h-5 w-5 text-orange-600" />
            <span className="text-sm">RestaurantOS - Complete Restaurant Management</span>
          </div>
          <div className="text-sm text-slate-500">
            © {new Date().getFullYear()} Restaurant Inventory System
          </div>
        </div>
      </div>
    </footer>
  );
}
