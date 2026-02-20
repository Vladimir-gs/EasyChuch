import React, { useState, useEffect, useCallback } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import Modal from '../components/common/Modal';
import IncomeForm from '../components/features/IncomeForm';
import { Income as IncomeType } from '../types';
import { incomeService } from '../services/income.service';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { formatCurrency, formatDate } from '../utils/helpers';
import { CATEGORY_LABELS, INCOME_CATEGORIES } from '../utils/constants';
import axios from 'axios';

const Income: React.FC = () => {
  const [incomes, setIncomes] = useState<IncomeType[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({ startDate: '', endDate: '', category: '' });
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<IncomeType | undefined>();
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const { user } = useAuth();
  const { showToast } = useToast();
  const canWrite = user?.role === 'ADMIN' || user?.role === 'TREASURER';

  const fetchIncomes = useCallback(async () => {
    setLoading(true);
    try {
      const result = await incomeService.list({ page, limit: 10, ...filters });
      setIncomes(result.data);
      setTotalPages(result.totalPages);
      setTotal(result.total);
    } catch {
      showToast('Failed to load income records', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, filters, showToast]);

  useEffect(() => { fetchIncomes(); }, [fetchIncomes]);

  const handleSubmit = async (data: { amount: number; category: string; description?: string; date: string }) => {
    try {
      if (editItem) {
        await incomeService.update(editItem.id, data);
        showToast('Income updated successfully', 'success');
      } else {
        await incomeService.create(data);
        showToast('Income created successfully', 'success');
      }
      setModalOpen(false);
      setEditItem(undefined);
      fetchIncomes();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) throw new Error(err.response?.data?.error || 'Failed to save income');
      throw err;
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await incomeService.remove(id);
      showToast('Income deleted successfully', 'success');
      setDeleteConfirm(null);
      fetchIncomes();
    } catch {
      showToast('Failed to delete income', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Income</h1>
          <p className="text-gray-500 text-sm mt-1">{total} records</p>
        </div>
        {canWrite && (
          <Button onClick={() => { setEditItem(undefined); setModalOpen(true); }}>
            + Add Income
          </Button>
        )}
      </div>

      <Card>
        <div className="flex flex-wrap gap-3">
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => { setFilters({ ...filters, startDate: e.target.value }); setPage(1); }}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Start Date"
          />
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => { setFilters({ ...filters, endDate: e.target.value }); setPage(1); }}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={filters.category}
            onChange={(e) => { setFilters({ ...filters, category: e.target.value }); setPage(1); }}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {INCOME_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{CATEGORY_LABELS[cat] || cat}</option>
            ))}
          </select>
          {(filters.startDate || filters.endDate || filters.category) && (
            <Button variant="ghost" onClick={() => { setFilters({ startDate: '', endDate: '', category: '' }); setPage(1); }}>
              Clear
            </Button>
          )}
        </div>
      </Card>

      <Card>
        {loading ? (
          <Loading />
        ) : incomes.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-lg mb-2">No income records found</p>
            {canWrite && <Button onClick={() => setModalOpen(true)}>Add First Income</Button>}
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
                  {incomes.map((income) => (
                    <tr key={income.id} className="hover:bg-gray-50">
                      <td className="py-3 text-gray-600">{formatDate(income.date)}</td>
                      <td className="py-3">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                          {CATEGORY_LABELS[income.category] || income.category}
                        </span>
                      </td>
                      <td className="py-3 text-gray-600 max-w-xs truncate">{income.description || '-'}</td>
                      <td className="py-3 text-right font-medium text-green-600">{formatCurrency(income.amount)}</td>
                      <td className="py-3 text-gray-500">{income.createdBy?.name}</td>
                      {canWrite && (
                        <td className="py-3">
                          <div className="flex gap-2 justify-end">
                            <Button variant="ghost" size="sm" onClick={() => { setEditItem(income); setModalOpen(true); }}>Edit</Button>
                            <Button variant="danger" size="sm" onClick={() => setDeleteConfirm(income.id)}>Delete</Button>
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

      <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditItem(undefined); }} title={editItem ? 'Edit Income' : 'Add Income'}>
        <IncomeForm initial={editItem} onSubmit={handleSubmit} onCancel={() => { setModalOpen(false); setEditItem(undefined); }} />
      </Modal>

      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Confirm Delete" size="sm">
        <p className="text-gray-600 mb-6">Are you sure you want to delete this income record?</p>
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
          <Button variant="danger" onClick={() => deleteConfirm && handleDelete(deleteConfirm)}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
};

export default Income;
