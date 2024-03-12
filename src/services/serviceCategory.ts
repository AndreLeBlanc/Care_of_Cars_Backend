import { desc, or, sql } from "drizzle-orm";

import { db } from "../config/db-connect";
import { serviceCategories } from "../schema/schema";
import { ilike } from "drizzle-orm";

export async function getserviceCategoriesPaginate(search:string, limit=10, page=1, offset=0) {
    const condition = or(
        ilike(serviceCategories.name, '%' + search + '%' ),
        ilike(serviceCategories.description, '%' + search + '%' ),
      );
  
    const [totalItems] = await db
        .select({
        count: sql`count(*)`.mapWith(Number).as("count"),
        })
        .from(serviceCategories)
        .where(condition);
  
        const serviceCategorysList = await db.select(
            {id: serviceCategories.id, name: serviceCategories.name, description: serviceCategories.description, createdAt: serviceCategories.createdAt, updatedAt: serviceCategories.updatedAt}
            ).
            from(serviceCategories)
            .where(
                condition
            )
            .orderBy(desc(serviceCategories.id))
            .limit(limit || 10)
            .offset(offset || 0);
  const totalPage = Math.ceil(totalItems.count/limit)
  
  return {
    totalItems: totalItems.count,
    totalPage,
    perPage: page,
    data: serviceCategorysList,
  };
    
}

export async function createserviceCategory(name: string, description: string) {
  return await db.insert(serviceCategories).values({name: name, description: description,})
  .returning({ id: serviceCategories.id, serviceCategoryName: serviceCategories.name, description: serviceCategories.description });
}
