CREATE SEQUENCE "request_code_seq" START WITH 1;--> statement-breakpoint
CREATE TYPE "public"."request_status" AS ENUM('pending', 'assigned', 'in_progress', 'completed', 'cancelled');--> statement-breakpoint
CREATE TABLE "requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"request_code" text NOT NULL,
	"student_id" integer NOT NULL,
	"service_id" integer NOT NULL,
	"department_id" integer NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"location" text,
	"priority" "service_priority" DEFAULT 'medium' NOT NULL,
	"status" "request_status" DEFAULT 'pending' NOT NULL,
	"assigned_to" integer,
	"due_at" timestamp with time zone NOT NULL,
	"assigned_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "request_history" (
	"id" serial PRIMARY KEY NOT NULL,
	"request_id" integer NOT NULL,
	"old_status" "request_status",
	"new_status" "request_status" NOT NULL,
	"changed_by" integer NOT NULL,
	"note" text,
	"changed_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "requests" ADD CONSTRAINT "requests_student_id_users_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "requests" ADD CONSTRAINT "requests_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "requests" ADD CONSTRAINT "requests_department_id_departments_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "requests" ADD CONSTRAINT "requests_assigned_to_users_id_fk" FOREIGN KEY ("assigned_to") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "request_history" ADD CONSTRAINT "request_history_request_id_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."requests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "request_history" ADD CONSTRAINT "request_history_changed_by_users_id_fk" FOREIGN KEY ("changed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "requests_code_unique" ON "requests" USING btree ("request_code");--> statement-breakpoint
CREATE INDEX "requests_student_idx" ON "requests" USING btree ("student_id");--> statement-breakpoint
CREATE INDEX "requests_status_idx" ON "requests" USING btree ("status");--> statement-breakpoint
CREATE INDEX "requests_department_idx" ON "requests" USING btree ("department_id");--> statement-breakpoint
CREATE INDEX "requests_created_at_idx" ON "requests" USING btree ("created_at");
