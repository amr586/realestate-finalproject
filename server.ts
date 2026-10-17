import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Server-side Gemini Client with aistudio-build telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// AI Real Estate Assistant Chat Endpoint
app.post('/api/assistant/chat', async (req, res) => {
  try {
    const { messages, catalogSummary, activeCurrency } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required.' });
    }

    const systemInstruction = `You are "Sienna Advisor", an ultra-elite private architectural real estate consultant and wealth advisor for SIENNA Real Estate Group.
You represent world-class architectural residences (minimalist travertine villas, sky penthouses in Zamalek, waterfront estates in Ras El Hekma / North Coast, desert compounds in El Gouna, and historic Beverly Hills / Dubai mansions).

Current Property Catalog Data Grounding:
${catalogSummary || 'Use provided portfolio knowledge.'}

Active Currency: ${activeCurrency || 'USD'}

Guidelines:
- Provide sophisticated, discreet, and highly accurate guidance about properties in the catalog, architectural materials (travertine, cedar, acoustic glass), financing and mortgage scenarios, and prime neighborhoods (New Cairo Katameya Heights, Zamalek Nilefront, Ras El Hekma Mediterranean, El Gouna).
- If the user asks about mortgage or financing, provide calculated down payment estimates and monthly carry breakdown figures.
- Answer fluidly in the language the user asks in (Arabic or English). If asked in Arabic, speak refined, polite, professional Arabic (فصحى راقية أو لهجة بيضاء مهذبة).
- If appropriate, suggest scheduling a private viewing tour or reviewing the 3D spatial model.
- Keep responses concise, structured, and luxurious. Format text with clean bullet points or short paragraphs.`;

    // Map messages to Gemini format
    const contents = messages.map((m: { role: 'user' | 'assistant'; text: string }) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.text }]
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    const replyText = response.text || "I am at your service to discuss any residence in the Sienna collection.";
    res.json({ reply: replyText });
  } catch (error: any) {
    console.error('Gemini API error:', error);
    res.status(500).json({ 
      error: error?.message || 'Failed to generate response from Gemini API',
      fallback: 'Our private office advisors are currently reviewing your inquiry. Please explore our curated portfolio or schedule a private tour.'
    });
  }
});

// Mount Vite middleware in development
const vite = await createViteServer({
  server: { 
    middlewareMode: true,
    hmr: process.env.DISABLE_HMR !== 'true',
    watch: process.env.DISABLE_HMR === 'true' ? null : {}
  },
  appType: 'spa',
});

app.use(vite.middlewares);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`SIENNA Real Estate server running at http://localhost:${PORT}`);
});
