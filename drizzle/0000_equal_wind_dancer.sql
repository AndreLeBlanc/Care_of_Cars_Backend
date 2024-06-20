DO $$ BEGIN
 CREATE TYPE "public"."colorForService" AS ENUM('LightBlue', 'Blue', 'DarkBlue', 'LightGreen', 'Green', 'DarkGreen', 'LightYellow', 'Yellow', 'DarkYellow', 'LightPurple', 'Purple', 'DarkPurple', 'LightPink', 'Pink', 'DarkPink', 'LightTurquoise', 'Turquoise', 'DarkTurquoise', 'Orange', 'Red', 'None');
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
CREATE TABLE IF NOT EXISTS "driverCars" (
	"driverCarID" serial PRIMARY KEY NOT NULL,
	"driverID" integer,
	"driverCarRegistrationNumber" varchar(11) NOT NULL,
	"driverCarBrand" varchar(128),
	"driverCarModel" varchar(128),
	"driverCarColor" varchar(64),
	"driverCarYear" integer,
	"driverCarChassiNumber" varchar(24),
	"driverCarNotes" varchar,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "driverCars_driverCarRegistrationNumber_unique" UNIQUE("driverCarRegistrationNumber"),
	CONSTRAINT "driverCars_driverCarChassiNumber_unique" UNIQUE("driverCarChassiNumber")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "drivers" (
	"driverID" serial PRIMARY KEY NOT NULL,
	"customerOrgNumber" varchar(11),
	"driverExternalNumber" varchar(256),
	"companyReference" varchar(255),
	"driverGDPRAccept" boolean DEFAULT false NOT NULL,
	"driverISWarrantyDriver" boolean DEFAULT false NOT NULL,
	"driverAcceptsMarketing" boolean DEFAULT false NOT NULL,
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
	"driverNotesShared" varchar,
	"driverNotes" varchar,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "employeeStore" (
	"storeID" integer NOT NULL,
	"employeeID" integer NOT NULL,
	CONSTRAINT "employeeStore_storeID_employeeID_pk" PRIMARY KEY("storeID","employeeID")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "employees" (
	"employeeID" serial PRIMARY KEY NOT NULL,
	"shortUserName" varchar(16) NOT NULL,
	"employmentNumber" varchar(128) NOT NULL,
	"employeePersonalNumber" varchar(16) NOT NULL,
	"signature" varchar(4) NOT NULL,
	"employeeHourlyRate" numeric,
	"employeeHourlyRateCurrency" varchar,
	"employeePin" varchar(4),
	"employeeComment" varchar,
	"checkedIn" timestamp,
	"checkedOut" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "employees_employmentNumber_unique" UNIQUE("employmentNumber"),
	CONSTRAINT "employees_employeePersonalNumber_unique" UNIQUE("employeePersonalNumber"),
	CONSTRAINT "employees_signature_unique" UNIQUE("signature")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "localProducts" (
	"storeID" integer NOT NULL,
	"localProductID" serial PRIMARY KEY NOT NULL,
	"productItemNumber" varchar NOT NULL,
	"currency" varchar(5) NOT NULL,
	"cost" real NOT NULL,
	"productCategoryID" integer NOT NULL,
	"productDescription" varchar(512),
	"productSupplierArticleNumber" varchar,
	"productExternalArticleNumber" varchar,
	"productUpdateRelatedData" boolean DEFAULT false,
	"award" real NOT NULL,
	"productInventoryBalance" integer,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "localServiceVariants" (
	"serviceVariantID" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"currency" varchar(5) NOT NULL,
	"cost" real NOT NULL,
	"award" real NOT NULL,
	"day1" time,
	"day2" time,
	"day3" time,
	"day4" time,
	"day5" time,
	"localServiceID" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "localServices" (
	"localServiceID" serial PRIMARY KEY NOT NULL,
	"serviceCategoryID" integer NOT NULL,
	"name" varchar(256) NOT NULL,
	"storeID" integer NOT NULL,
	"currency" varchar(5) NOT NULL,
	"cost" real NOT NULL,
	"includeInAutomaticSms" boolean NOT NULL,
	"hidden" boolean NOT NULL,
	"callInterval" integer,
	"colorForService" varchar NOT NULL,
	"warrantyCard" boolean,
	"itemNumber" varchar(256),
	"award" real NOT NULL,
	"suppliersArticleNumber" varchar(256),
	"externalArticleNumber" varchar(256),
	"day1" time,
	"day2" time,
	"day3" time,
	"day4" time,
	"day5" time,
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
	"productID" serial PRIMARY KEY NOT NULL,
	"productItemNumber" varchar NOT NULL,
	"currency" varchar(5) NOT NULL,
	"cost" real NOT NULL,
	"productCategoryID" integer NOT NULL,
	"productDescription" varchar(512),
	"productSupplierArticleNumber" varchar,
	"productExternalArticleNumber" varchar,
	"productUpdateRelatedData" boolean DEFAULT false,
	"award" real NOT NULL,
	"productInventoryBalance" integer,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "qualificationsGlobal" (
	"globalQualID" serial PRIMARY KEY NOT NULL,
	"localQualName" varchar(64) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "qualificationsGlobal_localQualName_unique" UNIQUE("localQualName")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "qualificationsLocal" (
	"storeID" integer NOT NULL,
	"localQualID" serial PRIMARY KEY NOT NULL,
	"localQualName" varchar(64) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "qualificationsLocal_localQualName_storeID_unique" UNIQUE("localQualName","storeID")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rentCars" (
	"storeID" integer NOT NULL,
	"rentCarRegistrationNumber" varchar PRIMARY KEY NOT NULL,
	"rentCarModel" varchar NOT NULL,
	"rentCarColor" varchar NOT NULL,
	"rentCarYear" integer NOT NULL,
	"rentCarNotes" varchar,
	"rentCarNumber" integer,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "rentCars_rentCarRegistrationNumber_unique" UNIQUE("rentCarRegistrationNumber")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "roleToPermissions" (
	"roleID" integer NOT NULL,
	"permissionID" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "roleToPermissionID" PRIMARY KEY("roleID","permissionID")
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
	"serviceCategoryName" varchar(256) NOT NULL,
	"description" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "serviceCategories_serviceCategoryName_unique" UNIQUE("serviceCategoryName")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "serviceVariants" (
	"serviceVariantID" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"cost" real NOT NULL,
	"currency" varchar(5) NOT NULL,
	"award" real NOT NULL,
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
	"name" varchar(256) NOT NULL,
	"serviceCategoryID" integer NOT NULL,
	"currency" varchar(5) NOT NULL,
	"cost" real NOT NULL,
	"includeInAutomaticSms" boolean NOT NULL,
	"hidden" boolean NOT NULL,
	"callInterval" integer,
	"colorForService" varchar NOT NULL,
	"warrantyCard" boolean,
	"itemNumber" varchar(256),
	"award" real NOT NULL,
	"suppliersArticleNumber" varchar(256),
	"externalArticleNumber" varchar(256),
	"day1" time,
	"day2" time,
	"day3" time,
	"day4" time,
	"day5" time,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "services_name_unique" UNIQUE("name"),
	CONSTRAINT "services_itemNumber_unique" UNIQUE("itemNumber")
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
	"storeID" integer PRIMARY KEY NOT NULL,
	"bankgiro" varchar(16),
	"plusgiro" varchar(16),
	"paymentdays" smallint DEFAULT 30 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stores" (
	"storeID" serial PRIMARY KEY NOT NULL,
	"storeOrgNumber" varchar(11) NOT NULL,
	"storeName" varchar NOT NULL,
	"storeWebSite" varchar,
	"storeVatNumber" varchar(32),
	"storeFSkatt" boolean NOT NULL,
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
	"currency" varchar DEFAULT 'SEK',
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
CREATE TABLE IF NOT EXISTS "storeweeklynotes" (
	"storeID" integer NOT NULL,
	"week" date NOT NULL,
	"weekNote" varchar,
	"mondayNote" varchar,
	"tuesdayNote" varchar,
	"wednesdayNote" varchar,
	"thursdayNote" varchar,
	"fridayNote" varchar,
	"saturdayNote" varchar,
	"sundayNote" varchar,
	CONSTRAINT "storeweeklynotes_storeID_week_pk" PRIMARY KEY("storeID","week"),
	CONSTRAINT "storeweeklynotes_storeID_week_unique" UNIQUE("storeID","week")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "userBelongsToStore" (
	"userID" integer NOT NULL,
	"storeID" integer NOT NULL,
	CONSTRAINT "userBelongsToStore_storeID_userID_pk" PRIMARY KEY("storeID","userID")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "userGlobalQualifications" (
	"userID" integer NOT NULL,
	"globalQualID" integer NOT NULL,
	CONSTRAINT "userGlobalQualifications_globalQualID_userID_pk" PRIMARY KEY("globalQualID","userID")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "userLocalQualifications" (
	"userID" integer NOT NULL,
	"localQualID" integer NOT NULL,
	CONSTRAINT "userLocalQualifications_localQualID_userID_pk" PRIMARY KEY("localQualID","userID")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"userID" serial PRIMARY KEY NOT NULL,
	"firstName" varchar(128) NOT NULL,
	"lastName" varchar(128) NOT NULL,
	"email" varchar NOT NULL,
	"password" text NOT NULL,
	"isSuperAdmin" boolean DEFAULT false NOT NULL,
	"roleID" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "driverCars" ADD CONSTRAINT "driverCars_driverID_drivers_driverID_fk" FOREIGN KEY ("driverID") REFERENCES "public"."drivers"("driverID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "drivers" ADD CONSTRAINT "drivers_customerOrgNumber_companycustomers_customerOrgNumber_fk" FOREIGN KEY ("customerOrgNumber") REFERENCES "public"."companycustomers"("customerOrgNumber") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "employeeStore" ADD CONSTRAINT "employeeStore_storeID_stores_storeID_fk" FOREIGN KEY ("storeID") REFERENCES "public"."stores"("storeID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "employeeStore" ADD CONSTRAINT "employeeStore_employeeID_employees_employeeID_fk" FOREIGN KEY ("employeeID") REFERENCES "public"."employees"("employeeID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "localProducts" ADD CONSTRAINT "localProducts_storeID_stores_storeID_fk" FOREIGN KEY ("storeID") REFERENCES "public"."stores"("storeID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "localProducts" ADD CONSTRAINT "localProducts_productCategoryID_productCategories_productCategoryID_fk" FOREIGN KEY ("productCategoryID") REFERENCES "public"."productCategories"("productCategoryID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "localServiceVariants" ADD CONSTRAINT "localServiceVariants_localServiceID_localServices_localServiceID_fk" FOREIGN KEY ("localServiceID") REFERENCES "public"."localServices"("localServiceID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "localServices" ADD CONSTRAINT "localServices_serviceCategoryID_serviceCategories_serviceCategoryID_fk" FOREIGN KEY ("serviceCategoryID") REFERENCES "public"."serviceCategories"("serviceCategoryID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "localServices" ADD CONSTRAINT "localServices_storeID_stores_storeID_fk" FOREIGN KEY ("storeID") REFERENCES "public"."stores"("storeID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "products" ADD CONSTRAINT "products_productCategoryID_productCategories_productCategoryID_fk" FOREIGN KEY ("productCategoryID") REFERENCES "public"."productCategories"("productCategoryID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "qualificationsLocal" ADD CONSTRAINT "qualificationsLocal_storeID_stores_storeID_fk" FOREIGN KEY ("storeID") REFERENCES "public"."stores"("storeID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rentCars" ADD CONSTRAINT "rentCars_storeID_stores_storeID_fk" FOREIGN KEY ("storeID") REFERENCES "public"."stores"("storeID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "roleToPermissions" ADD CONSTRAINT "roleToPermissions_permissionID_permissions_permissionID_fk" FOREIGN KEY ("permissionID") REFERENCES "public"."permissions"("permissionID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "serviceVariants" ADD CONSTRAINT "serviceVariants_serviceID_services_serviceID_fk" FOREIGN KEY ("serviceID") REFERENCES "public"."services"("serviceID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "services" ADD CONSTRAINT "services_serviceCategoryID_serviceCategories_serviceCategoryID_fk" FOREIGN KEY ("serviceCategoryID") REFERENCES "public"."serviceCategories"("serviceCategoryID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "storeopeninghours" ADD CONSTRAINT "storeopeninghours_storeID_stores_storeID_fk" FOREIGN KEY ("storeID") REFERENCES "public"."stores"("storeID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "storepaymentinfo" ADD CONSTRAINT "storepaymentinfo_storeID_stores_storeID_fk" FOREIGN KEY ("storeID") REFERENCES "public"."stores"("storeID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "storespecialhours" ADD CONSTRAINT "storespecialhours_storeID_stores_storeID_fk" FOREIGN KEY ("storeID") REFERENCES "public"."stores"("storeID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "storeweeklynotes" ADD CONSTRAINT "storeweeklynotes_storeID_stores_storeID_fk" FOREIGN KEY ("storeID") REFERENCES "public"."stores"("storeID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "userBelongsToStore" ADD CONSTRAINT "userBelongsToStore_userID_users_userID_fk" FOREIGN KEY ("userID") REFERENCES "public"."users"("userID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "userBelongsToStore" ADD CONSTRAINT "userBelongsToStore_storeID_stores_storeID_fk" FOREIGN KEY ("storeID") REFERENCES "public"."stores"("storeID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "userGlobalQualifications" ADD CONSTRAINT "userGlobalQualifications_userID_users_userID_fk" FOREIGN KEY ("userID") REFERENCES "public"."users"("userID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "userGlobalQualifications" ADD CONSTRAINT "userGlobalQualifications_globalQualID_qualificationsGlobal_globalQualID_fk" FOREIGN KEY ("globalQualID") REFERENCES "public"."qualificationsGlobal"("globalQualID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "userLocalQualifications" ADD CONSTRAINT "userLocalQualifications_userID_users_userID_fk" FOREIGN KEY ("userID") REFERENCES "public"."users"("userID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "userLocalQualifications" ADD CONSTRAINT "userLocalQualifications_localQualID_qualificationsLocal_localQualID_fk" FOREIGN KEY ("localQualID") REFERENCES "public"."qualificationsLocal"("localQualID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users" ADD CONSTRAINT "users_roleID_roles_roleID_fk" FOREIGN KEY ("roleID") REFERENCES "public"."roles"("roleID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "storeid_idx" ON "storespecialhours" ("storeID");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "day_idx" ON "storespecialhours" ("day");