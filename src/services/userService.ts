import { desc, or, sql } from "drizzle-orm";
import { db } from "../config/db-connect";
import { CreateUserType } from "../routes/users/schema";
import { users } from "../schema/schema";
import { ilike } from "drizzle-orm";

export async function createUser(user: CreateUserType) {
    return  await db.insert(users).values(user)
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