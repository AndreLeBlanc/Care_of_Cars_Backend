CREATE TABLE IF NOT EXISTS "employeeCheckin" (
	"employeeStoreID" integer,
	"checkedIn" timestamp,
	"checkedOut" timestamp
);
--> statement-breakpoint
ALTER TABLE "employeeStore" DROP CONSTRAINT "employeeStore_storeID_employeeID_pk";--> statement-breakpoint
ALTER TABLE "employeeStore" ADD COLUMN "employeeStoreID" serial PRIMARY KEY NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "employeeCheckin" ADD CONSTRAINT "employeeCheckin_employeeStoreID_employeeStore_employeeStoreID_fk" FOREIGN KEY ("employeeStoreID") REFERENCES "public"."employeeStore"("employeeStoreID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "employeeStore" DROP COLUMN IF EXISTS "checkedIn";--> statement-breakpoint
ALTER TABLE "employeeStore" DROP COLUMN IF EXISTS "checkedOut";