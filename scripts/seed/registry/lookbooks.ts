/**
 * Lookbook (Collections) content registry — pure data, no Payload calls.
 */
import type { MediaMap, SeedEntry } from "../types";

export function getLookbookEntries(m: MediaMap): SeedEntry[] {
  return [
    // 1. Victory Dress
    {
      data: {
        name: "Victory Dress",
        status: "published",
        season: "all-season",
        featured: true,
        coverImage: m.victory_dress,
        description:
          "The dress that announces your arrival. A single statement piece designed to mark the moment you chose yourself — crafted in silk, structured with intention.",
        materials:
          "100% Mulberry Silk, silk organza details, mother-of-pearl buttons",
        careInstructions:
          "Professional dry clean only. Store on padded hanger in breathable garment bag.",
        sizes: "Custom (XS–XL base + bespoke adjustments)",
        pricing: { eur: 1200, uah: 48000 },
        images: [
          {
            image: m.victory_dress,
            caption: "Victory Dress — full silhouette",
          },
          { image: m.editorial_1, caption: "Editorial styling" },
        ],
      },
      locales: {
        en: {},
        uk: {
          name: "Сукня Перемоги",
          description:
            "Сукня, що оголошує ваш прихід. Єдиний виріб-маніфест, створений на честь моменту, коли ви обрали себе — шовк, структура, намір.",
          materials:
            "100% шовк тутового шовкопряда, деталі з шовкової органзи, ґудзики з перламутру",
          careInstructions:
            "Тільки професійна хімчистка. Зберігати на м'якій вішалці у дихаючому чохлі.",
          sizes: "Індивідуально (XS–XL база + підгонка)",
          images: [
            {
              image: m.victory_dress,
              caption: "Сукня Перемоги — повний силует",
            },
            { image: m.editorial_1, caption: "Редакційна стилізація" },
          ],
        },
        ru: {
          name: "Платье Победы",
          description:
            "Платье, которое объявляет о вашем приходе. Единственное изделие-манифест, созданное в честь момента, когда вы выбрали себя — шёлк, структура, намерение.",
          materials:
            "100% шёлк тутового шелкопряда, детали из шёлковой органзы, пуговицы из перламутра",
          careInstructions:
            "Только профессиональная химчистка. Хранить на мягкой вешалке в дышащем чехле.",
          sizes: "Индивидуально (XS–XL база + подгонка)",
          images: [
            {
              image: m.victory_dress,
              caption: "Платье Победы — полный силуэт",
            },
            { image: m.editorial_1, caption: "Редакционная стилизация" },
          ],
        },
      },
    },
    // 2. Travel Capsule
    {
      data: {
        name: "Travel Capsule × Vika Veda",
        status: "published",
        season: "all-season",
        featured: true,
        coverImage: m.capsule_travel,
        description:
          "7 pieces. 21 looks. Zero compromise. A travel-ready capsule engineered for the woman who packs light but lives large. Each piece interworks with every other — silk, linen, structured knit.",
        materials: "Mulberry silk, Belgian linen, merino wool knit",
        careInstructions:
          "Machine wash cold on delicate cycle (linen/knit). Dry clean silk pieces.",
        sizes: "XS–L (standard sizing with adjustment notes)",
        pricing: { eur: 950, uah: 38000 },
        images: [
          { image: m.capsule_travel, caption: "Full capsule — flat lay" },
          { image: m.minimal_1, caption: "Look 01: Day to evening" },
        ],
      },
      locales: {
        en: {},
        uk: {
          name: "Капсула для Подорожей × Vika Veda",
          description:
            "7 речей. 21 образ. Нуль компромісів. Капсула для подорожей для жінки, що пакує легко, але живе на повну.",
          materials:
            "Шовк тутового шовкопряда, бельгійський льон, трикотаж мериноса",
          careInstructions:
            "Машинне прання для льону/трикотажу (делікатний режим). Хімчистка для шовку.",
          sizes: "XS–L (стандартні розміри з нотатками підгонки)",
          images: [
            { image: m.capsule_travel, caption: "Повна капсула — розкладка" },
            { image: m.minimal_1, caption: "Образ 01: День-вечір" },
          ],
        },
        ru: {
          name: "Капсула для Путешествий × Vika Veda",
          description:
            "7 вещей. 21 образ. Ноль компромиссов. Капсула для путешествий для женщины, которая пакует легко, но живёт на полную.",
          materials:
            "Шёлк тутового шелкопряда, бельгийский лён, трикотаж мериноса",
          careInstructions:
            "Машинная стирка для льна/трикотажа (деликатный режим). Химчистка для шёлка.",
          sizes: "XS–L (стандартные размеры с пометками подгонки)",
          images: [
            { image: m.capsule_travel, caption: "Полная капсула — раскладка" },
            { image: m.minimal_1, caption: "Образ 01: День-вечер" },
          ],
        },
      },
    },
    // 3. Silky Touches
    {
      data: {
        name: "Silky Touches",
        status: "published",
        season: "spring",
        featured: false,
        coverImage: m.silk_textures,
        description:
          "An accessory capsule in mulberry silk — scarves, pocket squares, hair ribbons, and sleep masks. Small luxuries that shift the texture of your entire day.",
        materials: "19-momme and 22-momme Mulberry Silk, hand-rolled edges",
        careInstructions:
          "Hand wash with silk detergent. Iron on low with a press cloth.",
        sizes: "One size",
        pricing: { eur: 120, uah: 4800 },
        images: [
          {
            image: m.silk_textures,
            caption: "Silk scarves — color variations",
          },
          { image: m.product_1, caption: "Detail: hand-rolled edge" },
        ],
      },
      locales: {
        en: {},
        uk: {
          name: "Шовкові Дотики",
          description:
            "Аксесуарна капсула з шовку — шарфи, хусточки, стрічки для волосся та маски для сну.",
          materials: "Шовк 19 та 22 моммі, ручна обробка країв",
          careInstructions:
            "Ручне прання з шовковим засобом. Прасувати на низькій температурі через тканину.",
          sizes: "Один розмір",
          images: [
            {
              image: m.silk_textures,
              caption: "Шовкові шарфи — колірні варіації",
            },
            { image: m.product_1, caption: "Деталь: ручна обробка краю" },
          ],
        },
        ru: {
          name: "Шёлковые Прикосновения",
          description:
            "Аксессуарная капсула из шёлка — шарфы, платки, ленты для волос и маски для сна.",
          materials: "Шёлк 19 и 22 момме, ручная обработка краёв",
          careInstructions:
            "Ручная стирка с шёлковым средством. Гладить на низкой температуре через ткань.",
          sizes: "Один размер",
          images: [
            {
              image: m.silk_textures,
              caption: "Шёлковые шарфы — цветовые вариации",
            },
            { image: m.product_1, caption: "Деталь: ручная обработка края" },
          ],
        },
      },
    },
    // 4. Retreat Wear
    {
      data: {
        name: "Retreat Wear",
        status: "published",
        season: "summer",
        featured: false,
        coverImage: m.retreat_wear,
        description:
          "Effortless linen and silk pieces for wellness retreats, coastal getaways, and mornings that don't rush. Designed to breathe, drape, and dissolve the boundary between loungewear and style.",
        materials:
          "Belgian linen, Mulberry silk charmeuse, organic cotton gauze",
        careInstructions:
          "Machine wash cold (linen). Hand wash (silk). Tumble dry low (cotton).",
        sizes: "XS–XL",
        pricing: { eur: 680, uah: 27000 },
        images: [
          { image: m.retreat_wear, caption: "Linen wrap — resort look" },
          { image: m.meditation_1, caption: "Morning ritual styling" },
        ],
      },
      locales: {
        en: {},
        uk: {
          name: "Одяг для Ретриту",
          description:
            "Невимушені лляні та шовкові речі для велнес-ретритів, прибережних поїздок та ранків без поспіху.",
          materials:
            "Бельгійський льон, шовковий шармез, органічна бавовняна марля",
          careInstructions:
            "Машинне прання (льон). Ручне прання (шовк). Сушити при низькій температурі (бавовна).",
          sizes: "XS–XL",
          images: [
            {
              image: m.retreat_wear,
              caption: "Лляний жакет — курортний образ",
            },
            { image: m.meditation_1, caption: "Ранковий ритуал стилю" },
          ],
        },
        ru: {
          name: "Одежда для Ретрита",
          description:
            "Непринуждённые льняные и шёлковые вещи для велнес-ретритов, прибрежных поездок и утр без спешки.",
          materials:
            "Бельгийский лён, шёлковый шармёз, органическая хлопковая марля",
          careInstructions:
            "Машинная стирка (лён). Ручная стирка (шёлк). Сушить при низкой температуре (хлопок).",
          sizes: "XS–XL",
          images: [
            {
              image: m.retreat_wear,
              caption: "Льняной жакет — курортный образ",
            },
            { image: m.meditation_1, caption: "Утренний ритуал стиля" },
          ],
        },
      },
    },
  ];
}
