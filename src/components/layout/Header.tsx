import { Bell, User, Menu } from 'lucide-react';

export default function Header({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="h-16 bg-background flex items-center justify-between px-4 sm:px-6 border-b border-accent shrink-0">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="p-2 -ml-2 text-gray-400 hover:text-white md:hidden transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>
      
      <div className="flex items-center gap-3 sm:gap-4">
        <button className="hidden sm:block text-gray-400 hover:text-white transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="flex items-center gap-2 cursor-pointer bg-secondary px-2 sm:px-3 py-1.5 rounded-md hover:bg-white/5 transition-colors border border-accent/50">
          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <span className="text-xs sm:text-sm font-medium text-gray-200">Admin</span>
        </div>
      </div>
    </header>
  );
}
