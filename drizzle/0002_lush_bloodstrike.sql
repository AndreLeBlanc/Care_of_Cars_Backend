CREATE TABLE IF NOT EXISTS "rentcars" (
	"rentCarRegistrationNumber" varchar PRIMARY KEY NOT NULL,
	"rentCarModel" varchar NOT NULL,
	"rentCarColor" varchar NOT NULL,
	"rentCarYear" varchar NOT NULL,
	"rentCarNotes" varchar,
	"rentCarNumber" integer,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "rentcars_rentCarRegistrationNumber_unique" UNIQUE("rentCarRegistrationNumber")
);
