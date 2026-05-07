export const dictionaries = {
  pl: {
    sidebar: {
      dashboard: "Dashboard",
      members: "Członkowie",
      roles: "Role i Uprawnienia",
      channels: "Kanały",
      logs: "Logi Aktywności",
      changeServer: "← Zmień serwer"
    },
    header: {
      admin: "Admin",
      polski: "Polski",
      english: "English"
    },
    dashboard: {
      welcome: "Witaj",
      statsFor: "Statystyki dla serwera:",
      totalMembers: "Całkowita liczba członków",
      activeOnline: "Aktywni online",
      textChannels: "Kanały Tekstowe",
      boostsCount: "Liczba Ulepszeń",
      recentActivity: "Ostatnia aktywność",
      recentActivityDesc: "Ostatnie zdarzenia na twoim serwerze",
      discordHealth: "Stan Discorda",
      discordHealthDesc: "Status usług Discorda",
      unknownUser: "Nieznany",
      noActivity: "Brak ostatnich aktywności",
      unknownServer: "Nieznany serwer",
      botNotOnServer: "Bot nie jest na tym serwerze",
      botNotOnServerDesc: "Aby zarządzać tym serwerem, musisz zaprosić bota z odpowiednimi uprawnieniami (Administrator).",
      inviteBot: "Zaproś Bota",
      noBotConfig: "Brak konfiguracji bota.",
      guest: "Gość (Demo)",
      user: "Użytkownik",
      loginRequired: "Zaloguj się, aby uzyskać dostęp do panelu",
      loginButton: "Zaloguj przez Discord",
      reportGenerator: "Generator Raportów"
    }
  },
  en: {
    sidebar: {
      dashboard: "Dashboard",
      members: "Members",
      roles: "Roles & Permissions",
      channels: "Channels",
      logs: "Activity Logs",
      changeServer: "← Change server"
    },
    header: {
      admin: "Admin",
      polski: "Polski",
      english: "English"
    },
    dashboard: {
      welcome: "Welcome",
      statsFor: "Statistics for server:",
      totalMembers: "Total Members",
      activeOnline: "Active Online",
      textChannels: "Text Channels",
      boostsCount: "Boosts Count",
      recentActivity: "Recent Activity",
      recentActivityDesc: "Latest events on your server",
      discordHealth: "Discord Health",
      discordHealthDesc: "Status of Discord services",
      unknownUser: "Unknown",
      noActivity: "No recent activity",
      unknownServer: "Unknown server",
      botNotOnServer: "Bot is not on this server",
      botNotOnServerDesc: "To manage this server, you need to invite the bot with appropriate permissions (Administrator).",
      inviteBot: "Invite Bot",
      noBotConfig: "No bot configuration.",
      guest: "Guest (Demo)",
      user: "User",
      loginRequired: "Log in to access the dashboard",
      loginButton: "Log in with Discord",
      reportGenerator: "Report Generator"
    }
  }
};

export type Locale = keyof typeof dictionaries;
export type Dictionary = typeof dictionaries.pl;
