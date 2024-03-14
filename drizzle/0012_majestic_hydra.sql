CREATE TABLE IF NOT EXISTS "serviceVariants" (
	"id" serial PRIMARY KEY NOT NULL,
	"description" varchar(256),
	"award" real,
	"cost" real NOT NULL,
	"day1" time NOT NULL,
	"day2" time,
	"day3" time,
	"day4" time,
	"day5" time,
	"serviceId" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "serviceVariants_id_unique" UNIQUE("id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "serviceVariants" ADD CONSTRAINT "serviceVariants_serviceId_services_id_fk" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
