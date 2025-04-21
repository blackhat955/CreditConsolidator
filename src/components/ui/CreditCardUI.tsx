import React, { useState } from 'react';
import { CreditCard as CreditCardType } from '../../types';
import { formatCurrency, getDaysRemaining } from '../../utils/mockData';
import { Calendar, CreditCard as CreditCardIcon } from 'lucide-react';

interface CreditCardUIProps {
  card: CreditCardType;
  onPayClick?: (cardId: string) => void;
}

const CreditCardUI: React.FC<CreditCardUIProps> = ({ card, onPayClick }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const daysRemaining = getDaysRemaining(card.dueDate);
  
  const toggleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const getStatusColor = () => {
    if (daysRemaining <= 3) return 'bg-red-500';
    if (daysRemaining <= 7) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div 
      className="relative w-full max-w-sm mx-auto perspective"
      onClick={toggleFlip}
    >
      <div 
        className={`card-container ${isFlipped ? 'flipped' : ''} transition-transform duration-700 transform-style-3d cursor-pointer w-full h-56 sm:h-48`}
      >
        {/* Front of the card */}
        <div 
          className={`card-front absolute w-full h-full rounded-xl shadow-md p-6 flex flex-col justify-between transform-gpu 
                      ${isFlipped ? 'rotate-y-180 opacity-0' : 'rotate-y-0 opacity-100'} 
                      transition-all duration-700 ease-in-out`}
          style={{ backgroundColor: card.color, backfaceVisibility: 'hidden' }}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-white text-xl font-semibold">{card.cardName}</h3>
              <p className="text-white/80 text-sm">{card.bankName}</p>
            </div>
            <div className="text-white">
              <CreditCardIcon className="h-8 w-8" />
            </div>
          </div>
          
          <div className="mt-6">
            <p className="text-white/90 text-lg font-mono tracking-wider">
              {card.cardNumber}
            </p>
            <div className="flex justify-between items-center mt-4">
              <div>
                <p className="text-white/70 text-xs uppercase">Valid Thru</p>
                <p className="text-white text-sm font-mono">{card.expiryDate}</p>
              </div>
              <div>
                <div className={`${getStatusColor()} h-3 w-3 rounded-full inline-block mr-1`}></div>
                <span className="text-white/90 text-xs">
                  {daysRemaining} day{daysRemaining !== 1 ? 's' : ''} left
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Back of the card */}
        <div 
          className={`card-back absolute w-full h-full bg-white rounded-xl shadow-lg p-5 flex flex-col justify-between 
                      ${isFlipped ? 'rotate-y-0 opacity-100' : 'rotate-y-180 opacity-0'} 
                      transition-all duration-700 ease-in-out border-2`}
          style={{ backfaceVisibility: 'hidden', borderColor: card.color }}
        >
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-center mb-4">
              <h3 className="font-semibold text-xl" style={{ color: card.color }}>
                {card.bankName} {card.cardName}
              </h3>
              <div className={`${getStatusColor()} h-2 w-2 rounded-full mx-auto mt-2`}></div>
            </div>
            
            <div className="w-full space-y-4">
              <div className="text-center">
                <p className="text-gray-500 text-sm">Total Outstanding</p>
                <p className="text-gray-900 text-2xl font-bold">{formatCurrency(card.totalDue)}</p>
              </div>
              
              <div className="text-center">
                <p className="text-gray-500 text-sm">Minimum Payment Due</p>
                <p className="text-gray-900 text-lg">{formatCurrency(card.minimumDue)}</p>
              </div>
              
              <div className="flex items-center justify-center text-gray-700">
                <Calendar className="h-4 w-4 mr-1" />
                <p className="text-sm">
                  Due on {new Date(card.dueDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                </p>
              </div>
            </div>
          </div>
          
          {onPayClick && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPayClick(card.id);
              }}
              className="w-full py-2 rounded-lg text-white font-medium transition-colors mt-4"
              style={{ backgroundColor: card.color }}
            >
              Pay Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreditCardUI;