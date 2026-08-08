import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Bot, User, Copy, Check, Loader2, Lightbulb } from 'lucide-react';
import { Saree, Order } from '../types';

interface AICopilotViewProps {
  sarees: Saree[];
  orders: Order[];
  lang: 'en' | 'bn';
  initialPrompt?: string;
}

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  time: string;
}

export const AICopilotView: React.FC<AICopilotViewProps> = ({ sarees, orders, lang, initialPrompt }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: lang === 'en'
        ? 'Hello! I am your Aarshi AI Copilot. I can write social media captions for your Jamdani & Banarasi sarees, generate bKash SMS templates, suggest pricing strategies for Eid/Puja, or draft customer responses.'
        : 'নমস্কার/সালাম! আমি আরশি এআই সহকারী। আপনার শাড়ির ক্যাটালগের জন্য সোশ্যাল মিডিয়া ক্যাপশন, বিকাশ মেসেজ, ঈদ ক্যাম্পেইনের আইডিয়া ও খদ্দেরদের প্রশ্নের উত্তর তৈরিতে সাহায্য করতে পারি।',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialPrompt) {
      setInput(initialPrompt);
    }
  }, [initialPrompt]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: query,
          contextData: {
            sareeCount: sarees.length,
            pendingOrdersCount: orders.filter((o) => o.status === 'pending').length,
            sampleSarees: sarees.slice(0, 3).map((s) => ({ name: s.name, fabric: s.fabric, price: s.price })),
          },
        }),
      });

      const data = await res.json();
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: data.reply || 'Sorry, I could not process that query.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (e) {
      console.error('Copilot error:', e);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    'Write an attractive Instagram Reel caption for our Dhakai Jamdani collection',
    'How much profit margin should I set for Rajshahi Silk Sarees?',
    'Draft a polite SMS in Bengali for pending bKash payment confirmation',
    'Give me 3 Facebook Ad headline ideas for Eid Saree Festival',
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] rounded-2xl border border-amber-900/10 bg-white shadow-sm overflow-hidden">
      {/* Studio Header */}
      <div className="flex items-center justify-between border-b border-[#3d1115] bg-[#56181d] p-4 text-white">
        <div className="flex items-center space-x-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#3d1115] text-amber-200 border border-[#722027]">
            <Sparkles className="h-5 w-5 text-amber-300" />
          </div>
          <div>
            <h2 className="font-serif font-bold text-sm text-white">
              Aarshi AI Studio & Business Copilot
            </h2>
            <p className="text-[11px] text-rose-200/70">
              Powered by Gemini AI • Trained on Saree E-Commerce & Marketing
            </p>
          </div>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start space-x-2.5 ${
              m.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}
          >
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-bold text-xs ${
                m.sender === 'user'
                  ? 'bg-[#56181d] text-white'
                  : 'bg-stone-200 text-stone-900 border border-stone-300'
              }`}
            >
              {m.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4 text-[#56181d]" />}
            </div>

            <div
              className={`max-w-xl rounded-xl p-3.5 text-xs shadow-sm leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-[#56181d] text-white rounded-tr-none'
                  : 'bg-white text-stone-800 border border-stone-200 rounded-tl-none font-sans'
              }`}
            >
              <div className="whitespace-pre-wrap">{m.text}</div>
              <span className={`block text-[9px] mt-1 text-right ${m.sender === 'user' ? 'text-amber-200/70' : 'text-gray-400'}`}>
                {m.time}
              </span>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center space-x-2 text-xs text-amber-900 font-medium p-2">
            <Loader2 className="h-4 w-4 animate-spin text-amber-800" />
            <span>Aarshi AI is thinking...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Bar */}
      <div className="border-t border-amber-900/10 bg-white p-2 overflow-x-auto flex items-center space-x-2">
        <Lightbulb className="h-4 w-4 text-amber-700 shrink-0 ml-2" />
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(qp)}
            className="rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-[11px] text-amber-950 hover:bg-amber-100 whitespace-nowrap shrink-0 transition-colors"
          >
            {qp}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="border-t border-amber-900/10 bg-white p-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            placeholder={
              lang === 'en'
                ? 'Ask Aarshi AI for saree captions, pricing advice, or bKash messages...'
                : 'আপনার শাড়ির ক্যাটালগ বা প্রমোশন সংক্রান্ত প্রশ্ন লিখুন...'
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-xs focus:border-amber-800 focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="inline-flex items-center space-x-1 rounded-xl bg-amber-900 px-4 py-2.5 text-xs font-bold text-amber-50 hover:bg-amber-950 transition-colors disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
