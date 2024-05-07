DO $$ BEGIN
 CREATE TYPE "colorForService" AS ENUM('LightBlue', 'Blue', 'DarkBlue', 'LightGreen', 'Green', 'DarkGreen', 'LightYellow', 'Yellow', 'DarkYellow', 'LightPurple', 'Purple', 'DarkPurple', 'LightPink', 'Pink', 'DarkPink', 'LightTurquoise', 'Turquoise', 'DarkTurquoise', 'Orange', 'Red', 'None');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "companycustomers" (
	"customerOrgNumber" varchar(11) PRIMARY KEY NOT NULL,
	"customerComapanyName" varchar(255) NOT NULL,
	"companyAddress" varchar(256),
	"companyZipCode" varchar(16),
	"companyAddressCity" varchar(256),
	"companyCountry" varchar(256),
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "drivers" (
	"customerOrgNumber" varchar(11),
	"driverExternalNumber" varchar(256),
	"companyReference" varchar(256),
	"driverGDPRAccept" boolean DEFAULT false NOT NULL,
	"driverISWarrantyDriver" boolean DEFAULT false NOT NULL,
	"driverAcceptsMarketing" boolean DEFAULT false NOT NULL,
	"driverFirstName" varchar(128) NOT NULL,
	"driverLastName" varchar(128) NOT NULL,
	"driverEmail" varchar(256) PRIMARY KEY NOT NULL,
	"driverPhoneNumber" varchar(32) NOT NULL,
	"driverAddress" varchar(256) NOT NULL,
	"driverZipCode" varchar(16) NOT NULL,
	"driverAddressCity" varchar(256) NOT NULL,
	"driverCountry" varchar(256) NOT NULL,
	"driverHasCard" boolean DEFAULT false,
	"driverCardValidTo" date,
	"driverCardNumber" varchar(256),
	"driverKeyNumber" varchar(256),
	"driverNotesShared" varchar,
	"driverNotes" varchar,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "permissions" (
	"permissionID" serial PRIMARY KEY NOT NULL,
	"permissionName" varchar(256) NOT NULL,
	"description" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "permissions_permissionName_unique" UNIQUE("permissionName")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "productCategories" (
	"productCategoryID" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"description" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "productCategories_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "products" (
	"productId" serial PRIMARY KEY NOT NULL,
	"productItemNumber" varchar NOT NULL,
	"productCategoryID" integer NOT NULL,
	"productDescription" varchar(512),
	"productSupplierArticleNumber" varchar,
	"productExternalArticleNumber" varchar,
	"productUpdateRelatedData" boolean DEFAULT false,
	"productInventoryBalance" integer NOT NULL,
	"productAward" integer NOT NULL,
	"productCost" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "products_productId_unique" UNIQUE("productId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rentcars" (
	"storeId" integer NOT NULL,
	"rentCarRegistrationNumber" varchar PRIMARY KEY NOT NULL,
	"rentCarModel" varchar NOT NULL,
	"rentCarColor" varchar NOT NULL,
	"rentCarYear" integer NOT NULL,
	"rentCarNotes" varchar,
	"rentCarNumber" integer,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "rentcars_rentCarRegistrationNumber_unique" UNIQUE("rentCarRegistrationNumber")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "roleToPermissions" (
	"roleID" integer NOT NULL,
	"permissionID" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "roleToPermissions_roleID_permissionID_pk" PRIMARY KEY("roleID","permissionID")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "roles" (
	"roleID" serial PRIMARY KEY NOT NULL,
	"roleName" varchar(256) NOT NULL,
	"description" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "roles_roleName_unique" UNIQUE("roleName")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "serviceCategories" (
	"serviceCategoryID" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"description" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "serviceCategories_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "serviceVariants" (
	"serviceVariantID" serial PRIMARY KEY NOT NULL,
	"name" varchar(256),
	"award" real NOT NULL,
	"cost" real NOT NULL,
	"day1" time,
	"day2" time,
	"day3" time,
	"day4" time,
	"day5" time,
	"serviceID" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "services" (
	"serviceID" serial PRIMARY KEY NOT NULL,
	"serviceCategoryID" integer NOT NULL,
	"name" varchar(256) NOT NULL,
	"includeInAutomaticSms" boolean,
	"hidden" boolean,
	"callInterval" integer,
	"colorForService" "colorForService" DEFAULT 'None' NOT NULL,
	"warrantyCard" boolean,
	"itemNumber" varchar(256),
	"suppliersArticleNumber" varchar(256),
	"externalArticleNumber" varchar(256),
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "storeopeninghours" (
	"storeID" integer PRIMARY KEY NOT NULL,
	"mondayOpen" time,
	"mondayClose" time,
	"tuesdayOpen" time,
	"tuesdayClose" time,
	"wednesdayOpen" time,
	"wednesdayClose" time,
	"thursdayOpen" time,
	"thursdayClose" time,
	"fridayOpen" time,
	"fridayClose" time,
	"saturdayOpen" time,
	"saturdayClose" time,
	"sundayOpen" time,
	"sundayClose" time,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "storepaymentinfo" (
	"storePaymentOption" serial PRIMARY KEY NOT NULL,
	"storeID" integer,
	"bankgiro" varchar(16),
	"plusgiro" varchar(16),
	"paymentdays" smallint DEFAULT 30 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "storepaymentinfo_storeID_unique" UNIQUE("storeID")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stores" (
	"storeID" serial PRIMARY KEY NOT NULL,
	"storeOrgNumber" varchar(11) NOT NULL,
	"storeName" varchar NOT NULL,
	"storeStatus" boolean NOT NULL,
	"storeEmail" varchar NOT NULL,
	"storePhone" varchar NOT NULL,
	"storeAddress" varchar NOT NULL,
	"storeZipCode" varchar(16) NOT NULL,
	"storeCity" varchar NOT NULL,
	"storeCountry" varchar NOT NULL,
	"storeDescription" varchar,
	"storeContactPerson" varchar(64),
	"storeMaxUsers" integer,
	"storeAllowCarAPI" boolean DEFAULT true,
	"storeAllowSendSMS" boolean DEFAULT true,
	"storeSendSMS" boolean DEFAULT true,
	"storeUsesCheckin" boolean DEFAULT true,
	"storeUsesPIN" boolean DEFAULT true,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "stores_storeOrgNumber_unique" UNIQUE("storeOrgNumber"),
	CONSTRAINT "stores_storeName_unique" UNIQUE("storeName"),
	CONSTRAINT "stores_storeAddress_unique" UNIQUE("storeAddress")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "storespecialhours" (
	"storeID" integer NOT NULL,
	"day" date NOT NULL,
	"dayOpen" time NOT NULL,
	"dayClose" time NOT NULL,
	CONSTRAINT "storespecialhours_storeID_day_pk" PRIMARY KEY("storeID","day")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"userID" serial PRIMARY KEY NOT NULL,
	"firstName" varchar NOT NULL,
	"lastName" varchar NOT NULL,
	"email" varchar NOT NULL,
	"password" text NOT NULL,
	"isSuperAdmin" boolean DEFAULT false,
	"roleID" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "drivers" ADD CONSTRAINT "drivers_customerOrgNumber_companycustomers_customerOrgNumber_fk" FOREIGN KEY ("customerOrgNumber") REFERENCES "companycustomers"("customerOrgNumber") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "products" ADD CONSTRAINT "products_productCategoryID_productCategories_productCategoryID_fk" FOREIGN KEY ("productCategoryID") REFERENCES "productCategories"("productCategoryID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "serviceVariants" ADD CONSTRAINT "serviceVariants_serviceID_services_serviceID_fk" FOREIGN KEY ("serviceID") REFERENCES "services"("serviceID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "services" ADD CONSTRAINT "services_serviceCategoryID_serviceCategories_serviceCategoryID_fk" FOREIGN KEY ("serviceCategoryID") REFERENCES "serviceCategories"("serviceCategoryID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "storeopeninghours" ADD CONSTRAINT "storeopeninghours_storeID_stores_storeID_fk" FOREIGN KEY ("storeID") REFERENCES "stores"("storeID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "storepaymentinfo" ADD CONSTRAINT "storepaymentinfo_storeID_stores_storeID_fk" FOREIGN KEY ("storeID") REFERENCES "stores"("storeID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "storespecialhours" ADD CONSTRAINT "storespecialhours_storeID_stores_storeID_fk" FOREIGN KEY ("storeID") REFERENCES "stores"("storeID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users" ADD CONSTRAINT "users_roleID_roles_roleID_fk" FOREIGN KEY ("roleID") REFERENCES "roles"("roleID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
