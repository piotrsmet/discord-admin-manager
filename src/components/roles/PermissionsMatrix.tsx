"use client";

import { useOptimistic, startTransition } from "react";
import { toggleRolePermission } from "@/lib/actions";
import { Check, X } from "lucide-react";

type Role = {
  id: string;
  name: string;
  permissions: string;
  position: number;
  color: number;
  managed: boolean;
};

const PERMISSIONS = [
  { name: "Administrator", flag: BigInt(8) },
  { name: "Manage Server", flag: BigInt(32) },
  { name: "Manage Roles", flag: BigInt(268435456) },
  { name: "Manage Channels", flag: BigInt(16) },
  { name: "Kick Members", flag: BigInt(2) },
  { name: "Ban Members", flag: BigInt(4) },
  { name: "Manage Messages", flag: BigInt(8192) },
];

export default function PermissionsMatrix({ 
  initialRoles, 
  guildId, 
  botToken 
}: { 
  initialRoles: Role[];
  guildId: string;
  botToken: string;
}) {
  const [optimisticRoles, addOptimisticRole] = useOptimistic(
    initialRoles,
    (state, newRole: Role) => state.map(r => r.id === newRole.id ? newRole : r)
  );

  const handleToggle = (role: Role, flag: bigint, isGranted: boolean) => {
    if (role.name === "@everyone" && flag === BigInt(8)) return; // Disallow giving everyone admin

    const currentPerms = BigInt(role.permissions);
    const newPerms = isGranted ? (currentPerms & ~flag) : (currentPerms | flag);
    
    startTransition(() => {
      addOptimisticRole({ ...role, permissions: newPerms.toString() });
    });

    toggleRolePermission(guildId, role.id, botToken, role.permissions, flag.toString(), !isGranted);
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-accent bg-secondary shadow-xl shadow-black/20">
      <table className="w-full text-sm text-left">
        <thead className="bg-secondary/80 border-b border-accent text-gray-300">
          <tr>
            <th className="px-6 py-4 font-semibold">Role</th>
            {PERMISSIONS.map(p => (
              <th key={p.name} className="px-4 py-4 font-semibold text-center whitespace-nowrap">
                {p.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-accent">
          {optimisticRoles.map(role => {
            const currentPerms = BigInt(role.permissions);
            const isAdmin = (currentPerms & BigInt(8)) === BigInt(8);

            return (
              <tr key={role.id} className="hover:bg-white/5 transition-colors group">
                <td className="px-6 py-4 flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: role.color ? `#${role.color.toString(16).padStart(6, '0')}` : '#99aab5' }}
                  />
                  <span className="font-medium text-foreground">{role.name}</span>
                  {role.managed && <span className="text-[10px] uppercase font-bold tracking-wider bg-[#5865F2]/20 text-[#5865F2] px-2 py-0.5 rounded ml-2">Managed</span>}
                </td>
                
                {PERMISSIONS.map(p => {
                  const isGranted = (currentPerms & p.flag) === p.flag;
                  const isEditable = !role.managed;
                  const isImplicitlyGranted = isAdmin && p.flag !== BigInt(8);
                  const isDisabled = !isEditable || (role.name === "@everyone" && p.flag === BigInt(8));

                  return (
                    <td key={p.name} className="px-4 py-3 text-center">
                      <button
                        disabled={isDisabled}
                        onClick={() => handleToggle(role, p.flag, isGranted || isImplicitlyGranted)}
                        className={`
                          w-6 h-6 rounded flex items-center justify-center mx-auto transition-all duration-200
                          ${isDisabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer hover:scale-110 hover:ring-2 hover:ring-primary/50'}
                          ${(isGranted || isImplicitlyGranted)
                            ? (isImplicitlyGranted ? 'bg-primary/40 text-white/70' : 'bg-primary text-white shadow-lg shadow-primary/30') 
                            : 'bg-accent/50 text-transparent hover:text-white/20'}
                        `}
                      >
                        {(isGranted || isImplicitlyGranted) ? <Check className="w-4 h-4" /> : <X className="w-4 h-4 opacity-0 group-hover:opacity-100" />}
                      </button>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
