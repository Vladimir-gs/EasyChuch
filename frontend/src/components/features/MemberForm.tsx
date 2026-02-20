import React, { useState, useEffect } from 'react';
import { Member } from '../../types';
import { ROLES, ROLE_LABELS } from '../../utils/constants';
import Input from '../common/Input';
import Button from '../common/Button';

interface MemberFormProps {
  initial?: Member;
  onSubmit: (data: { name: string; email: string; phone?: string; address?: string; role?: string; joinedDate?: string }) => Promise<void>;
  onCancel: () => void;
}

const MemberForm: React.FC<MemberFormProps> = ({ initial, onSubmit, onCancel }) => {
  const [form, setForm] = useState({
    name: initial?.name || '',
    email: initial?.email || '',
    phone: initial?.phone || '',
    address: initial?.address || '',
    role: initial?.role || 'MEMBER',
    joinedDate: initial?.joinedDate ? initial.joinedDate.split('T')[0] : new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initial) {
      setForm({
        name: initial.name,
        email: initial.email,
        phone: initial.phone || '',
        address: initial.address || '',
        role: initial.role,
        joinedDate: initial.joinedDate.split('T')[0],
      });
    }
  }, [initial]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim()) { setError('Name is required'); return; }
    if (!form.email.trim()) { setError('Email is required'); return; }
    setLoading(true);
    try {
      await onSubmit({
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        address: form.address || undefined,
        role: form.role,
        joinedDate: form.joinedDate,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save member';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</div>}

      <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
      <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
      <Input label="Phone (optional)" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
      <Input label="Address (optional)" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value as Member['role'] })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {ROLES.map((role) => (
            <option key={role} value={role}>{ROLE_LABELS[role] || role}</option>
          ))}
        </select>
      </div>

      <Input label="Joined Date" type="date" value={form.joinedDate} onChange={(e) => setForm({ ...form, joinedDate: e.target.value })} />

      <div className="flex gap-3 justify-end">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" loading={loading}>{initial ? 'Update' : 'Add'} Member</Button>
      </div>
    </form>
  );
};

export default MemberForm;
