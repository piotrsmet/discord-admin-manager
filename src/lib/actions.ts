"use server";

import { updateGuildRole } from "@/lib/discord";
import { revalidatePath } from "next/cache";

export async function toggleRolePermission(
  guildId: string, 
  roleId: string, 
  botToken: string, 
  currentPermissions: string, 
  permissionFlagStr: string, 
  add: boolean
) {
  try {
    let perms = BigInt(currentPermissions);
    const permissionFlag = BigInt(permissionFlagStr);
    if (add) {
      perms |= permissionFlag;
    } else {
      perms &= ~permissionFlag;
    }

    await updateGuildRole(guildId, roleId, botToken, perms.toString());
    revalidatePath('/roles');
    return { success: true, newPermissions: perms.toString() };
  } catch (error) {
    console.error("Failed to update role:", error);
    throw new Error("Failed to update role");
  }
}
