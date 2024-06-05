CREATE TABLE IF NOT EXISTS "driverCars" (
	"driverID" integer NOT NULL,
	"driverCarRegistrationNumber" varchar PRIMARY KEY NOT NULL,
	"driverCarBrand" varchar NOT NULL,
	"driverCarModel" varchar NOT NULL,
	"driverCarColor" varchar NOT NULL,
	"driverCarYear" integer NOT NULL,
	"driverCarChassiNumber" integer,
	"driverCarNotes" varchar,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "driverCars_driverCarRegistrationNumber_unique" UNIQUE("driverCarRegistrationNumber")
);
--> statement-breakpoint
ALTER TABLE "rentcars" RENAME TO "rentCars";--> statement-breakpoint
ALTER TABLE "rentCars" DROP CONSTRAINT "rentcars_rentCarRegistrationNumber_unique";--> statement-breakpoint
ALTER TABLE "rentCars" DROP CONSTRAINT "rentcars_storeID_stores_storeID_fk";
--> statement-breakpoint
/* 
    Unfortunately in current drizzle-kit version we can't automatically get name for primary key.
    We are working on making it available!

    Meanwhile you can:
        1. Check pk name in your database, by running
            SELECT constraint_name FROM information_schema.table_constraints
            WHERE table_schema = 'public'
                AND table_name = 'drivers'
                AND constraint_type = 'PRIMARY KEY';
        2. Uncomment code below and paste pk name manually
        
    Hope to release this update as soon as possible
*/

-- ALTER TABLE "drivers" DROP CONSTRAINT "<constraint_name>";--> statement-breakpoint
ALTER TABLE "drivers" ADD COLUMN "driverID" serial NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "driverCars" ADD CONSTRAINT "driverCars_driverID_stores_storeID_fk" FOREIGN KEY ("driverID") REFERENCES "public"."stores"("storeID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rentCars" ADD CONSTRAINT "rentCars_storeID_stores_storeID_fk" FOREIGN KEY ("storeID") REFERENCES "public"."stores"("storeID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "rentCars" ADD CONSTRAINT "rentCars_rentCarRegistrationNumber_unique" UNIQUE("rentCarRegistrationNumber");