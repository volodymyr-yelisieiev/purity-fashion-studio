import React from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";

// Minimal English messages for testing
const defaultMessages: Record<string, unknown> = {
  contact: {
    form: {
      name: { label: "Name", placeholder: "Your name" },
      email: { label: "Email", placeholder: "your@email.com" },
      phone: { label: "Phone", placeholder: "+380" },
      subject: {
        label: "Subject",
        placeholder: "Select a subject",
        options: {
          consultation: "Consultation",
          services: "Services",
          atelier: "Atelier",
          other: "Other",
        },
      },
      message: { label: "Message", placeholder: "Your message" },
      submit: {
        label: "Send Message",
        sending: "Sending...",
        success: "Message Sent!",
        successDescription: "We will get back to you soon.",
        error: "Failed to send message",
      },
    },
  },
};

interface RenderWithProvidersOptions extends Omit<RenderOptions, "wrapper"> {
  locale?: string;
  messages?: Record<string, unknown>;
}

export function renderWithProviders(
  ui: React.ReactElement,
  options: RenderWithProvidersOptions = {},
) {
  const {
    locale = "en",
    messages = defaultMessages,
    ...renderOptions
  } = options;

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <NextIntlClientProvider locale={locale} messages={messages}>
        {children}
      </NextIntlClientProvider>
    );
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}
