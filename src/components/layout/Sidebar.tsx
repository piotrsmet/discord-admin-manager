"use client";

import Link from 'next/link';
import { Home, Users, Settings, Shield, Activity, MessageSquare } from 'lucide-react';
import { useParams, usePathname } from 'next/navigation';

export default function Sidebar() {
  const params = useParams();
  const pathname = usePathname();
  const guildId = params.guildId as string;
  
  const basePath = `/dashboard/${guildId}`;

  const navItems = [
    { name: 'Dashboard', href: basePath, icon: Home, exact: true },
    { name: 'Members', href: `${basePath}/members`, icon: Users },
    { name: 'Roles & Permissions', href: `${basePath}/roles`, icon: Shield },
    { name: 'Channels', href: `${basePath}/channels`, icon: MessageSquare },
    { name: 'Activity Logs', href: `${basePath}/logs`, icon: Activity },
    { name: 'Bot Settings', href: `${basePath}/settings`, icon: Settings },
  ];

  return (
    <aside className="w-64 bg-secondary flex flex-col h-full border-r border-accent shrink-0">
      <div className="h-16 flex items-center px-6 border-b border-accent font-bold text-lg tracking-wide text-foreground">
        Discord Admin
      </div>
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = item.exact ? pathname === item.href : pathname?.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-accent text-xs text-gray-400 text-center flex flex-col gap-2">
        <Link href="/" className="hover:text-white transition-colors block p-2 rounded-md bg-white/5 hover:bg-white/10 mb-2 border border-accent/50">
          ← Zmień serwer
        </Link>
        Discord Manager v0.2
      </div>
    </aside>
  );
}
