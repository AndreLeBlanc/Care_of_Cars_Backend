ALTER TABLE "drivers" ALTER COLUMN "driverAddress" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "drivers" ALTER COLUMN "driverZipCode" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "drivers" ALTER COLUMN "driverAddressCity" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "drivers" ALTER COLUMN "driverCountry" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "drivers" ALTER COLUMN "driverCardValidTo" DROP NOT NULL;