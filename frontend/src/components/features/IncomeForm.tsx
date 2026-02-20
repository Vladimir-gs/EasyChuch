import React, { useState, useEffect } from 'react';
import { Income } from '../../types';
import { INCOME_CATEGORIES, CATEGORY_LABELS } from '../../utils/constants';
import Input from '../common/Input';
import Button from '../common/Button';

interface IncomeFormProps {
  initial?: Income;
  onSubmit: (data: { amount: number; category: string; description?: string; date: string }) => Promise<void>;
  onCancel: () => void;
}

const IncomeForm: React.FC<IncomeFormProps> = ({ initial, onSubmit, onCancel }) => {
  const [form, setForm] = useState({
    amount: initial?.amount?.toString() || '',
    category: initial?.category || 'TITHES',
    description: initial?.description || '',
    date: initial?.date ? initial.date.split('T')[0] : new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initial) {
      setForm({
        amount: initial.amount.toString(),
        category: initial.category,
        description: initial.description || '',
        date: initial.date.split('T')[0],
      });
    }
  }, [initial]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const amount = parseFloat(form.amount);
    if (isNaN(amount) || amount <= 0) {
      setError('Amount must be a positive number');
      return;
    }
    if (!form.date) {
      setError('Date is required');
      return;
    }
    setLoading(true);
    try {
      await onSubmit({ amount, category: form.category, description: form.description || undefined, date: form.date });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save income';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</div>}

      <Input
        label="Amount ($)"
        type="number"
        step="0.01"
        min="0.01"
        value={form.amount}
        onChange={(e) => setForm({ ...form, amount: e.target.value })}
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value as Income['category'] })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {INCOME_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{CATEGORY_LABELS[cat] || cat}</option>
          ))}
        </select>
      </div>

      <Input
        label="Date"
        type="date"
        value={form.date}
        onChange={(e) => setForm({ ...form, date: e.target.value })}
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter description..."
        />
      </div>

      <div className="flex gap-3 justify-end">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" loading={loading}>{initial ? 'Update' : 'Create'} Income</Button>
      </div>
    </form>
  );
};

export default IncomeForm;
