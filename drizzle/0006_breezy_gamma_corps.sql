ALTER TABLE "bills" ADD COLUMN "storeID" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "bills" ADD COLUMN "billedAmount" real NOT NULL;--> statement-breakpoint
ALTER TABLE "bills" ADD COLUMN "currency" varchar NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bills" ADD CONSTRAINT "bills_storeID_stores_storeID_fk" FOREIGN KEY ("storeID") REFERENCES "public"."stores"("storeID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
