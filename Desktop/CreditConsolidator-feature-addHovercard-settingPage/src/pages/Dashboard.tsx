import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, CreditCard, Calendar, ArrowRight } from 'lucide-react';
import { useCards } from '../context/CardContext';
import DuesSummary from '../components/ui/DuesSummary';
import CreditCardUI from '../components/ui/CreditCardUI';
import ReminderToggle from '../components/ui/ReminderToggle';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/mockData';

const Dashboard: React.FC = () => {
  const { cards, loading, distributeAmount } = useCards();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handlePayClick = (cardId: string) => {
    navigate('/payment', { state: { selectedCardId: cardId } });
  };

  const handleReminderChange = (type: 'email' | 'sms' | 'push', enabled: boolean) => {
    console.log(`${type} reminders ${enabled ? 'enabled' : 'disabled'}`);
    // In a real app, we would update the user preferences here
  };

  // Calculate the total due amount
  const totalDue = cards.reduce((sum, card) => sum + card.totalDue, 0);

  // Create a smart distribution for the total amount
  const autoDistribution = distributeAmount(totalDue);

  const handlePayAll = () => {
    navigate('/payment', { state: { autoDistribution } });
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
        <div className="mb-8">
        {/* TODO:implent here */}
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {"Durgesh"}</h1> 
          <p className="text-gray-600 mt-1">Here's an overview of your credit cards</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <DuesSummary cards={cards} />
            
            <div className="mt-8 bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">My Credit Cards</h2>
                <button 
                  className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
                  onClick={() => navigate('/cards')}
                >
                  View All
                  <ArrowRight className="ml-1 h-4 w-4" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {cards.slice(0, 2).map((card) => (
                  <CreditCardUI key={card.id} card={card} onPayClick={handlePayClick} />
                ))}
                <div className="w-full rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                     onClick={() => navigate('/cards')}>
                  <div className="text-center">
                    <div className="mx-auto h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <Plus className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Add New Card</h3>
                    <p className="mt-1 text-xs text-gray-500">Add a new credit card to manage</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-blue-600 rounded-xl shadow-md p-6 text-white">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Quick Pay</h2>
                  <p className="text-blue-100 mt-1">Pay all your dues in one go</p>
                </div>
                <div className="bg-white rounded-full p-2">
                  <CreditCard className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              
              <div className="mt-4">
                <p className="text-blue-100">Total Due Amount</p>
                <p className="text-2xl font-bold">{formatCurrency(totalDue)}</p>
              </div>
              
              <button
                onClick={handlePayAll}
                className="mt-6 w-full bg-white text-blue-600 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors"
              >
                Payment Summary Pay
              </button>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Upcoming Due Dates</h2>
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              
              <div className="space-y-4">
                {cards
                  .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                  .slice(0, 3)
                  .map((card) => (
                    <div key={card.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-800">{card.bankName}</p>
                        <p className="text-sm text-gray-500">{card.cardName}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          {new Date(card.dueDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                        </p>
                        <p className="text-sm text-gray-500">{formatCurrency(card.minimumDue)} min</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Reminders</h2>
              <div className="space-y-4">
                <ReminderToggle 
                  type="email" 
                  initialState={user?.notificationPreferences.email || false} 
                  onChange={handleReminderChange} 
                />
                <ReminderToggle 
                  type="sms" 
                  initialState={user?.notificationPreferences.sms || false} 
                  onChange={handleReminderChange} 
                />
                <ReminderToggle 
                  type="push" 
                  initialState={user?.notificationPreferences.push || false} 
                  onChange={handleReminderChange} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;