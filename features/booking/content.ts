import type { Locale } from "@/i18n/routing"

import type {
  BookingFormat,
  ContactMethod,
  InquiryType,
  PaymentCurrency,
  PaymentProvider,
} from "./schema"

type Localized<T> = Record<Locale, T>
export type PaymentStatus = "success" | "cancel" | "failure"

export const bookingCopy = {
  eyebrow: {
    uk: "Запис",
    ru: "Запись",
    en: "Booking",
  },
  title: {
    uk: "Заявка на консультацію",
    ru: "Заявка на консультацию",
    en: "Consultation request",
  },
  summary: {
    uk: "Оберіть напрям, формат і валюту. Після заявки PURITY підтвердить деталі та доступний платіжний маршрут.",
    ru: "Выберите направление, формат и валюту. После заявки PURITY подтвердит детали и доступный платёжный маршрут.",
    en: "Choose a direction, format, and currency. PURITY will confirm the details and available payment route after the request.",
  },
  privateInquiry: {
    uk: "Приватний запит",
    ru: "Частный запрос",
    en: "Private inquiry",
  },
  corporateInquiry: {
    uk: "Корпоративний запит",
    ru: "Корпоративный запрос",
    en: "Corporate inquiry",
  },
  submit: {
    uk: "Надіслати заявку",
    ru: "Отправить заявку",
    en: "Submit request",
  },
  submitting: {
    uk: "Надсилання",
    ru: "Отправка",
    en: "Submitting",
  },
  emptyService: {
    uk: "Оберіть послугу",
    ru: "Выберите услугу",
    en: "Choose a service",
  },
  successTitle: {
    uk: "Заявку прийнято",
    ru: "Заявка принята",
    en: "Request received",
  },
  successSummary: {
    uk: "Запит збережено. Платіжний маршрут і валюта показані нижче.",
    ru: "Запрос сохранён. Платёжный маршрут и валюта показаны ниже.",
    en: "The request was saved. The payment route and currency are shown below.",
  },
  errorTitle: {
    uk: "Перевірте поля",
    ru: "Проверьте поля",
    en: "Check the fields",
  },
  validationError: {
    uk: "Деякі поля потребують уточнення.",
    ru: "Некоторые поля нужно уточнить.",
    en: "Some fields need attention.",
  },
  checkout: {
    uk: "Перейти до оплати",
    ru: "Перейти к оплате",
    en: "Continue to checkout",
  },
  routingTitle: {
    uk: "Маршрутизація оплати",
    ru: "Маршрутизация оплаты",
    en: "Payment routing",
  },
  routingSummary: {
    uk: "EUR використовується для міжнародної оплати, UAH — для оплати в Україні.",
    ru: "EUR используется для международной оплаты, UAH — для оплаты в Украине.",
    en: "EUR is used for international payment and UAH for payment in Ukraine.",
  },
  contactTitle: {
    uk: "Контактні дані",
    ru: "Контактные данные",
    en: "Contact details",
  },
  paymentTitle: {
    uk: "Формат і оплата",
    ru: "Формат и оплата",
    en: "Format and payment",
  },
  stepsTitle: {
    uk: "Кроки заявки",
    ru: "Шаги заявки",
    en: "Request steps",
  },
  stepDetails: {
    uk: "Деталі запиту",
    ru: "Детали запроса",
    en: "Request details",
  },
  stepReview: {
    uk: "Перевірка й відправлення",
    ru: "Проверка и отправка",
    en: "Review and submit",
  },
  reviewTitle: {
    uk: "Перевірте заявку",
    ru: "Проверьте заявку",
    en: "Review your request",
  },
  reviewSummary: {
    uk: "Перед відправленням перевірте напрям, формат, контакт і бажаний час.",
    ru: "Перед отправкой проверьте направление, формат, контакт и желаемое время.",
    en: "Before submitting, check the direction, format, contact, and preferred time.",
  },
  notSpecified: {
    uk: "Не вказано",
    ru: "Не указано",
    en: "Not specified",
  },
} satisfies Record<string, Localized<string>>

export const bookingLabels = {
  inquiryType: {
    uk: "Тип запиту",
    ru: "Тип запроса",
    en: "Inquiry type",
  },
  serviceSlug: {
    uk: "Напрям",
    ru: "Направление",
    en: "Direction",
  },
  name: {
    uk: "Імʼя",
    ru: "Имя",
    en: "Name",
  },
  email: {
    uk: "Email",
    ru: "Email",
    en: "Email",
  },
  phone: {
    uk: "Телефон",
    ru: "Телефон",
    en: "Phone",
  },
  company: {
    uk: "Компанія",
    ru: "Компания",
    en: "Company",
  },
  format: {
    uk: "Формат",
    ru: "Формат",
    en: "Format",
  },
  contactMethod: {
    uk: "Бажаний контакт",
    ru: "Предпочтительный контакт",
    en: "Preferred contact",
  },
  budgetCurrency: {
    uk: "Валюта",
    ru: "Валюта",
    en: "Currency",
  },
  preferredAt: {
    uk: "Бажані дата й час",
    ru: "Желаемые дата и время",
    en: "Preferred date and time",
  },
  message: {
    uk: "Запит",
    ru: "Запрос",
    en: "Request",
  },
  consent: {
    uk: "Я погоджуюся, що PURITY відповість на мій запит.",
    ru: "Я соглашаюсь, что PURITY ответит на мой запрос.",
    en: "I agree that PURITY may respond to my request.",
  },
} satisfies Record<string, Localized<string>>

export const inquiryTypeLabels = {
  private: {
    uk: "Приватний",
    ru: "Частный",
    en: "Private",
  },
  corporate: {
    uk: "Корпоративний",
    ru: "Корпоративный",
    en: "Corporate",
  },
} satisfies Record<InquiryType, Localized<string>>

export const formatLabels = {
  studio: {
    uk: "Студія",
    ru: "Студия",
    en: "Studio",
  },
  online: {
    uk: "Онлайн",
    ru: "Онлайн",
    en: "Online",
  },
  atelier: {
    uk: "Ательє",
    ru: "Ателье",
    en: "Atelier",
  },
} satisfies Record<BookingFormat, Localized<string>>

export const contactMethodLabels = {
  email: {
    uk: "Email",
    ru: "Email",
    en: "Email",
  },
  phone: {
    uk: "Телефон",
    ru: "Телефон",
    en: "Phone",
  },
  viber: {
    uk: "Viber",
    ru: "Viber",
    en: "Viber",
  },
} satisfies Record<ContactMethod, Localized<string>>

export const currencyLabels = {
  EUR: {
    uk: "EUR — міжнародна оплата",
    ru: "EUR — международная оплата",
    en: "EUR — international payment",
  },
  UAH: {
    uk: "UAH — оплата в Україні",
    ru: "UAH — оплата в Украине",
    en: "UAH — payment in Ukraine",
  },
} satisfies Record<PaymentCurrency, Localized<string>>

export const providerLabels = {
  stripe: {
    uk: "Stripe",
    ru: "Stripe",
    en: "Stripe",
  },
  liqpay: {
    uk: "LiqPay",
    ru: "LiqPay",
    en: "LiqPay",
  },
} satisfies Record<PaymentProvider, Localized<string>>

export const paymentStatusCopy = {
  success: {
    eyebrow: {
      uk: "Оплата",
      ru: "Оплата",
      en: "Payment",
    },
    title: {
      uk: "Оплату підтверджено.",
      ru: "Оплата подтверждена.",
      en: "Payment confirmed.",
    },
    summary: {
      uk: "PURITY перевірить заявку та підтвердить наступний крок окремим повідомленням.",
      ru: "PURITY проверит заявку и подтвердит следующий шаг отдельным сообщением.",
      en: "PURITY will review the request and confirm the next step in a separate message.",
    },
    action: {
      uk: "Повернутися до запису",
      ru: "Вернуться к записи",
      en: "Return to booking",
    },
  },
  cancel: {
    eyebrow: {
      uk: "Оплата",
      ru: "Оплата",
      en: "Payment",
    },
    title: {
      uk: "Оплату скасовано.",
      ru: "Оплата отменена.",
      en: "Payment cancelled.",
    },
    summary: {
      uk: "Платіж не завершено. Поверніться до форми, щоб перевірити формат або валюту.",
      ru: "Платёж не завершён. Вернитесь к форме, чтобы проверить формат или валюту.",
      en: "The payment was not completed. Return to the form to review the format or currency.",
    },
    action: {
      uk: "Повернутися до форми",
      ru: "Вернуться к форме",
      en: "Return to form",
    },
  },
  failure: {
    eyebrow: {
      uk: "Оплата",
      ru: "Оплата",
      en: "Payment",
    },
    title: {
      uk: "Оплата не пройшла.",
      ru: "Оплата не прошла.",
      en: "Payment failed.",
    },
    summary: {
      uk: "Платіж не вдалося завершити. Поверніться до заявки або звʼяжіться з PURITY для допомоги.",
      ru: "Платёж не удалось завершить. Вернитесь к заявке или свяжитесь с PURITY для помощи.",
      en: "The payment could not be completed. Return to the request or contact PURITY for help.",
    },
    action: {
      uk: "Спробувати ще раз",
      ru: "Попробовать ещё раз",
      en: "Try again",
    },
  },
} satisfies Record<
  PaymentStatus,
  {
    eyebrow: Localized<string>
    title: Localized<string>
    summary: Localized<string>
    action: Localized<string>
  }
>

export const bookingErrors = {
  required: {
    uk: "Заповніть поле.",
    ru: "Заполните поле.",
    en: "Complete this field.",
  },
  email: {
    uk: "Вкажіть коректний email.",
    ru: "Укажите корректный email.",
    en: "Enter a valid email.",
  },
  message: {
    uk: "Опишіть запит щонайменше 20 символами.",
    ru: "Опишите запрос минимум 20 символами.",
    en: "Describe the request in at least 20 characters.",
  },
  consent: {
    uk: "Потрібна згода для відповіді на запит.",
    ru: "Нужно согласие для ответа на запрос.",
    en: "Consent is required so we can respond.",
  },
  companyRequired: {
    uk: "Для корпоративного запиту вкажіть компанію.",
    ru: "Для корпоративного запроса укажите компанию.",
    en: "Company is required for a corporate inquiry.",
  },
  phoneRequired: {
    uk: "Для телефону або Viber вкажіть номер.",
    ru: "Для телефона или Viber укажите номер.",
    en: "Enter a phone number for phone or Viber.",
  },
} satisfies Record<string, Localized<string>>

export function localizeBookingError(locale: Locale, message?: string) {
  if (!message) {
    return bookingErrors.required[locale]
  }

  if (message in bookingErrors) {
    return bookingErrors[message as keyof typeof bookingErrors][locale]
  }

  if (message.toLowerCase().includes("email")) {
    return bookingErrors.email[locale]
  }

  if (message.toLowerCase().includes("too small")) {
    return bookingErrors.message[locale]
  }

  return bookingErrors.required[locale]
}
