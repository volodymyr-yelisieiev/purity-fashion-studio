"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import {
  Controller,
  useForm,
  useWatch,
  type FieldPath,
  type Resolver,
} from "react-hook-form"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldError,
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
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { submitBooking } from "@/features/booking/actions"
import {
  bookingCopy,
  bookingLabels,
  contactMethodLabels,
  currencyLabels,
  formatLabels,
  inquiryTypeLabels,
  localizeBookingError,
  providerLabels,
} from "@/features/booking/content"
import {
  bookingSchema,
  contactMethods,
  formats,
  inquiryTypes,
  paymentCurrencies,
  routePaymentProvider,
  type BookingInput,
  type BookingResult,
} from "@/features/booking/schema"
import type { Locale } from "@/i18n/routing"
import { cn } from "@/lib/utils"

type ServiceOption = {
  slug: string
  title: string
}

type BookingFormProps = {
  locale: Locale
  services: ServiceOption[]
  initialServiceSlug: string
}

const bookingResolver: Resolver<BookingInput> = async (values) => {
  const parsed = bookingSchema.safeParse(values)

  if (parsed.success) {
    return {
      values: parsed.data,
      errors: {},
    }
  }

  return {
    values: {},
    errors: Object.fromEntries(
      parsed.error.issues.flatMap((issue) => {
        const path = issue.path[0]

        if (typeof path !== "string") {
          return []
        }

        return [
          [
            path,
            {
              type: issue.code,
              message: issue.message,
            },
          ],
        ]
      })
    ),
  }
}

function fieldErrorId(name: string) {
  return `${fieldId(name)}-error`
}

function BookingFieldError({
  name,
  message,
}: {
  name: string
  message?: string
}) {
  if (!message) {
    return null
  }

  return <FieldError id={fieldErrorId(name)}>{message}</FieldError>
}

function fieldId(name: string) {
  return `booking-${name}`
}

function BookingForm({
  locale,
  services,
  initialServiceSlug,
}: BookingFormProps) {
  const [result, setResult] = useState<BookingResult>({ status: "idle" })
  const [isPending, startTransition] = useTransition()
  const defaultService = services.some(
    (service) => service.slug === initialServiceSlug
  )
    ? initialServiceSlug
    : services[0]?.slug
  const form = useForm<BookingInput>({
    resolver: bookingResolver,
    defaultValues: {
      inquiryType: "private",
      serviceSlug: defaultService,
      name: "",
      email: "",
      phone: "",
      company: "",
      format: "studio",
      contactMethod: "email",
      budgetCurrency: "EUR",
      preferredAt: "",
      message: "",
      consent: false,
    },
    mode: "onSubmit",
  })
  const currency = useWatch({
    control: form.control,
    name: "budgetCurrency",
  })
  const selectedServiceSlug = useWatch({
    control: form.control,
    name: "serviceSlug",
  })
  const selectedFormat = useWatch({ control: form.control, name: "format" })
  const selectedContactMethod = useWatch({
    control: form.control,
    name: "contactMethod",
  })
  const preferredAt = useWatch({ control: form.control, name: "preferredAt" })
  const provider = routePaymentProvider(currency)
  const serverErrors =
    result.status === "error" ? result.fieldErrors : undefined
  const hasClientErrors =
    form.formState.isSubmitted && Object.keys(form.formState.errors).length > 0
  const serviceOptions = services
  const serviceSelectItems = serviceOptions.map((service) => ({
    value: service.slug,
    label: service.title,
  }))
  const currencySelectItems = paymentCurrencies.map((currency) => ({
    value: currency,
    label: currencyLabels[currency][locale],
  }))
  const selectedServiceTitle =
    serviceOptions.find((service) => service.slug === selectedServiceSlug)
      ?.title ?? bookingCopy.emptyService[locale]

  function errorFor(name: FieldPath<BookingInput>) {
    const message = form.formState.errors[name]?.message ?? serverErrors?.[name]

    if (typeof message !== "string") {
      return undefined
    }

    return localizeBookingError(locale, message)
  }

  async function onSubmit(values: BookingInput) {
    const formData = new FormData()

    formData.set("locale", locale)

    for (const [key, value] of Object.entries(values)) {
      if (key === "consent") {
        if (value) {
          formData.set(key, "on")
        }

        continue
      }

      formData.set(key, String(value ?? ""))
    }

    startTransition(async () => {
      const nextResult = await submitBooking(result, formData)
      setResult(nextResult)
    })
  }

  if (!serviceOptions.length) {
    return (
      <Alert>
        <AlertTitle>{bookingCopy.errorTitle[locale]}</AlertTitle>
        <AlertDescription>{bookingCopy.emptyService[locale]}</AlertDescription>
      </Alert>
    )
  }

  return (
    <form
      noValidate
      onSubmit={form.handleSubmit(onSubmit)}
      aria-busy={isPending}
      className="grid min-w-0 gap-6"
      data-state={isPending ? "submitting" : result.status}
      data-testid="booking-form"
    >
      <Alert>
        <AlertTitle>{bookingCopy.routingTitle[locale]}</AlertTitle>
        <AlertDescription>
          {bookingCopy.routingSummary[locale]}{" "}
          {providerLabels[provider][locale]}
        </AlertDescription>
      </Alert>

      <ol
        aria-label={bookingCopy.stepsTitle[locale]}
        className="grid gap-2 border-y border-border py-4 text-xs tracking-widest text-muted-foreground uppercase sm:grid-cols-2"
        data-testid="booking-progress"
      >
        <li className="text-foreground">
          <span className="mr-2 text-muted-foreground">01</span>
          {bookingCopy.stepDetails[locale]}
        </li>
        <li>
          <span className="mr-2 text-muted-foreground">02</span>
          {bookingCopy.stepReview[locale]}
        </li>
      </ol>

      {(result.status === "error" || hasClientErrors) && (
        <Alert>
          <AlertTitle>{bookingCopy.errorTitle[locale]}</AlertTitle>
          <AlertDescription>
            {bookingCopy.validationError[locale]}
          </AlertDescription>
        </Alert>
      )}

      {result.status === "success" && (
        <Alert>
          <AlertTitle>{bookingCopy.successTitle[locale]}</AlertTitle>
          <AlertDescription>
            {bookingCopy.successSummary[locale]}{" "}
            {providerLabels[result.provider][locale]} / {result.currency}
          </AlertDescription>
          <Link
            href={result.checkoutUrl}
            className={cn(
              buttonVariants({
                variant: "default",
                size: "lg",
                className: "mt-4 w-fit",
              })
            )}
          >
            {bookingCopy.checkout[locale]}
          </Link>
        </Alert>
      )}

      <FieldSet>
        <FieldLegend>{bookingCopy.contactTitle[locale]}</FieldLegend>

        <FieldGroup>
          <Controller
            control={form.control}
            name="inquiryType"
            render={({ field }) => (
              <FieldSet>
                <FieldLegend id={fieldId("inquiry-type")} variant="label">
                  {bookingLabels.inquiryType[locale]}
                </FieldLegend>
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  aria-labelledby={fieldId("inquiry-type")}
                  className="grid gap-3 sm:grid-cols-2"
                >
                  {inquiryTypes.map((type) => (
                    <Field key={type} orientation="horizontal">
                      <FieldLabel>
                        <RadioGroupItem value={type} />
                        {inquiryTypeLabels[type][locale]}
                      </FieldLabel>
                    </Field>
                  ))}
                </RadioGroup>
              </FieldSet>
            )}
          />

          <FieldGroup className="grid gap-4 md:grid-cols-2">
            <Field data-invalid={Boolean(errorFor("name"))}>
              <FieldLabel htmlFor={fieldId("name")}>
                {bookingLabels.name[locale]}
              </FieldLabel>
              <Input
                id={fieldId("name")}
                aria-invalid={Boolean(errorFor("name"))}
                aria-describedby={
                  errorFor("name") ? fieldErrorId("name") : undefined
                }
                {...form.register("name")}
              />
              <BookingFieldError name="name" message={errorFor("name")} />
            </Field>

            <Field data-invalid={Boolean(errorFor("email"))}>
              <FieldLabel htmlFor={fieldId("email")}>
                {bookingLabels.email[locale]}
              </FieldLabel>
              <Input
                id={fieldId("email")}
                type="email"
                aria-invalid={Boolean(errorFor("email"))}
                aria-describedby={
                  errorFor("email") ? fieldErrorId("email") : undefined
                }
                {...form.register("email")}
              />
              <BookingFieldError name="email" message={errorFor("email")} />
            </Field>

            <Field data-invalid={Boolean(errorFor("phone"))}>
              <FieldLabel htmlFor={fieldId("phone")}>
                {bookingLabels.phone[locale]}
              </FieldLabel>
              <Input
                id={fieldId("phone")}
                aria-invalid={Boolean(errorFor("phone"))}
                aria-describedby={
                  errorFor("phone") ? fieldErrorId("phone") : undefined
                }
                {...form.register("phone")}
              />
              <BookingFieldError name="phone" message={errorFor("phone")} />
            </Field>

            <Field data-invalid={Boolean(errorFor("company"))}>
              <FieldLabel htmlFor={fieldId("company")}>
                {bookingLabels.company[locale]}
              </FieldLabel>
              <Input
                id={fieldId("company")}
                aria-invalid={Boolean(errorFor("company"))}
                aria-describedby={
                  errorFor("company") ? fieldErrorId("company") : undefined
                }
                {...form.register("company")}
              />
              <BookingFieldError name="company" message={errorFor("company")} />
            </Field>
          </FieldGroup>
        </FieldGroup>
      </FieldSet>

      <FieldSet>
        <FieldLegend>{bookingCopy.paymentTitle[locale]}</FieldLegend>

        <FieldGroup>
          <Controller
            control={form.control}
            name="serviceSlug"
            render={({ field }) => (
              <Field data-invalid={Boolean(errorFor("serviceSlug"))}>
                <FieldLabel>{bookingLabels.serviceSlug[locale]}</FieldLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  items={serviceSelectItems}
                >
                  <SelectTrigger
                    aria-label={bookingLabels.serviceSlug[locale]}
                    aria-invalid={Boolean(errorFor("serviceSlug"))}
                    aria-describedby={
                      errorFor("serviceSlug")
                        ? fieldErrorId("serviceSlug")
                        : undefined
                    }
                    className="w-full"
                    data-testid="booking-service-trigger"
                  >
                    <SelectValue
                      placeholder={bookingCopy.emptyService[locale]}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {serviceOptions.map((service) => (
                        <SelectItem key={service.slug} value={service.slug}>
                          {service.title}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <BookingFieldError
                  name="serviceSlug"
                  message={errorFor("serviceSlug")}
                />
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="format"
            render={({ field }) => (
              <FieldSet>
                <FieldLegend id={fieldId("format")} variant="label">
                  {bookingLabels.format[locale]}
                </FieldLegend>
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  aria-labelledby={fieldId("format")}
                  className="grid gap-3 sm:grid-cols-3"
                >
                  {formats.map((format) => (
                    <Field key={format} orientation="horizontal">
                      <FieldLabel>
                        <RadioGroupItem value={format} />
                        {formatLabels[format][locale]}
                      </FieldLabel>
                    </Field>
                  ))}
                </RadioGroup>
              </FieldSet>
            )}
          />

          <Controller
            control={form.control}
            name="contactMethod"
            render={({ field }) => (
              <FieldSet>
                <FieldLegend id={fieldId("contact-method")} variant="label">
                  {bookingLabels.contactMethod[locale]}
                </FieldLegend>
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  aria-labelledby={fieldId("contact-method")}
                  className="grid gap-3 sm:grid-cols-3"
                >
                  {contactMethods.map((method) => (
                    <Field key={method} orientation="horizontal">
                      <FieldLabel>
                        <RadioGroupItem value={method} />
                        {contactMethodLabels[method][locale]}
                      </FieldLabel>
                    </Field>
                  ))}
                </RadioGroup>
              </FieldSet>
            )}
          />

          <Controller
            control={form.control}
            name="budgetCurrency"
            render={({ field }) => (
              <Field>
                <FieldLabel>{bookingLabels.budgetCurrency[locale]}</FieldLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  items={currencySelectItems}
                >
                  <SelectTrigger
                    aria-label={bookingLabels.budgetCurrency[locale]}
                    className="w-full"
                    data-testid="booking-currency-trigger"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {paymentCurrencies.map((currency) => (
                        <SelectItem key={currency} value={currency}>
                          {currencyLabels[currency][locale]}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            )}
          />

          <Field>
            <FieldLabel htmlFor={fieldId("preferredAt")}>
              {bookingLabels.preferredAt[locale]}
            </FieldLabel>
            <Input
              id={fieldId("preferredAt")}
              type="datetime-local"
              {...form.register("preferredAt")}
            />
          </Field>

          <Field data-invalid={Boolean(errorFor("message"))}>
            <FieldLabel htmlFor={fieldId("message")}>
              {bookingLabels.message[locale]}
            </FieldLabel>
            <Textarea
              id={fieldId("message")}
              aria-invalid={Boolean(errorFor("message"))}
              aria-describedby={
                errorFor("message") ? fieldErrorId("message") : undefined
              }
              {...form.register("message")}
            />
            <BookingFieldError name="message" message={errorFor("message")} />
          </Field>

          <Controller
            control={form.control}
            name="consent"
            render={({ field }) => (
              <Field data-invalid={Boolean(errorFor("consent"))}>
                <FieldLabel className="flex items-start gap-3 text-sm leading-6">
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    aria-invalid={Boolean(errorFor("consent"))}
                    aria-describedby={
                      errorFor("consent") ? fieldErrorId("consent") : undefined
                    }
                  />
                  <span>{bookingLabels.consent[locale]}</span>
                </FieldLabel>
                <BookingFieldError
                  name="consent"
                  message={errorFor("consent")}
                />
              </Field>
            )}
          />
        </FieldGroup>
      </FieldSet>

      <Card data-testid="booking-review">
        <CardHeader>
          <CardTitle>{bookingCopy.reviewTitle[locale]}</CardTitle>
          <CardDescription>{bookingCopy.reviewSummary[locale]}</CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-2 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-muted-foreground">
                {bookingLabels.serviceSlug[locale]}
              </dt>
              <dd className="font-medium">{selectedServiceTitle}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">
                {bookingLabels.format[locale]}
              </dt>
              <dd className="font-medium">
                {formatLabels[selectedFormat][locale]}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">
                {bookingLabels.contactMethod[locale]}
              </dt>
              <dd className="font-medium">
                {contactMethodLabels[selectedContactMethod][locale]}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">
                {bookingLabels.preferredAt[locale]}
              </dt>
              <dd className="font-medium">
                {preferredAt || bookingCopy.notSpecified[locale]}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Button
        type="submit"
        variant="default"
        size="lg"
        disabled={isPending}
        className="w-full md:w-fit"
        data-testid="booking-submit"
      >
        {isPending && <Spinner data-icon="inline-start" />}
        {isPending
          ? bookingCopy.submitting[locale]
          : bookingCopy.submit[locale]}
      </Button>
    </form>
  )
}

export { BookingForm }
