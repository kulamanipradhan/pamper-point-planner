
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Calendar, User, Settings, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavbarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentPage, onPageChange }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    onPageChange('home');
  };

  return (
    <nav className="bg-white shadow-lg border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div 
            className="flex items-center cursor-pointer" 
            onClick={() => onPageChange('home')}
          >
            <h1 className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
              Luxe Salon
            </h1>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => onPageChange('services')}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                currentPage === 'services' ? 'text-primary' : 'text-gray-600'
              }`}
            >
              Services
            </button>
            <button
              onClick={() => onPageChange('booking')}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                currentPage === 'booking' ? 'text-primary' : 'text-gray-600'
              }`}
            >
              Book Now
            </button>
            {user && (
              <button
                onClick={() => onPageChange('my-bookings')}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  currentPage === 'my-bookings' ? 'text-primary' : 'text-gray-600'
                }`}
              >
                My Bookings
              </button>
            )}
            {user?.role === 'admin' && (
              <button
                onClick={() => onPageChange('admin')}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  currentPage === 'admin' ? 'text-primary' : 'text-gray-600'
                }`}
              >
                Admin
              </button>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onPageChange('my-bookings')}>
                    <Calendar className="mr-2 h-4 w-4" />
                    My Bookings
                  </DropdownMenuItem>
                  {user.role === 'admin' && (
                    <DropdownMenuItem onClick={() => onPageChange('admin')}>
                      <Settings className="mr-2 h-4 w-4" />
                      Admin Dashboard
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" onClick={() => onPageChange('login')}>
                  Login
                </Button>
                <Button onClick={() => onPageChange('register')}>
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
