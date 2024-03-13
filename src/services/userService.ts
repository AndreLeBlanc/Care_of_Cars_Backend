import { desc, or, sql, and, eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'
import { db } from '../config/db-connect'
import { roles, users } from '../schema/schema.js'
import { ilike } from 'drizzle-orm'
import { PatchUserSchemaType } from '../routes/users/userSchema'

export async function createUser(
  firstName: string,
  lastName: string,
  email: string,
  passwordHash: string,
  roleId: number,
) {
  return await db
    .insert(users)
    .values({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: passwordHash,
      roleId: roleId,
    })
    .returning({
      id: users.id,
      firstName: users.firstName,
      lastName: users.lastName,
      email: users.email,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
      roleId: users.roleId,
    })
}

export async function getUsersPaginate(search: string, limit = 10, page = 1, offset = 0) {
  const condition = or(
    ilike(users.firstName, '%' + search + '%'),
    ilike(users.lastName, '%' + search + '%'),
    ilike(users.email, '%' + search + '%'),
  )

  const [totalItems] = await db
    .select({
      count: sql`count(*)`.mapWith(Number).as('count'),
    })
    .from(users)
    .where(condition)

  const usersList = await db
    .select({
      id: users.id,
      firstName: users.firstName,
      lastName: users.lastName,
      email: users.email,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    })
    .from(users)
    .where(
      or(
        ilike(users.firstName, '%' + search + '%'),
        ilike(users.lastName, '%' + search + '%'),
        ilike(users.email, '%' + search + '%'),
      ),
    )
    .orderBy(desc(users.id))
    .limit(limit || 10)
    .offset(offset || 0)
  const totalPage = Math.ceil(totalItems.count / limit)

  return {
    totalItems: totalItems.count,
    totalPage,
    perPage: page,
    data: usersList,
  }
}

export async function verifyUser(email: string): Promise<any> {
  const results = await db
    .select({
      id: users.id,
      firstName: users.firstName,
      email: users.email,
      password: users.password,
      role: {
        id: roles.id,
        roleName: roles.roleName,
      },
    })
    .from(users)
    .innerJoin(roles, eq(users.roleId, roles.id))
    .where(
      and(
        eq(users.email, email),
        //eq(users.password, password)
      ),
    )
  return results[0] ? results[0] : null
}

export async function getUserById(id: number): Promise<any> {
  const results = await db.select().from(users).where(eq(users.id, id))
  return results[0] ? results[0] : null
}

export async function updateUserById(id: number, user: PatchUserSchemaType): Promise<any> {
  const userWithUpdatedAt = { ...user, updatedAt: new Date() }
  const updatedUser = await db
    .update(users)
    .set(userWithUpdatedAt)
    .where(eq(users.id, id))
    .returning({
      id: users.id,
      firstName: users.firstName,
      lastName: users.lastName,
      email: users.email,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    })
  return updatedUser
}

export async function generatePasswordHash(password: string): Promise<string> {
  const salt = bcrypt.genSaltSync(10)
  return bcrypt.hashSync(password, salt)
}

export async function isStrongPassword(password: string): Promise<boolean> {
  // TODO: add more strict checking's
  if (password.length <= 3) {
    return false
  }
  return true
}
export async function deleteUser(id: number): Promise<any> {
  const deletedUser = await db.delete(users).where(eq(users.id, id)).returning()
  return deletedUser[0] ? deletedUser[0] : null
}
