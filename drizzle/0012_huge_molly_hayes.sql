CREATE TABLE `rushee` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phone_number` text,
	`major` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `rushee_email_unique` ON `rushee` (`email`);--> statement-breakpoint
CREATE TABLE `rushee_availabilities` (
	`id` text PRIMARY KEY NOT NULL,
	`rushee_id` text NOT NULL,
	`interview_date_id` text,
	`date` integer,
	`start_time` integer,
	`end_time` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`rushee_id`) REFERENCES `rushee`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`interview_date_id`) REFERENCES `interview_dates`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `rushee_availabilities_rushee_idx` ON `rushee_availabilities` (`rushee_id`);--> statement-breakpoint
CREATE INDEX `rushee_availabilities_interview_date_idx` ON `rushee_availabilities` (`interview_date_id`);