'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import {
  FolderKanban,
  PlusCircle,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  X,
  Smartphone,
  Laptop,
  Tv,
  Wind,
  Zap,
  Disc,
  Package,
  Wrench
} from 'lucide-react';
import { apiRequest } from '@/lib/api';
import { toast } from 'sonner';

const CATEGORIES = [
  'Smartphone',
  'Laptop & PC',
  'AC',
  'Refrigerator',
  'TV',
  'Washing Machine',
  'Electrical',
];

function getCategoryVisual(category: string = '') {
  const c = category.toLowerCase();
  if (c.includes('phone') || c.includes('smart')) {
    return {
      icon: Smartphone,
      bg: 'bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-950/40 dark:border-blue-900 dark:text-blue-400',
    };
  }
  if (c.includes('laptop') || c.includes('pc')) {
    return {
      icon: Laptop,
      bg: 'bg-purple-50 border-purple-200 text-purple-600 dark:bg-purple-950/40 dark:border-purple-900 dark:text-purple-400',
    };
  }
  if (c.includes('refrigerator') || c.includes('fridge')) {
    return {
      icon: Package,
      bg: 'bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-950/40 dark:border-emerald-900 dark:text-emerald-400',
    };
  }
  if (c.includes('ac') || c.includes('air')) {
    return {
      icon: Wind,
      bg: 'bg-teal-50 border-teal-200 text-teal-600 dark:bg-teal-950/40 dark:border-teal-900 dark:text-teal-400',
    };
  }
  if (c.includes('tv') || c.includes('television')) {
    return {
      icon: Tv,
      bg: 'bg-amber-50 border-amber-200 text-amber-600 dark:bg-amber-950/40 dark:border-amber-900 dark:text-amber-400',
    };
  }
  if (c.includes('washing') || c.includes('machine')) {
    return {
      icon: Disc,
      bg: 'bg-sky-50 border-sky-200 text-sky-600 dark:bg-sky-950/40 dark:border-sky-900 dark:text-sky-400',
    };
  }
  if (c.includes('electrical') || c.includes('wiring')) {
    return {
      icon: Zap,
      bg: 'bg-yellow-50 border-yellow-200 text-yellow-600 dark:bg-yellow-950/40 dark:border-yellow-900 dark:text-yellow-400',
    };
  }
  return {
    icon: Wrench,
    bg: 'bg-slate-50 border-slate-200 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300',
  };
}

export default function MyServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit Modal State
  const [editingService, setEditingService] = useState<any | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editDuration, setEditDuration] = useState('');
  const [editMode, setEditMode] = useState('');
  const [editArea, setEditArea] = useState('');
  const [updating, setUpdating] = useState(false);

  // Delete Confirmation Modal State
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchMyServices = async () => {
    try {
      const res = await apiRequest<{ services: any[] }>('/services/technician/my');
      if (res.success && res.data) {
        setServices(res.data.services || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyServices();
  }, []);

  const openEditModal = (service: any) => {
    setEditingService(service);
    setEditTitle(service.title);
    setEditCategory(service.category);
    setEditDescription(service.description);
    setEditPrice(String(service.basePrice));
    setEditDuration(service.estimatedDuration);
    setEditMode(service.serviceMode);
    setEditArea(service.serviceArea);
  };

  // Update Service: sets approvalStatus back to 'pending' upon edit
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    setUpdating(true);
    try {
      const res = await apiRequest(`/services/${editingService._id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          title: editTitle.trim(),
          category: editCategory,
          description: editDescription.trim(),
          basePrice: Number(editPrice),
          estimatedDuration: editDuration.trim(),
          serviceMode: editMode,
          serviceArea: editArea.trim(),
        }),
      });

      if (res.success) {
        toast.success('Service updated and re-submitted for admin approval!');
        setEditingService(null);
        fetchMyServices();
      } else {
        toast.error(res.message || 'Failed to update service');
      }
    } catch (err: any) {
      toast.error(err.message || 'Update error');
    } finally {
      setUpdating(false);
    }
  };

  // Delete Service with confirmation
  const confirmDelete = async () => {
    if (!deletingId) return;
    setDeleting(true);
    try {
      const res = await apiRequest(`/services/${deletingId}`, {
        method: 'DELETE',
      });
      if (res.success) {
        toast.success('Service deleted successfully');
        setDeletingId(null);
        fetchMyServices();
      } else {
        toast.error(res.message || 'Failed to delete service');
      }
    } catch (err: any) {
      toast.error(err.message || 'Delete error');
    } finally {
      setDeleting(false);
    }
  };

  // Toggle isAvailable switch matching Image 4 toast
  const handleToggleAvailability = async (id: string, currentStatus: boolean) => {
    try {
      const res = await apiRequest<{ isAvailable: boolean }>(`/services/${id}/availability`, {
        method: 'PATCH',
      });
      if (res.success) {
        const nextState = res.data?.isAvailable ?? !currentStatus;
        if (!nextState) {
          toast.info('Service paused. Customers cannot see it.');
        } else {
          toast.success('Service activated.');
        }
        fetchMyServices();
      } else {
        toast.error(res.message || 'Failed to toggle availability');
      }
    } catch (err: any) {
      toast.error(err.message || 'Toggle error');
    }
  };

  return (
    <DashboardLayout allowedRoles={['technician']}>
      <div className="space-y-6">
        {/* Header & Add Button matching Image 4 */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              My services
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Edit, pause or remove your listings.
            </p>
          </div>
          <Link
            href="/dashboard/technician/add-service"
            className="inline-flex items-center gap-2 rounded-xl bg-[#f97316] hover:bg-[#ea580c] px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition-colors shrink-0"
          >
            <PlusCircle className="h-4 w-4" />
            Add a service
          </Link>
        </div>

        {loading ? (
          <div className="h-64 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
        ) : services.length > 0 ? (
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="border-b border-slate-100 bg-slate-50/50 text-slate-400 font-medium text-xs dark:border-slate-800 dark:bg-slate-800/40">
                  <tr>
                    <th className="py-4 px-5">Service</th>
                    <th className="py-4 px-5">Category</th>
                    <th className="py-4 px-5">Price</th>
                    <th className="py-4 px-5">Review</th>
                    <th className="py-4 px-5">Available</th>
                    <th className="py-4 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {services.map((s) => {
                    const visual = getCategoryVisual(s.category);
                    const IconComp = visual.icon;

                    return (
                      <tr key={s._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                        {/* Service with tinted icon box */}
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-3">
                            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${visual.bg}`}>
                              <IconComp className="h-5 w-5" />
                            </div>
                            <span className="font-semibold text-slate-900 dark:text-white">
                              {s.title}
                            </span>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-4 px-5 text-slate-600 dark:text-slate-300">
                          {s.category}
                        </td>

                        {/* Price */}
                        <td className="py-4 px-5 font-semibold text-slate-900 dark:text-white">
                          ${s.basePrice}
                        </td>

                        {/* Review Status Pill */}
                        <td className="py-4 px-5">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
                              s.approvalStatus === 'approved'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300'
                                : s.approvalStatus === 'rejected'
                                ? 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-300'
                                : 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300'
                            }`}
                          >
                            {s.approvalStatus || 'Pending'}
                          </span>
                        </td>

                        {/* Available Toggle Switch */}
                        <td className="py-4 px-5">
                          <button
                            type="button"
                            onClick={() => handleToggleAvailability(s._id, !!s.isAvailable)}
                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                              s.isAvailable ? 'bg-[#044E45]' : 'bg-slate-200 dark:bg-slate-700'
                            }`}
                            aria-label="Toggle availability"
                          >
                            <span
                              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                                s.isAvailable ? 'translate-x-5' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        </td>

                        {/* Edit and Delete Actions */}
                        <td className="py-4 px-5 text-right space-x-3">
                          <button
                            onClick={() => openEditModal(s)}
                            className="font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setDeletingId(s._id)}
                            className="font-medium text-slate-600 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
            <FolderKanban className="mx-auto h-10 w-10 text-slate-300 dark:text-slate-600" />
            <h3 className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">
              No services listed yet
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Create your first repair service offering to start receiving customer jobs.
            </p>
            <Link
              href="/dashboard/technician/add-service"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#f97316] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#ea580c]"
            >
              <PlusCircle className="h-4 w-4" />
              Add a service
            </Link>
          </div>
        )}

        {/* Edit Service Modal */}
        {editingService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
            <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Edit className="h-4 w-4 text-brand-600" />
                  Edit Service Offering
                </h3>
                <button
                  onClick={() => setEditingService(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleUpdate} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Service Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Category *
                    </label>
                    <select
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Base Price ($ USD) *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Service Description *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div className="rounded-xl bg-amber-50 p-3 text-[11px] text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200/60">
                  Notice: Modifying service details resets approval status back to <strong>Pending</strong> for administrative safety review.
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingService(null)}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updating}
                    className="rounded-xl bg-brand-600 px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-brand-700 disabled:opacity-50"
                  >
                    {updating ? 'Saving...' : 'Save & Submit'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deletingId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
            <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
                <AlertCircle className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
                Delete Service?
              </h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                This will permanently delete this service offering. Any active customer bookings will remain intact.
              </p>
              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setDeletingId(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  disabled={deleting}
                  className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
                >
                  {deleting ? 'Deleting...' : 'Yes, Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
