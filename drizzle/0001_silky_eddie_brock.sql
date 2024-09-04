CREATE TABLE IF NOT EXISTS "orderProducts" (
	"orderID" integer NOT NULL,
	"productID" integer NOT NULL,
	"productDescription" varchar(256) NOT NULL,
	"amount" integer NOT NULL,
	"cost" real NOT NULL,
	"currency" varchar NOT NULL,
	"orderProductNotes" varchar,
	CONSTRAINT "orderProducts_orderID_productID_pk" PRIMARY KEY("orderID","productID")
);
--> statement-breakpoint
DROP TABLE "localProducts";--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "storeID" integer;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orderProducts" ADD CONSTRAINT "orderProducts_orderID_orders_orderID_fk" FOREIGN KEY ("orderID") REFERENCES "public"."orders"("orderID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orderProducts" ADD CONSTRAINT "orderProducts_productID_products_productID_fk" FOREIGN KEY ("productID") REFERENCES "public"."products"("productID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "products" ADD CONSTRAINT "products_storeID_stores_storeID_fk" FOREIGN KEY ("storeID") REFERENCES "public"."stores"("storeID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
