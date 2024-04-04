DO $$ BEGIN
 CREATE TYPE "colorForService" AS ENUM('LightBlue', 'Blue', 'DarkBlue', 'LightGreen', 'Green', 'DarkGreen', 'LightYellow', 'Yellow', 'DarkYellow', 'LightPurple', 'Purple', 'DarkPurple', 'LightPink', 'Pink', 'DarkPink', 'LightTurquoise', 'Turquoise', 'DarkTurquoise', 'Orange', 'Red', 'None');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "permissions" (
	"permissionID" serial PRIMARY KEY NOT NULL,
	"permissionName" varchar(256) NOT NULL,
	"description" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "permissions_permissionID_unique" UNIQUE("permissionID"),
	CONSTRAINT "permissions_permissionName_unique" UNIQUE("permissionName")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "roleToPermissions" (
	"roleID" integer,
	"permissionID" integer,
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
	CONSTRAINT "roles_roleID_unique" UNIQUE("roleID"),
	CONSTRAINT "roles_roleName_unique" UNIQUE("roleName")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "serviceCategories" (
	"serviceCategoryID" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"description" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "serviceCategories_serviceCategoryID_unique" UNIQUE("serviceCategoryID"),
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
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "serviceVariants_serviceVariantID_unique" UNIQUE("serviceVariantID")
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
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "services_serviceID_unique" UNIQUE("serviceID"),
	CONSTRAINT "services_name_unique" UNIQUE("name")
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
	CONSTRAINT "users_userID_unique" UNIQUE("userID"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
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
 ALTER TABLE "users" ADD CONSTRAINT "users_roleID_roles_roleID_fk" FOREIGN KEY ("roleID") REFERENCES "roles"("roleID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
