"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Search, Activity } from "lucide-react";
import { getActionName } from "@/lib/discord";

interface LogsManagerProps {
  initialLogs: any[];
  users: any[];
  channels: any[];
  roles: any[];
}

export default function LogsManager({ initialLogs, users, channels, roles }: LogsManagerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");

  const formatTimestamp = (id: string) => {
    try {
      const timestamp = Number(BigInt(id) >> BigInt(22)) + 1420070400000;
      return {
        date: new Date(timestamp).toLocaleString("pl-PL", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
        timeMs: timestamp
      };
    } catch (e) {
      return { date: "Nieznana data", timeMs: 0 };
    }
  };

  const getTargetName = (entry: any) => {
    const targetId = entry.target_id;
    if (!targetId) return "-";

    const type = entry.action_type;

    // Channels (10-15)
    if (type >= 10 && type <= 15) {
      const channel = channels.find((c: any) => c.id === targetId);
      return channel ? `#${channel.name}` : targetId;
    }
    
    // Users/Members (20-27)
    if (type >= 20 && type <= 27) {
      const user = users?.find((u: any) => u.id === targetId);
      return user ? `@${user.username}` : targetId;
    }

    // Roles (30-32)
    if (type >= 30 && type <= 32) {
      const role = roles.find((r: any) => r.id === targetId);
      return role ? `@${role.name}` : targetId;
    }

    // Webhooks (50-52)
    // integrations, webhooks are in the initial response but we can just use simple target lookup
    return targetId;
  };

  const processedLogs = useMemo(() => {
    return initialLogs.map(entry => {
      const user = users.find((u: any) => u.id === entry.user_id);
      const userName = user ? `${user.username}` : "Nieznany";
      const targetDisplay = getTargetName(entry);
      const actionName = getActionName(entry.action_type);
      const { date, timeMs } = formatTimestamp(entry.id);
      
      return {
        ...entry,
        userName,
        targetDisplay,
        actionName,
        dateFormatted: date,
        timeMs
      };
    });
  }, [initialLogs, users, channels, roles]);

  const filteredAndSortedLogs = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    let result = processedLogs;

    if (query) {
      result = result.filter(log => 
        log.userName.toLowerCase().includes(query) ||
        log.targetDisplay.toLowerCase().includes(query) ||
        log.actionName.toLowerCase().includes(query)
      );
    }

    result = [...result].sort((a, b) => {
      if (sortBy === "newest") return b.timeMs - a.timeMs;
      if (sortBy === "oldest") return a.timeMs - b.timeMs;
      return 0;
    });

    return result;
  }, [processedLogs, searchQuery, sortBy]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 text-primary rounded-lg">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Activity Logs</h1>
            <p className="text-sm text-gray-400">Ostatnie zdarzenia na serwerze (do 100 wpisów)</p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Szukaj (użytkownik, akcja, cel)..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-secondary border border-accent/50 rounded-md py-2 pl-9 pr-4 text-sm text-gray-200 focus:outline-none focus:border-primary transition-colors placeholder:text-gray-600"
            />
          </div>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-secondary border border-accent/50 rounded-md py-2 px-3 text-sm text-gray-200 focus:outline-none focus:border-primary transition-colors cursor-pointer"
          >
            <option value="newest">Najnowsze</option>
            <option value="oldest">Najstarsze</option>
          </select>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-400 uppercase bg-secondary border-b border-accent/50 tracking-wider">
                <tr>
                  <th scope="col" className="px-6 py-4 font-medium">Użytkownik</th>
                  <th scope="col" className="px-6 py-4 font-medium">Akcja</th>
                  <th scope="col" className="px-6 py-4 font-medium">Cel</th>
                  <th scope="col" className="px-6 py-4 font-medium text-right">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-accent/30">
                {filteredAndSortedLogs.length > 0 ? (
                  filteredAndSortedLogs.map((log, i) => (
                    <tr key={i} className="hover:bg-secondary/40 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-secondary border border-accent flex items-center justify-center text-xs text-gray-400">
                            {log.userName[0]?.toUpperCase() || "?"}
                          </div>
                          <span className="font-medium text-foreground">{log.userName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {log.actionName}
                      </td>
                      <td className="px-6 py-4 text-gray-200 font-medium">
                        {log.targetDisplay}
                      </td>
                      <td className="px-6 py-4 text-right text-gray-400">
                        {log.dateFormatted}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                      Brak dostępnych logów aktywności pasujących do wyszukiwania.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
