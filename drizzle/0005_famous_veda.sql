ALTER TABLE "orderListing" ADD COLUMN "storeID" integer NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orderListing" ADD CONSTRAINT "orderListing_storeID_stores_storeID_fk" FOREIGN KEY ("storeID") REFERENCES "public"."stores"("storeID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
