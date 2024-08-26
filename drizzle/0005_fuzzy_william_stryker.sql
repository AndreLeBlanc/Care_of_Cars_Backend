DO $$ BEGIN
 CREATE TYPE "public"."billStatus" AS ENUM('bill', 'creditBill', 'cashBill');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "billOrders" DROP CONSTRAINT "billOrders_billID_bills_orderID_fk";
--> statement-breakpoint
ALTER TABLE "billOrders" DROP CONSTRAINT "billOrders_orderID_orders_orderID_fk";
--> statement-breakpoint
ALTER TABLE "bills" DROP CONSTRAINT "bills_customerOrgNumber_companycustomers_customerOrgNumber_fk";
--> statement-breakpoint
ALTER TABLE "billOrders" ALTER COLUMN "billID" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "billOrders" ALTER COLUMN "orderID" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "bills" ALTER COLUMN "driverID" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "currency" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "bills" ADD COLUMN "billStatus" "billStatus" NOT NULL;--> statement-breakpoint
ALTER TABLE "orderLocalServices" ADD COLUMN "name" varchar(256) NOT NULL;--> statement-breakpoint
ALTER TABLE "orderLocalServices" ADD COLUMN "currency" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "orderServices" ADD COLUMN "name" varchar(256) NOT NULL;--> statement-breakpoint
ALTER TABLE "orderServices" ADD COLUMN "currency" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "pickupTime" timestamp NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "billOrders" ADD CONSTRAINT "billOrders_billID_bills_orderID_fk" FOREIGN KEY ("billID") REFERENCES "public"."bills"("orderID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "billOrders" ADD CONSTRAINT "billOrders_orderID_orders_orderID_fk" FOREIGN KEY ("orderID") REFERENCES "public"."orders"("orderID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bills" ADD CONSTRAINT "bills_customerOrgNumber_companycustomers_customerOrgNumber_fk" FOREIGN KEY ("customerOrgNumber") REFERENCES "public"."companycustomers"("customerOrgNumber") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "orderLocalServices" DROP COLUMN IF EXISTS "discount";--> statement-breakpoint
ALTER TABLE "orderServices" DROP COLUMN IF EXISTS "discount";