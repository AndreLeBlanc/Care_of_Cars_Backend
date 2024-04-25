ALTER TABLE "storepaymentinfo" ADD COLUMN "createdAt" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "storepaymentinfo" ADD COLUMN "updatedAt" timestamp DEFAULT now() NOT NULL;