'use client'

import { useTranslations } from 'next-intl'
import { Label, Paragraph } from '@/components/ui'

export function ContactInfo() {
  const t = useTranslations('contact')

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <Label className="mb-2 block text-muted-foreground uppercase tracking-wider text-xs">
            {t('info.address.label')}
          </Label>
          <Paragraph className="text-lg">
            {t('info.address.value')}
          </Paragraph>
        </div>

        <div>
          <Label className="mb-2 block text-muted-foreground uppercase tracking-wider text-xs">
            {t('info.phone.label')}
          </Label>
          <a
            href="tel:+380991234567"
            className="text-lg text-foreground transition-colors hover:text-muted-foreground"
          >
            +380 99 123 45 67
          </a>
        </div>

        <div>
          <Label className="mb-2 block text-muted-foreground uppercase tracking-wider text-xs">
            {t('info.email.label')}
          </Label>
          <a
            href="mailto:hello@purity.studio"
            className="text-lg text-foreground transition-colors hover:text-muted-foreground"
          >
            hello@purity.studio
          </a>
        </div>

        <div>
          <Label className="mb-2 block text-muted-foreground uppercase tracking-wider text-xs">
            {t('info.hours.label')}
          </Label>
          <Paragraph className="text-lg">
            {t('info.hours.value')}
          </Paragraph>
        </div>
      </div>

      <div>
        <Label className="mb-4 block text-muted-foreground uppercase tracking-wider text-xs">
          {t('info.social.label')}
        </Label>
        <div className="flex gap-8">
          <a
            href="https://instagram.com/purity.studio"
            target="_blank"
            rel="noopener noreferrer"
            className="text-base text-foreground transition-colors hover:text-muted-foreground"
          >
            Instagram
          </a>
          <a
            href="https://t.me/purity_studio"
            target="_blank"
            rel="noopener noreferrer"
            className="text-base text-foreground transition-colors hover:text-muted-foreground"
          >
            Telegram
          </a>
        </div>
      </div>
    </div>
  )
}
