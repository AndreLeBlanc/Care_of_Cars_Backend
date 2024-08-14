ALTER TABLE "permissions" RENAME COLUMN "permissionName" TO "permissionTitle";--> statement-breakpoint
ALTER TABLE "permissions" DROP CONSTRAINT "permissions_permissionName_unique";--> statement-breakpoint
ALTER TABLE "permissions" ADD CONSTRAINT "permissions_permissionTitle_unique" UNIQUE("permissionTitle");