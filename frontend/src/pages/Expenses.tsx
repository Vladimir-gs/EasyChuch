import React, { useState, useEffect, useCallback } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import Modal from '../components/common/Modal';
import ExpenseForm from '../components/features/ExpenseForm';
import { Expense as ExpenseType } from '../types';
import { expenseService } from '../services/expense.service';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { formatCurrency, formatDate } from '../utils/helpers';
import { CATEGORY_LABELS, EXPENSE_CATEGORIES } from '../utils/constants';
import axios from 'axios';

const Expenses: React.FC = () => {
  const [expenses, setExpenses] = useState<ExpenseType[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({ startDate: '', endDate: '', category: '' });
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<ExpenseType | undefined>();
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const { user } = useAuth();
  const { showToast } = useToast();
  const canWrite = user?.role === 'ADMIN' || user?.role === 'TREASURER';

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    try {
      const result = await expenseService.list({ page, limit: 10, ...filters });
      setExpenses(result.data);
      setTotalPages(result.totalPages);
      setTotal(result.total);
    } catch {
      showToast('Failed to load expense records', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, filters, showToast]);

  useEffect(() => { fetchExpenses(); }, [fetchExpenses]);

  const handleSubmit = async (data: { amount: number; category: string; description?: string; date: string }) => {
    try {
      if (editItem) {
        await expenseService.update(editItem.id, data);
        showToast('Expense updated successfully', 'success');
      } else {
        await expenseService.create(data);
        showToast('Expense created successfully', 'success');
      }
      setModalOpen(false);
      setEditItem(undefined);
      fetchExpenses();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) throw new Error(err.response?.data?.error || 'Failed to save expense');
      throw err;
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await expenseService.remove(id);
      showToast('Expense deleted successfully', 'success');
      setDeleteConfirm(null);
      fetchExpenses();
    } catch {
      showToast('Failed to delete expense', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Expenses</h1>
          <p className="text-gray-500 text-sm mt-1">{total} records</p>
        </div>
        {canWrite && (
          <Button onClick={() => { setEditItem(undefined); setModalOpen(true); }}>
            + Add Expense
          </Button>
        )}
      </div>

      <Card>
        <div className="flex flex-wrap gap-3">
          <input type="date" value={filters.startDate} onChange={(e) => { setFilters({ ...filters, startDate: e.target.value }); setPage(1); }} className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input type="date" value={filters.endDate} onChange={(e) => { setFilters({ ...filters, endDate: e.target.value }); setPage(1); }} className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <select value={filters.category} onChange={(e) => { setFilters({ ...filters, category: e.target.value }); setPage(1); }} className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All Categories</option>
            {EXPENSE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{CATEGORY_LABELS[cat] || cat}</option>
            ))}
          </select>
          {(filters.startDate || filters.endDate || filters.category) && (
            <Button variant="ghost" onClick={() => { setFilters({ startDate: '', endDate: '', category: '' }); setPage(1); }}>Clear</Button>
          )}
        </div>
      </Card>

      <Card>
        {loading ? (
          <Loading />
        ) : expenses.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-lg mb-2">No expense records found</p>
            {canWrite && <Button onClick={() => setModalOpen(true)}>Add First Expense</Button>}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b border-gray-100">
                    <th className="pb-3 font-medium text-gray-500">Date</th>
                    <th className="pb-3 font-medium text-gray-500">Category</th>
                    <th className="pb-3 font-medium text-gray-500">Description</th>
                    <th className="pb-3 font-medium text-gray-500 text-right">Amount</th>
                    <th className="pb-3 font-medium text-gray-500">Created By</th>
                    {canWrite && <th className="pb-3" />}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {expenses.map((expense) => (
                    <tr key={expense.id} className="hover:bg-gray-50">
                      <td className="py-3 text-gray-600">{formatDate(expense.date)}</td>
                      <td className="py-3">
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                          {CATEGORY_LABELS[expense.category] || expense.category}
                        </span>
                      </td>
                      <td className="py-3 text-gray-600 max-w-xs truncate">{expense.description || '-'}</td>
                      <td className="py-3 text-right font-medium text-red-600">{formatCurrency(expense.amount)}</td>
                      <td className="py-3 text-gray-500">{expense.createdBy?.name}</td>
                      {canWrite && (
                        <td className="py-3">
                          <div className="flex gap-2 justify-end">
                            <Button variant="ghost" size="sm" onClick={() => { setEditItem(expense); setModalOpen(true); }}>Edit</Button>
                            <Button variant="danger" size="sm" onClick={() => setDeleteConfirm(expense.id)}>Delete</Button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <Button variant="secondary" size="sm" onClick={() => setPage(p => p - 1)} disabled={page === 1}>Previous</Button>
                <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
                <Button variant="secondary" size="sm" onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>Next</Button>
              </div>
            )}
          </>
        )}
      </Card>

      <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditItem(undefined); }} title={editItem ? 'Edit Expense' : 'Add Expense'}>
        <ExpenseForm initial={editItem} onSubmit={handleSubmit} onCancel={() => { setModalOpen(false); setEditItem(undefined); }} />
      </Modal>

      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Confirm Delete" size="sm">
        <p className="text-gray-600 mb-6">Are you sure you want to delete this expense record?</p>
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
          <Button variant="danger" onClick={() => deleteConfirm && handleDelete(deleteConfirm)}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
};

export default Expenses;
