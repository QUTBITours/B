import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { PlusCircle } from 'lucide-react';
import { db } from '../../firebase/config';
import { ForeignExchange } from '../../types';
import { COLLECTIONS, addService, updateService, deleteService, formatCurrency } from '../../utils/serviceUtils';
import Navbar from '../../components/Layout/Navbar';
import ServiceForm from '../../components/Common/ServiceForm';
import ServiceList from '../../components/Common/ServiceList';

const ForeignExchangePage: React.FC = () => {
  const [exchanges, setExchanges] = useState<ForeignExchange[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingExchange, setEditingExchange] = useState<ForeignExchange | null>(null);

  const fetchExchanges = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, COLLECTIONS.FOREIGN_EXCHANGE), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const exchangeList: ForeignExchange[] = [];
      querySnapshot.forEach((doc) => {
        exchangeList.push({ id: doc.id, ...doc.data() } as ForeignExchange);
      });
      
      setExchanges(exchangeList);
    } catch (error) {
      console.error('Error fetching foreign exchanges:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExchanges();
  }, []);

  const handleAddExchange = async (data: Omit<ForeignExchange, 'id' | 'createdAt' | 'updatedAt'>) => {
    await addService<ForeignExchange>(COLLECTIONS.FOREIGN_EXCHANGE, data);
    setShowForm(false);
    fetchExchanges();
  };

  const handleUpdateExchange = async (data: Partial<ForeignExchange>) => {
    if (editingExchange?.id) {
      await updateService<ForeignExchange>(COLLECTIONS.FOREIGN_EXCHANGE, editingExchange.id, data);
      setEditingExchange(null);
      setShowForm(false);
      fetchExchanges();
    }
  };

  const handleDeleteExchange = async (id: string) => {
    await deleteService(COLLECTIONS.FOREIGN_EXCHANGE, id);
    fetchExchanges();
  };

  const handleEdit = (exchange: ForeignExchange) => {
    setEditingExchange(exchange);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingExchange(null);
  };

  const formFields = [
    { name: 'currency', label: 'Currency', type: 'text' as const, required: true },
    { name: 'rate', label: 'Exchange Rate', type: 'number' as const, required: true },
    { name: 'customerQuote', label: 'Customer Quote (₹)', type: 'number' as const, required: true },
    { name: 'supplierCost', label: 'Supplier Cost (₹)', type: 'number' as const, required: true },
  ];

  const columns = [
    { key: 'currency', header: 'Currency' },
    { key: 'rate', header: 'Rate' },
    { 
      key: 'customerQuote', 
      header: 'Customer Quote',
      render: (item: ForeignExchange) => formatCurrency(item.customerQuote)
    },
    { 
      key: 'supplierCost', 
      header: 'Supplier Cost',
      render: (item: ForeignExchange) => formatCurrency(item.supplierCost)
    },
    { key: 'profit', header: 'Profit' },
    { key: 'actions', header: 'Actions' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Foreign Exchange</h1>
          
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <PlusCircle size={20} className="mr-2" />
              Add New Exchange
            </button>
          )}
        </div>
        
        {showForm ? (
          <div className="mb-8">
            <ServiceForm
              title="Foreign Exchange"
              fields={formFields}
              initialData={editingExchange || undefined}
              onSubmit={editingExchange ? handleUpdateExchange : handleAddExchange}
              isEdit={!!editingExchange}
              onCancel={handleCancel}
            />
          </div>
        ) : null}
        
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading foreign exchanges...</p>
          </div>
        ) : (
          <ServiceList
            data={exchanges}
            columns={columns}
            onEdit={handleEdit}
            onDelete={handleDeleteExchange}
            emptyMessage="No foreign exchanges found. Add your first exchange!"
          />
        )}
      </div>
    </div>
  );
};

export default ForeignExchangePage;