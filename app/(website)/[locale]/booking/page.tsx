import { Calendar, Clock, MapPin, Phone, Mail } from "lucide-react";
import { BookingForm } from "@/components/booking/BookingForm";
import type { Service } from "@/payload-types";
import { getPayload } from "@/lib/payload";

interface BookingPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    service?: string;
    course?: string;
  }>;
}

export default async function BookingPage({
  params,
  searchParams,
}: BookingPageProps) {
  const { locale } = await params;
  const { service: serviceSlug, course: courseSlug } = await searchParams;

  const payload = await getPayload();

  // Get available services
  const services = await payload.find({
    collection: "services",
    locale: locale as "en" | "ru" | "uk",
    limit: 50,
    sort: "title",
  });

  // Get pre-selected service if any
  let preSelectedService: Service | null = null;
  if (serviceSlug) {
    const result = await payload.find({
      collection: "services",
      where: { slug: { equals: serviceSlug } },
      locale: locale as "en" | "ru" | "uk",
      limit: 1,
    });
    if (result.docs.length > 0) {
      preSelectedService = result.docs[0] as Service;
    }
  }

  const content = {
    uk: {
      title: "Записатися на консультацію",
      subtitle: "Оберіть зручний час для вашої консультації",
      contactTitle: "Контактна інформація",
      address: "Київ, вул. Хрещатик, 1",
      workHours: "Пн-Пт: 10:00 - 19:00, Сб: 11:00 - 17:00",
      note: "Після заповнення форми ми зв'яжемося з вами протягом 24 годин для підтвердження запису.",
      unavailable:
        "Система бронювання тимчасово недоступна. Будь ласка, зв'яжіться з нами за телефоном.",
    },
    ru: {
      title: "Записаться на консультацию",
      subtitle: "Выберите удобное время для вашей консультации",
      contactTitle: "Контактная информация",
      address: "Киев, ул. Крещатик, 1",
      workHours: "Пн-Пт: 10:00 - 19:00, Сб: 11:00 - 17:00",
      note: "После заполнения формы мы свяжемся с вами в течение 24 часов для подтверждения записи.",
      unavailable:
        "Система бронирования временно недоступна. Пожалуйста, свяжитесь с нами по телефону.",
    },
    en: {
      title: "Book a Consultation",
      subtitle: "Choose a convenient time for your consultation",
      contactTitle: "Contact Information",
      address: "Kyiv, Khreshchatyk St, 1",
      workHours: "Mon-Fri: 10:00 - 19:00, Sat: 11:00 - 17:00",
      note: "After submitting the form, we will contact you within 24 hours to confirm your booking.",
      unavailable:
        "Booking system is temporarily unavailable. Please contact us by phone.",
    },
  };

  const t = content[locale as keyof typeof content] || content.en;

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <span className="block mb-4 font-serif text-3xl font-light text-foreground md:text-4xl">
            {t.title}
          </span>
          <p className="text-lg text-muted-foreground">{t.subtitle}</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <BookingForm
              locale={locale}
              services={services.docs as Service[]}
              preSelectedService={preSelectedService}
              preSelectedCourse={courseSlug}
            />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Contact Info */}
              <div className="bg-card border p-6">
                <span className="block font-serif text-xl font-light mb-4 text-foreground">
                  {t.contactTitle}
                </span>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                    <span className="text-foreground">{t.address}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                    <span className="text-foreground">{t.workHours}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                    <a
                      href="tel:+380441234567"
                      className="text-foreground hover:text-muted-foreground transition-colors"
                    >
                      +38 (044) 123-45-67
                    </a>
                  </li>
                  <li className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                    <a
                      href="mailto:booking@purity.style"
                      className="text-foreground hover:text-muted-foreground transition-colors"
                    >
                      booking@purity.style
                    </a>
                  </li>
                </ul>
              </div>

              {/* Note */}
              <div className="bg-background p-6">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                  <p className="text-sm text-muted-foreground">{t.note}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
