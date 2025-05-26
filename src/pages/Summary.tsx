import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { Download, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { db } from '../firebase/config';
import { COLLECTIONS, formatCurrency, calculateProfit } from '../utils/serviceUtils';
import { FinancialSummary, BaseService } from '../types';
import Navbar from '../components/Layout/Navbar';
import * as XLSX from 'xlsx';

const Summary: React.FC = () => {
  const [summary, setSummary] = useState<FinancialSummary>({
    totalServices: 0,
    totalRevenue: 0,
    totalCost: 0,
    totalProfit: 0,
    serviceBreakdown: {}
  });
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('month'); // 'month', 'year', 'all'
  const [allData, setAllData] = useState<any[]>([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Define start date for filtering
      let startDate = 0;
      const now = new Date();
      
      if (period === 'month') {
        // Start of current month
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        startDate = startOfMonth.getTime();
      } else if (period === 'year') {
        // Start of current year
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        startDate = startOfYear.getTime();
      }
      
      // Collection names and their display names
      const serviceCollections = [
        { name: COLLECTIONS.FLIGHT_BOOKING, displayName: 'Flight Bookings' },
        { name: COLLECTIONS.HOTEL_RESERVATION, displayName: 'Hotel Reservations' },
        { name: COLLECTIONS.CAR_RENTAL, displayName: 'Car Rentals' },
        { name: COLLECTIONS.VISA, displayName: 'Visa Services' },
        { name: COLLECTIONS.FOREIGN_EXCHANGE, displayName: 'Foreign Exchange' },
        { name: COLLECTIONS.TOUR_PACKAGE, displayName: 'Tour Packages' },
        { name: COLLECTIONS.TRAIN_BOOKING, displayName: 'Train Bookings' },
        { name: COLLECTIONS.VAJABHAT, displayName: 'Vajabhat' },
      ];
      
      // Initialize summary
      const newSummary: FinancialSummary = {
        totalServices: 0,
        totalRevenue: 0,
        totalCost: 0,
        totalProfit: 0,
        serviceBreakdown: {}
      };
      
      const allRecords: any[] = [];
      
      // Fetch data from each collection
      for (const service of serviceCollections) {
        let q;
        
        if (period === 'all') {
          q = query(collection(db, service.name), orderBy('createdAt', 'desc'));
        } else {
          q = query(
            collection(db, service.name), 
            where('createdAt', '>=', startDate), 
            orderBy('createdAt', 'desc')
          );
        }
        
        const querySnapshot = await getDocs(q);
        
        let count = 0;
        let revenue = 0;
        let cost = 0;
        
        querySnapshot.forEach((doc) => {
          const data = doc.data() as BaseService;
          count++;
          revenue += data.customerQuote || 0;
          cost += data.supplierCost || 0;
          
          // Add to all records for export
          allRecords.push({
            id: doc.id,
            serviceType: service.displayName,
            ...data
          });
        });
        
        const profit = revenue - cost;
        
        newSummary.serviceBreakdown[service.displayName] = {
          count,
          revenue,
          cost,
          profit
        };
        
        newSummary.totalServices += count;
        newSummary.totalRevenue += revenue;
        newSummary.totalCost += cost;
      }
      
      newSummary.totalProfit = newSummary.totalRevenue - newSummary.totalCost;
      
      setSummary(newSummary);
      setAllData(allRecords);
    } catch (error) {
      console.error('Error fetching summary data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [period]);

  const handleExport = () => {
    // Prepare data for export
    const exportData = allData.map(item => {
      const profit = calculateProfit(item.customerQuote || 0, item.supplierCost || 0);
      
      // Convert timestamps to readable dates
      const createdAt = new Date(item.createdAt).toLocaleDateString();
      
      return {
        'Service Type': item.serviceType,
        'Created On': createdAt,
        'Customer Quote (₹)': item.customerQuote || 0,
        'Supplier Cost (₹)': item.supplierCost || 0,
        'Profit (₹)': profit,
        ...item // Include all other fields
      };
    });
    
    // Create workbook and add data
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'QT Holidays Data');
    
    // Generate a name with the current date
    const fileName = `QT_Holidays_Data_${new Date().toISOString().split('T')[0]}.xlsx`;
    
    // Trigger download
    XLSX.writeFile(wb, fileName);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Financial Summary</h1>
          
          <div className="flex items-center space-x-4">
            <div className="inline-flex rounded-md shadow-sm">
              <button
                type="button"
                onClick={() => setPeriod('month')}
                className={`relative inline-flex items-center px-4 py-2 rounded-l-md border ${
                  period === 'month'
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                This Month
              </button>
              <button
                type="button"
                onClick={() => setPeriod('year')}
                className={`relative inline-flex items-center px-4 py-2 border-t border-b ${
                  period === 'year'
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                This Year
              </button>
              <button
                type="button"
                onClick={() => setPeriod('all')}
                className={`relative inline-flex items-center px-4 py-2 rounded-r-md border ${
                  period === 'all'
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                All Time
              </button>
            </div>
            
            <button
              onClick={handleExport}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              <Download size={20} className="mr-2" />
              Download Data
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading summary data...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-medium text-gray-500">Total Services</h2>
                </div>
                <p className="mt-2 text-3xl font-bold text-gray-900">{summary.totalServices}</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-medium text-gray-500">Total Revenue</h2>
                  <ArrowUpRight className="h-5 w-5 text-green-500" />
                </div>
                <p className="mt-2 text-3xl font-bold text-gray-900">{formatCurrency(summary.totalRevenue)}</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-medium text-gray-500">Total Expenses</h2>
                  <ArrowDownRight className="h-5 w-5 text-red-500" />
                </div>
                <p className="mt-2 text-3xl font-bold text-gray-900">{formatCurrency(summary.totalCost)}</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-medium text-gray-500">Total Profit</h2>
                  {summary.totalProfit >= 0 ? (
                    <ArrowUpRight className="h-5 w-5 text-green-500" />
                  ) : (
                    <ArrowDownRight className="h-5 w-5 text-red-500" />
                  )}
                </div>
                <p className={`mt-2 text-3xl font-bold ${
                  summary.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatCurrency(summary.totalProfit)}
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Service Breakdown</h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Service
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Count
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Revenue
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cost
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Profit
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {Object.entries(summary.serviceBreakdown).map(([service, data]) => (
                      <tr key={service}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {service}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {data.count}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(data.revenue)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(data.cost)}
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                          data.profit >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {formatCurrency(data.profit)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Summary;