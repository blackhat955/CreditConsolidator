import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Info, CheckCircle } from 'lucide-react';
import { useCards } from '../context/CardContext';
import { formatCurrency } from '../utils/mockData';

const MakePaymentPage: React.FC = () => {
  const { cards, makePayment, distributeAmount } = useCards();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'consolidated' | 'individual'>('consolidated');
  const [totalAmount, setTotalAmount] = useState(0);
  const [cardPayments, setCardPayments] = useState<{ [cardId: string]: number }>({});
  const [loading, setLoading] = useState(false);
  
  // Initialize with pre-selected card or auto-distribution if passed
  useEffect(() => {
    if (location.state) {
      const { selectedCardId, autoDistribution } = location.state as { 
        selectedCardId?: string;
        autoDistribution?: { [cardId: string]: number };
      };
      
      if (selectedCardId) {
        const card = cards.find(c => c.id === selectedCardId);
        if (card) {
          setActiveTab('individual');
          const initialPayments = { [selectedCardId]: card.minimumDue };
          setCardPayments(initialPayments);
          setTotalAmount(card.minimumDue);
        }
      } else if (autoDistribution) {
        setCardPayments(autoDistribution);
        setTotalAmount(
          Object.values(autoDistribution).reduce((sum, amount) => sum + amount, 0)
        );
      }
    } else {
      // Default: initialize with minimum payments for all cards
      const initialPayments = cards.reduce((acc, card) => {
        acc[card.id] = 0;
        return acc;
      }, {} as { [cardId: string]: number });
      
      setCardPayments(initialPayments);
    }
  }, [cards, location.state]);
  
  // const handleConsolidatedAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const amount = parseFloat(e.target.value) || 0;
  //   setTotalAmount(amount);
    
  //   // Distribute the amount using the smart algorithm
  //   if (amount > 0) {
  //     const { distributeAmount } = useCards();
  //     const distribution = distributeAmount(amount);
  //     setCardPayments(distribution);
  //   } else {
  //     // Zero out all payments
  //     const resetPayments = Object.keys(cardPayments).reduce((acc, cardId) => {
  //       acc[cardId] = 0;
  //       return acc;
  //     }, {} as { [cardId: string]: number });
      
  //     setCardPayments(resetPayments);
  //   }
  // };

  const handleConsolidatedAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = parseFloat(e.target.value) || 0;
    setTotalAmount(amount);

    if (amount <= 0) {
      // zero out
      const reset: { [id: string]: number } = {};
      cards.forEach(c => (reset[c.id] = 0));
      setCardPayments(reset);
      return;
    }

    // 1) cover all minimum dues (or as much as we can)
    let remaining = amount;
    const byId: { [id: string]: number } = {};
    cards.forEach(card => {
      const payMin = Math.min(card.minimumDue, remaining);
      byId[card.id] = payMin;
      remaining -= payMin;
    });

    // 2) with whatever is left, pay down highest-outstanding balances first
    cards
      .slice()                          // copy
      .sort((a, b) => b.totalDue - a.totalDue)
      .forEach(card => {
        if (remaining <= 0) return;
        const already = byId[card.id];
        const canPayMore = card.totalDue - already;
        const extra = Math.min(canPayMore, remaining);
        byId[card.id] = already + extra;
        remaining -= extra;
      });

    setCardPayments(byId);
  };




  
  const handleIndividualAmountChange = (cardId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = e.target.value === '' ? 0 : parseFloat(e.target.value);
    
    // Ensure amount doesn't exceed card total due
    const card = cards.find(c => c.id === cardId);
    const maxAmount = card ? card.totalDue : 0;
    const newAmount = Math.min(Math.max(0, amount), maxAmount);
    
    const newPayments = { ...cardPayments, [cardId]: newAmount };
    setCardPayments(newPayments);
    
    // Update total amount
    const newTotal = Object.values(newPayments).reduce((sum, val) => sum + val, 0);
    setTotalAmount(newTotal);
  };
  
  const handleProceedToPayment = async () => {
    if (totalAmount <= 0) return;
    
    // Convert cardPayments to the format expected by makePayment
    const paymentData = {
      cards: Object.entries(cardPayments)
        .filter(([_, amount]) => amount > 0)
        .map(([cardId, amount]) => ({ cardId, amount })),
      totalAmount,
      paymentMethod: 'bank_transfer', // Default method
    };
    
    setLoading(true);
    
    try {
      const payment = await makePayment(paymentData);
      // Navigate to payment confirmation page
      navigate('/payment/confirm', { state: { payment } });
    } catch (error) {
      console.error('Payment failed', error);
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back
        </button>
        
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Make Payment</h1>
            <p className="text-gray-600 mt-1">Pay your credit card bills</p>
          </div>
          
          <div className="border-b border-gray-200">
            <nav className="flex divide-x divide-gray-200">
              <button
                className={`w-1/2 py-4 px-1 text-center text-sm font-medium ${
                  activeTab === 'consolidated'
                    ? 'text-blue-600 border-b-2 border-blue-500'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('consolidated')}
              >
                Pay Consolidated
              </button>
              <button
                className={`w-1/2 py-4 px-1 text-center text-sm font-medium ${
                  activeTab === 'individual'
                    ? 'text-blue-600 border-b-2 border-blue-500'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('individual')}
              >
                Pay Individually
              </button>
            </nav>
          </div>
          
          <div className="p-6">
            {activeTab === 'consolidated' ? (
              <>
                <div className="mb-6">
                  <label htmlFor="totalAmount" className="block text-sm font-medium text-gray-700 mb-1">
                    Total Amount to Pay
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      name="totalAmount"
                      id="totalAmount"
                      min="0"
                      step="100"
                      className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-12 sm:text-sm border-gray-300 rounded-md py-3"
                      placeholder="0.00"
                      value={totalAmount || ''}
                      onChange={handleConsolidatedAmountChange}
                    />
                  </div>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-4 mb-6 flex items-start">
                  <Info className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                  <p className="text-sm text-blue-700">
                    Our system will automatically distribute this amount across your cards, prioritizing minimum payments first and then the highest interest cards.
                  </p>
                </div>
                
                {totalAmount > 0 && (
                  <div className="mb-6">
                    <h3 className="text-md font-medium text-gray-700 mb-3">Payment Distribution</h3>
                    <div className="space-y-3">
                      {cards.map(card => {
                        const cardAmount = cardPayments[card.id] || 0;
                        const percentage = totalAmount > 0 ? Math.round((cardAmount / totalAmount) * 100) : 0;
                        
                        return (
                          <div key={card.id} className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex justify-between items-center mb-1">
                              <div className="flex items-center">
                                <div className="h-4 w-4 rounded-full mr-2" style={{ backgroundColor: card.color }}></div>
                                <p className="font-medium">{card.bankName} {card.cardName}</p>
                              </div>
                              <p className="font-medium">{formatCurrency(cardAmount)}</p>
                            </div>
                            <div className="flex items-center">
                              <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                                <div 
                                  className="h-2.5 rounded-full" 
                                  style={{ width: `${percentage}%`, backgroundColor: card.color }}
                                ></div>
                              </div>
                              <span className="text-xs text-gray-500 w-10 text-right">{percentage}%</span>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                              <span>Min due: {formatCurrency(card.minimumDue)}</span>
                              <span>Total due: {formatCurrency(card.totalDue)}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-6">
                {cards.map(card => (
                  <div key={card.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: card.color }}>
                          <CreditCard className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium">{card.bankName} {card.cardName}</p>
                          <p className="text-sm text-gray-500">{card.cardNumber}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Total Due</p>
                        <p className="font-medium">{formatCurrency(card.totalDue)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="flex-1 mr-4">
                        <label htmlFor={`amount-${card.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                          Amount to Pay
                        </label>
                        <div className="relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">$</span>
                          </div>
                          <input
                            type="number"
                            name={`amount-${card.id}`}
                            id={`amount-${card.id}`}
                            min="0"
                            max={card.totalDue}
                            step="100"
                            className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-12 sm:text-sm border-gray-300 rounded-md"
                            placeholder="0.00"
                            value={cardPayments[card.id] || ''}
                            onChange={(e) => handleIndividualAmountChange(card.id, e)}
                          />
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button
                          className="py-2 px-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          onClick={() => handleIndividualAmountChange(card.id, { target: { value: card.minimumDue.toString() } } as React.ChangeEvent<HTMLInputElement>)}
                        >
                          Min
                        </button>
                        <button
                          className="py-2 px-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          onClick={() => handleIndividualAmountChange(card.id, { target: { value: card.totalDue.toString() } } as React.ChangeEvent<HTMLInputElement>)}
                        >
                          Full
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-6 border-t border-gray-200 pt-6">
              <div className="flex justify-between mb-4">
                <p className="text-gray-700">Total Amount</p>
                <p className="text-xl font-bold text-gray-900">{formatCurrency(totalAmount)}</p>
              </div>
              
              <button
                className={`w-full py-3 rounded-lg text-white font-medium ${
                  totalAmount > 0 && !loading
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
                disabled={totalAmount <= 0 || loading}
                onClick={handleProceedToPayment}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  'Proceed to Pay'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MakePaymentPage;