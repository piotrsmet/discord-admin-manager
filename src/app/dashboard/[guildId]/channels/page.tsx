import { auth } from "@/auth";
import { getAllGuildChannels } from "@/lib/discord";
import { redirect } from "next/navigation";
import ChannelManager from "@/components/channels/ChannelManager";

export default async function ChannelsPage({ params }: { params: Promise<{ guildId: string }> }) {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  const { guildId } = await params;
  const botToken = process.env.DISCORD_BOT_TOKEN;

  if (!botToken) {
    return <div>Missing bot token</div>;
  }

  const allChannels = await getAllGuildChannels(guildId, botToken);

  return <ChannelManager initialChannels={allChannels} guildId={guildId} />;
}
