CREATE TABLE IF NOT EXISTS "productInventory" (
	"productID" serial NOT NULL,
	"storeID" integer NOT NULL,
	"productInventoryBalance" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "productInventory_productID_storeID_pk" PRIMARY KEY("productID","storeID")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "productInventory" ADD CONSTRAINT "productInventory_productID_products_productID_fk" FOREIGN KEY ("productID") REFERENCES "public"."products"("productID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "productInventory" ADD CONSTRAINT "productInventory_storeID_stores_storeID_fk" FOREIGN KEY ("storeID") REFERENCES "public"."stores"("storeID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN IF EXISTS "productInventoryBalance";