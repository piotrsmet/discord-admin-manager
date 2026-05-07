export const demoServerData = {
  id: "demo",
  name: "Serwer Testowy (Demo)",
  icon: null,
  approximate_member_count: 1452,
  approximate_presence_count: 342,
  premium_tier: 2,
  premium_subscription_count: 12,
};

export const demoChannels = [
  { id: "c1", name: "Informacje", type: 4, position: 0 },
  { id: "c2", name: "ogłoszenia", type: 5, position: 1, parent_id: "c1" },
  { id: "c3", name: "regulamin", type: 0, position: 2, parent_id: "c1" },
  { id: "c4", name: "Główne", type: 4, position: 3 },
  { id: "c5", name: "rozmowy", type: 0, position: 4, parent_id: "c4" },
  { id: "c6", name: "memy", type: 0, position: 5, parent_id: "c4" },
  { id: "c7", name: "boty", type: 0, position: 6, parent_id: "c4" },
  { id: "c8", name: "Głosowe", type: 4, position: 7 },
  { id: "c9", name: "Główny Kanał", type: 2, position: 8, parent_id: "c8" },
  { id: "c10", name: "AFK", type: 2, position: 9, parent_id: "c8" },
];

export const demoRoles = [
  { id: "r1", name: "Właściciel", color: 16711680, position: 10, managed: false, permissions: "8" },
  { id: "r2", name: "Administrator", color: 15158332, position: 9, managed: false, permissions: "8" },
  { id: "r3", name: "Moderator", color: 3447003, position: 8, managed: false, permissions: "268435456" },
  { id: "r4", name: "VIP", color: 15844367, position: 7, managed: false, permissions: "104320577" },
  { id: "r5", name: "Gracz", color: 3066993, position: 6, managed: false, permissions: "104320577" },
  { id: "r6", name: "Nowy", color: 0, position: 5, managed: false, permissions: "104320577" },
  { id: "demo", name: "@everyone", color: 0, position: 0, managed: false, permissions: "104320577" },
];

export const demoMembers = [
  {
    user: { id: "u1", username: "admin_demo", global_name: "Admin", avatar: null, bot: false },
    roles: ["r1", "r2"],
    joined_at: "2023-01-15T12:00:00Z",
  },
  {
    user: { id: "u2", username: "mod_anna", global_name: "Anna", avatar: null, bot: false },
    roles: ["r3"],
    joined_at: "2023-03-20T14:30:00Z",
  },
  {
    user: { id: "u3", username: "vip_player", global_name: "GamerPro", avatar: null, bot: false },
    roles: ["r4", "r5"],
    joined_at: "2023-06-10T09:15:00Z",
  },
  {
    user: { id: "u4", username: "casual_user", global_name: "Jan Kowalski", avatar: null, bot: false },
    roles: ["r5"],
    joined_at: "2024-02-05T18:45:00Z",
  },
  {
    user: { id: "u5", username: "music_bot", global_name: "MusicBot", avatar: null, bot: true },
    roles: ["r3"],
    joined_at: "2023-01-16T10:00:00Z",
  },
  {
    user: { id: "u6", username: "newbie123", global_name: null, avatar: null, bot: false },
    roles: ["r6"],
    joined_at: "2024-05-01T20:20:00Z",
  },
];

// Generowanie realistycznych timestampów (Snowflake ID uproszczone dla dat z ostatnich 7 dni)
const generateFakeSnowflake = (daysAgo: number) => {
  const timestamp = Date.now() - (daysAgo * 24 * 60 * 60 * 1000);
  const discordEpoch = 1420070400000;
  return ((BigInt(timestamp - discordEpoch) << BigInt(22))).toString();
};

export const demoAuditLogs = {
  audit_log_entries: [
    { id: generateFakeSnowflake(0), action_type: 22, user_id: "u2", target_id: "u6" },
    { id: generateFakeSnowflake(1), action_type: 11, user_id: "u1", target_id: "c6" },
    { id: generateFakeSnowflake(2), action_type: 30, user_id: "u1", target_id: "r6" },
    { id: generateFakeSnowflake(3), action_type: 25, user_id: "u3", target_id: "u4" },
    { id: generateFakeSnowflake(5), action_type: 20, user_id: "u2", target_id: "u6" },
  ],
  users: demoMembers.map(m => m.user)
};

export const demoDiscordStatus = {
  components: [
    { name: "API", status: "operational" },
    { name: "Gateway", status: "operational" },
    { name: "Voice", status: "operational" },
    { name: "Push Notifications", status: "operational" },
  ]
};
