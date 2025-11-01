'use client';

import { Home, Package, Users, ShoppingCart, Truck } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/produtos', label: 'Produtos', icon: Package },
    { href: '/clientes', label: 'Clientes', icon: Users },
    { href: '/pedidos', label: 'Pedidos', icon: ShoppingCart },
    { href: '/entregas', label: 'Entregas', icon: Truck },
  ];

  return (
    <nav className="bg-red-600 text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/dashboard" className="text-xl font-bold">Galeteria</Link>
          <div className="flex space-x-1">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  pathname === href ? 'bg-red-700' : 'hover:bg-red-500'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden md:inline">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}