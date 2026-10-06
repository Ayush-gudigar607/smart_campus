CREATE TYPE "public"."service_priority" AS ENUM('low', 'medium', 'high', 'urgent');--> statement-breakpoint
CREATE TABLE "services" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(150) NOT NULL,
	"description" varchar(1000),
	"department_id" integer NOT NULL,
	"sla_hours" integer DEFAULT 48 NOT NULL,
	"default_priority" "service_priority" DEFAULT 'medium' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "departments" ADD COLUMN "description" varchar(500);--> statement-breakpoint
ALTER TABLE "departments" ADD COLUMN "email" varchar(254);--> statement-breakpoint
ALTER TABLE "departments" ADD COLUMN "is_active" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "services" ADD CONSTRAINT "services_department_id_departments_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "services_name_unique" ON "services" USING btree ("name");