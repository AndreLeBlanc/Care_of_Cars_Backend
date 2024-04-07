import fp from 'fastify-plugin'
import * as dotenv from 'dotenv'
import { createRole, CreatedRole } from '../services/roleService.js'
import {
  createUser,
  CreatedUser,
  generatePasswordHash,
  UserFirstName,
  UserLastName,
  UserEmail,
  UserPassword,
} from '../services/userService.js'
import { RoleID, RoleName, RoleDescription } from '../services/roleService.js'
dotenv.config()

export interface SupportPluginOptions {
  // Specify Support plugin options here
}

export enum seedResult {
  Failed,
  WrongConfig,
  Success,
  AlreadySeeded,
}

export default fp<SupportPluginOptions>(async (_) => {
  async function seedSuperAdmin(): Promise<seedResult> {
    try {
      if (
        typeof process.env.SUPER_ADMIN_PASSWORD === 'string' &&
        typeof process.env.SUPER_ADMIN_EMAIL === 'string'
      ) {
        const role: CreatedRole = await createRole(
          RoleName('SuperAdmin'),
          RoleDescription('Super admin user'),
        )
        // Below two envs are required in plugins/env.ts so it will throw message in console if not added.
        const passwordHash = await generatePasswordHash(
          UserPassword(process.env.SUPER_ADMIN_PASSWORD),
        )
        const user: CreatedUser = await createUser(
          UserFirstName('SuperAdmin'),
          UserLastName('SuperAdmin'),
          UserEmail(process.env.SUPER_ADMIN_EMAIL),
          passwordHash,
          RoleID(role?.roleID),
          true,
        )
        console.info('Super admin created from seed!', role, user)
        return seedResult.Success
      } else {
        return seedResult.WrongConfig
      }
    } catch (err: any) {
      //console.log(err?.detail);
      // console.dir(err?.code);
      if (err.code == '23505') {
        console.info('Already seeded superadmin, skipping')
        return seedResult.AlreadySeeded
      } else {
        console.error(err)
        return seedResult.Failed
      }
    }
  }
  if (process.env.RUN_SEED === 'true') {
    await seedSuperAdmin()
  }
})

declare module 'fastify' {
  export interface FastifyInstance {
    seedSuperAdmin(): Promise<seedResult>
  }
}
