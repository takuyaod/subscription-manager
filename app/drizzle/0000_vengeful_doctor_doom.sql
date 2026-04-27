CREATE TYPE "public"."payment_method_type" AS ENUM('credit', 'debit', 'bank', 'apple', 'google', 'linked', 'postpay', 'other');--> statement-breakpoint
CREATE TYPE "public"."subscription_cycle" AS ENUM('monthly', 'yearly', 'once');--> statement-breakpoint
CREATE TYPE "public"."subscription_status" AS ENUM('active', 'cancelled');--> statement-breakpoint
CREATE TABLE "addresses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"label" text NOT NULL,
	"postal_code" text NOT NULL,
	"prefecture" text NOT NULL,
	"city" text NOT NULL,
	"street" text NOT NULL,
	"building" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payment_methods" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"nickname" text NOT NULL,
	"type" "payment_method_type" NOT NULL,
	"parent_id" uuid,
	"bank_account_id" uuid,
	"expiry_year" integer,
	"expiry_month" integer,
	"memo" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"currency" text DEFAULT 'JPY' NOT NULL,
	"cycle" "subscription_cycle" NOT NULL,
	"cycle_interval" integer DEFAULT 1 NOT NULL,
	"billing_day" integer,
	"payment_method_id" uuid NOT NULL,
	"address_id" uuid,
	"is_physical" boolean DEFAULT false NOT NULL,
	"status" "subscription_status" DEFAULT 'active' NOT NULL,
	"start_date" date NOT NULL,
	"expires_at" date,
	"cancelled_at" timestamp,
	"memo" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "payment_methods" ADD CONSTRAINT "payment_methods_parent_id_payment_methods_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payment_methods"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_methods" ADD CONSTRAINT "payment_methods_bank_account_id_payment_methods_id_fk" FOREIGN KEY ("bank_account_id") REFERENCES "public"."payment_methods"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_payment_method_id_payment_methods_id_fk" FOREIGN KEY ("payment_method_id") REFERENCES "public"."payment_methods"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_address_id_addresses_id_fk" FOREIGN KEY ("address_id") REFERENCES "public"."addresses"("id") ON DELETE no action ON UPDATE no action;