import { auth, signIn, signOut } from "@/auth";
import { getUserGuilds } from "@/lib/discord";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import Link from "next/link";
import { LogOut } from "lucide-react";

export default async function Home() {
  const session = await auth();

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h1 className="text-3xl font-bold text-foreground">Discord Admin Manager</h1>
        <p className="text-gray-400 mb-4">Manage your Discord servers from one place</p>
        <form
          action={async () => {
            "use server";
            await signIn("discord");
          }}
        >
          <button className="px-6 py-3 bg-[#5865F2] text-white rounded-md hover:bg-[#4752C4] transition-colors font-medium">
            Zaloguj przez Discord
          </button>
        </form>
      </div>
    );
  }

  // Fetch the user's guilds
  const userGuilds = session.accessToken 
    ? await getUserGuilds(session.accessToken) 
    : [];

  // Filter guilds where user has MANAGE_GUILD (0x20) or ADMINISTRATOR (0x8)
  // For simplicity, we check if they have admin permissions or manage server
  const managedGuilds = userGuilds.filter((guild: any) => {
    const permissions = BigInt(guild.permissions);
    const hasAdmin = (permissions & BigInt(0x8)) === BigInt(0x8);
    const hasManageGuild = (permissions & BigInt(0x20)) === BigInt(0x20);
    return hasAdmin || hasManageGuild;
  });

  return (
    <div className="min-h-screen p-8 flex flex-col max-w-6xl mx-auto">
      <header className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Wybierz serwer</h1>
          <p className="text-gray-400 mt-1">
            Zalogowano jako <span className="text-white font-medium">{session.user?.name}</span>
          </p>
        </div>
        <form
          action={async () => {
            "use server";
            await signOut();
          }}
        >
          <button className="flex items-center gap-2 bg-secondary hover:bg-white/10 border border-accent text-white px-4 py-2 rounded-md font-medium transition-colors text-sm">
            <LogOut className="w-4 h-4" />
            Wyloguj
          </button>
        </form>
      </header>

      {managedGuilds.length === 0 ? (
        <div className="text-center py-20 bg-secondary rounded-xl border border-accent">
          <p className="text-xl font-semibold text-white mb-2">Brak serwerów do zarządzania</p>
          <p className="text-gray-400">Musisz mieć uprawnienia Administratora lub Zarządzania Serwerem na jakimś serwerze.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {managedGuilds.map((guild: any) => (
            <Link href={`/dashboard/${guild.id}`} key={guild.id}>
              <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full group hover:shadow-[0_0_20px_rgba(88,101,242,0.15)]">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  {guild.icon ? (
                    <img 
                      src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`} 
                      alt={guild.name}
                      className="w-20 h-20 rounded-full mb-4 group-hover:scale-105 transition-transform shadow-lg"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-secondary border border-accent mb-4 flex items-center justify-center text-2xl font-bold text-gray-400 group-hover:scale-105 transition-transform shadow-lg">
                      {guild.name.charAt(0)}
                    </div>
                  )}
                  <h2 className="text-lg font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">{guild.name}</h2>
                  <p className="text-xs text-gray-500 mt-2 bg-background px-3 py-1 rounded-full border border-accent/50">
                    Zarządzaj serwerem
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
