import { auth } from "@/auth";
import { getGuildMembers, getGuildRoles } from "@/lib/discord";
import { redirect } from "next/navigation";
import MemberManager from "@/components/members/MemberManager";

export default async function MembersPage({ params }: { params: Promise<{ guildId: string }> }) {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  const { guildId } = await params;
  const botToken = process.env.DISCORD_BOT_TOKEN;

  if (!botToken) {
    return <div>Missing bot token</div>;
  }

  // Fetch members and roles in parallel
  const [members, roles] = await Promise.all([
    getGuildMembers(guildId, botToken),
    getGuildRoles(guildId, botToken)
  ]);

  return <MemberManager initialMembers={members} guildId={guildId} roles={roles} />;
}
