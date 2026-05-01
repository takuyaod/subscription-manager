import {
  pgTable,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  date,
  numeric,
  pgEnum,
  index,
  type AnyPgColumn,
} from "drizzle-orm/pg-core";

export const paymentMethodTypeEnum = pgEnum("payment_method_type", [
  "credit",
  "debit",
  "bank",
  "apple",
  "google",
  "linked",
  "postpay",
  "other",
]);

export const subscriptionCycleEnum = pgEnum("subscription_cycle", [
  "monthly",
  "yearly",
  "once",
]);

export const subscriptionStatusEnum = pgEnum("subscription_status", [
  "active",
  "cancelled",
]);

export const paymentMethods = pgTable("payment_methods", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull(),
  nickname: text("nickname").notNull(),
  type: paymentMethodTypeEnum("type").notNull(),
  // for linked: reference to parent card
  parentId: uuid("parent_id").references((): AnyPgColumn => paymentMethods.id),
  // for credit/debit/postpay: reference to the bank account used for direct debit
  bankAccountId: uuid("bank_account_id").references((): AnyPgColumn => paymentMethods.id),
  expiryYear: integer("expiry_year"),
  expiryMonth: integer("expiry_month"),
  memo: text("memo"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("payment_methods_user_id_idx").on(table.userId),
]);

export const addresses = pgTable("addresses", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull(),
  label: text("label").notNull(),
  postalCode: text("postal_code"),
  prefecture: text("prefecture"),
  city: text("city"),
  street: text("street"),
  building: text("building"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("addresses_user_id_idx").on(table.userId),
]);

export const subscriptions = pgTable("subscriptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  currency: text("currency").default("JPY").notNull(),
  cycle: subscriptionCycleEnum("cycle").notNull(),
  cycleInterval: integer("cycle_interval").default(1).notNull(),
  // monthly: day-of-month (1–31); yearly: MMDD encoding (e.g. 1225 = Dec 25 = month * 100 + day); null for once
  billingDay: integer("billing_day"),
  paymentMethodId: uuid("payment_method_id")
    .notNull()
    .references(() => paymentMethods.id),
  addressId: uuid("address_id").references(() => addresses.id),
  isPhysical: boolean("is_physical").default(false).notNull(),
  status: subscriptionStatusEnum("status").default("active").notNull(),
  startDate: date("start_date").notNull(),
  // used only for cycle: "once" — service expiry date, null means perpetual
  expiresAt: date("expires_at"),
  cancelledAt: timestamp("cancelled_at"),
  memo: text("memo"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("subscriptions_user_id_idx").on(table.userId),
]);
