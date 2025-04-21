import React from 'react';
import { CreditCard } from '../../types';
import { formatCurrency } from '../../utils/mockData';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

interface DuesSummaryProps {
  cards: CreditCard[];
}

const DuesSummary: React.FC<DuesSummaryProps> = ({ cards }) => {
  const totalDue = cards.reduce((sum, card) => sum + card.totalDue, 0);
  const totalMinimumDue = cards.reduce((sum, card) => sum + card.minimumDue, 0);
  
  // Sort cards by due date
  const sortedCards = [...cards].sort((a, b) => {
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });
  
  // Prepare data for the chart
  const chartData = {
    labels: cards.map(card => card.cardName),
    datasets: [
      {
        label: 'Total Due',
        data: cards.map(card => card.totalDue),
        backgroundColor: cards.map(card => card.color),
        borderColor: cards.map(() => '#ffffff'),
        borderWidth: 2,
      },
    ],
  };
  
  const chartOptions = {
    plugins: {
      legend: {
        display: true,
        position: 'bottom' as const,
        labels: {
          boxWidth: 12,
          padding: 15,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.raw || 0;
            return `${label}: ${formatCurrency(value)}`;
          }
        }
      }
    },
    cutout: '70%',
    animation: {
      animateScale: true,
      animateRotate: true
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Payment Summary</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col">
          <div className="bg-blue-50 rounded-lg p-4 mb-4">
            <p className="text-gray-500 text-sm">Total Outstanding</p>
            <p className="text-gray-900 text-2xl font-bold">{formatCurrency(totalDue)}</p>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-gray-500 text-sm">Total Minimum Due</p>
            <p className="text-gray-900 text-2xl font-bold">{formatCurrency(totalMinimumDue)}</p>
          </div>
          
          <div className="mt-5">
            <h3 className="text-md font-medium text-gray-700 mb-3">Upcoming Dues</h3>
            <div className="space-y-3">
              {sortedCards.map(card => (
                <div key={card.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">{card.bankName} {card.cardName}</p>
                    <p className="text-sm text-gray-500">{new Date(card.dueDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{formatCurrency(card.totalDue)}</p>
                    <p className="text-sm text-gray-500">Min: {formatCurrency(card.minimumDue)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="w-64 h-64 relative mx-auto">
  <Doughnut
    data={chartData}
    options={{
      cutout: '70%',
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: 0, // No default padding from Chart.js
      },
      plugins: {
        legend: {
          display: false,
        },
      },
    }}
  />
  <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
    <p className="text-sm text-gray-500">Total Outstanding Amount</p>
    <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalDue)}</p>
  </div>
</div>

      </div>
    </div>
  );
};

export default DuesSummary;