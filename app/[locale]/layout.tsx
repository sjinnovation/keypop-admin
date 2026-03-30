import AppIntlProvider from "@/components/AppIntlProvider";
import React from "react";

export default async function layout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = (await import(`@/constant/translate/${locale}.json`)).default;

  return (
    <AppIntlProvider locale={locale} messages={messages}>
      {children}
    </AppIntlProvider>
  );
}
