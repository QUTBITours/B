import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { PlusCircle } from 'lucide-react';
import { db } from '../../firebase/config';
import { FlightBooking } from '../../types';
import { COLLECTIONS, addService, updateService, deleteService, formatCurrency } from '../../utils/serviceUtils';
import Navbar from '../../components/Layout/Navbar';
import ServiceForm from '../../components/Common/ServiceForm';
import ServiceList from '../../components/Common/ServiceList';

const FlightBookingPage: React.FC = () => {
  const [flightBookings, setFlightBookings] = useState<FlightBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBooking, setEditingBooking] = useState<FlightBooking | null>(null);

  const fetchFlightBookings = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, COLLECTIONS.FLIGHT_BOOKING), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const bookings: FlightBooking[] = [];
      querySnapshot.forEach((doc) => {
        bookings.push({ id: doc.id, ...doc.data() } as FlightBooking);
      });
      
      setFlightBookings(bookings);
    } catch (error) {
      console.error('Error fetching flight bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlightBookings();
  }, []);

  const handleAddBooking = async (data: Omit<FlightBooking, 'id' | 'createdAt' | 'updatedAt'>) => {
    await addService<FlightBooking>(COLLECTIONS.FLIGHT_BOOKING, data);
    setShowForm(false);
    fetchFlightBookings();
  };

  const handleUpdateBooking = async (data: Partial<FlightBooking>) => {
    if (editingBooking?.id) {
      await updateService<FlightBooking>(COLLECTIONS.FLIGHT_BOOKING, editingBooking.id, data);
      setEditingBooking(null);
      setShowForm(false);
      fetchFlightBookings();
    }
  };

  const handleDeleteBooking = async (id: string) => {
    await deleteService(COLLECTIONS.FLIGHT_BOOKING, id);
    fetchFlightBookings();
  };

  const handleEdit = (booking: FlightBooking) => {
    setEditingBooking(booking);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingBooking(null);
  };

  const formFields = [
    { name: 'from', label: 'From', type: 'text' as const, required: true },
    { name: 'to', label: 'To', type: 'text' as const, required: true },
    { name: 'flightDate', label: 'Flight Date', type: 'date' as const, required: true },
    { name: 'sector', label: 'Booking Sector', type: 'text' as const, placeholder: 'e.g., Indigo, MMT' },
    { name: 'customerQuote', label: 'Customer Quote (₹)', type: 'number' as const, required: true },
    { name: 'supplierCost', label: 'Supplier Cost (₹)', type: 'number' as const, required: true },
    { name: 'tourManagerCost', label: 'Tour Manager Cost (₹)', type: 'number' as const },
    { name: 'carCost', label: 'Car Cost (₹)', type: 'number' as const },
  ];

  const columns = [
    { key: 'from', header: 'From' },
    { key: 'to', header: 'To' },
    { key: 'flightDate', header: 'Flight Date' },
    { 
      key: 'customerQuote', 
      header: 'Customer Quote',
      render: (item: FlightBooking) => formatCurrency(item.customerQuote)
    },
    { 
      key: 'supplierCost', 
      header: 'Supplier Cost',
      render: (item: FlightBooking) => formatCurrency(item.supplierCost)
    },
    { key: 'profit', header: 'Profit' },
    { key: 'actions', header: 'Actions' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Flight Bookings</h1>
          
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <PlusCircle size={20} className="mr-2" />
              Add New Booking
            </button>
          )}
        </div>
        
        {showForm ? (
          <div className="mb-8">
            <ServiceForm
              title="Flight Booking"
              fields={formFields}
              initialData={editingBooking || undefined}
              onSubmit={editingBooking ? handleUpdateBooking : handleAddBooking}
              isEdit={!!editingBooking}
              onCancel={handleCancel}
            />
          </div>
        ) : null}
        
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading flight bookings...</p>
          </div>
        ) : (
          <ServiceList
            data={flightBookings}
            columns={columns}
            onEdit={handleEdit}
            onDelete={handleDeleteBooking}
            emptyMessage="No flight bookings found. Add your first booking!"
          />
        )}
      </div>
    </div>
  );
};

export default FlightBookingPage;