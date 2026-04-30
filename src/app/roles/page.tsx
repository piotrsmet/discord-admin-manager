import { auth } from "@/auth";
import { getGuildRoles } from "@/lib/discord";
import PermissionsMatrix from "@/components/roles/PermissionsMatrix";
import { Shield } from "lucide-react";
import { redirect } from "next/navigation";

export default async function RolesPage() {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  const botToken = process.env.DISCORD_BOT_TOKEN;
  const guildId = process.env.DISCORD_GUILD_ID;

  if (!botToken || !guildId) {
    return <div>Missing environment variables</div>;
  }

  const roles = await getGuildRoles(guildId, botToken);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-primary/10 rounded-lg">
          <Shield className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Roles & Permissions</h1>
          <p className="text-gray-400 text-sm">Manage server roles and their corresponding permissions</p>
        </div>
      </div>

      <PermissionsMatrix 
        initialRoles={roles} 
        guildId={guildId} 
        botToken={botToken} 
      />
    </div>
  );
}
