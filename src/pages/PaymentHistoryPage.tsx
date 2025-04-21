import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, ArrowUpDown, Search, Filter, Check } from 'lucide-react';
import { useCards } from '../context/CardContext';
import { formatCurrency } from '../utils/mockData';
import { generateReceipt } from '../utils/receiptGenerator';

const PaymentHistoryPage: React.FC = () => {
  const { payments, cards, loading } = useCards();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [selectedCardIds, setSelectedCardIds] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<{ from: string; to: string }>({ from: '', to: '' });
  
  // Filter payments based on search, card selection, and date range
  const filteredPayments = payments.filter(payment => {
    // Search term filter
    if (searchTerm) {
      const matchesId = payment.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesReceiptId = payment.receiptId?.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (!matchesId && !matchesReceiptId) {
        return false;
      }
    }
    
    // Card filter
    if (selectedCardIds.length > 0) {
      const paymentCardIds = payment.cards.map(card => card.cardId);
      if (!selectedCardIds.some(id => paymentCardIds.includes(id))) {
        return false;
      }
    }
    
    // Date range filter
    if (dateRange.from && new Date(payment.date) < new Date(dateRange.from)) {
      return false;
    }
    
    if (dateRange.to && new Date(payment.date) > new Date(dateRange.to)) {
      return false;
    }
    
    return true;
  });
  
  const handleDownloadReceipt = (payment: typeof payments[0]) => {
    generateReceipt(payment, cards);
  };
  
  const handleCardFilterToggle = (cardId: string) => {
    setSelectedCardIds(prev => 
      prev.includes(cardId)
        ? prev.filter(id => id !== cardId)
        : [...prev, cardId]
    );
  };
  
  const clearFilters = () => {
    setSelectedCardIds([]);
    setDateRange({ from: '', to: '' });
    setShowFilter(false);
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Payment History</h1>
            <p className="text-gray-600 mt-1">View all your past payments</p>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="relative flex items-center flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by transaction ID or receipt ID..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <button
                className={`flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  showFilter ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-white'
                }`}
                onClick={() => setShowFilter(!showFilter)}
              >
                <Filter className="mr-2 h-4 w-4" />
                Filter
                {(selectedCardIds.length > 0 || dateRange.from || dateRange.to) && (
                  <span className="ml-1 bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                    {selectedCardIds.length + (dateRange.from || dateRange.to ? 1 : 0)}
                  </span>
                )}
              </button>
            </div>
            
            {showFilter && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex flex-col sm:flex-row justify-between items-start mb-4">
                  <h4 className="font-medium text-gray-700 mb-2 sm:mb-0">Filter Payments</h4>
                  <button
                    className="text-sm text-blue-600 hover:text-blue-500"
                    onClick={clearFilters}
                  >
                    Clear all filters
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">By Card</p>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {cards.map((card) => (
                        <div key={card.id} className="flex items-center">
                          <button
                            className={`flex items-center w-full p-2 rounded-md text-left ${
                              selectedCardIds.includes(card.id)
                                ? 'bg-blue-50 text-blue-700'
                                : 'hover:bg-gray-100'
                            }`}
                            onClick={() => handleCardFilterToggle(card.id)}
                          >
                            <div
                              className="h-4 w-4 rounded-full mr-2"
                              style={{ backgroundColor: card.color }}
                            ></div>
                            <span className="flex-1 text-sm">{card.bankName} {card.cardName}</span>
                            {selectedCardIds.includes(card.id) && (
                              <Check className="h-4 w-4 text-blue-600" />
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">By Date</p>
                    <div className="space-y-3">
                      <div>
                        <label htmlFor="date-from" className="block text-sm text-gray-500 mb-1">
                          From
                        </label>
                        <input
                          type="date"
                          id="date-from"
                          className="block w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          value={dateRange.from}
                          onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                        />
                      </div>
                      <div>
                        <label htmlFor="date-to" className="block text-sm text-gray-500 mb-1">
                          To
                        </label>
                        <input
                          type="date"
                          id="date-to"
                          className="block w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          value={dateRange.to}
                          onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="overflow-x-auto">
            {filteredPayments.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No payments found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm || selectedCardIds.length > 0 || dateRange.from || dateRange.to
                    ? 'Try adjusting your search or filter criteria'
                    : 'Make your first payment to see it here'}
                </p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Transaction ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cards
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center">
                        Amount
                        <ArrowUpDown className="h-4 w-4 ml-1" />
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(payment.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{payment.id}</div>
                        <div className="text-sm text-gray-500">Receipt: {payment.receiptId}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col space-y-1">
                          {payment.cards.map(({ cardId, amount }) => {
                            const card = cards.find(c => c.id === cardId);
                            return card ? (
                              <div key={cardId} className="flex items-center">
                                <div
                                  className="h-3 w-3 rounded-full mr-2"
                                  style={{ backgroundColor: card.color }}
                                ></div>
                                <span className="text-sm text-gray-600 truncate max-w-xs">
                                  {card.bankName} {card.cardName}
                                </span>
                              </div>
                            ) : null;
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(payment.totalAmount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleDownloadReceipt(payment)}
                          className="text-blue-600 hover:text-blue-900 flex items-center justify-end"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Receipt
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistoryPage;