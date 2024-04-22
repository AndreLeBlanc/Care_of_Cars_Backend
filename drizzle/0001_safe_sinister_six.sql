ALTER TABLE "stores" ADD COLUMN "storeDescription" varchar;--> statement-breakpoint
ALTER TABLE "stores" ADD COLUMN "storeContactPerson" varchar(64);--> statement-breakpoint
ALTER TABLE "stores" ADD COLUMN "storeMaxUsers" integer;--> statement-breakpoint
ALTER TABLE "stores" ADD COLUMN "storeAllowCarAPI" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "stores" ADD COLUMN "storeAllowSendSMS" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "stores" ADD COLUMN "storeSendSMS" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "stores" ADD COLUMN "storeUsesCheckin" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "stores" ADD COLUMN "storeUsesPIN" boolean DEFAULT true;