ALTER TABLE "drivers" ALTER COLUMN "driverCardValidTo" SET DATA TYPE date;--> statement-breakpoint
ALTER TABLE "drivers" ALTER COLUMN "driverCardValidTo" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "drivers" ALTER COLUMN "driverCardValidTo" SET NOT NULL;