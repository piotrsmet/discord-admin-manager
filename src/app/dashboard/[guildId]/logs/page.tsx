import { auth, signIn } from "@/auth";
import { getAuditLogs, getAllGuildChannels, getGuildRoles } from "@/lib/discord";
import LogsManager from "@/components/logs/LogsManager";

export default async function LogsPage({ params }: { params: Promise<{ guildId: string }> }) {
  const session = await auth();

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <h1 className="text-2xl font-bold">Zaloguj się, aby uzyskać dostęp</h1>
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

  if (!botToken) {
    return <div>Brak konfiguracji bota.</div>;
  }

  const [auditLogs, channels, roles] = await Promise.all([
    getAuditLogs(guildId, botToken, 100),
    getAllGuildChannels(guildId, botToken),
    getGuildRoles(guildId, botToken),
  ]);

  return (
    <LogsManager 
      initialLogs={auditLogs?.audit_log_entries || []} 
      users={auditLogs?.users || []} 
      channels={channels}
      roles={roles}
    />
  );
}
