CREATE TABLE IF NOT EXISTS "rentCarBookings" (
	"rentCarBookingID" serial PRIMARY KEY NOT NULL,
	"bookingStart" date NOT NULL,
	"bookingEnd" date NOT NULL,
	"bookingStatus" "orderStatus" NOT NULL,
	"employeeID" integer,
	"submissionTime" timestamp NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rentCarBookings" ADD CONSTRAINT "rentCarBookings_employeeID_employees_employeeID_fk" FOREIGN KEY ("employeeID") REFERENCES "public"."employees"("employeeID") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN IF EXISTS "preliminary";