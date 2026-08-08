import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  SlidersHorizontal,
  Edit2,
  Trash2,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Tag,
  Grid,
  List as ListIcon,
  ShoppingBag,
} from 'lucide-react';
import { Saree, FabricType } from '../types';

interface SareeInventoryViewProps {
  sarees: Saree[];
  lang: 'en' | 'bn';
  onAddSaree: () => void;
  onEditSaree: (saree: Saree) => void;
  onDeleteSaree: (id: string) => void;
  onUpdateStock: (id: string, newStock: number) => void;
}

export const SareeInventoryView: React.FC<SareeInventoryViewProps> = ({
  sarees,
  lang,
  onAddSaree,
  onEditSaree,
  onDeleteSaree,
  onUpdateStock,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFabric, setSelectedFabric] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'instock'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const formatBDT = (amount: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      maximumFractionDigits: 0,
    })
      .format(amount)
      .replace('BDT', '৳');
  };

  const filteredSarees = sarees.filter((saree) => {
    const matchesSearch =
      saree.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      saree.nameBn.includes(searchTerm) ||
      saree.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      saree.fabric.toLowerCase().includes(searchTerm.toLowerCase()) ||
      saree.color.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFabric = selectedFabric === 'all' || saree.fabric === selectedFabric;

    const matchesStock =
      stockFilter === 'all' ||
      (stockFilter === 'low' && saree.stock <= saree.reorderLevel) ||
      (stockFilter === 'instock' && saree.stock > saree.reorderLevel);

    return matchesSearch && matchesFabric && matchesStock;
  });

  const fabrics = Array.from(new Set(sarees.map((s) => s.fabric)));

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-xl font-bold text-amber-950">
            {lang === 'en' ? 'Saree Inventory & Catalog' : 'শাড়ির ক্যাটালগ ও স্টক পোর্টফোলিও'}
          </h2>
          <p className="text-xs text-gray-500">
            {lang === 'en'
              ? `Showing ${filteredSarees.length} of ${sarees.length} saree designs in store inventory.`
              : `মোট ${sarees.length} টি শাড়ির মধ্য থেকে ${filteredSarees.length} টি শাড়ি দেখাচ্ছে।`}
          </p>
        </div>

        <button
          onClick={onAddSaree}
          className="inline-flex items-center justify-center space-x-2 rounded-xl bg-amber-900 px-4 py-2.5 text-xs font-bold text-amber-50 shadow hover:bg-amber-950 transition-colors shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>{lang === 'en' ? 'Add New Saree' : 'নতুন শাড়ি যুক্ত করুন'}</span>
        </button>
      </div>

      {/* Filters & Search Control Bar */}
      <div className="rounded-2xl border border-amber-900/10 bg-white p-4 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder={
                lang === 'en'
                  ? 'Search by Saree name, Code (AA-JAM-101), fabric, color...'
                  : 'শাড়ির নাম, কোড, ক্যাটালগ সার্চ করুন...'
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-gray-200 pl-9 pr-4 py-2 text-xs focus:border-amber-800 focus:outline-none"
            />
          </div>

          {/* Stock Filter & View Switch */}
          <div className="flex items-center space-x-2">
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value as any)}
              className="rounded-xl border border-gray-200 px-3 py-2 text-xs font-medium focus:border-amber-800 focus:outline-none bg-white"
            >
              <option value="all">{lang === 'en' ? 'All Stock Status' : 'সব স্টক স্টেটাস'}</option>
              <option value="low">⚠️ {lang === 'en' ? 'Low Stock Only' : 'কম স্টক শাড়ি'}</option>
              <option value="instock">✅ {lang === 'en' ? 'In Stock' : 'পর্যাপ্ত স্টক'}</option>
            </select>

            <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 p-1">
              <button
                onClick={() => setViewMode('table')}
                className={`rounded-lg p-1.5 transition-colors ${
                  viewMode === 'table' ? 'bg-white shadow text-amber-900' : 'text-gray-400'
                }`}
                title="Table View"
              >
                <ListIcon className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`rounded-lg p-1.5 transition-colors ${
                  viewMode === 'grid' ? 'bg-white shadow text-amber-900' : 'text-gray-400'
                }`}
                title="Grid View"
              >
                <Grid className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Fabric Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 pt-1">
          <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide shrink-0">
            Fabric:
          </span>
          <button
            onClick={() => setSelectedFabric('all')}
            className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors shrink-0 ${
              selectedFabric === 'all'
                ? 'bg-amber-900 text-amber-50 font-bold'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All Fabrics
          </button>
          {fabrics.map((f) => (
            <button
              key={f}
              onClick={() => setSelectedFabric(f)}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors shrink-0 ${
                selectedFabric === f
                  ? 'bg-amber-900 text-amber-50 font-bold'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Content Rendering: Table or Grid */}
      {viewMode === 'table' ? (
        <div className="overflow-hidden rounded-2xl border border-amber-900/10 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-700">
              <thead className="bg-amber-50/80 text-[11px] uppercase font-bold text-amber-950 border-b border-amber-900/10">
                <tr>
                  <th className="p-3.5">Saree Details</th>
                  <th className="p-3.5">Fabric & Craft</th>
                  <th className="p-3.5">Selling Price</th>
                  <th className="p-3.5">Margin (৳)</th>
                  <th className="p-3.5">Stock Counter</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredSarees.map((saree) => {
                  const isLowStock = saree.stock <= saree.reorderLevel;
                  const profitMargin = saree.price - saree.sourcingCost;

                  return (
                    <tr key={saree.id} className="hover:bg-amber-50/40 transition-colors">
                      <td className="p-3.5">
                        <div className="flex items-center space-x-3">
                          <img
                            src={saree.imageUrl}
                            alt={saree.name}
                            className="h-12 w-12 rounded-xl object-cover shrink-0 border border-gray-200"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <div className="flex items-center space-x-1.5">
                              <span className="font-mono text-[10px] font-bold bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded">
                                {saree.code}
                              </span>
                              <span className="font-bold text-amber-950">{saree.name}</span>
                            </div>
                            <p className="text-[11px] text-gray-500 font-serif">{saree.nameBn}</p>
                            <p className="text-[10px] text-gray-400">Color: {saree.color}</p>
                          </div>
                        </div>
                      </td>

                      <td className="p-3.5">
                        <div className="font-semibold text-gray-800">{saree.fabric}</div>
                        <div className="text-[10px] text-gray-500">{saree.craft}</div>
                      </td>

                      <td className="p-3.5 font-serif font-bold text-amber-950 text-sm">
                        {formatBDT(saree.salePrice || saree.price)}
                        {saree.salePrice && (
                          <div className="text-[10px] text-gray-400 line-through font-normal">
                            {formatBDT(saree.price)}
                          </div>
                        )}
                      </td>

                      <td className="p-3.5 font-medium text-emerald-700">
                        +{formatBDT(profitMargin)}
                      </td>

                      <td className="p-3.5">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => onUpdateStock(saree.id, Math.max(0, saree.stock - 1))}
                            className="h-6 w-6 rounded bg-gray-100 hover:bg-gray-200 font-bold text-xs"
                          >
                            -
                          </button>
                          <span
                            className={`font-mono font-bold text-xs px-2 py-0.5 rounded ${
                              isLowStock
                                ? 'bg-rose-100 text-rose-800 font-extrabold'
                                : 'bg-amber-100 text-amber-900'
                            }`}
                          >
                            {saree.stock}
                          </span>
                          <button
                            onClick={() => onUpdateStock(saree.id, saree.stock + 1)}
                            className="h-6 w-6 rounded bg-gray-100 hover:bg-gray-200 font-bold text-xs"
                          >
                            +
                          </button>
                        </div>
                        {isLowStock && (
                          <span className="text-[10px] font-bold text-rose-600 block mt-0.5">
                            ⚠️ Low Stock
                          </span>
                        )}
                      </td>

                      <td className="p-3.5">
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                          {saree.status.toUpperCase()}
                        </span>
                      </td>

                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <button
                            onClick={() => onEditSaree(saree)}
                            className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Edit Saree"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => onDeleteSaree(saree.id)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid Mode */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSarees.map((saree) => {
            const isLowStock = saree.stock <= saree.reorderLevel;

            return (
              <div
                key={saree.id}
                className="group overflow-hidden rounded-2xl border border-amber-900/10 bg-white shadow-sm hover:shadow-md transition-all"
              >
                <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                  <img
                    src={saree.imageUrl}
                    alt={saree.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    <span className="font-mono text-[10px] font-bold bg-amber-950/90 text-amber-200 px-2 py-0.5 rounded backdrop-blur">
                      {saree.code}
                    </span>
                    {saree.isBestSeller && (
                      <span className="text-[10px] font-bold bg-amber-500 text-white px-2 py-0.5 rounded shadow">
                        Best Seller
                      </span>
                    )}
                  </div>

                  <div className="absolute top-2 right-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold shadow ${
                        isLowStock ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'
                      }`}
                    >
                      {saree.stock} in stock
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-amber-950 text-xs line-clamp-1">{saree.name}</h3>
                      <p className="text-[11px] text-gray-500 font-serif">{saree.nameBn}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-gray-100">
                    <span className="text-gray-500">{saree.fabric}</span>
                    <span className="font-serif font-bold text-amber-950 text-sm">
                      {formatBDT(saree.salePrice || saree.price)}
                    </span>
                  </div>

                  <div className="flex items-center justify-end pt-2">
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => onEditSaree(saree)}
                        className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDeleteSaree(saree.id)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
