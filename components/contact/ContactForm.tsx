"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Button,
  Label,
  Input,
  H3,
  Body,
  Textarea,
  Select,
} from "@/components/ui";

export function ContactForm() {
  const t = useTranslations("contact");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const data = {
      type: "contact",
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setIsSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSuccess) {
    return (
      <div className="bg-background p-8 text-center">
        <H3 className="mb-4">{t("form.submit.success")}</H3>
        <Body className="text-muted-foreground">
          {t("form.submit.successDescription") ||
            "We will get back to you soon."}
        </Body>
        <Button
          variant="outline"
          className="mt-6"
          onClick={() => setIsSuccess(false)}
        >
          {t("form.submit.label")}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <div>
          <Label htmlFor="name" className="mb-2 block">
            {t("form.name.label")}
          </Label>
          <Input
            type="text"
            id="name"
            name="name"
            required
            placeholder={t("form.name.placeholder")}
          />
        </div>

        <div>
          <Label htmlFor="email" className="mb-2 block">
            {t("form.email.label")}
          </Label>
          <Input
            type="email"
            id="email"
            name="email"
            required
            placeholder={t("form.email.placeholder")}
          />
        </div>

        <div>
          <Label htmlFor="phone" className="mb-2 block">
            {t("form.phone.label")}
          </Label>
          <Input
            type="tel"
            id="phone"
            name="phone"
            placeholder={t("form.phone.placeholder")}
          />
        </div>

        <div>
          <Label htmlFor="subject" className="mb-2 block">
            {t("form.subject.label")}
          </Label>
          <Select id="subject" name="subject" required>
            <option value="">{t("form.subject.placeholder")}</option>
            <option value="consultation">
              {t("form.subject.options.consultation")}
            </option>
            <option value="services">
              {t("form.subject.options.services")}
            </option>
            <option value="atelier">{t("form.subject.options.atelier")}</option>
            <option value="other">{t("form.subject.options.other")}</option>
          </Select>
        </div>

        <div>
          <Label htmlFor="message" className="mb-2 block">
            {t("form.message.label")}
          </Label>
          <Textarea
            id="message"
            name="message"
            rows={4}
            placeholder={t("form.message.placeholder")}
          />
        </div>
      </div>

      {error && (
        <div className="p-4 bg-destructive/10 text-destructive">
          <Body className="text-sm">{t("form.submit.error")}</Body>
        </div>
      )}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? t("form.submit.sending") : t("form.submit.label")}
      </Button>
    </form>
  );
}
