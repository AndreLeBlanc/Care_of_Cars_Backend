# public.employeeStore

## Description

## Columns

| Name | Type | Default | Nullable | Children | Parents | Comment |
| ---- | ---- | ------- | -------- | -------- | ------- | ------- |
| storeID | integer |  | false |  | [public.stores](public.stores.md) |  |
| employeeID | integer |  | false |  | [public.employees](public.employees.md) |  |
| checkedIn | timestamp without time zone |  | true |  |  |  |
| checkedOut | timestamp without time zone |  | true |  |  |  |

## Constraints

| Name | Type | Definition |
| ---- | ---- | ---------- |
| employeeStore_storeID_employeeID_pk | PRIMARY KEY | PRIMARY KEY ("storeID", "employeeID") |
| employeeStore_employeeID_employees_employeeID_fk | FOREIGN KEY | FOREIGN KEY ("employeeID") REFERENCES employees("employeeID") ON DELETE CASCADE |
| employeeStore_storeID_stores_storeID_fk | FOREIGN KEY | FOREIGN KEY ("storeID") REFERENCES stores("storeID") ON DELETE CASCADE |

## Indexes

| Name | Definition |
| ---- | ---------- |
| employeeStore_storeID_employeeID_pk | CREATE UNIQUE INDEX "employeeStore_storeID_employeeID_pk" ON public."employeeStore" USING btree ("storeID", "employeeID") |

## Relations

![er](public.employeeStore.svg)

---

> Generated by [tbls](https://github.com/k1LoW/tbls)