import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { PlusCircle } from 'lucide-react';
import { db } from '../../firebase/config';
import { CarRental } from '../../types';
import { COLLECTIONS, addService, updateService, deleteService, formatCurrency } from '../../utils/serviceUtils';
import Navbar from '../../components/Layout/Navbar';
import ServiceForm from '../../components/Common/ServiceForm';
import ServiceList from '../../components/Common/ServiceList';

const CarRentalPage: React.FC = () => {
  const [carRentals, setCarRentals] = useState<CarRental[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRental, setEditingRental] = useState<CarRental | null>(null);

  const fetchCarRentals = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, COLLECTIONS.CAR_RENTAL), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const rentals: CarRental[] = [];
      querySnapshot.forEach((doc) => {
        rentals.push({ id: doc.id, ...doc.data() } as CarRental);
      });
      
      setCarRentals(rentals);
    } catch (error) {
      console.error('Error fetching car rentals:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCarRentals();
  }, []);

  const handleAddRental = async (data: Omit<CarRental, 'id' | 'createdAt' | 'updatedAt'>) => {
    await addService<CarRental>(COLLECTIONS.CAR_RENTAL, data);
    setShowForm(false);
    fetchCarRentals();
  };

  const handleUpdateRental = async (data: Partial<CarRental>) => {
    if (editingRental?.id) {
      await updateService<CarRental>(COLLECTIONS.CAR_RENTAL, editingRental.id, data);
      setEditingRental(null);
      setShowForm(false);
      fetchCarRentals();
    }
  };

  const handleDeleteRental = async (id: string) => {
    await deleteService(COLLECTIONS.CAR_RENTAL, id);
    fetchCarRentals();
  };

  const handleEdit = (rental: CarRental) => {
    setEditingRental(rental);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingRental(null);
  };

  const formFields = [
    { name: 'destination', label: 'Destination', type: 'text' as const, required: true },
    { name: 'date', label: 'Date', type: 'date' as const, required: true },
    { name: 'seaters', label: 'Number of Seats', type: 'number' as const, required: true },
    { name: 'customerQuote', label: 'Customer Quote (₹)', type: 'number' as const, required: true },
    { name: 'supplierCost', label: 'Supplier Cost (₹)', type: 'number' as const, required: true },
  ];

  const columns = [
    { key: 'destination', header: 'Destination' },
    { key: 'date', header: 'Date' },
    { key: 'seaters', header: 'Seats' },
    { 
      key: 'customerQuote', 
      header: 'Customer Quote',
      render: (item: CarRental) => formatCurrency(item.customerQuote)
    },
    { 
      key: 'supplierCost', 
      header: 'Supplier Cost',
      render: (item: CarRental) => formatCurrency(item.supplierCost)
    },
    { key: 'profit', header: 'Profit' },
    { key: 'actions', header: 'Actions' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Car Rentals</h1>
          
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <PlusCircle size={20} className="mr-2" />
              Add New Car Rental
            </button>
          )}
        </div>
        
        {showForm ? (
          <div className="mb-8">
            <ServiceForm
              title="Car Rental"
              fields={formFields}
              initialData={editingRental || undefined}
              onSubmit={editingRental ? handleUpdateRental : handleAddRental}
              isEdit={!!editingRental}
              onCancel={handleCancel}
            />
          </div>
        ) : null}
        
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading car rentals...</p>
          </div>
        ) : (
          <ServiceList
            data={carRentals}
            columns={columns}
            onEdit={handleEdit}
            onDelete={handleDeleteRental}
            emptyMessage="No car rentals found. Add your first rental!"
          />
        )}
      </div>
    </div>
  );
};

export default CarRentalPage;