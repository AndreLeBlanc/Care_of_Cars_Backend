import fp from 'fastify-plugin'

import * as dotenv from 'dotenv'

import { CreatedRole, createRole } from '../services/roleService.js'
import { CreatedUser, createUser, generatePasswordHash } from '../services/userService.js'
import {
  IsSuperAdmin,
  RoleDescription,
  RoleID,
  RoleName,
  UserEmail,
  UserFirstName,
  UserLastName,
  UserPassword,
} from '../schema/schema.js'
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

export default fp<SupportPluginOptions>(async () => {
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
          IsSuperAdmin(true),
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
