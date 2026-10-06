ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "auto_assign" boolean DEFAULT false NOT NULL;
ALTER TABLE "request_history" ALTER COLUMN "changed_by" DROP NOT NULL;
ALTER TABLE "requests" ADD COLUMN IF NOT EXISTS "escalation_level" integer DEFAULT 0 NOT NULL;
ALTER TABLE "requests" ADD COLUMN IF NOT EXISTS "escalated_at" timestamp with time zone;
CREATE TABLE IF NOT EXISTS "notifications" (
  "id" serial PRIMARY KEY, "user_id" integer NOT NULL REFERENCES "users"("id") ON DELETE cascade,
  "request_id" integer REFERENCES "requests"("id") ON DELETE set null, "type" text NOT NULL,
  "title" text NOT NULL, "message" text NOT NULL, "is_read" boolean DEFAULT false NOT NULL,
  "email_sent_at" timestamp with time zone, "created_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS "notifications_user_read_created_idx" ON "notifications" ("user_id","is_read","created_at");
CREATE INDEX IF NOT EXISTS "requests_escalation_status_idx" ON "requests" ("escalation_level","status");
CREATE INDEX IF NOT EXISTS "requests_assigned_to_status_idx" ON "requests" ("assigned_to","status");
