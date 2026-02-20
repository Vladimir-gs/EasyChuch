import React, { useState, useEffect, useCallback } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import Modal from '../components/common/Modal';
import MemberForm from '../components/features/MemberForm';
import { Member } from '../types';
import { memberService } from '../services/member.service';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { formatDate } from '../utils/helpers';
import { ROLE_LABELS } from '../utils/constants';
import axios from 'axios';

const Members: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Member | undefined>();
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const { user } = useAuth();
  const { showToast } = useToast();
  const isAdmin = user?.role === 'ADMIN';

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    try {
      const result = await memberService.list({ page, limit: 10 });
      setMembers(result.data);
      setTotalPages(result.totalPages);
      setTotal(result.total);
    } catch {
      showToast('Failed to load members', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, showToast]);

  useEffect(() => { fetchMembers(); }, [fetchMembers]);

  const handleSubmit = async (data: { name: string; email: string; phone?: string; address?: string; role?: string; joinedDate?: string }) => {
    try {
      if (editItem) {
        await memberService.update(editItem.id, data);
        showToast('Member updated successfully', 'success');
      } else {
        await memberService.create(data);
        showToast('Member added successfully', 'success');
      }
      setModalOpen(false);
      setEditItem(undefined);
      fetchMembers();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) throw new Error(err.response?.data?.error || 'Failed to save member');
      throw err;
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await memberService.remove(id);
      showToast('Member deleted successfully', 'success');
      setDeleteConfirm(null);
      fetchMembers();
    } catch {
      showToast('Failed to delete member', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Members</h1>
          <p className="text-gray-500 text-sm mt-1">{total} members</p>
        </div>
        {isAdmin && (
          <Button onClick={() => { setEditItem(undefined); setModalOpen(true); }}>+ Add Member</Button>
        )}
      </div>

      <Card>
        {loading ? (
          <Loading />
        ) : members.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-lg mb-2">No members found</p>
            {isAdmin && <Button onClick={() => setModalOpen(true)}>Add First Member</Button>}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b border-gray-100">
                    <th className="pb-3 font-medium text-gray-500">Name</th>
                    <th className="pb-3 font-medium text-gray-500">Email</th>
                    <th className="pb-3 font-medium text-gray-500">Phone</th>
                    <th className="pb-3 font-medium text-gray-500">Role</th>
                    <th className="pb-3 font-medium text-gray-500">Joined</th>
                    {isAdmin && <th className="pb-3" />}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {members.map((member) => (
                    <tr key={member.id} className="hover:bg-gray-50">
                      <td className="py-3 font-medium text-gray-800">{member.name}</td>
                      <td className="py-3 text-gray-600">{member.email}</td>
                      <td className="py-3 text-gray-600">{member.phone || '-'}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          member.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                          member.role === 'TREASURER' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {ROLE_LABELS[member.role] || member.role}
                        </span>
                      </td>
                      <td className="py-3 text-gray-600">{formatDate(member.joinedDate)}</td>
                      {isAdmin && (
                        <td className="py-3">
                          <div className="flex gap-2 justify-end">
                            <Button variant="ghost" size="sm" onClick={() => { setEditItem(member); setModalOpen(true); }}>Edit</Button>
                            <Button variant="danger" size="sm" onClick={() => setDeleteConfirm(member.id)}>Delete</Button>
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

      <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditItem(undefined); }} title={editItem ? 'Edit Member' : 'Add Member'}>
        <MemberForm initial={editItem} onSubmit={handleSubmit} onCancel={() => { setModalOpen(false); setEditItem(undefined); }} />
      </Modal>

      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Confirm Delete" size="sm">
        <p className="text-gray-600 mb-6">Are you sure you want to delete this member?</p>
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
          <Button variant="danger" onClick={() => deleteConfirm && handleDelete(deleteConfirm)}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
};

export default Members;
