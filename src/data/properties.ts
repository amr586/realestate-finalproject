import { Property, PropertyAgent } from '../types';

export const AGENTS: PropertyAgent[] = [
  {
    id: 'agent-1',
    name: 'Karim El-Sayed',
    nameAr: 'كريم السيد',
    role: 'Partner & Senior Architectural Advisor',
    roleAr: 'شريك ومستشار معماري أول',
    phone: '+20 100 892 4100',
    email: 'k.elsayed@sienna-residences.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    languages: ['Arabic', 'English', 'French']
  },
  {
    id: 'agent-2',
    name: 'Elena Rostova',
    nameAr: 'إيلينا روستوفا',
    role: 'Director of International Estates',
    roleAr: 'مديرة العقارات الدولية',
    phone: '+971 4 820 9310',
    email: 'e.rostova@sienna-residences.com',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    languages: ['English', 'German', 'Russian']
  },
  {
    id: 'agent-3',
    name: 'Tarek Mansour',
    nameAr: 'طارق منصور',
    role: 'Private Office Client Director',
    roleAr: 'مدير مكتب العملاء الخاص',
    phone: '+20 122 341 5560',
    email: 't.mansour@sienna-residences.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    languages: ['Arabic', 'English']
  }
];

export const PROPERTIES: Property[] = [
  {
    id: 'sienna-01',
    title: 'The Travertine Sanctuary',
    titleAr: 'ملاذ الترافرتين المعماري',
    tagline: 'Sculptural monolithic residence framed by reflection pools and ancient olive groves.',
    taglineAr: 'إقامة معمارية منحوتة تحيط بها مسطحات مائية عاكسة وأشجار زيتون معمرة.',
    category: 'villas',
    listingType: 'buy',
    priceUSD: 4850000,
    location: 'Katameya Heights, New Cairo',
    locationAr: 'قطامية هايتس، القاهرة الجديدة',
    city: 'Cairo',
    cityAr: 'القاهرة',
    address: '14 Al-Rabwa Crescent, Katameya Heights',
    beds: 5,
    baths: 6.5,
    sqft: 8400,
    lotSqft: 22000,
    yearBuilt: 2024,
    garageSpaces: 4,
    architect: 'Vincent Van Duysen Atelier',
    architectAr: 'أستوديو فنسنت فان دويسن',
    featured: true,
    coverImage: '/src/assets/images/hero_sienna_luxury_villa_1792256412232.jpg',
    galleryImages: [
      '/src/assets/images/hero_sienna_luxury_villa_1792256412232.jpg',
      '/src/assets/images/villa_minimalist_travertine_1792256411913.jpg',
      '/src/assets/images/coastal_architectural_residence_1792256412673.jpg'
    ],
    description: 'A monument to serene minimalism, The Travertine Sanctuary balances tactile Roman stone with floor-to-ceiling panoramic glass. Features a 25-meter heated cantilevered infinity pool, private wellness spa with cedar sauna, custom poliform kitchen, and a subterranean climate-controlled cellar for 1,200 bottles.',
    descriptionAr: 'تحفة معمارية تجسد البساطة الهادئة، حيث تتناغم أحجار الترافرتين الرومانية مع الواجهات الزجاجية الممتدة من الأرض إلى السقف. يضم الملاذ مسبحاً إنفينيتي معلقاً بطول 25 متراً، وسبا عافية خاص مع ساونا من خشب الأرز، ومطبخاً إيطالياً فاخراً، وسرداباً مخصصاً للمقتنيات النادرة.',
    amenities: [
      'Cantilevered Infinity Pool',
      'Subterranean Wine Cellar',
      'Private Cedar Spa & Hammam',
      'Automated Lutron Lighting',
      'Sub-Zero & Wolf Kitchen',
      'Staff Quarters with Private Entry',
      'Solar Microgrid Integration'
    ],
    amenitiesAr: [
      'مسبح إنفينيتي معلق',
      'سرداب مقتنيات خاص مكيف',
      'سبا خاص وحمام تركي بخشب الأرز',
      'نظام إضاءة ذكي لترون',
      'مطابخ ساب-زيرو الإيطالية',
      'جناح خاص مستقل للضيافة والخدمة',
      'منظومة طاقة شمسية ذكية متكاملة'
    ],
    coordinates: {
      lat: 30.0152,
      lng: 31.4285
    },
    agent: AGENTS[0],
    architecturalNotes: 'Constructed from sustainably quarried Navona travertine blocks, with shadow gap floor joints and acoustic plaster ceilings.',
    architecturalNotesAr: 'مبني من كتل ترافرتين نافونا المستوردة مع فواصل ظل أرضية وأسقف جبسية عازلة للصوت.'
  },
  {
    id: 'sienna-02',
    title: 'The Solstice Sky Penthouse',
    titleAr: 'بنتهاوس سولستيس سكاي',
    tagline: 'Dual-level aerial estate with 360-degree skyline views and botanical sky terrace.',
    taglineAr: 'بنتهاوس مزدوج الارتفاع بإطلالة بانورامية كاملة 360 درجة وتراس سماوي نباتي.',
    category: 'penthouses',
    listingType: 'buy',
    priceUSD: 6200000,
    location: 'Zamalek Diplomatic Quarter, Nilefront',
    locationAr: 'حي الزمالك الدبلوماسي، كورنيش النيل',
    city: 'Cairo',
    cityAr: 'القاهرة',
    address: '88 Gezira Island Promenade',
    beds: 4,
    baths: 4.5,
    sqft: 6100,
    lotSqft: 6100,
    yearBuilt: 2025,
    garageSpaces: 3,
    architect: 'Foster & Partners Interior Design',
    architectAr: 'فوستر آند بارتنرز',
    featured: true,
    coverImage: '/src/assets/images/penthouse_skyline_terrace_1792256412594.jpg',
    galleryImages: [
      '/src/assets/images/penthouse_skyline_terrace_1792256412594.jpg',
      '/src/assets/images/hero_sienna_luxury_villa_1792256412232.jpg'
    ],
    description: 'Crown of Zamalek Island, the Solstice Penthouse encompasses the top two floors of the iconic Horizon Tower. Designed for elite entertaining with double-height 7-meter ceilings, open-flame ethanol hearth, private biometric elevator, and a 180-sqm landscaped terrace with outdoor cocktail bar and glass-sided plunge spa.',
    descriptionAr: 'درة جزيرة الزمالك، يشغل بنتهاوس سولستيس الطابقين العلويين من برج هورايزون الشهير. صُمم لاستضافة كبار الضيوف بأسقف مزدوجة بارتفاع 7 أمتار، وموقد نار إيثانول دافئ، ومصعد بيومتري خاص، وتراس بانورامي بمساحة 180 متراً مربعاً مع مسبح سبا زجاجي وبار كوكتيل.',
    amenities: [
      'Private Direct Biometric Elevator',
      'Panoramic 360° River & Skyline View',
      'Glass-Edged Rooftop Plunge Pool',
      'Acoustically Isolated Cinema Room',
      'Bespoke Italian Marble Island',
      '24/7 White-Glove Concierge'
    ],
    amenitiesAr: [
      'مصعد بيومتري مباشر للوحدة',
      'إطلالة بانورامية 360° على النيل والأفق',
      'مسبح سبا علوي بحواف زجاجية',
      'صالة سينما معزولة صوتياً بالكامل',
      'جزيرة مطبخ من رخام كارارا الإيطالي',
      'خدمة كونسيرج راقية على مدار الساعة'
    ],
    coordinates: {
      lat: 30.0614,
      lng: 31.2185
    },
    agent: AGENTS[1],
    architecturalNotes: 'Engineered with triple-glazed acoustic curtain walls providing complete silence above the city, accented with wire-brushed fumed oak panelling.',
    architecturalNotesAr: 'واجهات زجاجية ثلاثية الطبقات عازلة تماماً للصوت، مطعمة بألواح خشب البلوط المدخن الطبيعي.'
  },
  {
    id: 'sienna-03',
    title: 'Azure Horizon Waterfront Residence',
    titleAr: 'قصر الأفق اللازوردي الساحلي',
    tagline: 'Terraced Mediterranean villa cascading directly to a private white sand cove.',
    taglineAr: 'فيلا متوسطية متدرجة تنحدر مباشرة نحو شاطئ رملي أبيض خاص وخليج بحري.',
    category: 'coastal',
    listingType: 'buy',
    priceUSD: 7900000,
    priceRentPerMonthUSD: 38000,
    location: 'Ras El Hekma, Mediterranean Coast',
    locationAr: 'رأس الحكمة، الساحل الشمالي',
    city: 'North Coast',
    cityAr: 'الساحل الشمالي',
    address: 'Parcel 09, Coral Ridge Estates, Ras El Hekma',
    beds: 6,
    baths: 7,
    sqft: 9800,
    lotSqft: 34000,
    yearBuilt: 2024,
    garageSpaces: 4,
    architect: 'Kengo Kuma & Associates',
    architectAr: 'كينغو كوما ومشاركوه',
    featured: true,
    coverImage: '/src/assets/images/coastal_architectural_residence_1792256412673.jpg',
    galleryImages: [
      '/src/assets/images/coastal_architectural_residence_1792256412673.jpg',
      '/src/assets/images/hero_sienna_luxury_villa_1792256412232.jpg',
      '/src/assets/images/villa_minimalist_travertine_1792256411913.jpg'
    ],
    description: 'Carved seamlessly into coastal limestone ridges, Azure Horizon offers unprecedented beachfront seclusion. Multiple cascading limestone terraces culminate in a sunken circular amphitheater with an open fire pit overlooking the turquoise sea. Includes private yacht mooring rights and an autonomous fresh-water desalination facility.',
    descriptionAr: 'محفورة ببراعة في المنحدرات الجيرية للساحل، تمنحك إقامة الأفق اللازوردي خصوصية لا تضاهى على البحر مباشرة. تتدرج التراسات البيضاء لتلتقي في مجلس دائري غاطس حول موقد نار مكشوف يطل على المياه الفيروزية. تشمل مرسى يخوت خاص ومحطة تحلية مياه مستقلة.',
    amenities: [
      'Direct Private Beachfront Access',
      'Sunken Limestone Fire Pit Amphitheater',
      'Dual Saltwater & Freshwater Infinity Pools',
      'Private Yacht Mooring Jetty',
      'Guest Pavilion with 2 En-Suite Suites',
      'Atmospheric Outdoor Dining Pergola'
    ],
    amenitiesAr: [
      'مدخل مباشر إلى الشاطئ الرملي الخاص',
      'مجلس دائري غاطس من الحجر الجيري مع موقد نار',
      'مسبحان إنفينيتي (مياه عذبة ومياه بحرية)',
      'رصيف مرسى يخوت خاص',
      'جناح ضيافة مستقل بغرفتين ماستر',
      'برجولا طعام خارجية بإطلالة بحرية'
    ],
    coordinates: {
      lat: 31.1420,
      lng: 27.8540
    },
    agent: AGENTS[2],
    architecturalNotes: 'Integrates natural sea breeze thermal siphon cooling with local limestone masonry and weathered teak decking.',
    architecturalNotesAr: 'تعتمد على تبريد حراري طبيعي لنسيم البحر مع أحجار جيرية محلية وأرضيات تيك معالجة.'
  },
  {
    id: 'sienna-04',
    title: 'The Brise-Soleil Desert Pavilion',
    titleAr: 'فيلا بريز-سولاي الصحراوية',
    tagline: 'Modernist rammed-earth compound with kinetic solar louvers and desert botanical courts.',
    taglineAr: 'مجمع عصري من التربة المدكوكة وكواسر شمس ديناميكية مع حدائق صحراوية.',
    category: 'villas',
    listingType: 'buy',
    priceUSD: 3950000,
    priceRentPerMonthUSD: 24000,
    location: 'El Gouna Golf Estates, Red Sea',
    locationAr: 'إل جونة، جولف إستيتس، البحر الأحمر',
    city: 'El Gouna',
    cityAr: 'الجونة',
    address: 'Estate 42, Lagoon North, El Gouna',
    beds: 4,
    baths: 4.5,
    sqft: 5800,
    lotSqft: 18500,
    yearBuilt: 2023,
    garageSpaces: 2,
    architect: 'Rick Joy Design Office',
    architectAr: 'ريك جوي للتصميم المعماري',
    featured: false,
    coverImage: '/src/assets/images/villa_minimalist_travertine_1792256411913.jpg',
    galleryImages: [
      '/src/assets/images/villa_minimalist_travertine_1792256411913.jpg',
      '/src/assets/images/hero_sienna_luxury_villa_1792256412232.jpg'
    ],
    description: 'Designed in deep dialogue with the desert climate, this residence utilizes stabilized rammed earth and motorized timber brise-soleil panels that modulate shade throughout the day. Surrounds a central courtyard pool with mature euphorbia and desert palms, seamlessly merging indoor and open-air pavilion living.',
    descriptionAr: 'صُممت لتتفاعل بحميمية مع المناخ الصحراوي، مستخدمة التربة المدكوكة وكواسر شمسية خشبية أوتوماتيكية تتناغم مع حركة الشمس. تتوسطها بركة سباحة داخل فناء محاط بأشجار النخيل والنباتات الصحراوية النادرة، لتتلاشى الحدود بين الداخل والخارج.',
    amenities: [
      'Lagoon & Golf Course Frontage',
      'Kinetic Motorized Shade Louvers',
      'Geothermal In-Slab Climate System',
      'Open-Air Stargazing Lounge',
      'Infinity Lap Pool with Dark Basalt Tile',
      'EV Charging Station & Solar Battery Reserve'
    ],
    amenitiesAr: [
      'إطلالة مزدوجة على اللاجون وملاعب الجولف',
      'كواسر شمس خشبية متحركة ذكياً',
      'نظام تبريد وتدفئة جيوتقني في الأرضيات',
      'مجلس علوي لمراقبة النجوم ليلاً',
      'مسبح أولمبي مكسو بأحجار البازلت الأسود',
      'شواحن سيارات كهربائية وبطاريات تخزين طاقة'
    ],
    coordinates: {
      lat: 27.4042,
      lng: 33.6708
    },
    agent: AGENTS[0],
    architecturalNotes: '400mm thick rammed-earth thermal mass walls maintain steady 22°C interior temperature year-round without mechanical chillers.',
    architecturalNotesAr: 'جدران سميكة من الطين المدكوك بسماكة 400 مم تحافظ على درجة حرارة داخلية معتدلة 22 مئوية على مدار العام.'
  },
  {
    id: 'sienna-05',
    title: 'The Grand Beverly Horizon Manor',
    titleAr: 'قصر بيفرلي هورايزون الملكي',
    tagline: 'Neoclassical modernist estate on private 2-acre hillside promontory.',
    taglineAr: 'قصر كلاسيكي معاصر على هضبة خاصة بمساحة فدانين وإطلالات تمتد للأفق.',
    category: 'mansions',
    listingType: 'buy',
    priceUSD: 14200000,
    location: 'Beverly Hills / Palm Jumeirah Signature',
    locationAr: 'نخلة جميرا / بيفرلي هيلز',
    city: 'Dubai / Los Angeles',
    cityAr: 'دبي / بيفرلي هيلز',
    address: 'Crown Ridge Promontory, Frond N',
    beds: 7,
    baths: 9,
    sqft: 15400,
    lotSqft: 88000,
    yearBuilt: 2024,
    garageSpaces: 8,
    architect: 'SAOTA Architecture & Design',
    architectAr: 'ساوتا للعمارة والتصميم',
    featured: true,
    coverImage: '/src/assets/images/hero_sienna_luxury_villa_1792256412232.jpg',
    galleryImages: [
      '/src/assets/images/hero_sienna_luxury_villa_1792256412232.jpg',
      '/src/assets/images/penthouse_skyline_terrace_1792256412594.jpg',
      '/src/assets/images/coastal_architectural_residence_1792256412673.jpg'
    ],
    description: 'An architectural tour-de-force engineered for world leaders and tastemakers. Features a dramatic 30-foot entry rotunda with bespoke bronze chandelier, 12-seat Dolby Atmos screening room, subterranean car gallery with turntable, championship tennis court, and full security bunker with sovereign-grade comms.',
    descriptionAr: 'صرح معماري استثنائي صُمم لأصحاب الذوق الرفيع. يتميز ببهو دخول بارتفاع 30 قدماً مع ثريا برونزية يدوية، وصالة عرض سينمائي دولبي أتموس تتسع لـ 12 مقعداً، ومعرض سيارات أرضي دوار، وملعب تنس قياسي، وجناح أمني متقدم.',
    amenities: [
      'Subterranean 8-Car Collector Gallery',
      'Championship Lighted Tennis Court',
      'Dolby Atmos Screening Theater',
      'Dual-Wing Master Presidential Suites',
      'Full Commercial Prep Kitchen & Chef Quarters',
      'Helipad Clearance Certificate'
    ],
    amenitiesAr: [
      'معرض سيارات كلاسيكية أرضي يتسع لـ 8 سيارات',
      'ملعب تنس مجهز بإضاءة احترافية',
      'صالة سينما دولبي أتموس خاصة',
      'جناحان رئاسيان رئيسيان منفصلان',
      'مطبخ تحضيري فندقي متكامل مع سكن للطهاة',
      'مهبط طائرات هليكوبتر مرخص'
    ],
    coordinates: {
      lat: 25.1124,
      lng: 55.1389
    },
    agent: AGENTS[1],
    architecturalNotes: 'Structural steel cantilever spanning 18 meters without visible columns, engineered for earthquake resilience zone 4.',
    architecturalNotesAr: 'هيكل حديدي معلق يمتد 18 متراً دون أعمدة مرئية، مصمم لمقاومة الزلازل بأعلى المعايير.'
  },
  {
    id: 'sienna-06',
    title: 'The Glass Pavilion at Cedar Hill',
    titleAr: 'فيلا القبة الزجاجية في ربوة الأرز',
    tagline: 'Floating glass and charred cedar retreat embedded into tranquil hillside topography.',
    taglineAr: 'إقامة عائمة من الزجاج وخشب الأرز المحروق مندمجة مع تضاريس الربوة الطبيعية.',
    category: 'villas',
    listingType: 'rent',
    priceUSD: 3200000,
    priceRentPerMonthUSD: 18500,
    location: 'Allegria, Sheikh Zayed City',
    locationAr: 'الجريا، مدينة الشيخ زايد',
    city: 'Giza / Cairo',
    cityAr: 'الجيزة / القاهرة',
    address: '6 Meadow Grove, Allegria Signature Estates',
    beds: 4,
    baths: 5,
    sqft: 6500,
    lotSqft: 20000,
    yearBuilt: 2024,
    garageSpaces: 3,
    architect: 'Olson Kundig Architects',
    architectAr: 'أولسون كوندينج أركيتكتس',
    featured: false,
    coverImage: '/src/assets/images/villa_minimalist_travertine_1792256411913.jpg',
    galleryImages: [
      '/src/assets/images/villa_minimalist_travertine_1792256411913.jpg',
      '/src/assets/images/coastal_architectural_residence_1792256412673.jpg'
    ],
    description: 'Masterfully cantilevered over an undulating championship golf fairway, The Glass Pavilion employs Shou Sugi Ban charred cedar siding and motorized glass guillotine walls that open the entire great room to the morning breeze. Features an indoor heated ozone pool and a Japanese zen rock garden.',
    descriptionAr: 'معلقة بمهارة فوق مسطحات الجولف الخضراء الممتدة، تستخدم الفيلا أخشاب الشو-سوغي-بان اليابانية المحروقة مع جدران زجاجية هيدروليكية تفتح الصالة الرئيسية بالكامل على نسيم الصباح. تضم مسبحاً داخلياً معالجاً بالأوزون وحديقة زن يابانية هادئة.',
    amenities: [
      'Motorized Guillotine Glass Walls',
      'Indoor Heated Ozone Therapy Pool',
      'Authentic Japanese Dry Rock Courtyard',
      'Direct Private Golf Cart Access',
      'Custom Miele Kitchen with Teppanyaki Grill',
      'Smart Geothermal Underfloor Heating'
    ],
    amenitiesAr: [
      'جدران زجاجية هيدروليكية متحركة بالكامل',
      'مسبح داخلي دافئ بتقنية الأوزون العلاجي',
      'حديقة صخرية يابانية (زن) طبيعية',
      'مسار خاص لعربات الجولف إلى الملعب',
      'مطبخ ميلي الألماني الفاخر مع شواية تيبانياكي',
      'تدفئة أرضية جيوتقنية ذكية'
    ],
    coordinates: {
      lat: 30.0381,
      lng: 30.9852
    },
    agent: AGENTS[2],
    architecturalNotes: 'Features blackened structural steel framework paired with hand-hewn Japanese cedar and honed Basaltina stone flooring.',
    architecturalNotesAr: 'هيكل حديدي معالج باللون الأسود المطفي مع أخشاب الأرز المعمرة وحجر البازالتينا الطبيعي.'
  }
];

export const CURRENCY_RATES: Record<string, { symbol: string; rate: number; name: string; nameAr: string }> = {
  USD: { symbol: '$', rate: 1, name: 'USD ($)', nameAr: 'دولار أمريكي ($)' },
  EGP: { symbol: 'EGP', rate: 49.5, name: 'EGP (ج.م)', nameAr: 'جنيه مصري (ج.م)' },
  AED: { symbol: 'AED', rate: 3.67, name: 'AED (د.إ)', nameAr: 'درهم إماراتي (د.إ)' }
};
