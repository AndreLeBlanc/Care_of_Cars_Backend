ALTER TABLE "employeeStore" ADD COLUMN "checkedIn" timestamp;--> statement-breakpoint
ALTER TABLE "employeeStore" ADD COLUMN "checkedOut" timestamp;--> statement-breakpoint
ALTER TABLE "employees" DROP COLUMN IF EXISTS "checkedIn";--> statement-breakpoint
ALTER TABLE "employees" DROP COLUMN IF EXISTS "checkedOut";