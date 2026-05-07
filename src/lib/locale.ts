import { cookies } from "next/headers";
import { dictionaries, Locale } from "./dictionaries";

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value as Locale;
  return locale === "en" || locale === "pl" ? locale : "pl";
}

export async function getDictionary() {
  const locale = await getLocale();
  return dictionaries[locale];
}
