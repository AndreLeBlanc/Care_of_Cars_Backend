CREATE TABLE IF NOT EXISTS "storeopeninghours" (
	"storeID" varchar(11) PRIMARY KEY NOT NULL,
	"mondayopen" time,
	"mondayclose" time,
	"tuesdayopen" time,
	"tuesdayclose" time,
	"wednesdayopen" time,
	"wednesdayclose" time,
	"thursdayopen" time,
	"thursdayclose" time,
	"fridayopen" time,
	"fridayclose" time,
	"saturdayopen" time,
	"saturdayclose" time,
	"sundayopen" time,
	"sundayclose" time,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "storespecialhours" (
	"specialDate" serial PRIMARY KEY NOT NULL,
	"storeID" varchar(11) NOT NULL,
	"stores" date,
	"dayopen" time,
	"dayclose" time
);
--> statement-breakpoint
ALTER TABLE "storepaymentinfo" RENAME COLUMN "storeOrgNumber" TO "storePaymentOption";--> statement-breakpoint
ALTER TABLE "storepaymentinfo" DROP CONSTRAINT "storepaymentinfo_storeOrgNumber_companycustomers_customerOrgNumber_fk";
--> statement-breakpoint
ALTER TABLE "storepaymentinfo" ADD PRIMARY KEY ("storePaymentOption");--> statement-breakpoint
ALTER TABLE "storepaymentinfo" ALTER COLUMN "storePaymentOption" SET DATA TYPE smallserial;--> statement-breakpoint
/* 
    Unfortunately in current drizzle-kit version we can't automatically get name for primary key.
    We are working on making it available!

    Meanwhile you can:
        1. Check pk name in your database, by running
            SELECT constraint_name FROM information_schema.table_constraints
            WHERE table_schema = 'public'
                AND table_name = 'stores'
                AND constraint_type = 'PRIMARY KEY';
        2. Uncomment code below and paste pk name manually
        
    Hope to release this update as soon as possible
*/

-- ALTER TABLE "stores" DROP CONSTRAINT "<constraint_name>";--> statement-breakpoint
ALTER TABLE "stores" ALTER COLUMN "storeOrgNumber" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "storepaymentinfo" ADD COLUMN "storeID" varchar(11) NOT NULL;--> statement-breakpoint
ALTER TABLE "stores" ADD COLUMN "storeID" "smallserial" NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "storepaymentinfo" ADD CONSTRAINT "storepaymentinfo_storeID_companycustomers_customerOrgNumber_fk" FOREIGN KEY ("storeID") REFERENCES "companycustomers"("customerOrgNumber") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "storeopeninghours" ADD CONSTRAINT "storeopeninghours_storeID_companycustomers_customerOrgNumber_fk" FOREIGN KEY ("storeID") REFERENCES "companycustomers"("customerOrgNumber") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "storespecialhours" ADD CONSTRAINT "storespecialhours_storeID_stores_storeID_fk" FOREIGN KEY ("storeID") REFERENCES "stores"("storeID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "storepaymentinfo" ADD CONSTRAINT "storepaymentinfo_storePaymentOption_unique" UNIQUE("storePaymentOption");--> statement-breakpoint
ALTER TABLE "stores" ADD CONSTRAINT "stores_storeID_unique" UNIQUE("storeID");