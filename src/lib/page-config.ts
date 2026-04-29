import type { Locale, ServiceArea } from './types'

export type ListingPageKey = 'research' | 'realisation' | 'transformation' | 'collections' | 'school' | 'portfolio'

type ListingRhythmStep = {
  label: string
  text: string
}

type ListingRhythmConfig = Record<Locale, readonly [ListingRhythmStep, ListingRhythmStep, ListingRhythmStep]>

type ListingPageConfig = {
  kind: string
  processMediaKey: string
  offerArea?: ServiceArea
  rhythm: ListingRhythmConfig
}

export const LISTING_PAGE_CONFIG = {
  research: {
    kind: 'service-listing',
    offerArea: 'research',
    processMediaKey: 'research',
    rhythm: {
      uk: [
        {
          label: 'Контекст',
          text: 'Як ви живете, працюєте, рухаєтесь і в яких сценаріях одяг має підтримувати вас.',
        },
        {
          label: 'Форма / колір',
          text: 'Силует, палітра, пропорції, тканини, які збирають вашу присутність.',
        },
        {
          label: 'Система',
          text: 'Lookbook, wardrobe map, покупки, доробки й правила майбутнього гардероба.',
        },
      ],
      en: [
        {
          label: 'Context',
          text: 'How you live, work, move, and which scenarios your clothes need to support.',
        },
        {
          label: 'Form / color',
          text: 'Silhouette, palette, proportions, and fabrics that assemble your presence.',
        },
        {
          label: 'System',
          text: 'Lookbook, wardrobe map, purchases, alterations, and rules for the future wardrobe.',
        },
      ],
      ru: [
        {
          label: 'Контекст',
          text: 'Как вы живете, работаете, двигаетесь и в каких сценариях одежда должна вас поддерживать.',
        },
        {
          label: 'Форма / цвет',
          text: 'Силуэт, палитра, пропорции, ткани, которые собирают ваше присутствие.',
        },
        {
          label: 'Система',
          text: 'Lookbook, wardrobe map, покупки, доработки и правила будущего гардероба.',
        },
      ],
    },
  },
  realisation: {
    kind: 'service-listing',
    offerArea: 'realisation',
    processMediaKey: 'realisation',
    rhythm: {
      uk: [
        {
          label: 'Маршрут',
          text: 'План покупок, бюджет, точки вибору, online або live-супровід.',
        },
        {
          label: 'Dossier',
          text: 'Форма, тканина, посадка, технічні рішення для atelier.',
        },
        {
          label: 'Річ',
          text: 'Фінальна покупка, fitting або couture-виріб, готовий до реального життя.',
        },
      ],
      en: [
        {
          label: 'Route',
          text: 'Shopping plan, budget, decision points, online or live support.',
        },
        {
          label: 'Dossier',
          text: 'Form, fabric, fit, and technical decisions for atelier.',
        },
        {
          label: 'Piece',
          text: 'Final purchase, fitting, or couture piece ready for real life.',
        },
      ],
      ru: [
        {
          label: 'Маршрут',
          text: 'План покупок, бюджет, точки выбора, online- или live-сопровождение.',
        },
        {
          label: 'Dossier',
          text: 'Форма, ткань, посадка, технические решения для atelier.',
        },
        {
          label: 'Вещь',
          text: 'Финальная покупка, fitting или couture-изделие, готовое к реальной жизни.',
        },
      ],
    },
  },
  transformation: {
    kind: 'transformation-listing',
    processMediaKey: 'transformation',
    rhythm: {
      uk: [
        {
          label: 'Стан',
          text: 'Що саме має змінитися: роль, присутність, тіло в кадрі, відчуття себе.',
        },
        {
          label: 'Образ',
          text: 'Одяг, архетип, тканина, світло й сценарій зйомки або практики.',
        },
        {
          label: 'Досвід',
          text: 'Курс, фотосесія або retreat як завершена трансформаційна форма.',
        },
      ],
      en: [
        {
          label: 'State',
          text: 'What exactly has to change: role, presence, the body in frame, the felt sense of self.',
        },
        {
          label: 'Image',
          text: 'Clothing, archetype, fabric, light, and the scenario for a shoot or practice.',
        },
        {
          label: 'Experience',
          text: 'Course, photoshoot, or retreat as a complete transformational format.',
        },
      ],
      ru: [
        {
          label: 'Состояние',
          text: 'Что именно должно измениться: роль, присутствие, тело в кадре, ощущение себя.',
        },
        {
          label: 'Образ',
          text: 'Одежда, архетип, ткань, свет и сценарий съемки или практики.',
        },
        {
          label: 'Опыт',
          text: 'Курс, фотосессия или retreat как завершенная трансформационная форма.',
        },
      ],
    },
  },
  collections: {
    kind: 'collection-listing',
    processMediaKey: 'collections',
    rhythm: {
      uk: [
        {
          label: 'Сценарій',
          text: 'Для якого руху, події, подорожі або внутрішнього стану існує колекція.',
        },
        {
          label: 'Матеріал',
          text: 'Тканина, блиск, вага, прозорість і тактильний ритм.',
        },
        {
          label: 'Силует',
          text: 'Форма, яка тримає тіло, жест і подальше життя речі.',
        },
      ],
      en: [
        {
          label: 'Scenario',
          text: 'Which movement, event, journey, or inner state the collection exists for.',
        },
        {
          label: 'Material',
          text: 'Fabric, sheen, weight, transparency, and tactile rhythm.',
        },
        {
          label: 'Silhouette',
          text: "The form that holds the body, gesture, and the garment's future life.",
        },
      ],
      ru: [
        {
          label: 'Сценарий',
          text: 'Для какого движения, события, путешествия или внутреннего состояния существует коллекция.',
        },
        {
          label: 'Материал',
          text: 'Ткань, блеск, вес, прозрачность и тактильный ритм.',
        },
        {
          label: 'Силуэт',
          text: 'Форма, которая держит тело, жест и дальнейшую жизнь вещи.',
        },
      ],
    },
  },
  school: {
    kind: 'course-listing',
    processMediaKey: 'school',
    rhythm: {
      uk: [
        {
          label: 'Форма',
          text: 'Побачити силует не як картинку, а як конструкцію.',
        },
        {
          label: 'Тканина',
          text: 'Працювати з draping, макетом, посадкою й рухом.',
        },
        {
          label: 'Практика',
          text: 'Зібрати власний виріб або wardrobe-system як завершений результат.',
        },
      ],
      en: [
        {
          label: 'Form',
          text: 'See silhouette not as a picture, but as construction.',
        },
        {
          label: 'Fabric',
          text: 'Work with draping, mock-up, fit, and movement.',
        },
        {
          label: 'Practice',
          text: 'Assemble your own garment or wardrobe-system as a complete result.',
        },
      ],
      ru: [
        {
          label: 'Форма',
          text: 'Увидеть силуэт не как картинку, а как конструкцию.',
        },
        {
          label: 'Ткань',
          text: 'Работать с draping, макетом, посадкой и движением.',
        },
        {
          label: 'Практика',
          text: 'Собрать собственное изделие или wardrobe-system как завершенный результат.',
        },
      ],
    },
  },
  portfolio: {
    kind: 'portfolio-listing',
    processMediaKey: 'portfolio',
    rhythm: {
      uk: [
        {
          label: 'Завдання',
          text: 'Що потрібно було змінити в гардеробі, образі, зйомці або atelier-процесі.',
        },
        {
          label: 'Метод',
          text: 'Як PURITY зібрала форму, палітру, тканину, маршрути й рішення.',
        },
        {
          label: 'Результат',
          text: 'Що змінилося для клієнта, команди або події.',
        },
      ],
      en: [
        {
          label: 'Task',
          text: 'What had to change in the wardrobe, image, shoot, or atelier process.',
        },
        {
          label: 'Method',
          text: 'How PURITY assembled form, palette, fabric, routes, and decisions.',
        },
        {
          label: 'Result',
          text: 'What changed for the client, team, or event.',
        },
      ],
      ru: [
        {
          label: 'Задача',
          text: 'Что нужно было изменить в гардеробе, образе, съемке или atelier-процессе.',
        },
        {
          label: 'Метод',
          text: 'Как PURITY собрала форму, палитру, ткань, маршруты и решения.',
        },
        {
          label: 'Результат',
          text: 'Что изменилось для клиента, команды или события.',
        },
      ],
    },
  },
} as const satisfies Record<ListingPageKey, ListingPageConfig>
