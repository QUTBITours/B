import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { PlusCircle } from 'lucide-react';
import { db } from '../../firebase/config';
import { Vajabhat } from '../../types';
import { COLLECTIONS, addService, updateService, deleteService, formatCurrency } from '../../utils/serviceUtils';
import Navbar from '../../components/Layout/Navbar';
import ServiceForm from '../../components/Common/ServiceForm';
import ServiceList from '../../components/Common/ServiceList';

const VajabhatPage: React.FC = () => {
  const [vajabhats, setVajabhats] = useState<Vajabhat[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingVajabhat, setEditingVajabhat] = useState<Vajabhat | null>(null);

  const fetchVajabhats = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, COLLECTIONS.VAJABHAT), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const vajabhatList: Vajabhat[] = [];
      querySnapshot.forEach((doc) => {
        vajabhatList.push({ id: doc.id, ...doc.data() } as Vajabhat);
      });
      
      setVajabhats(vajabhatList);
    } catch (error) {
      console.error('Error fetching vajabhats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVajabhats();
  }, []);

  const handleAddVajabhat = async (data: Omit<Vajabhat, 'id' | 'createdAt' | 'updatedAt'>) => {
    await addService<Vajabhat>(COLLECTIONS.VAJABHAT, data);
    setShowForm(false);
    fetchVajabhats();
  };

  const handleUpdateVajabhat = async (data: Partial<Vajabhat>) => {
    if (editingVajabhat?.id) {
      await updateService<Vajabhat>(COLLECTIONS.VAJABHAT, editingVajabhat.id, data);
      setEditingVajabhat(null);
      setShowForm(false);
      fetchVajabhats();
    }
  };

  const handleDeleteVajabhat = async (id: string) => {
    await deleteService(COLLECTIONS.VAJABHAT, id);
    fetchVajabhats();
  };

  const handleEdit = (vajabhat: Vajabhat) => {
    setEditingVajabhat(vajabhat);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingVajabhat(null);
  };

  const formFields = [
    { name: 'amount', label: 'Amount Paid (₹)', type: 'number' as const, required: true },
    { name: 'date', label: 'Date', type: 'date' as const, required: true },
    { name: 'customerQuote', label: 'Customer Quote (₹)', type: 'number' as const, required: true },
    { name: 'supplierCost', label: 'Supplier Cost (₹)', type: 'number' as const, required: true },
  ];

  const columns = [
    { 
      key: 'amount', 
      header: 'Amount',
      render: (item: Vajabhat) => formatCurrency(item.amount)
    },
    { key: 'date', header: 'Date' },
    { 
      key: 'customerQuote', 
      header: 'Customer Quote',
      render: (item: Vajabhat) => formatCurrency(item.customerQuote)
    },
    { 
      key: 'supplierCost', 
      header: 'Supplier Cost',
      render: (item: Vajabhat) => formatCurrency(item.supplierCost)
    },
    { key: 'profit', header: 'Profit' },
    { key: 'actions', header: 'Actions' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Vajabhat</h1>
          
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <PlusCircle size={20} className="mr-2" />
              Add New Vajabhat
            </button>
          )}
        </div>
        
        {showForm ? (
          <div className="mb-8">
            <ServiceForm
              title="Vajabhat"
              fields={formFields}
              initialData={editingVajabhat || undefined}
              onSubmit={editingVajabhat ? handleUpdateVajabhat : handleAddVajabhat}
              isEdit={!!editingVajabhat}
              onCancel={handleCancel}
            />
          </div>
        ) : null}
        
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading vajabhats...</p>
          </div>
        ) : (
          <ServiceList
            data={vajabhats}
            columns={columns}
            onEdit={handleEdit}
            onDelete={handleDeleteVajabhat}
            emptyMessage="No vajabhats found. Add your first vajabhat!"
          />
        )}
      </div>
    </div>
  );
};

export default VajabhatPage;