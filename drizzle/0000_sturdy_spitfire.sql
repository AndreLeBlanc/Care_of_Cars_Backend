DO $$ BEGIN
 CREATE TYPE "public"."billStatus" AS ENUM('bill', 'creditBill', 'cashBill');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."orderStatus" AS ENUM('preliminär', 'skapad', 'påbörjad', 'färdig för upphämtning', 'avslutad');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."colorForService" AS ENUM('LightBlue', 'Blue', 'DarkBlue', 'LightGreen', 'Green', 'DarkGreen', 'LightYellow', 'Yellow', 'DarkYellow', 'LightPurple', 'Purple', 'DarkPurple', 'LightPink', 'Pink', 'DarkPink', 'LightTurquoise', 'Turquoise', 'DarkTurquoise', 'Orange', 'Red', 'None');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "billOrders" (
	"billID" integer NOT NULL,
	"orderID" integer NOT NULL,
	CONSTRAINT "billOrders_billID_orderID_pk" PRIMARY KEY("billID","orderID")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "bills" (
	"orderID" serial PRIMARY KEY NOT NULL,
	"storeID" integer NOT NULL,
	"billStatus" "billStatus" NOT NULL,
	"billedAmount" real NOT NULL,
	"currency" varchar NOT NULL,
	"employeeID" integer,
	"billingDate" date NOT NULL,
	"paymentDate" date NOT NULL,
	"paymentDays" integer NOT NULL,
	"driverID" integer NOT NULL,
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
CREATE TABLE IF NOT EXISTS "companycustomers" (
	"customerOrgNumber" varchar(11) PRIMARY KEY NOT NULL,
	"customerCompanyName" varchar(255) NOT NULL,
	"companyAddress" varchar(256) NOT NULL,
	"companyZipCode" varchar(16) NOT NULL,
	"companyEmail" varchar(256) NOT NULL,
	"companyPhone" varchar(16) NOT NULL,
	"companyAddressCity" varchar(256) NOT NULL,
	"companyCountry" varchar(256) NOT NULL,
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
	CONSTRAINT "driverCars_driverCarChassiNumber_unique" UNIQUE("driverCarChassiNumber"),
	CONSTRAINT "driverCars_driverCarID_driverID_unique" UNIQUE("driverCarID","driverID")
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
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "drivers_driverEmail_unique" UNIQUE("driverEmail"),
	CONSTRAINT "drivers_driverPhoneNumber_unique" UNIQUE("driverPhoneNumber")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "employeeCheckin" (
	"employeeCheckinID" serial PRIMARY KEY NOT NULL,
	"employeeStoreID" integer,
	"employeeCheckedIn" timestamp,
	"employeeCheckedOut" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "employeeGlobalQualifications" (
	"employeeID" integer NOT NULL,
	"globalQualID" integer NOT NULL,
	CONSTRAINT "employeeGlobalQualifications_globalQualID_employeeID_pk" PRIMARY KEY("globalQualID","employeeID")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "employeeLocalQualifications" (
	"employeeID" integer NOT NULL,
	"localQualID" integer NOT NULL,
	CONSTRAINT "employeeLocalQualifications_localQualID_employeeID_pk" PRIMARY KEY("localQualID","employeeID")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "employeeSpecialHours" (
	"employeeSpecialHoursID" serial PRIMARY KEY NOT NULL,
	"employeeID" integer NOT NULL,
	"storeID" integer NOT NULL,
	"start" date NOT NULL,
	"end" date NOT NULL,
	"description" varchar,
	"absence" boolean NOT NULL,
	CONSTRAINT "employeeSpecialHours_start_employeeID_unique" UNIQUE("start","employeeID"),
	CONSTRAINT "employeeSpecialHours_end_employeeID_unique" UNIQUE("end","employeeID")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "employeeStore" (
	"employeeStoreID" serial PRIMARY KEY NOT NULL,
	"storeID" integer NOT NULL,
	"employeeID" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "employeeWorkingHours" (
	"storeID" integer NOT NULL,
	"employeeID" integer NOT NULL,
	"mondayStart" time,
	"mondayStop" time,
	"mondayBreak" interval,
	"tuesdayStart" time,
	"tuesdayStop" time,
	"tuesdayBreak" interval,
	"wednesdayStart" time,
	"wednesdayStop" time,
	"wednesdayBreak" interval,
	"thursdayStart" time,
	"thursdayStop" time,
	"thursdayBreak" interval,
	"fridayStart" time,
	"fridayStop" time,
	"fridayBreak" interval,
	"saturdayStart" time,
	"saturdayStop" time,
	"saturdayBreak" interval,
	"sundayStart" time,
	"sundayStop" time,
	"sundayBreak" interval,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "employeeWorkingHours_storeID_employeeID_pk" PRIMARY KEY("storeID","employeeID"),
	CONSTRAINT "unique_employeeWorkingHours" UNIQUE("storeID","employeeID")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "employees" (
	"userID" integer NOT NULL,
	"employeeID" serial PRIMARY KEY NOT NULL,
	"shortUserName" varchar(16) NOT NULL,
	"employmentNumber" varchar(128) NOT NULL,
	"employeePersonalNumber" varchar(16) NOT NULL,
	"signature" varchar(4) NOT NULL,
	"employeeHourlyRate" real,
	"employeeHourlyRateCurrency" varchar,
	"employeePin" varchar(4) NOT NULL,
	"employeeComment" varchar,
	"employeeActive" boolean NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "employees_userID_unique" UNIQUE("userID"),
	CONSTRAINT "employees_employmentNumber_unique" UNIQUE("employmentNumber"),
	CONSTRAINT "employees_employeePersonalNumber_unique" UNIQUE("employeePersonalNumber"),
	CONSTRAINT "employees_signature_unique" UNIQUE("signature")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "orderListing" (
	"orderID" integer NOT NULL,
	"serviceID" integer NOT NULL,
	"name" varchar(256) NOT NULL,
	"amount" integer NOT NULL,
	"serviceVariantID" integer,
	"day1" timestamp,
	"day1Work" interval,
	"day1Employee" integer,
	"day2" timestamp,
	"day2Work" interval,
	"day2Employee" integer,
	"day3" timestamp,
	"day3Work" interval,
	"day3Employee" integer,
	"day4" timestamp,
	"day4Work" interval,
	"day4Employee" integer,
	"day5" timestamp,
	"day5Work" interval,
	"day5Employee" integer,
	"cost" real NOT NULL,
	"currency" varchar NOT NULL,
	"vatFree" boolean NOT NULL,
	"orderNotes" varchar,
	CONSTRAINT "orderListing_orderID_serviceID_pk" PRIMARY KEY("orderID","serviceID")
);
--> statement-breakpoint
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
CREATE TABLE IF NOT EXISTS "orders" (
	"orderID" serial PRIMARY KEY NOT NULL,
	"driverCarID" integer NOT NULL,
	"driverID" integer NOT NULL,
	"storeID" integer NOT NULL,
	"orderNotes" varchar,
	"employeeID" integer,
	"submissionTime" timestamp NOT NULL,
	"pickupTime" timestamp NOT NULL,
	"vatFree" boolean NOT NULL,
	"orderStatus" "orderStatus" NOT NULL,
	"currency" varchar NOT NULL,
	"discount" real NOT NULL,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "permissions" (
	"permissionID" serial PRIMARY KEY NOT NULL,
	"permissionTitle" varchar(256) NOT NULL,
	"description" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "permissions_permissionTitle_unique" UNIQUE("permissionTitle")
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
	"storeID" integer,
	"productItemNumber" varchar NOT NULL,
	"currency" varchar(5) NOT NULL,
	"cost" real NOT NULL,
	"productCategoryID" integer NOT NULL,
	"productDescription" varchar(512) NOT NULL,
	"productSupplierArticleNumber" varchar,
	"productExternalArticleNumber" varchar,
	"productUpdateRelatedData" boolean DEFAULT false,
	"award" real NOT NULL,
	"productInventoryBalance" integer,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "products_productDescription_unique" UNIQUE("productDescription")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "qualificationsGlobal" (
	"globalQualID" serial PRIMARY KEY NOT NULL,
	"globalQualName" varchar(64) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "qualificationsGlobal_globalQualName_unique" UNIQUE("globalQualName")
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
CREATE TABLE IF NOT EXISTS "rentCarBookings" (
	"rentCarBookingID" serial PRIMARY KEY NOT NULL,
	"orderID" integer,
	"rentCarRegistrationNumber" varchar NOT NULL,
	"bookingStart" date NOT NULL,
	"bookingEnd" date NOT NULL,
	"employeeID" integer,
	"bookingStatus" "orderStatus" NOT NULL,
	"submissionTime" timestamp NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "rentCarBookings_orderID_unique" UNIQUE("orderID")
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
	"updatedAt" timestamp DEFAULT now() NOT NULL
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
	"serviceCategoryDescription" varchar,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "serviceCategories_serviceCategoryName_unique" UNIQUE("serviceCategoryName")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "serviceLocalQualifications" (
	"serviceID" integer NOT NULL,
	"localQualID" integer NOT NULL,
	CONSTRAINT "serviceLocalQualifications_localQualID_serviceID_pk" PRIMARY KEY("localQualID","serviceID")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "serviceQualifications" (
	"serviceID" integer NOT NULL,
	"globalQualID" integer NOT NULL,
	CONSTRAINT "serviceQualifications_globalQualID_serviceID_pk" PRIMARY KEY("globalQualID","serviceID")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "serviceVariants" (
	"serviceVariantID" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"cost" real NOT NULL,
	"currency" varchar(5) NOT NULL,
	"award" real NOT NULL,
	"day1" interval,
	"day2" interval,
	"day3" interval,
	"day4" interval,
	"day5" interval,
	"serviceID" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "services" (
	"serviceID" serial PRIMARY KEY NOT NULL,
	"serviceCategoryID" integer NOT NULL,
	"name" varchar(256) NOT NULL,
	"storeID" integer,
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
	"day1" interval,
	"day2" interval,
	"day3" interval,
	"day4" interval,
	"day5" interval,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "services_name_unique" UNIQUE("name")
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
	"storeName" varchar(128) NOT NULL,
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
 ALTER TABLE "bills" ADD CONSTRAINT "bills_storeID_stores_storeID_fk" FOREIGN KEY ("storeID") REFERENCES "public"."stores"("storeID") ON DELETE cascade ON UPDATE no action;
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
 ALTER TABLE "bills" ADD CONSTRAINT "bills_customerOrgNumber_companycustomers_customerOrgNumber_fk" FOREIGN KEY ("customerOrgNumber") REFERENCES "public"."companycustomers"("customerOrgNumber") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
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
 ALTER TABLE "employeeCheckin" ADD CONSTRAINT "employeeCheckin_employeeStoreID_employeeStore_employeeStoreID_fk" FOREIGN KEY ("employeeStoreID") REFERENCES "public"."employeeStore"("employeeStoreID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "employeeGlobalQualifications" ADD CONSTRAINT "employeeGlobalQualifications_employeeID_employees_employeeID_fk" FOREIGN KEY ("employeeID") REFERENCES "public"."employees"("employeeID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "employeeGlobalQualifications" ADD CONSTRAINT "employeeGlobalQualifications_globalQualID_qualificationsGlobal_globalQualID_fk" FOREIGN KEY ("globalQualID") REFERENCES "public"."qualificationsGlobal"("globalQualID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "employeeLocalQualifications" ADD CONSTRAINT "employeeLocalQualifications_employeeID_employees_employeeID_fk" FOREIGN KEY ("employeeID") REFERENCES "public"."employees"("employeeID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "employeeLocalQualifications" ADD CONSTRAINT "employeeLocalQualifications_localQualID_qualificationsLocal_localQualID_fk" FOREIGN KEY ("localQualID") REFERENCES "public"."qualificationsLocal"("localQualID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "employeeSpecialHours" ADD CONSTRAINT "employeeSpecialHours_employeeID_employees_employeeID_fk" FOREIGN KEY ("employeeID") REFERENCES "public"."employees"("employeeID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "employeeSpecialHours" ADD CONSTRAINT "employeeSpecialHours_storeID_stores_storeID_fk" FOREIGN KEY ("storeID") REFERENCES "public"."stores"("storeID") ON DELETE cascade ON UPDATE no action;
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
 ALTER TABLE "employeeWorkingHours" ADD CONSTRAINT "employeeWorkingHours_storeID_stores_storeID_fk" FOREIGN KEY ("storeID") REFERENCES "public"."stores"("storeID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "employeeWorkingHours" ADD CONSTRAINT "employeeWorkingHours_employeeID_employees_employeeID_fk" FOREIGN KEY ("employeeID") REFERENCES "public"."employees"("employeeID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "employees" ADD CONSTRAINT "employees_userID_users_userID_fk" FOREIGN KEY ("userID") REFERENCES "public"."users"("userID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orderListing" ADD CONSTRAINT "orderListing_orderID_orders_orderID_fk" FOREIGN KEY ("orderID") REFERENCES "public"."orders"("orderID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orderListing" ADD CONSTRAINT "orderListing_serviceID_services_serviceID_fk" FOREIGN KEY ("serviceID") REFERENCES "public"."services"("serviceID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orderListing" ADD CONSTRAINT "orderListing_serviceVariantID_serviceVariants_serviceVariantID_fk" FOREIGN KEY ("serviceVariantID") REFERENCES "public"."serviceVariants"("serviceVariantID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orderListing" ADD CONSTRAINT "orderListing_day1Employee_employees_employeeID_fk" FOREIGN KEY ("day1Employee") REFERENCES "public"."employees"("employeeID") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orderListing" ADD CONSTRAINT "orderListing_day2Employee_employees_employeeID_fk" FOREIGN KEY ("day2Employee") REFERENCES "public"."employees"("employeeID") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orderListing" ADD CONSTRAINT "orderListing_day3Employee_employees_employeeID_fk" FOREIGN KEY ("day3Employee") REFERENCES "public"."employees"("employeeID") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orderListing" ADD CONSTRAINT "orderListing_day4Employee_employees_employeeID_fk" FOREIGN KEY ("day4Employee") REFERENCES "public"."employees"("employeeID") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orderListing" ADD CONSTRAINT "orderListing_day5Employee_employees_employeeID_fk" FOREIGN KEY ("day5Employee") REFERENCES "public"."employees"("employeeID") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
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
 ALTER TABLE "orders" ADD CONSTRAINT "orders_driverCarID_driverCars_driverCarID_fk" FOREIGN KEY ("driverCarID") REFERENCES "public"."driverCars"("driverCarID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders" ADD CONSTRAINT "orders_driverID_drivers_driverID_fk" FOREIGN KEY ("driverID") REFERENCES "public"."drivers"("driverID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders" ADD CONSTRAINT "orders_storeID_stores_storeID_fk" FOREIGN KEY ("storeID") REFERENCES "public"."stores"("storeID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders" ADD CONSTRAINT "orders_employeeID_employees_employeeID_fk" FOREIGN KEY ("employeeID") REFERENCES "public"."employees"("employeeID") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders" ADD CONSTRAINT "driver_must_have_car" FOREIGN KEY ("driverID","driverCarID") REFERENCES "public"."driverCars"("driverID","driverCarID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "products" ADD CONSTRAINT "products_storeID_stores_storeID_fk" FOREIGN KEY ("storeID") REFERENCES "public"."stores"("storeID") ON DELETE cascade ON UPDATE no action;
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
 ALTER TABLE "rentCarBookings" ADD CONSTRAINT "rentCarBookings_orderID_orders_orderID_fk" FOREIGN KEY ("orderID") REFERENCES "public"."orders"("orderID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rentCarBookings" ADD CONSTRAINT "rentCarBookings_rentCarRegistrationNumber_rentCars_rentCarRegistrationNumber_fk" FOREIGN KEY ("rentCarRegistrationNumber") REFERENCES "public"."rentCars"("rentCarRegistrationNumber") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rentCarBookings" ADD CONSTRAINT "rentCarBookings_employeeID_employees_employeeID_fk" FOREIGN KEY ("employeeID") REFERENCES "public"."employees"("employeeID") ON DELETE set null ON UPDATE no action;
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
 ALTER TABLE "roleToPermissions" ADD CONSTRAINT "roleToPermissions_roleID_roles_roleID_fk" FOREIGN KEY ("roleID") REFERENCES "public"."roles"("roleID") ON DELETE no action ON UPDATE no action;
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
 ALTER TABLE "serviceLocalQualifications" ADD CONSTRAINT "serviceLocalQualifications_serviceID_services_serviceID_fk" FOREIGN KEY ("serviceID") REFERENCES "public"."services"("serviceID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "serviceLocalQualifications" ADD CONSTRAINT "serviceLocalQualifications_localQualID_qualificationsLocal_localQualID_fk" FOREIGN KEY ("localQualID") REFERENCES "public"."qualificationsLocal"("localQualID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "serviceQualifications" ADD CONSTRAINT "serviceQualifications_serviceID_services_serviceID_fk" FOREIGN KEY ("serviceID") REFERENCES "public"."services"("serviceID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "serviceQualifications" ADD CONSTRAINT "serviceQualifications_globalQualID_qualificationsGlobal_globalQualID_fk" FOREIGN KEY ("globalQualID") REFERENCES "public"."qualificationsGlobal"("globalQualID") ON DELETE no action ON UPDATE no action;
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
 ALTER TABLE "services" ADD CONSTRAINT "services_storeID_stores_storeID_fk" FOREIGN KEY ("storeID") REFERENCES "public"."stores"("storeID") ON DELETE cascade ON UPDATE no action;
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
 ALTER TABLE "users" ADD CONSTRAINT "users_roleID_roles_roleID_fk" FOREIGN KEY ("roleID") REFERENCES "public"."roles"("roleID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "checkinIndex" ON "employeeCheckin" USING btree ("employeeCheckedIn");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "storeid_idx" ON "storespecialhours" USING btree ("storeID");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "day_idx" ON "storespecialhours" USING btree ("day");