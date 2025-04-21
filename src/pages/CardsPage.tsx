import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, CreditCard as CreditCardIcon, X } from 'lucide-react';
import { useCards } from '../context/CardContext';
import CreditCardUI from '../components/ui/CreditCardUI';
import { CreditCard } from '../types';

const CardsPage: React.FC = () => {
  const { cards, loading, addCard } = useCards();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddCard, setShowAddCard] = useState(false);
  const [newCard, setNewCard] = useState<Partial<CreditCard>>({
    cardName: '',
    bankName: '',
    cardNumber: '',
    expiryDate: '',
    dueDate: '',
    totalDue: 0,
    minimumDue: 0,
    color: '#0F52BA',
  });

  const handlePayClick = (cardId: string) => {
    navigate('/payment', { state: { selectedCardId: cardId } });
  };

  const filteredCards = cards.filter(
    (card) =>
      card.cardName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.bankName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCard = () => {
    // Validate card info
    if (
      !newCard.cardName ||
      !newCard.bankName ||
      !newCard.cardNumber ||
      !newCard.expiryDate ||
      !newCard.dueDate ||
      !newCard.totalDue
    ) {
      // Show validation error
      return;
    }

    // Add the new card
    addCard({
      ...newCard as Omit<CreditCard, 'id' | 'userId'>,
      minimumDue: newCard.minimumDue || Math.round(newCard.totalDue * 0.05), // Default 5% if not specified
    });

    // Reset form and close modal
    setNewCard({
      cardName: '',
      bankName: '',
      cardNumber: '',
      expiryDate: '',
      dueDate: '',
      totalDue: 0,
      minimumDue: 0,
      color: '#0F52BA',
    });
    setShowAddCard(false);
  };

  // Helper to mask credit card number as user types
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCardNumber(e.target.value);
    setNewCard({ ...newCard, cardNumber: formattedValue });
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Credit Cards</h1>
            <p className="text-gray-600 mt-1">Manage all your credit cards in one place</p>
          </div>
          <button
            onClick={() => setShowAddCard(true)}
            className="mt-4 sm:mt-0 flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="mr-2 h-5 w-5" />
            Add New Card
          </button>
        </div>

        <div className="mb-6 relative flex items-center">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search cards by name or bank..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {filteredCards.length === 0 ? (
          <div className="text-center py-12">
            <CreditCardIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No cards found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'Try a different search term' : 'Get started by adding a new credit card.'}
            </p>
            {!searchTerm && (
              <div className="mt-6">
                <button
                  onClick={() => setShowAddCard(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                  Add New Card
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCards.map((card) => (
              <CreditCardUI key={card.id} card={card} onPayClick={handlePayClick} />
            ))}
          </div>
        )}
      </div>

      {/* Add Card Modal */}
      {showAddCard && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="flex justify-between items-center bg-gray-50 px-4 py-3">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Add New Credit Card</h3>
                <button
                  onClick={() => setShowAddCard(false)}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="cardName" className="block text-sm font-medium text-gray-700">
                      Card Name
                    </label>
                    <input
                      type="text"
                      id="cardName"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="e.g. Platinum Rewards"
                      value={newCard.cardName}
                      onChange={(e) => setNewCard({ ...newCard, cardName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label htmlFor="bankName" className="block text-sm font-medium text-gray-700">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      id="bankName"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="e.g. HDFC Bank"
                      value={newCard.bankName}
                      onChange={(e) => setNewCard({ ...newCard, bankName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
                      Card Number
                    </label>
                    <input
                      type="text"
                      id="cardNumber"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="•••• •••• •••• ••••"
                      maxLength={19}
                      value={newCard.cardNumber}
                      onChange={handleCardNumberChange}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        id="expiryDate"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="MM/YY"
                        maxLength={5}
                        value={newCard.expiryDate}
                        onChange={(e) => setNewCard({ ...newCard, expiryDate: e.target.value })}
                      />
                    </div>
                    <div>
                      <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
                        Due Date
                      </label>
                      <input
                        type="date"
                        id="dueDate"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={newCard.dueDate}
                        onChange={(e) => setNewCard({ ...newCard, dueDate: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="totalDue" className="block text-sm font-medium text-gray-700">
                        Total Due
                      </label>
                      <input
                        type="number"
                        id="totalDue"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="0.00"
                        value={newCard.totalDue || ''}
                        onChange={(e) => setNewCard({ ...newCard, totalDue: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                    <div>
                      <label htmlFor="minimumDue" className="block text-sm font-medium text-gray-700">
                        Minimum Due
                      </label>
                      <input
                        type="number"
                        id="minimumDue"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="0.00"
                        value={newCard.minimumDue || ''}
                        onChange={(e) => setNewCard({ ...newCard, minimumDue: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="cardColor" className="block text-sm font-medium text-gray-700">
                      Card Color
                    </label>
                    <div className="mt-1 flex items-center space-x-2">
                      <input
                        type="color"
                        id="cardColor"
                        className="h-8 w-8 border border-gray-300 rounded"
                        value={newCard.color}
                        onChange={(e) => setNewCard({ ...newCard, color: e.target.value })}
                      />
                      <span className="text-sm text-gray-500">{newCard.color}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleAddCard}
                >
                  Add Card
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowAddCard(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardsPage;










