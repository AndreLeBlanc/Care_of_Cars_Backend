DO $$ BEGIN
 CREATE TYPE "colorOnDuty" AS ENUM('LightBlue', 'Blue', 'DarkBlue', 'LightGreen', 'Green', 'DarkGreen', 'LightYellow', 'Yellow', 'DarkYellow', 'LightPurple', 'Purple', 'DarkPurple', 'LightPink', 'Pink', 'DarkPink', 'LightTurquoise', 'Turquoise', 'DarkTurquoise', 'Orange', 'Red');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "serviceCategories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"description" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "serviceCategories_id_unique" UNIQUE("id"),
	CONSTRAINT "serviceCategories_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "services" (
	"id" serial PRIMARY KEY NOT NULL,
	"serviceCategoryId" integer NOT NULL,
	"description" varchar(256) NOT NULL,
	"includeInAutomaticSms" boolean,
	"hidden" boolean,
	"callInterval" integer,
	"colorOnDuty" "colorOnDuty",
	"warantyCard" boolean,
	"itermNumber" varchar(256),
	"suppliersArticleNumber" varchar(256),
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "services_id_unique" UNIQUE("id"),
	CONSTRAINT "services_description_unique" UNIQUE("description")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "services" ADD CONSTRAINT "services_serviceCategoryId_serviceCategories_id_fk" FOREIGN KEY ("serviceCategoryId") REFERENCES "serviceCategories"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
