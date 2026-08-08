import React, { useState, useEffect } from 'react';
import { X, Sparkles, Image as ImageIcon, Upload, Loader2, Check } from 'lucide-react';
import { Saree, FabricType, CraftType } from '../types';

interface SareeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (saree: Partial<Saree>) => void;
  editingSaree?: Saree | null;
  lang: 'en' | 'bn';
}

const FABRICS: FabricType[] = [
  'Dhakai Muslin',
  'Jamdani',
  'Banarasi Katan',
  'Rajshahi Silk',
  'Tassar Silk',
  'Organza',
  'Georgette',
  'Cotton Handloom',
  'Tissue Silk',
  'Chanderi',
];

const CRAFTS: CraftType[] = [
  'Hand Woven',
  'Zari Work',
  'Resham Embroidery',
  'Hand Block Print',
  'Digital Print',
  'Gotta Patti',
  'Mirror Work',
  'Kantha Stitch',
];

const SAMPLE_IMAGES = [
  'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&q=80&w=800',
];

export const SareeModal: React.FC<SareeModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingSaree,
  lang,
}) => {
  const [formData, setFormData] = useState<Partial<Saree>>({
    code: `AA-JAM-${Math.floor(100 + Math.random() * 900)}`,
    name: '',
    nameBn: '',
    price: 18500,
    salePrice: 16500,
    sourcingCost: 11000,
    fabric: 'Dhakai Muslin',
    craft: 'Hand Woven',
    color: 'Royal Blue & Gold',
    colorHex: '#1E3A8A',
    blouseOption: 'Unstitched Included',
    stock: 5,
    reorderLevel: 2,
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: false,
    description: '',
    descriptionBn: '',
    careInstructions: 'Dry Clean Only. Preserve wrapped in white muslin cloth.',
    imageUrl: SAMPLE_IMAGES[0],
    tags: ['Traditional', 'Festive'],
    status: 'active',
  });

  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  useEffect(() => {
    if (editingSaree) {
      setFormData({ ...editingSaree });
    } else {
      setFormData({
        code: `AA-JAM-${Math.floor(100 + Math.random() * 900)}`,
        name: '',
        nameBn: '',
        price: 18500,
        salePrice: 16500,
        sourcingCost: 11000,
        fabric: 'Dhakai Muslin',
        craft: 'Hand Woven',
        color: 'Royal Blue & Gold',
        colorHex: '#1E3A8A',
        blouseOption: 'Unstitched Included',
        stock: 5,
        reorderLevel: 2,
        isFeatured: true,
        isNewArrival: true,
        isBestSeller: false,
        description: '',
        descriptionBn: '',
        careInstructions: 'Dry Clean Only. Preserve wrapped in white muslin cloth.',
        imageUrl: SAMPLE_IMAGES[0],
        tags: ['Traditional', 'Festive'],
        status: 'active',
      });
    }
  }, [editingSaree, isOpen]);

  if (!isOpen) return null;

  const handleGenerateAIDescription = async () => {
    setIsGeneratingAI(true);
    try {
      const res = await fetch('/api/ai/describe-saree', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          fabric: formData.fabric,
          craft: formData.craft,
          color: formData.color,
          price: formData.price,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setFormData((prev) => ({
          ...prev,
          name: prev.name || data.titleEn || prev.name,
          nameBn: prev.nameBn || data.titleBn || prev.nameBn,
          description: data.descriptionEn || prev.description,
          descriptionBn: data.descriptionBn || prev.descriptionBn,
          careInstructions: data.careInstructions || prev.careInstructions,
        }));
      }
    } catch (e) {
      console.error('Error generating AI description:', e);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl border border-amber-900/10 max-h-[90vh] overflow-y-auto my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
          <div>
            <h2 className="font-serif text-xl font-bold text-amber-950">
              {editingSaree
                ? lang === 'en'
                  ? 'Edit Saree Details'
                  : 'শাড়ির তথ্য পরিবর্তন করুন'
                : lang === 'en'
                ? 'Add New Saree to Catalog'
                : 'ক্যাটালগে নতুন শাড়ি যোগ করুন'}
            </h2>
            <p className="text-xs text-gray-500">
              {lang === 'en'
                ? 'Fill in fabric, craft, stock, and pricing details in BDT (৳).'
                : 'শাড়ির ফ্যাব্রিক, কারুকাজ, মূল্য ও স্টক এন্ট্রি দিন।'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Code & Saree Name */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Product Code / SKU
              </label>
              <input
                type="text"
                required
                value={formData.code || ''}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs font-mono font-bold focus:border-amber-800 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Saree Name (English)
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Royal Dhakai Muslin Jamdani"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs focus:border-amber-800 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Saree Name (বাংলা)
              </label>
              <input
                type="text"
                placeholder="যেমন: ঢাকাই মসলিন জামদানি শাড়ি"
                value={formData.nameBn || ''}
                onChange={(e) => setFormData({ ...formData, nameBn: e.target.value })}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs focus:border-amber-800 focus:outline-none"
              />
            </div>
          </div>

          {/* Fabric & Craft & Color */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Fabric Type
              </label>
              <select
                value={formData.fabric}
                onChange={(e) => setFormData({ ...formData, fabric: e.target.value as FabricType })}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs focus:border-amber-800 focus:outline-none"
              >
                {FABRICS.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Craftsmanship
              </label>
              <select
                value={formData.craft}
                onChange={(e) => setFormData({ ...formData, craft: e.target.value as CraftType })}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs focus:border-amber-800 focus:outline-none"
              >
                {CRAFTS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Color Name
              </label>
              <input
                type="text"
                value={formData.color || ''}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                placeholder="e.g. Royal Navy & Gold"
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs focus:border-amber-800 focus:outline-none"
              />
            </div>
          </div>

          {/* Pricing & Sourcing Cost (BDT ৳) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-amber-50/50 p-3 rounded-xl border border-amber-100">
            <div>
              <label className="block text-xs font-bold text-amber-950 mb-1">
                Regular Price (BDT ৳)
              </label>
              <input
                type="number"
                required
                value={formData.price || 0}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full rounded-xl border border-amber-200 bg-white px-3 py-2 text-xs font-bold focus:border-amber-800 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-amber-900 mb-1">
                Discounted Sale Price (৳)
              </label>
              <input
                type="number"
                value={formData.salePrice || ''}
                onChange={(e) => setFormData({ ...formData, salePrice: Number(e.target.value) })}
                placeholder="Optional sale price"
                className="w-full rounded-xl border border-amber-200 bg-white px-3 py-2 text-xs focus:border-amber-800 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-amber-900 mb-1">
                Weaver Sourcing Cost (৳)
              </label>
              <input
                type="number"
                value={formData.sourcingCost || ''}
                onChange={(e) => setFormData({ ...formData, sourcingCost: Number(e.target.value) })}
                placeholder="Cost price to calculate profit"
                className="w-full rounded-xl border border-amber-200 bg-white px-3 py-2 text-xs focus:border-amber-800 focus:outline-none"
              />
            </div>
          </div>

          {/* Stock & Reorder & Blouse */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Stock Quantity
              </label>
              <input
                type="number"
                min="0"
                value={formData.stock || 0}
                onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs font-bold focus:border-amber-800 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Low Stock Alert Threshold
              </label>
              <input
                type="number"
                min="1"
                value={formData.reorderLevel || 2}
                onChange={(e) => setFormData({ ...formData, reorderLevel: Number(e.target.value) })}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs focus:border-amber-800 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Blouse Piece Option
              </label>
              <select
                value={formData.blouseOption}
                onChange={(e) => setFormData({ ...formData, blouseOption: e.target.value as any })}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs focus:border-amber-800 focus:outline-none"
              >
                <option value="Unstitched Included">Unstitched Included</option>
                <option value="Stitched Custom">Stitched Custom</option>
                <option value="Without Blouse">Without Blouse</option>
              </select>
            </div>
          </div>

          {/* Image Selection */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Main Saree Image URL
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={formData.imageUrl || ''}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-xs focus:border-amber-800 focus:outline-none"
              />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-medium text-gray-500">Preset Sample Photos:</span>
              <div className="flex space-x-2">
                {SAMPLE_IMAGES.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setFormData({ ...formData, imageUrl: img })}
                    className={`h-10 w-10 rounded-lg overflow-hidden border-2 transition-all ${
                      formData.imageUrl === img ? 'border-amber-800 scale-105' : 'border-gray-200'
                    }`}
                  >
                    <img src={img} alt="sample" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* AI Generator Action Button */}
          <div className="flex items-center justify-between rounded-xl bg-[#56181d] p-3 text-white border border-[#3d1115]">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-amber-300" />
              <div>
                <p className="text-xs font-bold">Auto-Generate Product Description</p>
                <p className="text-[10px] text-rose-200/80">Uses Gemini AI to write poetic Bengali & English product descriptions</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleGenerateAIDescription}
              disabled={isGeneratingAI}
              className="inline-flex items-center space-x-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-[#56181d] hover:bg-stone-100 transition-colors disabled:opacity-50"
            >
              {isGeneratingAI ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Writing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5 text-[#56181d]" />
                  <span>Generate with AI</span>
                </>
              )}
            </button>
          </div>

          {/* Description EN & BN */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                English Description
              </label>
              <textarea
                rows={3}
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full rounded-xl border border-gray-200 p-2.5 text-xs focus:border-amber-800 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                বাংলা বর্ণনা
              </label>
              <textarea
                rows={3}
                value={formData.descriptionBn || ''}
                onChange={(e) => setFormData({ ...formData, descriptionBn: e.target.value })}
                className="w-full rounded-xl border border-gray-200 p-2.5 text-xs focus:border-amber-800 focus:outline-none"
              />
            </div>
          </div>

          {/* Badges & Flags */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <label className="inline-flex items-center space-x-2 text-xs font-semibold text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isFeatured || false}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="rounded border-gray-300 text-amber-800 focus:ring-amber-800"
              />
              <span>Featured on Homepage</span>
            </label>
            <label className="inline-flex items-center space-x-2 text-xs font-semibold text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isNewArrival || false}
                onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })}
                className="rounded border-gray-300 text-amber-800 focus:ring-amber-800"
              />
              <span>New Arrival Tag</span>
            </label>
            <label className="inline-flex items-center space-x-2 text-xs font-semibold text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isBestSeller || false}
                onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                className="rounded border-gray-300 text-amber-800 focus:ring-amber-800"
              />
              <span>Best Seller Tag</span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-amber-900 px-5 py-2 text-xs font-bold text-amber-50 hover:bg-amber-950 transition-colors shadow-md"
            >
              {editingSaree ? 'Update Saree' : 'Save Saree to Catalog'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
