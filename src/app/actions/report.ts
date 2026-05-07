"use server";

import { GoogleGenAI } from "@google/genai";
import { getServerData, getAuditLogs, getGuildChannels, getActionName } from "@/lib/discord";

export async function generateServerReport(guildId: string) {
  try {
    const botToken = guildId === "demo" ? "demo" : process.env.DISCORD_BOT_TOKEN;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!botToken) {
      return { error: "Brak konfiguracji bota." };
    }
    
    if (!apiKey) {
      return { error: "Brak klucza API Gemini (GEMINI_API_KEY). Dodaj go w pliku .env" };
    }

    const ai = new GoogleGenAI({ apiKey });

    // Fetch basic server stats
    const [serverData, auditLogs, channels] = await Promise.all([
      getServerData(guildId, botToken),
      getAuditLogs(guildId, botToken, 20), // Get last 20 actions for the report
      getGuildChannels(guildId, botToken)
    ]);

    if (!serverData) {
      return { error: "Nie udało się pobrać danych serwera." };
    }

    // Format recent activity
    const recentActivityText = (auditLogs?.audit_log_entries || []).map((entry: any) => {
      const user = auditLogs?.users?.find((u: any) => u.id === entry.user_id);
      const userName = user ? user.username : "Nieznany użytkownik";
      const actionName = getActionName(entry.action_type);
      return `- ${userName} ${actionName} (Cel: ${entry.target_id || "Brak"})`;
    }).join("\n");

    const prompt = `
Jesteś asystentem administratora serwera Discord. Wygeneruj krótki, zwięzły i profesjonalny raport o stanie serwera na podstawie poniższych danych.
Skup się na podsumowaniu aktywności i statystyk. Zwróć uwagę na bezpieczeństwo i ewentualne nietypowe zachowania.
Raport powinien być w języku polskim i używać formatowania Markdown (pogrubienia, listy).

Nazwa serwera: ${serverData.name}
Liczba członków: ${serverData.approximate_member_count || 0}
Aktywni użytkownicy: ${serverData.approximate_presence_count || 0}
Liczba kanałów: ${channels.length}
Poziom ulepszeń: ${serverData.premium_tier || 0}
Liczba ulepszeń (Boosts): ${serverData.premium_subscription_count || 0}

Ostatnie akcje administracyjne/moderacyjne:
${recentActivityText || "Brak ostatnich akcji."}

Napisz krótki raport (max 3-4 akapity) oceniający stan serwera i ostatnią aktywność.
`;

    const response = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: prompt,
    });

    return { report: response.text };
  } catch (error: any) {
    console.error("Error generating report:", error);
    return { error: "Wystąpił błąd podczas generowania raportu: " + (error.message || "Nieznany błąd") };
  }
}
