import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Menu, X, LogOut, BarChart3, Plane
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Dashboard';
      case '/summary':
        return 'Financial Summary';
      case '/flight-booking':
        return 'Flight Booking';
      case '/hotel-reservation':
        return 'Hotel Reservation';
      case '/car-rental':
        return 'Car Rental';
      case '/visa':
        return 'Visa Services';
      case '/foreign-exchange':
        return 'Foreign Exchange';
      case '/tour-packages':
        return 'Tour Packages';
      case '/train-booking':
        return 'Train Booking';
      case '/vajabhat':
        return 'Vajabhat';
      default:
        return 'QT Holidays';
    }
  };
  
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                <Plane className="h-8 w-8 text-blue-500" />
                <span className="ml-2 text-xl font-bold text-gray-800">QT Holidays</span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <div className="text-lg font-medium text-gray-700">
                {getPageTitle()}
              </div>
            </div>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            <Link 
              to="/summary" 
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 flex items-center"
            >
              <BarChart3 className="h-5 w-5 mr-1" />
              Summary
            </Link>
            <button
              onClick={handleLogout}
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 flex items-center"
            >
              <LogOut className="h-5 w-5 mr-1" />
              Logout
            </button>
          </div>
          
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div className={`${isOpen ? 'block' : 'hidden'} sm:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          <div className="px-4 py-2 text-base font-medium text-gray-800">
            {getPageTitle()}
          </div>
          <Link
            to="/summary"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            onClick={() => setIsOpen(false)}
          >
            <div className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Summary
            </div>
          </Link>
          <button
            onClick={() => {
              handleLogout();
              setIsOpen(false);
            }}
            className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
          >
            <div className="flex items-center">
              <LogOut className="h-5 w-5 mr-2" />
              Logout
            </div>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;