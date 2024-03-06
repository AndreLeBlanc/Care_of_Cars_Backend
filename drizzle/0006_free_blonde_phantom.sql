CREATE TABLE IF NOT EXISTS "roleToPermissions" (
	"roleId" integer,
	"permissionId" integer,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "roleToPermissions_roleId_permissionId_pk" PRIMARY KEY("roleId","permissionId")
);
