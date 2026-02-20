import React from 'react';
import { formatCurrency } from '../../utils/helpers';

interface SummaryCardProps {
  title: string;
  amount: number;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'red' | 'purple';
  subtitle?: string;
}

const colorClasses = {
  blue: { bg: 'bg-blue-50', icon: 'bg-blue-600', text: 'text-blue-600' },
  green: { bg: 'bg-green-50', icon: 'bg-green-600', text: 'text-green-600' },
  red: { bg: 'bg-red-50', icon: 'bg-red-600', text: 'text-red-600' },
  purple: { bg: 'bg-purple-50', icon: 'bg-purple-600', text: 'text-purple-600' },
};

const SummaryCard: React.FC<SummaryCardProps> = ({ title, amount, icon, color, subtitle }) => {
  const colors = colorClasses[color];

  return (
    <div className={`${colors.bg} rounded-xl p-6 flex items-start gap-4`}>
      <div className={`${colors.icon} text-white p-3 rounded-lg`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-600 font-medium">{title}</p>
        <p className={`text-2xl font-bold ${colors.text} mt-1`}>{formatCurrency(amount)}</p>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
};

export default SummaryCard;
