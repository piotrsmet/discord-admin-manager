import Link from 'next/link';
import { Home, Users, Settings, Shield, Activity, MessageSquare } from 'lucide-react';

export default function Sidebar() {
  const navItems = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Members', href: '/members', icon: Users },
    { name: 'Roles & Permissions', href: '/roles', icon: Shield },
    { name: 'Channels', href: '/channels', icon: MessageSquare },
    { name: 'Activity Logs', href: '/logs', icon: Activity },
    { name: 'Bot Settings', href: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-secondary flex flex-col h-full border-r border-accent">
      <div className="h-16 flex items-center px-6 border-b border-accent font-bold text-lg tracking-wide text-foreground">
        Discord Admin
      </div>
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
          >
            <item.icon className="w-5 h-5" />
            {item.name}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-accent text-xs text-gray-400 text-center">
        Discord Manager v0.1
      </div>
    </aside>
  );
}
