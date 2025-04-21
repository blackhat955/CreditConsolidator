import { CreditCard, Payment } from '../types';
import { addDays, format } from 'date-fns';

export const generateMockCards = (userId: string): CreditCard[] => {
  return [
    {
      id: 'card-1',
      userId,
      cardName: 'Sapphire Reserve',
      bankName: 'Chase',
      cardNumber: '**** **** **** 4567',
      expiryDate: '05/28',
      dueDate: format(addDays(new Date(), 5), 'yyyy-MM-dd'),
      totalDue: 45000,
      minimumDue: 2250,
      color: '#1B4B9F'
    },
    {
      id: 'card-2',
      userId,
      cardName: 'Gold Card',
      bankName: 'American Express',
      cardNumber: '**** **** **** 8901',
      expiryDate: '09/26',
      dueDate: format(addDays(new Date(), 12), 'yyyy-MM-dd'),
      totalDue: 32500,
      minimumDue: 1625,
      color: '#97974F'
    },
    {
      id: 'card-3',
      userId,
      cardName: 'Platinum Card',
      bankName: 'American Express',
      cardNumber: '**** **** **** 2345',
      expiryDate: '11/27',
      dueDate: format(addDays(new Date(), 3), 'yyyy-MM-dd'),
      totalDue: 18750,
      minimumDue: 937.5,
      color: '#6C6C6C'
    },
    {
      id: 'card-4',
      userId,
      cardName: 'Venture X',
      bankName: 'Capital One',
      cardNumber: '**** **** **** 6789',
      expiryDate: '07/25',
      dueDate: format(addDays(new Date(), 18), 'yyyy-MM-dd'),
      totalDue: 27600,
      minimumDue: 1380,
      color: '#004977'
    }
  ];
};

export const generateMockPayments = (userId: string, cards: CreditCard[]): Payment[] => {
  const pastDates = [
    format(addDays(new Date(), -30), 'yyyy-MM-dd'),
    format(addDays(new Date(), -22), 'yyyy-MM-dd'),
    format(addDays(new Date(), -15), 'yyyy-MM-dd'),
    format(addDays(new Date(), -7), 'yyyy-MM-dd'),
  ];

  return pastDates.map((date, index) => {
    const randomCards = [...cards]
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.ceil(Math.random() * cards.length));
    
    const cardPayments = randomCards.map(card => ({
      cardId: card.id,
      amount: Math.round(card.minimumDue + (Math.random() * card.totalDue * 0.5))
    }));
    
    const totalAmount = cardPayments.reduce((sum, item) => sum + item.amount, 0);
    
    const paymentMethods = ['bank_transfer', 'debit_card', 'apple_pay'];
    
    return {
      id: `payment-${index + 1}`,
      userId,
      date,
      cards: cardPayments,
      totalAmount,
      paymentMethod: paymentMethods[index % paymentMethods.length],
      status: 'completed',
      receiptId: `RCPT-${100000 + index}`
    };
  });
};

// Format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
};

// Calculate days remaining until due date
export const getDaysRemaining = (dueDate: string): number => {
  const today = new Date();
  const due = new Date(dueDate);
  const diffTime = due.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};