export async function getUserGuilds(accessToken: string) {
  const response = await fetch("https://discord.com/api/v10/users/@me/guilds", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    return [];
  }

  return response.json();
}

export async function getGuildChannels(guildId: string, botToken: string) {
  const response = await fetch(`https://discord.com/api/v10/guilds/${guildId}/channels`, {
    headers: {
      Authorization: `Bot ${botToken}`,
    },
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    return [];
  }

  const channels = await response.json();
  
  // Zwracamy tylko kanały tekstowe (0) i kanały z ogłoszeniami (5)
  return channels
    .filter((channel: any) => channel.type === 0 || channel.type === 5)
    .sort((a: any, b: any) => a.position - b.position); // Sortujemy tak, jak na Discordzie
}

export async function getAuditLogs(guildId: string, botToken: string) {
  const response = await fetch(`https://discord.com/api/v10/guilds/${guildId}/audit-logs?limit=5`, {
    headers: {
      Authorization: `Bot ${botToken}`,
    },
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
}

export async function getServerData(guildId: string, botToken: string) {
  const response = await fetch(`https://discord.com/api/v10/guilds/${guildId}?with_counts=true`, {
    headers: {
      Authorization: `Bot ${botToken}`,
    },
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
}