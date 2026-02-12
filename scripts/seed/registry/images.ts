/**
 * Image registry — single source of truth for all seeded media.
 *
 * Every image the site uses (page heroes, content images, homepage slots)
 * is declared here with its purpose, dimensions, palette, and alt text.
 */
import type { ImageRegistryEntry } from "../types";

/* ── Brand palette constants ─────────────────────────── */
const WARM_SAND = { from: "#e8e0d4", to: "#d4c5b0", fg: "#6b5e50" };
const PARCHMENT = { from: "#f0ebe4", to: "#ddd4c6", fg: "#7a6e60" };
const DEEP_ATELIER = {
  from: "#c9b8a8",
  to: "#a89888",
  accent: "#8b7b6b",
  fg: "#4a3f35",
};
const WARM_ROSE = {
  from: "#d4a98c",
  to: "#c49080",
  accent: "#b87860",
  fg: "#5a3f30",
};
const SAGE_GREEN = {
  from: "#c5d4cc",
  to: "#a8b8a8",
  accent: "#90a090",
  fg: "#3a4a3a",
};
const DEEP_CRIMSON = {
  from: "#9a3040",
  to: "#7a2030",
  accent: "#c04050",
  fg: "#f0e8e0",
};
const MUTED_GOLD = {
  from: "#c8c0a8",
  to: "#b0a890",
  accent: "#a09878",
  fg: "#4a4530",
};
const SILK_CREAM = {
  from: "#e0d4c8",
  to: "#d0c0b0",
  accent: "#c0b0a0",
  fg: "#5a4f40",
};
const MINIMAL_BONE = { from: "#e8e2db", to: "#d8d0c5", fg: "#5a5045" };
const TRANSFORM = {
  from: "#8b6f5e",
  to: "#6b5040",
  accent: "#a88570",
  fg: "#f0e8e0",
};
const MEDITATION = {
  from: "#c5d4cc",
  to: "#b0c0b0",
  accent: "#a0b0a0",
  fg: "#3a4a3a",
};
const SHOPPING = {
  from: "#bfa89a",
  to: "#a89080",
  accent: "#c0a890",
  fg: "#3a2f25",
};

/* ── Image Registry ──────────────────────────────────── */
export const IMAGE_REGISTRY: ImageRegistryEntry[] = [
  // ─── Page Heroes ───────────────────────────────────────
  {
    id: "hero_homepage_bg",
    purpose: "homepage-background",
    category: "hero",
    width: 1920,
    height: 1080,
    palette: DEEP_ATELIER,
    alt: {
      en: "PURITY Fashion Studio",
      uk: "PURITY Фешн Студія",
      ru: "PURITY Фэшн Студия",
    },
  },
  {
    id: "hero_homepage_fg",
    purpose: "homepage-foreground",
    category: "hero",
    width: 1920,
    height: 1080,
    palette: WARM_SAND,
    alt: {
      en: "High Fashion Editorial",
      uk: "Високий модний едиторіал",
      ru: "Модный эдиториал",
    },
  },
  {
    id: "hero_about",
    purpose: "hero-about",
    category: "hero",
    width: 1920,
    height: 1080,
    palette: PARCHMENT,
    alt: {
      en: "About PURITY Studio",
      uk: "Про PURITY Студію",
      ru: "О студии PURITY",
    },
  },
  {
    id: "hero_research",
    purpose: "hero-research",
    category: "hero",
    width: 1920,
    height: 1080,
    palette: MINIMAL_BONE,
    alt: {
      en: "Research Methodology",
      uk: "Методологія дослідження",
      ru: "Методология исследования",
    },
  },
  {
    id: "hero_imagine",
    purpose: "hero-imagine",
    category: "hero",
    width: 1920,
    height: 1080,
    palette: DEEP_ATELIER,
    alt: {
      en: "Imagine Atelier",
      uk: "Уявлення Ательє",
      ru: "Воображение Ателье",
    },
  },
  {
    id: "hero_create",
    purpose: "hero-create",
    category: "hero",
    width: 1920,
    height: 1080,
    palette: TRANSFORM,
    alt: {
      en: "Create Transformation",
      uk: "Створення трансформації",
      ru: "Создание трансформации",
    },
  },
  {
    id: "hero_school",
    purpose: "hero-school",
    category: "hero",
    width: 1920,
    height: 1080,
    palette: SAGE_GREEN,
    alt: { en: "Fashion School", uk: "Школа моди", ru: "Школа моды" },
  },
  {
    id: "hero_contact",
    purpose: "hero-contact",
    category: "hero",
    width: 1920,
    height: 1080,
    palette: WARM_SAND,
    alt: {
      en: "Contact PURITY",
      uk: "Зв'язатися з PURITY",
      ru: "Связаться с PURITY",
    },
  },
  {
    id: "hero_portfolio",
    purpose: "hero-portfolio",
    category: "hero",
    width: 1920,
    height: 1080,
    palette: MINIMAL_BONE,
    alt: {
      en: "Portfolio Showcase",
      uk: "Портфоліо робіт",
      ru: "Портфолио работ",
    },
  },
  {
    id: "hero_collections",
    purpose: "hero-collections",
    category: "hero",
    width: 1920,
    height: 1080,
    palette: SILK_CREAM,
    alt: {
      en: "Collections Lookbook",
      uk: "Колекції Лукбук",
      ru: "Коллекции Лукбук",
    },
  },
  {
    id: "hero_blog",
    purpose: "hero-blog",
    category: "hero",
    width: 1920,
    height: 1080,
    palette: PARCHMENT,
    alt: { en: "PURITY Journal", uk: "Журнал PURITY", ru: "Журнал PURITY" },
  },

  // ─── Homepage Methodology Slots ────────────────────────
  {
    id: "homepage_research",
    purpose: "homepage-research",
    category: "content",
    width: 800,
    height: 1200,
    palette: MINIMAL_BONE,
    alt: {
      en: "Minimalist Style Wardrobe",
      uk: "Мінімалістичний гардероб",
      ru: "Минималистичный гардероб",
    },
  },
  {
    id: "homepage_imagine",
    purpose: "homepage-imagine",
    category: "content",
    width: 800,
    height: 1200,
    palette: DEEP_ATELIER,
    alt: {
      en: "Atelier Silk Fabric",
      uk: "Шовкова тканина ательє",
      ru: "Ткань ателье из шёлка",
    },
  },
  {
    id: "homepage_create",
    purpose: "homepage-create",
    category: "content",
    width: 800,
    height: 1200,
    palette: TRANSFORM,
    alt: {
      en: "Styling Transformation",
      uk: "Стильова трансформація",
      ru: "Стилевая трансформация",
    },
  },

  // ─── Content Images (used across posts, services, portfolio, lookbooks) ────
  {
    id: "editorial_1",
    purpose: "content-editorial",
    category: "content",
    width: 1200,
    height: 800,
    palette: DEEP_ATELIER,
    alt: {
      en: "High Fashion Editorial",
      uk: "Високий модний едиторіал",
      ru: "Модный эдиториал",
    },
  },
  {
    id: "atelier_1",
    purpose: "content-atelier",
    category: "content",
    width: 1200,
    height: 800,
    palette: DEEP_ATELIER,
    alt: {
      en: "Atelier Silk Fabric",
      uk: "Шовкова тканина ательє",
      ru: "Ткань ателье из шёлка",
    },
  },
  {
    id: "minimal_1",
    purpose: "content-minimal",
    category: "lifestyle",
    width: 1200,
    height: 800,
    palette: MINIMAL_BONE,
    alt: {
      en: "Minimalist Style Wardrobe",
      uk: "Мінімалістичний гардероб",
      ru: "Минималистичный гардероб",
    },
  },
  {
    id: "transformation_1",
    purpose: "content-transformation",
    category: "lifestyle",
    width: 1200,
    height: 800,
    palette: TRANSFORM,
    alt: {
      en: "Styling Transformation",
      uk: "Стильова трансформація",
      ru: "Стилевая трансформация",
    },
  },
  {
    id: "product_1",
    purpose: "content-product",
    category: "product",
    width: 800,
    height: 1200,
    palette: SILK_CREAM,
    alt: {
      en: "Silk Slip Dress Detail",
      uk: "Деталь шовкової сукні-комбінації",
      ru: "Деталь шёлкового платья-комбинации",
    },
  },
  {
    id: "course_1",
    purpose: "content-course",
    category: "content",
    width: 1200,
    height: 800,
    palette: SAGE_GREEN,
    alt: {
      en: "Fashion Design Process",
      uk: "Процес модного дизайну",
      ru: "Процесс модного дизайна",
    },
  },
  {
    id: "meditation_1",
    purpose: "content-meditation",
    category: "lifestyle",
    width: 1200,
    height: 800,
    palette: MEDITATION,
    alt: {
      en: "Peaceful Meditation Scene",
      uk: "Спокійна медитація",
      ru: "Спокойная медитация",
    },
  },
  {
    id: "color_palette",
    purpose: "content-color-palette",
    category: "content",
    width: 1200,
    height: 800,
    palette: WARM_ROSE,
    alt: {
      en: "Color Palette Draping",
      uk: "Драпірування кольорової палітри",
      ru: "Драпировка цветовой палитры",
    },
  },
  {
    id: "wardrobe_audit",
    purpose: "content-wardrobe-audit",
    category: "content",
    width: 1200,
    height: 800,
    palette: PARCHMENT,
    alt: {
      en: "Wardrobe Interior Organized",
      uk: "Упорядкований гардероб",
      ru: "Организованный гардероб",
    },
  },
  {
    id: "shopping_luxury",
    purpose: "content-shopping",
    category: "lifestyle",
    width: 1200,
    height: 800,
    palette: SHOPPING,
    alt: {
      en: "Luxury Shopping Experience",
      uk: "Розкішний шопінг",
      ru: "Роскошный шопинг",
    },
  },
  {
    id: "silk_textures",
    purpose: "content-silk-textures",
    category: "texture",
    width: 1200,
    height: 800,
    palette: SILK_CREAM,
    alt: {
      en: "Silk Fabric Textures Close-up",
      uk: "Текстури шовку крупним планом",
      ru: "Текстуры шёлка крупным планом",
    },
  },
  {
    id: "capsule_travel",
    purpose: "content-capsule-travel",
    category: "lifestyle",
    width: 1200,
    height: 800,
    palette: SAGE_GREEN,
    alt: {
      en: "Travel Capsule Wardrobe",
      uk: "Капсула для подорожей",
      ru: "Капсула для путешествий",
    },
  },
  {
    id: "victory_dress",
    purpose: "content-victory-dress",
    category: "product",
    width: 800,
    height: 1200,
    palette: DEEP_CRIMSON,
    alt: {
      en: "Victory Dress — Red Carpet Statement",
      uk: "Сукня Перемоги — червоний килим",
      ru: "Платье Победы — красная дорожка",
    },
  },
  {
    id: "retreat_wear",
    purpose: "content-retreat-wear",
    category: "lifestyle",
    width: 1200,
    height: 800,
    palette: MUTED_GOLD,
    alt: {
      en: "Retreat Linen Wear",
      uk: "Лляний одяг для ретриту",
      ru: "Льняная одежда для ретрита",
    },
  },

  // ─── New Service Images (client brief alignment) ────────
  {
    id: "cut_strategy",
    purpose: "content-cut-strategy",
    category: "content",
    width: 1200,
    height: 800,
    palette: DEEP_ATELIER,
    alt: {
      en: "Silhouette & Cut Analysis",
      uk: "Аналіз силуету та крою",
      ru: "Анализ силуэта и кроя",
    },
  },
  {
    id: "wardrobe_plan",
    purpose: "content-wardrobe-plan",
    category: "content",
    width: 1200,
    height: 800,
    palette: SILK_CREAM,
    alt: {
      en: "Wardrobe Planning Session",
      uk: "Планування гардеробу",
      ru: "Планирование гардероба",
    },
  },
  {
    id: "couture_atelier",
    purpose: "content-couture-atelier",
    category: "content",
    width: 1200,
    height: 800,
    palette: WARM_ROSE,
    alt: {
      en: "Couture Atelier Workshop",
      uk: "Майстерня від-кутюр",
      ru: "Мастерская от-кутюр",
    },
  },
  {
    id: "meditation_wholeness",
    purpose: "content-meditation-wholeness",
    category: "lifestyle",
    width: 1200,
    height: 800,
    palette: MEDITATION,
    alt: {
      en: "Wholeness Photo Meditation",
      uk: "Фотомедитація «Цілісність»",
      ru: "Фотомедитация «Целостность»",
    },
  },
  {
    id: "fashion_retreat",
    purpose: "content-fashion-retreat",
    category: "lifestyle",
    width: 1200,
    height: 800,
    palette: SAGE_GREEN,
    alt: {
      en: "Fashion Retreat Experience",
      uk: "Фешн-ретрит",
      ru: "Фэшн-ретрит",
    },
  },
  {
    id: "victory_dress_workshop",
    purpose: "content-victory-dress-workshop",
    category: "content",
    width: 1200,
    height: 800,
    palette: TRANSFORM,
    alt: {
      en: "Victory Dress Design Workshop",
      uk: "Воркшоп «Сукня Перемоги»",
      ru: "Воркшоп «Платье Победы»",
    },
  },
];
