import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST(request: Request) {
  const session = await auth();
  
  if (!session) {
    return NextResponse.json({ error: "Brak autoryzacji" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { channelId, title, description, color } = body;

    if (!channelId || !description) {
      return NextResponse.json({ error: "Brak wymaganych danych" }, { status: 400 });
    }

    const botToken = process.env.DISCORD_BOT_TOKEN;
    const colorInt = color ? parseInt(color.replace("#", ""), 16) : 5814783;

    const discordResponse = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
      method: "POST",
      headers: {
        "Authorization": `Bot ${botToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        embeds: [
          {
            title: title || undefined,
            description: description,
            color: colorInt,
            author: {
              name: session.user?.name || "Użytkownik Dashboardu",
            }
          }
        ]
      }),
    });

    if (!discordResponse.ok) {
      const errorData = await discordResponse.json();
      return NextResponse.json({ error: "Błąd Discord API", details: errorData }, { status: discordResponse.status });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    return NextResponse.json({ error: "Błąd wewnętrzny serwera" }, { status: 500 });
  }
}