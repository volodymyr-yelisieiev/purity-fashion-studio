/**
 * Posts content registry — pure data, no Payload calls.
 */
import type { MediaMap, SeedEntry } from "../types";
import { editorialHero, mediaGrid, horizontalMarquee } from "../block-builders";

export function getPostEntries(m: MediaMap): SeedEntry[] {
  return [
    // 1. Editorial — Color Theory
    {
      data: {
        title: "The Architecture of Color: Why Your Palette Matters",
        status: "published",
        heroImage: m.color_palette,
        excerpt:
          "Color is not decoration — it is architecture. Understanding the science behind your personal palette unlocks a new level of intentional dressing.",
        author: "Vika Veda",
        publishedAt: "2025-01-15T10:00:00.000Z",
        category: "editorial",
        tags: [{ tag: "color" }, { tag: "methodology" }, { tag: "research" }],
        layout: [
          editorialHero(m, {
            title: "The Architecture of Color",
            subtitle: "Why your chromatic identity is the foundation of style",
            media: "color_palette",
            theme: "parchment",
          }),
          mediaGrid(m, {
            title: "The Draping Process",
            columns: "2",
            items: [
              {
                media: "silk_textures",
                caption: "Silk swatches against skin",
                aspectRatio: "portrait",
              },
              {
                media: "color_palette",
                caption: "Personal palette analysis",
                aspectRatio: "portrait",
              },
            ],
          }),
          horizontalMarquee({
            items: ["TEMPERATURE", "DEPTH", "CHROMA", "HARMONY", "PRECISION"],
          }),
        ],
      },
      locales: {
        en: {},
        uk: {
          title: "Архітектура Кольору: Чому Ваша Палітра Має Значення",
          excerpt:
            "Колір — це не декорація, а архітектура. Розуміння науки вашої персональної палітри відкриває новий рівень свідомого одягання.",
          layout: [
            editorialHero(m, {
              title: "Архітектура Кольору",
              subtitle: "Чому ваша хроматична ідентичність — основа стилю",
              media: "color_palette",
              theme: "parchment",
            }),
            mediaGrid(m, {
              title: "Процес Драпірування",
              columns: "2",
              items: [
                {
                  media: "silk_textures",
                  caption: "Шовкові зразки на шкірі",
                  aspectRatio: "portrait",
                },
                {
                  media: "color_palette",
                  caption: "Аналіз персональної палітри",
                  aspectRatio: "portrait",
                },
              ],
            }),
            horizontalMarquee({
              items: [
                "ТЕМПЕРАТУРА",
                "ГЛИБИНА",
                "ХРОМА",
                "ГАРМОНІЯ",
                "ТОЧНІСТЬ",
              ],
            }),
          ],
        },
        ru: {
          title: "Архитектура Цвета: Почему Ваша Палитра Имеет Значение",
          excerpt:
            "Цвет — это не декорация, а архитектура. Понимание науки вашей персональной палитры открывает новый уровень осознанного одевания.",
          layout: [
            editorialHero(m, {
              title: "Архитектура Цвета",
              subtitle: "Почему ваша хроматическая идентичность — основа стиля",
              media: "color_palette",
              theme: "parchment",
            }),
            mediaGrid(m, {
              title: "Процесс Драпирования",
              columns: "2",
              items: [
                {
                  media: "silk_textures",
                  caption: "Шёлковые образцы на коже",
                  aspectRatio: "portrait",
                },
                {
                  media: "color_palette",
                  caption: "Анализ персональной палитры",
                  aspectRatio: "portrait",
                },
              ],
            }),
            horizontalMarquee({
              items: [
                "ТЕМПЕРАТУРА",
                "ГЛУБИНА",
                "ХРОМА",
                "ГАРМОНИЯ",
                "ТОЧНОСТЬ",
              ],
            }),
          ],
        },
      },
    },
    // 2. Behind the Scenes — Silk Dossier
    {
      data: {
        title: "Behind the Silk Dossier: From Sketch to Garment",
        status: "published",
        heroImage: m.atelier_1,
        excerpt:
          "A rare glimpse into the atelier process — how a client's personal style dossier becomes a tangible, wearable piece of art.",
        author: "Vika Veda",
        publishedAt: "2025-02-01T10:00:00.000Z",
        category: "behind-the-scenes",
        tags: [{ tag: "atelier" }, { tag: "silk" }, { tag: "process" }],
        layout: [
          editorialHero(m, {
            title: "From Sketch to Garment",
            subtitle: "Inside the creation of a bespoke silk piece",
            media: "atelier_1",
            theme: "light",
            layout: "split",
          }),
          mediaGrid(m, {
            title: "Atelier Moments",
            columns: "3",
            items: [
              {
                media: "atelier_1",
                caption: "Fabric selection",
                aspectRatio: "portrait",
              },
              {
                media: "product_1",
                caption: "Pattern draping",
                aspectRatio: "portrait",
              },
              {
                media: "silk_textures",
                caption: "Final details",
                aspectRatio: "portrait",
              },
            ],
          }),
          horizontalMarquee({
            items: ["CRAFT", "PRECISION", "SILK", "ARCHITECTURE", "INTENTION"],
          }),
        ],
      },
      locales: {
        en: {},
        uk: {
          title: "За Лаштунками Шовкового Досьє: Від Ескізу до Виробу",
          excerpt:
            "Рідкісний погляд на процес в ательє — як стильове досьє клієнта перетворюється на матеріальний витвір мистецтва.",
          layout: [
            editorialHero(m, {
              title: "Від Ескізу до Виробу",
              subtitle: "Всередині створення індивідуального шовкового виробу",
              media: "atelier_1",
              theme: "light",
              layout: "split",
            }),
            mediaGrid(m, {
              title: "Моменти Ательє",
              columns: "3",
              items: [
                {
                  media: "atelier_1",
                  caption: "Вибір тканини",
                  aspectRatio: "portrait",
                },
                {
                  media: "product_1",
                  caption: "Драпірування лекала",
                  aspectRatio: "portrait",
                },
                {
                  media: "silk_textures",
                  caption: "Фінальні деталі",
                  aspectRatio: "portrait",
                },
              ],
            }),
            horizontalMarquee({
              items: [
                "МАЙСТЕРНІСТЬ",
                "ТОЧНІСТЬ",
                "ШОВК",
                "АРХІТЕКТУРА",
                "НАМІР",
              ],
            }),
          ],
        },
        ru: {
          title: "За Кулисами Шёлкового Досье: От Эскиза до Изделия",
          excerpt:
            "Редкий взгляд на процесс в ателье — как стилевое досье клиента превращается в вещественное произведение искусства.",
          layout: [
            editorialHero(m, {
              title: "От Эскиза до Изделия",
              subtitle: "Внутри создания индивидуального шёлкового изделия",
              media: "atelier_1",
              theme: "light",
              layout: "split",
            }),
            mediaGrid(m, {
              title: "Моменты Ателье",
              columns: "3",
              items: [
                {
                  media: "atelier_1",
                  caption: "Выбор ткани",
                  aspectRatio: "portrait",
                },
                {
                  media: "product_1",
                  caption: "Драпирование лекала",
                  aspectRatio: "portrait",
                },
                {
                  media: "silk_textures",
                  caption: "Финальные детали",
                  aspectRatio: "portrait",
                },
              ],
            }),
            horizontalMarquee({
              items: [
                "МАСТЕРСТВО",
                "ТОЧНОСТЬ",
                "ШЁЛК",
                "АРХИТЕКТУРА",
                "НАМЕРЕНИЕ",
              ],
            }),
          ],
        },
      },
    },
    // 3. Style Guide — Capsule Wardrobe
    {
      data: {
        title: "The Capsule Wardrobe Manifesto: Quality Over Quantity",
        status: "published",
        heroImage: m.capsule_travel,
        excerpt:
          "Fewer pieces, infinite combinations. How to build a capsule wardrobe that travels, transforms, and tells your story.",
        author: "Vika Veda",
        publishedAt: "2025-02-15T10:00:00.000Z",
        category: "style-guide",
        tags: [{ tag: "capsule" }, { tag: "wardrobe" }, { tag: "guide" }],
        layout: [
          editorialHero(m, {
            title: "Quality Over Quantity",
            subtitle: "The capsule wardrobe as a philosophy of life",
            media: "capsule_travel",
            theme: "dark",
          }),
          mediaGrid(m, {
            title: "Capsule Essentials",
            columns: "2",
            items: [
              {
                media: "capsule_travel",
                caption: "Travel-ready capsule",
                aspectRatio: "landscape",
              },
              {
                media: "wardrobe_audit",
                caption: "Organized wardrobe",
                aspectRatio: "landscape",
              },
            ],
          }),
          editorialHero(m, {
            title: "Less, But Better",
            subtitle: "Every piece earned its place through intention",
            media: "minimal_1",
            theme: "parchment",
            layout: "overlap",
          }),
          horizontalMarquee({
            items: ["INTENTION", "REDUCTION", "ELEVATION", "CAPSULE", "PURITY"],
          }),
        ],
      },
      locales: {
        en: {},
        uk: {
          title: "Маніфест Капсульного Гардеробу: Якість Замість Кількості",
          excerpt:
            "Менше речей — безмежні комбінації. Як створити капсульний гардероб, що подорожує, трансформується та розповідає вашу історію.",
          layout: [
            editorialHero(m, {
              title: "Якість Замість Кількості",
              subtitle: "Капсульний гардероб як філософія життя",
              media: "capsule_travel",
              theme: "dark",
            }),
            mediaGrid(m, {
              title: "Капсульні Основи",
              columns: "2",
              items: [
                {
                  media: "capsule_travel",
                  caption: "Капсула для подорожей",
                  aspectRatio: "landscape",
                },
                {
                  media: "wardrobe_audit",
                  caption: "Упорядкований гардероб",
                  aspectRatio: "landscape",
                },
              ],
            }),
            editorialHero(m, {
              title: "Менше, Але Краще",
              subtitle: "Кожна річ заслужила своє місце через намір",
              media: "minimal_1",
              theme: "parchment",
              layout: "overlap",
            }),
            horizontalMarquee({
              items: ["НАМІР", "РЕДУКЦІЯ", "ПІДНЕСЕННЯ", "КАПСУЛА", "ЧИСТОТА"],
            }),
          ],
        },
        ru: {
          title: "Манифест Капсульного Гардероба: Качество Вместо Количества",
          excerpt:
            "Меньше вещей — бесконечные комбинации. Как создать капсульный гардероб, который путешествует, трансформируется и рассказывает вашу историю.",
          layout: [
            editorialHero(m, {
              title: "Качество Вместо Количества",
              subtitle: "Капсульный гардероб как философия жизни",
              media: "capsule_travel",
              theme: "dark",
            }),
            mediaGrid(m, {
              title: "Капсульные Основы",
              columns: "2",
              items: [
                {
                  media: "capsule_travel",
                  caption: "Капсула для путешествий",
                  aspectRatio: "landscape",
                },
                {
                  media: "wardrobe_audit",
                  caption: "Организованный гардероб",
                  aspectRatio: "landscape",
                },
              ],
            }),
            editorialHero(m, {
              title: "Меньше, Но Лучше",
              subtitle: "Каждая вещь заслужила своё место через намерение",
              media: "minimal_1",
              theme: "parchment",
              layout: "overlap",
            }),
            horizontalMarquee({
              items: [
                "НАМЕРЕНИЕ",
                "РЕДУКЦИЯ",
                "ВОЗВЫШЕНИЕ",
                "КАПСУЛА",
                "ЧИСТОТА",
              ],
            }),
          ],
        },
      },
    },
    // 4. Methodology — Three Stages of Style
    {
      data: {
        title: "The Three Stages of Style: Research, Imagine, Create",
        status: "published",
        heroImage: m.editorial_1,
        excerpt:
          "Our methodology is not a formula — it is a living conversation between who you are and who you are becoming. Discover the three stages that guide every PURITY transformation.",
        author: "Vika Veda",
        publishedAt: "2025-03-01T10:00:00.000Z",
        category: "methodology",
        tags: [
          { tag: "methodology" },
          { tag: "research" },
          { tag: "imagine" },
          { tag: "create" },
        ],
        layout: [
          editorialHero(m, {
            title: "Research · Imagine · Create",
            subtitle: "The three stages that guide every PURITY transformation",
            media: "editorial_1",
            theme: "dark",
          }),
          mediaGrid(m, {
            title: "The Journey",
            columns: "3",
            items: [
              {
                media: "minimal_1",
                caption: "Research: discovering your essence",
                aspectRatio: "portrait",
              },
              {
                media: "atelier_1",
                caption: "Imagine: envisioning the future you",
                aspectRatio: "portrait",
              },
              {
                media: "transformation_1",
                caption: "Create: manifesting the vision",
                aspectRatio: "portrait",
              },
            ],
          }),
          horizontalMarquee({
            items: ["RESEARCH", "IMAGINE", "CREATE", "TRANSFORM", "PURITY"],
          }),
        ],
      },
      locales: {
        en: {},
        uk: {
          title: "Три Стадії Стилю: Research, Imagine, Create",
          excerpt:
            "Наша методологія — не формула, а жива розмова між тим, хто ви є, і тим, ким ви стаєте. Відкрийте три стадії, що ведуть кожну трансформацію PURITY.",
          layout: [
            editorialHero(m, {
              title: "Research · Imagine · Create",
              subtitle: "Три стадії, що ведуть кожну трансформацію PURITY",
              media: "editorial_1",
              theme: "dark",
            }),
            mediaGrid(m, {
              title: "Подорож",
              columns: "3",
              items: [
                {
                  media: "minimal_1",
                  caption: "Research: відкриття вашої сутності",
                  aspectRatio: "portrait",
                },
                {
                  media: "atelier_1",
                  caption: "Imagine: уявлення майбутнього вас",
                  aspectRatio: "portrait",
                },
                {
                  media: "transformation_1",
                  caption: "Create: втілення бачення",
                  aspectRatio: "portrait",
                },
              ],
            }),
            horizontalMarquee({
              items: [
                "RESEARCH",
                "IMAGINE",
                "CREATE",
                "ТРАНСФОРМАЦІЯ",
                "ЧИСТОТА",
              ],
            }),
          ],
        },
        ru: {
          title: "Три Стадии Стиля: Research, Imagine, Create",
          excerpt:
            "Наша методология — не формула, а живой разговор между тем, кто вы есть, и тем, кем вы становитесь. Откройте три стадии, направляющие каждую трансформацию PURITY.",
          layout: [
            editorialHero(m, {
              title: "Research · Imagine · Create",
              subtitle: "Три стадии, направляющие каждую трансформацию PURITY",
              media: "editorial_1",
              theme: "dark",
            }),
            mediaGrid(m, {
              title: "Путешествие",
              columns: "3",
              items: [
                {
                  media: "minimal_1",
                  caption: "Research: открытие вашей сущности",
                  aspectRatio: "portrait",
                },
                {
                  media: "atelier_1",
                  caption: "Imagine: представление будущего вас",
                  aspectRatio: "portrait",
                },
                {
                  media: "transformation_1",
                  caption: "Create: воплощение видения",
                  aspectRatio: "portrait",
                },
              ],
            }),
            horizontalMarquee({
              items: [
                "RESEARCH",
                "IMAGINE",
                "CREATE",
                "ТРАНСФОРМАЦИЯ",
                "ЧИСТОТА",
              ],
            }),
          ],
        },
      },
    },
    // 5. Behind the Scenes — Victory Dress Atelier
    {
      data: {
        title: "Inside the Victory Dress Atelier",
        status: "published",
        heroImage: m.victory_dress,
        excerpt:
          "The Victory Dress is more than a garment — it is a declaration. Step inside the atelier where each dress is born from courage, craftsmanship, and an uncompromising vision.",
        author: "Vika Veda",
        publishedAt: "2025-03-15T10:00:00.000Z",
        category: "behind-the-scenes",
        tags: [
          { tag: "victory-dress" },
          { tag: "atelier" },
          { tag: "couture" },
        ],
        layout: [
          editorialHero(m, {
            title: "The Victory Dress",
            subtitle: "Where courage meets couture",
            media: "victory_dress",
            theme: "dark",
            layout: "split",
          }),
          mediaGrid(m, {
            title: "Atelier Process",
            columns: "3",
            items: [
              {
                media: "victory_dress",
                caption: "The finished statement piece",
                aspectRatio: "portrait",
              },
              {
                media: "victory_dress_workshop",
                caption: "Design workshop session",
                aspectRatio: "landscape",
              },
              {
                media: "couture_atelier",
                caption: "Hand-finishing details",
                aspectRatio: "landscape",
              },
            ],
          }),
          horizontalMarquee({
            items: ["COURAGE", "CRIMSON", "ATELIER", "VICTORY", "DECLARATION"],
          }),
        ],
      },
      locales: {
        en: {},
        uk: {
          title: "Усередині Ательє «Сукня Перемоги»",
          excerpt:
            "Сукня Перемоги — це більше, ніж вбрання. Це декларація. Зайдіть в ательє, де кожна сукня народжується з відваги, майстерності та безкомпромісного бачення.",
          layout: [
            editorialHero(m, {
              title: "Сукня Перемоги",
              subtitle: "Де відвага зустрічає кутюр",
              media: "victory_dress",
              theme: "dark",
              layout: "split",
            }),
            mediaGrid(m, {
              title: "Процес в Ательє",
              columns: "3",
              items: [
                {
                  media: "victory_dress",
                  caption: "Готовий головний виріб",
                  aspectRatio: "portrait",
                },
                {
                  media: "victory_dress_workshop",
                  caption: "Дизайн-воркшоп",
                  aspectRatio: "landscape",
                },
                {
                  media: "couture_atelier",
                  caption: "Ручне оздоблення",
                  aspectRatio: "landscape",
                },
              ],
            }),
            horizontalMarquee({
              items: ["ВІДВАГА", "КАРМІН", "АТЕЛЬЄ", "ПЕРЕМОГА", "ДЕКЛАРАЦІЯ"],
            }),
          ],
        },
        ru: {
          title: "Внутри Ателье «Платье Победы»",
          excerpt:
            "Платье Победы — это больше, чем одежда. Это декларация. Загляните в ателье, где каждое платье рождается из отваги, мастерства и бескомпромиссного видения.",
          layout: [
            editorialHero(m, {
              title: "Платье Победы",
              subtitle: "Где отвага встречает кутюр",
              media: "victory_dress",
              theme: "dark",
              layout: "split",
            }),
            mediaGrid(m, {
              title: "Процесс в Ателье",
              columns: "3",
              items: [
                {
                  media: "victory_dress",
                  caption: "Готовое главное изделие",
                  aspectRatio: "portrait",
                },
                {
                  media: "victory_dress_workshop",
                  caption: "Дизайн-воркшоп",
                  aspectRatio: "landscape",
                },
                {
                  media: "couture_atelier",
                  caption: "Ручная отделка",
                  aspectRatio: "landscape",
                },
              ],
            }),
            horizontalMarquee({
              items: ["ОТВАГА", "КАРМИН", "АТЕЛЬЕ", "ПОБЕДА", "ДЕКЛАРАЦИЯ"],
            }),
          ],
        },
      },
    },
  ];
}
