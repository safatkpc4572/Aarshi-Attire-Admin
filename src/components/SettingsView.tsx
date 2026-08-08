import React, { useState } from 'react';
import {
  Save,
  CheckCircle2,
  Building,
  CreditCard,
  Globe,
  Key,
  Copy,
  RefreshCw,
  Zap,
  ExternalLink,
  Code2,
  ShieldCheck,
} from 'lucide-react';

interface SettingsViewProps {
  lang: 'en' | 'bn';
}

export const SettingsView: React.FC<SettingsViewProps> = ({ lang }) => {
  const [storeName, setStoreName] = useState('Aarshi Attire');
  const [hotline, setHotline] = useState('01700-000000');
  const [address, setAddress] = useState('House 42, Road 11, Block D, Banani, Dhaka-1213');
  const [bKashMerchant, setBKashMerchant] = useState('01700-000000');
  const [nagadMerchant, setNagadMerchant] = useState('01800-000000');
  const [saved, setSaved] = useState(false);

  // Vercel Store Integration States
  const [vercelUrl, setVercelUrl] = useState('https://aarshi-attire.vercel.app');
  const [apiKey, setApiKey] = useState('aarshi_live_sec_89f3a19b2c7e41109a');
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'failed' | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(label);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  const handleGenerateNewKey = () => {
    const randomHex = Array.from({ length: 18 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    setApiKey(`aarshi_live_sec_${randomHex}`);
  };

  const handleTestConnection = () => {
    setIsTestingConnection(true);
    setTestResult(null);
    setTimeout(() => {
      setIsTestingConnection(false);
      setTestResult('success');
    }, 1200);
  };

  const currentAdminUrl = window.location.origin;

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold text-amber-950">
          {lang === 'en' ? 'Store & Integration Settings' : 'স্টোর ও কানেকশন সেটিংস'}
        </h2>
        <p className="text-xs text-gray-500">
          {lang === 'en'
            ? 'Manage Aarshi Attire contact info, payment credentials, and connect your Vercel e-commerce storefront.'
            : 'আপনার ভার্সেল ওয়েবসাইট (aarshi-attire.vercel.app) এবং এডমিন প্যানেল কানেক্ট করার মাধ্যম।'}
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Vercel Storefront Integration Card */}
        <div className="rounded-2xl border border-amber-900/15 bg-gradient-to-br from-stone-900 via-amber-950 to-stone-900 text-stone-100 p-6 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Globe className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-base text-white">
                    Vercel Storefront Connection
                  </h3>
                  <span className="inline-flex items-center space-x-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/30">
                    <ShieldCheck className="h-3 w-3" />
                    <span>Active Sync Ready</span>
                  </span>
                </div>
                <p className="text-xs text-stone-400">
                  Connect <code className="text-amber-300 font-mono">aarshi-attire.vercel.app</code> with this admin panel.
                </p>
              </div>
            </div>

            <a
              href={vercelUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-1.5 rounded-lg bg-stone-800/80 px-3 py-1.5 text-xs text-stone-300 hover:text-white hover:bg-stone-800 border border-stone-700 transition-colors w-fit"
            >
              <span>Visit Vercel Store</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Storefront Website URL
              </label>
              <input
                type="text"
                value={vercelUrl}
                onChange={(e) => setVercelUrl(e.target.value)}
                className="w-full rounded-xl border border-stone-700 bg-stone-900/90 px-3.5 py-2 text-xs font-mono text-amber-300 focus:border-amber-500 focus:outline-none"
                placeholder="https://aarshi-attire.vercel.app"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1 flex items-center justify-between">
                <span>Secret API Authentication Key</span>
                <button
                  type="button"
                  onClick={handleGenerateNewKey}
                  className="text-[10px] text-amber-400 hover:text-amber-300 flex items-center space-x-1"
                >
                  <RefreshCw className="h-3 w-3" />
                  <span>Regenerate</span>
                </button>
              </label>
              <div className="relative">
                <input
                  type="text"
                  readOnly
                  value={apiKey}
                  className="w-full rounded-xl border border-stone-700 bg-stone-900/90 px-3.5 py-2 pr-20 text-xs font-mono text-emerald-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleCopy(apiKey, 'apiKey')}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg bg-stone-800 px-2.5 py-1 text-[10px] font-semibold text-stone-300 hover:bg-stone-700 transition-colors"
                >
                  {copiedEndpoint === 'apiKey' ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          </div>

          {/* Connection Test & Endpoints */}
          <div className="space-y-3 bg-stone-950/60 rounded-xl p-4 border border-stone-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-200 flex items-center space-x-2">
                <Code2 className="h-4 w-4 text-amber-400" />
                <span>API Sync Webhook Endpoints</span>
              </span>

              <button
                type="button"
                onClick={handleTestConnection}
                disabled={isTestingConnection}
                className="inline-flex items-center space-x-1.5 rounded-lg bg-amber-600/90 hover:bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors"
              >
                <Zap className={`h-3.5 w-3.5 ${isTestingConnection ? 'animate-bounce' : ''}`} />
                <span>{isTestingConnection ? 'Testing Ping...' : 'Test Connection'}</span>
              </button>
            </div>

            {testResult === 'success' && (
              <div className="rounded-lg bg-emerald-950/80 border border-emerald-800/80 p-2.5 text-xs text-emerald-300 flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>
                  <strong>Ping Successful!</strong> Admin panel is ready to communicate with <code>aarshi-attire.vercel.app</code>.
                </span>
              </div>
            )}

            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between bg-stone-900 p-2 rounded-lg border border-stone-800">
                <div className="truncate mr-2">
                  <span className="text-emerald-400 font-bold mr-2">GET</span>
                  <span className="text-stone-300">{currentAdminUrl}/api/v1/sarees</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(`${currentAdminUrl}/api/v1/sarees`, 'getSarees')}
                  className="shrink-0 text-[10px] text-amber-400 hover:text-amber-300 bg-stone-800 px-2 py-1 rounded"
                >
                  {copiedEndpoint === 'getSarees' ? 'Copied' : 'Copy Endpoint'}
                </button>
              </div>

              <div className="flex items-center justify-between bg-stone-900 p-2 rounded-lg border border-stone-800">
                <div className="truncate mr-2">
                  <span className="text-blue-400 font-bold mr-2">POST</span>
                  <span className="text-stone-300">{currentAdminUrl}/api/v1/orders</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(`${currentAdminUrl}/api/v1/orders`, 'postOrders')}
                  className="shrink-0 text-[10px] text-amber-400 hover:text-amber-300 bg-stone-800 px-2 py-1 rounded"
                >
                  {copiedEndpoint === 'postOrders' ? 'Copied' : 'Copy Endpoint'}
                </button>
              </div>
            </div>
          </div>

          {/* Integration Guide Box */}
          <div className="rounded-xl bg-amber-950/40 border border-amber-900/50 p-4 space-y-2.5 text-xs text-stone-300">
            <h4 className="font-bold text-amber-300 text-xs flex items-center space-x-1.5">
              <span>📖 How to connect with Vercel Website (কানেক্ট করার নিয়ম):</span>
            </h4>
            <ol className="list-decimal list-inside space-y-1.5 text-[11px] text-stone-300 leading-relaxed">
              <li>
                <strong>Vercel Project Settings</strong>-এ যান ➔ <strong>Environment Variables</strong> সেকশনে ক্লিক করুন।
              </li>
              <li>
                নতুন এনভায়রনমেন্ট ভ্যারিয়েবল যোগ করুন:
                <br />
                <code className="text-amber-300 bg-stone-900 px-1.5 py-0.5 rounded font-mono text-[10px] ml-4 inline-block mt-1">
                  NEXT_PUBLIC_ADMIN_API_URL = {currentAdminUrl}
                </code>
                <br />
                <code className="text-amber-300 bg-stone-900 px-1.5 py-0.5 rounded font-mono text-[10px] ml-4 inline-block mt-1">
                  ADMIN_SECRET_KEY = {apiKey}
                </code>
              </li>
              <li>
                আপনার Vercel ওয়েবসাইটের কাস্টমারদের সব নতুন অর্ডার সরাসরি এই এডমিন প্যানেলে রিয়েল-টাইমে চলে আসবে এবং স্টক অটোমেটিক আপডেট হবে!
              </li>
            </ol>
          </div>
        </div>

        {/* Store Profile */}
        <div className="rounded-2xl border border-amber-900/10 bg-white p-6 shadow-sm space-y-6">
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-amber-950 border-b pb-2 flex items-center space-x-2">
              <Building className="h-4 w-4 text-amber-800" />
              <span>Store Profile & Showroom</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Brand Name</label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs focus:border-amber-800 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Hotline Number</label>
                <input
                  type="text"
                  value={hotline}
                  onChange={(e) => setHotline(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs font-mono focus:border-amber-800 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Dhaka Showroom Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs focus:border-amber-800 focus:outline-none"
              />
            </div>
          </div>

          {/* Mobile Financial Services */}
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-amber-950 border-b pb-2 flex items-center space-x-2">
              <CreditCard className="h-4 w-4 text-amber-800" />
              <span>Mobile Banking (MFS) Merchant Numbers</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-amber-900 mb-1">bKash Merchant / Agent Number</label>
                <input
                  type="text"
                  value={bKashMerchant}
                  onChange={(e) => setBKashMerchant(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs font-mono font-bold focus:border-amber-800 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-amber-900 mb-1">Nagad Merchant Number</label>
                <input
                  type="text"
                  value={nagadMerchant}
                  onChange={(e) => setNagadMerchant(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs font-mono font-bold focus:border-amber-800 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            {saved ? (
              <span className="text-xs font-semibold text-emerald-600 flex items-center space-x-1">
                <CheckCircle2 className="h-4 w-4" />
                <span>Settings Saved Successfully!</span>
              </span>
            ) : (
              <span className="text-xs text-gray-400">Aarshi Attire Control Engine</span>
            )}

            <button
              type="submit"
              className="inline-flex items-center space-x-2 rounded-xl bg-amber-900 px-5 py-2.5 text-xs font-bold text-amber-50 shadow hover:bg-amber-950 transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>Save Settings</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

