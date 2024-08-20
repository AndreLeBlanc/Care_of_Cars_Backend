ALTER TABLE "orderLocalServices" RENAME COLUMN "employeeID" TO "day1Employee";--> statement-breakpoint
ALTER TABLE "orderServices" RENAME COLUMN "employeeID" TO "day1Employee";--> statement-breakpoint
ALTER TABLE "orderLocalServices" DROP CONSTRAINT "orderLocalServices_employeeID_employees_employeeID_fk";
--> statement-breakpoint
ALTER TABLE "orderServices" DROP CONSTRAINT "orderServices_employeeID_employees_employeeID_fk";
--> statement-breakpoint
ALTER TABLE "orderLocalServices" ADD COLUMN "day2Employee" integer;--> statement-breakpoint
ALTER TABLE "orderLocalServices" ADD COLUMN "day3Employee" integer;--> statement-breakpoint
ALTER TABLE "orderLocalServices" ADD COLUMN "day4Employee" integer;--> statement-breakpoint
ALTER TABLE "orderLocalServices" ADD COLUMN "day5Employee" integer;--> statement-breakpoint
ALTER TABLE "orderServices" ADD COLUMN "day2Employee" integer;--> statement-breakpoint
ALTER TABLE "orderServices" ADD COLUMN "day3Employee" integer;--> statement-breakpoint
ALTER TABLE "orderServices" ADD COLUMN "day4Employee" integer;--> statement-breakpoint
ALTER TABLE "orderServices" ADD COLUMN "day5Employee" integer;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orderLocalServices" ADD CONSTRAINT "orderLocalServices_day1Employee_employees_employeeID_fk" FOREIGN KEY ("day1Employee") REFERENCES "public"."employees"("employeeID") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orderLocalServices" ADD CONSTRAINT "orderLocalServices_day2Employee_employees_employeeID_fk" FOREIGN KEY ("day2Employee") REFERENCES "public"."employees"("employeeID") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orderLocalServices" ADD CONSTRAINT "orderLocalServices_day3Employee_employees_employeeID_fk" FOREIGN KEY ("day3Employee") REFERENCES "public"."employees"("employeeID") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orderLocalServices" ADD CONSTRAINT "orderLocalServices_day4Employee_employees_employeeID_fk" FOREIGN KEY ("day4Employee") REFERENCES "public"."employees"("employeeID") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orderLocalServices" ADD CONSTRAINT "orderLocalServices_day5Employee_employees_employeeID_fk" FOREIGN KEY ("day5Employee") REFERENCES "public"."employees"("employeeID") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orderServices" ADD CONSTRAINT "orderServices_day1Employee_employees_employeeID_fk" FOREIGN KEY ("day1Employee") REFERENCES "public"."employees"("employeeID") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orderServices" ADD CONSTRAINT "orderServices_day2Employee_employees_employeeID_fk" FOREIGN KEY ("day2Employee") REFERENCES "public"."employees"("employeeID") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orderServices" ADD CONSTRAINT "orderServices_day3Employee_employees_employeeID_fk" FOREIGN KEY ("day3Employee") REFERENCES "public"."employees"("employeeID") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orderServices" ADD CONSTRAINT "orderServices_day4Employee_employees_employeeID_fk" FOREIGN KEY ("day4Employee") REFERENCES "public"."employees"("employeeID") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orderServices" ADD CONSTRAINT "orderServices_day5Employee_employees_employeeID_fk" FOREIGN KEY ("day5Employee") REFERENCES "public"."employees"("employeeID") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
