/**
 * Settings content registry — pure data, no Payload calls.
 */
import type { GlobalSeedEntry } from "../types";

export function getSettingsEntry(): GlobalSeedEntry {
  return {
    en: {
      siteName: "PURITY Fashion Studio",
      tagline: "Premium Minimalist Editorial & Bespoke Atelier",
      description:
        "PURITY is a Kyiv-born fashion studio offering personal styling, capsule wardrobe design, and editorial consulting rooted in architectural minimalism.",
      contact: {
        email: "atelier@purity.studio",
        phone: "+380990000000",
        address: "Kyiv, Ukraine | Paris, France",
        workingHours: "Mon–Fri 10:00–19:00 (EET)",
      },
      social: {
        instagram: "https://instagram.com/purity",
      },
    },
    uk: {
      tagline: "Преміальний мінімалістичний едиторіал та ательє на замовлення",
      description:
        "PURITY — київська фешн-студія, що пропонує персональний стайлінг, дизайн капсульного гардеробу та едиторіальний консалтинг в дусі архітектурного мінімалізму.",
      contact: {
        address: "Київ, Україна | Париж, Франція",
        workingHours: "Пн–Пт 10:00–19:00 (за Києвом)",
      },
    },
    ru: {
      tagline: "Премиальный минималистичный эдиториал и ателье на заказ",
      description:
        "PURITY — киевская фешн-студия, предлагающая персональный стайлинг, дизайн капсульного гардероба и эдиториальный консалтинг в духе архитектурного минимализма.",
      contact: {
        address: "Киев, Украина | Париж, Франция",
        workingHours: "Пн–Пт 10:00–19:00 (по Киеву)",
      },
    },
  };
}
