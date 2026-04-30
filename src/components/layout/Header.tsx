import { Bell, Search, User } from 'lucide-react';

export default function Header() {
  return (
    <header className="h-16 bg-background flex items-center justify-between px-6 border-b border-accent shrink-0">
      <div className="flex items-center bg-secondary rounded-md px-3 py-1.5 w-64 border border-accent/50 focus-within:border-primary transition-colors">
        <Search className="w-4 h-4 text-gray-400" />
        <input 
          type="text" 
          placeholder="Search..." 
          className="bg-transparent border-none outline-none text-sm text-gray-200 ml-2 w-full placeholder:text-gray-500"
        />
      </div>
      
      <div className="flex items-center gap-4">
        <button className="text-gray-400 hover:text-white transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="flex items-center gap-2 cursor-pointer bg-secondary px-3 py-1.5 rounded-md hover:bg-white/5 transition-colors border border-accent/50">
          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-medium text-gray-200">Admin</span>
        </div>
      </div>
    </header>
  );
}
