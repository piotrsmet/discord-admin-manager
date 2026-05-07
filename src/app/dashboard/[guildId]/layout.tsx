import { ReactNode } from "react";
import DashboardLayoutClient from "@/components/layout/DashboardLayoutClient";
import { getDictionary, getLocale } from "@/lib/locale";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const dict = await getDictionary();
  const locale = await getLocale();
  
  return (
    <DashboardLayoutClient dict={dict} locale={locale}>
      {children}
    </DashboardLayoutClient>
  );
}
