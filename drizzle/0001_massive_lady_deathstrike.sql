DO $$ BEGIN
 ALTER TABLE "roleToPermissions" ADD CONSTRAINT "roleToPermissions_roleID_roles_roleID_fk" FOREIGN KEY ("roleID") REFERENCES "public"."roles"("roleID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
