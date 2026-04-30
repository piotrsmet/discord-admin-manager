export interface DiscordUser {
  id: string;
  username: string;
  avatar: string;
  discriminator: string;
}

export interface DiscordMember {
  user: DiscordUser;
  roles: string[];
  joined_at: string;
}

export interface DiscordRole {
  id: string;
  name: string;
  color: number;
  hoist: boolean;
  position: number;
  permissions: string;
}

export interface ServerStats {
  totalMembers: number;
  onlineMembers: number;
  totalChannels: number;
  totalRoles: number;
}
