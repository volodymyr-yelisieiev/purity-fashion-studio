/**
 * Product content registry — pure data, no Payload calls.
 */
import type { MediaMap, SeedEntry } from "../types";

export function getProductEntries(m: MediaMap): SeedEntry[] {
  return [
    // 1. Eternal Silk Slip
    {
      data: {
        name: "Eternal Silk Slip",
        category: "dresses",
        status: "published",
        sku: "PUR-SLIP-SILK-01",
        pricing: { eur: 290, uah: 11500 },
        featured: true,
        excerpt:
          "The foundation of a premium wardrobe. 22-momme mulberry silk.",
        description:
          "A piece that flows with the body. Ideal for layering under a heavy knit or worn alone for midnight gala. Hand-finished seams.",
        images: [{ image: m.product_1, alt: "Silk slip dress detail" }],
        details: {
          material: "100% 22-momme Mulberry Silk",
          care: "Hand wash cold with silk detergent",
          sizes: ["xs", "s", "m", "l"],
        },
      },
      locales: {
        en: {},
        uk: {
          name: "Вічна Шовкова Сукня-комбінація",
          excerpt:
            "Основа преміального гардеробу. Шовк тутового шовкопряда 22 моммі.",
          description:
            "Виріб, що струмує по тілу. Ідеально підходить для нашарування під важкий трикотаж або як самостійне вбрання для вечірнього виходу.",
          details: {
            material: "100% шовк тутового шовкопряда (Mulberry)",
            care: "Ручне прання в холодній воді",
          },
        },
        ru: {
          name: "Вечное Шёлковое Платье-комбинация",
          excerpt:
            "Основа премиального гардероба. Шёлк тутового шелкопряда 22 момме.",
          description:
            "Изделие, которое струится по телу. Идеально для наслаивания под тяжёлый трикотаж или как самостоятельный наряд для вечернего выхода.",
          details: {
            material: "100% шёлк тутового шелкопряда (Mulberry)",
            care: "Ручная стирка в холодной воде",
          },
        },
      },
    },
    // 2. Architectural Wool Blazer
    {
      data: {
        name: "Architectural Wool Blazer",
        category: "outerwear",
        status: "published",
        sku: "PUR-BLZR-WOOL-01",
        pricing: { eur: 520, uah: 20800 },
        featured: true,
        excerpt:
          "Structured minimalism. Italian virgin wool with architectural seam lines.",
        description:
          "A single-breasted blazer engineered for the modern woman. Slightly oversized silhouette with sharp, defined shoulders. Fully canvassed construction ensures the shape endures season after season.",
        images: [{ image: m.minimal_1, alt: "Architectural wool blazer" }],
        details: {
          material: "100% Italian Virgin Wool, Bemberg lining",
          care: "Professional dry clean only",
          sizes: ["xs", "s", "m", "l", "xl"],
        },
      },
      locales: {
        en: {},
        uk: {
          name: "Архітектурний Вовняний Блейзер",
          excerpt:
            "Структурований мінімалізм. Італійська натуральна вовна з архітектурними лініями швів.",
          description:
            "Однобортний блейзер, спроектований для сучасної жінки. Злегка оверсайз силует з чіткими, визначеними плечима. Повна конструкція на полотні забезпечує збереження форми сезон за сезоном.",
          details: {
            material: "100% італійська натуральна вовна, підкладка Bemberg",
            care: "Тільки професійна хімчистка",
          },
        },
        ru: {
          name: "Архитектурный Шерстяной Блейзер",
          excerpt:
            "Структурированный минимализм. Итальянская натуральная шерсть с архитектурными линиями швов.",
          description:
            "Однобортный блейзер, спроектированный для современной женщины. Слегка оверсайз силуэт с чёткими, определёнными плечами. Полная конструкция на полотне обеспечивает сохранение формы сезон за сезоном.",
          details: {
            material: "100% итальянская натуральная шерсть, подкладка Bemberg",
            care: "Только профессиональная химчистка",
          },
        },
      },
    },
    // 3. Cashmere Meditation Wrap
    {
      data: {
        name: "Cashmere Meditation Wrap",
        category: "accessories",
        status: "published",
        sku: "PUR-WRAP-CASH-01",
        pricing: { eur: 380, uah: 15200 },
        featured: false,
        excerpt:
          "Weightless warmth for mornings that matter. Grade-A Mongolian cashmere.",
        description:
          "An oversized wrap that doubles as a travel blanket, meditation shawl, or evening layer. Feather-light yet insulating. Hand-loomed with raw, unhemmed edges for a deliberately unfinished aesthetic.",
        images: [{ image: m.meditation_1, alt: "Cashmere meditation wrap" }],
        details: {
          material: "100% Grade-A Mongolian Cashmere",
          care: "Hand wash in cold water with cashmere shampoo. Lay flat to dry.",
          sizes: ["one-size"],
        },
      },
      locales: {
        en: {},
        uk: {
          name: "Кашемірова Обгортка для Медитації",
          excerpt:
            "Невагома теплота для ранків, що мають значення. Кашемір класу А з Монголії.",
          description:
            "Оверсайз обгортка, що одночасно є дорожнім пледом, шаллю для медитації та вечірнім шаром. Легка як пір'їна, але зігріває. Ручне ткацтво з необробленими краями для навмисно незавершеної естетики.",
          details: {
            material: "100% монгольський кашемір класу А",
            care: "Ручне прання в холодній воді з кашеміровим шампунем. Сушити горизонтально.",
          },
        },
        ru: {
          name: "Кашемировое Одеяло для Медитации",
          excerpt:
            "Невесомое тепло для утр, которые имеют значение. Кашемир класса А из Монголии.",
          description:
            "Оверсайз накидка, которая одновременно служит дорожным пледом, шалью для медитации и вечерним слоем. Лёгкая как пёрышко, но согревающая. Ручное ткачество с необработанными краями для намеренно незавершённой эстетики.",
          details: {
            material: "100% монгольский кашемир класса А",
            care: "Ручная стирка в холодной воде с кашемировым шампунем. Сушить горизонтально.",
          },
        },
      },
    },
  ];
}
