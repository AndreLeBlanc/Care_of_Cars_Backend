# public.permissions

## Description

## Columns

| Name | Type | Default | Nullable | Children | Parents | Comment |
| ---- | ---- | ------- | -------- | -------- | ------- | ------- |
| permissionID | integer | nextval('"permissions_permissionID_seq"'::regclass) | false | [public.roleToPermissions](public.roleToPermissions.md) |  |  |
| permissionTitle | varchar(256) |  | false |  |  |  |
| description | text |  | true |  |  |  |
| createdAt | timestamp without time zone | now() | false |  |  |  |
| updatedAt | timestamp without time zone | now() | false |  |  |  |

## Constraints

| Name | Type | Definition |
| ---- | ---- | ---------- |
| permissions_pkey | PRIMARY KEY | PRIMARY KEY ("permissionID") |
| permissions_permissionTitle_unique | UNIQUE | UNIQUE ("permissionTitle") |

## Indexes

| Name | Definition |
| ---- | ---------- |
| permissions_pkey | CREATE UNIQUE INDEX permissions_pkey ON public.permissions USING btree ("permissionID") |
| permissions_permissionTitle_unique | CREATE UNIQUE INDEX "permissions_permissionTitle_unique" ON public.permissions USING btree ("permissionTitle") |

## Relations

![er](public.permissions.svg)

---

> Generated by [tbls](https://github.com/k1LoW/tbls)
