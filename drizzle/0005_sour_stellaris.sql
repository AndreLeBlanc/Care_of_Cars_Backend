ALTER TABLE "companycustomers" ALTER COLUMN "companyAddress" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "companycustomers" ALTER COLUMN "companyZipCode" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "companycustomers" ALTER COLUMN "companyAddressCity" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "companycustomers" ALTER COLUMN "companyCountry" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "stores" ALTER COLUMN "storeName" SET DATA TYPE varchar(3);--> statement-breakpoint
ALTER TABLE "companycustomers" ADD COLUMN "companyEmail" varchar(256) NOT NULL;--> statement-breakpoint
ALTER TABLE "companycustomers" ADD COLUMN "companyPhone" varchar(16) NOT NULL;