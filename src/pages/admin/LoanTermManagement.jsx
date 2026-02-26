import React, { useState, useEffect } from 'react';
import { getLoanTenures, addLoanTenure, updateLoanTenure, deleteLoanTenure } from '../../api/adminConfig';
import { Plus, Trash2, X, CalendarDays } from 'lucide-react';
import Swal from 'sweetalert2';

const defaultTerms = [
  { id: 1, label: '3 Months' },
  { id: 2, label: '6 Months' },
  { id: 3, label: '9 Months' },
  { id: 4, label: '12 Months' },
  { id: 5, label: '15 Months' },
  { id: 6, label: '18 Months' },
  { id: 7, label: '24 Months' },
];

const LoanTermManagement = () => {
  const [terms, setTerms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTenures() {
      setLoading(true);
      try {
        const data = await getLoanTenures();
        setTerms(data.tenures);
        setError(null);
      } catch (e) {
        setError(e.message || 'Failed to load loan tenures');
      } finally {
        setLoading(false);
      }
    }
    fetchTenures();
  }, []);
  const [showModal, setShowModal] = useState(false);
  const [duration, setDuration] = useState('');

  const handleChange = async (id, value) => {
    setLoading(true);
    try {
      await updateLoanTenure(id, { label: value });
      await refreshTenures();
      setError(null);
      Swal.fire({ icon: 'success', title: 'Updated!', text: 'Loan tenure updated successfully.' });
    } catch (e) {
      setError(e.message || 'Failed to update loan tenure');
      Swal.fire({ icon: 'error', title: 'Update Failed', text: e.message || 'Failed to update loan tenure.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await deleteLoanTenure(id);
      await refreshTenures();
      setError(null);
      Swal.fire({ icon: 'success', title: 'Deleted!', text: 'Loan tenure deleted successfully.' });
    } catch (e) {
      setError(e.message || 'Failed to delete loan tenure');
      Swal.fire({ icon: 'error', title: 'Delete Failed', text: e.message || 'Failed to delete loan tenure.' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    setLoading(true);
    try {
      if (duration.trim()) {
        await addLoanTenure(duration.trim());
        await refreshTenures();
        Swal.fire({ icon: 'success', title: 'Created!', text: 'Loan tenure added successfully.' });
      }
      setError(null);
    } catch (e) {
      setError(e.message || 'Failed to add loan tenure');
      Swal.fire({ icon: 'error', title: 'Create Failed', text: e.message || 'Failed to add loan tenure.' });
    } finally {
      setLoading(false);
      setDuration('');
      setShowModal(false);
    }
  };
  const refreshTenures = async () => {
    try {
      const data = await getLoanTenures();
      setTerms(data.tenures);
    } catch {}
  };

  const handleCancel = () => {
    setDuration('');
    setShowModal(false);
  };

  return (
    <div className="p-8 w-full">
      {/* Page Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Loan Term Management</h1>
          <p className="text-sm text-gray-500 mt-1">Set and modify loan term management.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
        >
          <Plus size={16} />
          Add New Tenure
        </button>
      </div>

      {/* Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="font-semibold text-gray-900">Update Loan Term</p>
            <p className="text-sm text-gray-400 mt-0.5">Input the details below to modify loan term</p>
          </div>
          <button className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors">
            Save Details
          </button>
        </div>

        <div className="grid grid-cols-[200px_1fr] gap-8">
          <p className="text-sm font-medium text-gray-700 pt-2">Edit loan term</p>
          <div className="flex flex-col gap-3">
            {terms.map((term) => (
              <div key={term.id} className="flex items-center gap-3">
                <input
                  type="text"
                  value={term.label}
                  onChange={(e) => handleChange(term.id, e.target.value)}
                  className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400"
                />
                <button
                  onClick={() => handleDelete(term.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl w-full max-w-md mx-4 p-6 relative">
            {/* Close */}
            <button
              onClick={handleCancel}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={18} />
            </button>

            {/* Icon */}
            <div className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-lg mb-4">
              <CalendarDays size={20} className="text-gray-600" />
            </div>

            <h2 className="text-xl font-bold text-gray-900 mb-4">Add a New Tenure</h2>

            {/* Info bar */}
            <div className="bg-gray-900 text-white text-sm rounded-xl px-4 py-3 mb-5">
              Input the tenure duration in the field below
            </div>

            {/* Input */}
            <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
            <input
              type="text"
              placeholder="Enter duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 bg-gray-50 focus:outline-none focus:border-blue-400 mb-6"
            />

            {/* Actions */}
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={handleCancel}
                className="px-5 py-2.5 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="px-5 py-2.5 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanTermManagement;
