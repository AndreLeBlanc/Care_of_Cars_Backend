CREATE TABLE IF NOT EXISTS "billOrders" (
	"billID" integer,
	"orderID" integer,
	CONSTRAINT "billOrders_billID_orderID_pk" PRIMARY KEY("billID","orderID")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "bills" (
	"orderID" serial PRIMARY KEY NOT NULL,
	"employeeID" integer,
	"billingDate" date NOT NULL,
	"paymentDate" date NOT NULL,
	"paymentDays" integer NOT NULL,
	"driverID" integer,
	"customerOrgNumber" varchar(11),
	"driverExternalNumber" varchar(256),
	"companyReference" varchar(255),
	"driverFirstName" varchar(128) NOT NULL,
	"driverLastName" varchar(128) NOT NULL,
	"driverEmail" varchar(256) NOT NULL,
	"driverPhoneNumber" varchar(32) NOT NULL,
	"driverAddress" varchar(256) NOT NULL,
	"driverZipCode" varchar(16) NOT NULL,
	"driverAddressCity" varchar(256) NOT NULL,
	"driverCountry" varchar(256) NOT NULL,
	"driverHasCard" boolean DEFAULT false,
	"driverCardValidTo" date,
	"driverCardNumber" varchar(256),
	"driverKeyNumber" varchar(256),
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "bills_driverEmail_unique" UNIQUE("driverEmail"),
	CONSTRAINT "bills_driverPhoneNumber_unique" UNIQUE("driverPhoneNumber")
);
--> statement-breakpoint
ALTER TABLE "orderLocalServices" ADD COLUMN "amount" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "orderServices" ADD COLUMN "amount" integer NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "billOrders" ADD CONSTRAINT "billOrders_billID_bills_orderID_fk" FOREIGN KEY ("billID") REFERENCES "public"."bills"("orderID") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "billOrders" ADD CONSTRAINT "billOrders_orderID_orders_orderID_fk" FOREIGN KEY ("orderID") REFERENCES "public"."orders"("orderID") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bills" ADD CONSTRAINT "bills_employeeID_employees_employeeID_fk" FOREIGN KEY ("employeeID") REFERENCES "public"."employees"("employeeID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bills" ADD CONSTRAINT "bills_driverID_drivers_driverID_fk" FOREIGN KEY ("driverID") REFERENCES "public"."drivers"("driverID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bills" ADD CONSTRAINT "bills_customerOrgNumber_companycustomers_customerOrgNumber_fk" FOREIGN KEY ("customerOrgNumber") REFERENCES "public"."companycustomers"("customerOrgNumber") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
