DROP INDEX "user_availabilities_user_idx";--> statement-breakpoint
DROP INDEX "session_token_unique";--> statement-breakpoint
DROP INDEX "user_email_unique";--> statement-breakpoint
ALTER TABLE `user_availabilities` ALTER COLUMN "date" TO "date" integer;--> statement-breakpoint
ALTER TABLE `user_availabilities` ALTER COLUMN "start_time" TO "start_time" integer;--> statement-breakpoint
ALTER TABLE `user_availabilities` ALTER COLUMN "end_time" TO "end_time" integer;--> statement-breakpoint
ALTER TABLE `user_availabilities` ADD `interview_date_id` text REFERENCES interview_dates(id);--> statement-breakpoint
CREATE INDEX `user_availabilities_user_idx` ON `user_availabilities` (`user_id`);--> statement-breakpoint
CREATE INDEX `user_availabilities_interview_date_idx` ON `user_availabilities` (`interview_date_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `session_token_unique` ON `session` (`token`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);