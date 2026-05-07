import { User, Menu } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { setLanguage } from '@/app/actions/language';
import { Dictionary } from '@/lib/dictionaries';

export default function Header({ onMenuClick, dict, locale }: { onMenuClick: () => void; dict: Dictionary; locale: string }) {
  const router = useRouter();

  const handleLanguageChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value;
    await setLanguage(newLocale);
    router.refresh();
  };
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
        <select 
          value={locale}
          onChange={handleLanguageChange}
          className="bg-secondary text-gray-200 text-sm rounded-md border border-accent/50 px-2 py-1 outline-none cursor-pointer"
        >
          <option value="pl">{dict.header.polski}</option>
          <option value="en">{dict.header.english}</option>
        </select>
        <div className="flex items-center gap-2 cursor-pointer bg-secondary px-2 sm:px-3 py-1.5 rounded-md hover:bg-white/5 transition-colors border border-accent/50">
          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <span className="text-xs sm:text-sm font-medium text-gray-200">{dict.header.admin}</span>
        </div>
      </div>
    </header>
  );
}
