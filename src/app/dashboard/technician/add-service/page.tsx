'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { PlusCircle, Upload, ArrowRight, ShieldAlert, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { apiRequest, uploadImageToImgBB } from '@/lib/api';
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

export default function AddServicePage() {
  const router = useRouter();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Smartphone');
  const [description, setDescription] = useState('');
  const [basePrice, setBasePrice] = useState('');
  const [estimatedDuration, setEstimatedDuration] = useState('1-2 hours');
  const [serviceMode, setServiceMode] = useState<'Home Visit' | 'Shop Drop-off'>('Home Visit');
  const [serviceArea, setServiceArea] = useState(user?.area || 'Dhaka');

  // File Upload via ImgBB
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim() || !basePrice || !estimatedDuration || !serviceArea.trim()) {
      toast.error('Please fill in all service listing fields');
      return;
    }

    const priceNum = Number(basePrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      toast.error('Base price must be a positive number');
      return;
    }

    setSubmitting(true);
    try {
      let imageUrl = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80';

      // Upload file via ImgBB if provided
      if (imageFile) {
        toast.info('Uploading service image...');
        imageUrl = await uploadImageToImgBB(imageFile);
      }

      const res = await apiRequest('/services', {
        method: 'POST',
        body: JSON.stringify({
          title: title.trim(),
          category,
          description: description.trim(),
          basePrice: priceNum,
          estimatedDuration: estimatedDuration.trim(),
          serviceMode,
          serviceArea: serviceArea.trim(),
          image: imageUrl,
        }),
      });

      if (!res.success) {
        toast.error(res.message || 'Failed to submit service');
        return;
      }

      toast.success('Service created successfully! Waiting for admin approval.');
      router.push('/dashboard/technician/my-services');
    } catch (err: any) {
      toast.error(err.message || 'Failed to create service');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout allowedRoles={['technician']}>
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            List a New Repair Service
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Create a detailed service offering. All newly submitted services require administrator moderation before appearing on public search listings.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-5">
          {/* Read-Only Technician Info */}
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Technician Credentials (Read-Only)</p>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400">Name:</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200">{user?.name}</p>
              </div>
              <div>
                <span className="text-slate-400">Email:</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Service Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Service Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. iPhone 14 Pro OLED Display & TrueTone Replacement"
              className="w-full rounded-xl border border-slate-300 bg-white py-2.5 px-3.5 text-sm text-slate-900 focus:border-brand-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          {/* Category & Service Mode */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white py-2.5 px-3.5 text-sm text-slate-900 focus:border-brand-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Service Delivery Mode *
              </label>
              <select
                value={serviceMode}
                onChange={(e) => setServiceMode(e.target.value as any)}
                className="w-full rounded-xl border border-slate-300 bg-white py-2.5 px-3.5 text-sm text-slate-900 focus:border-brand-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="Home Visit">Home Visit (At Customer Location)</option>
                <option value="Shop Drop-off">Shop Drop-off (At Technician Lab)</option>
              </select>
            </div>
          </div>

          {/* Starting Price & Estimated Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Starting Base Price ($ USD) *
              </label>
              <input
                type="number"
                required
                min="1"
                step="0.01"
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                placeholder="45"
                className="w-full rounded-xl border border-slate-300 bg-white py-2.5 px-3.5 text-sm text-slate-900 focus:border-brand-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Estimated Duration *
              </label>
              <input
                type="text"
                required
                value={estimatedDuration}
                onChange={(e) => setEstimatedDuration(e.target.value)}
                placeholder="e.g. 1-2 hours, 1 day"
                className="w-full rounded-xl border border-slate-300 bg-white py-2.5 px-3.5 text-sm text-slate-900 focus:border-brand-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          {/* Service Area */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Service Coverage Area *
            </label>
            <input
              type="text"
              required
              value={serviceArea}
              onChange={(e) => setServiceArea(e.target.value)}
              placeholder="e.g. Dhanmondi, Mohammadpur & Mirpur, Dhaka"
              className="w-full rounded-xl border border-slate-300 bg-white py-2.5 px-3.5 text-sm text-slate-900 focus:border-brand-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          {/* Service Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Detailed Service Description & Included Scope *
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail what is included, warranty coverage, genuine spare parts used..."
              className="w-full rounded-xl border border-slate-300 bg-white py-2 px-3 text-sm text-slate-900 focus:border-brand-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          {/* Service Image Upload (ImgBB File Input) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Service Banner Photo (File Upload via ImgBB)
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <label className="flex h-32 w-full sm:w-48 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800/60 transition-colors">
                <Upload className="h-6 w-6 text-slate-400 mb-1" />
                <span className="text-xs font-medium text-slate-500">Choose file</span>
                <span className="text-[10px] text-slate-400">PNG, JPG, WebP</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>

              {imagePreview && (
                <div className="relative h-32 w-48 overflow-hidden rounded-2xl border border-slate-200">
                  <img
                    src={imagePreview}
                    alt="Upload Preview"
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-xs font-semibold text-white shadow-md hover:bg-brand-700 disabled:opacity-50 transition-all"
            >
              {submitting ? 'Creating & Uploading...' : 'Submit Service Listing'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
