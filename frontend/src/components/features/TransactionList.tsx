import React from 'react';
import { Income, Expense } from '../../types';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { CATEGORY_LABELS } from '../../utils/constants';

type Transaction = (Income | Expense) & { type: 'income' | 'expense' };

interface TransactionListProps {
  transactions: Transaction[];
  loading?: boolean;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, loading }) => {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-14 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (!transactions.length) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p>No recent transactions</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map((tx) => (
        <div key={`${tx.type}-${tx.id}`} className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${tx.type === 'income' ? 'bg-green-500' : 'bg-red-500'}`} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800 truncate">
              {CATEGORY_LABELS[tx.category] || tx.category}
            </p>
            <p className="text-xs text-gray-400">{formatDate(tx.date)}</p>
          </div>
          <p className={`text-sm font-semibold flex-shrink-0 ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
            {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
          </p>
        </div>
      ))}
    </div>
  );
};

export default TransactionList;
