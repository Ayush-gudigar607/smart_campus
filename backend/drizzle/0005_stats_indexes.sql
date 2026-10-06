CREATE INDEX "requests_completed_at_idx" ON "requests" USING btree ("completed_at");--> statement-breakpoint
CREATE INDEX "requests_department_created_at_idx" ON "requests" USING btree ("department_id","created_at");
