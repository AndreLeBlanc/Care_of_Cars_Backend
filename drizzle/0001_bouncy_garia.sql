CREATE TABLE IF NOT EXISTS "employeeWorkingHours" (
	"storeID" integer NOT NULL,
	"employeeID" integer NOT NULL,
	"mondayStart" time,
	"mondayStop" time,
	"mondayBreak" interval,
	"tuesdayStart" time,
	"tuesdayStop" time,
	"tuesdayBreak" interval,
	"wednesdayStart" time,
	"wednesdayStop" time,
	"wednesdayBreak" interval,
	"thursdayStart" time,
	"thursdayStop" time,
	"thursdayBreak" interval,
	"fridayStart" time,
	"fridayStop" time,
	"fridayBreak" interval,
	"saturdayStart" time,
	"saturdayStop" time,
	"saturdayBreak" interval,
	"sundayStart" time,
	"sundayStop" time,
	"sundayBreak" interval,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "employeeWorkingHours_storeID_employeeID_pk" PRIMARY KEY("storeID","employeeID")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "employeeWorkingHours" ADD CONSTRAINT "employeeWorkingHours_storeID_stores_storeID_fk" FOREIGN KEY ("storeID") REFERENCES "public"."stores"("storeID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "employeeWorkingHours" ADD CONSTRAINT "employeeWorkingHours_employeeID_employees_employeeID_fk" FOREIGN KEY ("employeeID") REFERENCES "public"."employees"("employeeID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "employees" DROP COLUMN IF EXISTS "mondayStart";--> statement-breakpoint
ALTER TABLE "employees" DROP COLUMN IF EXISTS "mondayStop";--> statement-breakpoint
ALTER TABLE "employees" DROP COLUMN IF EXISTS "mondayBreak";--> statement-breakpoint
ALTER TABLE "employees" DROP COLUMN IF EXISTS "tuesdayStart";--> statement-breakpoint
ALTER TABLE "employees" DROP COLUMN IF EXISTS "tuesdayStop";--> statement-breakpoint
ALTER TABLE "employees" DROP COLUMN IF EXISTS "tuesdayBreak";--> statement-breakpoint
ALTER TABLE "employees" DROP COLUMN IF EXISTS "wednesdayStart";--> statement-breakpoint
ALTER TABLE "employees" DROP COLUMN IF EXISTS "wednesdayStop";--> statement-breakpoint
ALTER TABLE "employees" DROP COLUMN IF EXISTS "wednesdayBreak";--> statement-breakpoint
ALTER TABLE "employees" DROP COLUMN IF EXISTS "thursdayStart";--> statement-breakpoint
ALTER TABLE "employees" DROP COLUMN IF EXISTS "thursdayStop";--> statement-breakpoint
ALTER TABLE "employees" DROP COLUMN IF EXISTS "thursdayBreak";--> statement-breakpoint
ALTER TABLE "employees" DROP COLUMN IF EXISTS "fridayStart";--> statement-breakpoint
ALTER TABLE "employees" DROP COLUMN IF EXISTS "fridayStop";--> statement-breakpoint
ALTER TABLE "employees" DROP COLUMN IF EXISTS "fridayBreak";--> statement-breakpoint
ALTER TABLE "employees" DROP COLUMN IF EXISTS "saturdayStart";--> statement-breakpoint
ALTER TABLE "employees" DROP COLUMN IF EXISTS "saturdayStop";--> statement-breakpoint
ALTER TABLE "employees" DROP COLUMN IF EXISTS "saturdayBreak";--> statement-breakpoint
ALTER TABLE "employees" DROP COLUMN IF EXISTS "sundayStart";--> statement-breakpoint
ALTER TABLE "employees" DROP COLUMN IF EXISTS "sundayStop";--> statement-breakpoint
ALTER TABLE "employees" DROP COLUMN IF EXISTS "sundayBreak";