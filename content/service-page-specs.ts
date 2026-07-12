import type { ServicePageSpec } from './model'

export const serviceDetailCopy: Record<string, ServicePageSpec> = {
  "personal-lookbook": {
    intro: {
      uk: "Персональний лукбук починається з консультації й переводить спостереження про силует, колір, тканини та бренди у практичну систему гардероба. Формат підходить, коли потрібні аргументовані рекомендації без обовʼязкового шопінг-супроводу.",
      ru: "Персональный лукбук начинается с консультации и переводит наблюдения о силуэте, цвете, тканях и брендах в практическую систему гардероба. Формат подходит, когда нужны аргументированные рекомендации без обязательного шопинг-сопровождения.",
      en: "The Personal Lookbook starts with a consultation and turns observations on silhouette, color, fabrics, and brands into a practical wardrobe system. It suits clients who need reasoned recommendations without mandatory shopping accompaniment.",
    },
    formatsTitle: {
      uk: "Формати роботи",
      ru: "Форматы работы",
      en: "Working formats",
    },
    formats: [
      {
        title: {
          uk: "Консультація у студії",
          ru: "Консультация в студии",
          en: "Studio consultation",
        },
        text: {
          uk: "Уточнюємо гардеробну задачу, пропорції, кольори, тканини, бренди й рівень змін, який комфортний клієнту.",
          ru: "Уточняем задачу гардероба, пропорции, цвета, ткани, бренды и комфортный для клиента уровень изменений.",
          en: "Clarify the wardrobe brief, proportions, colors, fabrics, brands, and the level of change that feels comfortable.",
        },
      },
      {
        title: {
          uk: "Виїзна консультація",
          ru: "Выездная консультация",
          en: "Offsite consultation",
        },
        text: {
          uk: "Працюємо в контексті наявного гардероба, способу життя й речей, які вже формують щоденні комплекти.",
          ru: "Работаем в контексте существующего гардероба, образа жизни и вещей, которые уже формируют повседневные комплекты.",
          en: "Work in the context of the existing wardrobe, lifestyle, and pieces already shaping everyday outfits.",
        },
      },
      {
        title: {
          uk: "Лукбук без шопінгу",
          ru: "Лукбук без шопинга",
          en: "Lookbook without shopping",
        },
        text: {
          uk: "Отримуєте персональну презентацію з напрямами крою, палітрою, тканинами, брендами й логікою майбутніх покупок.",
          ru: "Получаете персональную презентацию с направлениями кроя, палитрой, тканями, брендами и логикой будущих покупок.",
          en: "Receive a personal presentation covering cut, palette, fabrics, brands, and the logic for future purchases.",
        },
      },
    ],
    processTitle: {
      uk: "Від запиту до лукбука",
      ru: "От запроса к лукбуку",
      en: "From brief to lookbook",
    },
    process: [
      {
        title: { uk: "Бриф", ru: "Бриф", en: "Brief" },
        text: {
          uk: "Фіксуємо задачі, контекст життя, бюджет, строки й бажану глибину змін.",
          ru: "Фиксируем задачи, контекст жизни, бюджет, сроки и желаемую глубину изменений.",
          en: "Set the goals, lifestyle context, budget, timing, and desired depth of change.",
        },
      },
      {
        title: { uk: "Консультація", ru: "Консультация", en: "Consultation" },
        text: {
          uk: "Аналізуємо силует, палітру, тканини, бренди й наявні гардеробні звички.",
          ru: "Анализируем силуэт, палитру, ткани, бренды и существующие гардеробные привычки.",
          en: "Analyze silhouette, palette, fabrics, brands, and existing wardrobe habits.",
        },
      },
      {
        title: { uk: "Редактура", ru: "Редактура", en: "Edit" },
        text: {
          uk: "Стиліст відбирає референси й формує послідовну систему рекомендацій.",
          ru: "Стилист отбирает референсы и формирует последовательную систему рекомендаций.",
          en: "The stylist selects references and builds a coherent recommendation system.",
        },
      },
      {
        title: { uk: "Передача", ru: "Передача", en: "Handover" },
        text: {
          uk: "Презентуємо лукбук, пояснюємо рішення й узгоджуємо наступний практичний крок.",
          ru: "Презентуем лукбук, объясняем решения и согласовываем следующий практический шаг.",
          en: "Present the lookbook, explain the decisions, and agree on the next practical step.",
        },
      },
    ],
    outcomeTitle: {
      uk: "Що залишається у вас",
      ru: "Что остается у вас",
      en: "What you keep",
    },
    outcomeSummary: {
      uk: "Лукбук працює як довгострокова опора для комплектів і покупок, а не як одноразова добірка картинок.",
      ru: "Лукбук работает как долгосрочная опора для комплектов и покупок, а не как одноразовая подборка картинок.",
      en: "The lookbook works as a long-term reference for outfits and purchases, rather than a one-off image board.",
    },
    commercialTitle: {
      uk: "Формат і вартість",
      ru: "Формат и стоимость",
      en: "Format and pricing",
    },
    nextStepTitle: {
      uk: "Почніть із короткого запиту.",
      ru: "Начните с короткого запроса.",
      en: "Start with a short brief.",
    },
    nextStepSummary: {
      uk: "Опишіть гардеробну задачу, бажаний формат консультації та строк. Команда підтвердить обсяг роботи, поточну вартість і доступний час.",
      ru: "Опишите задачу гардероба, желаемый формат консультации и срок. Команда подтвердит объем работы, текущую стоимость и доступное время.",
      en: "Describe the wardrobe brief, preferred consultation format, and timing. The team will confirm scope, current pricing, and availability.",
    },
  },
  "realisation-support": {
    intro: {
      uk: "Супровід реалізації переводить узгоджений стилістичний напрям у конкретні речі, примірки й комплекти. До старту фіксуємо список потреб, маршрут, бюджет і формат участі клієнта, щоб шопінг залишався керованим.",
      ru: "Сопровождение реализации переводит согласованное стилевое направление в конкретные вещи, примерки и комплекты. До старта фиксируем список потребностей, маршрут, бюджет и формат участия клиента, чтобы шопинг оставался управляемым.",
      en: "Realisation Support turns an agreed style direction into specific pieces, fittings, and outfits. Before starting, we set the needs list, route, budget, and preferred level of client involvement so shopping stays controlled.",
    },
    formatsTitle: {
      uk: "Формати реалізації",
      ru: "Форматы реализации",
      en: "Realisation formats",
    },
    formats: [
      {
        title: {
          uk: "Шопінг-супровід",
          ru: "Шопинг-сопровождение",
          en: "Shopping accompaniment",
        },
        text: {
          uk: "Проходимо підготовлений маршрут разом, порівнюємо посадку й матеріали та приймаємо рішення в межах бюджету.",
          ru: "Проходим подготовленный маршрут вместе, сравниваем посадку и материалы и принимаем решения в рамках бюджета.",
          en: "Follow a prepared route together, compare fit and materials, and make decisions within the agreed budget.",
        },
      },
      {
        title: {
          uk: "Доставка образів",
          ru: "Доставка образов",
          en: "Look delivery",
        },
        text: {
          uk: "Стиліст самостійно відбирає речі й привозить готові варіанти для примірки у студії або вдома.",
          ru: "Стилист самостоятельно отбирает вещи и привозит готовые варианты для примерки в студии или дома.",
          en: "The stylist selects pieces independently and brings complete options for a studio or home fitting.",
        },
      },
      {
        title: {
          uk: "Сезонний формат",
          ru: "Сезонный формат",
          en: "Seasonal format",
        },
        text: {
          uk: "Збираємо до шести сезонних образів навколо погоджених сценаріїв, речей і рівня оновлення гардероба.",
          ru: "Собираем до шести сезонных образов вокруг согласованных сценариев, вещей и уровня обновления гардероба.",
          en: "Build up to six seasonal looks around agreed occasions, pieces, and the intended level of wardrobe renewal.",
        },
      },
    ],
    processTitle: {
      uk: "Маршрут до готових образів",
      ru: "Маршрут к готовым образам",
      en: "Route to finished looks",
    },
    process: [
      {
        title: { uk: "Список", ru: "Список", en: "List" },
        text: {
          uk: "Фіксуємо потрібні категорії речей, розміри, бюджет, строки й пріоритети.",
          ru: "Фиксируем нужные категории вещей, размеры, бюджет, сроки и приоритеты.",
          en: "Set the required categories, sizes, budget, timing, and priorities.",
        },
      },
      {
        title: { uk: "Маршрут", ru: "Маршрут", en: "Route" },
        text: {
          uk: "Стиліст готує магазини, бренди й альтернативи до початку спільної роботи.",
          ru: "Стилист готовит магазины, бренды и альтернативы до начала совместной работы.",
          en: "The stylist prepares stores, brands, and alternatives before the joint session.",
        },
      },
      {
        title: { uk: "Примірка", ru: "Примерка", en: "Fitting" },
        text: {
          uk: "Порівнюємо посадку, тканину, комплектність і роль кожної речі у гардеробі.",
          ru: "Сравниваем посадку, ткань, комплектность и роль каждой вещи в гардеробе.",
          en: "Compare fit, fabric, outfit compatibility, and the role of each piece in the wardrobe.",
        },
      },
      {
        title: { uk: "Фіналізація", ru: "Финализация", en: "Final edit" },
        text: {
          uk: "Залишаємо узгоджені покупки й готові поєднання без зайвих або дублюючих речей.",
          ru: "Оставляем согласованные покупки и готовые сочетания без лишних или дублирующих вещей.",
          en: "Keep the agreed purchases and finished combinations without redundant or duplicate pieces.",
        },
      },
    ],
    outcomeTitle: {
      uk: "Що входить у результат",
      ru: "Что входит в результат",
      en: "What the result includes",
    },
    outcomeSummary: {
      uk: "Результат — не просто покупки, а речі, перевірені приміркою та зібрані у сезонні образи відповідно до задачі й бюджету.",
      ru: "Результат — не просто покупки, а вещи, проверенные примеркой и собранные в сезонные образы в соответствии с задачей и бюджетом.",
      en: "The result is more than purchases: pieces validated through fitting and assembled into seasonal looks around the brief and budget.",
    },
    commercialTitle: {
      uk: "Формат і вартість",
      ru: "Формат и стоимость",
      en: "Format and pricing",
    },
    nextStepTitle: {
      uk: "Почніть зі списку потреб.",
      ru: "Начните со списка потребностей.",
      en: "Start with the needs list.",
    },
    nextStepSummary: {
      uk: "Опишіть потрібні речі, сезон, бюджет, формат примірки та строк. PURITY запропонує маршрут, формат супроводу й підтвердить поточну вартість.",
      ru: "Опишите нужные вещи, сезон, бюджет, формат примерки и срок. PURITY предложит маршрут, формат сопровождения и подтвердит текущую стоимость.",
      en: "Describe the required pieces, season, budget, fitting format, and timing. PURITY will propose a route, service format, and current price.",
    },
  },
  "atelier-service": {
    intro: {
      uk: "Ательє працює від індивідуальної задачі: пропорцій, способу життя, матеріалу й очікуваної посадки. До пошиття узгоджуємо ескіз, тканину, конструкцію, макет або лекала, кількість примірок і реалістичний строк.",
      ru: "Ателье работает от индивидуальной задачи: пропорций, образа жизни, материала и ожидаемой посадки. До пошива согласовываем эскиз, ткань, конструкцию, макет или лекала, количество примерок и реалистичный срок.",
      en: "The atelier starts from an individual brief: proportions, lifestyle, material, and expected fit. Before making, we agree the sketch, fabric, construction, mock-up or patterns, fitting cadence, and realistic timing.",
    },
    formatsTitle: {
      uk: "Що створює ательє",
      ru: "Что создает ателье",
      en: "What the atelier creates",
    },
    formats: [
      {
        title: { uk: "Одяг", ru: "Одежда", en: "Clothing" },
        text: {
          uk: "Сукні, костюми, пальта й окремі речі з індивідуальною конструкцією, посадкою та вибором тканини.",
          ru: "Платья, костюмы, пальто и отдельные вещи с индивидуальной конструкцией, посадкой и выбором ткани.",
          en: "Dresses, suits, coats, and individual pieces with custom construction, fit, and fabric selection.",
        },
      },
      {
        title: { uk: "Взуття", ru: "Обувь", en: "Footwear" },
        text: {
          uk: "Індивідуальна модель із погодженими пропорціями, матеріалом, деталями та сценарієм носіння.",
          ru: "Индивидуальная модель с согласованными пропорциями, материалом, деталями и сценарием носки.",
          en: "An individual model with agreed proportions, material, detailing, and intended use.",
        },
      },
      {
        title: { uk: "Аксесуари", ru: "Аксессуары", en: "Accessories" },
        text: {
          uk: "Авторські доповнення до образу, розроблені навколо конкретної речі, події або гардеробної задачі.",
          ru: "Авторские дополнения к образу, разработанные вокруг конкретной вещи, события или задачи гардероба.",
          en: "Authored additions developed around a specific garment, occasion, or wardrobe brief.",
        },
      },
    ],
    processTitle: {
      uk: "Від ескізу до посадки",
      ru: "От эскиза к посадке",
      en: "From sketch to fit",
    },
    process: [
      {
        title: {
          uk: "Бриф і мірки",
          ru: "Бриф и мерки",
          en: "Brief and measurements",
        },
        text: {
          uk: "Фіксуємо задачу, пропорції, потрібну свободу руху, подію, бюджет і бажаний строк.",
          ru: "Фиксируем задачу, пропорции, нужную свободу движения, событие, бюджет и желаемый срок.",
          en: "Set the brief, proportions, required ease of movement, occasion, budget, and desired timing.",
        },
      },
      {
        title: {
          uk: "Ескіз і тканина",
          ru: "Эскиз и ткань",
          en: "Sketch and fabric",
        },
        text: {
          uk: "Узгоджуємо силует, конструктивні деталі, фактуру, колір, підкладку й фурнітуру.",
          ru: "Согласовываем силуэт, конструктивные детали, фактуру, цвет, подкладку и фурнитуру.",
          en: "Agree the silhouette, construction details, texture, color, lining, and hardware.",
        },
      },
      {
        title: {
          uk: "Макет або лекала",
          ru: "Макет или лекала",
          en: "Mock-up or patterns",
        },
        text: {
          uk: "Перевіряємо обʼєм і баланс до фінальної роботи з основним матеріалом.",
          ru: "Проверяем объем и баланс до финальной работы с основным материалом.",
          en: "Check volume and balance before final work begins in the main material.",
        },
      },
      {
        title: { uk: "Примірки", ru: "Примерки", en: "Fittings" },
        text: {
          uk: "Коригуємо посадку й деталі до узгодженого результату, після чого завершуємо виріб.",
          ru: "Корректируем посадку и детали до согласованного результата, после чего завершаем изделие.",
          en: "Refine fit and detailing toward the agreed result, then complete the piece.",
        },
      },
    ],
    outcomeTitle: {
      uk: "Результат роботи",
      ru: "Результат работы",
      en: "The result",
    },
    outcomeSummary: {
      uk: "Фінальний виріб спирається на погоджений ескіз, матеріал і персональну конструкцію; кількість примірок визначається складністю та посадкою.",
      ru: "Финальное изделие опирается на согласованный эскиз, материал и персональную конструкцию; количество примерок определяется сложностью и посадкой.",
      en: "The finished piece follows the agreed sketch, material, and personal construction; the fitting count depends on complexity and fit.",
    },
    commercialTitle: {
      uk: "Строк і вартість",
      ru: "Срок и стоимость",
      en: "Timing and pricing",
    },
    nextStepTitle: {
      uk: "Почніть із задачі або ескізу.",
      ru: "Начните с задачи или эскиза.",
      en: "Start with a brief or sketch.",
    },
    nextStepSummary: {
      uk: "Опишіть тип виробу, подію, бажаний матеріал і строк. Після консультації PURITY запропонує конструкцію, етапи примірок і підтвердить актуальну вартість.",
      ru: "Опишите тип изделия, событие, желаемый материал и срок. После консультации PURITY предложит конструкцию, этапы примерок и подтвердит актуальную стоимость.",
      en: "Describe the piece, occasion, preferred material, and timing. After consultation, PURITY will propose the construction, fitting stages, and current price.",
    },
  },
  "wardrobe-transformation": {
    intro: {
      uk: "Трансформація починається з наявного гардероба, а не з нового списку покупок. Стиліст аналізує речі, фотографує їх, перевіряє посадку й комплектність, а потім збирає колажі образів і зрозумілі правила використання шафи.",
      ru: "Трансформация начинается с существующего гардероба, а не с нового списка покупок. Стилист анализирует вещи, фотографирует их, проверяет посадку и комплектность, а затем собирает коллажи образов и понятные правила использования шкафа.",
      en: "Transformation starts with the existing wardrobe, not a new shopping list. The stylist audits and photographs pieces, checks fit and outfit compatibility, then builds look collages and clear rules for using the closet.",
    },
    formatsTitle: {
      uk: "Фокус трансформації",
      ru: "Фокус трансформации",
      en: "Transformation focus",
    },
    formats: [
      {
        title: { uk: "Аудит шафи", ru: "Аудит шкафа", en: "Closet audit" },
        text: {
          uk: "Переглядаємо речі за посадкою, станом, актуальністю, роллю та можливістю працювати у комплектах.",
          ru: "Проверяем вещи по посадке, состоянию, актуальности, роли и способности работать в комплектах.",
          en: "Review pieces by fit, condition, relevance, role, and ability to work in outfits.",
        },
      },
      {
        title: {
          uk: "Система образів",
          ru: "Система образов",
          en: "Outfit system",
        },
        text: {
          uk: "Поєднуємо наявні речі у нові комплекти й фіксуємо їх у візуальних колажах для повторного використання.",
          ru: "Сочетаем существующие вещи в новые комплекты и фиксируем их в визуальных коллажах для повторного использования.",
          en: "Combine existing pieces into new outfits and capture them in visual collages for repeated use.",
        },
      },
      {
        title: {
          uk: "Точкові рекомендації",
          ru: "Точечные рекомендации",
          en: "Targeted recommendations",
        },
        text: {
          uk: "Визначаємо, що варто скоригувати, віддати в ательє або додати лише там, де є реальна прогалина.",
          ru: "Определяем, что стоит скорректировать, отдать в ателье или добавить только там, где есть реальный пробел.",
          en: "Identify what to alter, send to the atelier, or add only where a genuine gap remains.",
        },
      },
    ],
    processTitle: {
      uk: "Від ревізії до системи",
      ru: "От ревизии к системе",
      en: "From audit to system",
    },
    process: [
      {
        title: { uk: "Інвентаризація", ru: "Инвентаризация", en: "Inventory" },
        text: {
          uk: "Групуємо речі за категоріями, фотографуємо й фіксуємо їхній поточний стан.",
          ru: "Группируем вещи по категориям, фотографируем и фиксируем их текущее состояние.",
          en: "Group pieces by category, photograph them, and record their current condition.",
        },
      },
      {
        title: { uk: "Аналіз", ru: "Анализ", en: "Analysis" },
        text: {
          uk: "Перевіряємо посадку, кольори, пропорції, дублювання та відповідність реальним сценаріям життя.",
          ru: "Проверяем посадку, цвета, пропорции, дублирование и соответствие реальным сценариям жизни.",
          en: "Check fit, color, proportion, duplication, and relevance to real-life occasions.",
        },
      },
      {
        title: { uk: "Колажі", ru: "Коллажи", en: "Collages" },
        text: {
          uk: "Збираємо нові поєднання з речей, які вже є, і показуємо логіку кожного образу.",
          ru: "Собираем новые сочетания из вещей, которые уже есть, и показываем логику каждого образа.",
          en: "Build new combinations from existing pieces and show the logic behind each outfit.",
        },
      },
      {
        title: { uk: "Памʼятка", ru: "Памятка", en: "Guide" },
        text: {
          uk: "Передаємо правила комплектності, список доопрацювань і пріоритети майбутніх рішень.",
          ru: "Передаем правила комплектов, список доработок и приоритеты будущих решений.",
          en: "Hand over outfit rules, an alteration list, and priorities for future decisions.",
        },
      },
    ],
    outcomeTitle: {
      uk: "Що змінюється після роботи",
      ru: "Что меняется после работы",
      en: "What changes after the work",
    },
    outcomeSummary: {
      uk: "Клієнт отримує не абстрактне оновлення стилю, а каталог власних речей, готові колажі та правила, за якими гардероб легше використовувати щодня.",
      ru: "Клиент получает не абстрактное обновление стиля, а каталог собственных вещей, готовые коллажи и правила, по которым гардероб легче использовать каждый день.",
      en: "The client receives more than an abstract style refresh: a record of their pieces, finished collages, and rules that make the wardrobe easier to use every day.",
    },
    commercialTitle: {
      uk: "Обсяг і вартість",
      ru: "Объем и стоимость",
      en: "Scope and pricing",
    },
    nextStepTitle: {
      uk: "Почніть із проблеми гардероба.",
      ru: "Начните с проблемы гардероба.",
      en: "Start with the wardrobe problem.",
    },
    nextStepSummary: {
      uk: "Опишіть обсяг шафи, основні складнощі, бажаний результат і формат виїзду. PURITY уточнить тривалість ревізії, склад матеріалів і поточну вартість.",
      ru: "Опишите объем шкафа, основные сложности, желаемый результат и формат выезда. PURITY уточнит продолжительность ревизии, состав материалов и текущую стоимость.",
      en: "Describe the wardrobe size, main difficulties, desired result, and visit format. PURITY will confirm audit duration, deliverables, and current pricing.",
    },
  },
  "corporate-image": {
    intro: {
      uk: "Корпоративний імідж розглядається як окремий проєкт на перетині бренду, ролей і щоденної роботи команди. Рішення враховує контакт із клієнтом, видимість посад, комфорт руху, тканину, догляд і правила, які співробітники можуть повторювати.",
      ru: "Корпоративный имидж рассматривается как отдельный проект на пересечении бренда, ролей и ежедневной работы команды. Решение учитывает контакт с клиентом, видимость должностей, комфорт движения, ткань, уход и правила, которые сотрудники могут повторять.",
      en: "Corporate image is treated as a dedicated project across brand, role, and the team's daily work. The solution considers client contact, role visibility, movement comfort, fabric, care, and rules employees can apply consistently.",
    },
    formatsTitle: {
      uk: "Корпоративні задачі",
      ru: "Корпоративные задачи",
      en: "Corporate use cases",
    },
    formats: [
      {
        title: { uk: "Дрес-код", ru: "Дресс-код", en: "Dress code" },
        text: {
          uk: "Формуємо зрозумілі рамки для різних ролей, рівнів формальності, клієнтських контактів і внутрішніх подій.",
          ru: "Формируем понятные рамки для разных ролей, уровней формальности, клиентских контактов и внутренних событий.",
          en: "Define clear boundaries for roles, levels of formality, client contact, and internal occasions.",
        },
      },
      {
        title: { uk: "Форма", ru: "Форма", en: "Uniform" },
        text: {
          uk: "Розробляємо силует, тканину, комплектацію й деталі з урахуванням рухів, догляду та масштабу команди.",
          ru: "Разрабатываем силуэт, ткань, комплектацию и детали с учетом движений, ухода и масштаба команды.",
          en: "Develop silhouette, fabric, outfit components, and details around movement, care, and team scale.",
        },
      },
      {
        title: {
          uk: "Навчальні кейси",
          ru: "Обучающие кейсы",
          en: "Training cases",
        },
        text: {
          uk: "Пояснюємо команді логіку рішень через практичні приклади, ролі й типові робочі сценарії.",
          ru: "Объясняем команде логику решений через практические примеры, роли и типичные рабочие сценарии.",
          en: "Explain the system through practical examples, roles, and common workplace scenarios.",
        },
      },
    ],
    processTitle: {
      uk: "Етапи корпоративного проєкту",
      ru: "Этапы корпоративного проекта",
      en: "Corporate project stages",
    },
    process: [
      {
        title: { uk: "Бриф", ru: "Бриф", en: "Brief" },
        text: {
          uk: "Фіксуємо бренд, структуру команди, ролі, точки контакту з клієнтом, строки й обмеження.",
          ru: "Фиксируем бренд, структуру команды, роли, точки контакта с клиентом, сроки и ограничения.",
          en: "Set the brand context, team structure, roles, client touchpoints, timing, and constraints.",
        },
      },
      {
        title: { uk: "Дослідження", ru: "Исследование", en: "Research" },
        text: {
          uk: "Спостерігаємо за робочими сценаріями, рухами, середовищем і чинними правилами одягу.",
          ru: "Наблюдаем за рабочими сценариями, движениями, средой и действующими правилами одежды.",
          en: "Observe work scenarios, movement, environment, and existing clothing rules.",
        },
      },
      {
        title: { uk: "Розробка", ru: "Разработка", en: "Development" },
        text: {
          uk: "Формуємо силуети, матеріали, рівні комплектності, прототипи й правила для різних посад.",
          ru: "Формируем силуэты, материалы, уровни комплектности, прототипы и правила для разных должностей.",
          en: "Develop silhouettes, materials, outfit levels, prototypes, and rules for different roles.",
        },
      },
      {
        title: { uk: "Передача", ru: "Передача", en: "Handover" },
        text: {
          uk: "Передаємо погоджені матеріали, рекомендації щодо впровадження й навчальні кейси для команди.",
          ru: "Передаем согласованные материалы, рекомендации по внедрению и обучающие кейсы для команды.",
          en: "Hand over approved materials, implementation guidance, and training cases for the team.",
        },
      },
    ],
    outcomeTitle: {
      uk: "Що отримує компанія",
      ru: "Что получает компания",
      en: "What the company receives",
    },
    outcomeSummary: {
      uk: "Результат залежить від брифу: це може бути система дрес-коду, концепція форми, матеріали для різних ролей і навчальний сценарій для послідовного впровадження.",
      ru: "Результат зависит от брифа: это может быть система дресс-кода, концепция формы, материалы для разных ролей и обучающий сценарий для последовательного внедрения.",
      en: "The result depends on the brief: a dress-code system, uniform concept, role-specific materials, and a training scenario for consistent implementation.",
    },
    commercialTitle: {
      uk: "Проєктний обсяг",
      ru: "Проектный объем",
      en: "Project scope",
    },
    nextStepTitle: {
      uk: "Підготуйте корпоративний бриф.",
      ru: "Подготовьте корпоративный бриф.",
      en: "Prepare a corporate brief.",
    },
    nextStepSummary: {
      uk: "Вкажіть сферу компанії, кількість співробітників, ролі, клієнтські контакти, потрібний рівень форми або дрес-коду й строк. PURITY уточнить склад проєкту, матеріали та поточну вартість.",
      ru: "Укажите сферу компании, количество сотрудников, роли, клиентские контакты, нужный уровень формы или дресс-кода и срок. PURITY уточнит состав проекта, материалы и текущую стоимость.",
      en: "Share the company sector, team size, roles, client touchpoints, required uniform or dress-code level, and timing. PURITY will confirm project scope, materials, and current pricing.",
    },
    contactLabel: {
      uk: "Контакти",
      ru: "Контакты",
      en: "Contacts",
    },
  },
  "wardrobe-management": {
    intro: {
      uk: "Управління гардеробом — освітній сервіс для тих, хто хоче самостійно аналізувати речі, складати образи й планувати покупки. Сервіс знайомить із методом PURITY через чотири практичні теми й допомагає перевести навчання у повторюваний особистий процес.",
      ru: "Управление гардеробом — образовательный сервис для тех, кто хочет самостоятельно анализировать вещи, составлять образы и планировать покупки. Сервис знакомит с методом PURITY через четыре практические темы и помогает перевести обучение в повторяемый личный процесс.",
      en: "Wardrobe Management is an educational service for people who want to assess their own pieces, build looks, and plan purchases independently. It introduces the PURITY method through four practical topics and turns learning into a repeatable personal process.",
    },
    formatsTitle: {
      uk: "Як побудоване навчання",
      ru: "Как построено обучение",
      en: "How the learning works",
    },
    formats: [
      {
        title: {
          uk: "Освітній сервіс",
          ru: "Образовательный сервис",
          en: "Educational service",
        },
        text: {
          uk: "Практична робота з власним гардеробом, щоб навчитися приймати повсякденні стилістичні рішення самостійно.",
          ru: "Практическая работа с собственным гардеробом, чтобы научиться принимать повседневные стилевые решения самостоятельно.",
          en: "Practical work with your own wardrobe, designed to build confidence in everyday style decisions.",
        },
      },
      {
        title: {
          uk: "Курсова програма",
          ru: "Курсовая программа",
          en: "Course programme",
        },
        text: {
          uk: "Послідовність тем охоплює аудит, силует, палітру та критерії майбутніх покупок.",
          ru: "Последовательность тем охватывает аудит, силуэт, палитру и критерии будущих покупок.",
          en: "The topic sequence covers audit, silhouette, palette, and criteria for future purchases.",
        },
      },
      {
        title: {
          uk: "Формат за запитом",
          ru: "Формат по запросу",
          en: "Format by request",
        },
        text: {
          uk: "Команда підтверджує актуальний формат, склад матеріалів, строки й вартість після короткого брифу.",
          ru: "Команда подтверждает актуальный формат, состав материалов, сроки и стоимость после короткого брифа.",
          en: "The team confirms the current format, materials, timing, and price after a short brief.",
        },
      },
    ],
    processTitle: {
      uk: "Чотири навчальні теми",
      ru: "Четыре учебные темы",
      en: "Four learning topics",
    },
    process: [
      {
        title: { uk: "Аудит", ru: "Аудит", en: "Audit" },
        text: {
          uk: "Вчимося бачити склад гардероба, дублювання, прогалини й речі, які вже працюють.",
          ru: "Учимся видеть состав гардероба, дублирование, пробелы и вещи, которые уже работают.",
          en: "Learn to see wardrobe composition, duplication, gaps, and the pieces that already work.",
        },
      },
      {
        title: { uk: "Силует", ru: "Силуэт", en: "Silhouette" },
        text: {
          uk: "Розбираємо пропорції, крій і посадку, щоб аргументувати вибір речей і комплектів.",
          ru: "Разбираем пропорции, крой и посадку, чтобы аргументировать выбор вещей и комплектов.",
          en: "Study proportion, cut, and fit to make reasoned choices about pieces and outfits.",
        },
      },
      {
        title: { uk: "Палітра", ru: "Палитра", en: "Palette" },
        text: {
          uk: "Будуємо практичну логіку кольорів і поєднань для наявного та майбутнього гардероба.",
          ru: "Строим практическую логику цветов и сочетаний для существующего и будущего гардероба.",
          en: "Build a practical color and combination logic for the current and future wardrobe.",
        },
      },
      {
        title: { uk: "Покупки", ru: "Покупки", en: "Buying" },
        text: {
          uk: "Формуємо критерії, за якими нова річ доповнює систему, а не створює новий випадковий набір.",
          ru: "Формируем критерии, по которым новая вещь дополняет систему, а не создает новый случайный набор.",
          en: "Define criteria so each new piece strengthens the system instead of creating another isolated set.",
        },
      },
    ],
    outcomeTitle: {
      uk: "Практичний результат",
      ru: "Практический результат",
      en: "Practical outcome",
    },
    outcomeSummary: {
      uk: "Після навчання залишається власна логіка ревізії, комплектування й покупок, яку можна повторювати при зміні сезону або задач.",
      ru: "После обучения остается собственная логика ревизии, составления комплектов и покупок, которую можно повторять при смене сезона или задач.",
      en: "The learning leaves you with your own repeatable logic for review, outfit building, and purchases as seasons or needs change.",
    },
    commercialTitle: {
      uk: "Участь і вартість",
      ru: "Участие и стоимость",
      en: "Participation and pricing",
    },
    nextStepTitle: {
      uk: "Оберіть навчальний наступний крок.",
      ru: "Выберите следующий учебный шаг.",
      en: "Choose your next learning step.",
    },
    nextStepSummary: {
      uk: "Опишіть, що саме складно у самостійній роботі з гардеробом і який результат потрібен. PURITY запропонує актуальний формат сервісу або повну курсову програму.",
      ru: "Опишите, что именно сложно в самостоятельной работе с гардеробом и какой результат нужен. PURITY предложит актуальный формат сервиса или полную курсовую программу.",
      en: "Describe what is difficult about managing your wardrobe independently and the result you need. PURITY will suggest the current service format or the full course programme.",
    },
    courseLabel: {
      uk: "Переглянути програму курсу",
      ru: "Посмотреть программу курса",
      en: "View the course programme",
    },
  },
  "capsule-collection": {
    intro: {
      uk: "Капсульний напрям PURITY поєднує готові авторські речі з консультацією стиліста, приміркою та можливістю обговорити індивідуальну модель. Наявність, розмір, матеріал і актуальна вартість кожної речі підтверджуються персонально за запитом.",
      ru: "Капсульное направление PURITY объединяет готовые авторские вещи с консультацией стилиста, примеркой и возможностью обсудить индивидуальную модель. Наличие, размер, материал и актуальная стоимость каждой вещи подтверждаются персонально по запросу.",
      en: "The PURITY capsule direction combines authored ready pieces with stylist guidance, fitting, and the option to discuss a custom model. Availability, size, material, and current price are confirmed individually by request.",
    },
    formatsTitle: {
      uk: "Формати знайомства з капсулою",
      ru: "Форматы знакомства с капсулой",
      en: "Ways to explore the capsule",
    },
    formats: [
      {
        title: { uk: "Готові речі", ru: "Готовые вещи", en: "Ready pieces" },
        text: {
          uk: "Запитайте про конкретну модель: команда перевірить поточну наявність, розмір, матеріал і ціну.",
          ru: "Запросите конкретную модель: команда проверит текущее наличие, размер, материал и цену.",
          en: "Ask about a specific model and the team will check current availability, size, material, and price.",
        },
      },
      {
        title: {
          uk: "Зустріч зі стилістом",
          ru: "Встреча со стилистом",
          en: "Stylist meeting",
        },
        text: {
          uk: "Розглядаємо речі в контексті вашого гардероба, сценаріїв носіння та потрібної комплектності.",
          ru: "Рассматриваем вещи в контексте вашего гардероба, сценариев носки и нужной комплектности.",
          en: "Review pieces in the context of your wardrobe, wear scenarios, and the capsule depth you need.",
        },
      },
      {
        title: {
          uk: "Індивідуальна модель",
          ru: "Индивидуальная модель",
          en: "Custom model",
        },
        text: {
          uk: "Обговорюємо силует, тканину, примірку й строки як окремий ательє-запит; можливість виконання підтверджується після брифу.",
          ru: "Обсуждаем силуэт, ткань, примерку и сроки как отдельный ателье-запрос; возможность выполнения подтверждается после брифа.",
          en: "Discuss silhouette, fabric, fitting, and timing as a separate atelier request, confirmed after the brief.",
        },
      },
    ],
    processTitle: {
      uk: "Від запиту до речі",
      ru: "От запроса к вещи",
      en: "From inquiry to piece",
    },
    process: [
      {
        title: { uk: "Запит", ru: "Запрос", en: "Inquiry" },
        text: {
          uk: "Вкажіть модель або задачу, бажаний розмір, формат примірки та строк.",
          ru: "Укажите модель или задачу, желаемый размер, формат примерки и срок.",
          en: "Share the model or need, preferred size, fitting format, and timing.",
        },
      },
      {
        title: {
          uk: "Підтвердження",
          ru: "Подтверждение",
          en: "Availability check",
        },
        text: {
          uk: "PURITY перевіряє наявність, матеріал, параметри й актуальну вартість та відповідає персонально.",
          ru: "PURITY проверяет наличие, материал, параметры и актуальную стоимость и отвечает персонально.",
          en: "PURITY checks availability, material, specifications, and current price, then responds personally.",
        },
      },
      {
        title: { uk: "Примірка", ru: "Примерка", en: "Fitting" },
        text: {
          uk: "Узгоджуємо зустріч у студії, виїзну примірку або консультацію щодо індивідуальної моделі.",
          ru: "Согласовываем встречу в студии, выездную примерку или консультацию по индивидуальной модели.",
          en: "Arrange a studio meeting, mobile fitting, or consultation for a custom model.",
        },
      },
      {
        title: { uk: "Рішення", ru: "Решение", en: "Decision" },
        text: {
          uk: "Підтверджуємо обрану річ або індивідуальний обсяг, оплату та наступний погоджений крок.",
          ru: "Подтверждаем выбранную вещь или индивидуальный объем, оплату и следующий согласованный шаг.",
          en: "Confirm the selected piece or custom scope, payment, and the agreed next step.",
        },
      },
    ],
    outcomeTitle: {
      uk: "Контекст, а не випадкова покупка",
      ru: "Контекст, а не случайная покупка",
      en: "Context, not an isolated purchase",
    },
    outcomeSummary: {
      uk: "Річ розглядається разом із матеріалом, посадкою та сценаріями носіння, щоб доповнити гардероб і працювати в кількох комплектах.",
      ru: "Вещь рассматривается вместе с материалом, посадкой и сценариями носки, чтобы дополнить гардероб и работать в нескольких комплектах.",
      en: "Each piece is considered with its material, fit, and wear scenarios so it supports the wardrobe across multiple outfits.",
    },
    commercialTitle: {
      uk: "Наявність і вартість",
      ru: "Наличие и стоимость",
      en: "Availability and pricing",
    },
    nextStepTitle: {
      uk: "Надішліть запит на річ або формат.",
      ru: "Отправьте запрос на вещь или формат.",
      en: "Send an item or format inquiry.",
    },
    nextStepSummary: {
      uk: "Назвіть модель, розмір і зручний формат примірки або коротко опишіть капсульну задачу. Команда відповість щодо реальної наявності, вартості й наступного кроку.",
      ru: "Назовите модель, размер и удобный формат примерки или кратко опишите капсульную задачу. Команда ответит по реальному наличию, стоимости и следующему шагу.",
      en: "Name the model, size, and preferred fitting format, or briefly describe the capsule need. The team will respond with actual availability, pricing, and the next step.",
    },
    collectionLabel: {
      uk: "Переглянути PURITY Capsule",
      ru: "Посмотреть PURITY Capsule",
      en: "View PURITY Capsule",
    },
  },
}
