ALTER TABLE "services" RENAME COLUMN "description" TO "name";--> statement-breakpoint
ALTER TABLE "services" DROP CONSTRAINT "services_description_unique";--> statement-breakpoint
ALTER TABLE "services" ADD CONSTRAINT "services_name_unique" UNIQUE("name");