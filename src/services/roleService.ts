import { desc, or, sql } from "drizzle-orm";

import { db } from "../config/db-connect";
import { roles } from "../schema/schema";
import { ilike } from "drizzle-orm";

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
