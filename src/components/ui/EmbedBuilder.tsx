"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";

// Definiujemy typ dla naszych kanałów
interface Channel {
  id: string;
  name: string;
}

interface EmbedBuilderProps {
  channels: Channel[];
  guildId: string;
}

export default function EmbedBuilder({ channels, guildId }: EmbedBuilderProps) {
  const [channelId, setChannelId] = useState("");
  const [title, setTitle] = useState("Nowa aktualizacja!");
  const [description, setDescription] = useState("Tutaj wpisz treść swojej wiadomości...");
  const [color, setColor] = useState("#5865F2");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  // Ustawiamy domyślny kanał, gdy tylko komponent otrzyma listę
  useEffect(() => {
    if (channels.length > 0 && !channelId) {
      setChannelId(channels[0].id);
    }
  }, [channels, channelId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channelId, title, description, color, guildId }),
      });

      if (res.ok) {
        setStatus("success");
        setTimeout(() => setStatus("idle"), 3000);
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="col-span-1">
        <CardHeader title="Embed Builder" description="Stwórz i wyślij bogatą wiadomość" />
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Wybierz kanał docelowy</label>
              {channels.length === 0 ? (
                <p className="text-red-400 text-sm">Brak dostępnych kanałów tekstowych.</p>
              ) : (
                <select
                  required
                  value={channelId}
                  onChange={(e) => setChannelId(e.target.value)}
                  className="w-full bg-secondary border border-accent rounded-md px-3 py-2 text-white focus:outline-none focus:border-primary appearance-none cursor-pointer"
                >
                  {channels.map((channel) => (
                    <option key={channel.id} value={channel.id}>
                      # {channel.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
            
            {/* ... Reszta formularza zostaje bez zmian ... */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Tytuł</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-secondary border border-accent rounded-md px-3 py-2 text-white focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Treść</label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-secondary border border-accent rounded-md px-3 py-2 text-white focus:outline-none focus:border-primary resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Kolor paska</label>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="h-10 w-20 bg-transparent rounded cursor-pointer"
              />
            </div>
            
            <button
              type="submit"
              disabled={status === "loading" || channels.length === 0}
              className="w-full bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-50"
            >
              {status === "loading" ? "Wysyłanie..." : "Wyślij na serwer"}
            </button>

            {status === "success" && <p className="text-green-400 text-sm mt-2">Wiadomość wysłana pomyślnie!</p>}
            {status === "error" && <p className="text-red-400 text-sm mt-2">Wystąpił błąd podczas wysyłania.</p>}
          </form>
        </CardContent>
      </Card>

      <Card className="col-span-1 bg-[#313338] border-none">
        <CardHeader title="Live Preview" description="Tak będzie wyglądać Twoja wiadomość" />
        <CardContent>
          <div className="flex gap-4 mt-4">
            <div className="w-10 h-10 rounded-full bg-primary flex-shrink-0"></div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-white hover:underline cursor-pointer">Twój Bot / Użytkownik</span>
                <span className="text-xs bg-[#5865F2] text-white px-1 rounded font-medium">BOT</span>
                <span className="text-xs text-gray-400">Dziś o 12:00</span>
              </div>
              
              <div 
                className="bg-[#2B2D31] rounded max-w-md mt-2 border-l-4 p-4"
                style={{ borderLeftColor: color }}
              >
                <div className="text-sm font-medium text-gray-300 mb-2">Użytkownik Dashboardu</div>
                {title && <div className="font-bold text-white mb-2 text-base">{title}</div>}
                <div className="text-sm text-gray-300 whitespace-pre-wrap">{description}</div>
              </div>

            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}