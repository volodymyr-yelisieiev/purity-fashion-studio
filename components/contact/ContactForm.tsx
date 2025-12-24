'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button, Label, Input, H3 } from '@/components/ui'

export function ContactForm() {
  const t = useTranslations('contact')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const formData = new FormData(event.currentTarget)
    const data = {
      type: 'contact',
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      subject: formData.get('subject'),
      message: formData.get('message'),
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      setIsSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="bg-neutral-50 p-8 text-center">
        <H3 className="mb-4">{t('form.submit.success')}</H3>
        <Button 
          variant="outline" 
          className="mt-6"
          onClick={() => setIsSuccess(false)}
        >
          {t('form.submit.label')}
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <div>
          <Label htmlFor="name" className="mb-2 block">{t('form.name.label')}</Label>
          <Input
            type="text"
            id="name"
            name="name"
            required
            placeholder={t('form.name.placeholder')}
          />
        </div>

        <div>
          <Label htmlFor="email" className="mb-2 block">{t('form.email.label')}</Label>
          <Input
            type="email"
            id="email"
            name="email"
            required
            placeholder={t('form.email.placeholder')}
          />
        </div>

        <div>
          <Label htmlFor="phone" className="mb-2 block">{t('form.phone.label')}</Label>
          <Input
            type="tel"
            id="phone"
            name="phone"
            placeholder={t('form.phone.placeholder')}
          />
        </div>

        <div>
          <Label htmlFor="subject" className="mb-2 block">{t('form.subject.label')}</Label>
          <div className="relative">
            <select
              id="subject"
              name="subject"
              className="w-full px-4 py-3 pr-12 border border-neutral-200 rounded-none focus:outline-none focus:border-black appearance-none bg-white text-base transition-colors cursor-pointer"
              required
            >
              <option value="">{t('form.subject.placeholder')}</option>
              <option value="consultation">{t('form.subject.options.consultation')}</option>
              <option value="services">{t('form.subject.options.services')}</option>
              <option value="atelier">{t('form.subject.options.atelier')}</option>
              <option value="other">{t('form.subject.options.other')}</option>
            </select>
            
            {/* Arrow icon */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg 
                className="w-5 h-5 text-neutral-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M19 9l-7 7-7-7" 
                />
              </svg>
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="message" className="mb-2 block">{t('form.message.label')}</Label>
          <textarea
            id="message"
            name="message"
            rows={4}
            className="w-full border border-neutral-200 bg-white px-4 py-3 text-base text-foreground transition-colors focus:border-black focus:outline-none"
            placeholder={t('form.message.placeholder')}
          />
        </div>
      </div>

      {error && (
        <p className="text-red-500 text-sm">{t('form.submit.error')}</p>
      )}

      <Button 
        type="submit" 
        className="w-full" 
        disabled={isSubmitting}
      >
        {isSubmitting ? t('form.submit.sending') : t('form.submit.label')}
      </Button>
    </form>
  )
}
