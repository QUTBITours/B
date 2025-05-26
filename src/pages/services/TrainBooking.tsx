import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { PlusCircle } from 'lucide-react';
import { db } from '../../firebase/config';
import { TrainBooking } from '../../types';
import { COLLECTIONS, addService, updateService, deleteService, formatCurrency } from '../../utils/serviceUtils';
import Navbar from '../../components/Layout/Navbar';
import ServiceForm from '../../components/Common/ServiceForm';
import ServiceList from '../../components/Common/ServiceList';

const TrainBookingPage: React.FC = () => {
  const [trainBookings, setTrainBookings] = useState<TrainBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBooking, setEditingBooking] = useState<TrainBooking | null>(null);

  const fetchTrainBookings = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, COLLECTIONS.TRAIN_BOOKING), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const bookings: TrainBooking[] = [];
      querySnapshot.forEach((doc) => {
        bookings.push({ id: doc.id, ...doc.data() } as TrainBooking);
      });
      
      setTrainBookings(bookings);
    } catch (error) {
      console.error('Error fetching train bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainBookings();
  }, []);

  const handleAddBooking = async (data: Omit<TrainBooking, 'id' | 'createdAt' | 'updatedAt'>) => {
    await addService<TrainBooking>(COLLECTIONS.TRAIN_BOOKING, data);
    setShowForm(false);
    fetchTrainBookings();
  };

  const handleUpdateBooking = async (data: Partial<TrainBooking>) => {
    if (editingBooking?.id) {
      await updateService<TrainBooking>(COLLECTIONS.TRAIN_BOOKING, editingBooking.id, data);
      setEditingBooking(null);
      setShowForm(false);
      fetchTrainBookings();
    }
  };

  const handleDeleteBooking = async (id: string) => {
    await deleteService(COLLECTIONS.TRAIN_BOOKING, id);
    fetchTrainBookings();
  };

  const handleEdit = (booking: TrainBooking) => {
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
    { name: 'date', label: 'Date', type: 'date' as const, required: true },
    { name: 'customerQuote', label: 'Customer Quote (₹)', type: 'number' as const, required: true },
    { name: 'supplierCost', label: 'Supplier Cost (₹)', type: 'number' as const, required: true },
  ];

  const columns = [
    { key: 'from', header: 'From' },
    { key: 'to', header: 'To' },
    { key: 'date', header: 'Date' },
    { 
      key: 'customerQuote', 
      header: 'Customer Quote',
      render: (item: TrainBooking) => formatCurrency(item.customerQuote)
    },
    { 
      key: 'supplierCost', 
      header: 'Supplier Cost',
      render: (item: TrainBooking) => formatCurrency(item.supplierCost)
    },
    { key: 'profit', header: 'Profit' },
    { key: 'actions', header: 'Actions' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Train Bookings</h1>
          
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
              title="Train Booking"
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
            <p className="mt-4 text-gray-600">Loading train bookings...</p>
          </div>
        ) : (
          <ServiceList
            data={trainBookings}
            columns={columns}
            onEdit={handleEdit}
            onDelete={handleDeleteBooking}
            emptyMessage="No train bookings found. Add your first booking!"
          />
        )}
      </div>
    </div>
  );
};

export default TrainBookingPage;