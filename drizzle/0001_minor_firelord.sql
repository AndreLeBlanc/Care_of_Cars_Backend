ALTER TABLE "drivers" DROP CONSTRAINT "drivers_driverID_unique";--> statement-breakpoint
ALTER TABLE "drivers" ADD PRIMARY KEY ("driverEmail");--> statement-breakpoint
ALTER TABLE "drivers" DROP COLUMN IF EXISTS "driverID";--> statement-breakpoint
ALTER TABLE "drivers" ADD CONSTRAINT "drivers_driverEmail_unique" UNIQUE("driverEmail");