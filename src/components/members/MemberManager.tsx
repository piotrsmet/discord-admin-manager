"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Search, UserX, ShieldBan, Shield, User, Users, Clock, Settings, X, MoreVertical, Tags, Check } from "lucide-react";
import { kickMember, banMember, updateMemberRoles } from "@/app/actions/members";
import Image from "next/image";

interface Member {
  user: {
    id: string;
    username: string;
    avatar: string | null;
    bot?: boolean;
    global_name: string | null;
  };
  roles: string[];
  joined_at: string;
  premium_since?: string | null;
  nick?: string | null;
}

interface Role {
  id: string;
  name: string;
  color: number;
  position: number;
  managed: boolean;
}

export default function MemberManager({ 
  initialMembers, 
  guildId,
  roles
}: { 
  initialMembers: Member[], 
  guildId: string,
  roles: Role[]
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [actionMember, setActionMember] = useState<Member | null>(null);
  const [actionType, setActionType] = useState<"kick" | "ban" | "roles" | null>(null);
  const [sortBy, setSortBy] = useState<"joined_desc" | "joined_asc" | "name_asc" | "name_desc">("joined_desc");
  
  // Roles Modal State
  const [selectedRoles, setSelectedRoles] = useState<Set<string>>(new Set());
  const [searchRoleQuery, setSearchRoleQuery] = useState("");

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Map roles for easy access
  const rolesMap = useMemo(() => {
    const map = new Map<string, Role>();
    roles.forEach(r => map.set(r.id, r));
    return map;
  }, [roles]);

  // Sort all roles by position descending (highest first) for the modal
  const sortedRoles = useMemo(() => {
    return [...roles].sort((a, b) => b.position - a.position);
  }, [roles]);

  const filteredRoles = useMemo(() => {
    if (!searchRoleQuery.trim()) return sortedRoles;
    return sortedRoles.filter(r => r.name.toLowerCase().includes(searchRoleQuery.toLowerCase().trim()));
  }, [sortedRoles, searchRoleQuery]);

  const filteredMembers = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return initialMembers;
    
    return initialMembers.filter(member => {
      const name = member.nick || member.user.global_name || member.user.username;
      return name.toLowerCase().includes(query) || member.user.username.toLowerCase().includes(query);
    });
  }, [initialMembers, searchQuery]);

  const sortedAndFilteredMembers = useMemo(() => {
    const sorted = [...filteredMembers];
    sorted.sort((a, b) => {
      if (sortBy === "joined_desc") return new Date(b.joined_at).getTime() - new Date(a.joined_at).getTime();
      if (sortBy === "joined_asc") return new Date(a.joined_at).getTime() - new Date(b.joined_at).getTime();
      
      const nameA = (a.nick || a.user.global_name || a.user.username).toLowerCase();
      const nameB = (b.nick || b.user.global_name || b.user.username).toLowerCase();
      if (sortBy === "name_asc") return nameA.localeCompare(nameB);
      if (sortBy === "name_desc") return nameB.localeCompare(nameA);
      return 0;
    });
    return sorted;
  }, [filteredMembers, sortBy]);

  const openActionModal = (member: Member, type: "kick" | "ban" | "roles") => {
    setActionMember(member);
    setActionType(type);
    setError(null);

    if (type === "roles") {
      setSelectedRoles(new Set(member.roles));
      setSearchRoleQuery("");
    }
  };

  const closeActionModal = () => {
    setActionMember(null);
    setActionType(null);
    setError(null);
  };

  const toggleRole = (roleId: string) => {
    setSelectedRoles(prev => {
      const next = new Set(prev);
      if (next.has(roleId)) next.delete(roleId);
      else next.add(roleId);
      return next;
    });
  };

  const handleAction = async () => {
    if (!actionMember || !actionType) return;
    
    setIsProcessing(true);
    setError(null);

    let result;
    if (actionType === "kick") {
      result = await kickMember(guildId, actionMember.user.id);
    } else if (actionType === "ban") {
      result = await banMember(guildId, actionMember.user.id);
    } else if (actionType === "roles") {
      result = await updateMemberRoles(guildId, actionMember.user.id, Array.from(selectedRoles));
    }

    if (result?.error) {
      setError(result.error);
      setIsProcessing(false);
      return;
    }

    setIsProcessing(false);
    closeActionModal();
  };

  const getAvatarUrl = (user: Member["user"]) => {
    if (user.avatar) {
      return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`;
    }
    const defaultAvatarIndex = parseInt(user.id) >> 22 % 6;
    return `https://cdn.discordapp.com/embed/avatars/${defaultAvatarIndex}.png`;
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('pl-PL', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(new Date(dateString));
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 text-primary rounded-lg">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Zarządzanie Członkami</h1>
            <p className="text-gray-400 text-sm">Przeglądaj i zarządzaj użytkownikami ({initialMembers.length})</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Szukaj użytkownika..." 
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
            <option value="joined_desc">Najnowsi</option>
            <option value="joined_asc">Najstarsi</option>
            <option value="name_asc">A-Z</option>
            <option value="name_desc">Z-A</option>
          </select>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-accent/50 bg-secondary text-xs uppercase tracking-wider text-gray-400">
                <th className="px-6 py-4 font-medium">Użytkownik</th>
                <th className="px-6 py-4 font-medium">Dołączył(a)</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium text-right">Akcje</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-accent/30">
              {sortedAndFilteredMembers.length > 0 ? (
                sortedAndFilteredMembers.map((member) => {
                  const displayName = member.nick || member.user.global_name || member.user.username;
                  
                  // Sort member roles by position
                  const memberRoles = member.roles
                    .map(roleId => rolesMap.get(roleId))
                    .filter((r): r is Role => r !== undefined)
                    .sort((a, b) => b.position - a.position)
                    .slice(0, 3); // Show max 3 roles
                  
                  const hiddenRolesCount = member.roles.length - memberRoles.length;

                  return (
                    <tr key={member.user.id} className="hover:bg-secondary/40 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={getAvatarUrl(member.user)} 
                            alt={displayName}
                            className="w-10 h-10 rounded-full bg-secondary border border-accent/50"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-200">{displayName}</span>
                              {member.user.bot && (
                                <span className="bg-[#5865F2] text-white text-[10px] px-1.5 py-0.5 rounded flex items-center font-bold">
                                  BOT
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-gray-500">@{member.user.username}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                          <Clock className="w-4 h-4" />
                          {formatDate(member.joined_at)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1.5 cursor-pointer" onClick={() => openActionModal(member, "roles")}>
                          {memberRoles.map(role => {
                            const hexColor = role.color === 0 ? "#99aab5" : `#${role.color.toString(16).padStart(6, '0')}`;
                            return (
                              <div 
                                key={role.id} 
                                className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-background border border-accent/50 text-xs"
                              >
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: hexColor }} />
                                <span className="text-gray-300">{role.name}</span>
                              </div>
                            );
                          })}
                          {hiddenRolesCount > 0 && (
                            <div className="flex items-center px-2 py-0.5 rounded bg-background border border-accent/50 text-xs text-gray-500">
                              +{hiddenRolesCount}
                            </div>
                          )}
                          {member.roles.length === 0 && (
                            <span className="text-gray-600 text-sm italic hover:text-gray-400 transition-colors">Brak ról - dodaj</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => openActionModal(member, "roles")}
                            className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-md transition-colors tooltip-trigger"
                            title="Edytuj role"
                          >
                            <Tags className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => openActionModal(member, "kick")}
                            className="p-2 text-gray-400 hover:text-yellow-400 hover:bg-yellow-400/10 rounded-md transition-colors tooltip-trigger"
                            title="Wyrzuć użytkownika"
                          >
                            <UserX className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => openActionModal(member, "ban")}
                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-colors"
                            title="Zbanuj użytkownika"
                          >
                            <ShieldBan className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    Nie znaleziono użytkowników pasujących do "{searchQuery}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          </div>
        </CardContent>
      </Card>

      {/* Action Modal */}
      {actionMember && actionType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className={`bg-[#313338] rounded-xl w-full ${actionType === 'roles' ? 'max-w-lg' : 'max-w-md'} shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]`}>
            <div className="flex items-center justify-between p-4 border-b border-[#1e1f22]/50 shrink-0">
              <h2 className={`text-lg font-bold flex items-center gap-2 ${actionType === 'ban' ? 'text-red-400' : actionType === 'kick' ? 'text-yellow-400' : 'text-gray-100'}`}>
                {actionType === 'ban' ? <ShieldBan className="w-5 h-5" /> : actionType === 'kick' ? <UserX className="w-5 h-5" /> : <Tags className="w-5 h-5 text-gray-400" />}
                {actionType === 'ban' ? 'Zbanuj użytkownika' : actionType === 'kick' ? 'Wyrzuć użytkownika' : 'Edytuj role użytkownika'}
              </h2>
              <button 
                onClick={closeActionModal}
                className="text-gray-400 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-5 flex flex-col gap-4 overflow-hidden">
              <div className="bg-[#2b2d31] p-4 rounded-lg flex items-center gap-4 shrink-0">
                <img 
                  src={getAvatarUrl(actionMember.user)} 
                  alt={actionMember.user.username}
                  className="w-12 h-12 rounded-full bg-secondary"
                />
                <div>
                  <div className="font-bold text-gray-100">
                    {actionMember.nick || actionMember.user.global_name || actionMember.user.username}
                  </div>
                  <div className="text-sm text-gray-400">
                    @{actionMember.user.username}
                  </div>
                </div>
              </div>

              {actionType === 'roles' ? (
                <div className="flex flex-col gap-4 overflow-hidden min-h-0">
                  <div className="relative shrink-0">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input 
                      type="text" 
                      placeholder="Szukaj roli..." 
                      value={searchRoleQuery}
                      onChange={(e) => setSearchRoleQuery(e.target.value)}
                      className="w-full bg-[#1e1f22] border border-transparent rounded-md py-2 pl-9 pr-4 text-sm text-gray-200 focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  
                  <div className="bg-[#2b2d31] rounded-md border border-[#1e1f22] overflow-hidden flex flex-col min-h-0">
                    <div className="max-h-[300px] overflow-y-auto p-2 space-y-1 overscroll-contain [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-[#1e1f22] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-600">
                      {filteredRoles.map(role => {
                        const isSelected = selectedRoles.has(role.id);
                        const hexColor = role.color === 0 ? "#99aab5" : `#${role.color.toString(16).padStart(6, '0')}`;
                        if (role.id === guildId) return null;
                        
                        return (
                          <button
                            key={role.id}
                            onClick={() => !role.managed && toggleRole(role.id)}
                            disabled={role.managed}
                            className={`w-full flex items-center justify-between p-2 rounded-md transition-colors text-left ${role.managed ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#1e1f22]'}`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: hexColor }} />
                              <span className={`text-sm ${isSelected ? 'text-gray-100 font-medium' : 'text-gray-300'}`}>
                                {role.name}
                              </span>
                              {role.managed && <span className="text-[10px] text-gray-500 uppercase tracking-wider bg-[#1e1f22] px-1.5 py-0.5 rounded">Zarządzana</span>}
                            </div>
                            <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${isSelected ? 'bg-[#5865F2] border-[#5865F2]' : 'border-gray-600 bg-transparent'}`}>
                              {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                            </div>
                          </button>
                        );
                      })}
                      {filteredRoles.length === 0 && (
                        <div className="text-center py-6 text-gray-500 text-sm">Brak ról spełniających kryteria.</div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-300 leading-relaxed shrink-0">
                  Czy na pewno chcesz {actionType === 'ban' ? <strong className="text-red-400">zbanować</strong> : <strong className="text-yellow-400">wyrzucić</strong>} tego użytkownika z serwera? 
                  {actionType === 'ban' 
                    ? ' Zbanowany użytkownik nie będzie mógł ponownie dołączyć bez cofnięcia bana.' 
                    : ' Użytkownik będzie mógł ponownie dołączyć, jeśli otrzyma nowe zaproszenie.'}
                </p>
              )}

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md text-red-400 text-sm shrink-0">
                  {error}
                </div>
              )}
            </div>

            <div className="p-4 bg-[#2b2d31] flex justify-end gap-3 border-t border-[#1e1f22]/50 shrink-0">
              <button 
                onClick={closeActionModal}
                disabled={isProcessing}
                className="px-4 py-2 text-sm font-medium text-white hover:underline disabled:opacity-50 transition-all"
              >
                Anuluj
              </button>
              <button 
                onClick={handleAction}
                disabled={isProcessing}
                className={`px-6 py-2 text-sm font-medium text-white rounded-md disabled:opacity-50 transition-colors ${
                  actionType === 'ban' ? 'bg-red-500 hover:bg-red-600' : 
                  actionType === 'kick' ? 'bg-yellow-500 hover:bg-yellow-600' :
                  'bg-[#5865F2] hover:bg-[#4752C4]'
                }`}
              >
                {isProcessing ? "Zapisywanie..." : (actionType === 'ban' ? "Tak, zbanuj" : actionType === 'kick' ? "Tak, wyrzuć" : "Zapisz role")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
