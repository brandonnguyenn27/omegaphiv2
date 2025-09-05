CREATE TABLE `interview_assignments` (
	`id` text PRIMARY KEY NOT NULL,
	`rushee_id` text NOT NULL,
	`interview_date_id` text NOT NULL,
	`start_time` integer NOT NULL,
	`end_time` integer NOT NULL,
	`interviewer1_id` text NOT NULL,
	`interviewer2_id` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`rushee_id`) REFERENCES `rushee`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`interview_date_id`) REFERENCES `interview_dates`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`interviewer1_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`interviewer2_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `interview_assignments_rushee_idx` ON `interview_assignments` (`rushee_id`);--> statement-breakpoint
CREATE INDEX `interview_assignments_interview_date_idx` ON `interview_assignments` (`interview_date_id`);--> statement-breakpoint
CREATE INDEX `interview_assignments_interviewer1_idx` ON `interview_assignments` (`interviewer1_id`);--> statement-breakpoint
CREATE INDEX `interview_assignments_interviewer2_idx` ON `interview_assignments` (`interviewer2_id`);