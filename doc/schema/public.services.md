# public.services

## Description

## Columns

| Name | Type | Default | Nullable | Children | Parents | Comment |
| ---- | ---- | ------- | -------- | -------- | ------- | ------- |
| serviceID | integer | nextval('"services_serviceID_seq"'::regclass) | false | [public.orderListing](public.orderListing.md) [public.serviceLocalQualifications](public.serviceLocalQualifications.md) [public.serviceQualifications](public.serviceQualifications.md) [public.serviceVariants](public.serviceVariants.md) |  |  |
| serviceCategoryID | integer |  | false |  | [public.serviceCategories](public.serviceCategories.md) |  |
| name | varchar(256) |  | false |  |  |  |
| storeID | integer |  | true |  | [public.stores](public.stores.md) |  |
| currency | varchar(5) |  | false |  |  |  |
| cost | real |  | false |  |  |  |
| includeInAutomaticSms | boolean |  | false |  |  |  |
| hidden | boolean |  | false |  |  |  |
| callInterval | integer |  | true |  |  |  |
| colorForService | varchar |  | false |  |  |  |
| warrantyCard | boolean |  | true |  |  |  |
| itemNumber | varchar(256) |  | true |  |  |  |
| award | real |  | false |  |  |  |
| suppliersArticleNumber | varchar(256) |  | true |  |  |  |
| externalArticleNumber | varchar(256) |  | true |  |  |  |
| day1 | interval |  | true |  |  |  |
| day2 | interval |  | true |  |  |  |
| day3 | interval |  | true |  |  |  |
| day4 | interval |  | true |  |  |  |
| day5 | interval |  | true |  |  |  |
| createdAt | timestamp without time zone | now() | false |  |  |  |
| updatedAt | timestamp without time zone | now() | false |  |  |  |

## Constraints

| Name | Type | Definition |
| ---- | ---- | ---------- |
| services_serviceCategoryID_serviceCategories_serviceCategoryID_ | FOREIGN KEY | FOREIGN KEY ("serviceCategoryID") REFERENCES "serviceCategories"("serviceCategoryID") ON DELETE CASCADE |
| services_pkey | PRIMARY KEY | PRIMARY KEY ("serviceID") |
| services_name_unique | UNIQUE | UNIQUE (name) |
| services_storeID_stores_storeID_fk | FOREIGN KEY | FOREIGN KEY ("storeID") REFERENCES stores("storeID") ON DELETE CASCADE |

## Indexes

| Name | Definition |
| ---- | ---------- |
| services_pkey | CREATE UNIQUE INDEX services_pkey ON public.services USING btree ("serviceID") |
| services_name_unique | CREATE UNIQUE INDEX services_name_unique ON public.services USING btree (name) |

## Relations

![er](public.services.svg)

---

> Generated by [tbls](https://github.com/k1LoW/tbls)
