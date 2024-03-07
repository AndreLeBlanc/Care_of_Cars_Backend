import { desc, eq, or, sql } from "drizzle-orm";

import { db } from "../config/db-connect";
import { permissions, roleToPermissions, roles } from "../schema/schema";
import { ilike } from "drizzle-orm";
import { PatchRoleSchemaType } from "../routes/roles/roleSchema";

export async function getRolesPaginate(search:string, limit=10, page=1, offset=0) {
    const condition = or(
        ilike(roles.roleName, '%' + search + '%' ),
        ilike(roles.description, '%' + search + '%' ),
      );
  
    const [totalItems] = await db
        .select({
        count: sql`count(*)`.mapWith(Number).as("count"),
        })
        .from(roles)
        .where(condition);
  
        const rolesList = await db.select(
            {id: roles.id, roleName: roles.roleName, description: roles.description, createdAt: roles.createdAt, updatedAt: roles.updatedAt}
            ).
            from(roles)
            .where(
                condition
            )
            .orderBy(desc(roles.id))
            .limit(limit || 10)
            .offset(offset || 0);
  const totalPage = Math.ceil(totalItems.count/limit)
  
  return {
    totalItems: totalItems.count,
    totalPage,
    perPage: page,
    data: rolesList,
  };
    
}

export async function createRole(roleName: string, description: string) {
  return await db.insert(roles).values({roleName: roleName, description: description,})
  .returning({ id: roles.id, roleName: roles.roleName, description: roles.description });
}

export async function getRoleById(id:number): Promise<any> {
  const results = await db.select().from(roles).where(
    
      eq(roles.id, id),
    
  );
  return results[0] ? results[0] : null;
}

export async function updateRoleById(id:number, role: PatchRoleSchemaType): Promise<any> {
  const roleWithUpdatedAt = {...role, updatedAt: new Date()}
  const updatedRole = await db.update(roles)
  .set(roleWithUpdatedAt)
  .where(eq(roles.id, id))
  .returning({ id: roles.id, roleName: roles.roleName, description: roles.description, createdAt: roles.createdAt, updatedAt: roles.updatedAt });
  return updatedRole;
}

export async function deleteRole(id:number): Promise<any> {
  const deletedRole = await db.delete(roles).where(
      eq(roles.id, id),
  )
  .returning();
  return deletedRole[0] ? deletedRole[0] : null;
}
export async function getRoleWithPermissions(roleId:number): Promise<any> {
  const roleWithPermissions = db.select({permissionId: permissions.id, permissionName: permissions.permissionName, createdAt: permissions.createdAt, updatedAt: permissions.updatedAt})
                            .from(roleToPermissions)
                            .leftJoin(roles, eq(roleToPermissions.roleId, roles.id))
                            .leftJoin(permissions, eq(roleToPermissions.permissionId, permissions.id))
                            .where(eq(roles.id, roleId));
  return roleWithPermissions;
}

export async function getAllPermissionStatus(userPermissions:Array<{permissionId: number, permissionName: string}>, roleId:number): Promise<Array<{permissionId: number, permissionName: string, hasPermission: boolean}>> {
  const allPermissions = await db.select(
    {id: permissions.id, permissionName: permissions.permissionName }
    ).
    from(permissions)
    .limit(1000) // pagination is not possible here still we need to limit the rows.
  const rolePermissions: Array<{permissionId: number, permissionName: string}> = await getRoleWithPermissions(roleId);
  const allPermissionsWithStatus: Array<{permissionId: number, permissionName: string, hasPermission: boolean}> = [];
  for(const  el of allPermissions) {
    const hasPermission = rolePermissions.filter(e => e.permissionName === el.permissionName).length > 0
    allPermissionsWithStatus.push({
      permissionId: el.id,
      permissionName: el.permissionName,
      hasPermission: hasPermission
      
    })
    
  }
  return allPermissionsWithStatus;
  
}