import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Users, MessageSquare, Activity, Settings } from "lucide-react";
import { auth, signIn, signOut } from "@/auth";
import { getUserGuilds, getServerData, getAuditLogs, getGuildChannels } from "@/lib/discord";
import EmbedBuilder from "@/components/ui/EmbedBuilder";

export default async function Dashboard() {
  const session = await auth();

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h1 className="text-2xl font-bold">Zaloguj się, aby uzyskać dostęp do panelu</h1>
        <form
          action={async () => {
            "use server";
            await signIn("discord");
          }}
        >
          <button className="px-4 py-2 bg-[#5865F2] text-white rounded-md hover:bg-[#4752C4] transition-colors">
            Zaloguj przez Discord
          </button>
        </form>
      </div>
    );
  }

  const botToken = process.env.DISCORD_BOT_TOKEN;
  const guildId = process.env.DISCORD_GUILD_ID;

  const userGuilds = session?.accessToken 
    ? await getUserGuilds(session.accessToken) 
    : [];

  const serverData = (botToken && guildId) 
    ? await getServerData(guildId, botToken) 
    : null;

  const auditLogs = (botToken && guildId)
    ? await getAuditLogs(guildId, botToken)
    : null;

  const channels = (botToken && guildId)
    ? await getGuildChannels(guildId, botToken)
    : [];
  const memberCount = serverData?.approximate_member_count || "0";
  const activeCount = serverData?.approximate_presence_count || "0";
  const serverName = serverData?.name || "Nieznany serwer";

const getActionName = (actionType: number) => {
    const actions: Record<number, string> = {
      10: "zaktualizował(a) ustawienia serwera",
      11: "utworzył(a) kanał",
      12: "zaktualizował(a) kanał",
      13: "usunął(a) kanał",
      20: "wyrzucił(a) użytkownika",
      22: "zbanował(a) użytkownika",
      23: "odbanował(a) użytkownika",
      24: "zaktualizował(a) profil członka",
      25: "zmienił(a) role użytkownika",
      26: "przeniósł(a) kogoś na inny kanał głosowy",
      27: "rozłączył(a) kogoś z kanału głosowego",
      28: "dodał(a) bota na serwer",
      30: "utworzył(a) nową rolę",
      31: "zaktualizował(a) rolę",
      32: "usunął(a) rolę",
      40: "stworzył(a) zaproszenie",
      41: "zaktualizował(a) zaproszenie",
      42: "usunął(a) zaproszenie",
      50: "zaktualizował(a) webhooka",
      60: "zaktualizował(a) emoji",
      72: "wyczyścił(a) wiadomości (Purge)",
      80: "dodał(a) nową integrację",
      81: "zaktualizował(a) integrację",
      82: "usunął(a) integrację",
    };
    
    return actions[actionType] || `wykonał(a) nieznaną akcję (${actionType})`;
  };

  const stats = [
    { name: "Total Members", value: memberCount, icon: Users, color: "text-blue-400" },
    { name: "Active Online", value: activeCount, icon: Activity, color: "text-yellow-400" },
    { name: "Messages Today", value: "1,204", icon: MessageSquare, color: "text-green-400" },
    { name: "Bot Uptime", value: "99.9%", icon: Settings, color: "text-purple-400" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Witaj, {session?.user?.name}</h1>
        <div className="flex gap-4">
          <button className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-md font-medium transition-colors text-sm">
            Generate Report
          </button>
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md font-medium transition-colors text-sm">
              Wyloguj
            </button>
          </form>
        </div>
      </div>

      <div className="text-sm text-gray-400 mb-4">
        Statystyki dla serwera: <span className="font-bold text-white">{serverName}</span>
        <br />
        Należysz do {userGuilds.length || 0} serwerów Discord.
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.name} className="hover:border-primary/50 transition-colors">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">{stat.name}</p>
                <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg bg-white/5 ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader title="Recent Activity" description="Latest events on your server" />
          <CardContent>
            <div className="space-y-4">
              {auditLogs?.audit_log_entries?.map((entry: any, i: number) => {
                const user = auditLogs.users.find((u: any) => u.id === entry.user_id);
                const userName = user ? `${user.username}` : "Nieznany";
                
                return (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-accent/30 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-secondary border border-accent flex items-center justify-center text-xs text-gray-400">
                        {userName[0]?.toUpperCase() || "?"}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{userName}</p>
                        <p className="text-xs text-gray-400">{getActionName(entry.action_type)}</p>
                      </div>
                    </div>
                  </div>
                );
              }) || <p className="text-sm text-gray-400">Brak ostatnich aktywności</p>}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader title="Server Health" description="Status of your key integrations" />
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Main Bot", status: "Operational", color: "bg-green-500" },
                { name: "Music Bot", status: "High Latency", color: "bg-yellow-500" },
                { name: "Auto-Moderator", status: "Operational", color: "bg-green-500" },
                { name: "Discord API", status: "Operational", color: "bg-green-500" },
              ].map((service, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-md bg-secondary border border-accent/50">
                  <span className="text-sm font-medium text-gray-200">{service.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">{service.status}</span>
                    <span className={`w-2 h-2 rounded-full ${service.color}`}></span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <EmbedBuilder channels={channels}/>
      </div>
    </div>
  );
}