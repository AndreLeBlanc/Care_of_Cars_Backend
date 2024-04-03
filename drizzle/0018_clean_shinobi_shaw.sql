ALTER TABLE "permissions" RENAME COLUMN "id" TO "permissionID";--> statement-breakpoint
ALTER TABLE "roleToPermissions" RENAME COLUMN "roleId" TO "roleID";--> statement-breakpoint
ALTER TABLE "roleToPermissions" RENAME COLUMN "permissionId" TO "permissionID";--> statement-breakpoint
ALTER TABLE "roles" RENAME COLUMN "id" TO "roleID";--> statement-breakpoint
ALTER TABLE "serviceCategories" RENAME COLUMN "id" TO "serviceCategoryID";--> statement-breakpoint
ALTER TABLE "serviceVariants" RENAME COLUMN "id" TO "serviceVariantID";--> statement-breakpoint
ALTER TABLE "serviceVariants" RENAME COLUMN "serviceId" TO "serviceID";--> statement-breakpoint
ALTER TABLE "services" RENAME COLUMN "id" TO "serviceID";--> statement-breakpoint
ALTER TABLE "services" RENAME COLUMN "serviceCategoryId" TO "serviceCategoryID";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "id" TO "userID";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "roleId" TO "roleID";--> statement-breakpoint
ALTER TABLE "permissions" DROP CONSTRAINT "permissions_id_unique";--> statement-breakpoint
ALTER TABLE "roles" DROP CONSTRAINT "roles_id_unique";--> statement-breakpoint
ALTER TABLE "serviceCategories" DROP CONSTRAINT "serviceCategories_id_unique";--> statement-breakpoint
ALTER TABLE "serviceVariants" DROP CONSTRAINT "serviceVariants_id_unique";--> statement-breakpoint
ALTER TABLE "services" DROP CONSTRAINT "services_id_unique";--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_id_unique";--> statement-breakpoint
ALTER TABLE "serviceVariants" DROP CONSTRAINT "serviceVariants_serviceId_services_id_fk";
--> statement-breakpoint
ALTER TABLE "services" DROP CONSTRAINT "services_serviceCategoryId_serviceCategories_id_fk";
--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_roleId_roles_id_fk";
--> statement-breakpoint
ALTER TABLE "roleToPermissions" DROP CONSTRAINT "roleToPermissions_roleId_permissionId_pk";--> statement-breakpoint
ALTER TABLE "roleToPermissions" DROP CONSTRAINT "roleToPermissionId";--> statement-breakpoint
ALTER TABLE "roleToPermissions" ADD CONSTRAINT "roleToPermissions_roleID_permissionID_pk" PRIMARY KEY("roleID","permissionID");--> statement-breakpoint
ALTER TABLE "roleToPermissions" ADD CONSTRAINT "roleToPermissionID" PRIMARY KEY("roleID","permissionID");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "serviceVariants" ADD CONSTRAINT "serviceVariants_serviceID_services_serviceID_fk" FOREIGN KEY ("serviceID") REFERENCES "services"("serviceID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "services" ADD CONSTRAINT "services_serviceCategoryID_serviceCategories_serviceCategoryID_fk" FOREIGN KEY ("serviceCategoryID") REFERENCES "serviceCategories"("serviceCategoryID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users" ADD CONSTRAINT "users_roleID_roles_roleID_fk" FOREIGN KEY ("roleID") REFERENCES "roles"("roleID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "permissions" ADD CONSTRAINT "permissions_permissionID_unique" UNIQUE("permissionID");--> statement-breakpoint
ALTER TABLE "roles" ADD CONSTRAINT "roles_roleID_unique" UNIQUE("roleID");--> statement-breakpoint
ALTER TABLE "serviceCategories" ADD CONSTRAINT "serviceCategories_serviceCategoryID_unique" UNIQUE("serviceCategoryID");--> statement-breakpoint
ALTER TABLE "serviceVariants" ADD CONSTRAINT "serviceVariants_serviceVariantID_unique" UNIQUE("serviceVariantID");--> statement-breakpoint
ALTER TABLE "services" ADD CONSTRAINT "services_serviceID_unique" UNIQUE("serviceID");--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_userID_unique" UNIQUE("userID");