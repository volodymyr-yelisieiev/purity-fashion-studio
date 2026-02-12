/**
 * Portfolio content registry — pure data, no Payload calls.
 */
import type { MediaMap, SeedEntry } from "../types";
import {
  liquidCinematicHero,
  methodologyTimeline,
  mediaGrid,
} from "../block-builders";

export function getPortfolioEntries(m: MediaMap): SeedEntry[] {
  return [
    // 1. Metamorphosis in Milan
    {
      data: {
        title: "Metamorphosis in Milan",
        category: "styling",
        status: "published",
        featured: true,
        mainImage: m.editorial_1,
        excerpt:
          "A complete visual reconstruction for a high-profile executive.",
        challenge:
          "Breaking the corporate mold while maintaining professional authority.",
        transformation:
          "A move from generic tailoring to custom silk separates and structured minimalism.",
        solution:
          "Introduction of architectural cuts and a muted but varying palette of silk and wool.",
        layout: [
          liquidCinematicHero(m, {
            title: "Metamorphosis",
            subtitle: "TRANSFORMATION INDEX",
            backgroundImage: "minimal_1",
            foregroundImage: "editorial_1",
          }),
          methodologyTimeline(m, {
            title: "The Metamorphosis",
            steps: [
              {
                stage: "research",
                title: "The Shell",
                description:
                  "Identifying the protective layers and social masks in the current wardrobe.",
                media: "minimal_1",
              },
              {
                stage: "imagine",
                title: "The Thread",
                description:
                  "Weaving together professional requirements with personal desires.",
                media: "transformation_1",
              },
              {
                stage: "create",
                title: "The Birth",
                description: "Emergence of the new aesthetic self.",
                media: "editorial_1",
              },
            ],
          }),
          mediaGrid(m, {
            columns: "2",
            items: [{ media: "minimal_1" }, { media: "transformation_1" }],
          }),
        ],
      },
      locales: {
        en: {},
        uk: {
          title: "Метаморфоза в Мілані",
          excerpt: "Повна візуальна реконструкція для топ-менеджера.",
          challenge:
            "Подолання корпоративних шаблонів зі збереженням професійного авторитету.",
          transformation:
            "Перехід від загального пошиття до індивідуальних шовкових елементів та структурованого мінімалізму.",
          solution:
            "Впровадження архітектурних кроїв та приглушеної палітри шовку та вовни.",
          layout: [
            liquidCinematicHero(m, {
              title: "Метаморфоза",
              subtitle: "ІНДЕКС ТРАНСФОРМАЦІЇ",
              backgroundImage: "minimal_1",
              foregroundImage: "editorial_1",
            }),
            methodologyTimeline(m, {
              title: "Метаморфоза",
              steps: [
                {
                  stage: "research",
                  title: "Оболонка",
                  description:
                    "Виявлення захисних шарів та соціальних масок у поточному гардеробі.",
                  media: "minimal_1",
                },
                {
                  stage: "imagine",
                  title: "Нитка",
                  description:
                    "Сплетіння професійних потреб з особистими бажаннями.",
                  media: "transformation_1",
                },
                {
                  stage: "create",
                  title: "Народження",
                  description: "Поява нового естетичного «я».",
                  media: "editorial_1",
                },
              ],
            }),
            mediaGrid(m, {
              columns: "2",
              items: [{ media: "minimal_1" }, { media: "transformation_1" }],
            }),
          ],
        },
        ru: {
          title: "Метаморфоза в Милане",
          excerpt: "Полная визуальная реконструкция для топ-менеджера.",
          challenge:
            "Преодоление корпоративных шаблонов с сохранением профессионального авторитета.",
          transformation:
            "Переход от массового пошива к индивидуальным шёлковым элементам и структурированному минимализму.",
          solution:
            "Внедрение архитектурных кроев и приглушённой палитры шёлка и шерсти.",
          layout: [
            liquidCinematicHero(m, {
              title: "Метаморфоза",
              subtitle: "ИНДЕКС ТРАНСФОРМАЦИИ",
              backgroundImage: "minimal_1",
              foregroundImage: "editorial_1",
            }),
            methodologyTimeline(m, {
              title: "Метаморфоза",
              steps: [
                {
                  stage: "research",
                  title: "Оболочка",
                  description:
                    "Выявление защитных слоёв и социальных масок в текущем гардеробе.",
                  media: "minimal_1",
                },
                {
                  stage: "imagine",
                  title: "Нить",
                  description:
                    "Сплетение профессиональных потребностей с личными желаниями.",
                  media: "transformation_1",
                },
                {
                  stage: "create",
                  title: "Рождение",
                  description: "Появление нового эстетического «я».",
                  media: "editorial_1",
                },
              ],
            }),
            mediaGrid(m, {
              columns: "2",
              items: [{ media: "minimal_1" }, { media: "transformation_1" }],
            }),
          ],
        },
      },
    },
    // 2. The Kyiv Capsule
    {
      data: {
        title: "The Kyiv Capsule",
        category: "wardrobe-audit",
        status: "published",
        featured: true,
        mainImage: m.capsule_travel,
        excerpt:
          "Building a 15-piece capsule wardrobe for a creative entrepreneur between Kyiv and Paris.",
        challenge:
          "A life between two cities with radically different climates and social codes.",
        transformation:
          "From two overflowing closets to one carry-on capsule that travels seamlessly.",
        solution:
          "A core of Belgian linen and merino, with two silk accent pieces for Parisian evenings.",
        layout: [
          liquidCinematicHero(m, {
            title: "The Kyiv Capsule",
            subtitle: "TWO CITIES. ONE WARDROBE.",
            backgroundImage: "capsule_travel",
            foregroundImage: "minimal_1",
          }),
          mediaGrid(m, {
            title: "The Capsule Components",
            columns: "3",
            items: [
              {
                media: "capsule_travel",
                caption: "Travel-ready core",
                aspectRatio: "portrait",
              },
              {
                media: "minimal_1",
                caption: "Daytime essentials",
                aspectRatio: "portrait",
              },
              {
                media: "product_1",
                caption: "Evening accents",
                aspectRatio: "portrait",
              },
            ],
          }),
        ],
      },
      locales: {
        en: {},
        uk: {
          title: "Київська Капсула",
          excerpt:
            "Створення капсульного гардеробу з 15 речей для креативної підприємниці між Києвом та Парижем.",
          challenge:
            "Життя між двома містами з радикально різним кліматом та соціальними кодами.",
          transformation:
            "Від двох переповнених шаф до однієї капсули ручної поклажі, що подорожує без проблем.",
          solution:
            "Основа з бельгійського льону та мериноса, з двома шовковими акцентами для паризьких вечорів.",
          layout: [
            liquidCinematicHero(m, {
              title: "Київська Капсула",
              subtitle: "ДВА МІСТА. ОДИН ГАРДЕРОБ.",
              backgroundImage: "capsule_travel",
              foregroundImage: "minimal_1",
            }),
            mediaGrid(m, {
              title: "Компоненти Капсули",
              columns: "3",
              items: [
                {
                  media: "capsule_travel",
                  caption: "Дорожня основа",
                  aspectRatio: "portrait",
                },
                {
                  media: "minimal_1",
                  caption: "Денні базові речі",
                  aspectRatio: "portrait",
                },
                {
                  media: "product_1",
                  caption: "Вечірні акценти",
                  aspectRatio: "portrait",
                },
              ],
            }),
          ],
        },
        ru: {
          title: "Киевская Капсула",
          excerpt:
            "Создание капсульного гардероба из 15 вещей для креативной предпринимательницы между Киевом и Парижем.",
          challenge:
            "Жизнь между двумя городами с радикально разным климатом и социальными кодами.",
          transformation:
            "От двух переполненных шкафов до одной капсулы ручной клади, путешествующей без проблем.",
          solution:
            "Основа из бельгийского льна и мериноса, с двумя шёлковыми акцентами для парижских вечеров.",
          layout: [
            liquidCinematicHero(m, {
              title: "Киевская Капсула",
              subtitle: "ДВА ГОРОДА. ОДИН ГАРДЕРОБ.",
              backgroundImage: "capsule_travel",
              foregroundImage: "minimal_1",
            }),
            mediaGrid(m, {
              title: "Компоненты Капсулы",
              columns: "3",
              items: [
                {
                  media: "capsule_travel",
                  caption: "Дорожная основа",
                  aspectRatio: "portrait",
                },
                {
                  media: "minimal_1",
                  caption: "Дневные базовые вещи",
                  aspectRatio: "portrait",
                },
                {
                  media: "product_1",
                  caption: "Вечерние акценты",
                  aspectRatio: "portrait",
                },
              ],
            }),
          ],
        },
      },
    },
  ];
}
