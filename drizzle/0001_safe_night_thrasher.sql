ALTER TABLE "qualificationsGlobal" RENAME COLUMN "localQualName" TO "globalQualName";--> statement-breakpoint
ALTER TABLE "qualificationsGlobal" DROP CONSTRAINT "qualificationsGlobal_localQualName_unique";--> statement-breakpoint
ALTER TABLE "employees" ALTER COLUMN "employeePin" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "qualificationsGlobal" ADD CONSTRAINT "qualificationsGlobal_globalQualName_unique" UNIQUE("globalQualName");