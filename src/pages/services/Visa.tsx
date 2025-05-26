import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { PlusCircle } from 'lucide-react';
import { db } from '../../firebase/config';
import { Visa } from '../../types';
import { COLLECTIONS, addService, updateService, deleteService, formatCurrency } from '../../utils/serviceUtils';
import Navbar from '../../components/Layout/Navbar';
import ServiceForm from '../../components/Common/ServiceForm';
import ServiceList from '../../components/Common/ServiceList';

const VisaPage: React.FC = () => {
  const [visas, setVisas] = useState<Visa[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingVisa, setEditingVisa] = useState<Visa | null>(null);

  const fetchVisas = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, COLLECTIONS.VISA), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const visaList: Visa[] = [];
      querySnapshot.forEach((doc) => {
        visaList.push({ id: doc.id, ...doc.data() } as Visa);
      });
      
      setVisas(visaList);
    } catch (error) {
      console.error('Error fetching visas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisas();
  }, []);

  const handleAddVisa = async (data: Omit<Visa, 'id' | 'createdAt' | 'updatedAt'>) => {
    await addService<Visa>(COLLECTIONS.VISA, data);
    setShowForm(false);
    fetchVisas();
  };

  const handleUpdateVisa = async (data: Partial<Visa>) => {
    if (editingVisa?.id) {
      await updateService<Visa>(COLLECTIONS.VISA, editingVisa.id, data);
      setEditingVisa(null);
      setShowForm(false);
      fetchVisas();
    }
  };

  const handleDeleteVisa = async (id: string) => {
    await deleteService(COLLECTIONS.VISA, id);
    fetchVisas();
  };

  const handleEdit = (visa: Visa) => {
    setEditingVisa(visa);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingVisa(null);
  };

  const formFields = [
    { name: 'country', label: 'Country', type: 'text' as const, required: true },
    { name: 'applicationDate', label: 'Application Date', type: 'date' as const, required: true },
    { name: 'customerQuote', label: 'Customer Quote (₹)', type: 'number' as const, required: true },
    { name: 'supplierCost', label: 'Supplier Cost (₹)', type: 'number' as const, required: true },
  ];

  const columns = [
    { key: 'country', header: 'Country' },
    { key: 'applicationDate', header: 'Application Date' },
    { 
      key: 'customerQuote', 
      header: 'Customer Quote',
      render: (item: Visa) => formatCurrency(item.customerQuote)
    },
    { 
      key: 'supplierCost', 
      header: 'Supplier Cost',
      render: (item: Visa) => formatCurrency(item.supplierCost)
    },
    { key: 'profit', header: 'Profit' },
    { key: 'actions', header: 'Actions' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Visa Services</h1>
          
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <PlusCircle size={20} className="mr-2" />
              Add New Visa
            </button>
          )}
        </div>
        
        {showForm ? (
          <div className="mb-8">
            <ServiceForm
              title="Visa"
              fields={formFields}
              initialData={editingVisa || undefined}
              onSubmit={editingVisa ? handleUpdateVisa : handleAddVisa}
              isEdit={!!editingVisa}
              onCancel={handleCancel}
            />
          </div>
        ) : null}
        
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading visa services...</p>
          </div>
        ) : (
          <ServiceList
            data={visas}
            columns={columns}
            onEdit={handleEdit}
            onDelete={handleDeleteVisa}
            emptyMessage="No visa services found. Add your first visa service!"
          />
        )}
      </div>
    </div>
  );
};

export default VisaPage;