import React, { useState } from 'react';
import { Scissors, Phone, MapPin, CheckCircle2, DollarSign } from 'lucide-react';
import { Weaver } from '../types';

interface WeaversViewProps {
  weavers: Weaver[];
  lang: 'en' | 'bn';
}

export const WeaversView: React.FC<WeaversViewProps> = ({ weavers, lang }) => {
  const formatBDT = (amount: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      maximumFractionDigits: 0,
    })
      .format(amount)
      .replace('BDT', '৳');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-xl font-bold text-amber-950">
          {lang === 'en' ? 'Master Artisans & Weaver Accounts' : 'তাঁতি ও কারিগর পে-আউট হিসাব'}
        </h2>
        <p className="text-xs text-gray-500">
          {lang === 'en'
            ? 'Track saree sourcing volume and pending payouts for Demra Jamdani, Tangail Handloom, and Rajshahi Silk master weavers.'
            : 'ডেমরা, টাঙ্গাইল ও রাজশাহীর তাঁতিদের সাথে শাড়ি ক্রয়ের বকেয়া হিসাব।'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {weavers.map((w) => (
          <div
            key={w.id}
            className="rounded-2xl border border-amber-900/10 bg-white p-5 shadow-sm space-y-4"
          >
            <div className="flex items-start justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="font-bold text-amber-950 text-sm">{w.name}</h3>
                <p className="text-xs text-gray-500 flex items-center space-x-1 mt-0.5">
                  <MapPin className="h-3 w-3 text-amber-800" />
                  <span>{w.region}</span>
                </p>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-900">
                <Scissors className="h-4 w-4" />
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <p className="text-gray-700">
                Specialty: <span className="font-semibold text-amber-950">{w.fabricSpecialty}</span>
              </p>
              <p className="text-gray-700">
                Sarees Supplied: <span className="font-bold">{w.sareesSupplied} Pieces</span>
              </p>
              <p className="font-mono text-gray-700">Phone: {w.phone}</p>
            </div>

            <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-100 flex justify-between items-center text-xs">
              <div>
                <span className="text-[10px] text-gray-500">Pending Payout:</span>
                <p className="font-serif font-bold text-rose-700 text-sm">{formatBDT(w.pendingPayout)}</p>
              </div>
              <button className="rounded-lg bg-amber-900 px-3 py-1.5 text-[11px] font-bold text-amber-50 hover:bg-amber-950">
                Pay Weaver
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
