ALTER TABLE "drivers" ALTER COLUMN "companyReference" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "stores" ADD COLUMN "storeWebSite" varchar;--> statement-breakpoint
ALTER TABLE "stores" ADD COLUMN "storeVatNumber" varchar(32);--> statement-breakpoint
ALTER TABLE "stores" ADD COLUMN "storeFSkatt" boolean NOT NULL;