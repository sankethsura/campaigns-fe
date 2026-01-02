'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { removeAuthToken } from '@/lib/auth';
import { useLogoutMutation } from '@/store/api';
import { User } from '@/types/user';
import { ThemeToggle } from './theme-toggle';
import { Button } from './ui/button';
import { LogOut, Mail, Home, CreditCard, Menu, X } from 'lucide-react';

interface NavbarProps {
  user: User;
}

export default function Navbar({ user }: NavbarProps) {
  const router = useRouter();
  const [logout] = useLogoutMutation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      removeAuthToken();
      router.push('/login');
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            href="/campaigns"
            className="flex items-center space-x-2 text-xl font-bold bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent hover:opacity-80 transition"
          >
            <Mail className="h-6 w-6 text-primary" />
            <span className="hidden sm:inline">Campaign Manager Pro</span>
            <span className="sm:hidden">CMP</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              onClick={() => router.push('/')}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Home className="h-4 w-4" />
              Home
            </Button>

            <Button
              onClick={() => router.push('/pricing')}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <CreditCard className="h-4 w-4" />
              Pricing
            </Button>

            <ThemeToggle />

            <div className="flex items-center space-x-3 px-4 py-2 rounded-lg bg-accent/50">
              {user.picture && (
                <img
                  src={user.picture}
                  alt={user.name}
                  className="h-8 w-8 rounded-full ring-2 ring-primary/20"
                />
              )}
              <span className="text-sm font-medium">{user.name}</span>
            </div>

            <Button
              onClick={handleLogout}
              variant="destructive"
              size="sm"
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-3 border-t">
            {/* User Info */}
            <div className="flex items-center space-x-3 px-4 py-2 rounded-lg bg-accent/50">
              {user.picture && (
                <img
                  src={user.picture}
                  alt={user.name}
                  className="h-8 w-8 rounded-full ring-2 ring-primary/20"
                />
              )}
              <span className="text-sm font-medium">{user.name}</span>
            </div>

            {/* Navigation Buttons */}
            <Button
              onClick={() => {
                router.push('/');
                setMobileMenuOpen(false);
              }}
              variant="outline"
              size="sm"
              className="w-full gap-2 justify-start"
            >
              <Home className="h-4 w-4" />
              Home
            </Button>

            <Button
              onClick={() => {
                router.push('/pricing');
                setMobileMenuOpen(false);
              }}
              variant="outline"
              size="sm"
              className="w-full gap-2 justify-start"
            >
              <CreditCard className="h-4 w-4" />
              Pricing
            </Button>

            {/* Theme Toggle */}
            <div className="flex items-center justify-between px-4 py-2">
              <span className="text-sm font-medium">Theme</span>
              <ThemeToggle />
            </div>

            {/* Logout Button */}
            <Button
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }}
              variant="destructive"
              size="sm"
              className="w-full gap-2 justify-start"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}
