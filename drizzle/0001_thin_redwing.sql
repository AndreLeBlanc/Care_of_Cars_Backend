ALTER TABLE "drivers" RENAME COLUMN "companyID" TO "customerOrgNumber";--> statement-breakpoint
ALTER TABLE "drivers" DROP CONSTRAINT "drivers_companyID_companyCustomer_customerOrgNumber_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "drivers" ADD CONSTRAINT "drivers_customerOrgNumber_companyCustomer_customerOrgNumber_fk" FOREIGN KEY ("customerOrgNumber") REFERENCES "companyCustomer"("customerOrgNumber") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
