CREATE TABLE IF NOT EXISTS "storepaymentinfo" (
	"storeOrgNumber" varchar(11),
	"bankgiro" varchar(16),
	"plusgiro" varchar(16),
	"paymentdays" smallint DEFAULT 30 NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "storepaymentinfo" ADD CONSTRAINT "storepaymentinfo_storeOrgNumber_companycustomers_customerOrgNumber_fk" FOREIGN KEY ("storeOrgNumber") REFERENCES "companycustomers"("customerOrgNumber") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
