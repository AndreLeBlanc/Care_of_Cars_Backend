ALTER TABLE "orderServices" ADD COLUMN "day1" timestamp;--> statement-breakpoint
ALTER TABLE "orderServices" ADD COLUMN "day1Work" interval;--> statement-breakpoint
ALTER TABLE "orderServices" ADD COLUMN "employeeID" integer;--> statement-breakpoint
ALTER TABLE "orderServices" ADD COLUMN "day2" timestamp;--> statement-breakpoint
ALTER TABLE "orderServices" ADD COLUMN "day3" timestamp;--> statement-breakpoint
ALTER TABLE "orderServices" ADD COLUMN "day4" timestamp;--> statement-breakpoint
ALTER TABLE "orderServices" ADD COLUMN "day5" timestamp;--> statement-breakpoint
ALTER TABLE "orderServices" ADD COLUMN "currency" varchar(5) NOT NULL;--> statement-breakpoint
ALTER TABLE "orderServices" ADD COLUMN "cost" real NOT NULL;--> statement-breakpoint
ALTER TABLE "orderServices" ADD COLUMN "discount" real NOT NULL;--> statement-breakpoint
ALTER TABLE "orderServices" ADD COLUMN "vatFree" boolean NOT NULL;--> statement-breakpoint
ALTER TABLE "orderServices" ADD COLUMN "orderNotes" varchar;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orderServices" ADD CONSTRAINT "orderServices_employeeID_employees_employeeID_fk" FOREIGN KEY ("employeeID") REFERENCES "public"."employees"("employeeID") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
