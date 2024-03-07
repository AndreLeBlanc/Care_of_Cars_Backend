ALTER TABLE "users" ALTER COLUMN "firstName" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "firstName" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "lastName" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "email" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "password" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "createdAt" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "updatedAt" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "created_at";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "updated_at";--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_id_unique" UNIQUE("id");