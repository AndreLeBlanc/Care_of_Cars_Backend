ALTER TABLE "products" DROP CONSTRAINT "products_productDescription_storeID_unique";--> statement-breakpoint
ALTER TABLE "services" DROP CONSTRAINT "services_serviceID_storeID_unique";--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "productDescription" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_productDescription_unique" UNIQUE("productDescription");--> statement-breakpoint
ALTER TABLE "services" ADD CONSTRAINT "services_name_unique" UNIQUE("name");