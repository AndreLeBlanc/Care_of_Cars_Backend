CREATE TABLE IF NOT EXISTS "orderLocalServices" (
	"orderID" integer NOT NULL,
	"localServiceID" integer NOT NULL,
	"serviceVariantID" integer,
	"day1" timestamp,
	"day1Work" interval,
	"employeeID" integer,
	"day2" timestamp,
	"day3" timestamp,
	"day4" timestamp,
	"day5" timestamp,
	"cost" real NOT NULL,
	"discount" real NOT NULL,
	"vatFree" boolean NOT NULL,
	"orderNotes" varchar,
	CONSTRAINT "orderLocalServices_orderID_localServiceID_pk" PRIMARY KEY("orderID","localServiceID")
);
--> statement-breakpoint
ALTER TABLE "orderServices" DROP CONSTRAINT "orderServices_orderID_serviceVariantID_unique";--> statement-breakpoint
ALTER TABLE "rentCars" DROP CONSTRAINT "rentCars_rentCarRegistrationNumber_unique";--> statement-breakpoint
ALTER TABLE "rentCarBookings" ADD COLUMN "orderID" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "rentCarBookings" ADD COLUMN "rentCarRegistrationNumber" integer NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orderLocalServices" ADD CONSTRAINT "orderLocalServices_orderID_orders_orderID_fk" FOREIGN KEY ("orderID") REFERENCES "public"."orders"("orderID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orderLocalServices" ADD CONSTRAINT "orderLocalServices_localServiceID_localServices_localServiceID_fk" FOREIGN KEY ("localServiceID") REFERENCES "public"."localServices"("localServiceID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orderLocalServices" ADD CONSTRAINT "orderLocalServices_serviceVariantID_localServiceVariants_serviceVariantID_fk" FOREIGN KEY ("serviceVariantID") REFERENCES "public"."localServiceVariants"("serviceVariantID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orderLocalServices" ADD CONSTRAINT "orderLocalServices_employeeID_employees_employeeID_fk" FOREIGN KEY ("employeeID") REFERENCES "public"."employees"("employeeID") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rentCarBookings" ADD CONSTRAINT "rentCarBookings_orderID_orders_orderID_fk" FOREIGN KEY ("orderID") REFERENCES "public"."orders"("orderID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rentCarBookings" ADD CONSTRAINT "rentCarBookings_rentCarRegistrationNumber_rentCars_rentCarRegistrationNumber_fk" FOREIGN KEY ("rentCarRegistrationNumber") REFERENCES "public"."rentCars"("rentCarRegistrationNumber") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "orderServices" DROP COLUMN IF EXISTS "currency";