import { jsPDF } from 'jspdf';
import { Payment, CreditCard } from '../types';
import { formatCurrency } from './mockData';

export const generateReceipt = (payment: Payment, cards: CreditCard[]): void => {
  const doc = new jsPDF();
  
  // Add company logo/header
  doc.setFontSize(24);
  doc.setTextColor(0, 75, 119);
  doc.text('CardPay', 105, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setTextColor(128, 128, 128);
  doc.text('Payment Receipt', 105, 30, { align: 'center' });
  
  // Add receipt details
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  
  // Add border
  doc.setDrawColor(200, 200, 200);
  doc.rect(20, 40, 170, 200);
  
  // Add receipt header
  doc.setFillColor(247, 247, 247);
  doc.rect(20, 40, 170, 20, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.text('Receipt Details', 30, 52);
  doc.setFont('helvetica', 'normal');
  
  // Add receipt info
  doc.text(`Receipt ID: ${payment.receiptId}`, 30, 70);
  doc.text(`Date: ${new Date(payment.date).toLocaleDateString()}`, 30, 80);
  doc.text(`Payment Method: ${payment.paymentMethod.replace('_', ' ').toUpperCase()}`, 30, 90);
  
  // Add payment details header
  doc.setFillColor(247, 247, 247);
  doc.rect(20, 100, 170, 15, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.text('Payment Details', 30, 110);
  doc.setFont('helvetica', 'normal');
  
  // Add table header
  let y = 125;
  doc.setFont('helvetica', 'bold');
  doc.text('Card', 30, y);
  doc.text('Bank', 80, y);
  doc.text('Card Number', 120, y);
  doc.text('Amount', 160, y);
  doc.setFont('helvetica', 'normal');
  
  // Add horizontal line
  y += 5;
  doc.line(30, y, 180, y);
  
  // Add payment details
  y += 10;
  payment.cards.forEach((cardPayment) => {
    const card = cards.find(c => c.id === cardPayment.cardId);
    if (card) {
      doc.text(card.cardName, 30, y);
      doc.text(card.bankName, 80, y);
      doc.text(card.cardNumber, 120, y);
      doc.text(formatCurrency(cardPayment.amount), 160, y);
      y += 10;
    }
  });
  
  // Add total
  y += 10;
  doc.line(30, y, 180, y);
  y += 10;
  doc.setFont('helvetica', 'bold');
  doc.text('Total:', 120, y);
  doc.text(formatCurrency(payment.totalAmount), 160, y);
  
  // Add footer
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.text('Thank you for your payment. This is an automatically generated receipt.', 105, 280, { align: 'center' });
  
  // Save the PDF
  doc.save(`Receipt-${payment.receiptId}.pdf`);
};