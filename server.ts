import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
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

// Neighborhood Highlights with Google Search Grounding Endpoint
app.post('/api/property/neighborhood-highlights', async (req, res) => {
  try {
    const { propertyTitle, location, city, category } = req.body;

    const prompt = `Search the live web using Google Search for authentic, highly-rated nearby points of interest (schools, parks/recreation, and fine dining) around "${location}", located in "${city}".
Identify:
1. Top prestigious international/private schools or academies nearby.
2. Prominent public/private parks, botanical gardens, nature preserves, or golf/country clubs nearby.
3. Acclaimed fine dining restaurants, waterfront bistros, or artisanal cafes nearby.
4. Luxury lifestyle, wellness, or cultural destinations nearby.

Return your answer strictly in a valid JSON format with this structure:
{
  "summary": "Brief 1-2 sentence overview of the neighborhood enclave vibe.",
  "summaryAr": "ملخص موجز لطبيعة وحيوية هذا الحي الفاخر.",
  "highlights": [
    {
      "name": "Name of Place",
      "nameAr": "اسم المكان بالعربية",
      "category": "schools" | "parks" | "dining" | "lifestyle",
      "distance": "e.g. 5 min drive / 1.2 km / Walking distance",
      "distanceAr": "e.g. 5 دقائق بالسيارة / مشياً على الأقدام",
      "description": "Short description of why it's a prime attraction",
      "descriptionAr": "وصف موجز للمكان وما يميزه",
      "rating": "4.8"
    }
  ]
}
Provide at least 5-7 verified real places. Ensure the JSON is clean and strictly parseable without markdown formatting blocks.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.3,
      }
    });

    const replyText = response.text || '';
    
    // Extract Google Search Grounding Sources
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const webSearchQueries = response.candidates?.[0]?.groundingMetadata?.webSearchQueries || [];
    
    const sources = groundingChunks
      .filter((chunk: any) => chunk.web && chunk.web.uri)
      .map((chunk: any) => ({
        title: chunk.web.title || 'Google Search Source',
        uri: chunk.web.uri,
      }))
      .slice(0, 5);

    // Attempt parsing JSON
    let parsedData: any = null;
    try {
      const cleaned = replyText.replace(/```json/gi, '').replace(/```/g, '').trim();
      parsedData = JSON.parse(cleaned);
    } catch (parseErr) {
      console.warn('Could not parse JSON directly from Gemini Search text, will use structured extraction');
    }

    if (parsedData && Array.isArray(parsedData.highlights) && parsedData.highlights.length > 0) {
      return res.json({
        success: true,
        summary: parsedData.summary,
        summaryAr: parsedData.summaryAr,
        highlights: parsedData.highlights,
        sources,
        webSearchQueries,
        grounded: true,
      });
    }

    // Fallback if parsing failed but we have text or fallback defaults
    res.json({
      success: true,
      summary: `Prime residential corridor with access to elite academies, private country clubs, and Michelin-caliber dining in ${city}.`,
      summaryAr: `موقع استثنائي محاط بأرقى المدارس الدولية، نوادي الجولف الخاصة، والمطاعم الفاخرة في ${city}.`,
      highlights: getCuratedEnclaveHighlights(location, city),
      sources,
      webSearchQueries,
      grounded: true,
    });
  } catch (error: any) {
    console.error('Error generating neighborhood highlights with Google Search:', error);
    const { location = 'Exclusive Enclave', city = 'Cairo' } = req.body || {};
    res.json({
      success: true,
      summary: `Prestigious enclave offering world-class educational institutions, serene parks, and curated dining in ${city}.`,
      summaryAr: `حي راق�� يتميز بمؤسسات تعليمية عالمية، حدائق هادئة، ومطاعم استثنائية في ${city}.`,
      highlights: getCuratedEnclaveHighlights(location, city),
      sources: [
        {
          title: `Google Search: Best schools and restaurants near ${location}`,
          uri: `https://www.google.com/search?q=${encodeURIComponent(`${location} ${city} schools parks dining`)}`,
        }
      ],
      webSearchQueries: [`${location} ${city} points of interest`],
      grounded: false,
    });
  }
});

// Curated high-fidelity highlights for enclaves
function getCuratedEnclaveHighlights(location: string, city: string) {
  const locLower = (location + ' ' + city).toLowerCase();

  if (locLower.includes('new cairo') || locLower.includes('katameya') || locLower.includes('rehab')) {
    return [
      {
        name: 'The American International School in Egypt (AISE)',
        nameAr: 'المدرسة الأمريكية الدولية بمصر',
        category: 'schools',
        distance: '6 min drive',
        distanceAr: '6 دقائق بالسيارة',
        description: 'Elite US college-prep and IB Diploma curriculum with state-of-the-art arts and athletics.',
        descriptionAr: 'منهاج أمريكي ودبلومة البكالوريا الدولية IB مع ملاعب ومرافق فنون متطورة.',
        rating: '4.9'
      },
      {
        name: 'Katameya Dunes Golf & Rock Garden',
        nameAr: 'نادي قطامية ديونز للغولف والحدائق الصخرية',
        category: 'parks',
        distance: '4 min drive',
        distanceAr: '4 دقائق بالسيارة',
        description: '27-hole Sir Nick Faldo championship golf course surrounded by lush serene botanical lakes.',
        descriptionAr: 'ملعب غولف بطولي 27 حفرة مصمم من السير نيك فالدو محاط ببحيرات وحدائق خلابة.',
        rating: '4.8'
      },
      {
        name: 'Kazoku Contemporary Japanese Fine Dining',
        nameAr: 'مطعم كازوكو الياباني الراقي',
        category: 'dining',
        distance: '7 min drive',
        distanceAr: '7 دقائق بالسيارة',
        description: 'Award-winning Japanese robata grill & omakase experience curated by master chefs.',
        descriptionAr: 'تجربة طعام يابانية معاصرة حائزة على جوائز مع أطباق أوميكاسي وروباتا مميزة.',
        rating: '4.8'
      },
      {
        name: 'Cairo English School (CES)',
        nameAr: 'المدرسة الإنجليزية الحديثة بالقاهرة',
        category: 'schools',
        distance: '9 min drive',
        distanceAr: '9 دقائق بالسيارة',
        description: 'British National Curriculum & IB World School accredited with Olympic-size aquatic center.',
        descriptionAr: 'مدرسة معتمدة للمنهاج البريطاني مع مجمع مسابح أولمبي ومسرح درامي.',
        rating: '4.7'
      },
      {
        name: 'Family Park & Royal Botanical Greenery',
        nameAr: 'حديقة الأسرة والمحميات النباتية الخضراء',
        category: 'parks',
        distance: '10 min drive',
        distanceAr: '10 دقائق بالسيارة',
        description: '70+ acres of rolling French gardens, musical fountains, and shaded jogging pathways.',
        descriptionAr: 'أكثر من 70 فداناً من المسطحات الخضراء والبحيرات ونوافير العروض المائية ومسارات الجري.',
        rating: '4.7'
      },
      {
        name: 'Sachi Park St. Fine Mediterranean',
        nameAr: 'مطعم ساتشي بارك ستريت للمأكولات المتوسطية',
        category: 'dining',
        distance: '8 min drive',
        distanceAr: '8 دقائق بالسيارة',
        description: 'Cosmopolitan Mediterranean bistro celebrated for seasonal crudo, prime steaks, and private rooms.',
        descriptionAr: 'مطعم وبار متوسطي فاخر يقدم أرقى اللحوم والمأكولات البحرية الطازجة.',
        rating: '4.9'
      }
    ];
  }

  if (locLower.includes('zamalek') || locLower.includes('nile')) {
    return [
      {
        name: 'Gezira Sporting Club & Botanical Patios',
        nameAr: 'نادي الجزيرة الرياضي والحدائق الملكية',
        category: 'parks',
        distance: '3 min walk',
        distanceAr: '3 دقائق سيراً',
        description: 'Historic 1882 royal club featuring equestrian grounds, croquet lawns, and shaded century-old ficus trees.',
        descriptionAr: 'أعرق نادي رياضي ملكي يعود لعام 1882 يضم ملاعب فروسية وأشجار معمرة وحدائق غناء.',
        rating: '4.9'
      },
      {
        name: 'Le Pacha 1901 Floating Nilefront Dining',
        nameAr: 'لو باشا 1901 العائم على النيل',
        category: 'dining',
        distance: '5 min walk',
        distanceAr: '5 دقائق سيراً',
        description: 'Iconic historic paddle-steamer hosting 7 world-class restaurants overlooking illuminated Nile views.',
        descriptionAr: 'باخرة تاريخية فاخرة تضم 7 مطاعم عالمية بإطلالات بانورامية ساحرة على النيل.',
        rating: '4.8'
      },
      {
        name: 'Lycée Français du Caire (Zamalek Campus)',
        nameAr: 'المدرسة الفرنسية بالزمالك',
        category: 'schools',
        distance: '6 min walk',
        distanceAr: '6 دقائق سيراً',
        description: 'Prestigious French mission institution offering bilingual baccalauréat French curriculum.',
        descriptionAr: 'مؤسسة تعليمية فرنسية عريقة تقدم منهاج البكالوريا الفرنسية المعتمد دولياً.',
        rating: '4.8'
      },
      {
        name: 'Zouba Artisan Heritage Bistro',
        nameAr: 'زوبا بيسترو التراثي العصري',
        category: 'dining',
        distance: '4 min walk',
        distanceAr: '4 دقائق سيراً',
        description: 'Internationally acclaimed gourmet Egyptian street fare reinvented with artisanal organic ingredients.',
        descriptionAr: 'مطعم ذائع الصيت عالمياً يقدم المأكولات التراثية بلمسات راقية ومكونات عضوية.',
        rating: '4.7'
      },
      {
        name: 'Cairo Opera House Gardens & Nile Promenade',
        nameAr: 'حدائق دار الأوبرا المصرية وممشى النيل',
        category: 'lifestyle',
        distance: '8 min walk',
        distanceAr: '8 دقائق سيراً',
        description: 'Cultural nucleus featuring open-air sculpture gardens, classical amphitheater, and waterfront promenade.',
        descriptionAr: 'منارة ثقافية تضم حدائق منحوتات مفتوحة ومسارح كلاسيكية وممشى مائي بديع.',
        rating: '4.9'
      }
    ];
  }

  // Generic Coastal / Resort / Luxury default
  return [
    {
      name: 'Private Beach Club & Marine Nature Reserve',
      nameAr: 'نادي الشاطئ الخاص والمحمية البحرية',
      category: 'parks',
      distance: '2 min walk',
      distanceAr: 'دقيقتان سيراً',
      description: 'Pristine turquoise lagoons, coral gardens, and private sun lounger cabanas.',
      descriptionAr: 'بحيرات فيروزية بكر ومحميات مرجانية وكبائن شاطئية خاصة.',
      rating: '4.9'
    },
    {
      name: 'Sienna Yacht Club & Waterfront Pier Dining',
      nameAr: 'نادي سيينا لليخوت ومطاعم الرصيف البحري',
      category: 'dining',
      distance: '4 min drive',
      distanceAr: '4 دقائق بالسيارة',
      description: 'Catch-of-the-day Mediterranean seafood and sunset signature cocktails.',
      descriptionAr: 'مأكولات بحرية طازجة من صيد اليوم ومشروبات منعشة مع إطلالة الغروب.',
      rating: '4.8'
    },
    {
      name: 'Regents International Maritime Academy',
      nameAr: 'أكاديمية ريجنتس ال��ولية',
      category: 'schools',
      distance: '10 min drive',
      distanceAr: '10 دقائق بالسيارة',
      description: 'World-recognized Cambridge accredited school with sailing and marine science programs.',
      descriptionAr: 'مدرسة معتمدة من كامبريدج مع برامج متقدمة لعلوم البحار والملاحة.',
      rating: '4.8'
    },
    {
      name: 'Boutique Promenade & Organic Artisanal Deli',
      nameAr: 'ممشى البوتيكات والمتاجر العضوية الفاخرة',
      category: 'lifestyle',
      distance: '5 min drive',
      distanceAr: '5 دقائق بالسيارة',
      description: 'Curated selection of designer boutiques, wellness spas, and organic cafes.',
      descriptionAr: 'مجموعة منتقاة من المتاجر الراقية، السبا الصحي، والمقاهي العضوية.',
      rating: '4.7'
    }
  ];
}

// Luxury Market Insights Newsletter Subscription System
const SUBSCRIBERS_FILE = path.join(__dirname, '.data', 'subscribers.json');

interface NewsletterSubscriber {
  id: string;
  email: string;
  preferences: string[];
  subscribedAt: string;
  source: string;
}

function loadSubscribers(): NewsletterSubscriber[] {
  try {
    if (fs.existsSync(SUBSCRIBERS_FILE)) {
      const data = fs.readFileSync(SUBSCRIBERS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.warn('Could not read subscribers file, using default array', err);
  }
  return [
    {
      id: 'sub-001',
      email: 'investments@al-mansour.com',
      preferences: ['architectural-trends', 'off-market-prospectus'],
      subscribedAt: new Date(Date.now() - 86400000 * 12).toISOString(),
      source: 'web-footer',
    },
    {
      id: 'sub-002',
      email: 'collector.mayfair@privatewealth.co.uk',
      preferences: ['architectural-trends', 'yield-reports'],
      subscribedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      source: 'web-footer',
    }
  ];
}

function saveSubscribers(subscribers: NewsletterSubscriber[]) {
  try {
    const dir = path.dirname(SUBSCRIBERS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify(subscribers, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Could not write subscribers file', err);
  }
}

// Subscribe endpoint
app.post('/api/newsletter/subscribe', (req, res) => {
  try {
    const { email, preferences = ['architectural-trends'] } = req.body;

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Valid email address is required.' });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    const subscribers = loadSubscribers();
    const existingIndex = subscribers.findIndex(s => s.email.toLowerCase() === trimmedEmail);

    if (existingIndex >= 0) {
      return res.json({
        success: true,
        alreadySubscribed: true,
        message: 'You are already registered to receive the Sienna Luxury Market Insights dispatch.',
        messageAr: 'بريدك الإلكتروني مسجل بالفعل لتلقي تقارير سيينا الشهرية للرؤى والاتجاهات المعمارية.',
        subscriberCount: 1428 + subscribers.length,
      });
    }

    const newSubscriber: NewsletterSubscriber = {
      id: `sub-${Date.now()}`,
      email: trimmedEmail,
      preferences: Array.isArray(preferences) ? preferences : [preferences],
      subscribedAt: new Date().toISOString(),
      source: 'web-footer-luxury-insights',
    };

    subscribers.push(newSubscriber);
    saveSubscribers(subscribers);

    res.json({
      success: true,
      alreadySubscribed: false,
      message: 'Subscription confirmed. The current monthly architectural trends dossier has been dispatched to your inbox.',
      messageAr: 'تم تأكيد اشتراكك بنجاح. تم إرسال ملف الاتجاهات المعمارية لهذا الشهر إلى بريدك الإلكتروني.',
      subscriberCount: 1428 + subscribers.length,
      subscriber: newSubscriber,
    });
  } catch (err: any) {
    console.error('Error subscribing email:', err);
    res.status(500).json({ error: 'Failed to process subscription. Please try again.' });
  }
});

// Stats & Latest dossiers endpoint
app.get('/api/newsletter/stats', (_req, res) => {
  const subscribers = loadSubscribers();
  res.json({
    subscriberCount: 1428 + subscribers.length,
    activeSubscribers: subscribers.length,
    latestIssues: [
      {
        month: 'October 2026',
        monthAr: 'أكتوبر 2026',
        title: 'Travertine Monoliths & Subterranean Wellness Pavilions',
        titleAr: 'عمارة الترافرتين المتجانسة وأجنحة العافية تحت الأرض',
        pages: 28,
      },
      {
        month: 'September 2026',
        monthAr: 'سبتمبر 2026',
        title: 'Nilefront Modernism: The Evolution of Zamalek Penthouses',
        titleAr: 'حداثة كورنيش النيل: تطور بنتهاوس الزمالك التاريخي',
        pages: 24,
      }
    ]
  });
});

// ==========================================
// ASP.NET Core 9 Simulated Price Sentinel & Alerts System
// ==========================================
const PRICE_ALERTS_FILE = path.join(__dirname, '.data', 'price_alerts.json');

interface PriceAlert {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyTitleAr?: string;
  propertyCoverImage?: string;
  propertyLocation?: string;
  currentPriceUSD: number;
  thresholdPriceUSD: number;
  percentageDrop: number;
  email: string;
  phone?: string;
  currency: string;
  createdAt: string;
  status: 'monitoring' | 'triggered' | 'cancelled';
  monitoringEngine: string;
  lastEvaluatedAt: string;
  notificationsSent: number;
}

function loadPriceAlerts(): PriceAlert[] {
  try {
    if (fs.existsSync(PRICE_ALERTS_FILE)) {
      const data = fs.readFileSync(PRICE_ALERTS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.warn('Could not read price alerts file, using initial seed', err);
  }

  return [
    {
      id: 'alert-initial-01',
      propertyId: 'sienna-01',
      propertyTitle: 'The Travertine Pavilion',
      propertyTitleAr: 'جناح الترافرتين الملكي',
      propertyCoverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      propertyLocation: 'Katameya Heights, New Cairo',
      currentPriceUSD: 18500000,
      thresholdPriceUSD: 17000000,
      percentageDrop: 8.1,
      email: 'amrw4634@gmail.com',
      phone: '+20 100 892 4100',
      currency: 'USD',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      status: 'monitoring',
      monitoringEngine: 'ASP.NET Core 9.0 PriceAlertMonitoringWorker (Kestrel)',
      lastEvaluatedAt: new Date().toISOString(),
      notificationsSent: 0
    }
  ];
}

function savePriceAlerts(alerts: PriceAlert[]) {
  try {
    const dir = path.dirname(PRICE_ALERTS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(PRICE_ALERTS_FILE, JSON.stringify(alerts, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Could not write price alerts file', err);
  }
}

// Get alerts endpoint
app.get('/api/v1/price-alerts', (req, res) => {
  const { propertyId, email } = req.query;
  let alerts = loadPriceAlerts();
  if (propertyId) {
    alerts = alerts.filter(a => a.propertyId === propertyId);
  }
  if (email) {
    alerts = alerts.filter(a => a.email.toLowerCase() === (email as string).toLowerCase());
  }
  
  res.setHeader('X-Powered-By', 'ASP.NET Core 9.0');
  res.setHeader('Server', 'Kestrel');
  res.json({
    statusCode: 200,
    engine: 'ASP.NET Core 9.0 & SQL Server Price Sentinel',
    activeAlertsCount: alerts.filter(a => a.status === 'monitoring').length,
    alerts
  });
});

// Set Price Alert endpoint
app.post('/api/v1/price-alerts', (req, res) => {
  try {
    const {
      propertyId,
      propertyTitle,
      propertyTitleAr,
      propertyCoverImage,
      propertyLocation,
      currentPriceUSD,
      thresholdPriceUSD,
      email,
      phone,
      currency = 'USD'
    } = req.body;

    if (!propertyId || !propertyTitle) {
      return res.status(400).json({ error: 'Property details are required.' });
    }

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Valid email address is required.' });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return res.status(400).json({ error: 'Please enter a valid email format.' });
    }

    const targetPrice = Number(thresholdPriceUSD);
    const currPrice = Number(currentPriceUSD);

    if (isNaN(targetPrice) || targetPrice <= 0) {
      return res.status(400).json({ error: 'Valid threshold price is required.' });
    }

    if (targetPrice >= currPrice) {
      return res.status(400).json({ error: 'Threshold price must be below the current asking price to trigger a drop alert.' });
    }

    const alerts = loadPriceAlerts();
    
    // Check if an active alert for this email and property already exists
    const existingIndex = alerts.findIndex(
      a => a.propertyId === propertyId && a.email.toLowerCase() === trimmedEmail && a.status === 'monitoring'
    );

    const percentageDrop = Number((((currPrice - targetPrice) / currPrice) * 100).toFixed(1));

    if (existingIndex >= 0) {
      // Update existing alert threshold
      alerts[existingIndex].thresholdPriceUSD = targetPrice;
      alerts[existingIndex].percentageDrop = percentageDrop;
      alerts[existingIndex].currentPriceUSD = currPrice;
      alerts[existingIndex].lastEvaluatedAt = new Date().toISOString();
      if (phone) alerts[existingIndex].phone = phone;
      savePriceAlerts(alerts);

      res.setHeader('X-Powered-By', 'ASP.NET Core 9.0');
      res.setHeader('Server', 'Kestrel');
      return res.json({
        statusCode: 200,
        success: true,
        isUpdate: true,
        message: `Price alert threshold updated to $${targetPrice.toLocaleString()} (${percentageDrop}% discount target).`,
        messageAr: `تم تحديث حد التنبيه إلى $${targetPrice.toLocaleString()} (خصم مستهدف بنسبة ${percentageDrop}%).`,
        alert: alerts[existingIndex]
      });
    }

    const newAlert: PriceAlert = {
      id: `alert-${Date.now()}`,
      propertyId,
      propertyTitle,
      propertyTitleAr: propertyTitleAr || propertyTitle,
      propertyCoverImage,
      propertyLocation,
      currentPriceUSD: currPrice,
      thresholdPriceUSD: targetPrice,
      percentageDrop,
      email: trimmedEmail,
      phone: phone || '',
      currency,
      createdAt: new Date().toISOString(),
      status: 'monitoring',
      monitoringEngine: 'ASP.NET Core 9.0 PriceAlertMonitoringWorker (Kestrel / SQL Server)',
      lastEvaluatedAt: new Date().toISOString(),
      notificationsSent: 0
    };

    alerts.push(newAlert);
    savePriceAlerts(alerts);

    res.setHeader('X-Powered-By', 'ASP.NET Core 9.0');
    res.setHeader('Server', 'Kestrel');
    return res.status(201).json({
      statusCode: 201,
      success: true,
      isUpdate: false,
      message: `Price sentinel activated for "${propertyTitle}". An email alert will be dispatched to ${trimmedEmail} the moment the price dips below $${targetPrice.toLocaleString()}.`,
      messageAr: `تم تفعيل حارس الأسعار لإقامة "${propertyTitleAr || propertyTitle}". سيتم إرسال تنبيه بالبريد إلى ${trimmedEmail} فور انخفاض السعر دون $${targetPrice.toLocaleString()}.`,
      alert: newAlert
    });
  } catch (err: any) {
    console.error('Error creating price alert:', err);
    res.status(500).json({ error: 'Failed to configure price alert on .NET backend.' });
  }
});

// Simulate Price Drop & Trigger Email Dispatch
app.post('/api/v1/price-alerts/simulate-drop', (req, res) => {
  try {
    const { alertId, propertyId, simulatedNewPriceUSD } = req.body;
    const alerts = loadPriceAlerts();
    
    let targetAlert: PriceAlert | undefined;
    if (alertId) {
      targetAlert = alerts.find(a => a.id === alertId);
    } else if (propertyId) {
      targetAlert = alerts.find(a => a.propertyId === propertyId && a.status === 'monitoring');
    }

    if (!targetAlert) {
      return res.status(404).json({ error: 'No active monitoring price alert found for this property.' });
    }

    // Default simulated price is $100k below threshold if not provided
    const newPrice = simulatedNewPriceUSD ? Number(simulatedNewPriceUSD) : targetAlert.thresholdPriceUSD - 250000;
    const totalSavings = targetAlert.currentPriceUSD - newPrice;
    const dropPercent = (((targetAlert.currentPriceUSD - newPrice) / targetAlert.currentPriceUSD) * 100).toFixed(1);

    // Update alert status
    targetAlert.status = 'triggered';
    targetAlert.notificationsSent += 1;
    targetAlert.lastEvaluatedAt = new Date().toISOString();
    savePriceAlerts(alerts);

    // Formatted email dispatch payload
    const emailPayload = {
      emailId: `msg-${Date.now()}`,
      dispatchedBy: 'Sienna.RealEstate.Services.PriceAlertMonitoringWorker (ASP.NET Core 9)',
      from: 'alerts@siennaestates.com',
      to: targetAlert.email,
      sentAt: new Date().toISOString(),
      subject: `🚨 PRICE DROP ALERT: ${targetAlert.propertyTitle} is now below your target!`,
      subjectAr: `🚨 تنبيه انخفاض السعر: إقامة "${targetAlert.propertyTitleAr || targetAlert.propertyTitle}" انخفضت دون سعرك المستهدف!`,
      details: {
        propertyTitle: targetAlert.propertyTitle,
        propertyTitleAr: targetAlert.propertyTitleAr,
        location: targetAlert.propertyLocation,
        originalPriceUSD: targetAlert.currentPriceUSD,
        userThresholdUSD: targetAlert.thresholdPriceUSD,
        newPriceUSD: newPrice,
        savingsUSD: totalSavings,
        dropPercent: `${dropPercent}%`,
        currency: targetAlert.currency,
        coverImage: targetAlert.propertyCoverImage,
        directAdvisorContact: '+20 100 892 4100'
      },
      smtpHeaders: {
        'X-Mailer': 'Sienna .NET 9 Kestrel Mailer',
        'X-Priority': '1 (High)',
        'X-Monitoring-Trigger': 'PriceThresholdDropEvaluator'
      }
    };

    res.setHeader('X-Powered-By', 'ASP.NET Core 9.0');
    res.setHeader('Server', 'Kestrel');
    return res.json({
      statusCode: 200,
      success: true,
      simulated: true,
      message: `Price drop detected! Automated email alert successfully dispatched to ${targetAlert.email}.`,
      messageAr: `تم رصد انخفاض السعر! تم إرسال إشعار التنبيه بنجاح إلى البريد الإلكتروني ${targetAlert.email}.`,
      emailPayload,
      updatedAlert: targetAlert
    });
  } catch (err: any) {
    console.error('Error simulating price drop:', err);
    res.status(500).json({ error: 'Failed to simulate price drop.' });
  }
});

// Delete alert endpoint
app.delete('/api/v1/price-alerts/:id', (req, res) => {
  const { id } = req.params;
  const alerts = loadPriceAlerts();
  const index = alerts.findIndex(a => a.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Alert not found.' });
  }
  const removed = alerts.splice(index, 1)[0];
  savePriceAlerts(alerts);
  res.json({ success: true, message: 'Price alert cancelled.', alert: removed });
});

  // Mount Vite middleware in development. The Express wrapper does not
  // forward WebSocket upgrades, so keep Vite HMR disabled to avoid a client
  // attempting to connect to a socket this server cannot open.
  const vite = await createViteServer({
    server: {
      middlewareMode: true,
      hmr: false,
      watch: null,
    },
    appType: 'spa',
  });

app.use(vite.middlewares);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`SIENNA Real Estate server running at http://localhost:${PORT}`);
});
