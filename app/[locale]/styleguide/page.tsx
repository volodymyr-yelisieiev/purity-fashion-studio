import { ListIcon as MenuIcon, XIcon } from "@phosphor-icons/react/dist/ssr"
import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { notFound } from "next/navigation"

import {
  FeatureList,
  OfferCard,
  Section,
  ServiceCard,
} from "@/components/purity"
import { SiteFooter, SiteHeader } from "@/components/cms-site-shell"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { hasLocale, type Locale } from "@/i18n/routing"

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

type StyleguidePageProps = {
  params: Promise<{ locale: string }>
}

const closeLabel = { uk: "Закрити", ru: "Закрыть", en: "Close" } as const
const serviceDemo = {
  title: { uk: "Назва послуги", ru: "Название услуги", en: "Service title" },
  summary: {
    uk: "Демонстраційний опис компонента.",
    ru: "Демонстрационное описание компонента.",
    en: "Demonstration component summary.",
  },
} as const

export default async function StyleguidePage({ params }: StyleguidePageProps) {
  const { locale: rawLocale } = await params

  if (!hasLocale(rawLocale)) {
    notFound()
  }

  const locale: Locale = rawLocale
  const t = await getTranslations("Styleguide")
  const service = serviceDemo

  return (
    <div className="min-h-svh bg-background text-foreground">
      <SiteHeader locale={locale} currentPath="/styleguide" overlay={false} />

      <main>
        <section className="mx-auto w-full max-w-6xl min-w-0 px-6 py-12 md:px-10">
          <p className="text-xs tracking-normal text-muted-foreground uppercase">
            {t("heroEyebrow")}
          </p>
          <h1 className="mt-5 max-w-4xl text-4xl leading-none font-medium text-balance sm:text-5xl md:text-7xl">
            {t("heroTitle")}
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-muted-foreground">
            {t("heroSummary")}
          </p>
        </section>

        <Section
          eyebrow={t("pathwayEyebrow")}
          title={t("pathwayTitle")}
          summary={t("pathwaySummary")}
        >
          <div className="grid gap-4 md:grid-cols-3">
            <ServiceCard
              title={service.title[locale]}
              summary={service.summary[locale]}
              meta={t("serviceMeta")}
            />
            <OfferCard title={t("offerTitle")} summary={t("offerSummary")}>
              <FeatureList
                items={[t("featureOne"), t("featureTwo"), t("featureThree")]}
              />
            </OfferCard>
            <OfferCard title={t("motionTitle")} summary={t("motionSummary")}>
              <Badge variant="secondary">{t("motionBadge")}</Badge>
            </OfferCard>
          </div>
        </Section>

        <Section
          eyebrow={t("componentsEyebrow")}
          title={t("componentsTitle")}
          summary={t("componentsSummary")}
        >
          <div
            data-styleguide="primitive-components"
            className="grid gap-6 md:grid-cols-2"
          >
            <Card>
              <CardContent className="flex flex-col gap-4">
                <div className="flex flex-wrap gap-2">
                  <Button variant="default">{t("buttonPrimary")}</Button>
                  <Button variant="outline">{t("buttonEditorial")}</Button>
                  <Button variant="outline">{t("buttonOutline")}</Button>
                  <Button variant="secondary">{t("buttonPrimary")}</Button>
                  <Button variant="ghost">{t("buttonPrimary")}</Button>
                  <Button variant="destructive">{t("buttonPrimary")}</Button>
                  <Button variant="link">{t("buttonPrimary")}</Button>
                  <Button disabled>{t("buttonPrimary")}</Button>
                </div>
                <div
                  data-styleguide="button-sizes"
                  className="flex flex-wrap items-center gap-2"
                >
                  <Button size="xs">XS</Button>
                  <Button size="sm">SM</Button>
                  <Button size="lg">LG</Button>
                  <Button size="icon-xs" aria-label={t("buttonPrimary")}>
                    <MenuIcon />
                  </Button>
                  <Button size="icon-sm" aria-label={t("buttonPrimary")}>
                    <MenuIcon />
                  </Button>
                  <Button size="icon" aria-label={t("buttonPrimary")}>
                    <MenuIcon />
                  </Button>
                  <Button size="icon-lg" aria-label={t("buttonPrimary")}>
                    <MenuIcon />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="default">PURITY</Badge>
                  <Badge variant="secondary">{t("badgeGold")}</Badge>
                  <Badge variant="outline">{t("badgeOutline")}</Badge>
                  <Badge variant="destructive">{t("badgeOutline")}</Badge>
                  <Badge variant="ghost">{t("badgeOutline")}</Badge>
                  <Badge variant="link">{t("badgeOutline")}</Badge>
                </div>
                <Separator />
                <FieldGroup className="gap-4">
                  <Field>
                    <FieldLabel className="sr-only" htmlFor="styleguide-input">
                      {t("inputLabel")}
                    </FieldLabel>
                    <Input
                      id="styleguide-input"
                      placeholder={t("inputLabel")}
                    />
                  </Field>
                  <Field data-invalid>
                    <FieldLabel
                      className="sr-only"
                      htmlFor="styleguide-invalid-input"
                    >
                      {t("inputLabel")}
                    </FieldLabel>
                    <Input
                      id="styleguide-invalid-input"
                      aria-invalid
                      placeholder={t("inputLabel")}
                    />
                  </Field>
                  <Field data-disabled>
                    <FieldLabel
                      className="sr-only"
                      htmlFor="styleguide-disabled-input"
                    >
                      {t("inputLabel")}
                    </FieldLabel>
                    <Input
                      id="styleguide-disabled-input"
                      disabled
                      placeholder={t("inputLabel")}
                    />
                  </Field>
                  <Field>
                    <FieldLabel
                      className="sr-only"
                      htmlFor="styleguide-textarea"
                    >
                      {t("textareaLabel")}
                    </FieldLabel>
                    <Textarea
                      id="styleguide-textarea"
                      placeholder={t("textareaLabel")}
                    />
                  </Field>
                  <Field data-disabled>
                    <FieldLabel
                      className="sr-only"
                      htmlFor="styleguide-disabled-textarea"
                    >
                      {t("textareaLabel")}
                    </FieldLabel>
                    <Textarea
                      id="styleguide-disabled-textarea"
                      disabled
                      placeholder={t("textareaLabel")}
                    />
                  </Field>
                  <Field>
                    <FieldLabel className="sr-only">
                      {t("selectLabel")}
                    </FieldLabel>
                    <Select
                      defaultValue="studio"
                      items={[
                        { value: "studio", label: t("selectStudio") },
                        { value: "online", label: t("selectOnline") },
                      ]}
                    >
                      <SelectTrigger aria-label={t("selectLabel")}>
                        <SelectValue placeholder={t("selectLabel")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="studio">
                            {t("selectStudio")}
                          </SelectItem>
                          <SelectItem value="online">
                            {t("selectOnline")}
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field data-disabled data-invalid>
                    <FieldLabel className="sr-only">
                      {t("selectLabel")}
                    </FieldLabel>
                    <Select
                      disabled
                      items={[
                        { value: "studio", label: t("selectStudio") },
                        { value: "online", label: t("selectOnline") },
                      ]}
                      defaultValue="studio"
                    >
                      <SelectTrigger
                        size="sm"
                        aria-invalid
                        aria-label={t("selectLabel")}
                        data-styleguide="select-small-disabled-invalid"
                      >
                        <SelectValue placeholder={t("selectLabel")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="studio">
                            {t("selectStudio")}
                          </SelectItem>
                          <SelectItem value="online">
                            {t("selectOnline")}
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                  <FieldSet>
                    <FieldLegend className="sr-only" variant="label">
                      {t("checkboxLabel")}
                    </FieldLegend>
                    <FieldGroup className="gap-2">
                      <Field orientation="horizontal">
                        <Checkbox id="styleguide-checkbox" defaultChecked />
                        <FieldLabel htmlFor="styleguide-checkbox">
                          {t("checkboxLabel")}
                        </FieldLabel>
                      </Field>
                      <Field data-disabled orientation="horizontal">
                        <Checkbox id="styleguide-disabled-checkbox" disabled />
                        <FieldLabel htmlFor="styleguide-disabled-checkbox">
                          {t("checkboxLabel")}
                        </FieldLabel>
                      </Field>
                    </FieldGroup>
                  </FieldSet>
                  <FieldSet>
                    <FieldLegend
                      id="styleguide-radio-label"
                      className="sr-only"
                      variant="label"
                    >
                      {t("radioLabel")}
                    </FieldLegend>
                    <RadioGroup
                      defaultValue="research"
                      aria-labelledby="styleguide-radio-label"
                    >
                      <Field orientation="horizontal">
                        <FieldLabel>
                          <RadioGroupItem value="research" />
                          {t("radioResearch")}
                        </FieldLabel>
                      </Field>
                      <Field data-disabled orientation="horizontal">
                        <FieldLabel>
                          <RadioGroupItem disabled value="atelier" />
                          {t("radioAtelier")}
                        </FieldLabel>
                      </Field>
                    </RadioGroup>
                  </FieldSet>
                </FieldGroup>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex flex-col gap-4">
                <Alert>
                  <AlertTitle>{t("alertTitle")}</AlertTitle>
                  <AlertDescription>{t("alertSummary")}</AlertDescription>
                </Alert>
                <Alert variant="destructive">
                  <AlertTitle>{t("alertTitle")}</AlertTitle>
                  <AlertDescription>{t("alertSummary")}</AlertDescription>
                </Alert>

                <Tabs defaultValue="one">
                  <TabsList variant="line">
                    <TabsTrigger value="one">
                      {t("tabsResearchTrigger")}
                    </TabsTrigger>
                    <TabsTrigger value="two">
                      {t("tabsAtelierTrigger")}
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="one">{t("tabsResearch")}</TabsContent>
                  <TabsContent value="two">{t("tabsAtelier")}</TabsContent>
                </Tabs>
                <Tabs defaultValue="one" data-styleguide="tabs-default">
                  <TabsList>
                    <TabsTrigger value="one">
                      {t("tabsResearchTrigger")}
                    </TabsTrigger>
                    <TabsTrigger value="two">
                      {t("tabsAtelierTrigger")}
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="one">{t("tabsResearch")}</TabsContent>
                  <TabsContent value="two">{t("tabsAtelier")}</TabsContent>
                </Tabs>

                <Accordion defaultValue={["method"]}>
                  <AccordionItem value="method">
                    <AccordionTrigger>{t("accordionTitle")}</AccordionTrigger>
                    <AccordionContent>{t("accordionSummary")}</AccordionContent>
                  </AccordionItem>
                </Accordion>

                <Card size="sm">
                  <CardHeader>
                    <CardTitle className="min-w-0 break-words">
                      {t("componentsTitle")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>{t("componentsSummary")}</CardContent>
                </Card>

                <div className="flex flex-wrap gap-2">
                  <Dialog>
                    <DialogTrigger render={<Button variant="outline" />}>
                      {t("dialogAction")}
                    </DialogTrigger>
                    <DialogContent showCloseButton={false}>
                      <DialogClose
                        render={
                          <Button
                            className="absolute top-4 right-4"
                            size="icon-sm"
                            variant="ghost"
                          />
                        }
                      >
                        <XIcon />
                        <span className="sr-only">
                          {closeLabel[locale]}
                        </span>
                      </DialogClose>
                      <DialogHeader>
                        <DialogTitle>{t("dialogTitle")}</DialogTitle>
                        <DialogDescription>
                          {t("dialogSummary")}
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>

                  <Sheet>
                    <SheetTrigger render={<Button variant="outline" />}>
                      {t("sheetAction")}
                    </SheetTrigger>
                    <SheetContent showCloseButton={false}>
                      <SheetClose
                        render={
                          <Button
                            className="absolute top-4 right-4"
                            size="icon-sm"
                            variant="ghost"
                          />
                        }
                      >
                        <XIcon />
                        <span className="sr-only">
                          {closeLabel[locale]}
                        </span>
                      </SheetClose>
                      <SheetHeader>
                        <SheetTitle>{t("sheetTitle")}</SheetTitle>
                        <SheetDescription>{t("sheetSummary")}</SheetDescription>
                      </SheetHeader>
                    </SheetContent>
                  </Sheet>
                </div>
              </CardContent>
            </Card>
          </div>
        </Section>

        <Section
          eyebrow={t("tokensEyebrow")}
          title={t("tokensTitle")}
          summary={t("tokensSummary")}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="min-h-24 border border-border bg-muted p-5">
              <p className="text-xs text-muted-foreground uppercase">muted</p>
              <p className="mt-4 text-sm text-foreground">{t("paperToken")}</p>
            </div>
            <div className="min-h-24 border border-border bg-secondary p-5">
              <p className="text-xs text-muted-foreground uppercase">
                secondary
              </p>
              <p className="mt-4 text-sm text-foreground">{t("silkToken")}</p>
            </div>
          </div>
          <div className="mt-8 grid min-w-0 gap-3">
            <p className="text-2xl font-medium">{t("typeSmallHeading")}</p>
            <p className="min-w-0 text-6xl leading-none font-medium text-balance break-words">
              {t("typeLargeHeading")}
            </p>
          </div>
        </Section>
      </main>
      <SiteFooter locale={locale} currentPath="/styleguide" />
    </div>
  )
}
