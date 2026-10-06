ALTER TABLE "requests" ADD COLUMN "reassign_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
CREATE INDEX "requests_assignee_status_idx" ON "requests" USING btree ("assigned_to","status");--> statement-breakpoint
CREATE INDEX "requests_due_at_idx" ON "requests" USING btree ("due_at");