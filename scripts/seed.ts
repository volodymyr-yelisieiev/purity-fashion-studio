import { getPayload } from "payload";
import config from "../payload.config";

interface LocalizedString {
  en: string;
  uk: string;
  ru: string;
}

interface ServiceStep {
  title: LocalizedString;
  description: LocalizedString;
}

interface ServiceData {
  title: LocalizedString;
  description: LocalizedString;
  excerpt: LocalizedString;
  status: "draft" | "published";
  category:
    | "research"
    | "realisation"
    | "transformation"
    | "styling"
    | "atelier"
    | "consulting"
    | "shopping"
    | "events";
  format?: "online" | "studio" | "onsite" | "hybrid";
  pricing?: {
    eur?: number;
    uah?: number;
  };
  duration?: string;
  bookable?: boolean;
  paymentEnabled?: boolean;
  featured?: boolean;
  steps?: ServiceStep[];
  includes?: LocalizedString[];
}

interface PortfolioData {
  title: LocalizedString;
  description?: LocalizedString;
  challenge: LocalizedString;
  solution: LocalizedString;
  result: LocalizedString;
  category: "styling" | "wardrobe-audit" | "event" | "shopping" | "editorial";
  status: "draft" | "published";
  pricing?: {
    eur?: number;
    uah?: number;
  };
  bookable?: boolean;
  paymentEnabled?: boolean;
  featured?: boolean;
}

interface ProductData {
  name: LocalizedString;
  excerpt: LocalizedString;
  description: LocalizedString;
  category:
    | "dresses"
    | "tops"
    | "bottoms"
    | "outerwear"
    | "accessories"
    | "bags"
    | "jewelry";
  status: "draft" | "published" | "out-of-stock" | "archived";
  sku?: string;
  featured?: boolean;
  pricing: {
    eur: number;
    uah: number;
  };
}

interface CollectionData {
  name: LocalizedString;
  description: LocalizedString;
  materials?: LocalizedString;
  careInstructions?: LocalizedString;
  sizes?: LocalizedString;
  season: "spring" | "summer" | "autumn" | "winter" | "all-season";
  status: "draft" | "published";
  pricing: {
    eur: number;
    uah: number;
  };
  featured?: boolean;
  bookable?: boolean;
  paymentEnabled?: boolean;
  releaseDate?: string;
}

interface CourseCurriculum {
  module: LocalizedString;
  topics: LocalizedString[];
}

interface CourseTestimonial {
  name: string;
  quote: LocalizedString;
}

interface CourseInstructor {
  name: string;
  title: LocalizedString;
  bio: LocalizedString;
}

interface CourseFAQ {
  question: LocalizedString;
  answer: LocalizedString;
}

interface CourseUpcomingDate {
  startDate: string;
  endDate?: string;
  spotsAvailable?: number;
}

interface CourseData {
  title: LocalizedString;
  excerpt: LocalizedString;
  description: LocalizedString;
  prerequisites?: LocalizedString;
  materials?: LocalizedString;
  instructor: CourseInstructor;
  category:
    | "personal-styling"
    | "color-analysis"
    | "wardrobe-audit"
    | "shopping"
    | "professional"
    | "masterclass";
  level: "beginner" | "intermediate" | "advanced" | "all";
  status: "draft" | "published" | "coming-soon" | "archived";
  duration: {
    value: number;
    unit: "hours" | "days" | "weeks" | "months";
  };
  format: "online" | "in-person" | "hybrid";
  pricing: {
    eur: number;
    uah: number;
    earlyBirdAmount?: number;
  };
  bookable?: boolean;
  paymentEnabled?: boolean;
  featured?: boolean;
  curriculum: CourseCurriculum[];
  testimonials?: CourseTestimonial[];
  faq?: CourseFAQ[];
  upcomingDates?: CourseUpcomingDate[];
}

const seed = async () => {
  console.log("Starting seed...");
  const payload = await getPayload({ config });

  console.log("Cleaning up database...");
  // Delete all documents from collections to ensure a clean seed
  // Order matters due to foreign key constraints
  const collectionsToClean = [
    "portfolio",
    "products",
    "lookbooks",
    "courses",
    "services",
    "media",
  ] as const;
  for (const collection of collectionsToClean) {
    const docs = await payload.find({
      collection,
      limit: 1000,
    });
    await Promise.all(
      docs.docs.map((doc) => payload.delete({ collection, id: doc.id }))
    );
  }

  // 1. Create Admin User
  console.log("Checking for admin user...");
  const existingUsers = await payload.find({
    collection: "users",
    where: {
      email: {
        equals: "admin@purity.com",
      },
    },
  });

  if (existingUsers.totalDocs > 0) {
    console.log("Admin user already exists, skipping creation.");
  } else {
    console.log("Creating admin user...");
    await payload.create({
      collection: "users",
      data: {
        email: "admin@purity.com",
        password: "password123",
        firstName: "Admin",
        lastName: "User",
        role: "admin",
      },
    });
  }

  // 2. Create Media
  console.log("Creating media...");
  const placeholderImageUrl =
    "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=2070&auto=format&fit=crop";
  const response = await fetch(placeholderImageUrl);
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const media = await payload.create({
    collection: "media",
    locale: "uk",
    data: {
      alt: "Плейсхолдер",
    },
    file: {
      data: buffer,
      name: "placeholder.jpg",
      mimetype: "image/jpeg",
      size: buffer.length,
    },
  });

  await payload.update({
    collection: "media",
    id: media.id,
    locale: "en",
    data: {
      alt: "Placeholder",
    },
  });

  await payload.update({
    collection: "media",
    id: media.id,
    locale: "ru",
    data: {
      alt: "Плейсхолдер",
    },
  });

  // 3. Create Services
  console.log("Creating services...");

  const createService = async (data: ServiceData) => {
    const { title, description, excerpt, steps, includes, ...rest } = data;

    const doc = await payload.create({
      collection: "services",
      locale: "uk",
      data: {
        ...rest,
        title: title.uk,
        description: description.uk,
        excerpt: excerpt.uk,
        heroImage: media.id,
        steps: steps?.map((s) => ({
          title: s.title.uk,
          description: s.description.uk,
        })),
        includes: includes?.map((i) => ({
          item: i.uk,
        })),
      },
    } as any); // eslint-disable-line @typescript-eslint/no-explicit-any

    await payload.update({
      collection: "services",
      id: doc.id,
      locale: "en",
      data: {
        title: title.en,
        description: description.en,
        excerpt: excerpt.en,
        steps: steps?.map((s) => ({
          title: s.title.en,
          description: s.description.en,
        })),
        includes: includes?.map((i) => ({
          item: i.en,
        })),
      },
    });

    await payload.update({
      collection: "services",
      id: doc.id,
      locale: "ru",
      data: {
        title: title.ru,
        description: description.ru,
        excerpt: excerpt.ru,
        steps: steps?.map((s) => ({
          title: s.title.ru,
          description: s.description.ru,
        })),
        includes: includes?.map((i) => ({
          item: i.ru,
        })),
      },
    });

    return doc;
  };

  await createService({
    title: {
      en: "Personal Lookbook",
      uk: "Персональний лукбук",
      ru: "Персональный лукбук",
    },
    status: "published",
    category: "research",
    excerpt: {
      en: "A curated collection of looks tailored to your unique style.",
      uk: "Курована колекція образів, адаптована до вашого унікального стилю.",
      ru: "Курируемая коллекция образов, адаптированная к вашему уникальному стилю.",
    },
    description: {
      en: "We create a comprehensive digital lookbook with 20+ outfits for various occasions. This service includes a deep analysis of your lifestyle, body type, and color palette to ensure every recommendation is perfectly suited to you.",
      uk: "Ми створюємо вичерпний цифровий лукбук з 20+ образами для різних подій. Ця послуга включає глибокий аналіз вашого способу життя, типу фігури та кольорової палітри, щоб кожна рекомендація ідеально вам підходила.",
      ru: "Мы создаем исчерпывающий цифровой лукбук с 20+ образами для различных событий. Эта услуга включает глубокий анализ вашего образа жизни, типа фигуры и цветовой палитры, чтобы каждая рекомендация идеально вам подходила.",
    },
    pricing: {
      uah: 5000,
      eur: 120,
    },
    duration: "3-5 days",
    steps: [
      {
        title: {
          en: "Initial Consultation",
          uk: "Початкова консультація",
          ru: "Начальная консультация",
        },
        description: {
          en: "We discuss your style goals, lifestyle needs, and preferences.",
          uk: "Ми обговорюємо ваші цілі стилю, потреби способу життя та вподобання.",
          ru: "Мы обсуждаем ваши цели стиля, потребности образа жизни и предпочтения.",
        },
      },
      {
        title: { en: "Style Analysis", uk: "Аналіз стилю", ru: "Анализ стиля" },
        description: {
          en: "Detailed analysis of your body type, color type, and personality.",
          uk: "Детальний аналіз вашого типу фігури, кольоротипу та особистості.",
          ru: "Детальный анализ вашего типа фигуры, цветотипа и личности.",
        },
      },
      {
        title: {
          en: "Concept Development",
          uk: "Розробка концепції",
          ru: "Разработка концепции",
        },
        description: {
          en: "Creating a visual moodboard for your new style direction.",
          uk: "Створення візуального мудборду для вашого нового напрямку стилю.",
          ru: "Создание визуального мудборда для вашего нового направления стиля.",
        },
      },
      {
        title: {
          en: "Outfit Curation",
          uk: "Кураторство образів",
          ru: "Кураторство образов",
        },
        description: {
          en: "Selecting specific items and assembling complete looks.",
          uk: "Вибір конкретних речей та складання повних образів.",
          ru: "Выбор конкретных вещей и составление полных образов.",
        },
      },
      {
        title: {
          en: "Final Delivery",
          uk: "Фінальна доставка",
          ru: "Финальная доставка",
        },
        description: {
          en: "Receiving your digital lookbook with shopping links.",
          uk: "Отримання вашого цифрового лукбука з посиланнями на покупки.",
          ru: "Получение вашего цифрового лукбука со ссылками на покупки.",
        },
      },
    ],
    includes: [
      {
        en: "20+ curated outfits for all occasions",
        uk: "20+ підібраних образів для всіх подій",
        ru: "20+ подобранных образов для всех событий",
      },
      {
        en: "Direct shopping links to all items",
        uk: "Прямі посилання на всі речі",
        ru: "Прямые ссылки на все вещи",
      },
      {
        en: "Body type & color palette guide",
        uk: "Гід по типу фігури та кольоровій палітрі",
        ru: "Гид по типу фигуры и цветовой палитре",
      },
      {
        en: "Style moodboard & inspiration",
        uk: "Мудборд стилю та натхнення",
        ru: "Мудборд стиля и вдохновение",
      },
      {
        en: "1-week style support via chat",
        uk: "1 тиждень підтримки стилю через чат",
        ru: "1 неделя поддержки стиля через чат",
      },
    ],
    featured: true,
    bookable: true,
  });

  await createService({
    title: {
      en: "Wardrobe Audit",
      uk: "Аудит гардеробу",
      ru: "Аудит гардероба",
    },
    status: "published",
    category: "research",
    excerpt: {
      en: "Optimize your closet and discover new combinations.",
      uk: "Оптимізуйте свою шафу та відкрийте нові комбінації.",
      ru: "Оптимизируйте свой шкаф и откройте новые комбинации.",
    },
    description: {
      en: "A deep dive into your current wardrobe to identify what works, what is missing, and how to style existing pieces in fresh ways. We will declutter and organize your space for maximum efficiency.",
      uk: "Глибоке занурення у ваш поточний гардероб, щоб визначити, що працює, чого не вистачає і як стилізувати існуючі речі по-новому. Ми розчистимо та організуємо ваш простір для максимальної ефективності.",
      ru: "Глубокое погружение в ваш текущий гардероб, чтобы определить, что работает, чего не хватает и как стилизовать существующие вещи по-новому. Мы расчистим и организуем ваше пространство для максимальной эффективности.",
    },
    pricing: {
      uah: 4000,
      eur: 100,
    },
    duration: "4 hours",
    steps: [
      {
        title: {
          en: "Wardrobe Review",
          uk: "Огляд гардеробу",
          ru: "Обзор гардероба",
        },
        description: {
          en: "Going through every item to assess fit, condition, and style.",
          uk: "Перегляд кожної речі для оцінки посадки, стану та стилю.",
          ru: "Просмотр каждой вещи для оценки посадки, состояния и стиля.",
        },
      },
      {
        title: {
          en: "Sorting & Decluttering",
          uk: "Сортування та розчищення",
          ru: "Сортировка и расчистка",
        },
        description: {
          en: "Deciding what to keep, tailor, donate, or discard.",
          uk: "Вирішення, що залишити, перешити, віддати або викинути.",
          ru: "Решение, что оставить, перешить, отдать или выбросить.",
        },
      },
      {
        title: {
          en: "New Combinations",
          uk: "Нові комбінації",
          ru: "Новые комбинации",
        },
        description: {
          en: "Creating fresh outfits from your existing clothes.",
          uk: "Створення нових образів з вашого існуючого одягу.",
          ru: "Создание новых образов из вашей существующей одежды.",
        },
      },
      {
        title: {
          en: "Shopping List",
          uk: "Список покупок",
          ru: "Список покупок",
        },
        description: {
          en: "Identifying key pieces missing from your wardrobe.",
          uk: "Визначення ключових речей, яких не вистачає у вашому гардеробі.",
          ru: "Определение ключевых вещей, которых не хватает в вашем гардеробе.",
        },
      },
      {
        title: { en: "Organization", uk: "Організація", ru: "Организация" },
        description: {
          en: "Arranging your closet for easy daily use.",
          uk: "Впорядкування вашої шафи для зручного щоденного використання.",
          ru: "Упорядочивание вашего шкафа для удобного ежедневного использования.",
        },
      },
    ],
    includes: [
      {
        en: "Full wardrobe organization",
        uk: "Повна організація гардеробу",
        ru: "Полная организация гардероба",
      },
      {
        en: "Digital photos of new outfits",
        uk: "Цифрові фото нових образів",
        ru: "Цифровые фото новых образов",
      },
      {
        en: "Personalized shopping list",
        uk: "Персоналізований список покупок",
        ru: "Персонализированный список покупок",
      },
      {
        en: "Tailoring recommendations",
        uk: "Рекомендації щодо перешиття",
        ru: "Рекомендации по перешиву",
      },
      {
        en: "Storage solution tips",
        uk: "Поради щодо зберігання",
        ru: "Советы по хранению",
      },
    ],
    featured: false,
    bookable: true,
  });

  await createService({
    title: {
      en: "Shopping Service",
      uk: "Шопінг-супровід",
      ru: "Шопинг-сопровождение",
    },
    status: "published",
    category: "realisation",
    excerpt: {
      en: "Efficient and targeted shopping with a professional.",
      uk: "Ефективний та цілеспрямований шопінг з професіоналом.",
      ru: "Эффективный и целенаправленный шопинг с профессионалом.",
    },
    description: {
      en: "Save time and money by shopping with a professional. We pre-select items based on your needs and budget, ensuring a stress-free and successful shopping experience.",
      uk: "Заощаджуйте час та гроші, купуючи з професіоналом. Ми заздалегідь відбираємо речі на основі ваших потреб та бюджету, забезпечуючи успішний шопінг без стресу.",
      ru: "Экономьте время и деньги, покупая с профессионалом. Мы заранее отбираем вещи на основе ваших потребностей и бюджета, обеспечивая успешный шопинг без стресса.",
    },
    pricing: {
      uah: 6000,
      eur: 150,
    },
    duration: "3-4 hours",
    steps: [
      {
        title: {
          en: "Pre-selection",
          uk: "Попередній відбір",
          ru: "Предварительный отбор",
        },
        description: {
          en: "I visit stores beforehand to find the best pieces.",
          uk: "Я відвідую магазини заздалегідь, щоб знайти найкращі речі.",
          ru: "Я посещаю магазины заранее, чтобы найти лучшие вещи.",
        },
      },
      {
        title: {
          en: "Fitting Session",
          uk: "Сесія примірки",
          ru: "Сессия примерки",
        },
        description: {
          en: "We meet and try on the pre-selected items.",
          uk: "Ми зустрічаємося і приміряємо заздалегідь відібрані речі.",
          ru: "Мы встречаемся и примеряем заранее отобранные вещи.",
        },
      },
      {
        title: {
          en: "Style Coaching",
          uk: "Стиль-коучинг",
          ru: "Стиль-коучинг",
        },
        description: {
          en: "Learning how to choose quality and fit.",
          uk: "Навчання тому, як обирати якість та посадку.",
          ru: "Обучение тому, как выбирать качество и посадку.",
        },
      },
    ],
    includes: [
      {
        en: "Pre-selected items in stores",
        uk: "Заздалегідь відібрані речі в магазинах",
        ru: "Заранее отобранные вещи в магазинах",
      },
      {
        en: "Route planning",
        uk: "Планування маршруту",
        ru: "Планирование маршрута",
      },
      {
        en: "Budget management",
        uk: "Управління бюджетом",
        ru: "Управление бюджетом",
      },
      {
        en: "Post-shopping outfit guide",
        uk: "Гід по образах після шопінгу",
        ru: "Гид по образам после шопинга",
      },
    ],
    featured: true,
    bookable: true,
  });

  await createService({
    title: {
      en: "Atelier Service",
      uk: "Послуги ательє",
      ru: "Услуги ателье",
    },
    status: "published",
    category: "realisation",
    excerpt: {
      en: "Bespoke tailoring and custom design. Dossier (personal mannequin) required.",
      uk: "Індивідуальне пошиття та авторський дизайн. Потрібне Досьє (персональний манекен).",
      ru: "Индивидуальный пошив и авторский дизайн. Требуется Досье (персональный манекен).",
    },
    description: {
      en: "Experience the luxury of custom-made clothing. From the initial sketch to the final fitting, we create unique pieces that fit you perfectly. Note: A personal mannequin (Dossier) is a required first step for all bespoke garments.",
      uk: "Відчуйте розкіш одягу, виготовленого на замовлення. Від початкового ескізу до фінальної примірки ми створюємо унікальні речі, які ідеально вам пасують. Примітка: Персональний манекен (Досьє) є обов'язковим першим кроком для всіх виробів на замовлення.",
      ru: "Почувствуйте роскошь одежды, изготовленной на заказ. От начального эскиза до финальной примерки мы создаем уникальные вещи, которые идеально вам подходят. Примечание: Персональный манекен (Досье) является обязательным первым шагом для всех изделий на заказ.",
    },
    pricing: {
      uah: 20000,
      eur: 500,
    },
    duration: "2-4 weeks",
    steps: [
      {
        title: {
          en: "Dossier Creation",
          uk: "Створення Досьє",
          ru: "Создание Досье",
        },
        description: {
          en: "Creating your personal mannequin for perfect fit.",
          uk: "Створення вашого персонального манекена для ідеальної посадки.",
          ru: "Создание вашего персонального манекена для идеальной посадки.",
        },
      },
      {
        title: {
          en: "Design Consultation",
          uk: "Консультація з дизайну",
          ru: "Консультация по дизайну",
        },
        description: {
          en: "Discussing the concept, fabric selection, and sketches.",
          uk: "Обговорення концепції, вибір тканини та ескізи.",
          ru: "Обсуждение концепции, выбор ткани и эскизы.",
        },
      },
      {
        title: { en: "Fittings", uk: "Примірки", ru: "Примерки" },
        description: {
          en: "Multiple fitting sessions to refine the garment.",
          uk: "Кілька сесій примірки для вдосконалення виробу.",
          ru: "Несколько сессий примерки для совершенствования изделия.",
        },
      },
    ],
    includes: [
      {
        en: "Personal mannequin (Dossier)",
        uk: "Персональний манекен (Досьє)",
        ru: "Персональный манекен (Досье)",
      },
      { en: "Dress: €500-700", uk: "Сукня: €500-700", ru: "Платье: €500-700" },
      { en: "Jacket: €600-800", uk: "Жакет: €600-800", ru: "Жакет: €600-800" },
      {
        en: "Hourly rate: €25/hour",
        uk: "Погодинна оплата: €25/год",
        ru: "Почасовая оплата: €25/час",
      },
    ],
    featured: true,
    bookable: true,
  });

  await createService({
    title: {
      en: "Retreat",
      uk: "Ретрит",
      ru: "Ретрит",
    },
    status: "published",
    category: "transformation",
    excerpt: {
      en: "Immersive experience for deep transformation.",
      uk: "Імерсивний досвід для глибокої трансформації.",
      ru: "Иммерсивный опыт для глубокой трансформации.",
    },
    description: {
      en: "A multi-day journey focused on self-discovery, style, and inner peace. Includes workshops, meditation, and personal styling sessions in a beautiful location.",
      uk: "Багатоденна подорож, зосереджена на самопізнанні, стилі та внутрішньому спокої. Включає воркшопи, медитацію та персональні сесії стайлінгу в прекрасному місці.",
      ru: "Многодневное путешествие, сосредоточенное на самопознании, стиле и внутреннем покое. Включает воркшопы, медитацию и персональные сессии стайлинга в прекрасном месте.",
    },
    pricing: {
      uah: 40000,
      eur: 1000,
    },
    duration: "3-5 days",
    steps: [
      {
        title: {
          en: "Arrival & Opening",
          uk: "Прибуття та відкриття",
          ru: "Прибытие и открытие",
        },
        description: {
          en: "Settling in and setting intentions.",
          uk: "Поселення та встановлення намірів.",
          ru: "Поселение и установка намерений.",
        },
      },
      {
        title: {
          en: "Workshops & Practice",
          uk: "Воркшопи та практика",
          ru: "Воркшопы и практика",
        },
        description: {
          en: "Daily sessions on style and mindfulness.",
          uk: "Щоденні сесії зі стилю та усвідомленості.",
          ru: "Ежедневные сессии по стилю и осознанности.",
        },
      },
    ],
    includes: [
      {
        en: "Accommodation & Meals",
        uk: "Проживання та харчування",
        ru: "Проживание и питание",
      },
      {
        en: "All workshops and materials",
        uk: "Всі воркшопи та матеріали",
        ru: "Все воркшопы и материалы",
      },
      {
        en: "Personal styling session",
        uk: "Персональна сесія стайлінгу",
        ru: "Персональная сессия стайлинга",
      },
    ],
    featured: true,
    bookable: true,
  });

  await createService({
    title: {
      en: "Photo Meditation",
      uk: "Фото-медитація",
      ru: "Фото-медитация",
    },
    status: "published",
    category: "transformation",
    excerpt: {
      en: "A transformative photography experience.",
      uk: "Трансформаційний досвід фотографії.",
      ru: "Трансформационный опыт фотографии.",
    },
    description: {
      en: "More than just a photoshoot, this is a journey of self-discovery. We use photography as a tool to see your true self and embrace your beauty.",
      uk: 'Більше ніж просто фотосесія, це подорож до самопізнання. Ми використовуємо фотографію як інструмент, щоб побачити ваше справжнє "я" та прийняти свою красу.',
      ru: 'Больше чем просто фотосессия, это путешествие к самопознанию. Мы используем фотографию как инструмент, чтобы увидеть ваше истинное "я" и принять свою красоту.',
    },
    pricing: {
      uah: 8000,
      eur: 200,
    },
    duration: "3 hours",
    steps: [
      {
        title: { en: "Preparation", uk: "Підготовка", ru: "Подготовка" },
        description: {
          en: "Setting the intention and choosing the atmosphere.",
          uk: "Встановлення намірів та вибір атмосфери.",
          ru: "Установка намерения и выбор атмосферы.",
        },
      },
      {
        title: { en: "The Session", uk: "Сесія", ru: "Сессия" },
        description: {
          en: "A mindful photography process.",
          uk: "Усвідомлений процес фотографії.",
          ru: "Осознанный процесс фотографии.",
        },
      },
      {
        title: { en: "Reflection", uk: "Рефлексія", ru: "Рефлексия" },
        description: {
          en: "Reviewing the images and discussing the experience.",
          uk: "Перегляд зображень та обговорення досвіду.",
          ru: "Просмотр изображений и обсуждение опыта.",
        },
      },
    ],
    includes: [
      {
        en: "Professional photography",
        uk: "Професійна фотографія",
        ru: "Профессиональная фотография",
      },
      {
        en: "Style preparation",
        uk: "Підготовка стилю",
        ru: "Подготовка стиля",
      },
      {
        en: "Digital gallery of images",
        uk: "Цифрова галерея зображень",
        ru: "Цифровая галерея изображений",
      },
      {
        en: "Post-session consultation",
        uk: "Консультація після сесії",
        ru: "Консультация после сессии",
      },
    ],
    featured: true,
    bookable: true,
  });

  // 4. Create Portfolio Items
  console.log("Creating portfolio items...");

  const createPortfolio = async (data: PortfolioData) => {
    const { title, description, challenge, solution, result, ...rest } = data;

    const doc = await payload.create({
      collection: "portfolio",
      locale: "uk",
      data: {
        ...rest,
        title: title.uk,
        description: description?.uk || "",
        challenge: challenge.uk,
        solution: solution.uk,
        result: result.uk,
        mainImage: media.id,
      },
    } as any); // eslint-disable-line @typescript-eslint/no-explicit-any

    await payload.update({
      collection: "portfolio",
      id: doc.id,
      locale: "en",
      data: {
        title: title.en,
        description: description?.en || "",
        challenge: challenge.en,
        solution: solution.en,
        result: result.en,
      },
    });

    await payload.update({
      collection: "portfolio",
      id: doc.id,
      locale: "ru",
      data: {
        title: title.ru,
        description: description?.ru || "",
        challenge: challenge.ru,
        solution: solution.ru,
        result: result.ru,
      },
    });

    return doc;
  };

  await createPortfolio({
    title: {
      en: "Modern Minimalist Transformation",
      uk: "Сучасна мінімалістична трансформація",
      ru: "Современная минималистичная трансформация",
    },
    status: "published",
    category: "styling",
    description: {
      en: "A complete style overhaul for a professional client seeking a refined, modern aesthetic. Through careful wardrobe analysis and strategic shopping, we created a cohesive capsule wardrobe that perfectly balances sophistication with everyday practicality.",
      uk: "Повне оновлення стилю для професійного клієнта, який шукає витончену, сучасну естетику. Завдяки ретельному аналізу гардеробу та стратегічному шопінгу ми створили цілісний капсульний гардероб, що ідеально поєднує вишуканість з повсякденною практичністю.",
      ru: "Полное обновление стиля для профессионального клиента, ищущего утонченную, современную эстетику. Благодаря тщательному анализу гардероба и стратегическому шопингу мы создали целостный капсульный гардероб, идеально сочетающий изысканность с повседневной практичностью.",
    },
    challenge: {
      en: "Client had a cluttered wardrobe with no clear style direction.",
      uk: "У клієнта був захаращений гардероб без чіткого стилістичного спрямування.",
      ru: "У клиента был загроможденный гардероб без четкого стилистического направления.",
    },
    solution: {
      en: "Conducted a full wardrobe audit and defined a minimalist capsule.",
      uk: "Проведено повний аудит гардеробу та визначено мінімалістичну капсулу.",
      ru: "Проведен полный аудит гардероба и определена минималистичная капсула.",
    },
    result: {
      en: "A cohesive, high-end wardrobe that reflects the client's personality.",
      uk: "Згуртований, висококласний гардероб, що відображає особистість клієнта.",
      ru: "Сплоченный, высококлассный гардероб, отражающий личность клиента.",
    },
    featured: true,
  });

  await createPortfolio({
    title: {
      en: "Evening Elegance for Gala",
      uk: "Вечірня елегантність для гала-вечора",
      ru: "Вечерняя элегантность для гала-вечера",
    },
    status: "published",
    category: "event",
    description: {
      en: "Bespoke evening wear created for a high-profile charity gala. Our atelier crafted a stunning silk gown with hand-finished details, ensuring our client made an unforgettable impression while feeling completely confident and comfortable throughout the evening.",
      uk: "Вечірнє вбрання на замовлення, створене для благодійного гала-вечора. Наше ательє створило приголомшливу шовкову сукню з ручним оздобленням, що забезпечило нашій клієнтці незабутнє враження та повну впевненість і комфорт протягом усього вечора.",
      ru: "Вечерний наряд на заказ, созданный для благотворительного гала-вечера. Наше ателье создало потрясающее шелковое платье с ручной отделкой, обеспечив нашей клиентке незабываемое впечатление и полную уверенность и комфорт в течение всего вечера.",
    },
    challenge: {
      en: "Finding a unique, sophisticated look for a high-profile event.",
      uk: "Пошук унікального, витонченого образу для престижної події.",
      ru: "Поиск уникального, утонченного образа для престижного события.",
    },
    solution: {
      en: "Custom atelier dress designed and tailored to perfection.",
      uk: "Сукня від ательє, розроблена та пошита до ідеалу.",
      ru: "Платье от ателье, разработанное и пошитое до идеала.",
    },
    result: {
      en: "The client was the highlight of the evening in a bespoke silk gown.",
      uk: "Клієнтка була окрасою вечора в шовковій сукні на замовлення.",
      ru: "Клиентка была украшением вечера в шелковом платье на заказ.",
    },
    featured: false,
  });

  await createPortfolio({
    title: {
      en: "Corporate Style Strategy",
      uk: "Стратегія корпоративного стилю",
      ru: "Стратегия корпоративного стиля",
    },
    status: "published",
    category: "styling",
    description: {
      en: "Developing a powerful professional image for a technology executive transitioning to C-suite leadership. We curated a sophisticated business wardrobe that commands respect in the boardroom while maintaining the comfort and personal style essential for long workdays.",
      uk: "Розробка потужного професійного іміджу для керівника технологічної компанії, який переходить на рівень C-suite. Ми підібрали вишуканий діловий гардероб, що викликає повагу в залі засідань, зберігаючи комфорт та особистий стиль, необхідні для довгих робочих днів.",
      ru: "Разработка мощного профессионального имиджа для руководителя технологической компании, переходящего на уровень C-suite. Мы подобрали изысканный деловой гардероб, вызывающий уважение в зале заседаний, сохраняя комфорт и личный стиль, необходимые для долгих рабочих дней.",
    },
    challenge: {
      en: "Transitioning from casual to executive presence while maintaining comfort.",
      uk: "Перехід від повсякденного до виконавчого вигляду зі збереженням комфорту.",
      ru: "Переход от повседневного к исполнительному виду с сохранением комфорта.",
    },
    solution: {
      en: "Curated a high-end business casual wardrobe with premium fabrics.",
      uk: "Підібрано висококласний бізнес-кежуал гардероб з преміальних тканин.",
      ru: "Подобран высококлассный бизнес-кэжуал гардероб из премиальных тканей.",
    },
    result: {
      en: "Increased confidence and a powerful professional presence.",
      uk: "Підвищена впевненість та потужна професійна присутність.",
      ru: "Повышенная уверенность и мощное профессиональное присутствие.",
    },
    featured: true,
  });

  await createPortfolio({
    title: {
      en: "Sustainable Capsule Wardrobe",
      uk: "Сталий капсульний гардероб",
      ru: "Устойчивый капсульный гардероб",
    },
    status: "published",
    category: "styling",
    description: {
      en: "Creating a versatile, ethically-sourced wardrobe for an environmentally conscious client. Every piece was carefully selected from sustainable and ethical fashion houses, proving that conscious choices and impeccable style can coexist beautifully.",
      uk: "Створення універсального, етично-свідомого гардеробу для екологічно відповідального клієнта. Кожна річ була ретельно підібрана у сталих та етичних модних будинках, доводячи, що свідомий вибір та бездоганний стиль можуть прекрасно співіснувати.",
      ru: "Создание универсального, этично-сознательного гардероба для экологически ответственного клиента. Каждая вещь была тщательно подобрана у устойчивых и этичных модных домов, доказывая, что сознательный выбор и безупречный стиль могут прекрасно сосуществовать.",
    },
    challenge: {
      en: "Building a complete wardrobe using only sustainable and ethical sources.",
      uk: "Побудова повного гардеробу з використанням лише сталих та етичних джерел.",
      ru: "Построение полного гардероба с использованием только устойчивых и этичных источников.",
    },
    solution: {
      en: "Researched and sourced from top ethical fashion houses globally.",
      uk: "Досліджено та закуплено речі у провідних етичних модних будинках світу.",
      ru: "Исследовано и закуплено вещи у ведущих этичных модных домов мира.",
    },
    result: {
      en: "A beautiful, ethical wardrobe that aligns with the client's values.",
      uk: "Прекрасний, етичний гардероб, що відповідає цінностям клієнта.",
      ru: "Прекрасный, этичный гардероб, соответствующий ценностям клиента.",
    },
    featured: false,
  });

  // 5. Create Products
  console.log("Creating products...");

  const createProduct = async (data: ProductData) => {
    const { name, excerpt, description, ...rest } = data;

    const doc = await payload.create({
      collection: "products",
      locale: "uk",
      data: {
        ...rest,
        name: name.uk,
        excerpt: excerpt.uk,
        description: description.uk,
        pricing: {
          uah: rest.pricing.uah,
          eur: rest.pricing.eur,
        },
        images: [
          {
            image: media.id,
            alt: name.uk,
          },
        ],
      },
    } as any); // eslint-disable-line @typescript-eslint/no-explicit-any

    await payload.update({
      collection: "products",
      id: doc.id,
      locale: "en",
      data: {
        name: name.en,
        excerpt: excerpt.en,
        description: description.en,
      },
    });

    await payload.update({
      collection: "products",
      id: doc.id,
      locale: "ru",
      data: {
        name: name.ru,
        excerpt: excerpt.ru,
        description: description.ru,
      },
    });

    return doc;
  };

  await createProduct({
    name: {
      en: "Silk Slip Dress",
      uk: "Шовкова сукня-комбінація",
      ru: "Шелковое платье-комбинация",
    },
    status: "published",
    category: "dresses",
    sku: "SILK-SLIP-001",
    excerpt: {
      en: "Timeless elegance in premium silk.",
      uk: "Вічна елегантність у преміальному шовку.",
      ru: "Вечная элегантность в премиальном шелке.",
    },
    description: {
      en: "Handcrafted from 100% mulberry silk, this dress is a versatile staple for any wardrobe.",
      uk: "Виготовлена вручну зі 100% шовку малбері, ця сукня є універсальним елементом будь-якого гардеробу.",
      ru: "Изготовленное вручную из 100% шелка малбери, это платье является универсальным элементом любого гардероба.",
    },
    pricing: {
      uah: 8000,
      eur: 200,
    },
    featured: true,
  });

  await createProduct({
    name: {
      en: "Cashmere Oversized Sweater",
      uk: "Кашеміровий светр оверсайз",
      ru: "Кашемировый свитер оверсайз",
    },
    status: "published",
    category: "tops",
    sku: "CASH-SWEAT-002",
    excerpt: {
      en: "Ultimate comfort and luxury.",
      uk: "Найвищий комфорт та розкіш.",
      ru: "Высший комфорт и роскошь.",
    },
    description: {
      en: "Soft, warm, and stylish cashmere sweater for chilly days.",
      uk: "М'який, теплий та стильний кашеміровий светр для прохолодних днів.",
      ru: "Мягкий, теплый и стильный кашемировый свитер для прохладных дней.",
    },
    pricing: {
      uah: 12000,
      eur: 300,
    },
    featured: false,
  });

  // 6. Create Collections (Lookbooks)
  console.log("Creating collections...");

  const createCollection = async (data: CollectionData) => {
    const { name, description, materials, careInstructions, sizes, ...rest } =
      data;

    const doc = await payload.create({
      collection: "lookbooks",
      locale: "uk",
      data: {
        ...rest,
        name: name.uk,
        description: description.uk,
        materials: materials?.uk,
        careInstructions: careInstructions?.uk,
        sizes: sizes?.uk,
        coverImage: media.id,
        images: [{ image: media.id, caption: name.uk }],
        pricing: rest.pricing,
      },
    } as any); // eslint-disable-line @typescript-eslint/no-explicit-any

    await payload.update({
      collection: "lookbooks",
      id: doc.id,
      locale: "en",
      data: {
        name: name.en,
        description: description.en,
        materials: materials?.en,
        careInstructions: careInstructions?.en,
        sizes: sizes?.en,
      },
    });

    await payload.update({
      collection: "lookbooks",
      id: doc.id,
      locale: "ru",
      data: {
        name: name.ru,
        description: description.ru,
        materials: materials?.ru,
        careInstructions: careInstructions?.ru,
        sizes: sizes?.ru,
      },
    });

    return doc;
  };

  await createCollection({
    name: {
      en: "Victory Dress",
      uk: "Плаття на Победу",
      ru: "Платье на Победу",
    },
    status: "published",
    season: "all-season",
    description: {
      en: "A collection dedicated to strength and elegance.",
      uk: "Колекція, присвячена силі та елегантності.",
      ru: "Коллекция, посвященная силе и элегантности.",
    },
    materials: {
      en: "100% Silk",
      uk: "100% Шовк",
      ru: "100% Шелк",
    },
    careInstructions: {
      en: "Dry clean only",
      uk: "Тільки суха чистка",
      ru: "Только сухая чистка",
    },
    sizes: {
      en: "XS, S, M, L, XL",
      uk: "XS, S, M, L, XL",
      ru: "XS, S, M, L, XL",
    },
    pricing: {
      eur: 500,
      uah: 20000,
    },
    featured: true,
    bookable: true,
    paymentEnabled: true,
    releaseDate: new Date().toISOString(),
  });

  await createCollection({
    name: {
      en: "Retreat Collection",
      uk: "Колекція Retreat",
      ru: "Коллекция Retreat",
    },
    status: "published",
    season: "summer",
    description: {
      en: "Comfortable and stylish pieces for your home and yoga practice.",
      uk: "Зручні та стильні речі для дому та занять йогою.",
      ru: "Удобные и стильные вещи для дома и занятий йогой.",
    },
    materials: {
      en: "Organic Cotton",
      uk: "Органічна бавовна",
      ru: "Органический хлопок",
    },
    pricing: { eur: 150, uah: 6000 },
    featured: false,
    bookable: true,
    releaseDate: new Date().toISOString(),
  });

  await createCollection({
    name: {
      en: "Travel Capsule with Vika Veda",
      uk: "Travel Capsule з Вікою Ведою",
      ru: "Travel Capsule с Викой Ведой",
    },
    status: "published",
    season: "summer",
    description: {
      en: "5 silk items for €1000. The perfect travel companion.",
      uk: "5 шовкових речей за €1000. Ідеальний супутник для подорожей.",
      ru: "5 шелковых вещей за €1000. Идеальный спутник для путешествий.",
    },
    materials: {
      en: "100% Silk",
      uk: "100% Шовк",
      ru: "100% Шелк",
    },
    pricing: { eur: 1000, uah: 40000 },
    featured: true,
    bookable: true,
    releaseDate: new Date().toISOString(),
  });

  await createCollection({
    name: {
      en: "Silky Touches",
      uk: "Шовкові дотики",
      ru: "Шелковые прикосновения",
    },
    status: "published",
    season: "all-season",
    description: {
      en: "Cruise, yacht, yoga, chiffon. Delicate silk pieces for every moment.",
      uk: "Круїз, яхта, йога, шифон. Делікатні шовкові речі для кожного моменту.",
      ru: "Круиз, яхта, йога, шифон. Деликатные шелковые вещи для каждого момента.",
    },
    materials: {
      en: "Silk & Chiffon",
      uk: "Шовк та шифон",
      ru: "Шелк и шифон",
    },
    pricing: { eur: 300, uah: 12000 },
    featured: false,
    bookable: true,
    releaseDate: new Date().toISOString(),
  });

  // 7. Create Courses
  console.log("Creating courses...");

  const createCourse = async (data: CourseData) => {
    const {
      title,
      excerpt,
      description,
      prerequisites,
      materials,
      instructor,
      curriculum,
      testimonials,
      faq,
      ...rest
    } = data;

    const doc = await payload.create({
      collection: "courses",
      locale: "uk",
      data: {
        ...rest,
        title: title.uk,
        excerpt: excerpt.uk,
        prerequisites: prerequisites?.uk,
        materials: materials?.uk,
        description: {
          root: {
            type: "root",
            format: "",
            indent: 0,
            version: 1,
            direction: "ltr",
            children: [
              {
                type: "paragraph",
                format: "",
                indent: 0,
                version: 1,
                children: [
                  {
                    mode: "normal",
                    text: description.uk,
                    type: "text",
                    style: "",
                    detail: 0,
                    version: 1,
                  },
                ],
              },
            ],
          },
        },
        instructor: {
          name: instructor.name,
          title: instructor.title.uk,
          bio: instructor.bio.uk,
          photo: media.id,
        },
        curriculum: curriculum.map((item) => ({
          module: item.module.uk,
          topics: item.topics.map((t) => ({ topic: t.uk })),
        })),
        testimonials: testimonials?.map((t) => ({
          name: t.name,
          quote: t.quote.uk,
          photo: media.id,
        })),
        faq: faq?.map((f) => ({
          question: f.question.uk,
          answer: f.answer.uk,
        })),
        featuredImage: media.id,
        pricing: rest.pricing,
      },
    } as any); // eslint-disable-line @typescript-eslint/no-explicit-any

    await payload.update({
      collection: "courses",
      id: doc.id,
      locale: "en",
      data: {
        title: title.en,
        excerpt: excerpt.en,
        prerequisites: prerequisites?.en,
        materials: materials?.en,
        description: {
          root: {
            type: "root",
            format: "",
            indent: 0,
            version: 1,
            direction: "ltr",
            children: [
              {
                type: "paragraph",
                format: "",
                indent: 0,
                version: 1,
                children: [
                  {
                    mode: "normal",
                    text: description.en,
                    type: "text",
                    style: "",
                    detail: 0,
                    version: 1,
                  },
                ],
              },
            ],
          },
        },
        instructor: {
          title: instructor.title.en,
          bio: instructor.bio.en,
        },
        curriculum: curriculum.map((item) => ({
          module: item.module.en,
          topics: item.topics.map((t) => ({ topic: t.en })),
        })),
        testimonials: testimonials?.map((t) => ({
          name: t.name,
          quote: t.quote.en,
        })),
        faq: faq?.map((f) => ({
          question: f.question.en,
          answer: f.answer.en,
        })),
      },
    });

    await payload.update({
      collection: "courses",
      id: doc.id,
      locale: "ru",
      data: {
        title: title.ru,
        excerpt: excerpt.ru,
        prerequisites: prerequisites?.ru,
        materials: materials?.ru,
        description: {
          root: {
            type: "root",
            format: "",
            indent: 0,
            version: 1,
            direction: "ltr",
            children: [
              {
                type: "paragraph",
                format: "",
                indent: 0,
                version: 1,
                children: [
                  {
                    mode: "normal",
                    text: description.ru,
                    type: "text",
                    style: "",
                    detail: 0,
                    version: 1,
                  },
                ],
              },
            ],
          },
        },
        instructor: {
          title: instructor.title.ru,
          bio: instructor.bio.ru,
        },
        curriculum: curriculum.map((item) => ({
          module: item.module.ru,
          topics: item.topics.map((t) => ({ topic: t.ru })),
        })),
        testimonials: testimonials?.map((t) => ({
          name: t.name,
          quote: t.quote.ru,
        })),
        faq: faq?.map((f) => ({
          question: f.question.ru,
          answer: f.answer.ru,
        })),
      },
    });

    return doc;
  };

  await createCourse({
    title: {
      en: "Victory Dress",
      uk: "Плаття на Победу",
      ru: "Платье на Победу",
    },
    status: "published",
    category: "masterclass",
    level: "all",
    excerpt: {
      en: "Create your own Victory Dress in this intensive masterclass.",
      uk: "Створіть власну Сукню Перемоги на цьому інтенсивному майстер-класі.",
      ru: "Создайте свое собственное Платье Победы на этом интенсивном мастер-классе.",
    },
    description: {
      en: "A deep dive into the creation of the iconic Victory Dress. Learn the techniques, the philosophy, and the craftsmanship behind this transformative garment.",
      uk: "Глибоке занурення у створення іконічної Сукні Перемоги. Вивчіть техніки, філософію та майстерність, що стоять за цим трансформаційним виробом.",
      ru: "Глубокое погружение в создание иконического Платья Победы. Изучите техники, философию и мастерство, стоящие за этим трансформационным изделием.",
    },
    instructor: {
      name: "Vika Veda",
      title: {
        en: "Founder & Creative Director",
        uk: "Засновниця та креативний директор",
        ru: "Основательница и креативный директор",
      },
      bio: {
        en: "Expert in silk and bespoke tailoring.",
        uk: "Експерт із шовку та індивідуального пошиття.",
        ru: "Эксперт по шелку и индивидуальному пошиву.",
      },
    },
    curriculum: [
      {
        module: { en: "Philosophy", uk: "Філософія", ru: "Философия" },
        topics: [
          {
            en: "The meaning of Victory",
            uk: "Значення Перемоги",
            ru: "Значение Победы",
          },
        ],
      },
      {
        module: { en: "Craftsmanship", uk: "Майстерність", ru: "Мастерство" },
        topics: [
          {
            en: "Silk handling techniques",
            uk: "Техніки роботи з шовком",
            ru: "Техники работы с шелком",
          },
        ],
      },
    ],
    pricing: { eur: 500, uah: 20000 },
    duration: {
      value: 2,
      unit: "days",
    },
    format: "in-person",
    bookable: true,
    paymentEnabled: true,
    featured: true,
  });

  await createCourse({
    title: {
      en: "Style Mastery",
      uk: "Майстерність стилю",
      ru: "Мастерство стиля",
    },
    status: "published",
    category: "personal-styling",
    level: "beginner",
    excerpt: {
      en: "Learn the fundamentals of personal styling.",
      uk: "Вивчіть основи персонального стайлінгу.",
      ru: "Изучите основы персонального стайлинга.",
    },
    description: {
      en: "A comprehensive course covering color theory, body types, and wardrobe building.",
      uk: "Вичерпний курс, що охоплює теорію кольору, типи фігур та побудову гардеробу.",
      ru: "Исчерпывающий курс, охватывающий теорию цвета, типы фигур и построение гардероба.",
    },
    prerequisites: {
      en: "None",
      uk: "Немає",
      ru: "Нет",
    },
    materials: {
      en: "Notebook, mirror",
      uk: "Блокнот, дзеркало",
      ru: "Блокнот, зеркало",
    },
    pricing: { eur: 120, uah: 5000 },
    duration: {
      value: 4,
      unit: "weeks",
    },
    format: "online",
    instructor: {
      name: "Vika Veda",
      title: {
        en: "Lead Stylist",
        uk: "Провідний стиліст",
        ru: "Ведущий стилист",
      },
      bio: {
        en: "Expert in fashion and personal branding.",
        uk: "Експерт у моді та персональному брендингу.",
        ru: "Эксперт в моде и персональном брендинге.",
      },
    },
    curriculum: [
      {
        module: {
          en: "Introduction to Style",
          uk: "Вступ до стилю",
          ru: "Введение в стиль",
        },
        topics: [
          { en: "History of Fashion", uk: "Історія моди", ru: "История моды" },
          {
            en: "Defining Your Style",
            uk: "Визначення вашого стилю",
            ru: "Определение вашего стиля",
          },
        ],
      },
    ],
    testimonials: [
      {
        name: "Anna S.",
        quote: {
          en: "This course changed my life!",
          uk: "Цей курс змінив моє життя!",
          ru: "Этот курс изменил мою жизнь!",
        },
      },
    ],
    faq: [
      {
        question: {
          en: "Is it for beginners?",
          uk: "Це для початківців?",
          ru: "Это для начинающих?",
        },
        answer: {
          en: "Yes, absolutely.",
          uk: "Так, безумовно.",
          ru: "Да, абсолютно.",
        },
      },
    ],
    upcomingDates: [
      {
        startDate: new Date().toISOString(),
        spotsAvailable: 10,
      },
    ],
    featured: true,
    bookable: true,
    paymentEnabled: true,
  });

  await createCourse({
    title: {
      en: "Color Theory for Fashion",
      uk: "Теорія кольору для моди",
      ru: "Теорія кольору для моди",
    },
    status: "published",
    category: "color-analysis",
    level: "intermediate",
    excerpt: {
      en: "Master the art of color coordination.",
      uk: "Опануйте мистецтво координації кольорів.",
      ru: "Освойте искусство координации цветов.",
    },
    description: {
      en: "Learn how to use color to enhance your appearance and create mood.",
      uk: "Дізнайтеся, як використовувати колір, щоб підкреслити свою зовнішність та створити настрій.",
      ru: "Узнайте, как использовать цвет, чтобы подчеркнуть свою внешность и создать настроение.",
    },
    pricing: { eur: 80, uah: 3000 },
    duration: {
      value: 2,
      unit: "weeks",
    },
    format: "online",
    instructor: {
      name: "Vika Veda",
      title: {
        en: "Lead Stylist",
        uk: "Провідний стиліст",
        ru: "Ведущий стилист",
      },
      bio: {
        en: "Expert in fashion and personal branding.",
        uk: "Експерт у моді та персональному брендингу.",
        ru: "Эксперт в моде и персональном брендинге.",
      },
    },
    curriculum: [
      {
        module: {
          en: "Color Basics",
          uk: "Основи кольору",
          ru: "Основы цвета",
        },
        topics: [
          { en: "Color Wheel", uk: "Колірне коло", ru: "Цветовой круг" },
          {
            en: "Psychology of Color",
            uk: "Психологія кольору",
            ru: "Психология цвета",
          },
        ],
      },
    ],
    upcomingDates: [
      {
        startDate: new Date().toISOString(),
        spotsAvailable: 15,
      },
    ],
    featured: false,
    bookable: true,
  });

  // 8. Create Site Settings
  console.log("Creating site settings...");
  await payload.updateGlobal({
    slug: "site-settings",
    data: {
      siteName: "PURITY Fashion Studio",
      contact: {
        email: "contact@purity.com",
      },
      currency: {
        default: "EUR",
      },
    },
  });

  console.log("Seeding complete!");
  process.exit(0);
};

seed().catch((err) => {
  console.error("Seed failed:", JSON.stringify(err, null, 2));
  process.exit(1);
});
