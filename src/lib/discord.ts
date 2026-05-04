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

export async function getAllGuildChannels(guildId: string, botToken: string) {
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
  return channels.sort((a: { position: number }, b: { position: number }) => a.position - b.position);
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
    cache: 'no-store',
  });

  if (!response.ok) {
    const text = await response.text();
    console.error(`[getServerData] Error fetching guild ${guildId}: ${response.status} ${response.statusText} - ${text}`);
    return null;
  }

  return response.json();
}

export async function getDiscordStatus() {
  try {
    const response = await fetch("https://discordstatus.com/api/v2/summary.json", {
      next: { revalidate: 300 } // cache for 5 minutes
    });
    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    return null;
  }
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

export async function updateChannel(channelId: string, botToken: string, data: { name?: string }) {
  const response = await fetch(`https://discord.com/api/v10/channels/${channelId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bot ${botToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error(`[updateChannel] Failed to update channel: ${text}`);
    throw new Error('Failed to update channel');
  }

  return response.json();
}

export async function createChannel(guildId: string, botToken: string, data: { name: string; type: number; parent_id?: string }) {
  const response = await fetch(`https://discord.com/api/v10/guilds/${guildId}/channels`, {
    method: 'POST',
    headers: {
      Authorization: `Bot ${botToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error(`[createChannel] Failed to create channel: ${text}`);
    throw new Error('Failed to create channel');
  }

  return response.json();
}

export async function deleteChannel(channelId: string, botToken: string) {
  const response = await fetch(`https://discord.com/api/v10/channels/${channelId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bot ${botToken}`,
    },
  });

  if (!response.ok) {
    const text = await response.text();
    console.error(`[deleteChannel] Failed to delete channel: ${text}`);
    throw new Error('Failed to delete channel');
  }

  return response.json();
}