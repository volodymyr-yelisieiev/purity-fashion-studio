import type {
  Collection,
  Course,
  Localized,
  MediaAsset,
  NavigationItem,
  PortfolioCase,
  PublicPage,
  Service,
  ServiceCategory,
  SiteSettings,
} from "./model"

const inquiryCommercialStatus = {
  uk: "Поточна доступність підтверджується за запитом.",
  ru: "Текущая доступность подтверждается по запросу.",
  en: "Current availability is confirmed by request.",
} satisfies Localized<string>

const inquiryPriceNote = {
  uk: "Фінальна вартість підтверджується після уточнення формату й обсягу.",
  ru: "Финальная стоимость подтверждается после уточнения формата и объёма.",
  en: "Final pricing is confirmed after format and scope are clarified.",
} satisfies Localized<string>

const placeholderCourseCommercialStatus = {
  uk: "Фіксована пропозиція — placeholder до затвердження комерційних умов.",
  ru: "Фиксированное предложение — placeholder до утверждения коммерческих условий.",
  en: "Fixed offer — placeholder until the commercial terms are approved.",
} satisfies Localized<string>

const placeholderCoursePriceNote = {
  uk: "Ціна: placeholder EUR; checkout: тестовий маршрут до затвердження ціни.",
  ru: "Цена: placeholder EUR; checkout: тестовый маршрут до утверждения цены.",
  en: "Price: EUR placeholder; checkout: test route until the price is approved.",
} satisfies Localized<string>

export const serviceCategories = [
  {
    slug: "research",
    routeSegment: "stylist",
    sourceUrl: "http://purity-fashion.com/stylist/",
    sourceLabel: "Old PURITY stylist page",
    title: {
      uk: "Персональний стиліст",
      ru: "Персональный стилист",
      en: "Personal Stylist",
    },
    summary: {
      uk: "Професійна робота з дрес-кодом, кроєм, тканиною, кольором і системою гардероба.",
      ru: "Профессиональная работа с дресс-кодом, кроем, тканью, цветом и системой гардероба.",
      en: "Professional work with dress code, cut, fabric, color, and wardrobe system.",
    },
  },
  {
    slug: "realisation",
    routeSegment: "shopping",
    sourceUrl: "http://purity-fashion.com/personalnyj-shoping/",
    sourceLabel: "Old PURITY personal shopping page",
    title: {
      uk: "Персональний шопінг",
      ru: "Персональный шопинг",
      en: "Personal Shopping",
    },
    summary: {
      uk: "Маршрут магазинів, добір речей і примірка за погодженим списком та бюджетом.",
      ru: "Маршрут магазинов, подбор вещей и примерка по согласованному списку и бюджету.",
      en: "Store route, garment selection, and fitting by an agreed list and budget.",
    },
  },
  {
    slug: "atelier",
    routeSegment: "atelier",
    sourceUrl: "http://purity-fashion.com/atele-masterskaya/",
    sourceLabel: "Old PURITY atelier page",
    title: {
      uk: "Ательє",
      ru: "Ателье",
      en: "Atelier",
    },
    summary: {
      uk: "Індивідуальна робота з формою, тканиною та посадкою.",
      ru: "Индивидуальная работа с формой, тканью и посадкой.",
      en: "Individual work with form, fabric, and fit.",
    },
  },
  {
    slug: "transformation",
    routeSegment: "wardrobe",
    sourceUrl: "http://purity-fashion.com/garderob/",
    sourceLabel: "Old PURITY wardrobe revision page",
    title: {
      uk: "Ревізія гардероба",
      ru: "Ревизия гардероба",
      en: "Wardrobe Revision",
    },
    summary: {
      uk: "Переосмислення наявного гардероба без зайвих речей.",
      ru: "Переосмысление существующего гардероба без лишних вещей.",
      en: "Reframing the existing wardrobe without unnecessary additions.",
    },
  },
  {
    slug: "corporate",
    routeSegment: "corporate",
    sourceUrl: "http://purity-fashion.com/korporativnyj-imidzh/",
    sourceLabel: "Old PURITY corporate image page",
    title: {
      uk: "Корпоративний імідж",
      ru: "Корпоративный имидж",
      en: "Corporate Image",
    },
    summary: {
      uk: "Форма, дрес-код і навчальні кейси для команд, де стиль співробітників працює на позиціонування бренду.",
      ru: "Форма, дресс-код и обучающие кейсы для команд, где стиль сотрудников работает на позиционирование бренда.",
      en: "Uniform, dress code, and training cases for teams where employee style supports brand positioning.",
    },
  },
  {
    slug: "school",
    routeSegment: "school",
    sourceUrl: "http://purity-fashion.com/komanda/",
    sourceLabel: "Old PURITY team and internal school page",
    title: {
      uk: "Школа",
      ru: "Школа",
      en: "School",
    },
    summary: {
      uk: "Освітній напрям для самостійної роботи з гардеробом.",
      ru: "Образовательное направление для самостоятельной работы с гардеробом.",
      en: "A learning path for independent wardrobe work.",
    },
  },
  {
    slug: "collections",
    routeSegment: "collections",
    sourceUrl: "http://purity-fashion.com/shop/",
    sourceLabel: "Old PURITY shop page",
    title: {
      uk: "Колекції",
      ru: "Коллекции",
      en: "Collections",
    },
    summary: {
      uk: "Капсульні речі та авторські добірки PURITY.",
      ru: "Капсульные вещи и авторские подборки PURITY.",
      en: "Capsule pieces and authored PURITY selections.",
    },
  },
  {
    slug: "portfolio",
    routeSegment: "portfolio",
    sourceUrl: "http://purity-fashion.com/",
    sourceLabel: "Old PURITY home page",
    title: {
      uk: "Портфоліо",
      ru: "Портфолио",
      en: "Portfolio",
    },
    summary: {
      uk: "Перевірені case records із зафіксованим запитом, процесом, результатом і погодженими матеріалами.",
      ru: "Проверенные case records с зафиксированным запросом, процессом, результатом и согласованными материалами.",
      en: "Verified case records with a documented brief, process, outcome, and approved materials.",
    },
  },
  {
    slug: "contacts",
    routeSegment: "contacts",
    sourceUrl: "http://purity-fashion.com/kontakty/",
    sourceLabel: "Old PURITY contacts page",
    title: {
      uk: "Контакти",
      ru: "Контакты",
      en: "Contacts",
    },
    summary: {
      uk: "Шлях до першої консультації та уточнення формату.",
      ru: "Путь к первой консультации и уточнению формата.",
      en: "The path to a first consultation and format clarification.",
    },
  },
] satisfies ServiceCategory[]

export const mediaAssets = [
  {
    id: "logo-wordmark-black",
    kind: "logo",
    source: "client",
    generated: false,
    fileName: "wordmark-black.png",
    aspectRatio: "2212:1079",
    sourceFile: "assets/brand/Logo_PURITY.ai",
    src: "/brand/purity/wordmark-black.png",
    usage: ["header", "light brand moments"],
    internalLabel: {
      uk: "Чорний wordmark PURITY з клієнтського AI-файлу",
      ru: "Чёрный wordmark PURITY из клиентского AI-файла",
      en: "Black PURITY wordmark from the client AI source",
    },
    alt: {
      uk: "Логотип PURITY",
      ru: "Логотип PURITY",
      en: "PURITY logo",
    },
    replacementPriority: "keep-client-source",
    isRealClientProof: true,
  },
  {
    id: "logo-lockup-black",
    kind: "logo",
    source: "client",
    generated: false,
    fileName: "lockup-black.png",
    aspectRatio: "2245:1103",
    sourceFile: "assets/brand/Logo_PURITY.ai",
    src: "/brand/purity/lockup-black.png",
    usage: ["footer", "light brand moments"],
    internalLabel: {
      uk: "Чорний lockup PURITY з підписом",
      ru: "Чёрный lockup PURITY с подписью",
      en: "Black PURITY lockup with descriptor",
    },
    alt: {
      uk: "PURITY Personal Wardrobe Designer",
      ru: "PURITY Personal Wardrobe Designer",
      en: "PURITY Personal Wardrobe Designer",
    },
    replacementPriority: "keep-client-source",
    isRealClientProof: true,
  },
  {
    id: "logo-mark-grey",
    kind: "logo",
    source: "client",
    generated: false,
    fileName: "mark-grey.png",
    aspectRatio: "487:808",
    sourceFile: "assets/brand/Logo_PURITY.ai",
    src: "/brand/purity/mark-grey.png",
    usage: ["favicon", "app icon", "apple touch icon"],
    internalLabel: {
      uk: "Сірий знак PURITY",
      ru: "Серый знак PURITY",
      en: "Grey PURITY mark",
    },
    alt: {
      uk: "Знак PURITY",
      ru: "Знак PURITY",
      en: "PURITY mark",
    },
    replacementPriority: "keep-client-source",
    isRealClientProof: true,
  },
  {
    id: "logo-wordmark-reversed",
    kind: "logo",
    source: "client",
    generated: false,
    fileName: "wordmark-white.png",
    aspectRatio: "2218:1085",
    sourceFile: "assets/brand/Logo_PURITY.ai",
    src: "/brand/purity/wordmark-white.png",
    usage: ["dark brand moments"],
    internalLabel: {
      uk: "Reversed wordmark PURITY",
      ru: "Reversed wordmark PURITY",
      en: "Reversed PURITY wordmark",
    },
    alt: {
      uk: "Логотип PURITY",
      ru: "Логотип PURITY",
      en: "PURITY logo",
    },
    replacementPriority: "keep-client-source",
    isRealClientProof: true,
  },
  {
    id: "logo-lockup-reversed",
    kind: "logo",
    source: "client",
    generated: false,
    fileName: "lockup-white.png",
    aspectRatio: "2238:1103",
    sourceFile: "assets/brand/Logo_PURITY.ai",
    src: "/brand/purity/lockup-white.png",
    usage: ["dark footer", "dark brand moments"],
    internalLabel: {
      uk: "Reversed lockup PURITY з підписом",
      ru: "Reversed lockup PURITY с подписью",
      en: "Reversed PURITY lockup with descriptor",
    },
    alt: {
      uk: "PURITY Personal Wardrobe Designer",
      ru: "PURITY Personal Wardrobe Designer",
      en: "PURITY Personal Wardrobe Designer",
    },
    replacementPriority: "keep-client-source",
    isRealClientProof: true,
  },
  {
    id: "logo-og",
    kind: "logo",
    source: "client",
    generated: false,
    fileName: "logo-og.png",
    aspectRatio: "1200:630",
    sourceFile: "assets/brand/Logo_PURITY.ai",
    src: "/brand/logo-og.png",
    usage: ["open graph", "twitter social preview"],
    internalLabel: {
      uk: "Соціальне превʼю PURITY",
      ru: "Социальное превью PURITY",
      en: "PURITY social preview",
    },
    alt: {
      uk: "PURITY Personal Wardrobe Designer",
      ru: "PURITY Personal Wardrobe Designer",
      en: "PURITY Personal Wardrobe Designer",
    },
    replacementPriority: "keep-client-source",
    isRealClientProof: true,
  },
  {
    id: "generated-fabric-study",
    kind: "image",
    source: "generated",
    generated: true,
    fileName: "generated-fabric-study.png",
    aspectRatio: "4:5",
    sourceMetadata: {
      engine: "OpenAI image generation",
      prompt:
        "Editorial macro of ivory silk and fine wool fabric folds, with no people, text, logos, or proof context.",
      originalPath:
        "/Users/v.yelisieiev/.codex/generated_images/019f42d6-c466-7e82-b3e5-f8d99045552a/ig_0ecf35306511f7c8016a4e946d301c8191b5a58e797d9e5179.png",
    },
    src: "/generated/generated-fabric-study.png",
    usage: [
      "homepage hero",
      "research service pages",
      "school route and course rail",
      "temporary fabric imagery",
    ],
    internalLabel: {
      uk: "Згенерований плейсхолдер фактури тканини",
      ru: "Сгенерированный плейсхолдер фактуры ткани",
      en: "Generated fabric texture placeholder",
    },
    alt: {
      uk: "Мʼякі складки шовку й тонкої вовни у світлих відтінках",
      ru: "Мягкие складки шелка и тонкой шерсти в светлых оттенках",
      en: "Soft folds of silk and fine wool in light neutral tones",
    },
    replacementPriority: "replace-when-client-proof-arrives",
    isRealClientProof: false,
  },
  {
    id: "generated-editorial-hero-flow",
    kind: "image",
    source: "generated",
    generated: true,
    fileName: "hero-flow.webp",
    aspectRatio: "3:2",
    sourceMetadata: {
      engine: "OpenAI image generation",
      prompt:
        "Cinematic editorial image of an anonymous woman walking through a sunlit Kyiv atelier in a flowing ivory garment, with negative space for the PURITY homepage hero.",
    },
    src: "/generated/editorial/hero-flow.webp",
    heroFocalPoint: "right",
    usage: ["homepage hero", "cinematic brand moments"],
    internalLabel: {
      uk: "Кінематографічний герой PURITY",
      ru: "Кинематографический герой PURITY",
      en: "PURITY cinematic hero",
    },
    alt: {
      uk: "Жінка у світлому вбранні рухається сонячною студією",
      ru: "Женщина в светлом наряде движется по солнечной студии",
      en: "A woman in a light garment moves through a sunlit studio",
    },
    replacementPriority: "replace-when-client-proof-arrives",
    isRealClientProof: false,
  },
  {
    id: "generated-editorial-research",
    kind: "image",
    source: "generated",
    generated: true,
    fileName: "research-process.webp",
    aspectRatio: "3:2",
    sourceMetadata: {
      engine: "OpenAI image generation",
      prompt:
        "Editorial close-up of a stylist researching a wardrobe through garment sketches and neutral fabric swatches in warm atelier light.",
    },
    src: "/generated/editorial/research-process.webp",
    usage: ["homepage research story", "research category pages"],
    internalLabel: {
      uk: "Редакційний кадр дослідження",
      ru: "Редакционный кадр исследования",
      en: "Editorial research frame",
    },
    alt: {
      uk: "Руки стиліста працюють над ескізами й зразками тканин",
      ru: "Руки стилиста работают над эскизами и образцами тканей",
      en: "A stylist works with garment sketches and fabric samples",
    },
    replacementPriority: "replace-when-client-proof-arrives",
    isRealClientProof: false,
  },
  {
    id: "generated-editorial-create",
    kind: "image",
    source: "generated",
    generated: true,
    fileName: "create-process.webp",
    aspectRatio: "3:2",
    sourceMetadata: {
      engine: "OpenAI image generation",
      prompt:
        "Editorial close-up of a tailor pinning and hand-stitching ivory fabric in warm directional atelier light.",
    },
    src: "/generated/editorial/create-process.webp",
    usage: ["homepage creation story", "atelier category pages"],
    internalLabel: {
      uk: "Редакційний кадр створення",
      ru: "Редакционный кадр создания",
      en: "Editorial creation frame",
    },
    alt: {
      uk: "Руки майстра вручну зшивають світлу тканину",
      ru: "Руки мастера вручную сшивают светлую ткань",
      en: "A maker hand-stitches light fabric",
    },
    replacementPriority: "replace-when-client-proof-arrives",
    isRealClientProof: false,
  },
  {
    id: "generated-atelier-detail",
    kind: "image",
    source: "generated",
    generated: true,
    fileName: "generated-atelier-detail.png",
    aspectRatio: "4:5",
    sourceMetadata: {
      engine: "OpenAI image generation",
      prompt:
        "Editorial atelier table with pattern paper, fabric swatches, measuring tape, pins, chalk, and scissors, with no people, text, logos, or proof context.",
      originalPath:
        "/Users/v.yelisieiev/.codex/generated_images/019f42d6-c466-7e82-b3e5-f8d99045552a/ig_0ecf35306511f7c8016a4e949af94c819187526ba654f07675.png",
    },
    src: "/generated/generated-atelier-detail.png",
    usage: [
      "atelier service pages",
      "collections service and collection pages",
      "shop-derived product signal pages",
      "temporary atelier imagery",
    ],
    internalLabel: {
      uk: "Згенерований плейсхолдер деталі ательє",
      ru: "Сгенерированный плейсхолдер детали ателье",
      en: "Generated atelier detail placeholder",
    },
    alt: {
      uk: "Матеріали ательє з тканиною, лекалами та інструментами",
      ru: "Материалы ателье с тканью, лекалами и инструментами",
      en: "Atelier materials with fabric, patterns, and tools",
    },
    replacementPriority: "replace-when-client-proof-arrives",
    isRealClientProof: false,
  },
  {
    id: "generated-lookbook-paper",
    kind: "image",
    source: "generated",
    generated: true,
    fileName: "generated-lookbook-paper.png",
    aspectRatio: "4:5",
    sourceMetadata: {
      engine: "OpenAI image generation",
      prompt:
        "Editorial blank lookbook pages, fabric swatches, and abstract garment sketches, with no real people, readable text, logos, or proof context.",
      originalPath:
        "/Users/v.yelisieiev/.codex/generated_images/019f42d6-c466-7e82-b3e5-f8d99045552a/ig_0ecf35306511f7c8016a4e94cefde08191a63aac800111a5ff.png",
    },
    src: "/generated/generated-lookbook-paper.png",
    usage: [
      "shopping service pages",
      "wardrobe service pages",
      "corporate service pages",
      "shop-derived collection pages",
      "booking route",
      "temporary lookbook imagery",
    ],
    internalLabel: {
      uk: "Згенерований плейсхолдер паперу лукбука",
      ru: "Сгенерированный плейсхолдер бумаги лукбука",
      en: "Generated lookbook paper placeholder",
    },
    alt: {
      uk: "Аркуші лукбука, зразки тканини й ескізи образів",
      ru: "Листы лукбука, образцы ткани и эскизы образов",
      en: "Lookbook pages, fabric swatches, and outfit sketches",
    },
    replacementPriority: "replace-when-client-proof-arrives",
    isRealClientProof: false,
  },
  {
    id: "generated-portfolio-silhouette",
    kind: "image",
    source: "generated",
    generated: true,
    fileName: "generated-portfolio-silhouette.png",
    aspectRatio: "4:5",
    sourceMetadata: {
      engine: "OpenAI image generation",
      prompt:
        "Editorial studio interior with a neutral dress form mannequin and draped ivory fabric, with no real person, text, logos, or proof context.",
      originalPath:
        "/Users/v.yelisieiev/.codex/generated_images/019f42d6-c466-7e82-b3e5-f8d99045552a/ig_0ecf35306511f7c8016a4e9500b6a08191865792bc5c93a306.png",
    },
    src: "/generated/generated-portfolio-silhouette.png",
    usage: [
      "studio route",
      "contacts route",
      "portfolio placeholder route",
      "temporary dress form imagery",
    ],
    internalLabel: {
      uk: "Згенерований плейсхолдер портфоліо",
      ru: "Сгенерированный плейсхолдер портфолио",
      en: "Generated portfolio placeholder",
    },
    alt: {
      uk: "Абстрактний силует для майбутнього кейсу портфоліо",
      ru: "Абстрактный силуэт для будущего кейса портфолио",
      en: "Abstract silhouette for a future portfolio case",
    },
    replacementPriority: "replace-before-launch",
    isRealClientProof: false,
  },
  {
    id: "generated-capsule-silk",
    kind: "image",
    source: "generated",
    generated: true,
    fileName: "generated-capsule-silk.png",
    aspectRatio: "4:5",
    sourceMetadata: {
      engine: "OpenAI image generation",
      prompt:
        "Folded silk travel capsule wardrobe arranged as five elegant pieces on a clean atelier table, with no people, readable text, logos, protected motifs, or proof context.",
      originalPath:
        "/Users/v.yelisieiev/.codex/generated_images/019f4492-1d12-7dc2-bf31-e29279ea7b63/ig_07697bdfaa53065b016a4fb23b175c8191bb44c2045e825de4.png",
    },
    src: "/generated/generated-capsule-silk.png",
    usage: [
      "capsule collection service page",
      "capsule and travel collection pages",
      "temporary capsule silk imagery",
    ],
    internalLabel: {
      uk: "Згенерований плейсхолдер шовкової капсули",
      ru: "Сгенерированный плейсхолдер шелковой капсулы",
      en: "Generated silk capsule placeholder",
    },
    alt: {
      uk: "Шовкові речі капсульного гардероба на столі ательє",
      ru: "Шелковые вещи капсульного гардероба на столе ателье",
      en: "Silk capsule wardrobe pieces on an atelier table",
    },
    replacementPriority: "replace-when-client-proof-arrives",
    isRealClientProof: false,
  },
  {
    id: "generated-school-workshop",
    kind: "image",
    source: "generated",
    generated: true,
    fileName: "generated-school-workshop.png",
    aspectRatio: "4:5",
    sourceMetadata: {
      engine: "OpenAI image generation",
      prompt:
        "Fashion workshop table with pattern drafting paper, ruler, measuring tape, fabric swatches, thread, pencil, and dress form, with no people, readable text, logos, or proof context.",
      originalPath:
        "/Users/v.yelisieiev/.codex/generated_images/019f4492-1d12-7dc2-bf31-e29279ea7b63/ig_07697bdfaa53065b016a4fb26e32f88191ae3defba649384a5.png",
    },
    src: "/generated/generated-school-workshop.png",
    usage: [
      "school route",
      "wardrobe management service page",
      "wardrobe management course page",
      "temporary school workshop imagery",
    ],
    internalLabel: {
      uk: "Згенерований плейсхолдер навчальної майстерні",
      ru: "Сгенерированный плейсхолдер учебной мастерской",
      en: "Generated school workshop placeholder",
    },
    alt: {
      uk: "Матеріали майстерні з лекалами, тканинами й мірною стрічкою",
      ru: "Материалы мастерской с лекалами, тканями и сантиметровой лентой",
      en: "Workshop materials with patterns, fabrics, and measuring tape",
    },
    replacementPriority: "replace-when-client-proof-arrives",
    isRealClientProof: false,
  },
  {
    id: "generated-studio-atmosphere",
    kind: "image",
    source: "generated",
    generated: true,
    fileName: "generated-studio-atmosphere.png",
    aspectRatio: "4:5",
    sourceMetadata: {
      engine: "OpenAI image generation",
      prompt:
        "Minimalist fashion studio interior with dress form, garment rack, consultation table, fabric swatches, and no people, readable text, logos, or proof context.",
      originalPath:
        "/Users/v.yelisieiev/.codex/generated_images/019f4492-1d12-7dc2-bf31-e29279ea7b63/ig_07697bdfaa53065b016a4fb2b2b1a481919330b10fa066e75c.png",
    },
    src: "/generated/generated-studio-atmosphere.png",
    usage: [
      "studio route",
      "booking route",
      "contacts route",
      "temporary studio atmosphere imagery",
    ],
    internalLabel: {
      uk: "Згенерований плейсхолдер атмосфери студії",
      ru: "Сгенерированный плейсхолдер атмосферы студии",
      en: "Generated studio atmosphere placeholder",
    },
    alt: {
      uk: "Студійний простір із манекеном, рейлом одягу й тканиною",
      ru: "Студийное пространство с манекеном, рейлом одежды и тканями",
      en: "Studio space with a dress form, garment rack, and fabric swatches",
    },
    replacementPriority: "replace-when-client-proof-arrives",
    isRealClientProof: false,
  },
  {
    id: "editorial-directions-texture",
    kind: "image",
    source: "generated",
    generated: true,
    fileName: "directions-texture.webp",
    aspectRatio: "3:2",
    sourceMetadata: {
      engine: "OpenAI image generation",
      prompt:
        "Layered wool, silk, pattern paper and tailoring chalk in warm monochrome atelier light.",
    },
    src: "/generated/editorial/directions-texture.webp",
    heroFocalPoint: "center",
    usage: ["homepage directions background"],
    internalLabel: {
      uk: "Фактури напряму",
      ru: "Фактуры направления",
      en: "Direction textures",
    },
    alt: {
      uk: "Шари вовни, шовку й паперу для лекал",
      ru: "Слои шерсти, шёлка и бумаги для лекал",
      en: "Layers of wool, silk, and pattern paper",
    },
    replacementPriority: "replace-when-client-proof-arrives",
    isRealClientProof: false,
  },
  {
    id: "editorial-stylist-mirror",
    kind: "image",
    source: "generated",
    generated: true,
    fileName: "stylist-mirror.webp",
    aspectRatio: "3:2",
    sourceMetadata: {
      engine: "OpenAI image generation",
      prompt:
        "Anonymous client and stylist shaping a silhouette at an atelier mirror.",
    },
    src: "/generated/editorial/stylist-mirror.webp",
    heroFocalPoint: "right",
    usage: ["stylist category", "personal lookbook service"],
    internalLabel: {
      uk: "Робота стиліста біля дзеркала",
      ru: "Работа стилиста у зеркала",
      en: "Stylist at the mirror",
    },
    alt: {
      uk: "Стиліст уточнює силует клієнтки біля дзеркала",
      ru: "Стилист уточняет силуэт клиентки у зеркала",
      en: "A stylist refines a client's silhouette at a mirror",
    },
    replacementPriority: "replace-when-client-proof-arrives",
    isRealClientProof: false,
  },
  {
    id: "editorial-shopping-rail",
    kind: "image",
    source: "generated",
    generated: true,
    fileName: "shopping-rail.webp",
    aspectRatio: "3:2",
    sourceMetadata: {
      engine: "OpenAI image generation",
      prompt:
        "A stylist's hand curating graphite and ivory garments on a private showroom rail.",
    },
    src: "/generated/editorial/shopping-rail.webp",
    heroFocalPoint: "right",
    usage: ["shopping category", "realisation support service"],
    internalLabel: {
      uk: "Кураторська добірка речей",
      ru: "Кураторская подборка вещей",
      en: "Curated garment selection",
    },
    alt: {
      uk: "Рука стиліста обирає речі на рейлі",
      ru: "Рука стилиста выбирает вещи на рейле",
      en: "A stylist selects garments from a rail",
    },
    replacementPriority: "replace-when-client-proof-arrives",
    isRealClientProof: false,
  },
  {
    id: "editorial-wardrobe-archive",
    kind: "image",
    source: "generated",
    generated: true,
    fileName: "wardrobe-archive.webp",
    aspectRatio: "3:2",
    sourceMetadata: {
      engine: "OpenAI image generation",
      prompt:
        "An architectural wardrobe archive with ordered garments and accessories.",
    },
    src: "/generated/editorial/wardrobe-archive.webp",
    heroFocalPoint: "right",
    usage: ["wardrobe category", "wardrobe transformation service"],
    internalLabel: {
      uk: "Гардероб як архів",
      ru: "Гардероб как архив",
      en: "Wardrobe as archive",
    },
    alt: {
      uk: "Організований гардероб із речами й аксесуарами",
      ru: "Организованный гардероб с вещами и аксессуарами",
      en: "An organized wardrobe with garments and accessories",
    },
    replacementPriority: "replace-when-client-proof-arrives",
    isRealClientProof: false,
  },
  {
    id: "editorial-corporate-tailoring",
    kind: "image",
    source: "generated",
    generated: true,
    fileName: "corporate-tailoring.webp",
    aspectRatio: "3:2",
    sourceMetadata: {
      engine: "OpenAI image generation",
      prompt:
        "Three tailored jackets and precise sleeve fitting in a restrained corporate studio.",
    },
    src: "/generated/editorial/corporate-tailoring.webp",
    heroFocalPoint: "right",
    usage: ["corporate category", "corporate image service"],
    internalLabel: {
      uk: "Корпоративний крій",
      ru: "Корпоративный крой",
      en: "Corporate tailoring",
    },
    alt: {
      uk: "Майстер працює з посадкою корпоративного жакета",
      ru: "Мастер работает с посадкой корпоративного жакета",
      en: "A maker adjusts the fit of a corporate jacket",
    },
    replacementPriority: "replace-when-client-proof-arrives",
    isRealClientProof: false,
  },
  {
    id: "editorial-collections-flatlay",
    kind: "image",
    source: "generated",
    generated: true,
    fileName: "collections-flatlay.webp",
    aspectRatio: "3:2",
    sourceMetadata: {
      engine: "OpenAI image generation",
      prompt:
        "Ivory silk, graphite wool and one muted aubergine evening accent in a capsule flat-lay.",
    },
    src: "/generated/editorial/collections-flatlay.webp",
    heroFocalPoint: "right",
    usage: [
      "collections category",
      "capsule collection service",
      "collection details",
    ],
    internalLabel: {
      uk: "Капсульна добірка",
      ru: "Капсульная подборка",
      en: "Capsule selection",
    },
    alt: {
      uk: "Капсула з шовку, вовни й вечірнього акценту",
      ru: "Капсула из шёлка, шерсти и вечернего акцента",
      en: "A capsule of silk, wool, and an evening accent",
    },
    replacementPriority: "replace-when-client-proof-arrives",
    isRealClientProof: false,
  },
  {
    id: "editorial-studio-method",
    kind: "image",
    source: "generated",
    generated: true,
    fileName: "studio-method.webp",
    aspectRatio: "3:2",
    sourceMetadata: {
      engine: "OpenAI image generation",
      prompt:
        "A working wardrobe design studio with consultation table, fabric archive, forms and rails.",
    },
    src: "/generated/editorial/studio-method.webp",
    heroFocalPoint: "center",
    usage: ["homepage method", "studio page"],
    internalLabel: {
      uk: "Робоча студія PURITY",
      ru: "Рабочая студия PURITY",
      en: "PURITY working studio",
    },
    alt: {
      uk: "Студія з тканинами, манекеном і робочим столом",
      ru: "Студия с тканями, манекеном и рабочим столом",
      en: "A studio with fabrics, a dress form, and worktable",
    },
    replacementPriority: "replace-when-client-proof-arrives",
    isRealClientProof: false,
  },
  {
    id: "editorial-portfolio-process",
    kind: "image",
    source: "generated",
    generated: true,
    fileName: "portfolio-process.webp",
    aspectRatio: "3:2",
    sourceMetadata: {
      engine: "OpenAI image generation",
      prompt:
        "Documentary fashion process with fitting notes, swatches, garment details and proof prints.",
    },
    src: "/generated/editorial/portfolio-process.webp",
    heroFocalPoint: "right",
    usage: ["portfolio page", "honest process story"],
    internalLabel: {
      uk: "Документування процесу",
      ru: "Документирование процесса",
      en: "Documenting the process",
    },
    alt: {
      uk: "Руки документують процес роботи з тканиною",
      ru: "Руки документируют процесс работы с тканью",
      en: "Hands document the process of working with fabric",
    },
    replacementPriority: "replace-before-launch",
    isRealClientProof: false,
  },
  {
    id: "editorial-booking-consultation",
    kind: "image",
    source: "generated",
    generated: true,
    fileName: "booking-consultation.webp",
    aspectRatio: "3:2",
    sourceMetadata: {
      engine: "OpenAI image generation",
      prompt:
        "Two anonymous people reviewing fabric and silhouettes during a first studio consultation.",
    },
    src: "/generated/editorial/booking-consultation.webp",
    heroFocalPoint: "right",
    usage: ["booking page"],
    internalLabel: {
      uk: "Перша консультація",
      ru: "Первая консультация",
      en: "First consultation",
    },
    alt: {
      uk: "Двоє людей обговорюють тканини й ескізи за столом",
      ru: "Два человека обсуждают ткани и эскизы за столом",
      en: "Two people discuss fabrics and sketches at a table",
    },
    replacementPriority: "replace-when-client-proof-arrives",
    isRealClientProof: false,
  },
  {
    id: "editorial-contacts-studio",
    kind: "image",
    source: "generated",
    generated: true,
    fileName: "contacts-studio.webp",
    aspectRatio: "3:2",
    sourceMetadata: {
      engine: "OpenAI image generation",
      prompt:
        "An understated urban fashion studio entrance glowing at early evening.",
    },
    src: "/generated/editorial/contacts-studio.webp",
    heroFocalPoint: "right",
    usage: ["contacts page"],
    internalLabel: {
      uk: "Вхід до студії",
      ru: "Вход в студию",
      en: "Studio entrance",
    },
    alt: {
      uk: "Освітлений вхід до міської студії",
      ru: "Освещённый вход в городскую студию",
      en: "The illuminated entrance to an urban studio",
    },
    replacementPriority: "replace-when-client-proof-arrives",
    isRealClientProof: false,
  },
  {
    id: "editorial-utility-patternmaking",
    kind: "image",
    source: "generated",
    generated: true,
    fileName: "utility-patternmaking.webp",
    aspectRatio: "3:2",
    sourceMetadata: {
      engine: "OpenAI image generation",
      prompt:
        "A quiet patternmaking table with rulers, paper, fabric and a dress form in shadow.",
    },
    src: "/generated/editorial/utility-patternmaking.webp",
    heroFocalPoint: "right",
    usage: ["school", "course", "legal", "payment status"],
    internalLabel: {
      uk: "Робочий стіл конструктора",
      ru: "Рабочий стол конструктора",
      en: "Patternmaker's worktable",
    },
    alt: {
      uk: "Лекала, тканина й інструменти на робочому столі",
      ru: "Лекала, ткань и инструменты на рабочем столе",
      en: "Patterns, fabric, and tools on a worktable",
    },
    replacementPriority: "replace-when-client-proof-arrives",
    isRealClientProof: false,
  },
] satisfies MediaAsset[]

export const services = [
  {
    slug: "personal-lookbook",
    category: "research",
    routeSegment: "personal-lookbook",
    sourceUrl: "http://purity-fashion.com/stylist/",
    sourceLabel: "Old PURITY stylist page",
    visibleInMvp: true,
    title: {
      uk: "Персональний лукбук",
      ru: "Персональный лукбук",
      en: "Personal Lookbook",
    },
    summary: {
      uk: "Консультація стиліста та персональна look-book презентація з рекомендаціями щодо брендів, крою, тканин і кольорів.",
      ru: "Консультация стилиста и персональная look-book презентация с рекомендациями по брендам, крою, тканям и цветам.",
      en: "A stylist consultation and personal look-book presentation with recommendations on brands, cut, fabrics, and colors.",
    },
    commercialStatus: inquiryCommercialStatus,
    priceNote: {
      uk: "Історичні орієнтири: консультація у студії без оплати, виїзд 400 грн; look-book без шопінгу 3700 грн. Поточна вартість за запитом.",
      ru: "Исторические ориентиры: консультация в студии без оплаты, выезд 400 грн; look-book без шопинга 3700 грн. Текущая стоимость по запросу.",
      en: "Historical references: in-studio consultation free, offsite 400 UAH; lookbook without shopping 3700 UAH. Current pricing by request.",
    },
    outcomes: {
      uk: ["План гардероба", "Look-book презентація", "Рекомендації стиліста"],
      ru: ["План гардероба", "Look-book презентация", "Рекомендации стилиста"],
      en: [
        "Wardrobe plan",
        "Look-book presentation",
        "Stylist recommendations",
      ],
    },
    mediaIds: ["editorial-stylist-mirror"],
    seo: {
      uk: {
        title: "Персональний лукбук | PURITY",
        description: "Структурована система стилю й гардеробних рішень.",
      },
      ru: {
        title: "Персональный лукбук | PURITY",
        description: "Структурированная система стиля и гардеробных решений.",
      },
      en: {
        title: "Personal Lookbook | PURITY",
        description: "A structured system for style and wardrobe decisions.",
      },
    },
  },
  {
    slug: "realisation-support",
    category: "realisation",
    routeSegment: "realisation-support",
    sourceUrl: "http://purity-fashion.com/personalnyj-shoping/",
    sourceLabel: "Old PURITY personal shopping page",
    visibleInMvp: true,
    title: {
      uk: "Супровід реалізації",
      ru: "Сопровождение реализации",
      en: "Realisation Support",
    },
    summary: {
      uk: "Шопінг-супровід або доставка образів за попередньо узгодженим списком речей, маршрутом і бюджетом.",
      ru: "Шопинг-сопровождение или доставка образов по заранее согласованному списку вещей, маршруту и бюджету.",
      en: "Shopping accompaniment or look delivery based on an agreed clothing list, route, and budget.",
    },
    commercialStatus: inquiryCommercialStatus,
    priceNote: {
      uk: "Історичні орієнтири: шопінг-супровід 3700 грн за повний робочий день; доставка 9500 грн; сезонний формат 6000 грн. Поточна вартість за запитом.",
      ru: "Исторические ориентиры: шопинг-сопровождение 3700 грн за полный рабочий день; доставка 9500 грн; сезонный формат 6000 грн. Текущая стоимость по запросу.",
      en: "Historical references: shopping accompaniment 3700 UAH per full working day; delivery 9500 UAH; seasonal format 6000 UAH. Current pricing by request.",
    },
    outcomes: {
      uk: [
        "Маршрут магазинів",
        "До 6 сезонних образів",
        "Примірка у студії або вдома",
      ],
      ru: [
        "Маршрут магазинов",
        "До 6 сезонных образов",
        "Примерка в студии или дома",
      ],
      en: ["Store route", "Up to 6 seasonal looks", "Studio or home fitting"],
    },
    mediaIds: ["editorial-shopping-rail"],
    seo: {
      uk: {
        title: "Супровід реалізації | PURITY",
        description: "Перехід від стилістичного дослідження до готових рішень.",
      },
      ru: {
        title: "Сопровождение реализации | PURITY",
        description: "Переход от стилевого исследования к готовым решениям.",
      },
      en: {
        title: "Realisation Support | PURITY",
        description: "A bridge from style research to finished decisions.",
      },
    },
  },
  {
    slug: "atelier-service",
    category: "atelier",
    routeSegment: "atelier-service",
    sourceUrl: "http://purity-fashion.com/atele-masterskaya/",
    sourceLabel: "Old PURITY atelier page",
    visibleInMvp: true,
    title: {
      uk: "Ательє-сервіс",
      ru: "Ателье-сервис",
      en: "Atelier Service",
    },
    summary: {
      uk: "Індивідуальний пошив одягу, взуття та аксесуарів із ескізом, тканиною, макетом і персональними лекалами.",
      ru: "Индивидуальный пошив одежды, обуви и аксессуаров с эскизом, тканью, макетом и персональными лекалами.",
      en: "Custom clothing, shoes, and accessories with sketch, fabric, mock-up, and personal patterns.",
    },
    commercialStatus: inquiryCommercialStatus,
    priceNote: {
      uk: "Історичні орієнтири ательє: від 7700 грн за сукню та від 14900 грн за пальто; фінальна ціна після ескізу, тканини й строків за запитом.",
      ru: "Исторические ориентиры ателье: от 7700 грн за платье и от 14900 грн за пальто; финальная цена после эскиза, ткани и сроков по запросу.",
      en: "Historical atelier references: dresses from 7700 UAH and coats from 14900 UAH; final pricing follows sketch, fabric, timing, and request.",
    },
    outcomes: {
      uk: ["Ескіз і тканина", "Макет або лекала", "Примірки до посадки"],
      ru: ["Эскиз и ткань", "Макет или лекала", "Примерки до посадки"],
      en: ["Sketch and fabric", "Mock-up or patterns", "Fittings until fit"],
    },
    mediaIds: ["generated-editorial-create"],
    seo: {
      uk: {
        title: "Ательє-сервіс | PURITY",
        description: "Індивідуальна робота з формою, посадкою й тканиною.",
      },
      ru: {
        title: "Ателье-сервис | PURITY",
        description: "Индивидуальная работа с формой, посадкой и тканью.",
      },
      en: {
        title: "Atelier Service | PURITY",
        description: "Individual work with form, fit, and fabric.",
      },
    },
  },
  {
    slug: "wardrobe-transformation",
    category: "transformation",
    routeSegment: "wardrobe-transformation",
    sourceUrl: "http://purity-fashion.com/garderob/",
    sourceLabel: "Old PURITY wardrobe page",
    visibleInMvp: true,
    title: {
      uk: "Трансформація гардероба",
      ru: "Трансформация гардероба",
      en: "Wardrobe Transformation",
    },
    summary: {
      uk: "Ревізія гардероба: фотографування речей, колажі майбутніх образів і зрозуміла система комплектів у шафі.",
      ru: "Ревизия гардероба: фотографирование вещей, коллажи будущих образов и понятная система комплектов в шкафу.",
      en: "Wardrobe revision: photographing pieces, future-look collages, and an understandable outfit system in the closet.",
    },
    commercialStatus: inquiryCommercialStatus,
    priceNote: {
      uk: "Історичні орієнтири: ревізія з виїздом стиліста 3000 грн; виїзний сервіс від 300 грн. Поточна вартість за запитом.",
      ru: "Исторические ориентиры: ревизия с выездом стилиста 3000 грн; выездной сервис от 300 грн. Текущая стоимость по запросу.",
      en: "Historical references: wardrobe revision with stylist visit 3000 UAH; offsite service from 300 UAH. Current pricing by request.",
    },
    outcomes: {
      uk: ["Фото речей", "Колажі образів", "Памʼятка що з чим носити"],
      ru: ["Фото вещей", "Коллажи образов", "Памятка что с чем носить"],
      en: ["Item photos", "Look collages", "What-to-wear guide"],
    },
    mediaIds: ["editorial-wardrobe-archive"],
    seo: {
      uk: {
        title: "Трансформація гардероба | PURITY",
        description: "Нові образи з наявного гардероба без зайвих покупок.",
      },
      ru: {
        title: "Трансформация гардероба | PURITY",
        description:
          "Новые образы из существующего гардероба без лишних покупок.",
      },
      en: {
        title: "Wardrobe Transformation | PURITY",
        description:
          "New looks from an existing wardrobe without excess buying.",
      },
    },
  },
  {
    slug: "corporate-image",
    category: "corporate",
    routeSegment: "corporate-image",
    sourceUrl: "http://purity-fashion.com/korporativnyj-imidzh/",
    sourceLabel: "Old PURITY corporate image page",
    visibleInMvp: true,
    title: {
      uk: "Корпоративний імідж",
      ru: "Корпоративный имидж",
      en: "Corporate Image",
    },
    summary: {
      uk: "PURITY розробляє корпоративний імідж як окремий проєкт: від задач бренду й посад до форми, тканини, рухів співробітників і навчальних кейсів.",
      ru: "PURITY разрабатывает корпоративный имидж как отдельный проект: от задач бренда и должностей до формы, ткани, движений сотрудников и обучающих кейсов.",
      en: "PURITY develops corporate image as a dedicated project: from brand goals and roles to uniform, fabric, employee movement, and training cases.",
    },
    commercialStatus: inquiryCommercialStatus,
    priceNote: inquiryPriceNote,
    outcomes: {
      uk: [
        "Позиціонування бренду в одязі",
        "Ролі та видимість посад",
        "Форма, тканина й комфорт руху",
        "Тренінгові кейси для команд",
      ],
      ru: [
        "Позиционирование бренда в одежде",
        "Роли и видимость должностей",
        "Форма, ткань и комфорт движения",
        "Тренинговые кейсы для команд",
      ],
      en: [
        "Brand positioning through dress",
        "Roles and visibility of positions",
        "Uniform, fabric, and movement comfort",
        "Training cases for teams",
      ],
    },
    mediaIds: ["editorial-corporate-tailoring"],
    seo: {
      uk: {
        title: "Корпоративний імідж | PURITY",
        description: "Форма, дрес-код і тренінгові кейси для команд.",
      },
      ru: {
        title: "Корпоративный имидж | PURITY",
        description: "Форма, дресс-код и тренинговые кейсы для команд.",
      },
      en: {
        title: "Corporate Image | PURITY",
        description: "Uniform, dress code, and training cases for teams.",
      },
    },
  },
  {
    slug: "wardrobe-management",
    category: "school",
    routeSegment: "wardrobe-management",
    sourceUrl: "http://purity-fashion.com/komanda/",
    sourceLabel: "Old PURITY team and stylist training page",
    visibleInMvp: true,
    title: {
      uk: "Управління гардеробом",
      ru: "Управление гардеробом",
      en: "Wardrobe Management",
    },
    summary: {
      uk: "Освітній формат, побудований на досвіді команди стилістів, ательє та внутрішньої школи PURITY.",
      ru: "Образовательный формат, основанный на опыте команды стилистов, ателье и внутренней школы PURITY.",
      en: "A learning format based on PURITY's stylist team, atelier work, and internal school.",
    },
    commercialStatus: inquiryCommercialStatus,
    priceNote: inquiryPriceNote,
    outcomes: {
      uk: ["Система шафи", "Критерії покупок", "Повторюваний процес"],
      ru: ["Система шкафа", "Критерии покупок", "Повторяемый процесс"],
      en: ["Wardrobe system", "Buying criteria", "Repeatable process"],
    },
    mediaIds: ["editorial-utility-patternmaking"],
    seo: {
      uk: {
        title: "Управління гардеробом | PURITY",
        description: "Освітній формат для самостійної роботи зі стилем.",
      },
      ru: {
        title: "Управление гардеробом | PURITY",
        description:
          "Образовательный формат для самостоятельной работы со стилем.",
      },
      en: {
        title: "Wardrobe Management | PURITY",
        description: "A learning format for independent style work.",
      },
    },
  },
  {
    slug: "capsule-collection",
    category: "collections",
    routeSegment: "capsule-collection",
    sourceUrl: "http://purity-fashion.com/shop/",
    sourceLabel: "Old PURITY shop page",
    visibleInMvp: true,
    title: {
      uk: "Капсульна колекція",
      ru: "Капсульная коллекция",
      en: "Capsule Collection",
    },
    summary: {
      uk: "Капсульний напрям із готовими речами й варіантами взаємодії: зустріч зі стилістом, виїзна примірка або індивідуальна модель.",
      ru: "Капсульное направление с готовыми вещами и вариантами взаимодействия: встреча со стилистом, выездная примерка или индивидуальная модель.",
      en: "A capsule direction with ready pieces and flexible service formats: stylist meeting, mobile fitting, or a custom model.",
    },
    commercialStatus: inquiryCommercialStatus,
    priceNote: {
      uk: "Наявність, розмір, формат примірки й актуальна ціна підтверджуються за запитом.",
      ru: "Наличие, размер, формат примерки и актуальная цена подтверждаются по запросу.",
      en: "Availability, sizing, fitting format, and current price are confirmed by request.",
    },
    outcomes: {
      uk: ["Капсула", "Матеріали", "Сценарії носіння"],
      ru: ["Капсула", "Материалы", "Сценарии носки"],
      en: ["Capsule", "Materials", "Wear scenarios"],
    },
    mediaIds: ["editorial-collections-flatlay"],
    seo: {
      uk: {
        title: "Капсульна колекція | PURITY",
        description: "Авторські речі й добірки у логіці PURITY.",
      },
      ru: {
        title: "Капсульная коллекция | PURITY",
        description: "Авторские вещи и подборки в логике PURITY.",
      },
      en: {
        title: "Capsule Collection | PURITY",
        description: "Authored pieces and selections in the PURITY logic.",
      },
    },
  },
] satisfies Service[]

export const courses = [
  {
    slug: "wardrobe-management-course",
    routeSegment: "wardrobe-management-course",
    sourceUrl: "http://purity-fashion.com/komanda/",
    sourceLabel: "Old PURITY team and internal school page",
    visibleInMvp: true,
    title: {
      uk: "Курс управління гардеробом",
      ru: "Курс управления гардеробом",
      en: "Wardrobe Management Course",
    },
    summary: {
      uk: "Системний курс для самостійного аналізу речей, образів і покупок.",
      ru: "Системный курс для самостоятельного анализа вещей, образов и покупок.",
      en: "A structured course for independent wardrobe, look, and buying analysis.",
    },
    commercialStatus: placeholderCourseCommercialStatus,
    priceNote: placeholderCoursePriceNote,
    audience: {
      uk: "Для тих, хто хоче приймати стилістичні рішення самостійно.",
      ru: "Для тех, кто хочет принимать стилевые решения самостоятельно.",
      en: "For people who want to make style decisions independently.",
    },
    lessons: {
      uk: ["Аудит", "Силует", "Палітра", "Покупки"],
      ru: ["Аудит", "Силуэт", "Палитра", "Покупки"],
      en: ["Audit", "Silhouette", "Palette", "Buying"],
    },
    mediaIds: ["editorial-utility-patternmaking"],
    seo: {
      uk: {
        title: "Курс управління гардеробом | PURITY",
        description: "Системний курс для самостійної роботи з гардеробом.",
      },
      ru: {
        title: "Курс управления гардеробом | PURITY",
        description: "Системный курс для самостоятельной работы с гардеробом.",
      },
      en: {
        title: "Wardrobe Management Course | PURITY",
        description: "A structured course for independent wardrobe work.",
      },
    },
  },
] satisfies Course[]

export const collections = [
  {
    slug: "purity-capsule",
    routeSegment: "purity-capsule",
    sourceUrl: "http://purity-fashion.com/shop/",
    sourceLabel: "Old PURITY shop page",
    visibleInMvp: true,
    title: {
      uk: "PURITY Capsule",
      ru: "PURITY Capsule",
      en: "PURITY Capsule",
    },
    summary: {
      uk: "Капсульна добірка з вовни, шовку й продуманих шарів для комбінування в одному гардеробі.",
      ru: "Капсульная подборка из шерсти, шелка и продуманных слоев для сочетания в одном гардеробе.",
      en: "A capsule edit of wool, silk, and considered layers designed to work within one wardrobe.",
    },
    commercialStatus: inquiryCommercialStatus,
    priceNote: {
      uk: "Актуальна наявність і ціна капсульних речей підтверджуються за запитом.",
      ru: "Актуальное наличие и цена капсульных вещей подтверждаются по запросу.",
      en: "Current availability and price for capsule pieces are confirmed by request.",
    },
    materials: {
      uk: ["Вовна", "Шовк", "Підкладка"],
      ru: ["Шерсть", "Шелк", "Подкладка"],
      en: ["Wool", "Silk", "Lining"],
    },
    mediaIds: ["editorial-collections-flatlay", "generated-fabric-study"],
    seo: {
      uk: {
        title: "PURITY Capsule | PURITY",
        description: "Капсульна добірка з вовни, шовку й продуманих шарів.",
      },
      ru: {
        title: "PURITY Capsule | PURITY",
        description:
          "Капсульная подборка из шерсти, шелка и продуманных слоев.",
      },
      en: {
        title: "PURITY Capsule | PURITY",
        description: "A capsule edit of wool, silk, and considered layers.",
      },
    },
  },
  {
    slug: "new-year-party-collection",
    routeSegment: "new-year-party-collection",
    sourceUrl: "http://purity-fashion.com/shop/",
    sourceLabel: "Old PURITY Shop Online listing",
    visibleInMvp: true,
    title: {
      uk: "New Year Party Collection",
      ru: "New Year Party Collection",
      en: "New Year Party Collection",
    },
    summary: {
      uk: "Святкова капсула для вечірніх сценаріїв, виразних фактур і готових комплектів.",
      ru: "Праздничная капсула для вечерних сценариев, выразительных фактур и готовых комплектов.",
      en: "A party capsule for evening occasions, expressive textures, and ready-made combinations.",
    },
    commercialStatus: inquiryCommercialStatus,
    priceNote: {
      uk: "Історичний ціновий орієнтир — 3100 грн; актуальна наявність і ціна підтверджуються за запитом.",
      ru: "Исторический ценовой ориентир — 3100 грн; актуальное наличие и цена подтверждаются по запросу.",
      en: "Historical price reference: 3,100 UAH; current availability and price are confirmed by request.",
    },
    materials: {
      uk: ["Вечірні фактури", "Готові комплекти", "Наявність за запитом"],
      ru: ["Вечерние фактуры", "Готовые комплекты", "Наличие по запросу"],
      en: ["Evening textures", "Ready combinations", "Availability by request"],
    },
    mediaIds: ["generated-lookbook-paper", "editorial-collections-flatlay"],
    seo: {
      uk: {
        title: "New Year Party Collection | PURITY",
        description:
          "Святкова капсула для вечірніх сценаріїв і виразних фактур.",
      },
      ru: {
        title: "New Year Party Collection | PURITY",
        description:
          "Праздничная капсула для вечерних сценариев и выразительных фактур.",
      },
      en: {
        title: "New Year Party Collection | PURITY",
        description:
          "A party capsule for evening occasions and expressive textures.",
      },
    },
  },
  {
    slug: "beaded-dress-signal",
    routeSegment: "beaded-dress-signal",
    sourceUrl: "http://purity-fashion.com/shop/",
    sourceLabel: "Old PURITY Shop Online listing",
    visibleInMvp: true,
    title: {
      uk: "Сукня з намистинами й паєтками",
      ru: "Платье с бусинами и пайетками",
      en: "Beaded and Sequined Dress",
    },
    summary: {
      uk: "Вечірня сукня з намистинами й паєтками у двох кольорах із виразною фактурою та акцентом на русі.",
      ru: "Вечернее платье с бусинами и пайетками в двух цветах, выразительной фактурой и акцентом на движении.",
      en: "An evening dress in two colorways with beading, sequins, expressive texture, and movement.",
    },
    commercialStatus: inquiryCommercialStatus,
    priceNote: {
      uk: "Історичний ціновий орієнтир — 20 987 грн; актуальна наявність і ціна підтверджуються за запитом.",
      ru: "Исторический ценовой ориентир — 20 987 грн; актуальное наличие и цена подтверждаются по запросу.",
      en: "Historical price reference: 20,987 UAH; current availability and price are confirmed by request.",
    },
    materials: {
      uk: ["Намистини", "Паєтки", "Наявність за запитом"],
      ru: ["Бусины", "Пайетки", "Наличие по запросу"],
      en: ["Beading", "Sequins", "Availability by request"],
    },
    mediaIds: ["generated-atelier-detail", "editorial-collections-flatlay"],
    seo: {
      uk: {
        title: "Сукня з намистинами й паєтками | PURITY",
        description: "Вечірня сукня з намистинами й паєтками у двох кольорах.",
      },
      ru: {
        title: "Платье с бусинами и пайетками | PURITY",
        description: "Вечернее платье с бусинами и пайетками в двух цветах.",
      },
      en: {
        title: "Beaded and Sequined Dress | PURITY",
        description:
          "An evening dress in two colorways with beading and sequins.",
      },
    },
  },
] satisfies Collection[]

export const portfolioCases = [
  {
    slug: "portfolio-placeholder",
    routeSegment: "portfolio-placeholder",
    visibleInMvp: false,
    title: {
      uk: "Майбутній кейс портфоліо",
      ru: "Будущий кейс портфолио",
      en: "Future Portfolio Case",
    },
    summary: {
      uk: "Внутрішній плейсхолдер до появи реальних клієнтських матеріалів.",
      ru: "Внутренний плейсхолдер до появления реальных клиентских материалов.",
      en: "An internal placeholder until real client material exists.",
    },
    mediaIds: ["editorial-portfolio-process"],
    isRealClientProof: false,
    seo: {
      uk: {
        title: "Майбутній кейс портфоліо | PURITY",
        description: "Плейсхолдер, який не публікується як реальний доказ.",
      },
      ru: {
        title: "Будущий кейс портфолио | PURITY",
        description:
          "Плейсхолдер, который не публикуется как реальное доказательство.",
      },
      en: {
        title: "Future Portfolio Case | PURITY",
        description: "A placeholder that is not published as real proof.",
      },
    },
  },
] satisfies PortfolioCase[]

export const publicPages = [
  {
    slug: "studio",
    routeSegment: "studio",
    sourceUrl: "http://purity-fashion.com/kontseptsiya-purity/",
    sourceLabel: "Old PURITY concept, studio, and team pages",
    eyebrow: {
      uk: "PURITY Studio",
      ru: "PURITY Studio",
      en: "PURITY Studio",
    },
    title: {
      uk: "Студія, що починає з форми, а не з тренду.",
      ru: "Студия, которая начинает с формы, а не с тренда.",
      en: "A studio that starts with form, not trend.",
    },
    summary: {
      uk: "PURITY збирає стиліста, шопінг, ательє та шоурум в одному місці, щоб рішення для гардероба були ефективними.",
      ru: "PURITY собирает стилиста, шопинг, ателье и шоурум в одном месте, чтобы решения для гардероба были эффективными.",
      en: "PURITY brings stylist, shopping, atelier, and showroom tools into one place for effective wardrobe decisions.",
    },
    body: {
      uk: [
        "PURITY працює як команда стилістів, закрійників, кравців і майстрів аксесуарів, що вирішують практичний запит «що вдягти».",
        "У студії зібрані майстерня-ательє, шоурум з одягом, тканинами й аксесуарами, клієнтська зона та простір для консультацій.",
        "Метод починається з дослідження форми, гардероба, ролі людини або команди, а переходить у лукбук, примірку, ательє чи навчальний формат.",
        "Для приватних клієнтів це система речей і рішень; для корпоративних клієнтів — форма, дрес-код і видимість бренду через співробітників.",
      ],
      ru: [
        "PURITY работает как команда стилистов, закройщиков, портных и мастеров аксессуаров, которые решают практический запрос «что надеть».",
        "В студии собраны мастерская-ателье, шоурум с одеждой, тканями и аксессуарами, клиентская зона и пространство для консультаций.",
        "Метод начинается с исследования формы, гардероба, роли человека или команды, а переходит в лукбук, примерку, ателье или образовательный формат.",
        "Для частных клиентов это система вещей и решений; для корпоративных клиентов — форма, дресс-код и видимость бренда через сотрудников.",
      ],
      en: [
        "PURITY works as a team of stylists, cutters, tailors, and accessory makers solving the practical question of what to wear.",
        "The studio combines an atelier, a showroom with clothing, fabrics and accessories, a client area, and consultation space.",
        "The method starts with form, wardrobe, and the role of a person or team, then moves into a lookbook, fitting, atelier, or learning format.",
        "For private clients it creates a system of pieces and decisions; for corporate clients it creates uniform, dress code, and brand visibility through employees.",
      ],
    },
    mediaIds: ["editorial-studio-method"],
    cta: {
      label: {
        uk: "Почати з консультації",
        ru: "Начать с консультации",
        en: "Start with a consultation",
      },
      path: "/booking",
    },
    seo: {
      uk: {
        title: "Студія | PURITY",
        description: "Про PURITY Studio, методологію та структурний підхід.",
      },
      ru: {
        title: "Студия | PURITY",
        description: "О PURITY Studio, методологии и структурном подходе.",
      },
      en: {
        title: "Studio | PURITY",
        description:
          "About PURITY Studio, its method, and structural approach.",
      },
    },
  },
  {
    slug: "booking",
    routeSegment: "booking",
    sourceUrl: "http://purity-fashion.com/kontakty/",
    sourceLabel: "Old PURITY contacts page",
    eyebrow: {
      uk: "Запис",
      ru: "Запись",
      en: "Booking",
    },
    title: {
      uk: "Почніть із короткого запиту.",
      ru: "Начните с короткого запроса.",
      en: "Begin with a short request.",
    },
    summary: {
      uk: "Короткий запит допомагає визначити напрям, формат і мову першої консультації.",
      ru: "Короткий запрос помогает определить направление, формат и язык первой консультации.",
      en: "A short request helps define the direction, format, and language of the first consultation.",
    },
    body: {
      uk: [
        "Оберіть напрям, опишіть поточний запит і вкажіть бажаний формат: студія, онлайн або ательє.",
        "Після уточнення каналу звʼязку команда підтвердить наступний крок.",
      ],
      ru: [
        "Выберите направление, опишите текущий запрос и укажите желаемый формат: студия, онлайн или ателье.",
        "После уточнения канала связи команда подтвердит следующий шаг.",
      ],
      en: [
        "Choose the direction, describe the current request, and note the preferred format: studio, online, or atelier.",
        "After the contact channel is confirmed, the team will confirm the next step.",
      ],
    },
    mediaIds: ["editorial-booking-consultation"],
    cta: {
      label: {
        uk: "Перейти до контактів",
        ru: "Перейти к контактам",
        en: "Go to contacts",
      },
      path: "/contacts",
    },
    seo: {
      uk: {
        title: "Запис | PURITY",
        description: "Вхідна сторінка для консультації PURITY.",
      },
      ru: {
        title: "Запись | PURITY",
        description: "Входная страница для консультации PURITY.",
      },
      en: {
        title: "Booking | PURITY",
        description: "The entry page for a PURITY consultation.",
      },
    },
  },
  {
    slug: "privacy",
    routeSegment: "privacy",
    eyebrow: {
      uk: "Правова інформація",
      ru: "Правовая информация",
      en: "Legal",
    },
    title: {
      uk: "Повідомлення про приватність",
      ru: "Уведомление о приватности",
      en: "Privacy notice",
    },
    summary: {
      uk: "PURITY обробляє контактні дані лише для відповіді на запит і підготовки консультації.",
      ru: "PURITY обрабатывает контактные данные только для ответа на запрос и подготовки консультации.",
      en: "PURITY processes contact details only to answer a request and prepare a consultation.",
    },
    body: {
      uk: [
        "Поточна версія сайта не збирає платіжні дані та не має власного облікового запису клієнта.",
        "Контактні дані будуть оброблятися лише для відповіді на запит.",
      ],
      ru: [
        "Текущая версия сайта не собирает платёжные данные и не имеет клиентского аккаунта.",
        "Контактные данные будут обрабатываться только для ответа на запрос.",
      ],
      en: [
        "The current site does not collect payment data and does not include a client account.",
        "Contact details will be processed only to respond to the request.",
      ],
    },
    cta: {
      label: {
        uk: "Перейти до контактів",
        ru: "Перейти к контактам",
        en: "Go to contacts",
      },
      path: "/contacts",
    },
    seo: {
      uk: {
        title: "Повідомлення про приватність | PURITY",
        description: "Коротке повідомлення про приватність для сайта PURITY.",
      },
      ru: {
        title: "Уведомление о приватности | PURITY",
        description: "Краткое сообщение о приватности для сайта PURITY.",
      },
      en: {
        title: "Privacy notice | PURITY",
        description: "A short privacy notice for the PURITY website.",
      },
    },
  },
  {
    slug: "terms",
    routeSegment: "terms",
    eyebrow: {
      uk: "Правова інформація",
      ru: "Правовая информация",
      en: "Legal",
    },
    title: {
      uk: "Повідомлення про умови",
      ru: "Уведомление об условиях",
      en: "Terms notice",
    },
    summary: {
      uk: "Індивідуальні послуги починаються після узгодження формату, обсягу, строків і вартості.",
      ru: "Индивидуальные услуги начинаются после согласования формата, объёма, сроков и стоимости.",
      en: "Individual services begin after format, scope, timing, and pricing are agreed.",
    },
    body: {
      uk: [
        "Описи послуг мають інформаційний характер до підтвердження фінальних комерційних умов.",
        "Індивідуальна робота починається лише після узгодження формату, обсягу й таймінгу.",
      ],
      ru: [
        "Описания услуг носят информационный характер до подтверждения финальных коммерческих условий.",
        "Индивидуальная работа начинается только после согласования формата, объёма и сроков.",
      ],
      en: [
        "Service descriptions are informational until final commercial terms are confirmed.",
        "Individual work begins only after format, scope, and timing are agreed.",
      ],
    },
    cta: {
      label: {
        uk: "Перейти до запису",
        ru: "Перейти к записи",
        en: "Go to booking",
      },
      path: "/booking",
    },
    seo: {
      uk: {
        title: "Повідомлення про умови | PURITY",
        description: "Коротке повідомлення про умови для сайта PURITY.",
      },
      ru: {
        title: "Уведомление об условиях | PURITY",
        description: "Краткое сообщение об условиях для сайта PURITY.",
      },
      en: {
        title: "Terms notice | PURITY",
        description: "A short terms notice for the PURITY website.",
      },
    },
  },
] satisfies PublicPage[]

export const navigation = [
  {
    id: "home",
    path: "/",
    visibleInMvp: true,
    label: {
      uk: "Головна",
      ru: "Главная",
      en: "Home",
    },
  },
  {
    id: "research",
    path: "/stylist",
    visibleInMvp: true,
    label: {
      uk: "Стиліст",
      ru: "Стилист",
      en: "Stylist",
    },
  },
  {
    id: "realisation",
    path: "/shopping",
    visibleInMvp: true,
    label: {
      uk: "Шопінг",
      ru: "Шопинг",
      en: "Shopping",
    },
  },
  {
    id: "atelier",
    path: "/atelier",
    visibleInMvp: true,
    label: {
      uk: "Ательє",
      ru: "Ателье",
      en: "Atelier",
    },
  },
  {
    id: "transformation",
    path: "/wardrobe",
    visibleInMvp: true,
    label: {
      uk: "Гардероб",
      ru: "Гардероб",
      en: "Wardrobe",
    },
  },
  {
    id: "corporate",
    path: "/corporate",
    visibleInMvp: true,
    label: {
      uk: "Корпоратив",
      ru: "Корпоратив",
      en: "Corporate",
    },
  },
  {
    id: "school",
    path: "/school",
    visibleInMvp: true,
    label: {
      uk: "Школа",
      ru: "Школа",
      en: "School",
    },
  },
  {
    id: "collections",
    path: "/collections",
    visibleInMvp: true,
    label: {
      uk: "Колекції",
      ru: "Коллекции",
      en: "Collections",
    },
  },
  {
    id: "portfolio",
    path: "/portfolio",
    visibleInMvp: false,
    label: {
      uk: "Портфоліо",
      ru: "Портфолио",
      en: "Portfolio",
    },
  },
  {
    id: "contacts",
    path: "/contacts",
    visibleInMvp: true,
    label: {
      uk: "Контакти",
      ru: "Контакты",
      en: "Contacts",
    },
  },
  {
    id: "studio",
    path: "/studio",
    visibleInMvp: true,
    label: {
      uk: "Студія",
      ru: "Студия",
      en: "Studio",
    },
  },
  {
    id: "booking",
    path: "/booking",
    visibleInMvp: true,
    label: {
      uk: "Запис",
      ru: "Запись",
      en: "Booking",
    },
  },
  {
    id: "privacy",
    path: "/privacy",
    visibleInMvp: true,
    label: {
      uk: "Приватність",
      ru: "Приватность",
      en: "Privacy",
    },
  },
  {
    id: "terms",
    path: "/terms",
    visibleInMvp: true,
    label: {
      uk: "Умови",
      ru: "Условия",
      en: "Terms",
    },
  },
] satisfies NavigationItem[]

export const siteSettings = {
  brandName: "PURITY",
  languageLabel: {
    uk: "Мова",
    ru: "Язык",
    en: "Language",
  },
  closeLabel: {
    uk: "Закрити",
    ru: "Закрыть",
    en: "Close",
  },
  externalLinkLabel: {
    uk: "Відкривається в новій вкладці",
    ru: "Открывается в новой вкладке",
    en: "Opens in a new tab",
  },
  home: {
    eyebrow: {
      uk: "Дослідити. Уявити. Створити.",
      ru: "Исследовать. Вообразить. Создать.",
      en: "Research. Imagine. Create.",
    },
    title: {
      uk: "Гардероб, зібраний як система.",
      ru: "Гардероб, собранный как система.",
      en: "A wardrobe built as a system.",
    },
    summary: {
      uk: "PURITY допомагає одягатися красиво й грамотно через стиліста, шопінг сервіс, майстерню-ательє та авторські речі.",
      ru: "PURITY помогает одеваться красиво и грамотно через стилиста, шопинг сервис, мастерскую-ателье и авторские вещи.",
      en: "PURITY helps clients dress beautifully and thoughtfully through styling, shopping service, atelier work, and authored pieces.",
    },
    primaryCta: {
      label: {
        uk: "Записатися",
        ru: "Записаться",
        en: "Book",
      },
      path: "/booking",
    },
    secondaryCta: {
      label: {
        uk: "Дивитися напрями",
        ru: "Смотреть направления",
        en: "View directions",
      },
      path: "/stylist",
    },
    studioEyebrow: {
      uk: "Студія",
      ru: "Студия",
      en: "Studio",
    },
    studioTitle: {
      uk: "Студійний підхід до гардероба.",
      ru: "Студийный подход к гардеробу.",
      en: "A studio approach to the wardrobe.",
    },
    studioSummary: {
      uk: "PURITY поєднує стиліста, шопінг, ательє й шоурум в одному процесі, щоб рішення були точними, швидкими й придатними до реального гардероба.",
      ru: "PURITY соединяет стилиста, шопинг, ателье и шоурум в одном процессе, чтобы решения были точными, быстрыми и пригодными для реального гардероба.",
      en: "PURITY connects styling, shopping, atelier, and showroom work in one process so decisions stay precise, fast, and useful in a real wardrobe.",
    },
    serviceRailTitle: {
      uk: "Напрями",
      ru: "Направления",
      en: "Directions",
    },
    collectionRailTitle: {
      uk: "Колекції та навчання",
      ru: "Коллекции и обучение",
      en: "Collections and learning",
    },
    portfolioNote: {
      uk: "Клієнтські кейси публікуються лише після погодження матеріалів; редакційні зображення не видаються за доказ роботи.",
      ru: "Клиентские кейсы публикуются только после согласования материалов; редакционные изображения не выдаются за доказ работы.",
      en: "Client cases are published only after material approval; editorial images are never presented as proof of work.",
    },
  },
  defaultOgImageId: "logo-og",
  primaryNavigation: [
    "research",
    "realisation",
    "atelier",
    "transformation",
    "corporate",
    "school",
    "collections",
    "studio",
    "booking",
  ],
  footerNavigation: ["portfolio", "contacts", "privacy", "terms"],
  seo: {
    uk: {
      title: "PURITY Fashion Studio",
      description: "Преміальна мультимовна основа для модної студії PURITY.",
    },
    ru: {
      title: "PURITY Fashion Studio",
      description: "Премиальная мультиязычная основа для модной студии PURITY.",
    },
    en: {
      title: "PURITY Fashion Studio",
      description: "Premium multilingual foundation for PURITY fashion studio.",
    },
  },
  contacts: {
    city: {
      uk: "Київ",
      ru: "Киев",
      en: "Kyiv",
    },
    address: {
      uk: "03150, Київ, вул. Предславинська 44, офіс 1, поверх 2 (ЖК Французький квартал 2)",
      ru: "Киев 03150, ул. Предславинская 44, офис 1, этаж 2 (ЖК Французский квартал 2)",
      en: "Kyiv 03150, Predslavynska 44, office 1, floor 2, French Quarter 2",
    },
    hours: {
      uk: "Щодня 11:00-20:00",
      ru: "Каждый день 11:00-20:00",
      en: "Daily 11:00-20:00",
    },
    responseTime: {
      uk: "Адміністратор, стиліст, email і соціальні канали для швидкого першого контакту.",
      ru: "Администратор, стилист, email и социальные каналы для быстрого первого контакта.",
      en: "Administrator, stylist, email, and social channels for a fast first contact.",
    },
    actionLabel: {
      uk: "Перейти до запису",
      ru: "Перейти к записи",
      en: "Go to booking",
    },
    actionPath: "/booking",
    email: "voronina@purity-fashion.com",
    phone: "+38 067 656 19 12",
    phones: ["+38 066 00 44 066", "+38 067 656 19 12"],
    viberUrl: "viber://chat?number=%2B380676561912",
    socials: [
      {
        label: "Instagram",
        url: "https://www.instagram.com/purity_fashion_studio/",
      },
      {
        label: "Facebook",
        url: "https://www.facebook.com/PURITY-Fashion-Studio-370149113069285/?fref=ts",
      },
      {
        label: "YouTube",
        url: "https://www.youtube.com/channel/UCVTLImOTCrlad07TufNaJYw",
      },
      {
        label: "Pinterest",
        url: "https://www.pinterest.com/purityfashionst/",
      },
    ],
    sourceUrl: "http://purity-fashion.com/kontakty/",
    sourceLabel: "Old PURITY contacts page",
  },
} satisfies SiteSettings
