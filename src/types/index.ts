export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  notificationPreferences: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
}

export interface CreditCard {
  id: string;
  userId: string;
  cardName: string;
  bankName: string;
  cardNumber: string; // Masked number like **** **** **** 1234
  expiryDate: string;
  dueDate: string;
  totalDue: number;
  minimumDue: number;
  color: string;
}

export interface Payment {
  id: string;
  userId: string;
  date: string;
  cards: {
    cardId: string;
    amount: number;
  }[];
  totalAmount: number;
  paymentMethod: string;
  status: 'pending' | 'completed' | 'failed';
  receiptId?: string;
}

export type PaymentMethod = 'bank_transfer' | 'debit_card' | 'apple_pay' | 'google_pay';