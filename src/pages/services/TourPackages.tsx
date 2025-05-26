import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { PlusCircle } from 'lucide-react';
import { db } from '../../firebase/config';
import { TourPackage } from '../../types';
import { COLLECTIONS, addService, updateService, deleteService, formatCurrency } from '../../utils/serviceUtils';
import Navbar from '../../components/Layout/Navbar';
import ServiceForm from '../../components/Common/ServiceForm';
import ServiceList from '../../components/Common/ServiceList';

const TourPackagesPage: React.FC = () => {
  const [tourPackages, setTourPackages] = useState<TourPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPackage, setEditingPackage] = useState<TourPackage | null>(null);

  const fetchTourPackages = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, COLLECTIONS.TOUR_PACKAGE), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const packages: TourPackage[] = [];
      querySnapshot.forEach((doc) => {
        packages.push({ id: doc.id, ...doc.data() } as TourPackage);
      });
      
      setTourPackages(packages);
    } catch (error) {
      console.error('Error fetching tour packages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTourPackages();
  }, []);

  const handleAddPackage = async (data: Omit<TourPackage, 'id' | 'createdAt' | 'updatedAt'>) => {
    await addService<TourPackage>(COLLECTIONS.TOUR_PACKAGE, data);
    setShowForm(false);
    fetchTourPackages();
  };

  const handleUpdatePackage = async (data: Partial<TourPackage>) => {
    if (editingPackage?.id) {
      await updateService<TourPackage>(COLLECTIONS.TOUR_PACKAGE, editingPackage.id, data);
      setEditingPackage(null);
      setShowForm(false);
      fetchTourPackages();
    }
  };

  const handleDeletePackage = async (id: string) => {
    await deleteService(COLLECTIONS.TOUR_PACKAGE, id);
    fetchTourPackages();
  };

  const handleEdit = (pkg: TourPackage) => {
    setEditingPackage(pkg);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingPackage(null);
  };

  const formFields = [
    { name: 'destination', label: 'Destination', type: 'text' as const, required: true },
    { name: 'startDate', label: 'Start Date', type: 'date' as const, required: true },
    { name: 'endDate', label: 'End Date', type: 'date' as const, required: true },
    { name: 'flightCost', label: 'Flight Cost (₹)', type: 'number' as const },
    { name: 'carCost', label: 'Car Cost (₹)', type: 'number' as const },
    { name: 'tourManagerCost', label: 'Tour Manager Cost (₹)', type: 'number' as const },
    { name: 'totalCost', label: 'Total Cost Paid (₹)', type: 'number' as const, required: true },
    { name: 'customerQuote', label: 'Customer Quote (₹)', type: 'number' as const, required: true },
    { name: 'supplierCost', label: 'Supplier Cost (₹)', type: 'number' as const, required: true },
  ];

  const columns = [
    { key: 'destination', header: 'Destination' },
    { 
      key: 'dates', 
      header: 'Dates',
      render: (item: TourPackage) => `${item.startDate} - ${item.endDate}`
    },
    { 
      key: 'customerQuote', 
      header: 'Customer Quote',
      render: (item: TourPackage) => formatCurrency(item.customerQuote)
    },
    { 
      key: 'totalCost', 
      header: 'Total Cost',
      render: (item: TourPackage) => formatCurrency(item.totalCost)
    },
    { key: 'profit', header: 'Profit' },
    { key: 'actions', header: 'Actions' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Tour Packages</h1>
          
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <PlusCircle size={20} className="mr-2" />
              Add New Package
            </button>
          )}
        </div>
        
        {showForm ? (
          <div className="mb-8">
            <ServiceForm
              title="Tour Package"
              fields={formFields}
              initialData={editingPackage || undefined}
              onSubmit={editingPackage ? handleUpdatePackage : handleAddPackage}
              isEdit={!!editingPackage}
              onCancel={handleCancel}
            />
          </div>
        ) : null}
        
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading tour packages...</p>
          </div>
        ) : (
          <ServiceList
            data={tourPackages}
            columns={columns}
            onEdit={handleEdit}
            onDelete={handleDeletePackage}
            emptyMessage="No tour packages found. Add your first package!"
          />
        )}
      </div>
    </div>
  );
};

export default TourPackagesPage;