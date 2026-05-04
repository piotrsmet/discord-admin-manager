"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Hash, Volume2, Megaphone, Folder, MessageSquare, Search, ChevronDown, ChevronRight, Settings, X, Save, Plus, Trash2 } from "lucide-react";
import { editChannel, createNewChannel, removeChannel } from "@/app/actions/channels";

interface Channel {
  id: string;
  name: string;
  type: number;
  parent_id?: string;
  position: number;
  nsfw?: boolean;
  rate_limit_per_user?: number;
}

export default function ChannelManager({ initialChannels, guildId }: { initialChannels: Channel[], guildId: string }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());
  
  // Edit Modal State
  const [editingChannel, setEditingChannel] = useState<Channel | null>(null);
  const [editName, setEditName] = useState("");
  const [editNsfw, setEditNsfw] = useState(false);
  const [editSlowmode, setEditSlowmode] = useState(0);
  
  // Create Modal State
  const [isCreating, setIsCreating] = useState(false);
  const [createName, setCreateName] = useState("");
  const [createType, setCreateType] = useState(0);
  const [createParentId, setCreateParentId] = useState<string>("");

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getChannelIcon = (type: number) => {
    switch (type) {
      case 0: return <Hash className="w-5 h-5 text-gray-400" />;
      case 2: return <Volume2 className="w-5 h-5 text-gray-400" />;
      case 5: return <Megaphone className="w-5 h-5 text-gray-400" />;
      case 4: return <Folder className="w-5 h-5 text-gray-400" />;
      default: return <MessageSquare className="w-5 h-5 text-gray-400" />;
    }
  };

  const getChannelTypeName = (type: number) => {
    switch (type) {
      case 0: return "Kanał tekstowy";
      case 2: return "Kanał głosowy";
      case 4: return "Kategoria";
      case 5: return "Kanał ogłoszeń";
      case 13: return "Kanał sceniczny (Stage)";
      case 15: return "Forum";
      default: return `Inny (${type})`;
    }
  };

  const toggleCategory = (categoryId: string) => {
    setCollapsedCategories(prev => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  const openEditModal = (channel: Channel) => {
    setEditingChannel(channel);
    setEditName(channel.name);
    setEditNsfw(channel.nsfw || false);
    setEditSlowmode(channel.rate_limit_per_user || 0);
    setError(null);
  };

  const closeEditModal = () => {
    setEditingChannel(null);
    setEditName("");
    setError(null);
  };

  const openCreateModal = () => {
    setIsCreating(true);
    setCreateName("");
    setCreateType(0);
    setCreateParentId("");
    setError(null);
  };

  const closeCreateModal = () => {
    setIsCreating(false);
    setCreateName("");
    setError(null);
  };

  const handleSaveChannel = async () => {
    if (!editingChannel) return;
    setIsSaving(true);
    setError(null);

    const result = await editChannel(editingChannel.id, guildId, { 
      name: editName,
      nsfw: editNsfw,
      rate_limit_per_user: editSlowmode 
    });

    if (result?.error) {
      setError(result.error);
      setIsSaving(false);
      return;
    }

    setIsSaving(false);
    closeEditModal();
  };

  const handleDeleteChannel = async () => {
    if (!editingChannel) return;
    if (!confirm(`Czy na pewno chcesz usunąć kanał "${editingChannel.name}"? Tej akcji nie można cofnąć.`)) return;

    setIsSaving(true);
    setError(null);

    const result = await removeChannel(editingChannel.id, guildId);

    if (result?.error) {
      setError(result.error);
      setIsSaving(false);
      return;
    }

    setIsSaving(false);
    closeEditModal();
  };

  const handleCreateChannel = async () => {
    setIsSaving(true);
    setError(null);

    const data: any = { name: createName, type: createType };
    if (createParentId && createType !== 4) {
      data.parent_id = createParentId;
    }

    const result = await createNewChannel(guildId, data);

    if (result?.error) {
      setError(result.error);
      setIsSaving(false);
      return;
    }

    setIsSaving(false);
    closeCreateModal();
  };

  const { filteredRoot, filteredCategories, allCategories } = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    const categories = initialChannels.filter((c) => c.type === 4);
    const nonCategories = initialChannels.filter((c) => c.type !== 4);

    const matchingChannels = nonCategories.filter(c => c.name.toLowerCase().includes(query));
    const channelsByParent: Record<string, Channel[]> = {};
    const rootChannels: Channel[] = [];

    matchingChannels.forEach((channel) => {
      if (channel.parent_id) {
        if (!channelsByParent[channel.parent_id]) {
          channelsByParent[channel.parent_id] = [];
        }
        channelsByParent[channel.parent_id].push(channel);
      } else {
        rootChannels.push(channel);
      }
    });

    const categoriesWithChildren = categories.map(cat => ({
      ...cat,
      children: channelsByParent[cat.id] || []
    })).filter(cat => cat.children.length > 0 || cat.name.toLowerCase().includes(query));

    return { filteredRoot: rootChannels, filteredCategories: categoriesWithChildren, allCategories: categories };
  }, [initialChannels, searchQuery]);

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Zarządzanie Kanałami</h1>
          <p className="text-gray-400 text-sm">Przeglądaj strukturę kanałów serwera</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Szukaj kanału..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-secondary border border-accent/50 rounded-md py-2 pl-9 pr-4 text-sm text-gray-200 focus:outline-none focus:border-primary transition-colors placeholder:text-gray-600"
            />
          </div>
          <button 
            onClick={openCreateModal}
            className="flex items-center justify-center gap-2 bg-[#5865F2] hover:bg-[#4752C4] text-white px-4 py-2 rounded-md transition-colors text-sm font-medium whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Utwórz Kanał</span>
          </button>
        </div>
      </div>

      {filteredRoot.length === 0 && filteredCategories.length === 0 && (
        <div className="text-center py-12 bg-secondary/30 rounded-xl border border-accent/30">
          <p className="text-gray-400 font-medium">Nie znaleziono kanałów pasujących do wyszukiwania "{searchQuery}"</p>
        </div>
      )}

      <div className="space-y-6">
        {filteredRoot.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider px-2">Brak Kategorii</h3>
            <div className="grid gap-2">
              {filteredRoot.map((channel) => (
                <Card key={channel.id} className="bg-secondary/50 hover:bg-secondary hover:border-primary/50 transition-all border-accent/50 group">
                  <CardContent className="p-3 sm:p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-md bg-background/50 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        {getChannelIcon(channel.type)}
                      </div>
                      <span className="font-medium text-gray-200">
                        {channel.type === 0 ? <span className="text-gray-500 mr-1">#</span> : null}
                        {channel.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      {channel.nsfw && (
                        <span className="hidden sm:inline-block text-[10px] text-red-400 uppercase tracking-wider bg-red-400/10 px-2 py-1 rounded-md border border-red-400/20">
                          NSFW
                        </span>
                      )}
                      <span className="hidden sm:inline-block text-xs text-gray-500 bg-background px-2 py-1 rounded-md border border-accent/30">
                        {getChannelTypeName(channel.type)}
                      </span>
                      <button 
                        onClick={() => openEditModal(channel)}
                        className="p-2 text-gray-500 hover:text-white bg-background/50 hover:bg-white/10 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Settings className="w-4 h-4" />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {filteredCategories.map((category) => {
          const isCollapsed = collapsedCategories.has(category.id);
          
          return (
            <div key={category.id} className="space-y-2">
              <div 
                onClick={() => toggleCategory(category.id)}
                className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-white/5 cursor-pointer transition-colors group"
              >
                {isCollapsed ? (
                  <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
                )}
                <h3 className="text-xs font-bold text-gray-400 group-hover:text-white uppercase tracking-wider transition-colors">
                  {category.name}
                </h3>
                <span className="text-xs text-gray-600 ml-auto bg-secondary px-2 py-0.5 rounded-full">
                  {category.children.length}
                </span>
                <button 
                  onClick={(e) => { e.stopPropagation(); openEditModal(category as any); }}
                  className="p-1 text-gray-500 hover:text-white rounded-md transition-colors opacity-0 group-hover:opacity-100 ml-2"
                >
                  <Settings className="w-3 h-3" />
                </button>
              </div>
              
              {!isCollapsed && (
                <div className="grid gap-2 pl-4 border-l-2 border-accent/30 ml-[11px] mt-2">
                  {category.children.length > 0 ? category.children.map((channel) => (
                    <Card key={channel.id} className="bg-secondary/30 hover:bg-secondary hover:border-primary/50 transition-all border-accent/30 group">
                      <CardContent className="p-2 sm:p-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 rounded-md bg-background/50 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                            {getChannelIcon(channel.type)}
                          </div>
                          <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                            {channel.type === 0 ? <span className="text-gray-600 mr-1">#</span> : null}
                            {channel.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          {channel.nsfw && (
                            <span className="hidden sm:inline-block text-[10px] text-red-400 uppercase tracking-wider bg-red-400/10 px-2 py-1 rounded-md border border-red-400/20">
                              NSFW
                            </span>
                          )}
                          <span className="hidden sm:inline-block text-[10px] text-gray-500 uppercase tracking-wider bg-background px-2 py-1 rounded-md border border-accent/30">
                            {getChannelTypeName(channel.type)}
                          </span>
                          <button 
                            onClick={() => openEditModal(channel)}
                            className="p-1.5 text-gray-500 hover:text-white bg-background/50 hover:bg-white/10 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <Settings className="w-3 h-3" />
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                  )) : (
                    <div className="text-sm text-gray-500 italic py-2 pl-2">Kategoria jest pusta</div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Edit Modal */}
      {editingChannel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-[#313338] rounded-xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-[#1e1f22]/50">
              <h2 className="text-lg font-bold text-gray-100 flex items-center gap-2">
                <Settings className="w-5 h-5 text-gray-400" />
                Edytuj {editingChannel.type === 4 ? 'kategorię' : 'kanał'}
              </h2>
              <button 
                onClick={closeEditModal}
                className="text-gray-400 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-5 space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                  Nazwa kanału
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {getChannelIcon(editingChannel.type)}
                  </div>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-[#1e1f22] border border-transparent rounded-md py-2.5 pl-10 pr-4 text-sm text-gray-100 focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              {editingChannel.type === 0 && (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-sm font-medium text-gray-200">Kanał NSFW</label>
                      <p className="text-xs text-gray-400">Użytkownicy będą musieli potwierdzić swój wiek.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={editNsfw} onChange={(e) => setEditNsfw(e.target.checked)} />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                    </label>
                  </div>

                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-200">Slowmode (sekundy)</label>
                        <p className="text-xs text-gray-400">Ogranicz częstotliwość wysyłania wiadomości.</p>
                      </div>
                      <span className="text-sm font-bold text-white bg-[#1e1f22] px-2 py-1 rounded">{editSlowmode}s</span>
                    </div>
                    <input
                      type="range"
                      min="0" max="21600" step="5"
                      value={editSlowmode}
                      onChange={(e) => setEditSlowmode(parseInt(e.target.value))}
                      className="w-full h-2 bg-[#1e1f22] rounded-lg appearance-none cursor-pointer accent-[#5865F2]"
                    />
                  </div>
                </>
              )}

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md text-red-400 text-sm">
                  {error}
                </div>
              )}
            </div>

            <div className="p-4 bg-[#2b2d31] flex justify-between gap-3">
              <button 
                onClick={handleDeleteChannel}
                disabled={isSaving}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-400 hover:text-white hover:bg-red-500 rounded-md transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Usuń
              </button>
              
              <div className="flex gap-3">
                <button 
                  onClick={closeEditModal}
                  disabled={isSaving}
                  className="px-4 py-2 text-sm font-medium text-white hover:underline disabled:opacity-50 transition-all"
                >
                  Anuluj
                </button>
                <button 
                  onClick={handleSaveChannel}
                  disabled={isSaving || editName.trim() === ""}
                  className="flex items-center gap-2 px-6 py-2 text-sm font-medium bg-[#5865F2] text-white rounded-md hover:bg-[#4752C4] disabled:opacity-50 transition-colors"
                >
                  {isSaving ? "Zapisywanie..." : "Zapisz"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-[#313338] rounded-xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-[#1e1f22]/50">
              <h2 className="text-lg font-bold text-gray-100 flex items-center gap-2">
                <Plus className="w-5 h-5 text-gray-400" />
                Utwórz kanał
              </h2>
              <button 
                onClick={closeCreateModal}
                className="text-gray-400 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-5 space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">Typ kanału</label>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => setCreateType(0)} className={`p-3 rounded-md flex items-center gap-2 border transition-colors ${createType === 0 ? 'bg-[#1e1f22] border-gray-400' : 'bg-[#1e1f22]/50 border-transparent text-gray-400 hover:bg-[#1e1f22]'}`}>
                    <Hash className="w-5 h-5" /> Tekstowy
                  </button>
                  <button onClick={() => setCreateType(2)} className={`p-3 rounded-md flex items-center gap-2 border transition-colors ${createType === 2 ? 'bg-[#1e1f22] border-gray-400' : 'bg-[#1e1f22]/50 border-transparent text-gray-400 hover:bg-[#1e1f22]'}`}>
                    <Volume2 className="w-5 h-5" /> Głosowy
                  </button>
                  <button onClick={() => setCreateType(4)} className={`col-span-2 p-3 rounded-md flex items-center justify-center gap-2 border transition-colors ${createType === 4 ? 'bg-[#1e1f22] border-gray-400' : 'bg-[#1e1f22]/50 border-transparent text-gray-400 hover:bg-[#1e1f22]'}`}>
                    <Folder className="w-5 h-5" /> Kategoria
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                  Nazwa kanału
                </label>
                <input
                  type="text"
                  value={createName}
                  onChange={(e) => setCreateName(e.target.value)}
                  className="w-full bg-[#1e1f22] border border-transparent rounded-md py-2.5 px-4 text-sm text-gray-100 focus:outline-none focus:border-primary transition-colors"
                  placeholder="nowy-kanał"
                />
              </div>

              {createType !== 4 && (
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                    Umieść w kategorii
                  </label>
                  <select
                    value={createParentId}
                    onChange={(e) => setCreateParentId(e.target.value)}
                    className="w-full bg-[#1e1f22] border border-transparent rounded-md py-2.5 px-4 text-sm text-gray-300 focus:outline-none focus:border-primary transition-colors appearance-none"
                  >
                    <option value="">-- Brak kategorii --</option>
                    {allCategories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md text-red-400 text-sm">
                  {error}
                </div>
              )}
            </div>

            <div className="p-4 bg-[#2b2d31] flex justify-end gap-3">
              <button 
                onClick={closeCreateModal}
                disabled={isSaving}
                className="px-4 py-2 text-sm font-medium text-white hover:underline disabled:opacity-50 transition-all"
              >
                Anuluj
              </button>
              <button 
                onClick={handleCreateChannel}
                disabled={isSaving || createName.trim() === ""}
                className="px-6 py-2 text-sm font-medium bg-[#5865F2] text-white rounded-md hover:bg-[#4752C4] disabled:opacity-50 transition-colors"
              >
                {isSaving ? "Tworzenie..." : "Utwórz kanał"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
