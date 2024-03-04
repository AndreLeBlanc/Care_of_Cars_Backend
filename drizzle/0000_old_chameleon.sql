CREATE TABLE IF NOT EXISTS "users" (
	"id" serial NOT NULL,
	"firstName" text,
	"lastName" text,
	"email" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
