import React, { createContext, useState, useContext, useEffect } from 'react';
import { CreditCard, Payment } from '../types';
import { useAuth } from './AuthContext';
import { generateMockCards, generateMockPayments } from '../utils/mockData';

interface CardContextType {
  cards: CreditCard[];
  payments: Payment[];
  loading: boolean;
  addCard: (card: Omit<CreditCard, 'id' | 'userId'>) => void;
  updateCard: (id: string, updates: Partial<CreditCard>) => void;
  removeCard: (id: string) => void;
  makePayment: (paymentData: Omit<Payment, 'id' | 'userId' | 'date' | 'status'>) => Promise<Payment>;
  distributeAmount: (amount: number) => { [cardId: string]: number };
}

const CardContext = createContext<CardContextType | undefined>(undefined);

export const CardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [cards, setCards] = useState<CreditCard[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const mockCards = generateMockCards(user.id);
      const mockPayments = generateMockPayments(user.id, mockCards);
      
      setCards(mockCards);
      setPayments(mockPayments);
    } else {
      setCards([]);
      setPayments([]);
    }
    setLoading(false);
  }, [user]);

  const addCard = (cardData: Omit<CreditCard, 'id' | 'userId'>) => {
    if (!user) return;
    
    const newCard: CreditCard = {
      ...cardData,
      id: `card-${Date.now()}`,
      userId: user.id,
    };
    
    setCards(prevCards => [...prevCards, newCard]);
  };

  const updateCard = (id: string, updates: Partial<CreditCard>) => {
    setCards(prevCards => prevCards.map(card => 
      card.id === id ? { ...card, ...updates } : card
    ));
  };

  const removeCard = (id: string) => {
    setCards(prevCards => prevCards.filter(card => card.id !== id));
  };

  const makePayment = async (paymentData: Omit<Payment, 'id' | 'userId' | 'date' | 'status'>): Promise<Payment> => {
    if (!user) throw new Error('User not authenticated');
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newPayment: Payment = {
      ...paymentData,
      id: `payment-${Date.now()}`,
      userId: user.id,
      date: new Date().toISOString(),
      status: 'completed',
      receiptId: `RCPT-${Math.floor(Math.random() * 1000000)}`,
    };
    
    setPayments(prevPayments => [newPayment, ...prevPayments]);
    
    paymentData.cards.forEach(({ cardId, amount }) => {
      updateCard(cardId, {
        totalDue: cards.find(c => c.id === cardId)!.totalDue - amount,
        minimumDue: Math.max(0, cards.find(c => c.id === cardId)!.minimumDue - amount)
      });
    });
    
    return newPayment;
  };

  const distributeAmount = (amount: number) => {
    const distribution: { [cardId: string]: number } = {};
    let remainingAmount = amount;
    
    // First pass: Cover minimum payments for cards with earliest due dates
    const cardsByDueDate = [...cards].sort((a, b) => 
      new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    );
    
    // Cover minimum payments first
    cardsByDueDate.forEach(card => {
      if (remainingAmount <= 0) return;
      
      const amountToAllocate = Math.min(card.minimumDue, remainingAmount);
      distribution[card.id] = amountToAllocate;
      remainingAmount -= amountToAllocate;
    });
    
    // Second pass: Distribute remaining amount proportionally based on total dues
    if (remainingAmount > 0) {
      const cardsWithRemainingDue = cardsByDueDate.filter(card => 
        card.totalDue > (distribution[card.id] || 0)
      );
      
      const totalRemainingDue = cardsWithRemainingDue.reduce((sum, card) => 
        sum + (card.totalDue - (distribution[card.id] || 0)), 0
      );
      
      cardsWithRemainingDue.forEach(card => {
        const currentAllocation = distribution[card.id] || 0;
        const remainingDue = card.totalDue - currentAllocation;
        const proportion = remainingDue / totalRemainingDue;
        const additionalAmount = Math.min(
          remainingAmount * proportion,
          remainingDue
        );
        
        distribution[card.id] = (distribution[card.id] || 0) + additionalAmount;
      });
    }
    
    // Round all amounts to 2 decimal places
    Object.keys(distribution).forEach(cardId => {
      distribution[cardId] = Math.round(distribution[cardId] * 100) / 100;
    });
    
    return distribution;
  };

  return (
    <CardContext.Provider value={{ 
      cards, 
      payments, 
      loading, 
      addCard, 
      updateCard, 
      removeCard, 
      makePayment,
      distributeAmount
    }}>
      {children}
    </CardContext.Provider>
  );
};

export const useCards = () => {
  const context = useContext(CardContext);
  if (context === undefined) {
    throw new Error('useCards must be used within a CardProvider');
  }
  return context;
};