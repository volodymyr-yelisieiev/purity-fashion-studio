/**
 * Services content registry — pure data, no Payload calls.
 *
 * Aligned to client brief: 9 services across 3 methodology stages.
 * ЯИССЛЕДОВАНИЕ (research): 4 services
 * ЯПЕРЕВОПЛОЩЕНИЕ (imagine): 2 services
 * ЯТРАНСФОРМАЦИЯ (create): 3 services
 */
import type { MediaMap, SeedEntry } from "../types";
import {
  editorialHero,
  liquidCinematicHero,
  methodologyTimeline,
  horizontalMarquee,
} from "../block-builders";

export function getServiceEntries(m: MediaMap): SeedEntry[] {
  return [
    // ═══════════════════════════════════════════════════════════
    // ЯИССЛЕДОВАНИЕ — @RESEARCH (4 services)
    // ═══════════════════════════════════════════════════════════

    // ─── 1. Color Palette & Texture (Feel Color and Touches) ──
    {
      data: {
        title: "Color Palette & Texture",
        category: "research",
        status: "published",
        excerpt:
          "Discover the precise chromatic range and fabric textures that make you radiant — not just presentable.",
        format: "studio",
        duration: "2 hours",
        pricing: { eur: 200, uah: 8000 },
        featured: true,
        heroImage: m.color_palette,
        description:
          "Feel color. Feel touches. Using professional draping with over 200 fabric swatches, we isolate the temperature, depth, and chroma that elevate your complexion. Your personal color and texture passport — the foundation of every future decision.",
        process: [
          {
            title: "Skin Tone Mapping",
            description:
              "Analyzing undertone, overtone, and seasonal drift under calibrated studio lighting.",
          },
          {
            title: "Fabric Draping Session",
            description:
              "200+ silk, wool, and linen swatches against your face to reveal the palette only your skin can carry.",
          },
          {
            title: "Texture Sensitivity",
            description:
              "Identifying the fabric weights, weaves, and finishes that resonate with your lifestyle and sensory preferences.",
          },
          {
            title: "Palette & Texture Passport",
            description:
              "A physical fan deck and digital file with your 36-color personal spectrum plus approved textures.",
          },
        ],
        deliverables: [
          { item: "36-Color Personal Fan Deck" },
          { item: "Digital Color Passport (HEX + Pantone)" },
          { item: "Texture Preference Guide" },
          { item: "Shopping Quick-Reference Card" },
        ],
        layout: [
          liquidCinematicHero(m, {
            title: "@Research",
            subtitle: "Feel Color and Touches",
            backgroundImage: "color_palette",
            foregroundImage: "minimal_1",
          }),
          editorialHero(m, {
            title: "The Science of Color",
            subtitle:
              "METHODOLOGY @RESEARCH\n200 swatches. One truth. Your truth.",
            media: "color_palette",
            theme: "parchment",
          }),
          horizontalMarquee({
            items: ["FEEL", "COLOR", "TEXTURE", "TOUCH", "PURITY"],
          }),
        ],
      },
      locales: {
        en: {},
        uk: {
          title: "Палітра Кольорів та Фактура",
          excerpt:
            "Знайдіть точний хроматичний діапазон та текстури тканин, що роблять вас сяючою.",
          description:
            "Відчуй колір. Відчуй дотики. Професійне драпірування 200+ зразків тканин для виявлення палітри та текстур, створених саме для вас.",
          process: [
            {
              title: "Карта Тону Шкіри",
              description:
                "Аналіз підтону, надтону та сезонних відтінків при каліброваному освітленні.",
            },
            {
              title: "Сеанс Драпірування",
              description:
                "200+ шовкових, вовняних та лляних зразків для виявлення вашої палітри.",
            },
            {
              title: "Чутливість до Текстур",
              description:
                "Визначення ваг, переплетень та оздоблень тканин, що резонують з вашим стилем життя.",
            },
            {
              title: "Паспорт Палітри та Текстур",
              description:
                "Фізичний віяло та цифровий файл з 36 персональними кольорами та текстурами.",
            },
          ],
          deliverables: [
            { item: "36-кольорове персональне віяло" },
            { item: "Цифровий Паспорт Кольору (HEX + Pantone)" },
            { item: "Гід по текстурам" },
            { item: "Швидка картка для шопінгу" },
          ],
          layout: [
            liquidCinematicHero(m, {
              title: "@Research",
              subtitle: "Відчуй Колір та Дотики",
              backgroundImage: "color_palette",
              foregroundImage: "minimal_1",
            }),
            editorialHero(m, {
              title: "Наука Кольору",
              subtitle:
                "МЕТОДОЛОГІЯ @RESEARCH\n200 зразків. Одна істина. Ваша істина.",
              media: "color_palette",
              theme: "parchment",
            }),
            horizontalMarquee({
              items: ["ВІДЧУЙ", "КОЛІР", "ТЕКСТУРА", "ДОТИК", "ЧИСТОТА"],
            }),
          ],
        },
        ru: {
          title: "Палитра Цветов и Фактура",
          excerpt:
            "Найдите точный хроматический диапазон и текстуры тканей, которые делают вас сияющей.",
          description:
            "Почувствуй цвет. Почувствуй прикосновения. Профессиональное драпирование 200+ образцов тканей для выявления палитры и текстур, созданных именно для вас.",
          process: [
            {
              title: "Карта Тона Кожи",
              description:
                "Анализ подтона, надтона и сезонных оттенков при калиброванном освещении.",
            },
            {
              title: "Сеанс Драпирования",
              description:
                "200+ шёлковых, шерстяных и льняных образцов для выявления вашей палитры.",
            },
            {
              title: "Чувствительность к Текстурам",
              description:
                "Определение весов, переплетений и отделок тканей, резонирующих с вашим стилем жизни.",
            },
            {
              title: "Паспорт Палитры и Текстур",
              description:
                "Физический веер и цифровой файл с 36 персональными цветами и текстурами.",
            },
          ],
          deliverables: [
            { item: "36-цветный персональный веер" },
            { item: "Цифровой Паспорт Цвета (HEX + Pantone)" },
            { item: "Гид по текстурам" },
            { item: "Быстрая карточка для шопинга" },
          ],
          layout: [
            liquidCinematicHero(m, {
              title: "@Research",
              subtitle: "Почувствуй Цвет и Прикосновения",
              backgroundImage: "color_palette",
              foregroundImage: "minimal_1",
            }),
            editorialHero(m, {
              title: "Наука Цвета",
              subtitle:
                "МЕТОДОЛОГИЯ @RESEARCH\n200 образцов. Одна истина. Ваша истина.",
              media: "color_palette",
              theme: "parchment",
            }),
            horizontalMarquee({
              items: [
                "ПОЧУВСТВУЙ",
                "ЦВЕТ",
                "ТЕКСТУРА",
                "ПРИКОСНОВЕНИЕ",
                "ЧИСТОТА",
              ],
            }),
          ],
        },
      },
    },

    // ─── 2. Cut Strategy (Feel Form and Movements) ─────────────
    {
      data: {
        title: "Cut Strategy",
        category: "research",
        status: "published",
        excerpt:
          "Discover the silhouettes and construction principles that move with your body, not against it.",
        format: "studio",
        duration: "2.5 hours",
        pricing: { eur: 250, uah: 10000 },
        featured: false,
        heroImage: m.cut_strategy,
        description:
          "Feel form. Feel movement. Every body has its own geometry — angles of shoulder, curve of hip, length of stride. We map your unique architecture to identify the cuts, proportions, and construction details that create harmony between you and your clothes.",
        process: [
          {
            title: "Body Architecture Mapping",
            description:
              "Precise measurements beyond standard sizing — posture analysis, proportion ratios, movement patterns.",
          },
          {
            title: "Silhouette Testing",
            description:
              "Trying key silhouette archetypes (column, A-line, draped, structured) to identify your ideal forms.",
          },
          {
            title: "Cut & Proportion Blueprint",
            description:
              "Your personalized guide to ideal shoulder lines, hem lengths, waist placements, and collar shapes.",
          },
        ],
        deliverables: [
          { item: "Personal Silhouette Blueprint" },
          { item: "Body Proportion Analysis Document" },
          { item: "Cut Reference Guide for Shopping & Tailoring" },
        ],
        layout: [
          liquidCinematicHero(m, {
            title: "@Research",
            subtitle: "Feel Form and Movements",
            backgroundImage: "cut_strategy",
            foregroundImage: "minimal_1",
          }),
          editorialHero(m, {
            title: "The Geometry of Elegance",
            subtitle:
              "METHODOLOGY @RESEARCH\nYour body has its own architecture. We map it.",
            media: "cut_strategy",
            theme: "parchment",
          }),
        ],
      },
      locales: {
        en: {},
        uk: {
          title: "Стратегія Крою",
          excerpt:
            "Відкрийте силуети та принципи конструювання, що рухаються з вашим тілом, а не проти нього.",
          description:
            "Відчуй форму. Відчуй рух. Кожне тіло має свою геометрію. Ми карту вашої унікальної архітектури для визначення крою, пропорцій та деталей конструкції.",
          process: [
            {
              title: "Картування Архітектури Тіла",
              description:
                "Точні виміри за межами стандартних розмірів — аналіз постави, пропорцій, паттернів руху.",
            },
            {
              title: "Тестування Силуетів",
              description:
                "Приміряння ключових архетипів силуетів для визначення ідеальних форм.",
            },
            {
              title: "Креслення Крою та Пропорцій",
              description:
                "Персоналізований гід по лініях плечей, довжині подолу, талії та формі коміру.",
            },
          ],
          deliverables: [
            { item: "Персональний план силуетів" },
            { item: "Документ аналізу пропорцій" },
            { item: "Рекомендації крою для шопінгу та кравця" },
          ],
          layout: [
            liquidCinematicHero(m, {
              title: "@Research",
              subtitle: "Відчуй Форму та Рух",
              backgroundImage: "cut_strategy",
              foregroundImage: "minimal_1",
            }),
            editorialHero(m, {
              title: "Геометрія Елегантності",
              subtitle:
                "МЕТОДОЛОГІЯ @RESEARCH\nВаше тіло має свою архітектуру. Ми її карту.",
              media: "cut_strategy",
              theme: "parchment",
            }),
          ],
        },
        ru: {
          title: "Стратегия Кроя",
          excerpt:
            "Откройте силуэты и принципы конструирования, которые двигаются с вашим телом, а не против него.",
          description:
            "Почувствуй форму. Почувствуй движение. Каждое тело имеет свою геометрию. Мы картируем вашу уникальную архитектуру для определения кроя, пропорций и деталей конструкции.",
          process: [
            {
              title: "Картирование Архитектуры Тела",
              description:
                "Точные измерения за пределами стандартных размеров — анализ осанки, пропорций, паттернов движения.",
            },
            {
              title: "Тестирование Силуэтов",
              description:
                "Примерка ключевых архетипов силуэтов для определения идеальных форм.",
            },
            {
              title: "Чертёж Кроя и Пропорций",
              description:
                "Персонализированный гид по линиям плеч, длине подола, талии и форме воротника.",
            },
          ],
          deliverables: [
            { item: "Персональный план силуэтов" },
            { item: "Документ анализа пропорций" },
            { item: "Рекомендации кроя для шопинга и портного" },
          ],
          layout: [
            liquidCinematicHero(m, {
              title: "@Research",
              subtitle: "Почувствуй Форму и Движение",
              backgroundImage: "cut_strategy",
              foregroundImage: "minimal_1",
            }),
            editorialHero(m, {
              title: "Геометрия Элегантности",
              subtitle:
                "МЕТОДОЛОГИЯ @RESEARCH\nВаше тело имеет свою архитектуру. Мы её картируем.",
              media: "cut_strategy",
              theme: "parchment",
            }),
          ],
        },
      },
    },

    // ─── 3. Wardrobe Review (Review What You Have) ─────────────
    {
      data: {
        title: "Wardrobe Review",
        category: "research",
        status: "published",
        excerpt:
          "A forensic analysis of what you own — and a clear strategy for what comes next.",
        format: "onsite",
        duration: "3 hours",
        pricing: { eur: 350, uah: 14000 },
        featured: false,
        heroImage: m.wardrobe_audit,
        description:
          "Review what you have. We enter your wardrobe with the eye of an architect, not a declutter consultant. Every garment is assessed for fit, condition, chromatic alignment with your palette, and narrative potential within your evolving style identity.",
        process: [
          {
            title: "Full Inventory",
            description:
              "Cataloguing every piece — fabric, condition, frequency of wear, emotional attachment.",
          },
          {
            title: "Keep / Alter / Release",
            description:
              "Triaging your wardrobe into three clear action categories based on your Color Palette and Cut Strategy.",
          },
          {
            title: "Gap Analysis",
            description:
              "Mapping the missing capsule elements against your personal blueprints.",
          },
        ],
        deliverables: [
          { item: "Wardrobe Map (Digital Spreadsheet)" },
          { item: "Alteration List with Tailor Referrals" },
          { item: "Shopping Hit-List (prioritized by capsule gaps)" },
        ],
        layout: [
          liquidCinematicHero(m, {
            title: "@Research",
            subtitle: "Review What You Have",
            backgroundImage: "wardrobe_audit",
            foregroundImage: "minimal_1",
          }),
          editorialHero(m, {
            title: "Less, but Better",
            subtitle:
              "METHODOLOGY @RESEARCH\nClarity begins where clutter ends.",
            media: "wardrobe_audit",
            theme: "parchment",
          }),
        ],
      },
      locales: {
        en: {},
        uk: {
          title: "Ревізія Гардеробу",
          excerpt:
            "Криміналістичний аналіз того, що ви маєте — та чіткий план того, що далі.",
          description:
            "Перегляньте те, що маєте. Ми заходимо у ваш гардероб оком архітектора, а не консультанта з розхламлення. Кожен предмет оцінюється на посадку, стан, хроматичну відповідність та наративний потенціал.",
          process: [
            {
              title: "Повний Інвентар",
              description:
                "Каталогізація кожної речі — тканина, стан, частота носіння, емоційна прив'язаність.",
            },
            {
              title: "Зберегти / Перешити / Відпустити",
              description:
                "Тріаж гардеробу на три категорії на основі вашої Палітри та Стратегії Крою.",
            },
            {
              title: "Аналіз Прогалин",
              description:
                "Карта відсутніх капсульних елементів відносно ваших персональних планів.",
            },
          ],
          deliverables: [
            { item: "Карта Гардеробу (цифрова таблиця)" },
            { item: "Список переробок з референсами кравців" },
            { item: "Шопінг-лист (за пріоритетом прогалин)" },
          ],
          layout: [
            liquidCinematicHero(m, {
              title: "@Research",
              subtitle: "Переглянь Те, Що Маєш",
              backgroundImage: "wardrobe_audit",
              foregroundImage: "minimal_1",
            }),
            editorialHero(m, {
              title: "Менше, але Краще",
              subtitle:
                "МЕТОДОЛОГІЯ @RESEARCH\nЯсність починається там, де закінчується хаос.",
              media: "wardrobe_audit",
              theme: "parchment",
            }),
          ],
        },
        ru: {
          title: "Ревизия Гардероба",
          excerpt:
            "Криминалистический анализ того, что вы имеете — и ясный план того, что дальше.",
          description:
            "Ревизируйте то, что есть. Мы входим в ваш гардероб глазом архитектора, а не консультанта по расхламлению. Каждый предмет оценивается на посадку, состояние, хроматическое соответствие и нарративный потенциал.",
          process: [
            {
              title: "Полная Инвентаризация",
              description:
                "Каталогизация каждой вещи — ткань, состояние, частота ношения, эмоциональная привязанность.",
            },
            {
              title: "Сохранить / Перешить / Отпустить",
              description:
                "Триаж гардероба на три категории на основе вашей Палитры и Стратегии Кроя.",
            },
            {
              title: "Анализ Пробелов",
              description:
                "Карта отсутствующих капсульных элементов относительно ваших персональных планов.",
            },
          ],
          deliverables: [
            { item: "Карта Гардероба (цифровая таблица)" },
            { item: "Список переделок с рекомендациями портных" },
            { item: "Шопинг-лист (по приоритету пробелов)" },
          ],
          layout: [
            liquidCinematicHero(m, {
              title: "@Research",
              subtitle: "Ревизируй То, Что Есть",
              backgroundImage: "wardrobe_audit",
              foregroundImage: "minimal_1",
            }),
            editorialHero(m, {
              title: "Меньше, но Лучше",
              subtitle:
                "МЕТОДОЛОГИЯ @RESEARCH\nЯсность начинается там, где заканчивается хаос.",
              media: "wardrobe_audit",
              theme: "parchment",
            }),
          ],
        },
      },
    },

    // ─── 4. Wardrobe Plan (Visualize Your Dream Style) ─────────
    {
      data: {
        title: "Wardrobe Plan",
        category: "research",
        status: "published",
        excerpt:
          "Visualize your dream style — a detailed architectural blueprint for your ideal wardrobe.",
        format: "studio",
        duration: "2.5 hours",
        pricing: { eur: 300, uah: 12000 },
        featured: false,
        heroImage: m.wardrobe_plan,
        description:
          "Visualize your dream style. Using insights from your Color Palette, Cut Strategy, and Wardrobe Review, we construct the master plan — a visual roadmap of your ideal capsule wardrobe. Every category, every occasion, every piece mapped with intention.",
        process: [
          {
            title: "Lifestyle Mapping",
            description:
              "Analyzing your real life — work, social, travel, leisure — to define wardrobe categories.",
          },
          {
            title: "Capsule Architecture",
            description:
              "Designing the structure: core pieces, statement pieces, accent pieces across all life categories.",
          },
          {
            title: "Visual Moodboard",
            description:
              "Creating the inspirational visual guide that becomes your north star for acquisitions.",
          },
        ],
        deliverables: [
          { item: "Complete Wardrobe Architecture Plan" },
          { item: "Visual Moodboard (Digital + Printable)" },
          { item: "Seasonal Acquisition Roadmap" },
          { item: "Budget Planning Guide by Priority" },
        ],
        layout: [
          liquidCinematicHero(m, {
            title: "@Research",
            subtitle: "Visualize Your Dream Style",
            backgroundImage: "wardrobe_plan",
            foregroundImage: "minimal_1",
          }),
          editorialHero(m, {
            title: "The Blueprint",
            subtitle:
              "METHODOLOGY @RESEARCH\nYour wardrobe, architected with intention.",
            media: "wardrobe_plan",
            theme: "parchment",
          }),
          horizontalMarquee({
            items: ["VISION", "ARCHITECTURE", "CAPSULE", "INTENTION", "DREAM"],
          }),
        ],
      },
      locales: {
        en: {},
        uk: {
          title: "План Гардеробу",
          excerpt:
            "Візуалізуй свій стиль мрії — детальний архітектурний план ідеального гардеробу.",
          description:
            "Візуалізуй свій стиль мрії. Використовуючи відкриття з Палітри, Стратегії Крою та Ревізії, ми конструюємо майстер-план — візуальну дорожню карту ідеального капсульного гардеробу.",
          process: [
            {
              title: "Картування Способу Життя",
              description:
                "Аналіз реального життя — робота, соціум, подорожі, дозвілля — для визначення категорій гардеробу.",
            },
            {
              title: "Архітектура Капсули",
              description:
                "Проектування структури: базові, акцентні та статементні речі для всіх категорій.",
            },
            {
              title: "Візуальна Мудборд",
              description:
                "Створення інспіраційного візуального гіду для всіх майбутніх придбань.",
            },
          ],
          deliverables: [
            { item: "Повний архітектурний план гардеробу" },
            { item: "Візуальна мудборд (цифрова + для друку)" },
            { item: "Сезонна дорожня карта" },
            { item: "Бюджетний план за пріоритетами" },
          ],
          layout: [
            liquidCinematicHero(m, {
              title: "@Research",
              subtitle: "Візуалізуй Свій Стиль Мрії",
              backgroundImage: "wardrobe_plan",
              foregroundImage: "minimal_1",
            }),
            editorialHero(m, {
              title: "Креслення",
              subtitle:
                "МЕТОДОЛОГІЯ @RESEARCH\nВаш гардероб, архітектурований з наміром.",
              media: "wardrobe_plan",
              theme: "parchment",
            }),
            horizontalMarquee({
              items: ["ВІЗІЯ", "АРХІТЕКТУРА", "КАПСУЛА", "НАМІР", "МРІЯ"],
            }),
          ],
        },
        ru: {
          title: "План Гардероба",
          excerpt:
            "Визуализируй стиль мечты — детальный архитектурный план идеального гардероба.",
          description:
            "Визуализируй свой стиль мечты. Используя открытия из Палитры, Стратегии Кроя и Ревизии, мы конструируем мастер-план — визуальную дорожную карту идеального капсульного гардероба.",
          process: [
            {
              title: "Картирование Образа Жизни",
              description:
                "Анализ реальной жизни — работа, социум, путешествия, досуг — для определения категорий гардероба.",
            },
            {
              title: "Архитектура Капсулы",
              description:
                "Проектирование структуры: базовые, акцентные и стейтмент-вещи для всех категорий.",
            },
            {
              title: "Визуальная Мудборд",
              description:
                "Создание инспирационного визуального гида для всех будущих приобретений.",
            },
          ],
          deliverables: [
            { item: "Полный архитектурный план гардероба" },
            { item: "Визуальная мудборд (цифровая + для печати)" },
            { item: "Сезонная дорожная карта" },
            { item: "Бюджетный план по приоритетам" },
          ],
          layout: [
            liquidCinematicHero(m, {
              title: "@Research",
              subtitle: "Визуализируй Стиль Мечты",
              backgroundImage: "wardrobe_plan",
              foregroundImage: "minimal_1",
            }),
            editorialHero(m, {
              title: "Чертёж",
              subtitle:
                "МЕТОДОЛОГИЯ @RESEARCH\nВаш гардероб, архитектурированный с намерением.",
              media: "wardrobe_plan",
              theme: "parchment",
            }),
            horizontalMarquee({
              items: [
                "ВИДЕНИЕ",
                "АРХИТЕКТУРА",
                "КАПСУЛА",
                "НАМЕРЕНИЕ",
                "МЕЧТА",
              ],
            }),
          ],
        },
      },
    },

    // ═══════════════════════════════════════════════════════════
    // ЯПЕРЕВОПЛОЩЕНИЕ — @IMAGINE (2 services)
    // ═══════════════════════════════════════════════════════════

    // ─── 5. Shopping Service (Shopping List + Accompaniment) ────
    {
      data: {
        title: "Shopping Service",
        category: "imagine",
        status: "published",
        excerpt:
          "Precision shopping guided by your blueprints — online list or in-person accompaniment.",
        format: "hybrid",
        duration: "4–5 hours",
        pricing: { eur: 500, uah: 20000 },
        featured: true,
        heroImage: m.shopping_luxury,
        description:
          "From vision to wardrobe. Armed with your Color Palette, Cut Strategy, and Wardrobe Plan, we execute the acquisition phase. Choose online (curated shopping links delivered as a shoppable list) or in-person (VIP boutique accompaniment where every piece has been pre-vetted).",
        process: [
          {
            title: "Pre-Selection",
            description:
              "We visit boutiques or research online stores in advance, pulling pieces that match your blueprints.",
          },
          {
            title: "Shopping List / Fitting Day",
            description:
              "Online: a curated list of links organized by capsule category. In-person: a focused VIP session where you try on only pre-approved items.",
          },
          {
            title: "Capsule Assembly",
            description:
              "Finalizing purchases and mapping them into your existing wardrobe architecture.",
          },
        ],
        deliverables: [
          { item: "Curated Shopping List or Acquired Pieces Look-Book" },
          { item: "Updated Wardrobe Map" },
          { item: "30-Day Styling Calendar" },
        ],
        layout: [
          liquidCinematicHero(m, {
            title: "@Imagine",
            subtitle: "From Vision to Wardrobe",
            backgroundImage: "shopping_luxury",
            foregroundImage: "minimal_1",
          }),
          editorialHero(m, {
            title: "The Art of Acquisition",
            subtitle:
              "METHODOLOGY @IMAGINE\nShopping without waste. Every piece justified.",
            media: "shopping_luxury",
            theme: "light",
          }),
        ],
      },
      locales: {
        en: {},
        uk: {
          title: "Шопінг Сервіс",
          excerpt:
            "Точковий шопінг за вашими планами — онлайн-список або супровід у бутіках.",
          description:
            "Від бачення до гардеробу. Озброєні вашою Палітрою, Стратегією Крою та Планом Гардеробу, ми виконуємо фазу придбання. Обирайте онлайн (курований список посилань) або офлайн (VIP-супровід у бутіках).",
          process: [
            {
              title: "Попередній Відбір",
              description:
                "Ми відвідуємо бутіки або досліджуємо онлайн-магазини заздалегідь.",
            },
            {
              title: "Шопінг-лист / День Примірки",
              description:
                "Онлайн: курований список посилань. Офлайн: VIP-сеанс примірки.",
            },
            {
              title: "Збірка Капсули",
              description:
                "Фіналізація покупок та інтеграція в архітектуру гардеробу.",
            },
          ],
          deliverables: [
            { item: "Курований шопінг-лист або лукбук придбань" },
            { item: "Оновлена карта гардеробу" },
            { item: "30-денний календар стилізацій" },
          ],
          layout: [
            liquidCinematicHero(m, {
              title: "@Imagine",
              subtitle: "Від Бачення до Гардеробу",
              backgroundImage: "shopping_luxury",
              foregroundImage: "minimal_1",
            }),
            editorialHero(m, {
              title: "Мистецтво Придбання",
              subtitle:
                "МЕТОДОЛОГІЯ @IMAGINE\nШопінг без марнотратства. Кожна річ обґрунтована.",
              media: "shopping_luxury",
              theme: "light",
            }),
          ],
        },
        ru: {
          title: "Шопинг Сервис",
          excerpt:
            "Точечный шопинг по вашим планам — онлайн-список или сопровождение в бутиках.",
          description:
            "От видения к гардеробу. Вооружённые вашей Палитрой, Стратегией Кроя и Планом Гардероба, мы выполняем фазу приобретения. Выбирайте онлайн (курированный список ссылок) или офлайн (VIP-сопровождение в бутиках).",
          process: [
            {
              title: "Предварительный Отбор",
              description:
                "Мы посещаем бутики или исследуем онлайн-магазины заранее.",
            },
            {
              title: "Шопинг-лист / День Примерки",
              description:
                "Онлайн: курированный список ссылок. Офлайн: VIP-сеанс примерки.",
            },
            {
              title: "Сборка Капсулы",
              description:
                "Финализация покупок и интеграция в архитектуру гардероба.",
            },
          ],
          deliverables: [
            { item: "Курированный шопинг-лист или лукбук приобретений" },
            { item: "Обновлённая карта гардероба" },
            { item: "30-дневный календарь стилизаций" },
          ],
          layout: [
            liquidCinematicHero(m, {
              title: "@Imagine",
              subtitle: "От Видения к Гардеробу",
              backgroundImage: "shopping_luxury",
              foregroundImage: "minimal_1",
            }),
            editorialHero(m, {
              title: "Искусство Приобретения",
              subtitle:
                "МЕТОДОЛОГИЯ @IMAGINE\nШопинг без расточительства. Каждая вещь обоснована.",
              media: "shopping_luxury",
              theme: "light",
            }),
          ],
        },
      },
    },

    // ─── 6. Couture Atelier (Dossier + Bespoke Construction) ───
    {
      data: {
        title: "Couture Atelier",
        category: "imagine",
        status: "published",
        excerpt:
          "Bespoke garments crafted from your personal dossier — the mandatory starting point is your personal mannequin.",
        format: "studio",
        duration: "3–6 weeks per garment",
        pricing: { eur: 500, uah: 20000 },
        featured: true,
        heroImage: m.couture_atelier,
        description:
          "The realization through atelier craft. Every journey begins with the Dossier — your personal mannequin, the mandatory first step. From there, we construct bespoke garments using couture techniques: dress (€500–700), jacket (€600–800), hourly atelier rate €25/hr. Available in-studio or via remote construction with digital fittings.",
        process: [
          {
            title: "The Dossier (Personal Mannequin)",
            description:
              "Mandatory starting stage: a personalized dress form that captures every nuance of your unique body geometry.",
          },
          {
            title: "Pattern Engineering",
            description:
              "Bespoke paper patterns that account for posture, movement, and your Cut Strategy findings.",
          },
          {
            title: "Toile Fitting",
            description:
              "A cotton prototype to perfect the fit before cutting the final fabric.",
          },
          {
            title: "Final Construction",
            description:
              "Construction in your chosen fabric using couture hand-finishing techniques.",
          },
        ],
        deliverables: [
          { item: "Personal Dossier (mannequin)" },
          { item: "Custom-Constructed Garment" },
          { item: "Digital Pattern Archive" },
          { item: "Care Guide & Fabric Passport" },
        ],
        layout: [
          liquidCinematicHero(m, {
            title: "@Imagine",
            subtitle: "Couture Construction",
            backgroundImage: "couture_atelier",
            foregroundImage: "product_1",
          }),
          editorialHero(m, {
            title: "Architectural Craft",
            subtitle:
              "METHODOLOGY @IMAGINE\nEvery garment begins with a Dossier — your personal architectural footprint.",
            media: "couture_atelier",
            theme: "light",
            layout: "split",
          }),
        ],
      },
      locales: {
        en: {},
        uk: {
          title: "Кутюр Ательє",
          excerpt:
            "Індивідуальні вироби за вашим досьє — обов'язковий перший крок: персональний манекен.",
          description:
            "Втілення через майстерню. Все починається з Досьє — персонального манекена. Далі — індивідуальний пошив: сукня (€500–700), піджак (€600–800), годинна ставка €25/год. Доступно в студії або дистанційно.",
          process: [
            {
              title: "Досьє (Персональний Манекен)",
              description:
                "Обов'язковий перший крок: персональна форма, що відтворює кожну нюансу вашої геометрії.",
            },
            {
              title: "Проектування Лекал",
              description:
                "Індивідуальні паперові лекала з урахуванням постави, руху та Стратегії Крою.",
            },
            {
              title: "Примірка Макета",
              description:
                "Прототип з бавовни для ідеальної посадки перед розкроєм фінальної тканини.",
            },
            {
              title: "Фінальне Виготовлення",
              description:
                "Пошив обраною тканиною з кутюрними техніками ручного оздоблення.",
            },
          ],
          deliverables: [
            { item: "Персональне Досьє (манекен)" },
            { item: "Виріб індивідуального пошиву" },
            { item: "Цифровий архів лекал" },
            { item: "Гід по догляду та паспорт тканини" },
          ],
          layout: [
            liquidCinematicHero(m, {
              title: "@Imagine",
              subtitle: "Кутюрне Виготовлення",
              backgroundImage: "couture_atelier",
              foregroundImage: "product_1",
            }),
            editorialHero(m, {
              title: "Архітектурна Майстерність",
              subtitle:
                "МЕТОДОЛОГІЯ @IMAGINE\nКожен виріб починається з Досьє — персонального архітектурного відбитка.",
              media: "couture_atelier",
              theme: "light",
              layout: "split",
            }),
          ],
        },
        ru: {
          title: "Кутюр Ателье",
          excerpt:
            "Индивидуальные изделия по вашему досье — обязательный первый шаг: персональный манекен.",
          description:
            "Воплощение через мастерскую. Всё начинается с Досье — персонального манекена. Далее — индивидуальный пошив: платье (€500–700), пиджак (€600–800), почасовая ставка €25/час. Доступно в студии или дистанционно.",
          process: [
            {
              title: "Досье (Персональный Манекен)",
              description:
                "Обязательный первый шаг: персональная форма, воспроизводящая каждый нюанс вашей геометрии.",
            },
            {
              title: "Проектирование Лекал",
              description:
                "Индивидуальные бумажные лекала с учётом осанки, движения и Стратегии Кроя.",
            },
            {
              title: "Примерка Макета",
              description:
                "Прототип из хлопка для идеальной посадки перед раскроем финальной ткани.",
            },
            {
              title: "Финальное Изготовление",
              description:
                "Пошив выбранной тканью с кутюрными техниками ручной отделки.",
            },
          ],
          deliverables: [
            { item: "Персональное Досье (манекен)" },
            { item: "Изделие индивидуального пошива" },
            { item: "Цифровой архив лекал" },
            { item: "Гид по уходу и паспорт ткани" },
          ],
          layout: [
            liquidCinematicHero(m, {
              title: "@Imagine",
              subtitle: "Кутюрное Изготовление",
              backgroundImage: "couture_atelier",
              foregroundImage: "product_1",
            }),
            editorialHero(m, {
              title: "Архитектурное Мастерство",
              subtitle:
                "МЕТОДОЛОГИЯ @IMAGINE\nКаждое изделие начинается с Досье — персонального архитектурного отпечатка.",
              media: "couture_atelier",
              theme: "light",
              layout: "split",
            }),
          ],
        },
      },
    },

    // ═══════════════════════════════════════════════════════════
    // ЯТРАНСФОРМАЦИЯ — @CREATE (3 services)
    // ═══════════════════════════════════════════════════════════

    // ─── 7. Victory Dress Workshop ─────────────────────────────
    {
      data: {
        title: "Victory Dress Workshop",
        category: "create",
        status: "published",
        excerpt:
          "Create your 'Victory Dress' alongside a designer — the dress that announces your arrival.",
        format: "studio",
        duration: "6 sessions over 4 weeks",
        pricing: { eur: 350, uah: 14000 },
        featured: true,
        heroImage: m.victory_dress_workshop,
        description:
          "Become yourself. The Victory Dress is more than a garment — it's a statement of self-reclamation. In this intimate workshop, you work alongside a designer to create your own dress: from concept and sketch through fabric selection to the final fitting. The dress that marks the moment you chose yourself.",
        process: [
          {
            title: "Concept & Sketch",
            description:
              "Defining the emotional intent and visual language of your Victory Dress.",
          },
          {
            title: "Fabric Selection",
            description:
              "Choosing the silk, the weight, the drape that will carry your intention.",
          },
          {
            title: "Pattern & Cut",
            description:
              "Drafting the pattern under guidance — learning the architecture of construction.",
          },
          {
            title: "Construction & Fitting",
            description:
              "Building the garment with professional support — each stitch intentional.",
          },
        ],
        deliverables: [
          { item: "Your Victory Dress (completed garment)" },
          { item: "Design Sketches & Process Documentation" },
          { item: "Pattern for Future Reproductions" },
        ],
        layout: [
          liquidCinematicHero(m, {
            title: "@Create",
            subtitle: "Your Victory Dress",
            backgroundImage: "victory_dress_workshop",
            foregroundImage: "editorial_1",
            revealIntensity: "bold",
          }),
          editorialHero(m, {
            title: "The Dress That Announces Your Arrival",
            subtitle:
              "METHODOLOGY @CREATE\nBe the designer of your own transformation.",
            media: "victory_dress_workshop",
            theme: "dark",
          }),
          horizontalMarquee({
            items: [
              "VICTORY",
              "CREATION",
              "TRANSFORMATION",
              "POWER",
              "BECOMING",
            ],
          }),
        ],
      },
      locales: {
        en: {},
        uk: {
          title: "Воркшоп «Сукня Перемоги»",
          excerpt:
            "Створіть свою «Сукню Перемоги» разом з дизайнером — сукню, що оголошує ваш прихід.",
          description:
            "Станьте собою. Сукня Перемоги — більше ніж одяг, це маніфест самоповернення. В цьому інтимному воркшопі ви працюєте поруч з дизайнером над створенням власної сукні.",
          process: [
            {
              title: "Концепція та Ескіз",
              description:
                "Визначення емоційного наміру та візуальної мови вашої Сукні Перемоги.",
            },
            {
              title: "Вибір Тканини",
              description:
                "Обирання шовку, ваги, драпірування, що несуть ваш намір.",
            },
            {
              title: "Патерн та Крій",
              description:
                "Креслення лекала під керівництвом — вивчення архітектури конструкції.",
            },
            {
              title: "Виготовлення та Примірка",
              description:
                "Побудова виробу з професійною підтримкою — кожен стібок з наміром.",
            },
          ],
          deliverables: [
            { item: "Ваша Сукня Перемоги (готовий виріб)" },
            { item: "Ескізи дизайну та документація процесу" },
            { item: "Лекало для майбутніх відтворень" },
          ],
          layout: [
            liquidCinematicHero(m, {
              title: "@Create",
              subtitle: "Ваша Сукня Перемоги",
              backgroundImage: "victory_dress_workshop",
              foregroundImage: "editorial_1",
              revealIntensity: "bold",
            }),
            editorialHero(m, {
              title: "Сукня, Що Оголошує Ваш Прихід",
              subtitle:
                "МЕТОДОЛОГІЯ @CREATE\nБудьте дизайнером власної трансформації.",
              media: "victory_dress_workshop",
              theme: "dark",
            }),
            horizontalMarquee({
              items: [
                "ПЕРЕМОГА",
                "ТВОРІННЯ",
                "ТРАНСФОРМАЦІЯ",
                "СИЛА",
                "СТАНОВЛЕННЯ",
              ],
            }),
          ],
        },
        ru: {
          title: "Воркшоп «Платье Победы»",
          excerpt:
            "Создайте своё «Платье Победы» вместе с дизайнером — платье, которое объявляет о вашем приходе.",
          description:
            "Станьте собой. Платье Победы — больше чем одежда, это манифест самовозвращения. В этом интимном воркшопе вы работаете рядом с дизайнером над созданием собственного платья.",
          process: [
            {
              title: "Концепция и Эскиз",
              description:
                "Определение эмоционального намерения и визуального языка вашего Платья Победы.",
            },
            {
              title: "Выбор Ткани",
              description:
                "Выбор шёлка, веса, драпировки, несущих ваше намерение.",
            },
            {
              title: "Паттерн и Крой",
              description:
                "Черчение лекала под руководством — изучение архитектуры конструкции.",
            },
            {
              title: "Изготовление и Примерка",
              description:
                "Построение изделия с профессиональной поддержкой — каждый стежок с намерением.",
            },
          ],
          deliverables: [
            { item: "Ваше Платье Победы (готовое изделие)" },
            { item: "Эскизы дизайна и документация процесса" },
            { item: "Лекало для будущих воспроизведений" },
          ],
          layout: [
            liquidCinematicHero(m, {
              title: "@Create",
              subtitle: "Ваше Платье Победы",
              backgroundImage: "victory_dress_workshop",
              foregroundImage: "editorial_1",
              revealIntensity: "bold",
            }),
            editorialHero(m, {
              title: "Платье, Которое Объявляет о Вашем Приходе",
              subtitle:
                "МЕТОДОЛОГИЯ @CREATE\nБудьте дизайнером собственной трансформации.",
              media: "victory_dress_workshop",
              theme: "dark",
            }),
            horizontalMarquee({
              items: [
                "ПОБЕДА",
                "ТВОРЕНИЕ",
                "ТРАНСФОРМАЦИЯ",
                "СИЛА",
                "СТАНОВЛЕНИЕ",
              ],
            }),
          ],
        },
      },
    },

    // ─── 8. Wholeness Photo Meditation ─────────────────────────
    {
      data: {
        title: "Wholeness Photo Meditation",
        category: "create",
        status: "published",
        excerpt:
          "A transformative photo meditation through 5 archetypes of ancient Slavic Goddesses — discovering your wholeness.",
        format: "studio",
        duration: "Full day (6 hours)",
        pricing: { eur: 200, uah: 8000 },
        featured: false,
        heroImage: m.meditation_wholeness,
        description:
          "Wholeness through archetype. A guided photo meditation experience where you embody 5 archetypes of ancient Slavic Goddesses — each representing a facet of the feminine: the Creator, the Warrior, the Healer, the Seer, the Queen. Through costume, movement, and intentional photography, you discover and integrate all parts of yourself.",
        process: [
          {
            title: "Archetype Introduction",
            description:
              "Guided meditation to connect with each of the 5 Goddess archetypes and their qualities.",
          },
          {
            title: "Costume & Styling",
            description:
              "Curated wardrobe elements for each archetype — fabrics, colors, and accessories that embody the energy.",
          },
          {
            title: "Photo Meditation",
            description:
              "Slow, intentional photography sessions for each archetype — not posing, but being.",
          },
          {
            title: "Integration Circle",
            description:
              "Reflection and integration — recognizing all five facets as parts of your whole self.",
          },
        ],
        deliverables: [
          { item: "25+ Artistic Photographs (5 per archetype)" },
          { item: "Personal Archetype Profile" },
          { item: "Digital Gallery for Personal Use" },
        ],
        layout: [
          liquidCinematicHero(m, {
            title: "@Create",
            subtitle: "Discover Your Wholeness",
            backgroundImage: "meditation_wholeness",
            foregroundImage: "meditation_1",
          }),
          editorialHero(m, {
            title: "Five Faces, One Truth",
            subtitle:
              "METHODOLOGY @CREATE\n5 archetypes. 5 facets. One whole you.",
            media: "meditation_wholeness",
            theme: "dark",
          }),
        ],
      },
      locales: {
        en: {},
        uk: {
          title: "Фотомедитація «Цілісність»",
          excerpt:
            "Трансформативна фотомедитація через 5 архетипів старослов'янських Богинь — відкриття цілісності.",
          description:
            "Цілісність через архетип. Керована фотомедитація, де ви втілюєте 5 архетипів старослов'янських Богинь — кожна представляє грань жіночого: Творчиня, Воїтелька, Цілителька, Провидиця, Цариця.",
          process: [
            {
              title: "Знайомство з Архетипами",
              description:
                "Керована медитація для з'єднання з кожним з 5 архетипів Богинь.",
            },
            {
              title: "Костюм та Стилізація",
              description:
                "Курований гардероб для кожного архетипу — тканини, кольори, аксесуари.",
            },
            {
              title: "Фотомедитація",
              description:
                "Повільна, інтенціональна фотозйомка для кожного архетипу.",
            },
            {
              title: "Коло Інтеграції",
              description:
                "Рефлексія та інтеграція — визнання п'яти граней як частин вашого цілого.",
            },
          ],
          deliverables: [
            { item: "25+ художніх фотографій (5 на архетип)" },
            { item: "Персональний профіль архетипів" },
            { item: "Цифрова галерея" },
          ],
          layout: [
            liquidCinematicHero(m, {
              title: "@Create",
              subtitle: "Відкрий Свою Цілісність",
              backgroundImage: "meditation_wholeness",
              foregroundImage: "meditation_1",
            }),
            editorialHero(m, {
              title: "П'ять Облич, Одна Істина",
              subtitle:
                "МЕТОДОЛОГІЯ @CREATE\n5 архетипів. 5 граней. Одна ціла ви.",
              media: "meditation_wholeness",
              theme: "dark",
            }),
          ],
        },
        ru: {
          title: "Фотомедитация «Целостность»",
          excerpt:
            "Трансформативная фотомедитация через 5 архетипов древнеславянских Богинь — обретение целостности.",
          description:
            "Целостность через архетип. Управляемая фотомедитация, где вы воплощаете 5 архетипов древнеславянских Богинь — каждая представляет грань женского: Творец, Воительница, Целительница, Провидица, Царица.",
          process: [
            {
              title: "Знакомство с Архетипами",
              description:
                "Управляемая медитация для соединения с каждым из 5 архетипов Богинь.",
            },
            {
              title: "Костюм и Стилизация",
              description:
                "Курированный гардероб для каждого архетипа — ткани, цвета, аксессуары.",
            },
            {
              title: "Фотомедитация",
              description:
                "Медленная, интенциональная фотосъёмка для каждого архетипа.",
            },
            {
              title: "Круг Интеграции",
              description:
                "Рефлексия и интеграция — признание пяти граней как частей вашего целого.",
            },
          ],
          deliverables: [
            { item: "25+ художественных фотографий (5 на архетип)" },
            { item: "Персональный профиль архетипов" },
            { item: "Цифровая галерея" },
          ],
          layout: [
            liquidCinematicHero(m, {
              title: "@Create",
              subtitle: "Открой Свою Целостность",
              backgroundImage: "meditation_wholeness",
              foregroundImage: "meditation_1",
            }),
            editorialHero(m, {
              title: "Пять Лиц, Одна Истина",
              subtitle:
                "МЕТОДОЛОГИЯ @CREATE\n5 архетипов. 5 граней. Одна целая вы.",
              media: "meditation_wholeness",
              theme: "dark",
            }),
          ],
        },
      },
    },

    // ─── 9. Fashion Retreat ────────────────────────────────────
    {
      data: {
        title: "Fashion Retreat",
        category: "create",
        status: "published",
        excerpt:
          "An immersive multi-day fashion experience — style, atelier, and self-discovery in a retreat setting.",
        format: "retreat",
        duration: "3 days",
        pricing: { eur: 800, uah: 32000 },
        featured: false,
        heroImage: m.fashion_retreat,
        description:
          "Become yourself, fully. A 3-day immersive retreat combining all elements of the PURITY methodology: Research workshops (color, cut), Imagine sessions (shopping strategy, atelier introduction), and Create experiences (Victory Dress concepts, Photo Meditation). Set in an inspiring location, surrounded by fabric, light, and intention.",
        process: [
          {
            title: "Day 1: Research",
            description:
              "Color Palette & Texture workshop, Cut Strategy exploration, group style discussions.",
          },
          {
            title: "Day 2: Imagine",
            description:
              "Wardrobe planning, shopping strategy, atelier techniques, fabric selection.",
          },
          {
            title: "Day 3: Create",
            description:
              "Victory Dress concept sketching, Photo Meditation session, integration ceremony.",
          },
        ],
        deliverables: [
          { item: "Personal Color Palette" },
          { item: "Cut Strategy Profile" },
          { item: "Wardrobe Concept Plan" },
          { item: "Photo Meditation Gallery" },
          { item: "Retreat Journal & Next Steps Guide" },
        ],
        layout: [
          liquidCinematicHero(m, {
            title: "@Create",
            subtitle: "The Full Immersion",
            backgroundImage: "fashion_retreat",
            foregroundImage: "retreat_wear",
          }),
          methodologyTimeline(m, {
            title: "Three Days, Three Stages",
            steps: [
              {
                stage: "research",
                title: "Day 1: @Research",
                description:
                  "Color, texture, and form — the foundation of self-knowledge.",
                media: "color_palette",
              },
              {
                stage: "imagine",
                title: "Day 2: @Imagine",
                description:
                  "From blueprint to acquisition — wardrobe strategy in action.",
                media: "shopping_luxury",
              },
              {
                stage: "create",
                title: "Day 3: @Create",
                description:
                  "Sketch, meditate, become — the transformation revealed.",
                media: "victory_dress_workshop",
              },
            ],
          }),
          editorialHero(m, {
            title: "Three Days to Yourself",
            subtitle:
              "METHODOLOGY @CREATE\nResearch. Imagine. Create. All in one transformative experience.",
            media: "fashion_retreat",
            theme: "dark",
          }),
        ],
      },
      locales: {
        en: {},
        uk: {
          title: "Фешн Ретрит",
          excerpt:
            "Імерсивний багатоденний фешн-досвід — стиль, ательє та самопізнання у форматі ретриту.",
          description:
            "Станьте собою, повністю. 3-денний імерсивний ретрит, що поєднує всі елементи методології PURITY: воркшопи Дослідження, сесії Уявлення та досвід Створення.",
          process: [
            {
              title: "День 1: Дослідження",
              description:
                "Воркшоп Палітри та Текстур, дослідження Стратегії Крою, групові обговорення.",
            },
            {
              title: "День 2: Уявлення",
              description:
                "Планування гардеробу, стратегія шопінгу, техніки ательє, вибір тканин.",
            },
            {
              title: "День 3: Створення",
              description:
                "Ескізи Сукні Перемоги, Фотомедитація, церемонія інтеграції.",
            },
          ],
          deliverables: [
            { item: "Персональна Палітра Кольорів" },
            { item: "Профіль Стратегії Крою" },
            { item: "План-концепт Гардеробу" },
            { item: "Галерея Фотомедитації" },
            { item: "Щоденник Ретриту та Гід Наступних Кроків" },
          ],
          layout: [
            liquidCinematicHero(m, {
              title: "@Create",
              subtitle: "Повне Занурення",
              backgroundImage: "fashion_retreat",
              foregroundImage: "retreat_wear",
            }),
            methodologyTimeline(m, {
              title: "Три Дні, Три Стадії",
              steps: [
                {
                  stage: "research",
                  title: "День 1: @Research",
                  description:
                    "Колір, текстура, форма — фундамент самопізнання.",
                  media: "color_palette",
                },
                {
                  stage: "imagine",
                  title: "День 2: @Imagine",
                  description:
                    "Від плану до придбання — стратегія гардеробу в дії.",
                  media: "shopping_luxury",
                },
                {
                  stage: "create",
                  title: "День 3: @Create",
                  description:
                    "Ескіз, медитація, становлення — трансформація розкрита.",
                  media: "victory_dress_workshop",
                },
              ],
            }),
            editorialHero(m, {
              title: "Три Дні для Себе",
              subtitle:
                "МЕТОДОЛОГІЯ @CREATE\nДослідження. Уявлення. Створення. Все в одному.",
              media: "fashion_retreat",
              theme: "dark",
            }),
          ],
        },
        ru: {
          title: "Фэшн Ретрит",
          excerpt:
            "Иммерсивный многодневный фэшн-опыт — стиль, ателье и самопознание в формате ретрита.",
          description:
            "Станьте собой, полностью. 3-дневный иммерсивный ретрит, объединяющий все элементы методологии PURITY: воркшопы Исследования, сессии Воображения и опыт Создания.",
          process: [
            {
              title: "День 1: Исследование",
              description:
                "Воркшоп Палитры и Текстур, исследование Стратегии Кроя, групповые обсуждения.",
            },
            {
              title: "День 2: Воображение",
              description:
                "Планирование гардероба, стратегия шопинга, техники ателье, выбор тканей.",
            },
            {
              title: "День 3: Создание",
              description:
                "Эскизы Платья Победы, Фотомедитация, церемония интеграции.",
            },
          ],
          deliverables: [
            { item: "Персональная Палитра Цветов" },
            { item: "Профиль Стратегии Кроя" },
            { item: "План-концепт Гардероба" },
            { item: "Галерея Фотомедитации" },
            { item: "Дневник Ретрита и Гид Следующих Шагов" },
          ],
          layout: [
            liquidCinematicHero(m, {
              title: "@Create",
              subtitle: "Полное Погружение",
              backgroundImage: "fashion_retreat",
              foregroundImage: "retreat_wear",
            }),
            methodologyTimeline(m, {
              title: "Три Дня, Три Стадии",
              steps: [
                {
                  stage: "research",
                  title: "День 1: @Research",
                  description:
                    "Цвет, текстура, форма — фундамент самопознания.",
                  media: "color_palette",
                },
                {
                  stage: "imagine",
                  title: "День 2: @Imagine",
                  description:
                    "От плана к приобретению — стратегия гардероба в действии.",
                  media: "shopping_luxury",
                },
                {
                  stage: "create",
                  title: "День 3: @Create",
                  description:
                    "Эскиз, медитация, становление — трансформация раскрыта.",
                  media: "victory_dress_workshop",
                },
              ],
            }),
            editorialHero(m, {
              title: "Три Дня для Себя",
              subtitle:
                "МЕТОДОЛОГИЯ @CREATE\nИсследование. Воображение. Создание. Всё в одном.",
              media: "fashion_retreat",
              theme: "dark",
            }),
          ],
        },
      },
    },
  ];
}
