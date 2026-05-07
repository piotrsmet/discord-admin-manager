"use client";

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { ReactNode, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Dictionary } from "@/lib/dictionaries";

export default function DashboardLayoutClient({
  children,
  dict,
  locale
}: {
  children: ReactNode;
  dict: Dictionary;
  locale: string;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  return (
    <div className="h-full flex overflow-hidden bg-background">
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className={`
        fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <Sidebar onClose={() => setIsSidebarOpen(false)} dict={dict} />
      </div>

      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        <Header onMenuClick={() => setIsSidebarOpen(true)} dict={dict} locale={locale} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
