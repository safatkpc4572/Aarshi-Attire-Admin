import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy initialization for Gemini AI client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY is not set. Gemini features will return fallback content.');
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || 'DUMMY_KEY',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'Aarshi Attire Saree Business Admin Panel' });
});

// AI Endpoint: Generate Saree Product Title & Bengali/English Description
app.post('/api/ai/describe-saree', async (req, res) => {
  try {
    const { name, fabric, craft, color, price, targetAudience } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        success: true,
        descriptionEn: `Exquisite handwoven ${fabric || 'Saree'} showcasing traditional ${craft || 'artistry'}. Dyed in a rich ${color || 'vibrant'} hue, crafted for timeless elegance.`,
        descriptionBn: `ঐতিহ্যবাহী ${craft || 'কারুকাজে'} নির্মিত অপূর্ব ${fabric || 'শাড়ি'}। রয়্যাল লুক এবং অনন্য মান যা আপনার রূপকে করবে আরও আকর্ষণীয়।`,
        story: `Crafted by heritage weavers preserving centuries-old Bengal textile techniques.`,
        careInstructions: 'Dry Clean Only. Wrap in unbleached cotton or muslin when storing.',
        socialCaption: `✨ Unveiling our new ${name || 'Aarshi Attire Saree'}! Crafted in pure ${fabric || 'silk'} with intricate ${craft || 'work'}. DM to order or visit our website! 📦 Delivery all over Bangladesh. #AarshiAttire #SareeCollection #Jamdani #BangladeshiFashion`,
      });
    }

    const ai = getGeminiClient();
    const prompt = `You are a luxury fashion copywriter specializing in authentic Bangladeshi Sarees for the brand "Aarshi Attire".
Given the saree details below, generate product details in valid JSON format:
Saree Name/Concept: ${name || 'Unspecified'}
Fabric: ${fabric || 'Muslin Jamdani'}
Craft/Work: ${craft || 'Handwoven'}
Color: ${color || 'Royal Blue'}
Price in BDT: ৳${price || '25,000'}
Target Audience: ${targetAudience || 'Festive & Bridal E-commerce buyers in Bangladesh'}

Return ONLY a JSON object with these keys:
{
  "titleEn": "Refined English title for product page",
  "titleBn": "সুন্দর বাংলা টাইটেল",
  "descriptionEn": "Engaging 2-3 sentence English product description emphasizing drape, texture, and heritage",
  "descriptionBn": "মনোমুগ্ধকর বাংলা পণ্যের বিবরণ (২-৩ বাক্য)",
  "story": "1-2 sentences highlighting weaver craftsmanship & heritage",
  "careInstructions": "Fabric care guidelines (e.g. Dry Clean Only)",
  "socialCaption": "An alluring Instagram/Facebook post caption with emojis and hashtags (bKash COD delivery notes included)"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const jsonText = response.text ? response.text.trim() : '{}';
    const parsedData = JSON.parse(jsonText);
    res.json({ success: true, ...parsedData });
  } catch (error: any) {
    console.error('Error generating saree description:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to generate AI description' });
  }
});

// AI Endpoint: Aarshi AI Copilot Chat
app.post('/api/ai/copilot', async (req, res) => {
  try {
    const { prompt, contextData } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        reply: `[Aarshi AI Assistant]: I can help you manage your saree store! For pricing Jamdani vs Banarasi, we recommend keeping a 35-45% gross profit margin to cover artisan sourcing and courier return contingencies in Bangladesh.`,
      });
    }

    const ai = getGeminiClient();
    const systemPrompt = `You are "Aarshi AI Copilot", an expert e-commerce business assistant and saree fashion consultant for "Aarshi Attire" (a Bangladeshi luxury saree brand).
You speak warmly, professionally, and fluently in English and Bengali (Banglish/Bengali script).
Help the admin with pricing strategies, inventory restock alerts, bKash payment verification guidance, seasonal campaign planning (Eid-ul-Fitr, Durga Puja, Wedding Season), and customer support responses.
Context data: ${JSON.stringify(contextData || {})}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
      },
    });

    res.json({ reply: response.text || 'No response generated.' });
  } catch (error: any) {
    console.error('Error in AI Copilot:', error);
    res.status(500).json({ error: error.message || 'AI Copilot error' });
  }
});

// AI Endpoint: Generate Marketing Message or SMS Template
app.post('/api/ai/marketing-copy', async (req, res) => {
  try {
    const { type, customerName, orderNumber, sareeName, totalAmount, bKashTxnId } = req.body;

    let prompt = '';
    if (type === 'payment_reminder') {
      prompt = `Draft a polite SMS/WhatsApp message in Bengali to customer ${customerName} for pending bKash/Nagad payment of order ${orderNumber} (Amount: ৳${totalAmount}) for Aarshi Attire. Include bKash Merchant Number 01700-000000.`;
    } else if (type === 'shipping_update') {
      prompt = `Draft a warm SMS/WhatsApp message in Bengali to customer ${customerName} notifying that their saree "${sareeName}" (Order ${orderNumber}) has been handed over to Pathao/Steadfast Courier. Include tracking details.`;
    } else {
      prompt = `Generate a festive Facebook/Instagram post announcing special Eid discounts on Aarshi Attire Dhakai Jamdani and Katan Sarees.`;
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        text: `প্রিয় ${customerName || 'গ্রাহক'}, আরশি অ্যাটায়ার থেকে আপনার অর্ডারটি (${orderNumber || 'ORD-101'}) নিশ্চিত করতে বিকাশ মার্চেন্ট 01700000000-এ ৳${totalAmount || '0'} পেমেন্ট করে ট্রানজেকশন আইডি লিখে পাঠান। ধন্যবাদ! 🌸`,
      });
    }

    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
    });

    res.json({ text: response.text });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to generate copy' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✨ Aarshi Attire Admin Panel server running on http://localhost:${PORT}`);
  });
}

startServer();
