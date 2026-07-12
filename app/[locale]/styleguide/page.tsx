import { ListIcon as MenuIcon, XIcon } from "@phosphor-icons/react/dist/ssr"
import { getTranslations } from "next-intl/server"
import { notFound } from "next/navigation"

import {
  FeatureList,
  OfferCard,
  Section,
  ServiceCard,
} from "@/components/purity"
import { SiteFooter, SiteHeader } from "@/components/site-shell"
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
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
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
import { services } from "@/content/services"
import { siteSettings } from "@/content/source"
import { hasLocale, type Locale } from "@/i18n/routing"

type StyleguidePageProps = {
  params: Promise<{ locale: string }>
}

export default async function StyleguidePage({ params }: StyleguidePageProps) {
  const { locale: rawLocale } = await params

  if (!hasLocale(rawLocale)) {
    notFound()
  }

  const locale: Locale = rawLocale
  const t = await getTranslations("Styleguide")
  const service = services[0]

  return (
    <div className="min-h-svh bg-background text-foreground">
      <SiteHeader locale={locale} currentPath="/styleguide" />

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
            <div className="space-y-4 border border-border bg-background p-5">
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
              <Input
                aria-label={t("inputLabel")}
                placeholder={t("inputLabel")}
              />
              <Input
                aria-invalid
                aria-label={t("inputLabel")}
                placeholder={t("inputLabel")}
              />
              <Input
                disabled
                aria-label={t("inputLabel")}
                placeholder={t("inputLabel")}
              />
              <Textarea
                aria-label={t("textareaLabel")}
                placeholder={t("textareaLabel")}
              />
              <Textarea
                disabled
                aria-label={t("textareaLabel")}
                placeholder={t("textareaLabel")}
              />
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
                  <SelectItem value="studio">{t("selectStudio")}</SelectItem>
                  <SelectItem value="online">{t("selectOnline")}</SelectItem>
                </SelectContent>
              </Select>
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
                  <SelectItem value="studio">{t("selectStudio")}</SelectItem>
                  <SelectItem value="online">{t("selectOnline")}</SelectItem>
                </SelectContent>
              </Select>
              <label className="flex items-center gap-2 text-sm">
                <Checkbox defaultChecked />
                {t("checkboxLabel")}
              </label>
              <label className="flex items-center gap-2 text-sm">
                <Checkbox disabled aria-label={t("checkboxLabel")} />
                {t("checkboxLabel")}
              </label>
              <RadioGroup defaultValue="research" aria-label={t("radioLabel")}>
                <label className="flex items-center gap-2 text-sm">
                  <RadioGroupItem value="research" />
                  {t("radioResearch")}
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <RadioGroupItem disabled value="atelier" />
                  {t("radioAtelier")}
                </label>
              </RadioGroup>
            </div>

            <div className="space-y-4 border border-border bg-background p-5">
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
                        {siteSettings.closeLabel[locale]}
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
                        {siteSettings.closeLabel[locale]}
                      </span>
                    </SheetClose>
                    <SheetHeader>
                      <SheetTitle>{t("sheetTitle")}</SheetTitle>
                      <SheetDescription>{t("sheetSummary")}</SheetDescription>
                    </SheetHeader>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
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
