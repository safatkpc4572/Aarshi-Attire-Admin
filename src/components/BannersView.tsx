import React, { useState } from 'react';
import { Image as ImageIcon, Plus, ExternalLink, Eye, CheckCircle } from 'lucide-react';
import { Banner } from '../types';

interface BannersViewProps {
  banners: Banner[];
  lang: 'en' | 'bn';
  onAddBanner: (banner: Banner) => void;
  onToggleBanner: (id: string) => void;
}

export const BannersView: React.FC<BannersViewProps> = ({ banners, lang, onAddBanner, onToggleBanner }) => {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [buttonText, setButtonText] = useState('Explore Collection');
  const [linkUrl, setLinkUrl] = useState('https://aarshi-attire.vercel.app/');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !imageUrl) return;
    const newBanner: Banner = {
      id: `ban-${Date.now()}`,
      title,
      subtitle,
      imageUrl,
      buttonText,
      linkUrl,
      isActive: true,
      displayOrder: banners.length + 1,
    };
    onAddBanner(newBanner);
    setTitle('');
    setSubtitle('');
    setImageUrl('');
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-xl font-bold text-amber-950">
            {lang === 'en' ? 'Storefront Hero Banners & Announcements' : 'ওয়েবসাইট ব্যানার ও প্রচার স্লাইডার'}
          </h2>
          <p className="text-xs text-gray-500">
            {lang === 'en'
              ? 'Control homepage promotional sliders and marquee headers for aarshi-attire.vercel.app.'
              : 'ওয়েবসাইটের মূল ব্যানার ও প্রমোশনাল স্লাইডার পরিচালনা করুন।'}
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center space-x-1.5 rounded-xl bg-amber-900 px-4 py-2.5 text-xs font-bold text-amber-50 shadow hover:bg-amber-950 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Banner</span>
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSave} className="rounded-2xl border border-amber-900/20 bg-amber-50/50 p-5 space-y-4">
          <h3 className="font-serif text-sm font-bold text-amber-950">New Banner Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Headline Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Autumn Dhakai Muslin Jamdani Collection"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs focus:border-amber-800 focus:outline-none bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Subtext / Description</label>
              <input
                type="text"
                placeholder="e.g. Handwoven with 84-count delicate zari thread"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs focus:border-amber-800 focus:outline-none bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Banner Image URL</label>
            <input
              type="text"
              required
              placeholder="https://..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs focus:border-amber-800 focus:outline-none bg-white"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-xs font-semibold text-gray-600 rounded-xl bg-white border border-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-amber-50 rounded-xl bg-amber-900 hover:bg-amber-950"
            >
              Save Banner
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {banners.map((b) => (
          <div
            key={b.id}
            className="overflow-hidden rounded-2xl border border-amber-900/10 bg-white p-4 shadow-sm flex flex-col md:flex-row items-center gap-4"
          >
            <img
              src={b.imageUrl}
              alt={b.title}
              className="h-32 w-full md:w-60 rounded-xl object-cover shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="flex-1 space-y-1">
              <div className="flex items-center space-x-2">
                <span className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-900">
                  Order #{b.displayOrder}
                </span>
                <h3 className="font-serif font-bold text-amber-950 text-base">{b.title}</h3>
              </div>
              <p className="text-xs text-gray-600">{b.subtitle}</p>
              <div className="pt-2 flex items-center space-x-2">
                <button
                  onClick={() => onToggleBanner(b.id)}
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                    b.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {b.isActive ? 'Active on Website' : 'Hidden'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
