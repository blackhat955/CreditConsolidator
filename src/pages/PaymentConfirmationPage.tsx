import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Download, CreditCard, Ban as Bank, Smartphone } from 'lucide-react';
import { Payment } from '../types';
import { formatCurrency } from '../utils/mockData';
import { useCards } from '../context/CardContext';
import { generateReceipt } from '../utils/receiptGenerator';

const PaymentConfirmationPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cards } = useCards();
  const [selectedMethod, setSelectedMethod] = useState<string>('bank_transfer');
  const [processing, setProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  
  // Get payment data from location state or redirect to payment page if missing
  const payment = location.state?.payment as Payment | undefined;
  
  if (!payment) {
    navigate('/payment');
    return null;
  }
  
  const handlePaymentMethodSelect = (method: string) => {
    setSelectedMethod(method);
  };
  
  const handleMakePayment = () => {
    setProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      setPaymentComplete(true);
    }, 2000);
  };
  
  const handleDownloadReceipt = () => {
    generateReceipt(payment, cards);
  };
  
  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'bank_transfer':
        return 'Bank Transfer';
      case 'debit_card':
        return 'Debit Card';
      case 'apple_pay':
        return 'Apple Pay';
      case 'google_pay':
        return 'Google Pay';
      default:
        return method;
    }
  };
  
  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'bank_transfer':
        return <Bank className="h-5 w-5" />;
      case 'debit_card':
        return <CreditCard className="h-5 w-5" />;
      case 'google_pay':
        return <Smartphone className="h-5 w-5" />;
      case 'apple_pay':
        return (
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.6 12.9c0-1.7 1.4-2.5 1.5-2.6-.8-1.2-2-1.3-2.4-1.3-1-.1-2 .6-2.5.6s-1.3-.6-2.2-.6c-1.1 0-2.1.7-2.7 1.7-1.2 2-.3 5 .8 6.6.5.8 1.2 1.7 2 1.6.8 0 1.1-.5 2.1-.5s1.3.5 2.1.5c.9 0 1.5-.8 2-1.6.6-.9.9-1.8.9-1.9-.1 0-1.8-.7-1.8-2.8z" />
            <path d="M15.9 7.2c.7-.9 1.2-2.1 1-3.3-1 0-2.2.7-2.9 1.5-.6.7-1.2 1.9-1 3.1 1.1.1 2.2-.6 2.9-1.3z" />
          </svg>
        );
      default:
        return <CreditCard className="h-5 w-5" />;
    }
  };
  
  return (
    <div className="bg-gray-50 min-h-screen pt-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!paymentComplete && (
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            Back to Payment
          </button>
        )}
        
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">
              {paymentComplete ? 'Payment Successful' : 'Complete Payment'}
            </h1>
            <p className="text-gray-600 mt-1">
              {paymentComplete ? 'Your payment has been processed successfully' : 'Select your payment method'}
            </p>
          </div>
          
          <div className="p-6">
            {paymentComplete ? (
              <div className="text-center py-6">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="mt-4 text-lg font-medium text-gray-900">Payment of {formatCurrency(payment.totalAmount)} successful!</h2>
                <p className="mt-2 text-sm text-gray-500">
                  Transaction ID: {payment.id}<br />
                  Receipt ID: {payment.receiptId}
                </p>
                
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-3">Payment Details</h3>
                  <div className="space-y-2">
                    {payment.cards.map(({ cardId, amount }) => {
                      const card = cards.find(c => c.id === cardId);
                      return card ? (
                        <div key={cardId} className="flex justify-between text-sm">
                          <span className="text-gray-600">{card.bankName} {card.cardName}</span>
                          <span className="font-medium">{formatCurrency(amount)}</span>
                        </div>
                      ) : null;
                    })}
                    <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between font-medium">
                      <span>Total</span>
                      <span>{formatCurrency(payment.totalAmount)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
                  <button
                    onClick={handleDownloadReceipt}
                    className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Receipt
                  </button>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Back to Dashboard
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h3 className="text-md font-medium text-gray-700 mb-3">Amount to Pay</h3>
                  <p className="text-3xl font-bold text-gray-900">{formatCurrency(payment.totalAmount)}</p>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-md font-medium text-gray-700 mb-3">Payment Method</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {['bank_transfer', 'debit_card', 'apple_pay', 'google_pay'].map((method) => (
                      <div
                        key={method}
                        className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                          selectedMethod === method
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                        onClick={() => handlePaymentMethodSelect(method)}
                      >
                        <div className="flex items-center">
                          <div className={`p-2 rounded-full mr-3 ${
                            selectedMethod === method ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {getPaymentMethodIcon(method)}
                          </div>
                          <div className="flex-1">
                            <p className={`font-medium ${selectedMethod === method ? 'text-blue-700' : 'text-gray-800'}`}>
                              {getPaymentMethodLabel(method)}
                            </p>
                            <p className="text-sm text-gray-500">Pay securely</p>
                          </div>
                          <div>
                            <div className={`h-5 w-5 rounded-full border-2 ${
                              selectedMethod === method 
                                ? 'border-blue-500 bg-blue-500' 
                                : 'border-gray-300'
                            } flex items-center justify-center`}>
                              {selectedMethod === method && (
                                <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-6">
                  <button
                    className={`w-full py-3 rounded-lg text-white font-medium ${
                      processing
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                    disabled={processing}
                    onClick={handleMakePayment}
                  >
                    {processing ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing Payment...
                      </span>
                    ) : (
                      `Pay ${formatCurrency(payment.totalAmount)}`
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentConfirmationPage;