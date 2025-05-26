import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { PlusCircle } from 'lucide-react';
import { db } from '../../firebase/config';
import { HotelReservation } from '../../types';
import { COLLECTIONS, addService, updateService, deleteService, formatCurrency } from '../../utils/serviceUtils';
import Navbar from '../../components/Layout/Navbar';
import ServiceForm from '../../components/Common/ServiceForm';
import ServiceList from '../../components/Common/ServiceList';

const HotelReservationPage: React.FC = () => {
  const [hotelReservations, setHotelReservations] = useState<HotelReservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingReservation, setEditingReservation] = useState<HotelReservation | null>(null);

  const fetchHotelReservations = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, COLLECTIONS.HOTEL_RESERVATION), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const reservations: HotelReservation[] = [];
      querySnapshot.forEach((doc) => {
        reservations.push({ id: doc.id, ...doc.data() } as HotelReservation);
      });
      
      setHotelReservations(reservations);
    } catch (error) {
      console.error('Error fetching hotel reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotelReservations();
  }, []);

  const handleAddReservation = async (data: Omit<HotelReservation, 'id' | 'createdAt' | 'updatedAt'>) => {
    await addService<HotelReservation>(COLLECTIONS.HOTEL_RESERVATION, data);
    setShowForm(false);
    fetchHotelReservations();
  };

  const handleUpdateReservation = async (data: Partial<HotelReservation>) => {
    if (editingReservation?.id) {
      await updateService<HotelReservation>(COLLECTIONS.HOTEL_RESERVATION, editingReservation.id, data);
      setEditingReservation(null);
      setShowForm(false);
      fetchHotelReservations();
    }
  };

  const handleDeleteReservation = async (id: string) => {
    await deleteService(COLLECTIONS.HOTEL_RESERVATION, id);
    fetchHotelReservations();
  };

  const handleEdit = (reservation: HotelReservation) => {
    setEditingReservation(reservation);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingReservation(null);
  };

  const formFields = [
    { name: 'hotelName', label: 'Hotel Name / Country', type: 'text' as const, required: true },
    { name: 'checkInDate', label: 'Check-in Date', type: 'date' as const, required: true },
    { name: 'checkOutDate', label: 'Check-out Date', type: 'date' as const, required: true },
    { name: 'customerQuote', label: 'Customer Quote (₹)', type: 'number' as const, required: true },
    { name: 'supplierCost', label: 'Supplier Cost (₹)', type: 'number' as const, required: true },
  ];

  const columns = [
    { key: 'hotelName', header: 'Hotel Name / Country' },
    { key: 'checkInDate', header: 'Check-in Date' },
    { key: 'checkOutDate', header: 'Check-out Date' },
    { 
      key: 'customerQuote', 
      header: 'Customer Quote',
      render: (item: HotelReservation) => formatCurrency(item.customerQuote)
    },
    { 
      key: 'supplierCost', 
      header: 'Supplier Cost',
      render: (item: HotelReservation) => formatCurrency(item.supplierCost)
    },
    { key: 'profit', header: 'Profit' },
    { key: 'actions', header: 'Actions' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Hotel Reservations</h1>
          
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <PlusCircle size={20} className="mr-2" />
              Add New Reservation
            </button>
          )}
        </div>
        
        {showForm ? (
          <div className="mb-8">
            <ServiceForm
              title="Hotel Reservation"
              fields={formFields}
              initialData={editingReservation || undefined}
              onSubmit={editingReservation ? handleUpdateReservation : handleAddReservation}
              isEdit={!!editingReservation}
              onCancel={handleCancel}
            />
          </div>
        ) : null}
        
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading hotel reservations...</p>
          </div>
        ) : (
          <ServiceList
            data={hotelReservations}
            columns={columns}
            onEdit={handleEdit}
            onDelete={handleDeleteReservation}
            emptyMessage="No hotel reservations found. Add your first reservation!"
          />
        )}
      </div>
    </div>
  );
};

export default HotelReservationPage;