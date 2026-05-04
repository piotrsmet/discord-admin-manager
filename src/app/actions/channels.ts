"use server";

import { updateChannel as discordUpdateChannel, createChannel as discordCreateChannel, deleteChannel as discordDeleteChannel } from "@/lib/discord";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function editChannel(channelId: string, guildId: string, data: { name: string; nsfw?: boolean; rate_limit_per_user?: number }) {
  const session = await auth();
  if (!session) return { error: "Brak autoryzacji" };

  const botToken = process.env.DISCORD_BOT_TOKEN;
  if (!botToken) return { error: "Brak konfiguracji bota" };

  try {
    if (!data.name || data.name.trim() === "") return { error: "Nazwa kanału nie może być pusta" };

    await discordUpdateChannel(channelId, botToken, data);
    revalidatePath(`/dashboard/${guildId}/channels`);
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Wystąpił błąd podczas edycji kanału" };
  }
}

export async function createNewChannel(guildId: string, data: { name: string; type: number; parent_id?: string }) {
  const session = await auth();
  if (!session) return { error: "Brak autoryzacji" };

  const botToken = process.env.DISCORD_BOT_TOKEN;
  if (!botToken) return { error: "Brak konfiguracji bota" };

  try {
    if (!data.name || data.name.trim() === "") return { error: "Nazwa kanału nie może być pusta" };

    await discordCreateChannel(guildId, botToken, data);
    revalidatePath(`/dashboard/${guildId}/channels`);
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Wystąpił błąd podczas tworzenia kanału" };
  }
}

export async function removeChannel(channelId: string, guildId: string) {
  const session = await auth();
  if (!session) return { error: "Brak autoryzacji" };

  const botToken = process.env.DISCORD_BOT_TOKEN;
  if (!botToken) return { error: "Brak konfiguracji bota" };

  try {
    await discordDeleteChannel(channelId, botToken);
    revalidatePath(`/dashboard/${guildId}/channels`);
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Wystąpił błąd podczas usuwania kanału" };
  }
}
