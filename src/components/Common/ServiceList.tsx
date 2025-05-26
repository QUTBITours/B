import React, { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { BaseService } from '../../types';
import { formatCurrency, calculateProfit } from '../../utils/serviceUtils';

interface ServiceListProps<T extends BaseService> {
  data: T[];
  columns: {
    key: keyof T | 'profit' | 'actions';
    header: string;
    render?: (item: T) => React.ReactNode;
  }[];
  onEdit: (item: T) => void;
  onDelete: (id: string) => void;
  emptyMessage?: string;
}

function ServiceList<T extends BaseService>({
  data,
  columns,
  onEdit,
  onDelete,
  emptyMessage = 'No records found'
}: ServiceListProps<T>) {
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setDeleteConfirm(id);
  };

  const confirmDelete = (id: string) => {
    onDelete(id);
    setDeleteConfirm(null);
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.header}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-4 whitespace-nowrap text-center text-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  {columns.map((column) => {
                    if (column.key === 'actions') {
                      return (
                        <td key={`${item.id}-${String(column.key)}`} className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex space-x-2 justify-end">
                            <button
                              onClick={() => onEdit(item)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Pencil size={18} />
                            </button>
                            
                            {deleteConfirm === item.id ? (
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => confirmDelete(item.id!)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Confirm
                                </button>
                                <button
                                  onClick={cancelDelete}
                                  className="text-gray-600 hover:text-gray-900"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleDeleteClick(item.id!)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 size={18} />
                              </button>
                            )}
                          </div>
                        </td>
                      );
                    }
                    
                    if (column.key === 'profit') {
                      return (
                        <td key={`${item.id}-profit`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(calculateProfit(item.customerQuote, item.supplierCost))}
                        </td>
                      );
                    }
                    
                    if (column.render) {
                      return (
                        <td key={`${item.id}-${String(column.key)}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {column.render(item)}
                        </td>
                      );
                    }
                    
                    return (
                      <td key={`${item.id}-${String(column.key)}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {String(item[column.key as keyof T])}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ServiceList;