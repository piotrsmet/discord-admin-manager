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
    .filter((channel: { type: number }) => channel.type === 0 || channel.type === 5)
    .sort((a: { position: number }, b: { position: number }) => a.position - b.position); // Sortujemy tak, jak na Discordzie
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

export async function getGuildRoles(guildId: string, botToken: string) {
  const response = await fetch(`https://discord.com/api/v10/guilds/${guildId}/roles`, {
    headers: {
      Authorization: `Bot ${botToken}`,
    },
    next: { tags: ['roles'], revalidate: 60 },
  });

  if (!response.ok) {
    return [];
  }

  const roles = await response.json();
  // Sort by position descending (highest role first)
  return roles.sort((a: { position: number }, b: { position: number }) => b.position - a.position);
}

export async function updateGuildRole(guildId: string, roleId: string, botToken: string, permissions: string) {
  const response = await fetch(`https://discord.com/api/v10/guilds/${guildId}/roles/${roleId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bot ${botToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ permissions }),
  });

  if (!response.ok) {
    throw new Error('Failed to update role');
  }

  return response.json();
}