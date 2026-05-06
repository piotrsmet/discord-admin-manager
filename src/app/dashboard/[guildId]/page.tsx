import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Users, MessageSquare, Activity, Settings, Zap } from "lucide-react";
import { auth, signIn, signOut } from "@/auth";
import { getUserGuilds, getServerData, getAuditLogs, getGuildChannels, getDiscordStatus, getActionName } from "@/lib/discord";
import EmbedBuilder from "@/components/ui/EmbedBuilder";
import ActivityChart from "@/components/ui/ActivityChart";
import ReportGenerator from "@/components/ui/ReportGenerator";

export default async function Dashboard({ params }: { params: Promise<{ guildId: string }> }) {
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

  const { guildId } = await params;
  const botToken = process.env.DISCORD_BOT_TOKEN;
  const clientId = process.env.DISCORD_CLIENT_ID;

  if (!botToken) {
    return <div>Brak konfiguracji bota.</div>;
  }

  const serverData = await getServerData(guildId, botToken);

  // If serverData is null, the bot is probably not on the server
  if (!serverData) {
    const inviteUrl = `https://discord.com/oauth2/authorize?client_id=${clientId}&permissions=8&scope=bot&guild_id=${guildId}&disable_guild_select=true`;
    
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Bot nie jest na tym serwerze</h2>
        <p className="text-gray-400 mb-6 max-w-md">
          Aby zarządzać tym serwerem, musisz zaprosić bota z odpowiednimi uprawnieniami (Administrator).
        </p>
        <a 
          href={inviteUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="px-6 py-3 bg-[#5865F2] text-white font-medium rounded-md hover:bg-[#4752C4] transition-colors"
        >
          Zaproś Bota
        </a>
      </div>
    );
  }

  const auditLogs = await getAuditLogs(guildId, botToken);
  const channels = await getGuildChannels(guildId, botToken);
  const discordStatus = await getDiscordStatus();
    
  const memberCount = serverData?.approximate_member_count || "0";
  const activeCount = serverData?.approximate_presence_count || "0";
  const serverName = serverData?.name || "Nieznany serwer";
  const boostsCount = serverData?.premium_subscription_count || "0";
  const textChannelsCount = channels.length;

  const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
  const now = Date.now();
  
  const allAuditLogs = auditLogs?.audit_log_entries || [];
  const recentAuditLogs = allAuditLogs.slice(0, 5);
  
  const chartAuditLogs = allAuditLogs.filter((entry: any) => {
    if (!entry.id) return false;
    try {
      const timestamp = Number(BigInt(entry.id) >> BigInt(22)) + 1420070400000;
      return (now - timestamp) <= SEVEN_DAYS_MS;
    } catch (e) {
      return false;
    }
  });

  const stats = [
    { name: "Total Members", value: memberCount, icon: Users, color: "text-blue-400" },
    { name: "Active Online", value: activeCount, icon: Activity, color: "text-yellow-400" },
    { name: "Kanały Tekstowe", value: textChannelsCount.toString(), icon: MessageSquare, color: "text-green-400" },
    { name: "Liczba Ulepszeń", value: boostsCount.toString(), icon: Zap, color: "text-purple-400" },
  ];

  // Map real Discord API components or use fallbacks if API is down
  const statusComponents = discordStatus?.components
    ? discordStatus.components
        .filter((c: any) => ["API", "Gateway", "Voice", "Push Notifications"].includes(c.name))
        .map((c: any) => ({
          name: c.name,
          status: c.status === "operational" ? "Operational" : c.status === "degraded_performance" ? "High Latency" : "Outage",
          color: c.status === "operational" ? "bg-green-500" : c.status === "degraded_performance" ? "bg-yellow-500" : "bg-red-500",
        }))
    : [
        { name: "Discord API", status: "Unknown", color: "bg-gray-500" },
        { name: "Gateway", status: "Unknown", color: "bg-gray-500" },
        { name: "Voice", status: "Unknown", color: "bg-gray-500" },
      ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Witaj, {session?.user?.name}</h1>
        <div className="flex gap-4">
          <ReportGenerator guildId={guildId} />
        </div>
      </div>

      <div className="text-sm text-gray-400 mb-4">
        Statystyki dla serwera: <span className="font-bold text-white">{serverName}</span>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1">
          <CardHeader title="Recent Activity" description="Latest events on your server" />
          <CardContent>
            <div className="space-y-4">
              {recentAuditLogs.map((entry: any, i: number) => {
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

        <div className="col-span-1">
          <ActivityChart data={chartAuditLogs} />
        </div>

        <Card className="col-span-1">
          <CardHeader title="Discord Health" description="Status of Discord services" />
          <CardContent>
            <div className="space-y-4">
              {statusComponents.map((service: any, i: number) => (
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