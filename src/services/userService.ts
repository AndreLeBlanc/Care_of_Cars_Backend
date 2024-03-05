import { desc, or, sql, and, eq } from "drizzle-orm";
import { db } from "../config/db-connect";
import { users } from "../schema/schema";
import { ilike } from "drizzle-orm";

export async function createUser(firstName: string, lastName: string, email: string, passwordHash: string) {
    return  await db.insert(users).values({firstName: firstName, lastName: lastName, email: email, password: passwordHash})
}

export async function getUsersPaginate(search:string, limit=10, page=1, offset=0) {
    const condition = or(
        ilike(users.firstName, '%' + search + '%' ),
        ilike(users.lastName, '%' + search + '%' ),
        ilike(users.email, '%' + search + '%' )
      );
  
    const [totalItems] = await db
        .select({
        count: sql`count(*)`.mapWith(Number).as("count"),
        })
        .from(users)
        .where(condition);
  
        const usersList = await db.select(
            {id:users.id, firstName: users.firstName, lastName: users.lastName, email: users.email, createdAt: users.createdAt, updatedAt: users.updatedAt}
            ).
            from(users)
            .where(
              or(
                ilike(users.firstName, '%' + search + '%' ),
                ilike(users.lastName, '%' + search + '%' ),
                ilike(users.email, '%' + search + '%' )
              )
            )
            .orderBy(desc(users.id))
            .limit(limit || 10)
            .offset(offset || 0);
  const totalPage = Math.ceil(totalItems.count/limit)
  
  return {
    totalItems: totalItems.count,
    totalPage,
    perPage: page,
    data: usersList,
  };
    
}

export async function verifyUser(email:string): Promise<any> {
    const results = await db.select().from(users).where(
      and(
        eq(users.email, email),
        //eq(users.password, password)
      )
    );
  return results[0] ? results[0] : null;
}
