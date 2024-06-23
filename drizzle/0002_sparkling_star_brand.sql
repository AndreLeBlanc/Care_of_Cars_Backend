CREATE TABLE IF NOT EXISTS "LocalServiceLocalQualifications" (
	"localServiceID" integer NOT NULL,
	"localQualID" integer NOT NULL,
	CONSTRAINT "LocalServiceLocalQualifications_localQualID_localServiceID_pk" PRIMARY KEY("localQualID","localServiceID")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "localServiceGlobalQualifications" (
	"localServiceID" integer NOT NULL,
	"qualificationsGlobal" integer NOT NULL
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
	"qualificationsGlobal" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "employeeSpecialHours" ADD COLUMN "storeID" integer NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "LocalServiceLocalQualifications" ADD CONSTRAINT "LocalServiceLocalQualifications_localServiceID_localServices_localServiceID_fk" FOREIGN KEY ("localServiceID") REFERENCES "public"."localServices"("localServiceID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "LocalServiceLocalQualifications" ADD CONSTRAINT "LocalServiceLocalQualifications_localQualID_qualificationsLocal_localQualID_fk" FOREIGN KEY ("localQualID") REFERENCES "public"."qualificationsLocal"("localQualID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "localServiceGlobalQualifications" ADD CONSTRAINT "localServiceGlobalQualifications_localServiceID_localServices_localServiceID_fk" FOREIGN KEY ("localServiceID") REFERENCES "public"."localServices"("localServiceID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "localServiceGlobalQualifications" ADD CONSTRAINT "localServiceGlobalQualifications_qualificationsGlobal_qualificationsGlobal_globalQualID_fk" FOREIGN KEY ("qualificationsGlobal") REFERENCES "public"."qualificationsGlobal"("globalQualID") ON DELETE no action ON UPDATE no action;
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
 ALTER TABLE "serviceQualifications" ADD CONSTRAINT "serviceQualifications_qualificationsGlobal_qualificationsGlobal_globalQualID_fk" FOREIGN KEY ("qualificationsGlobal") REFERENCES "public"."qualificationsGlobal"("globalQualID") ON DELETE no action ON UPDATE no action;
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
ALTER TABLE "employeeWorkingHours" ADD CONSTRAINT "unique_employeeWorkingHours" UNIQUE("storeID","employeeID");