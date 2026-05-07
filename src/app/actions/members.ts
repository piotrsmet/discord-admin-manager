"use server";

import { kickGuildMember, banGuildMember } from "@/lib/discord";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function kickMember(guildId: string, userId: string) {
  const session = await auth();
  if (!session && guildId !== "demo") return { error: "Brak autoryzacji" };

  if (guildId === "demo") return { success: true };

  const botToken = process.env.DISCORD_BOT_TOKEN;
  if (!botToken) return { error: "Brak konfiguracji bota" };

  try {
    await kickGuildMember(guildId, userId, botToken);
    revalidatePath(`/dashboard/${guildId}/members`);
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Wystąpił błąd podczas wyrzucania użytkownika" };
  }
}

export async function banMember(guildId: string, userId: string) {
  const session = await auth();
  if (!session && guildId !== "demo") return { error: "Brak autoryzacji" };

  if (guildId === "demo") return { success: true };

  const botToken = process.env.DISCORD_BOT_TOKEN;
  if (!botToken) return { error: "Brak konfiguracji bota" };

  try {
    await banGuildMember(guildId, userId, botToken);
    revalidatePath(`/dashboard/${guildId}/members`);
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Wystąpił błąd podczas banowania użytkownika" };
  }
}

export async function updateMemberRoles(guildId: string, userId: string, roles: string[]) {
  const session = await auth();
  if (!session && guildId !== "demo") return { error: "Brak autoryzacji" };

  if (guildId === "demo") return { success: true };

  const botToken = process.env.DISCORD_BOT_TOKEN;
  if (!botToken) return { error: "Brak konfiguracji bota" };

  try {
    const { updateGuildMember } = await import("@/lib/discord");
    await updateGuildMember(guildId, userId, botToken, { roles });
    revalidatePath(`/dashboard/${guildId}/members`);
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Wystąpił błąd podczas aktualizacji ról użytkownika" };
  }
}

