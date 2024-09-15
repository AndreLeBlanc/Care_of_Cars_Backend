ALTER TABLE "employeeStore" ADD COLUMN "createdAt" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "employeeStore" ADD COLUMN "updatedAt" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "checkinIndex" ON "employeeCheckin" USING btree ("employeeCheckedIn");