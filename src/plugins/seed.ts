import fp from 'fastify-plugin'
import { createRole } from "../services/roleService";
import { createUser, generatePasswordHash } from "../services/userService";

export interface SupportPluginOptions {
    // Specify Support plugin options here
  
}
  


export default fp<SupportPluginOptions>(async (fastify) => {

    async function seedSuperAdmin() {
        try {
            const role = await createRole('SuperAdmin', 'Super admin user');
            // Below two envs are required in plugins/env.ts so it will throw message in console if not added.
            const passwordHash = await generatePasswordHash(fastify.config.SUPER_ADMIN_PASSWORD);
            const user = await createUser("SuperAdmin", "SuperAdmin", fastify.config.SUPER_ADMIN_EMAIL, passwordHash, role[0]?.id, true);
            console.info("Super admin created from seed!", role, user);
        
        } catch(err: any) {
            //console.log(err?.detail);
            // console.dir(err?.code);
            if(err.code == '23505') {
                    console.info("Already seeded superadmin, skipping");
            } else {
                console.error(err);
            }
        }
    }
    if(fastify?.config?.RUN_SEED == true) { 
        await seedSuperAdmin();
    }
    
})
