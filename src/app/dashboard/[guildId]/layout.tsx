import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { ReactNode } from "react";

export default function DashboardLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ guildId: string }>;
}) {
  return (
    <div className="h-full flex overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-y-auto bg-background p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
