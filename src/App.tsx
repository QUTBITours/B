import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Summary from './pages/Summary';
import FlightBooking from './pages/services/FlightBooking';
import HotelReservation from './pages/services/HotelReservation';
import CarRental from './pages/services/CarRental';
import Visa from './pages/services/Visa';
import ForeignExchange from './pages/services/ForeignExchange';
import TourPackages from './pages/services/TourPackages';
import TrainBooking from './pages/services/TrainBooking';
import Vajabhat from './pages/services/Vajabhat';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import './index.css';

function App() {
  return (
    <Router basename="/qt-holidays-app">
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/summary" element={<ProtectedRoute><Summary /></ProtectedRoute>} />
            <Route path="/flight-booking" element={<ProtectedRoute><FlightBooking /></ProtectedRoute>} />
            <Route path="/hotel-reservation" element={<ProtectedRoute><HotelReservation /></ProtectedRoute>} />
            <Route path="/car-rental" element={<ProtectedRoute><CarRental /></ProtectedRoute>} />
            <Route path="/visa" element={<ProtectedRoute><Visa /></ProtectedRoute>} />
            <Route path="/foreign-exchange" element={<ProtectedRoute><ForeignExchange /></ProtectedRoute>} />
            <Route path="/tour-packages" element={<ProtectedRoute><TourPackages /></ProtectedRoute>} />
            <Route path="/train-booking" element={<ProtectedRoute><TrainBooking /></ProtectedRoute>} />
            <Route path="/vajabhat" element={<ProtectedRoute><Vajabhat /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;