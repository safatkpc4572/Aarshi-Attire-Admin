import React, { useState } from 'react';
import { X, Send, Copy, Check, MessageSquare, Loader2 } from 'lucide-react';
import { Order } from '../types';

interface SMSModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  lang: 'en' | 'bn';
}

export const SMSModal: React.FC<SMSModalProps> = ({ isOpen, onClose, order, lang }) => {
  const [msgType, setMsgType] = useState<'payment_reminder' | 'shipping_update'>('payment_reminder');
  const [generatedText, setGeneratedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen || !order) return null;

  const handleGenerateCopy = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/marketing-copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: msgType,
          customerName: order.customerName,
          orderNumber: order.orderNumber,
          sareeName: order.items[0]?.sareeName || 'Aarshi Attire Saree',
          totalAmount: order.total,
          bKashTxnId: order.bKashTxnId,
        }),
      });
      const data = await res.json();
      setGeneratedText(data.text || '');
    } catch (e) {
      console.error('Error generating SMS copy:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-amber-900/10">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5 text-amber-900" />
            <h3 className="font-serif text-base font-bold text-amber-950">
              Customer Message Generator
            </h3>
          </div>
          <button onClick={onClose} className="rounded-full p-1 text-gray-400 hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Select Message Purpose
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMsgType('payment_reminder')}
                className={`rounded-xl p-2.5 text-xs font-semibold border text-left transition-colors ${
                  msgType === 'payment_reminder'
                    ? 'bg-amber-100 border-amber-800 text-amber-950 font-bold'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                bKash / Payment Reminder
              </button>
              <button
                type="button"
                onClick={() => setMsgType('shipping_update')}
                className={`rounded-xl p-2.5 text-xs font-semibold border text-left transition-colors ${
                  msgType === 'shipping_update'
                    ? 'bg-amber-100 border-amber-800 text-amber-950 font-bold'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                Courier Delivery Update
              </button>
            </div>
          </div>

          <button
            onClick={handleGenerateCopy}
            disabled={loading}
            className="w-full inline-flex items-center justify-center space-x-2 rounded-xl bg-amber-900 px-4 py-2 text-xs font-bold text-amber-50 shadow hover:bg-amber-950 transition-colors"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Generating Message...</span>
              </>
            ) : (
              <span>Generate Bengali SMS Template</span>
            )}
          </button>

          {generatedText && (
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-700">
                Generated Message Text:
              </label>
              <div className="relative rounded-xl border border-amber-200 bg-amber-50/60 p-3 text-xs text-gray-800 leading-relaxed font-sans">
                {generatedText}
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-gray-500 font-mono">
                  Recipient: {order.phone} ({order.customerName})
                </span>
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center space-x-1 rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-black transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy Message</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
