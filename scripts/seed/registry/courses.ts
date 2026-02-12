/**
 * Course content registry — pure data, no Payload calls.
 *
 * Aligned to client brief: 3 courses.
 * 1. Victory Dress (group workshop format)
 * 2. Patterning / Макетирування (technical construction)
 * 3. Wardrobe Management (practical capsule management)
 */
import type { MediaMap, SeedEntry } from "../types";

export function getCourseEntries(m: MediaMap): SeedEntry[] {
  return [
    // ─── 1. Victory Dress Course ───────────────────────────
    {
      data: {
        title: "Victory Dress Course",
        category: "construction",
        status: "published",
        level: "beginner",
        format: "studio",
        featured: true,
        featuredImage: m.victory_dress_workshop,
        pricing: { eur: 350, uah: 14000 },
        duration: { value: 4, unit: "weeks" },
        excerpt:
          "Design and construct your own 'Victory Dress' — the dress that marks your transformation.",
        instructor: {
          name: "Vika Veda",
          title: "Creative Director & Pattern Engineer",
          bio: "Designer, stylist, and founder of PURITY Fashion Studio. Specializing in bespoke construction and the methodology of personal transformation through fashion.",
        },
        faq: [
          {
            question: "Do I need sewing experience?",
            answer:
              "No. This course is designed for complete beginners. You'll learn everything from concept sketch to final stitch under professional guidance.",
          },
          {
            question: "What materials are included?",
            answer:
              "The course fee covers fabric, pattern paper, notions, and access to professional sewing equipment. You bring only yourself and your intention.",
          },
          {
            question: "Can I take the pattern home to make more dresses?",
            answer:
              "Absolutely. Your pattern is yours to keep and reproduce. The knowledge is yours forever.",
          },
        ],
      },
      locales: {
        en: {},
        uk: {
          title: "Курс «Сукня Перемоги»",
          excerpt:
            "Створіть свою «Сукню Перемоги» — сукню, що знаменує вашу трансформацію.",
          instructor: {
            title: "Креативний директор та інженер лекал",
            bio: "Дизайнер, стиліст та засновниця PURITY Fashion Studio. Спеціалізується на індивідуальному пошитті та методології персональної трансформації через моду.",
          },
          faq: [
            {
              question: "Чи потрібен досвід шиття?",
              answer:
                "Ні. Курс розрахований на повних початківців. Ви навчитесь всьому від ескізу до фінального стібка під професійним керівництвом.",
            },
            {
              question: "Які матеріали включені?",
              answer:
                "Вартість курсу покриває тканину, лекальний папір, фурнітуру та доступ до професійного обладнання.",
            },
            {
              question: "Чи можу я забрати лекало додому?",
              answer: "Звичайно. Ваше лекало — ваше назавжди для відтворення.",
            },
          ],
        },
        ru: {
          title: "Курс «Платье Победы»",
          excerpt:
            "Создайте своё «Платье Победы» — платье, знаменующее вашу трансформацию.",
          instructor: {
            title: "Креативный директор и инженер лекал",
            bio: "Дизайнер, стилист и основательница PURITY Fashion Studio. Специализируется на индивидуальном пошиве и методологии персональной трансформации через моду.",
          },
          faq: [
            {
              question: "Нужен ли опыт шитья?",
              answer:
                "Нет. Курс рассчитан на полных новичков. Вы научитесь всему от эскиза до финального стежка под профессиональным руководством.",
            },
            {
              question: "Какие материалы включены?",
              answer:
                "Стоимость курса покрывает ткань, лекальную бумагу, фурнитуру и доступ к профессиональному оборудованию.",
            },
            {
              question: "Могу ли я забрать лекало домой?",
              answer:
                "Конечно. Ваше лекало — ваше навсегда для воспроизведения.",
            },
          ],
        },
      },
    },

    // ─── 2. Patterning / Макетирування ─────────────────────
    {
      data: {
        title: "Patterning: The Art of Construction",
        category: "construction",
        status: "published",
        level: "intermediate",
        format: "studio",
        featured: true,
        featuredImage: m.course_1,
        pricing: { eur: 400, uah: 16000 },
        duration: { value: 6, unit: "weeks" },
        excerpt:
          "Master the technical foundations of garment construction — from flat pattern to three-dimensional form.",
        instructor: {
          name: "Vika Veda",
          title: "Creative Director & Pattern Engineer",
          bio: "Designer, stylist, and founder of PURITY Fashion Studio. Over 15 years of experience in pattern engineering, draping, and couture construction techniques.",
        },
        faq: [
          {
            question: "Is this course suitable for aspiring designers?",
            answer:
              "Yes. Whether you want to construct for yourself or start a label, this course gives you the technical foundation of garment architecture.",
          },
          {
            question: "What will I be able to make after the course?",
            answer:
              "You'll be able to draft patterns for bodices, skirts, sleeves, and collars — the building blocks of virtually any garment.",
          },
        ],
      },
      locales: {
        en: {},
        uk: {
          title: "Макетирування: Мистецтво Конструювання",
          excerpt:
            "Опануйте технічні основи конструювання одягу — від плоского лекала до тривимірної форми.",
          instructor: {
            title: "Креативний директор та інженер лекал",
            bio: "Дизайнер, стиліст та засновниця PURITY Fashion Studio. Понад 15 років досвіду в конструюванні лекал, драпіруванні та кутюрних техніках.",
          },
          faq: [
            {
              question: "Чи підходить цей курс початківцям-дизайнерам?",
              answer:
                "Так. Незалежно від того, чи ви хочете шити для себе чи створити бренд, курс дає технічний фундамент архітектури одягу.",
            },
            {
              question: "Що я зможу конструювати після курсу?",
              answer:
                "Ви зможете креслити лекала ліфів, спідниць, рукавів та комірів — будівельні блоки будь-якого одягу.",
            },
          ],
        },
        ru: {
          title: "Макетирование: Искусство Конструирования",
          excerpt:
            "Освойте технические основы конструирования одежды — от плоского лекала до трёхмерной формы.",
          instructor: {
            title: "Креативный директор и инженер лекал",
            bio: "Дизайнер, стилист и основательница PURITY Fashion Studio. Более 15 лет опыта в конструировании лекал, драпировке и кутюрных техниках.",
          },
          faq: [
            {
              question: "Подходит ли этот курс начинающим дизайнерам?",
              answer:
                "Да. Независимо от того, хотите ли вы шить для себя или создать бренд, курс даёт техническую основу архитектуры одежды.",
            },
            {
              question: "Что я смогу конструировать после курса?",
              answer:
                "Вы сможете чертить лекала лифов, юбок, рукавов и воротников — строительные блоки любой одежды.",
            },
          ],
        },
      },
    },

    // ─── 3. Wardrobe Management ────────────────────────────
    {
      data: {
        title: "Wardrobe Management",
        category: "personal-styling",
        status: "published",
        level: "beginner",
        format: "online",
        featured: false,
        featuredImage: m.wardrobe_plan,
        pricing: { eur: 180, uah: 7200 },
        duration: { value: 4, unit: "weeks" },
        excerpt:
          "Learn the system for managing your wardrobe like a curated collection — never 'nothing to wear' again.",
        instructor: {
          name: "Vika Veda",
          title: "Creative Director",
          bio: "Founder of PURITY Fashion Studio. Specializing in capsule wardrobe architecture and the methodology of intentional dressing.",
        },
        faq: [
          {
            question: "Is this online or in-person?",
            answer:
              "This course is delivered online with weekly live sessions and recorded modules. Join from anywhere in the world.",
          },
          {
            question: "Will this work with my existing wardrobe?",
            answer:
              "Absolutely. The course teaches you to work with what you already own, then strategically fill gaps. No need to buy a new wardrobe.",
          },
          {
            question: "How is this different from the Wardrobe Review service?",
            answer:
              "The service is one-on-one and done for you. The course teaches you the system so you can manage your wardrobe independently for life.",
          },
        ],
      },
      locales: {
        en: {},
        uk: {
          title: "Управління Гардеробом",
          excerpt:
            "Навчіться системі управління гардеробом як курованою колекцією — більше ніколи «нічого вдягнути».",
          instructor: {
            title: "Креативний директор",
            bio: "Засновниця PURITY Fashion Studio. Спеціалізується на архітектурі капсульного гардеробу та методології інтенціонального одягання.",
          },
          faq: [
            {
              question: "Це онлайн чи офлайн?",
              answer:
                "Курс проводиться онлайн з щотижневими лайв-сесіями та записаними модулями. Приєднуйтесь з будь-якої точки світу.",
            },
            {
              question: "Чи спрацює це з моїм поточним гардеробом?",
              answer:
                "Безумовно. Курс навчає працювати з тим, що є, а потім стратегічно заповнювати прогалини.",
            },
            {
              question: "Чим це відрізняється від послуги Ревізії Гардеробу?",
              answer:
                "Послуга — індивідуальна та робиться для вас. Курс навчає системі, щоб ви могли управляти гардеробом самостійно все життя.",
            },
          ],
        },
        ru: {
          title: "Управление Гардеробом",
          excerpt:
            "Научитесь системе управления гардеробом как курированной коллекцией — больше никогда «нечего надеть».",
          instructor: {
            title: "Креативный директор",
            bio: "Основательница PURITY Fashion Studio. Специализируется на архитектуре капсульного гардероба и методологии интенционального одевания.",
          },
          faq: [
            {
              question: "Это онлайн или офлайн?",
              answer:
                "Курс проводится онлайн с еженедельными лайв-сессиями и записанными модулями. Присоединяйтесь из любой точки мира.",
            },
            {
              question: "Сработает ли это с моим текущим гардеробом?",
              answer:
                "Безусловно. Курс обучает работать с тем, что есть, а затем стратегически заполнять пробелы.",
            },
            {
              question: "Чем это отличается от услуги Ревизии Гардероба?",
              answer:
                "Услуга — индивидуальная и делается для вас. Курс обучает системе, чтобы вы могли управлять гардеробом самостоятельно всю жизнь.",
            },
          ],
        },
      },
    },
  ];
}
