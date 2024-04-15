CREATE TABLE IF NOT EXISTS "companyCustomer" (
	"customerOrgNumber" varchar(11) PRIMARY KEY NOT NULL,
	"customerComapanyName" varchar(255) NOT NULL,
	"customerAddress" varchar(256),
	"customerZipCode" varchar(16),
	"customerAddressCity" varchar(256),
	"customerCountry" varchar(256),
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "companyCustomer_customerOrgNumber_unique" UNIQUE("customerOrgNumber")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "drivers" (
	"companyID" integer,
	"driverID" serial PRIMARY KEY NOT NULL,
	"customerExternalNumber" varchar(256),
	"driverGDPRAccept" boolean DEFAULT false NOT NULL,
	"isWarrantyCustomer" boolean DEFAULT false NOT NULL,
	"driverAcceptsMarketing" boolean DEFAULT false NOT NULL,
	"driverFirstName" varchar(128) NOT NULL,
	"driverLastName" varchar(128) NOT NULL,
	"driverEmail" varchar(256) NOT NULL,
	"phone" varchar(32) NOT NULL,
	"customerAddress" varchar(256),
	"customerZipCode" varchar(16),
	"customerAddressCity" varchar(256),
	"customerCountry" varchar(256),
	"driverHasCard" boolean DEFAULT false,
	"driverCardValidTo" timestamp DEFAULT now(),
	"driverKeyNumber" varchar(256),
	"driverNotesShared" varchar,
	"driverNotes" varchar,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "drivers_driverID_unique" UNIQUE("driverID")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "drivers" ADD CONSTRAINT "drivers_companyID_companyCustomer_customerOrgNumber_fk" FOREIGN KEY ("companyID") REFERENCES "companyCustomer"("customerOrgNumber") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
