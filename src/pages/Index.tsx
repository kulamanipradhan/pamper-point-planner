
import React, { useState } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import HomePage from '@/components/HomePage';
import AuthPage from '@/components/AuthPage';
import ServicesPage from '@/components/ServicesPage';
import BookingPage from '@/components/BookingPage';
import MyBookingsPage from '@/components/MyBookingsPage';
import AdminDashboard from '@/components/AdminDashboard';
import { useAuth } from '@/contexts/AuthContext';

const AppContent = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const { user } = useAuth();

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
  };

  const handleBookService = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    setCurrentPage('booking');
  };

  const handleAuthSuccess = () => {
    setCurrentPage('home');
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onPageChange={handlePageChange} />;
      case 'login':
        return (
          <AuthPage 
            mode="login" 
            onSuccess={handleAuthSuccess}
            onModeChange={(mode) => setCurrentPage(mode)}
          />
        );
      case 'register':
        return (
          <AuthPage 
            mode="register" 
            onSuccess={handleAuthSuccess}
            onModeChange={(mode) => setCurrentPage(mode)}
          />
        );
      case 'services':
        return <ServicesPage onBookService={handleBookService} />;
      case 'booking':
        if (!user) {
          setCurrentPage('login');
          return null;
        }
        return <BookingPage selectedServiceId={selectedServiceId} onPageChange={handlePageChange} />;
      case 'my-bookings':
        if (!user) {
          setCurrentPage('login');
          return null;
        }
        return <MyBookingsPage onPageChange={handlePageChange} />;
      case 'admin':
        if (!user || user.role !== 'admin') {
          setCurrentPage('home');
          return null;
        }
        return <AdminDashboard onPageChange={handlePageChange} />;
      default:
        return <HomePage onPageChange={handlePageChange} />;
    }
  };

  const showNavbar = !['login', 'register'].includes(currentPage);

  return (
    <div className="min-h-screen bg-background">
      {showNavbar && (
        <Navbar currentPage={currentPage} onPageChange={handlePageChange} />
      )}
      {renderCurrentPage()}
    </div>
  );
};

const Index = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default Index;
