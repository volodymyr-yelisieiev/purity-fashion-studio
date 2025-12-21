'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CheckCircle, ChevronDown } from 'lucide-react'
import { Button, Input, Label } from '@/components/ui'
import type { Service } from '@/payload-types'

const bookingSchema = z.object({
  firstName: z.string().min(2, 'Required'),
  lastName: z.string().min(2, 'Required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(10, 'Invalid phone'),
  serviceId: z.string().min(1, 'Please select a service'),
  preferredDate: z.string().min(1, 'Please select a date'),
  preferredTime: z.string().min(1, 'Please select a time'),
  message: z.string().optional(),
})

type BookingFormData = z.infer<typeof bookingSchema>

interface BookingFormProps {
  locale: string
  services: Service[]
  preSelectedService: Service | null
  preSelectedCourse?: string
}

export function BookingForm({
  locale,
  services,
  preSelectedService,
  preSelectedCourse,
}: BookingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      serviceId: preSelectedService?.id?.toString() || '',
    },
  })

  const content = {
    uk: {
      firstName: 'Ім\'я',
      lastName: 'Прізвище',
      email: 'Email',
      phone: 'Телефон',
      service: 'Оберіть послугу',
      selectService: 'Оберіть послугу...',
      date: 'Бажана дата',
      time: 'Бажаний час',
      message: 'Повідомлення (необов\'язково)',
      messagePlaceholder: 'Розкажіть про ваші побажання або запитання...',
      submit: 'Записатися',
      submitting: 'Надсилаємо...',
      successTitle: 'Запит надіслано!',
      successMessage: 'Ми зв\'яжемося з вами найближчим часом для підтвердження запису.',
      courseNote: `Ви записуєтесь на курс: ${preSelectedCourse}`,
    },
    ru: {
      firstName: 'Имя',
      lastName: 'Фамилия',
      email: 'Email',
      phone: 'Телефон',
      service: 'Выберите услугу',
      selectService: 'Выберите услугу...',
      date: 'Желаемая дата',
      time: 'Желаемое время',
      message: 'Сообщение (необязательно)',
      messagePlaceholder: 'Расскажите о ваших пожеланиях или вопросах...',
      submit: 'Записаться',
      submitting: 'Отправляем...',
      successTitle: 'Заявка отправлена!',
      successMessage: 'Мы свяжемся с вами в ближайшее время для подтверждения записи.',
      courseNote: `Вы записываетесь на курс: ${preSelectedCourse}`,
    },
    en: {
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email',
      phone: 'Phone',
      service: 'Select a Service',
      selectService: 'Select a service...',
      date: 'Preferred Date',
      time: 'Preferred Time',
      message: 'Message (optional)',
      messagePlaceholder: 'Tell us about your preferences or questions...',
      submit: 'Book Now',
      submitting: 'Submitting...',
      successTitle: 'Request Sent!',
      successMessage: 'We will contact you shortly to confirm your booking.',
      courseNote: `You are enrolling in course: ${preSelectedCourse}`,
    },
  }

  const t = content[locale as keyof typeof content]

  const timeSlots = [
    '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00',
  ]

  const onSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'booking',
          ...data,
          course: preSelectedCourse,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit booking')
      }

      setIsSubmitted(true)
    } catch (e) {
      console.error('Booking error:', e)
      setError(locale === 'uk' 
        ? 'Помилка при відправці. Спробуйте ще раз.' 
        : locale === 'ru' 
          ? 'Ошибка при отправке. Попробуйте снова.' 
          : 'Failed to submit. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="text-center py-12 bg-muted">
        <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-6" />
        <span className="block text-2xl font-light mb-2 font-serif">{t.successTitle}</span>
        <p className="text-muted-foreground">{t.successMessage}</p>
      </div>
    )
  }

  // Get minimum date (tomorrow)
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split('T')[0]

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {preSelectedCourse && (
        <div className="p-4 bg-primary/10">
          <p className="text-sm">{t.courseNote}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* First Name */}
        <div className="space-y-2">
          <Label htmlFor="firstName">{t.firstName} *</Label>
          <Input
            id="firstName"
            {...register('firstName')}
            className={errors.firstName ? 'border-destructive' : ''}
          />
          {errors.firstName && (
            <p className="text-sm text-destructive">{errors.firstName.message}</p>
          )}
        </div>

        {/* Last Name */}
        <div className="space-y-2">
          <Label htmlFor="lastName">{t.lastName} *</Label>
          <Input
            id="lastName"
            {...register('lastName')}
            className={errors.lastName ? 'border-destructive' : ''}
          />
          {errors.lastName && (
            <p className="text-sm text-destructive">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">{t.email} *</Label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            className={errors.email ? 'border-destructive' : ''}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone">{t.phone} *</Label>
          <Input
            id="phone"
            type="tel"
            {...register('phone')}
            placeholder="+380"
            className={errors.phone ? 'border-destructive' : ''}
          />
          {errors.phone && (
            <p className="text-sm text-destructive">{errors.phone.message}</p>
          )}
        </div>
      </div>

      {/* Service Selection */}
      <div className="space-y-2">
        <Label htmlFor="serviceId">{t.service} *</Label>
        <div className="relative">
          <select
            id="serviceId"
            {...register('serviceId')}
            className={`w-full h-10 px-3 pr-10 border bg-background appearance-none ${errors.serviceId ? 'border-destructive' : 'border-input'}`}
          >
            <option value="">{t.selectService}</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.title}
                {service.pricing?.uah && ` - ₴${service.pricing.uah}`}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-3 h-4 w-4 opacity-50 pointer-events-none" />
        </div>
        {errors.serviceId && (
          <p className="text-sm text-destructive">{errors.serviceId.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Date */}
        <div className="space-y-2">
          <Label htmlFor="preferredDate">{t.date} *</Label>
          <Input
            id="preferredDate"
            type="date"
            min={minDate}
            {...register('preferredDate')}
            className={errors.preferredDate ? 'border-destructive' : ''}
          />
          {errors.preferredDate && (
            <p className="text-sm text-destructive">{errors.preferredDate.message}</p>
          )}
        </div>

        {/* Time */}
        <div className="space-y-2">
          <Label htmlFor="preferredTime">{t.time} *</Label>
          <div className="relative">
            <select
              id="preferredTime"
              {...register('preferredTime')}
              className={`w-full h-10 px-3 pr-10 border bg-background appearance-none ${errors.preferredTime ? 'border-destructive' : 'border-input'}`}
            >
              <option value="">--:--</option>
              {timeSlots.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-3 h-4 w-4 opacity-50 pointer-events-none" />
          </div>
          {errors.preferredTime && (
            <p className="text-sm text-destructive">{errors.preferredTime.message}</p>
          )}
        </div>
      </div>

      {/* Message */}
      <div className="space-y-2">
        <Label htmlFor="message">{t.message}</Label>
        <textarea
          id="message"
          rows={4}
          {...register('message')}
          placeholder={t.messagePlaceholder}
          className="w-full px-3 py-2 border border-input bg-background resize-none"
        />
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 bg-destructive/10 text-destructive">
          {error}
        </div>
      )}

      {/* Submit */}
      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? t.submitting : t.submit}
      </Button>
    </form>
  )
}
