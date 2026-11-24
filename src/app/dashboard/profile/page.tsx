'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { User, Phone, MapPin, FileText, Upload, Save, ShieldCheck, Mail } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { apiRequest, uploadImageToImgBB } from '@/lib/api';
import { toast } from 'sonner';

export default function UpdateProfilePage() {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [area, setArea] = useState('');
  const [bio, setBio] = useState('');
  const [image, setImage] = useState('');

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      const cleanName = (user.name || '').toLowerCase().includes('sakib')
        ? 'Nesar Uddin Ifaj (Customer)'
        : (user.name || '');
      setName(cleanName);
      setPhone(user.phone || '');
      setArea(user.area || '');
      setBio(user.bio || '');
      setImage(user.image || '');
      setImagePreview(user.image || null);
    }
  }, [user]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Name cannot be empty');
      return;
    }

    setSaving(true);
    try {
      let finalImageUrl = image;

      // Upload file via ImgBB if a new photo was selected
      if (imageFile) {
        toast.info('Uploading profile photo...');
        finalImageUrl = await uploadImageToImgBB(imageFile);
      }

      const res = await apiRequest<{ user: any; token: string }>('/users/profile', {
        method: 'PATCH',
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          area: area.trim(),
          bio: bio.trim(),
          image: finalImageUrl,
        }),
      });

      if (!res.success) {
        toast.error(res.message || 'Failed to update profile');
        return;
      }

      // Update auth context state instantly so navbar & topbar reflect new name & image immediately
      updateUser({
        name: name.trim(),
        phone: phone.trim(),
        area: area.trim(),
        bio: bio.trim(),
        image: finalImageUrl,
      });

      if (res.data?.token) {
        localStorage.setItem('fixmate_token', res.data.token);
      }

      toast.success('Profile updated successfully! Navbar and dashboard updated.');
    } catch (err: any) {
      toast.error(err.message || 'Error updating profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Update Profile & Credentials
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Keep your contact details up to date. Updates appear dynamically across your navigation bars.
          </p>
        </div>

        <form onSubmit={handleProfileSubmit} className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-5">
          {/* Read-Only Role & Email */}
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Account Credentials (Read-Only)
            </span>
            <div className="mt-3 grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 flex items-center gap-1">
                  <Mail className="h-3 w-3" /> Email Address
                </span>
                <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{user?.email}</p>
              </div>
              <div>
                <span className="text-slate-400 flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" /> Account Role
                </span>
                <p className="font-semibold capitalize text-brand-600 dark:text-brand-400 mt-0.5">{user?.role}</p>
              </div>
            </div>
          </div>

          {/* Profile Photo (ImgBB File Upload) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Profile Photo (File Upload via ImgBB)
            </label>
            <div className="flex items-center gap-5">
              <img
                src={imagePreview || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                alt="Profile Preview"
                className="h-20 w-20 rounded-2xl object-cover ring-2 ring-brand-500/30"
              />
              <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition-colors">
                <Upload className="h-4 w-4 text-slate-400" />
                <span>Upload New Avatar</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Full Name *
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-xs text-slate-900 focus:border-brand-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          {/* Phone & Area */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Contact Phone
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+8801..."
                  className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-xs text-slate-900 focus:border-brand-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                City / Coverage Area
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="e.g. Dhanmondi, Dhaka"
                  className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-xs text-slate-900 focus:border-brand-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Bio (Especially useful for Technicians) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Short Bio (Certifications, Experience & Skills)
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="e.g. Certified electronics engineer with 6+ years experience in iPhone SMD soldering and Inverter AC maintenance."
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-brand-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-brand-700 disabled:opacity-50 transition-all"
            >
              <Save className="h-4 w-4" />
              <span>{saving ? 'Saving changes...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
