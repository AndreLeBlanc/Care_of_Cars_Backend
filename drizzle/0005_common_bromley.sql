CREATE TABLE IF NOT EXISTS "permissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"permissionName" varchar(256) NOT NULL,
	"description" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "permissions_id_unique" UNIQUE("id"),
	CONSTRAINT "permissions_permissionName_unique" UNIQUE("permissionName")
);
