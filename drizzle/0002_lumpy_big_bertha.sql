ALTER TABLE "companyCustomer" RENAME TO "companyCustomers";--> statement-breakpoint
ALTER TABLE "drivers" RENAME COLUMN "customerAddress" TO "driverAddress";--> statement-breakpoint
ALTER TABLE "drivers" RENAME COLUMN "customerZipCode" TO "driverZipCode";--> statement-breakpoint
ALTER TABLE "drivers" RENAME COLUMN "customerAddressCity" TO "driverAddressCity";--> statement-breakpoint
ALTER TABLE "drivers" RENAME COLUMN "customerCountry" TO "driverCountry";--> statement-breakpoint
ALTER TABLE "companyCustomers" DROP CONSTRAINT "companyCustomer_customerOrgNumber_unique";--> statement-breakpoint
ALTER TABLE "drivers" DROP CONSTRAINT "drivers_customerOrgNumber_companyCustomer_customerOrgNumber_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "drivers" ADD CONSTRAINT "drivers_customerOrgNumber_companyCustomers_customerOrgNumber_fk" FOREIGN KEY ("customerOrgNumber") REFERENCES "companyCustomers"("customerOrgNumber") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "companyCustomers" ADD CONSTRAINT "companyCustomers_customerOrgNumber_unique" UNIQUE("customerOrgNumber");