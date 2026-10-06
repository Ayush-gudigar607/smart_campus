ALTER TABLE "users" ADD COLUMN "current_year" integer;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "mobile_number" varchar(20);--> statement-breakpoint
CREATE UNIQUE INDEX "users_mobile_number_unique" ON "users" USING btree ("mobile_number");